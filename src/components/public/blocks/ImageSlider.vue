<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  height: { type: [Number, String], default: 520 },
  maxWidth: { type: String, default: 'full' },
  objectFit: { type: String, default: 'cover' },
  borderRadius: { type: [Number, String], default: 0 },
  autoplay: { type: Boolean, default: true },
  autoplayInterval: { type: Number, default: 5000 },
  showArrows: { type: Boolean, default: true },
  showDots: { type: Boolean, default: true },
  overlay: { type: Boolean, default: true },
  overlayColor: { type: String, default: '#000000' },
  overlayOpacity: { type: Number, default: 40 },
  contentAlignment: { type: String, default: 'left' },
})

const current = ref(0)
let timer

const slides = computed(() =>
  props.images.filter((image) => image?.imageUrl)
)

const heightStyle = computed(() => ({
  height: typeof props.height === 'number'
    ? `${props.height}px`
    : props.height,
}))

const radiusStyle = computed(() => ({
  borderRadius: `${Number(props.borderRadius) || 0}px`,
}))

const contentAlignmentClass = computed(() => ({
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}[props.contentAlignment] || 'items-start text-left'))

function goTo(index) {
  if (!slides.value.length) return
  current.value = (index + slides.value.length) % slides.value.length
}

function startAutoplay() {
  stopAutoplay()

  if (props.autoplay && slides.value.length > 1) {
    timer = setInterval(
      () => goTo(current.value + 1),
      Math.max(1000, props.autoplayInterval || 5000)
    )
  }
}

function stopAutoplay() {
  if (timer) clearInterval(timer)
  timer = undefined
}

watch(
  () => [props.autoplay, props.autoplayInterval, slides.value.length],
  startAutoplay
)

watch(slides, () => {
  if (current.value >= slides.value.length) current.value = 0
})

onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<template>
  <section
    v-if="slides.length"
    class="relative w-full overflow-hidden bg-gray-900"
    :style="[heightStyle, radiusStyle]"
    aria-roledescription="carousel"
  >
    <div
      v-for="(slide, index) in slides"
      :key="`${slide.imageUrl}-${index}`"
      v-show="current === index"
      class="absolute inset-0"
    >
      <img
        :src="slide.imageUrl"
        :alt="slide.alt || slide.title || ''"
        class="h-full w-full"
        :style="{ objectFit }"
      />

      <div
        v-if="overlay"
        class="absolute inset-0"
        :style="{
          backgroundColor: overlayColor,
          opacity: Math.min(100, Math.max(0, overlayOpacity)) / 100,
        }"
      />

      <div
        v-if="slide.title || slide.description || slide.buttonText || title || description"
        class="absolute inset-0 z-10 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-20"
        :class="contentAlignmentClass"
      >
        <div class="max-w-3xl text-white">
          <h1
            v-if="slide.title || title"
            class="text-3xl font-bold tracking-tight sm:text-5xl"
          >
            {{ slide.title || title }}
          </h1>

          <p
            v-if="slide.description || description"
            class="mt-4 text-base leading-relaxed sm:text-xl"
          >
            {{ slide.description || description }}
          </p>

          <a
            v-if="slide.buttonText && slide.buttonUrl"
            :href="slide.buttonUrl"
            class="mt-6 inline-flex rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
            :target="slide.newTab ? '_blank' : undefined"
            :rel="slide.newTab ? 'noopener noreferrer' : undefined"
          >
            {{ slide.buttonText }}
          </a>
        </div>
      </div>
    </div>

    <template v-if="slides.length > 1">
      <button
        v-if="showArrows"
        type="button"
        aria-label="Slide sebelumnya"
        class="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/70"
        @click="goTo(current - 1)"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <button
        v-if="showArrows"
        type="button"
        aria-label="Slide berikutnya"
        class="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/70"
        @click="goTo(current + 1)"
      >
        <span aria-hidden="true">›</span>
      </button>

      <div
        v-if="showDots"
        class="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2"
      >
        <button
          v-for="(_, index) in slides"
          :key="index"
          type="button"
          :aria-label="`Buka slide ${index + 1}`"
          :aria-current="current === index ? 'true' : undefined"
          class="h-2.5 rounded-full transition-all"
          :class="current === index ? 'w-7 bg-white' : 'w-2.5 bg-white/60'"
          @click="goTo(index)"
        />
      </div>
    </template>
  </section>
</template>
