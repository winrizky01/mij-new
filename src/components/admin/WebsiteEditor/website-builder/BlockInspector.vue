<script setup>
import { computed, ref, watch } from 'vue'
import api from '@/services/api'
import {
    Settings2,
    Type,
    Palette,
    AlignLeft,
    Trash2,
    X,
} from 'lucide-vue-next'

import MediaLibrary from '../../MediaLibraryModal.vue'

const props = defineProps({
    section: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'update-section',
    'delete',
    'close',
])


const articles = ref([])
const articlesLoading = ref(false)
const articlesError = ref('')
let articlesRequestId = 0

const isArticles = computed(() =>
    props.section?.type === 'articles'
)

const selectedArticleIds = computed(() =>
    Array.isArray(props.section?.article_ids)
        ? props.section.article_ids.map(String)
        : []
)

function normalizeArticles(response) {
    const body = response?.data ?? response
    const collection = body?.data ?? body

    if (Array.isArray(collection)) return collection

    if (Array.isArray(collection?.data)) {
        return collection.data
    }

    if (Array.isArray(collection?.articles)) {
        return collection.articles
    }

    return []
}

async function fetchArticles() {
    const requestId = ++articlesRequestId

    if (!isArticles.value) {
        articles.value = []
        articlesLoading.value = false
        articlesError.value = ''
        return
    }

    articlesLoading.value = true
    articlesError.value = ''

    try {
        const response = await api.get('/website/articles')

        console.log('HTTP status:', response.status)
        console.log('Respons API artikel:', response.data)

        if (requestId !== articlesRequestId) return

        articles.value = normalizeArticles(response.data)
        console.log('Artikel setelah normalisasi:', articles.value)
    } catch (error) {
        console.error('Gagal mengambil artikel:', error)
        console.error('Respons error:', error.response?.data)

        if (requestId !== articlesRequestId) return

        articlesError.value =
            error.response?.data?.message ||
            'Gagal mengambil daftar artikel dari server.'
    } finally {
        if (requestId === articlesRequestId) {
            articlesLoading.value = false
        }
    }
}

function toggleArticle(articleId, checked) {
    const id = String(articleId)
    const current = selectedArticleIds.value

    const next = checked
        ? [...new Set([...current, id])]
        : current.filter(item => item !== id)

    update('article_ids', next)
}

watch(
    () => [
        props.section?.id,
        props.section?.type,
    ],
    fetchArticles,
    { immediate: true },
)

const mediaLibraryOpen = ref(false)
const activeSlideIndex = ref(null)

function openMediaLibrary(index) {
    activeSlideIndex.value = index
    mediaLibraryOpen.value = true
}

function handleMediaSelected(item) {
    const index = activeSlideIndex.value

    if (
        index === null ||
        !item?.url ||
        !sliderImages.value[index]
    ) {
        return
    }

    const images = sliderImages.value.map((slide, i) => {
        const current = typeof slide === 'string'
            ? { imageUrl: slide }
            : { ...slide }

        if (i !== index) return current

        return {
            ...current,
            imageUrl: item.url,
            alt: current.alt || item.alt || '',
        }
    })

    update('images', images)

    activeSlideIndex.value = null
    mediaLibraryOpen.value = false
}

const isDynamic = computed(() =>
    ['services', 'articles', 'statistics', 'contact_info'].includes(
        props.section?.type,
    )
)

const isInteractive = computed(() =>
    ['faq', 'tabs', 'contact_form', 'whatsapp', 'map_video'].includes(
        props.section?.type,
    )
)

const isColumns = computed(() => props.section?.type === 'columns')

const isHero = computed(() =>
    props.section?.type === 'hero'
)

const isImageSlider = computed(() =>
    props.section?.type === 'image_slider'
)

const supportsSlides = computed(() =>
    ['hero', 'image_slider'].includes(props.section?.type)
)

const heroStats = computed(() =>
    Array.isArray(props.section?.stats)
        ? props.section.stats
        : []
)

const sliderImages = computed(() =>
    Array.isArray(props.section?.images)
        ? props.section.images
        : []
)

