<script setup>
import { ref } from 'vue'
import {
    Plus,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
} from 'lucide-vue-next'

const title = ref('Solusi Industri Terpercaya')
const subtitle = ref('KUALITAS • INOVASI • KEPERCAYAAN')
const description = ref(
    'Mendukung kebutuhan industri dengan produk berkualitas dan layanan profesional.'
)

const buttonText = ref('Hubungi Kami')
const buttonUrl = ref('#kontak')
const buttonNewTab = ref(false)

const height = ref(520)
const alignment = ref('left')
const overlay = ref(true)
const overlayOpacity = ref(45)
const autoplay = ref(false)
const showArrows = ref(true)
const showDots = ref(true)
const interval = ref(5000)

const currentSlide = ref(0)

const images = ref([
    {
        url: '',
        alt: 'Hero background 1',
        title: '',
        description: '',
    },
])

const stats = ref([
    { value: '10+', label: 'Tahun Pengalaman', description: '' },
    { value: '50+', label: 'Produk Berkualitas', description: '' },
    { value: '100+', label: 'Pelanggan', description: '' },
])

let timer = null

function addImage() {
    images.value.push({
        url: '',
        alt: '',
        title: '',
        description: '',
    })
    currentSlide.value = images.value.length - 1
}

function removeImage(index) {
    images.value.splice(index, 1)
    currentSlide.value = Math.max(
        0,
        Math.min(currentSlide.value, images.value.length - 1)
    )
}

function moveSlide(direction) {
    if (images.value.length < 2) return

    currentSlide.value =
        (currentSlide.value + direction + images.value.length) %
        images.value.length
}

function addStat() {
    stats.value.push({
        value: '0+',
        label: 'Statistik Baru',
        description: '',
    })
}

function removeStat(index) {
    stats.value.splice(index, 1)
}

function chooseLocalImage(index, event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
        alert('Pilih file gambar yang valid.')
        event.target.value = ''
        return
    }

    const reader = new FileReader()

    reader.onload = () => {
        images.value[index].url = String(reader.result || '')
    }

    reader.readAsDataURL(file)
}

