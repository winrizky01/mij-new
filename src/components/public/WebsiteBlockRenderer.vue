<script setup>
import ImageSlider from './blocks/ImageSlider.vue'
import HeroBlock from './blocks/HeroBlock.vue'
import ServicesBlock from './blocks/ServicesBlock.vue'
import ArticlesBlock from './blocks/ArticlesBlock.vue'
import SpacerDivider from './blocks/SpacerDivider.vue'
// Import komponen lain setelah file-nya tersedia:
// import TextBlock from './blocks/TextBlock.vue'
// import ContactBlock from './blocks/ContactBlock.vue'
// import GalleryBlock from './blocks/GalleryBlock.vue'

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
  // text: TextBlock,
  // contact: ContactBlock,
  // gallery: GalleryBlock,
}
</script>

<template>
  <template v-for="(block, index) in blocks" :key="block.id ?? `${block.type}-${index}`">
    <component :is="blockComponents[block.type]" v-if="block.is_active !== false && blockComponents[block.type]"
      v-bind="{ ...block, ...(block.settings ?? {}) }" />
  </template>
</template>