function updateSliderImage(index, field, value) {
    const images = sliderImages.value.map((item, i) => {
        const image = typeof item === 'string'
            ? { imageUrl: item }
            : { ...item }

        return i === index
            ? { ...image, [field]: value }
            : image
    })

    update('images', images)
}

function addSliderImage() {
    update('images', [
        ...sliderImages.value,
        {
            imageUrl: '',
            alt: '',
            title: '',
            description: '',
            buttonText: '',
            buttonUrl: '',
            newTab: false,
        },
    ])
}

function removeSliderImage(index) {
    update(
        'images',
        sliderImages.value.filter((_, i) => i !== index)
    )
}

const columnCount = computed(() =>
    Math.max(1, Math.min(6, Number(props.section?.columns) || 2))
)

const backgroundOptions = [
    { value: 'white', label: 'Putih', color: '#ffffff' },
    { value: 'light', label: 'Abu-abu muda', color: '#f3f7fa' },
    { value: 'brand', label: 'Biru MJI', color: '#14a2d8' },
    { value: 'dark', label: 'Gelap', color: '#0f172a' },
]

function update(field, value) {
    if (!props.section) return

    emit('update-section', {
        id: props.section.id,
        patch: { [field]: value },
    })
}

function updateNumber(field, value) {
    update(field, Number(value))
}
</script>

