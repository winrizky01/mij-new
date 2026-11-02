<script setup>
import ImageSlider from './blocks/ImageSlider.vue'
import HeroBlock from './blocks/HeroBlock.vue'
import ServicesBlock from './blocks/ServicesBlock.vue'
import ArticlesBlock from './blocks/ArticlesBlock.vue'
import SpacerDivider from './blocks/SpacerDivider.vue'
import TextBlock from './blocks/TextBlock.vue'
import ContactFormBlock from './blocks/ContactFormBlock.vue'  

defineOptions({
  name: 'BlockRenderer',
})

defineProps({
  blocks: {
    type: Array,
    default: () => [],
  },
})

const blockComponents = {
  image_slider: ImageSlider,
  hero: HeroBlock,
  services: ServicesBlock,
  articles: ArticlesBlock,
  spacer_divider: SpacerDivider,
  rich_text: TextBlock,
  contact_form: ContactFormBlock,
}

// Normalisasi data section dan settings API.
function getBlockProps(block) {
  const settings = block.settings ?? {}

  return {
    ...block,
    ...settings,

    title: block.title ?? settings.title ?? '',
    subtitle: block.subtitle ?? settings.subtitle ?? '',

    description:
      block.description ??
      settings.description ??
      '',

    content:
      block.content ??
      settings.content ??
      '',

    eyebrow:
      block.eyebrow ??
      settings.eyebrow ??
      block.subtitle ??
      settings.subtitle ??
      '',

    imageUrl:
      block.imageUrl ??
      settings.imageUrl ??
      settings.image_url ??
      block.image ??
      '',

    imagePosition:
      block.imagePosition ??
      settings.imagePosition ??
      settings.image_position ??
      'right',

    alignment:
      block.alignment ??
      settings.alignment ??
      'left',

    backgroundColor:
      block.backgroundColor ??
      settings.backgroundColor ??
      '#ffffff',

    textColor:
      block.textColor ??
      settings.textColor ??
      '#1f2937',

    slides: block.images ?? settings.slides ?? settings.images ?? [],
    stats: block.stats ?? settings.stats ?? [],

    buttonText:
      block.buttonText ??
      block.button_text ??
      settings.buttonText ??
      settings.button_text ??
      '',

    buttonUrl:
      block.buttonUrl ??
      block.button_url ??
      settings.buttonUrl ??
      settings.button_url ??
      '',

    autoplay: block.autoplay ?? settings.autoplay ?? true,

    autoplayInterval:
      block.autoplayInterval ??
      settings.autoplayInterval ??
      settings.autoplay_interval ??
      6000,

    showDots: block.showDots ?? settings.showDots ?? true,
    showArrows: block.showArrows ?? settings.showArrows ?? true,
    showStats: block.showStats ?? settings.showStats ?? true,
  }
}

function getContainerStyle(settings = {}) {
  return {
    backgroundColor: settings.backgroundColor || 'transparent',
    paddingTop: `${settings.paddingTop ?? 0}px`,
    paddingBottom: `${settings.paddingBottom ?? 0}px`,
  }
}

function getContainerWidth(width) {
  const widths = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  }

  return widths[width] || 'max-w-7xl'
}

function getSettings(block) {
  return block.settings ?? block
}

function getChildren(block) {
  const settings = getSettings(block)

  return Array.isArray(settings.children)
    ? settings.children
    : []
}

function getColumnCount(block) {
  const settings = getSettings(block)

  return Math.max(1, Math.min(6, Number(settings.columns) || 2))
}

function getColumnChildren(block, index) {
  return getChildren(block).filter(child =>
    Number(child.columnIndex ?? 0) === index
  )
}

</script>

<template>
  <template v-for="(block, index) in blocks" :key="block.id ?? `${block.type}-${index}`">
    <template v-if="block.is_active !== false && block.enabled !== false">

      <!-- Container -->
      <section v-if="block.type === 'container'" :style="getContainerStyle(getSettings(block))">
        <div :class="[
          'mx-auto w-full px-5',
          getContainerWidth(getSettings(block).maxWidth),
        ]">
          <div :class="{
            'text-center': getSettings(block).alignment === 'center',
            'text-right': getSettings(block).alignment === 'right',
            'text-left': !['center', 'right'].includes(
              getSettings(block).alignment
            ),
          }">
            <BlockRenderer :blocks="getChildren(block)" />
          </div>
        </div>
      </section>

      <!-- Columns -->
      <section v-else-if="block.type === 'columns'" class="mx-auto w-full max-w-7xl py-8">
        <div
          class="grid grid-cols-1"
          :class="{
            'md:grid-cols-2': getColumnCount(block) >= 2,
            'lg:grid-cols-3': getColumnCount(block) === 3,
            'lg:grid-cols-4': getColumnCount(block) >= 4,
          }" :style="{
          gap: `${getSettings(block).gap ?? 24}px`,
        }">
          <div v-for="index in getColumnCount(block)" :key="index" class="min-w-0">
            <BlockRenderer :blocks="getColumnChildren(block, index - 1)" />
          </div>
        </div>
      </section>

      <!-- Heading -->
      <div v-else-if="block.type === 'heading'" :class="{
        'text-center': block.alignment === 'center',
        'text-right': block.alignment === 'right',
      }">
        <p v-if="block.eyebrow" class="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          {{ block.eyebrow }}
        </p>

        <component :is="`h${Math.min(6, Math.max(1, Number(block.level) || 2))}`"
          class="font-bold tracking-tight text-gray-900" :class="{
            'text-4xl': Number(block.level) === 1,
            'text-3xl': Number(block.level) === 2 || !block.level,
            'text-2xl': Number(block.level) === 3,
            'text-xl': Number(block.level) >= 4,
          }">
          {{ block.title }}
        </component>

        <div class="mt-5 h-1 w-14 rounded-full bg-[#0052cc]"></div>
        
        <p v-if="block.description" class="mt-4 whitespace-pre-line leading-8 text-gray-600">
          {{ block.description }}
        </p>
      </div>

      <!-- Other Components -->
      <component v-else-if="blockComponents[block.type]" :is="blockComponents[block.type]"
        v-bind="getBlockProps(block)" />

    </template>
  </template>
</template>