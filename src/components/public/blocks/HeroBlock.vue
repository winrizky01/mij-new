<template>
    <section
        id="home"
        class="relative isolate flex min-h-[90vh] flex-col justify-center overflow-hidden bg-[#001a4d] text-white"
    >
        <!-- Background Image Carousel -->
        <div
            v-if="slides.length"
            class="absolute inset-0 -z-20 overflow-hidden"
        >
            <div
                v-for="(slide, index) in slides"
                :key="index"
                class="absolute inset-0 h-full w-full bg-cover bg-center transition-all duration-1000 ease-in-out"
                :class="
                    currentSlide === index
                        ? 'scale-105 opacity-100'
                        : 'pointer-events-none scale-100 opacity-0'
                "
                :style="{
                    backgroundImage: slide.bgImage
                        ? `url('${slide.bgImage}')`
                        : 'none',
                }"
            />
        </div>

        <!-- Gradient Overlay -->
        <div
            class="absolute inset-0 -z-10 bg-gradient-to-r from-[#001a4d]/95 via-[#003d99]/85 to-transparent"
        />

        <div
            class="absolute inset-0 -z-10 bg-gradient-to-t from-[#001a4d] via-transparent to-black/30"
        />

        <!-- Hero Content -->
        <div
            v-if="slides.length"
            class="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-36"
        >
            <div class="max-w-3xl">
                <!-- Tag -->
                <Transition
                    mode="out-in"
                    enter-active-class="transition duration-500 ease-out"
                    enter-from-class="translate-y-4 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-300 ease-in"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="-translate-y-4 opacity-0"
                >
                    <p
                        :key="`tag-${currentSlide}`"
                        v-if="activeSlide.tag"
                        class="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100 backdrop-blur-md"
                    >
                        {{ activeSlide.tag }}
                    </p>
                </Transition>

                <!-- Headline -->
                <Transition
                    mode="out-in"
                    enter-active-class="delay-100 transition duration-700 ease-out"
                    enter-from-class="translate-y-6 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-300 ease-in"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="-translate-y-6 opacity-0"
                >
                    <h1
                        :key="`title-${currentSlide}`"
                        class="text-4xl font-bold leading-tight tracking-tight drop-shadow-md sm:text-5xl lg:text-6xl"
                    >
                        {{ activeSlide.title }}
                    </h1>
                </Transition>

                <!-- Description -->
                <Transition
                    mode="out-in"
                    enter-active-class="delay-200 transition duration-700 ease-out"
                    enter-from-class="translate-y-6 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-300 ease-in"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="-translate-y-6 opacity-0"
                >
                    <p
                        :key="`description-${currentSlide}`"
                        v-if="activeSlide.description"
                        class="mt-6 max-w-2xl text-base leading-8 text-blue-50 drop-shadow sm:text-lg"
                    >
                        {{ activeSlide.description }}
                    </p>
                </Transition>

                <!-- CTA -->
                <div
                    v-if="showPrimaryButton || showSecondaryButton"
                    class="mt-9 flex flex-col gap-3 sm:flex-row"
                >
                    <a
                        v-if="showPrimaryButton"
                        :href="primaryButtonUrl"
                        class="inline-flex min-h-14 items-center justify-center rounded-md bg-[#0052cc] px-7 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#003d99] hover:shadow-blue-500/30"
                        :target="primaryButtonNewTab ? '_blank' : undefined"
                        :rel="primaryButtonNewTab ? 'noopener noreferrer' : undefined"
                    >
                        {{ primaryButtonText }}
                    </a>

                    <!-- <a
                        v-if="showSecondaryButton"
                        :href="secondaryButtonUrl"
                        class="inline-flex min-h-14 items-center justify-center rounded-md border border-white/80 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/20"
                        :target="secondaryButtonNewTab ? '_blank' : undefined"
                        :rel="secondaryButtonNewTab ? 'noopener noreferrer' : undefined"
                    >
                        {{ secondaryButtonText }}
                    </a> -->
                </div>
            </div>

            <!-- Statistics -->
            <div
                v-if="showStats && stats.length"
                class="mt-16 grid grid-cols-2 gap-8 rounded-xl border-t border-white/20 bg-white/5 p-6 pt-9 backdrop-blur-sm sm:grid-cols-4 sm:gap-6"
            >
                <div
                    v-for="(stat, index) in stats"
                    :key="`${stat.label}-${index}`"
                    class="transform transition duration-300 hover:scale-105"
                >
                    <p class="text-3xl font-bold text-white sm:text-4xl">
                        {{ stat.value }}
                    </p>

                    <p class="mt-2 text-xs leading-6 text-blue-100 sm:text-sm">
                        {{ stat.label }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div
            v-else
            class="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32"
        >
            <p class="text-blue-100">
                Konten Hero belum dikonfigurasi.
            </p>
        </div>

        <!-- Slide Navigation -->
        <div
            v-if="showDots && slides.length > 1"
            class="absolute bottom-6 right-6 z-20 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md"
        >
            <button
                v-for="(_, index) in slides"
                :key="index"
                type="button"
                @click="setSlide(index)"
                class="group relative h-2 rounded-full transition-all duration-300"
                :class="
                    currentSlide === index
                        ? 'w-8 bg-[#0052cc]'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                "
                :aria-label="`Slide ${index + 1}`"
                :aria-current="currentSlide === index ? 'true' : undefined"
            />
        </div>
    </section>
</template>

<script setup>
import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from 'vue'

const props = defineProps({
    // Mendukung format blok Website Builder:
    // { type: 'hero', settings: { slides: [...] } }
    settings: {
        type: Object,
        default: () => ({}),
    },

    // Props langsung juga didukung jika renderer mengirimkannya.
    slides: {
        type: Array,
        default: null,
    },
    stats: {
        type: Array,
        default: null,
    },

    title: {
        type: String,
        default: '',
    },
    eyebrow: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    imageUrl: {
        type: String,
        default: '',
    },
    backgroundImage: {
        type: String,
        default: '',
    },

    buttonText: {
        type: String,
        default: 'Mulai Konsultasi',
    },
    buttonUrl: {
        type: String,
        default: '#contact',
    },
    secondaryButtonText: {
        type: String,
        default: 'Pelajari Lebih Lanjut',
    },
    secondaryButtonUrl: {
        type: String,
        default: '#services',
    },

    autoplay: {
        type: Boolean,
        default: true,
    },
    autoplayInterval: {
        type: Number,
        default: 6000,
    },
    showDots: {
        type: Boolean,
        default: true,
    },
    showStats: {
        type: Boolean,
        default: true,
    },
    primaryButtonNewTab: {
        type: Boolean,
        default: false,
    },
    secondaryButtonNewTab: {
        type: Boolean,
        default: false,
    },
})

const currentSlide = ref(0)
let slideTimer = null

const settings = computed(() => props.settings ?? {})

const slides = computed(() => {
    const source =
        props.slides ??
        settings.value.slides ??
        settings.value.images

    // Format slider dari Website Builder
    if (Array.isArray(source) && source.length) {
        return source.map((slide) => ({
            tag:
                slide.tag ??
                slide.subtitle ??
                settings.value.subtitle ??
                props.eyebrow ??
                '',

            title:
                slide.title ??
                settings.value.title ??
                props.title ??
                '',

            description:
                slide.description ??
                settings.value.description ??
                settings.value.content ??
                props.description ??
                '',

            bgImage:
                slide.bgImage ??
                slide.imageUrl ??
                slide.image_url ??
                slide.image ??
                '',

            buttonText:
                slide.buttonText ?? null,

            buttonUrl:
                slide.buttonUrl ?? null,

            newTab:
                slide.newTab ?? false,
        }))
    }

    // Fallback single hero
    const title =
        props.title ||
        settings.value.title ||
        ''

    const description =
        props.description ||
        settings.value.description ||
        settings.value.content ||
        ''

    const image =
        props.imageUrl ||
        props.backgroundImage ||
        settings.value.imageUrl ||
        settings.value.backgroundImage ||
        settings.value.image ||
        ''

    if (!title && !description && !image) {
        return []
    }

    return [{
        tag: props.eyebrow || settings.value.subtitle || '',
        title,
        description,
        bgImage: image,
    }]
})

const activeSlide = computed(() => {
    return slides.value[currentSlide.value] ?? {
        tag: '',
        title: '',
        description: '',
        bgImage: '',
    }
})

const stats = computed(() => {
    const source = props.stats ?? settings.value.stats

    return Array.isArray(source) ? source : []
})

const autoplayInterval = computed(() => {
    const value =
        Number(
            props.autoplayInterval !== 6000
                ? props.autoplayInterval
                : settings.value.autoplay_interval ??
                  settings.value.autoplayInterval ??
                  props.autoplayInterval
        )

    return Number.isFinite(value) && value >= 1000
        ? value
        : 6000
})

const primaryButtonText = computed(() =>
    settings.value.primary_button_text ??
    settings.value.buttonText ??
    props.buttonText
)

const primaryButtonUrl = computed(() =>
    settings.value.primary_button_url ??
    settings.value.buttonUrl ??
    props.buttonUrl
)

const secondaryButtonText = computed(() =>
    settings.value.secondary_button_text ??
    props.secondaryButtonText
)

const secondaryButtonUrl = computed(() =>
    settings.value.secondary_button_url ??
    props.secondaryButtonUrl
)

const showPrimaryButton = computed(() =>
    Boolean(primaryButtonText.value && primaryButtonUrl.value)
)

const showSecondaryButton = computed(() =>
    Boolean(secondaryButtonText.value && secondaryButtonUrl.value)
)

function nextSlide() {
    if (slides.value.length <= 1) return

    currentSlide.value =
        (currentSlide.value + 1) % slides.value.length
}

function setSlide(index) {
    if (index < 0 || index >= slides.value.length) return

    currentSlide.value = index
    startTimer()
}

function startTimer() {
    if (slideTimer) {
        clearInterval(slideTimer)
        slideTimer = null
    }

    if (
        props.autoplay &&
        slides.value.length > 1
    ) {
        slideTimer = setInterval(
            nextSlide,
            autoplayInterval.value
        )
    }
}

watch(
    () => [
        slides.value.length,
        props.autoplay,
        autoplayInterval.value,
    ],
    () => {
        if (currentSlide.value >= slides.value.length) {
            currentSlide.value = 0
        }

        startTimer()
    }
)

onMounted(startTimer)

onUnmounted(() => {
    if (slideTimer) {
        clearInterval(slideTimer)
        slideTimer = null
    }
})
</script>