<template>
    <aside class="flex h-full min-h-0 flex-col bg-white">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div class="flex items-center gap-2">
                <Settings2 :size="18" class="text-slate-500" />
                <div>
                    <h2 class="text-sm font-bold text-slate-900">
                        Pengaturan Blok
                    </h2>
                    <p class="mt-0.5 text-[10px] text-slate-500">
                        Atur konten dan tampilan
                    </p>
                </div>
            </div>

            <button
                type="button"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                title="Tutup panel"
                aria-label="Tutup panel"
                @click="emit('close')"
            >
                <X :size="17" />
            </button>
        </div>

        <div
            v-if="!section"
            class="flex flex-1 flex-col items-center justify-center px-6 text-center"
        >
            <Settings2 :size="30" class="text-slate-300" />
            <p class="mt-3 text-sm font-semibold text-slate-700">
                Belum ada blok dipilih
            </p>
            <p class="mt-1 text-xs leading-5 text-slate-500">
                Pilih blok pada preview atau struktur halaman untuk mengubah pengaturannya.
            </p>
        </div>

        <template v-else>
            <div class="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
                <!-- Identitas blok -->
                <section class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Type :size="15" class="text-sky-600" />
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Identitas
                        </h3>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Nama blok
                        </label>
                        <input
                            :value="section.name"
                            type="text"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="Nama blok"
                            @input="update('name', $event.target.value)"
                        />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Tipe blok
                        </label>
                        <div class="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                            {{ section.type }}
                        </div>
                    </div>

                    <label class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-3">
                        <span>
                            <span class="block text-xs font-semibold text-slate-700">
                                Tampilkan blok
                            </span>
                            <span class="mt-1 block text-[10px] text-slate-500">
                                Nonaktifkan untuk menyembunyikan blok.
                            </span>
                        </span>

                        <input
                            type="checkbox"
                            :checked="section.enabled !== false"
                            class="size-4 accent-[#14a2d8]"
                            @change="update('enabled', $event.target.checked)"
                        />
                    </label>
                </section>

                <div class="border-t border-slate-100" />

                <!-- Konten -->
                <section class="space-y-3">
                    <div class="flex items-center gap-2">
                        <AlignLeft :size="15" class="text-sky-600" />
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Konten
                        </h3>
                    </div>

                    <div
                        v-if="['services', 'articles', 'statistics', 'contact_info', 'faq', 'tabs', 'contact_form', 'whatsapp', 'map_video', 'heading', 'rich_text'].includes(section.type)"
                    >
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Eyebrow / Label kecil
                        </label>
                        <input
                            :value="section.eyebrow || ''"
                            type="text"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="Contoh: TENTANG MJI"
                            @input="update('eyebrow', $event.target.value)"
                        />
                    </div>

                    <div
                        v-if="!['spacer_divider', 'image', 'gallery'].includes(section.type)"
                    >
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Judul
                        </label>
                        <textarea
                            :value="section.title || ''"
                            rows="3"
                            class="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="Masukkan judul blok"
                            @input="update('title', $event.target.value)"
                        />
                    </div>

                    <div
                        v-if="!['spacer_divider', 'image', 'gallery', 'button'].includes(section.type)"
                    >
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Deskripsi
                        </label>
                        <textarea
                            :value="section.description || ''"
                            rows="4"
                            class="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm leading-5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="Masukkan deskripsi atau konten"
                            @input="update('description', $event.target.value)"
                        />
                    </div>

                    <!-- HERO SETTINGS -->
                    <template v-if="isHero">
                        <div class="space-y-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
                            <h4 class="text-xs font-bold text-slate-800">
                                Pengaturan Hero
                            </h4>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Subtitle / Eyebrow
                                </label>
                                <input
                                    :value="section.subtitle || ''"
                                    type="text"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    placeholder="Solusi Industri Terpercaya"
                                    @input="update('subtitle', $event.target.value)"
                                />
                            </div>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Teks Tombol
                                </label>
                                <input
                                    :value="section.buttonText || ''"
                                    type="text"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    placeholder="Hubungi Kami"
                                    @input="update('buttonText', $event.target.value)"
                                />
                            </div>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    URL Tombol
                                </label>
                                <input
                                    :value="section.buttonUrl || ''"
                                    type="text"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    placeholder="/kontak"
                                    @input="update('buttonUrl', $event.target.value)"
                                />
                            </div>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Tinggi Hero (px)
                                </label>
                                <input
                                    :value="section.height ?? 520"
                                    type="number"
                                    min="180"
                                    max="1200"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    @input="updateNumber('height', $event.target.value)"
                                />
                            </div>
                        </div>

                        <!-- Statistik Hero -->
                        <div class="space-y-3 rounded-xl border border-slate-200 p-3">
                            <div class="flex items-center justify-between">
                                <h4 class="text-xs font-bold text-slate-800">
                                    Statistik Hero
                                </h4>

                                <button
                                    type="button"
                                    class="text-xs font-semibold text-sky-700"
                                    @click="update('stats', [
                                        ...heroStats,
                                        { value: '', label: '' }
                                    ])"
                                >
                                    + Tambah
                                </button>
                            </div>

                            <div
                                v-for="(stat, index) in heroStats"
                                :key="index"
                                class="space-y-2 rounded-lg border border-slate-200 p-3"
                            >
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-semibold text-slate-600">
                                        Statistik {{ index + 1 }}
                                    </span>

                                    <button
                                        type="button"
                                        class="text-xs text-rose-600"
                                        @click="update(
                                            'stats',
                                            heroStats.filter((_, i) => i !== index)
                                        )"
                                    >
                                        Hapus
                                    </button>
                                </div>

                                <input
                                    :value="stat.value || ''"
                                    type="text"
                                    placeholder="Nilai, misalnya 10+"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    @input="update('stats', heroStats.map((item, i) =>
                                        i === index
                                            ? { ...item, value: $event.target.value }
                                            : item
                                    ))"
                                />

                                <input
                                    :value="stat.label || ''"
                                    type="text"
                                    placeholder="Label, misalnya Tahun Pengalaman"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    @input="update('stats', heroStats.map((item, i) =>
                                        i === index
                                            ? { ...item, label: $event.target.value }
                                            : item
                                    ))"
                                />
                            </div>
                        </div>
                    </template>

                    <!-- Image Slider Settings -->
                    <template v-if="supportsSlides">
                        <div class="space-y-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
                            <div class="flex items-center justify-between">
                                <h4 class="text-xs font-bold text-slate-800">
                                    Daftar Slide
                                </h4>
                                <span class="text-[10px] text-slate-500">
                                    {{ sliderImages.length }} gambar
                                </span>
                            </div>

                            <div
                                v-for="(image, index) in sliderImages"
                                :key="index"
                                class="space-y-3 rounded-lg border border-slate-200 bg-white p-3"
                            >
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-semibold text-slate-700">
                                        Slide {{ index + 1 }}
                                    </span>

                                    <button
                                        v-if="sliderImages.length > 1"
                                        type="button"
                                        class="text-[10px] font-medium text-rose-600 hover:text-rose-700"
                                        @click="removeSliderImage(index)"
                                    >
                                        Hapus
                                    </button>
                                </div>
                                
                                <div>
                                    <label class="mb-1 block text-[11px] font-medium text-slate-600">
                                        Gambar Slide
                                    </label>

                                    <div
                                        v-if="typeof image !== 'string' && (image.imageUrl || image.url)"
                                        class="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                                    >
                                        <img
                                            :src="image.imageUrl || image.url"
                                            :alt="image.alt || ''"
                                            class="h-32 w-full object-contain"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        class="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                        @click="openMediaLibrary(index)"
                                    >
                                        <span>▧</span>
                                        Pilih dari Media Library
                                    </button>

                                    <input
                                        :value="typeof image === 'string' ? image : image.imageUrl || image.url || ''"
                                        type="url"
                                        placeholder="Atau masukkan URL gambar manual"
                                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400"
                                        @input="updateSliderImage(index, 'imageUrl', $event.target.value)"
                                    />
                                </div>

                                <div>
                                    <label class="mb-1 block text-[11px] font-medium text-slate-600">
                                        Teks alternatif gambar
                                    </label>
                                    <input
                                        :value="typeof image === 'string' ? '' : image.alt || ''"
                                        type="text"
                                        placeholder="Deskripsi gambar"
                                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400"
                                        @input="updateSliderImage(index, 'alt', $event.target.value)"
                                    />
                                </div>

                                <div>
                                    <label class="mb-1 block text-[11px] font-medium text-slate-600">
                                        Judul Slide
                                    </label>
                                    <input
                                        :value="typeof image === 'string' ? '' : image.title || ''"
                                        type="text"
                                        placeholder="Contoh: Solusi Perekat Industri"
                                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400"
                                        @input="updateSliderImage(index, 'title', $event.target.value)"
                                    />
                                </div>

                                <div>
                                    <label class="mb-1 block text-[11px] font-medium text-slate-600">
                                        Deskripsi Slide
                                    </label>
                                    <textarea
                                        :value="typeof image === 'string' ? '' : image.description || ''"
                                        rows="3"
                                        placeholder="Tuliskan deskripsi..."
                                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400"
                                        @input="updateSliderImage(index, 'description', $event.target.value)"
                                    />
                                </div>

                                <div>
                                    <label class="mb-1 block text-[11px] font-medium text-slate-600">
                                        Teks Tombol
                                    </label>
                                    <input
                                        :value="typeof image === 'string' ? '' : image.buttonText || ''"
                                        type="text"
                                        placeholder="Pelajari Selengkapnya"
                                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400"
                                        @input="updateSliderImage(index, 'buttonText', $event.target.value)"
                                    />
                                </div>

                                <div>
                                    <label class="mb-1 block text-[11px] font-medium text-slate-600">
                                        URL Tombol
                                    </label>
                                    <input
                                        :value="typeof image === 'string' ? '' : image.buttonUrl || ''"
                                        type="text"
                                        placeholder="/kontak"
                                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400"
                                        @input="updateSliderImage(index, 'buttonUrl', $event.target.value)"
                                    />
                                </div>

                                <label class="flex items-center gap-2 text-[11px] text-slate-600">
                                    <input
                                        type="checkbox"
                                        :checked="typeof image !== 'string' && image.newTab === true"
                                        class="size-3.5 accent-[#14a2d8]"
                                        @change="updateSliderImage(index, 'newTab', $event.target.checked)"
                                    />
                                    Buka tautan di tab baru
                                </label>
                            </div>

                            <button
                                type="button"
                                class="w-full rounded-lg border border-dashed border-sky-300 px-3 py-2.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
                                @click="addSliderImage"
                            >
                                + Tambahkan Slide
                            </button>
                        </div>

                        <div class="space-y-3">
                            <h4 class="text-xs font-bold text-slate-800">
                                Pengaturan Slider
                            </h4>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Tinggi Slider (px)
                                </label>
                                <input
                                    :value="section.height ?? 520"
                                    type="number"
                                    min="180"
                                    max="1200"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                                    @input="updateNumber('height', $event.target.value)"
                                />
                            </div>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Interval Autoplay (milidetik)
                                </label>
                                <input
                                    :value="section.autoplayInterval ?? 5000"
                                    type="number"
                                    min="1000"
                                    max="30000"
                                    step="500"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                                    @input="updateNumber('autoplayInterval', $event.target.value)"
                                />
                                <p class="mt-1 text-[10px] text-slate-400">
                                    5000 ms = 5 detik.
                                </p>
                            </div>

                            <label class="flex items-center justify-between text-xs text-slate-700">
                                Aktifkan autoplay
                                <input
                                    type="checkbox"
                                    :checked="section.autoplay !== false"
                                    class="size-4 accent-[#14a2d8]"
                                    @change="update('autoplay', $event.target.checked)"
                                />
                            </label>

                            <label class="flex items-center justify-between text-xs text-slate-700">
                                Tampilkan panah navigasi
                                <input
                                    type="checkbox"
                                    :checked="section.showArrows !== false"
                                    class="size-4 accent-[#14a2d8]"
                                    @change="update('showArrows', $event.target.checked)"
                                />
                            </label>

                            <label class="flex items-center justify-between text-xs text-slate-700">
                                Tampilkan indikator titik
                                <input
                                    type="checkbox"
                                    :checked="section.showDots !== false"
                                    class="size-4 accent-[#14a2d8]"
                                    @change="update('showDots', $event.target.checked)"
                                />
                            </label>

                            <label class="flex items-center justify-between text-xs text-slate-700">
                                Overlay gelap
                                <input
                                    type="checkbox"
                                    :checked="section.overlay !== false"
                                    class="size-4 accent-[#14a2d8]"
                                    @change="update('overlay', $event.target.checked)"
                                />
                            </label>

                            <div v-if="section.overlay !== false">
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Warna Overlay
                                </label>
                                <input
                                    :value="section.overlayColor || '#000000'"
                                    type="color"
                                    class="h-10 w-full rounded-lg border border-slate-200 p-1"
                                    @input="update('overlayColor', $event.target.value)"
                                />

                                <label class="mb-1 mt-3 block text-xs font-medium text-slate-600">
                                    Intensitas Overlay ({{ section.overlayOpacity ?? 40 }}%)
                                </label>
                                <input
                                    :value="section.overlayOpacity ?? 40"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-[#14a2d8]"
                                    @input="updateNumber('overlayOpacity', $event.target.value)"
                                />
                            </div>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Posisi Konten Slide
                                </label>
                                <select
                                    :value="section.contentAlignment || 'left'"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                                    @change="update('contentAlignment', $event.target.value)"
                                >
                                    <option value="left">Kiri</option>
                                    <option value="center">Tengah</option>
                                    <option value="right">Kanan</option>
                                </select>
                            </div>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Mode Gambar
                                </label>
                                <select
                                    :value="section.objectFit || 'cover'"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                                    @change="update('objectFit', $event.target.value)"
                                >
                                    <option value="cover">Cover — memenuhi area</option>
                                    <option value="contain">Contain — seluruh gambar terlihat</option>
                                </select>
                            </div>

                            <div>
                                <label class="mb-1 block text-xs font-medium text-slate-600">
                                    Radius Sudut (px)
                                </label>
                                <input
                                    :value="section.borderRadius ?? 0"
                                    type="number"
                                    min="0"
                                    max="100"
                                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                                    @input="updateNumber('borderRadius', $event.target.value)"
                                />
                            </div>
                        </div>
                    </template>

                    <template
                        v-if="['button', 'whatsapp'].includes(section.type)"
                    >
                        <div>
                            <label class="mb-1.5 block text-xs font-medium text-slate-600">
                                Teks tombol
                            </label>
                            <input
                                :value="section.buttonText || ''"
                                type="text"
                                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                placeholder="Contoh: Hubungi Kami"
                                @input="update('buttonText', $event.target.value)"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-xs font-medium text-slate-600">
                                URL tujuan
                            </label>
                            <input
                                :value="section.buttonUrl || ''"
                                type="text"
                                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                placeholder="/kontak"
                                @input="update('buttonUrl', $event.target.value)"
                            />
                        </div>
                    </template>

                    <div v-if="['image'].includes(section.type)">
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            URL gambar sementara
                        </label>
                        <input
                            :value="section.imageUrl || ''"
                            type="url"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="https://..."
                            @input="update('imageUrl', $event.target.value)"
                        />
                        <p class="mt-1 text-[10px] leading-4 text-slate-400">
                            Nantinya diganti dengan pemilih gambar dari Media Library.
                        </p>
                    </div>

                    <div v-if="section.type === 'spacer_divider'">
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Tinggi jarak (px)
                        </label>
                        <input
                            :value="section.height ?? 32"
                            type="number"
                            min="0"
                            max="400"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                            @input="updateNumber('height', $event.target.value)"
                        />
                    </div>

                    <!-- Konfigurasi artikel -->
                    <div v-if="isArticles" class="space-y-3">
                        <div class="rounded-xl border border-sky-100 bg-sky-50/50 p-3">
                            <h4 class="text-xs font-bold text-slate-800">
                                Sumber Artikel
                            </h4>

                            <p class="mt-1 text-[11px] leading-5 text-slate-600">
                                Pilih artikel yang ingin digunakan pada blok ini.
                            </p>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-xs font-medium text-slate-600">
                                Jumlah artikel
                            </label>

                            <input
                                :value="section.limit ?? 6"
                                type="number"
                                min="1"
                                max="24"
                                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                                @change="updateNumber(
                                    'limit',
                                    Math.max(1, Math.min(24, Number($event.target.value) || 6))
                                )"
                            />
                        </div>

                        <div class="flex items-center justify-between">
                            <h4 class="text-xs font-bold text-slate-800">
                                Daftar Artikel
                            </h4>

                            <span class="text-[10px] text-slate-500">
                                {{ selectedArticleIds.length }} dipilih
                            </span>
                        </div>

                        <div
                            v-if="articlesLoading"
                            class="rounded-lg border border-slate-200 p-4 text-center text-xs text-slate-500"
                        >
                            Memuat daftar artikel...
                        </div>

                        <div
                            v-else-if="articlesError"
                            class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
                        >
                            {{ articlesError }}

                            <button
                                type="button"
                                class="mt-2 block font-semibold underline"
                                @click="fetchArticles"
                            >
                                Coba lagi
                            </button>
                        </div>

                        <div
                            v-else-if="!articles.length"
                            class="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500"
                        >
                            Belum ada artikel yang ditemukan.
                        </div>

                        <div v-else class="max-h-80 space-y-2 overflow-y-auto">
                            <label
                                v-for="article in articles"
                                :key="article.id"
                                class="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-sky-300"
                            >
                                <input
                                    type="checkbox"
                                    :checked="selectedArticleIds.includes(String(article.id))"
                                    class="mt-1 size-4 shrink-0 accent-[#14a2d8]"
                                    @change="toggleArticle(article.id, $event.target.checked)"
                                />

                                <div class="min-w-0 flex-1">
                                    <p class="text-xs font-semibold text-slate-800">
                                        {{ article.title || article.name || 'Tanpa judul' }}
                                    </p>

                                    <p class="mt-1 text-[10px] text-slate-500">
                                        ID: {{ article.id }}
                                        <span v-if="article.status">
                                            · {{ article.status }}
                                        </span>
                                    </p>
                                </div>
                            </label>
                        </div>

                        <p class="text-[10px] leading-4 text-slate-500">
                            Jika tidak ada artikel yang dipilih, preview dapat menggunakan
                            artikel terbaru sesuai batas jumlah.
                        </p>
                    </div>

                    <!-- Pesan dinamis untuk blok lain -->
                    <div
                        v-else-if="isDynamic"
                        class="rounded-lg border border-sky-100 bg-sky-50 p-3"
                    >
                        <p class="text-xs font-semibold text-sky-900">
                            Sumber data dinamis
                        </p>

                        <p class="mt-1 text-[11px] leading-5 text-sky-800">
                            Konfigurasi sumber data untuk tipe blok ini belum tersedia.
                        </p>
                    </div>

                    <div v-if="isInteractive">
                        <div class="rounded-lg border border-violet-100 bg-violet-50 p-3">
                            <p class="text-xs font-semibold text-violet-900">
                                Pengaturan interaksi
                            </p>
                            <p class="mt-1 text-[11px] leading-5 text-violet-800">
                                Pengaturan khusus seperti daftar FAQ, isi tab, nomor WhatsApp, formulir, atau sumber peta/video akan ditambahkan pada konfigurasi blok.
                            </p>
                        </div>
                    </div>
                </section>

                <div class="border-t border-slate-100" />

                <!-- Pengaturan Columns -->
                <section v-if="isColumns" class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Settings2 :size="15" class="text-sky-600" />
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Struktur Kolom
                        </h3>
                    </div>

                    <div>
                        <label class="mb-2 block text-xs font-medium text-slate-600">
                            Jumlah kolom
                        </label>

                        <div class="grid grid-cols-5 gap-2">
                            <button
                                v-for="count in [2, 3, 4, 5, 6]"
                                :key="count"
                                type="button"
                                :class="[
                                    'rounded-lg border px-2 py-3 text-sm font-semibold transition',
                                    columnCount === count
                                        ? 'border-sky-400 bg-sky-50 text-sky-700'
                                        : 'border-slate-200 text-slate-600 hover:border-sky-300',
                                ]"
                                @click="update('columns', count)"
                            >
                                {{ count }}
                            </button>
                        </div>

                        <p class="mt-2 text-[11px] text-slate-500">
                            Pilih jumlah kolom. Isi tiap kolom melalui tombol tambah pada preview.
                        </p>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Jarak antar kolom (px)
                        </label>

                        <input
                            :value="section.gap ?? 16"
                            type="number"
                            min="0"
                            max="100"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                            @input="updateNumber('gap', $event.target.value)"
                        />
                    </div>
                </section>

                <!-- Tampilan -->
                <section class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Palette :size="15" class="text-sky-600" />
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Tampilan
                        </h3>
                    </div>

                    <div>
                        <label class="mb-2 block text-xs font-medium text-slate-600">
                            Latar belakang
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                            <button
                                v-for="option in backgroundOptions"
                                :key="option.value"
                                type="button"
                                :class="[
                                    'flex items-center gap-2 rounded-lg border p-2 text-left transition',
                                    (section.background || 'white') === option.value
                                        ? 'border-sky-400 bg-sky-50'
                                        : 'border-slate-200 hover:border-slate-300',
                                ]"
                                @click="update('background', option.value)"
                            >
                                <span
                                    class="size-5 shrink-0 rounded border border-black/10"
                                    :style="{ backgroundColor: option.color }"
                                />
                                <span class="text-[11px] font-medium text-slate-700">
                                    {{ option.label }}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Perataan konten
                        </label>
                        <div class="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
                            <button
                                v-for="alignment in [
                                    { value: 'left', label: 'Kiri' },
                                    { value: 'center', label: 'Tengah' },
                                    { value: 'right', label: 'Kanan' },
                                ]"
                                :key="alignment.value"
                                type="button"
                                :class="[
                                    'rounded-md px-2 py-2 text-xs transition',
                                    (section.alignment || 'left') === alignment.value
                                        ? 'bg-white font-semibold text-sky-700 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800',
                                ]"
                                @click="update('alignment', alignment.value)"
                            >
                                {{ alignment.label }}
                            </button>
                        </div>
                    </div>
                </section>

                <div class="border-t border-slate-200 p-4">
                    <button
                        type="button"
                        class="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                        @click="emit('delete', section.id)"
                    >
                        <Trash2 :size="14" />
                        Hapus Blok
                    </button>
                </div>
            </div>
        </template>

        <MediaLibrary
            v-model="mediaLibraryOpen"
            @select="handleMediaSelected"
        />
    </aside>
</template>
