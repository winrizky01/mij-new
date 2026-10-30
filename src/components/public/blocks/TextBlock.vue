<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  imagePosition: { type: String, default: 'right' },
  alignment: { type: String, default: 'left' },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#1f2937' },
})

const hasImage = computed(() => Boolean(props.imageUrl))

const layoutClass = computed(() =>
  props.imagePosition === 'left'
    ? 'md:flex-row-reverse'
    : 'md:flex-row'
)

const alignmentClass = computed(() => ({
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}[props.alignment] || 'text-left'))
</script>

<template>
  <!-- <section
    class="px-6 py-14 sm:px-10 lg:px-20"
    :style="{ backgroundColor, color: textColor }"
  > -->
  <section
    :style="{ backgroundColor, color: textColor }"
  >
    <div
      class="mx-auto flex max-w-7xl flex-col items-center gap-10"
      :class="hasImage ? layoutClass : ''"
    >
      <div
        class="w-full"
        :class="hasImage ? 'md:w-1/2' : 'max-w-4xl'"
      >
        <p
          v-if="eyebrow"
          class="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-600"
        >
          {{ eyebrow }}
        </p>

        <h2
          v-if="title"
          class="text-2xl font-bold sm:text-3xl"
          :class="alignmentClass"
        >
          {{ title }}
        </h2>

        <p
          v-if="description"
          class="mt-4 text-lg leading-relaxed opacity-80"
          :class="alignmentClass"
        >
          {{ description }}
        </p>

        <div
          v-if="content"
          class="mt-5 whitespace-pre-line leading-8"
          :class="alignmentClass"
        >
          {{ content }}
        </div>
      </div>

      <div
        v-if="hasImage"
        class="w-full md:w-1/2"
      >
        <img
          :src="imageUrl"
          :alt="title || 'Ilustrasi'"
          class="max-h-[520px] w-full rounded-2xl object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>
