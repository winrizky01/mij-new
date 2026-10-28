<template>
    <section
        id="home"
        class="relative isolate flex min-h-[90vh] flex-col justify-center overflow-hidden bg-[#001a4d] text-white"
    >
        
        <!-- Background Image Carousel -->
        <div
            v-if="heroSlides.length > 0"
            class="absolute inset-0 -z-20 overflow-hidden"
        >
            <div
                v-for="(slide, index) in heroSlides"
                :key="index"
                class="absolute inset-0 h-full w-full bg-cover bg-center transition-all duration-1000 ease-in-out"
                :class="
                    currentSlide === index
                        ? 'scale-105 opacity-100'
                        : 'pointer-events-none scale-100 opacity-0'
                "
                :style="{
                    backgroundImage: `url('${slide.bgImage}')`,
                }"
            ></div>
        </div>

        <!-- Gradient Overlay -->
        <div
            class="absolute inset-0 -z-10 bg-gradient-to-r from-[#001a4d]/95 via-[#003d99]/85 to-transparent"
        ></div>

        <div
            class="absolute inset-0 -z-10 bg-gradient-to-t from-[#001a4d] via-transparent to-black/30"
        ></div>

        <!-- Loading -->
        <div
            v-if="loading"
            class="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-36"
        >
            <p class="text-blue-100">Memuat konten...</p>
        </div>

        <!-- Error -->
        <div
            v-else-if="errorMessage"
            class="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-36"
        >
            <p class="text-blue-100">{{ errorMessage }}</p>
        </div>

        <!-- Hero Content -->
        <div
            v-else-if="heroSlides.length > 0"
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
                        class="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100 backdrop-blur-md"
                    >
                        {{ heroSlides[currentSlide].tag }}
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
                        {{ heroSlides[currentSlide].title }}
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
                        class="mt-6 max-w-2xl text-base leading-8 text-blue-50 drop-shadow sm:text-lg"
                    >
                        {{ heroSlides[currentSlide].description }}
                    </p>
                </Transition>

                <!-- CTA -->
                <div class="mt-9 flex flex-col gap-3 sm:flex-row">
                    <a
                        href="#contact"
                        class="inline-flex min-h-14 items-center justify-center rounded-md bg-[#0052cc] px-7 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#003d99] hover:shadow-blue-500/30"
                    >
                        Mulai Konsultasi
                    </a>

                    <a
                        href="#services"
                        class="inline-flex min-h-14 items-center justify-center rounded-md border border-white/80 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/20"
                    >
                        Pelajari Lebih Lanjut
                    </a>
                </div>
            </div>

            <!-- Stats -->
            <div
                class="mt-16 grid grid-cols-2 gap-8 rounded-xl border-t border-white/20 bg-white/5 p-6 pt-9 backdrop-blur-sm sm:grid-cols-4 sm:gap-6"
            >
                <div
                    v-for="stat in stats"
                    :key="stat.value"
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

        <!-- Slide Navigation -->
        <div
            v-if="!loading && !errorMessage && heroSlides.length > 0"
            class="absolute bottom-6 right-6 z-20 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md"
        >
            <button
                v-for="(_, index) in heroSlides"
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
            ></button>
        </div>

    </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { publicApi } from '@/services/api'

const currentSlide  = ref(0)
const heroSlides    = ref([])
const stats         = ref([])
const autoplayInterval = ref(6000)
const loading       = ref(true)
const errorMessage  = ref('')

let slideTimer = null
async function fetchHeroSection() {
    loading.value = true
    errorMessage.value = ''

    try {
        const response = await publicApi.homeSections()
        const sections = response.data?.data ?? []

        const hero = sections.find(
            (section) => section.type === 'image_slider'
        )

        if (!hero) {
            throw new Error(
                'Section Hero belum tersedia atau belum aktif di database.'
            )
        }

        const settings = hero.settings ?? {}

        heroSlides.value = Array.isArray(settings.slides)
            ? settings.slides.map(slide => ({
                tag: slide.tag ?? '',
                title: slide.title ?? '',
                description: slide.description ?? '',
                bgImage: slide.bgImage ?? hero.image ?? '',
            }))
            : []

        stats.value = Array.isArray(settings.stats)
            ? settings.stats.map(stat => ({
                value: stat.value ?? '',
                label: stat.label ?? '',
            }))
            : []

        const interval = Number(settings.autoplay_interval)

        if (Number.isFinite(interval) && interval >= 1000) {
            autoplayInterval.value = interval
        }

        if (heroSlides.value.length === 0) {
            throw new Error(
                'Data slides Hero kosong di database.'
            )
        }

        currentSlide.value = 0
    } catch (error) {
        console.error('Gagal mengambil Hero dari API:', error)

        heroSlides.value = []
        stats.value = []

        errorMessage.value =
            error.response?.data?.message ||
            error.message ||
            'Gagal memuat konten Hero.'
    } finally {
        loading.value = false
    }
}

function nextSlide() {
    if (heroSlides.value.length <= 1) return

    currentSlide.value =
        (currentSlide.value + 1) % heroSlides.value.length
}

function startTimer() {
    if (slideTimer) {
        clearInterval(slideTimer)
        slideTimer = null
    }

    if (heroSlides.value.length > 1) {
        slideTimer = setInterval(
            nextSlide,
            autoplayInterval.value
        )
    }
}

function resetTimer() {
    startTimer()
}

function setSlide(index) {
    if (index < 0 || index >= heroSlides.value.length) return

    currentSlide.value = index
    resetTimer()
}

onMounted(async () => {
    await fetchHeroSection()

    if (heroSlides.value.length > 0) {
        startTimer()
    }
})

onUnmounted(() => {
    if (slideTimer) {
        clearInterval(slideTimer)
        slideTimer = null
    }
})
</script>
