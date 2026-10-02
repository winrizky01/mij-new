<template>
    <section
        id="home"
        class="relative isolate flex min-h-[90vh] flex-col justify-center overflow-hidden bg-[#001a4d] text-white"
    >
        <!-- Background Image Carousel -->
        <div class="absolute inset-0 -z-20 overflow-hidden">
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

                    <p
                        class="mt-2 text-xs leading-6 text-blue-100 sm:text-sm"
                    >
                        {{ stat.label }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Slide Navigation -->
        <div
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
            />
        </div>
    </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const currentSlide = ref(0)

let slideTimer = null

const heroSlides = [
    {
        tag: 'Manunggal Jasa Investindo',
        title: 'Solusi Bisnis Terpadu untuk Kesuksesan Anda',
        description:
            'Mitra terpercaya Anda dalam layanan trucking, software development, aplikasi mobile, dan digital marketing terintegrasi.',
        bgImage:
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80',
    },
    {
        tag: 'Digital & Technology',
        title: 'Transformasi Digital Berkelanjutan',
        description:
            'Pengembangan software custom, aplikasi mobile modern, dan sistem informasi enterprise untuk efisiensi bisnis Anda.',
        bgImage:
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=80',
    },
    {
        tag: 'Integrated Services',
        title: 'Jaringan Logistik & Pemasaran Terluas',
        description:
            'Dukungan armada modern siap kirim ke seluruh nusantara dipadukan dengan strategi digital marketing yang terukur.',
        bgImage:
            'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80',
    },
]

const stats = [
    {
        value: '1957',
        label: 'Tahun berdiri (cikal bakal)',
    },
    {
        value: '500+',
        label: 'Klien terpercaya',
    },
    {
        value: '100+',
        label: 'Proyek sukses',
    },
    {
        value: '4',
        label: 'Layanan utama',
    },
]

function nextSlide() {
    currentSlide.value =
        (currentSlide.value + 1) % heroSlides.length
}

function startTimer() {
    slideTimer = setInterval(nextSlide, 6000)
}

function resetTimer() {
    if (slideTimer) {
        clearInterval(slideTimer)
    }

    startTimer()
}

function setSlide(index) {
    currentSlide.value = index
    resetTimer()
}

onMounted(() => {
    startTimer()
})

onUnmounted(() => {
    if (slideTimer) {
        clearInterval(slideTimer)
    }
})
</script>