function stopAutoplay() {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

function startAutoplay() {
    stopAutoplay()

    if (!autoplay.value || images.value.length < 2) return

    timer = setInterval(() => {
        moveSlide(1)
    }, Math.max(1000, Number(interval.value) || 5000))
}

function handleAutoplayChange() {
    startAutoplay()
}

import { watch, onBeforeUnmount } from 'vue'

watch(
    [autoplay, interval, () => images.value.length],
    startAutoplay
)

onBeforeUnmount(stopAutoplay)
</script>

<template>
    <div class="space-y-6">
        <!-- EDITOR HERO -->
        <section class="space-y-4 rounded-xl border border-slate-200 p-4">
            <h3 class="font-semibold text-slate-800">Konten Hero</h3>

            <div>
                <label class="mb-1 block text-xs font-medium">Subtitle</label>
                <input
                    v-model="subtitle"
                    class="w-full rounded-lg border p-2 text-sm"
                    placeholder="Subtitle"
                />
            </div>

            <div>
                <label class="mb-1 block text-xs font-medium">Judul</label>
                <textarea
                    v-model="title"
                    rows="2"
                    class="w-full rounded-lg border p-2 text-sm"
                    placeholder="Judul utama"
                />
            </div>

            <div>
                <label class="mb-1 block text-xs font-medium">Deskripsi</label>
                <textarea
                    v-model="description"
                    rows="3"
                    class="w-full rounded-lg border p-2 text-sm"
                    placeholder="Deskripsi Hero"
                />
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="mb-1 block text-xs font-medium">Teks tombol</label>
                    <input
                        v-model="buttonText"
                        class="w-full rounded-lg border p-2 text-sm"
                    />
                </div>

                <div>
                    <label class="mb-1 block text-xs font-medium">URL tombol</label>
                    <input
                        v-model="buttonUrl"
                        class="w-full rounded-lg border p-2 text-sm"
                    />
                </div>
            </div>

            <label class="flex items-center gap-2 text-xs">
                <input v-model="buttonNewTab" type="checkbox" />
                Buka tombol di tab baru
            </label>
        </section>

        <!-- GAMBAR DAN SLIDER -->
        <section class="space-y-4 rounded-xl border border-slate-200 p-4">
            <div class="flex items-center justify-between gap-2">
                <div>
                    <h3 class="font-semibold text-slate-800">Gambar Hero</h3>
                    <p class="mt-1 text-xs text-slate-500">
                        Pilih gambar dari komputer. Tidak mengambil data lama.
                    </p>
                </div>

                <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white"
                    @click="addImage"
                >
                    <Plus :size="15" />
                    Tambah
                </button>
            </div>

            <div
                v-for="(image, index) in images"
                :key="index"
                class="space-y-3 rounded-lg bg-slate-50 p-3"
            >
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold">Gambar {{ index + 1 }}</span>

                    <button
                        type="button"
                        class="rounded p-1 text-red-500 hover:bg-red-50"
                        @click="removeImage(index)"
                    >
                        <Trash2 :size="15" />
                    </button>
                </div>

                <div
                    class="relative flex h-32 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-white"
                >
                    <img
                        v-if="image.url"
                        :src="image.url"
                        :alt="image.alt"
                        class="absolute inset-0 h-full w-full object-cover"
                    />

                    <div
                        v-else
                        class="flex flex-col items-center gap-2 text-xs text-slate-400"
                    >
                        <ImageIcon :size="25" />
                        Belum memilih gambar
                    </div>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    class="w-full text-xs"
                    @change="chooseLocalImage(index, $event)"
                />

                <input
                    v-model="image.alt"
                    class="w-full rounded-lg border p-2 text-xs"
                    placeholder="Alt gambar"
                />

                <input
                    v-model="image.title"
                    class="w-full rounded-lg border p-2 text-xs"
                    placeholder="Judul khusus slide (opsional)"
                />

                <textarea
                    v-model="image.description"
                    rows="2"
                    class="w-full rounded-lg border p-2 text-xs"
                    placeholder="Deskripsi khusus slide (opsional)"
                />
            </div>

            <div class="space-y-3 border-t pt-4">
                <label class="flex items-center gap-2 text-xs">
                    <input
                        v-model="autoplay"
                        type="checkbox"
                        @change="handleAutoplayChange"
                    />
                    Slider berganti otomatis
                </label>

                <div>
                    <label class="mb-1 block text-xs">Interval (ms)</label>
                    <input
                        v-model.number="interval"
                        type="number"
                        min="1000"
                        step="500"
                        class="w-full rounded-lg border p-2 text-sm"
                    />
                </div>

                <label class="flex items-center gap-2 text-xs">
                    <input v-model="showArrows" type="checkbox" />
                    Tampilkan panah
                </label>

                <label class="flex items-center gap-2 text-xs">
                    <input v-model="showDots" type="checkbox" />
                    Tampilkan indikator
                </label>
            </div>
        </section>

        <!-- PENGATURAN TAMPILAN -->
        <section class="space-y-4 rounded-xl border border-slate-200 p-4">
            <h3 class="font-semibold text-slate-800">Tampilan</h3>

            <div>
                <label class="mb-1 block text-xs">Tinggi (px)</label>
                <input
                    v-model.number="height"
                    type="number"
                    min="300"
                    class="w-full rounded-lg border p-2 text-sm"
                />
            </div>

            <div>
                <label class="mb-1 block text-xs">Posisi konten</label>
                <select
                    v-model="alignment"
                    class="w-full rounded-lg border p-2 text-sm"
                >
                    <option value="left">Kiri</option>
                    <option value="center">Tengah</option>
                    <option value="right">Kanan</option>
                </select>
            </div>

            <label class="flex items-center gap-2 text-xs">
                <input v-model="overlay" type="checkbox" />
                Overlay gelap
            </label>

            <div>
                <label class="mb-1 block text-xs">Kegelapan overlay (%)</label>
                <input
                    v-model.number="overlayOpacity"
                    type="range"
                    min="0"
                    max="100"
                    class="w-full"
                />
                <p class="text-xs text-slate-500">{{ overlayOpacity }}%</p>
            </div>
        </section>

        <!-- STATISTIK -->
        <section class="space-y-4 rounded-xl border border-slate-200 p-4">
            <div class="flex items-center justify-between">
                <h3 class="font-semibold text-slate-800">Statistik</h3>

                <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs"
                    @click="addStat"
                >
                    <Plus :size="14" />
                    Tambah
                </button>
            </div>

            <div
                v-for="(stat, index) in stats"
                :key="index"
                class="space-y-2 rounded-lg bg-slate-50 p-3"
            >
                <div class="flex justify-end">
                    <button
                        type="button"
                        class="text-red-500"
                        @click="removeStat(index)"
                    >
                        <Trash2 :size="15" />
                    </button>
                </div>

                <input
                    v-model="stat.value"
                    class="w-full rounded-lg border p-2 text-sm"
                    placeholder="Nilai, mis. 10+"
                />

                <input
                    v-model="stat.label"
                    class="w-full rounded-lg border p-2 text-sm"
                    placeholder="Label statistik"
                />

                <input
                    v-model="stat.description"
                    class="w-full rounded-lg border p-2 text-sm"
                    placeholder="Deskripsi opsional"
                />
            </div>
        </section>

        <!-- LIVE PREVIEW -->
        <section class="overflow-hidden rounded-xl border border-slate-200">
            <div class="border-b bg-slate-50 p-3">
                <h3 class="text-sm font-semibold">Preview Hero</h3>
            </div>

            <div
                class="relative flex flex-col justify-center overflow-hidden bg-slate-900 text-white"
                :style="{ minHeight: `${Math.max(300, height || 520)}px` }"
            >
                <img
                    v-if="images[currentSlide]?.url"
                    :key="images[currentSlide].url"
                    :src="images[currentSlide].url"
                    :alt="images[currentSlide].alt"
                    class="absolute inset-0 h-full w-full object-cover"
                />

                <div
                    v-else
                    class="absolute inset-0 bg-gradient-to-r from-slate-950 to-slate-700"
                />

                <div
                    v-if="overlay"
                    class="absolute inset-0 bg-black"
                    :style="{ opacity: Math.max(0, Math.min(100, overlayOpacity)) / 100 }"
                />

                <div
                    class="relative z-10 flex flex-col p-7 sm:p-10"
                    :class="{
                        'items-center text-center': alignment === 'center',
                        'items-end text-right': alignment === 'right',
                        'items-start text-left': alignment === 'left',
                    }"
                >
                    <p class="mb-3 text-xs font-bold uppercase tracking-widest text-sky-300">
                        {{ images[currentSlide]?.subtitle || subtitle }}
                    </p>

                    <h2 class="max-w-3xl text-3xl font-bold sm:text-4xl">
                        {{ images[currentSlide]?.title || title }}
                    </h2>

                    <p class="mt-4 max-w-2xl whitespace-pre-line text-sm leading-6 text-white/90">
                        {{ images[currentSlide]?.description || description }}
                    </p>

                    <a
                        v-if="buttonText"
                        :href="buttonUrl || '#'"
                        :target="buttonNewTab ? '_blank' : undefined"
                        :rel="buttonNewTab ? 'noopener noreferrer' : undefined"
                        class="mt-6 inline-flex rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white"
                    >
                        {{ buttonText }}
                    </a>
                </div>

                <button
                    v-if="showArrows && images.length > 1"
                    type="button"
                    aria-label="Slide sebelumnya"
                    class="absolute left-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50"
                    @click="moveSlide(-1)"
                >
                    <ChevronLeft :size="20" />
                </button>

                <button
                    v-if="showArrows && images.length > 1"
                    type="button"
                    aria-label="Slide berikutnya"
                    class="absolute right-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50"
                    @click="moveSlide(1)"
                >
                    <ChevronRight :size="20" />
                </button>

                <div
                    v-if="stats.length"
                    class="relative z-10 mt-auto grid grid-cols-2 gap-4 border-t border-white/20 bg-black/20 px-6 py-5 sm:grid-cols-3"
                >
                    <div v-for="(stat, index) in stats" :key="index">
                        <p class="text-2xl font-bold">{{ stat.value }}</p>
                        <p class="mt-1 text-sm font-semibold">{{ stat.label }}</p>
                        <p v-if="stat.description" class="mt-1 text-xs text-white/70">
                            {{ stat.description }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="showDots && images.length > 1"
                    class="relative z-20 flex justify-center gap-2 bg-black/20 py-3"
                >
                    <button
                        v-for="(_, index) in images"
                        :key="index"
                        type="button"
                        :aria-label="`Tampilkan slide ${index + 1}`"
                        class="h-2.5 rounded-full transition-all"
                        :class="currentSlide === index ? 'w-7 bg-white' : 'w-2.5 bg-white/50'"
                        @click="currentSlide = index"
                    />
                </div>
            </div>
        </section>
    </div>
</template>
