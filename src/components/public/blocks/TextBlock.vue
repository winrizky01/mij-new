<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

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

const safeContent = computed(() =>
  DOMPurify.sanitize(props.content || '')
)
</script>

<template>
  <section :style="{ backgroundColor, color: textColor }">
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
          class="rich-text-content mt-5 leading-8"
          :class="alignmentClass"
          v-html="safeContent"
        />
      </div>

      <div v-if="hasImage" class="w-full md:w-1/2">
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

<style scoped>
.rich-text-content :deep(p) {
  margin-bottom: 1rem;
}

.rich-text-content :deep(h1),
.rich-text-content :deep(h2),
.rich-text-content :deep(h3) {
  font-weight: 700;
  line-height: 1.3;
  margin: 1.25rem 0 0.75rem;
}

.rich-text-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.rich-text-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.rich-text-content :deep(li) {
  margin-bottom: 0.4rem;
}

.rich-text-content :deep(a) {
  color: #0284c7;
  text-decoration: underline;
}

.rich-text-content :deep(blockquote) {
  border-left: 4px solid #14a2d8;
  padding-left: 1rem;
  margin: 1rem 0;
  opacity: 0.8;
}

.rich-text-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
}
</style>
