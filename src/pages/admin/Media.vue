<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Media</h1>
                <p class="mt-1 text-sm text-gray-500">
                    Kelola gambar dan file yang digunakan website.
                </p>
            </div>

            <button
                type="button"
                @click="openUpload"
                class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
                + Upload Media
            </button>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="flex flex-col gap-3 md:flex-row">
                <input
                    v-model="search"
                    type="search"
                    placeholder="Cari file..."
                    class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 md:max-w-md"
                    @keyup.enter="fetchMedia"
                />

                <select
                    v-model="typeFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                    @change="fetchMedia"
                >
                    <option value="all">Semua File</option>
                    <option value="image">Gambar</option>
                    <option value="other">File Lainnya</option>
                </select>

                <button
                    type="button"
                    @click="fetchMedia"
                    class="h-10 rounded-xl border border-gray-200 px-4 text-sm hover:bg-gray-50"
                >
                    Cari
                </button>
            </div>
        </div>

        <p v-if="successMessage" class="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {{ successMessage }}
        </p>
        <p v-if="errorMessage" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ errorMessage }}
        </p>

        <div v-if="loading" class="rounded-2xl border bg-white py-16 text-center text-sm text-gray-500">
            Memuat media...
        </div>

        <div
            v-else-if="filteredMedia.length"
            class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
            <div
                v-for="item in filteredMedia"
                :key="item.id"
                class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
                <div class="relative aspect-square bg-gray-100">
                    <img
                        v-if="item.type === 'image' && item.url"
                        :src="item.url"
                        :alt="item.alt || item.name"
                        class="h-full w-full object-cover"
                        loading="lazy"
                    />
                    <div v-else class="grid h-full place-items-center">
                        <div class="text-center">
                            <div class="text-4xl">📄</div>
                            <p class="mt-2 text-xs font-medium text-gray-500">File</p>
                        </div>
                    </div>

                    <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                        <button
                            type="button"
                            @click="previewMedia(item)"
                            class="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Lihat
                        </button>
                        <button
                            type="button"
                            @click="deleteMedia(item)"
                            :disabled="deletingId === item.id"
                            class="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                        >
                            {{ deletingId === item.id ? 'Menghapus...' : 'Hapus' }}
                        </button>
                    </div>
                </div>

                <div class="p-3">
                    <p class="truncate text-sm font-medium text-gray-900" :title="item.name">
                        {{ item.name }}
                    </p>
                    <div class="mt-1 flex items-center justify-between gap-2">
                        <p class="text-xs text-gray-400">{{ formatSize(item.sizeBytes) }}</p>
                        <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                            {{ item.type === 'image' ? 'Gambar' : 'File' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-else
            class="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center"
        >
            <div class="text-4xl">🖼️</div>
            <p class="mt-3 text-sm font-semibold text-gray-900">Tidak ada media ditemukan</p>
            <p class="mt-1 text-xs text-gray-500">Upload gambar atau file untuk digunakan pada website.</p>
            <button
                type="button"
                @click="openUpload"
                class="mt-4 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
                + Upload Media
            </button>
        </div>

        <div v-if="lastPage > 1" class="flex items-center justify-center gap-3">
            <button
                type="button"
                :disabled="page <= 1 || loading"
                @click="changePage(page - 1)"
                class="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
                Sebelumnya
            </button>
            <span class="text-sm text-gray-500">Halaman {{ page }} / {{ lastPage }}</span>
            <button
                type="button"
                :disabled="page >= lastPage || loading"
                @click="changePage(page + 1)"
                class="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
                Berikutnya
            </button>
        </div>

        <!-- Upload modal -->
        <div
            v-if="showUpload"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            @click.self="closeUpload"
            @keydown.esc="closeUpload"
        >
            <section class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <header class="flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">Upload Media</h2>
                        <p class="mt-1 text-sm text-gray-500">Pilih gambar untuk ditambahkan ke Media Library.</p>
                    </div>
                    <button
                        type="button"
                        @click="closeUpload"
                        :disabled="uploading"
                        class="grid h-9 w-9 place-items-center rounded-lg border text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                        ✕
                    </button>
                </header>

                <div class="space-y-4 p-5">
                    <label class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-5 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/30">
                        <input
                            ref="fileInput"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            class="hidden"
                            :disabled="uploading"
                            @change="handleFiles"
                        />
                        <div class="text-4xl">📁</div>
                        <p class="mt-3 text-sm font-semibold text-gray-900">Pilih gambar dari komputer</p>
                        <p class="mt-1 text-xs text-gray-500">JPG, PNG, WebP · Maksimal 10 MB per gambar · Maksimal 10 gambar</p>
                        <span class="mt-4 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white">
                            Pilih File
                        </span>
                    </label>

                    <div v-if="selectedFiles.length" class="space-y-2">
                        <p class="text-sm font-semibold text-gray-900">File yang dipilih</p>
                        <div
                            v-for="(item, index) in selectedFiles"
                            :key="`${item.file.name}-${item.file.size}-${index}`"
                            class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
                        >
                            <div class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-gray-100">
                                <img v-if="item.preview" :src="item.preview" alt="" class="h-full w-full object-cover" />
                                <span v-else>📄</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-gray-800">{{ item.file.name }}</p>
                                <p class="mt-0.5 text-xs text-gray-400">{{ formatSize(item.file.size) }}</p>
                            </div>
                            <button
                                type="button"
                                :disabled="uploading"
                                @click="removeSelectedFile(index)"
                                class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <p v-if="uploadError" class="text-sm text-red-600">{{ uploadError }}</p>
                </div>

                <footer class="flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        @click="closeUpload"
                        :disabled="uploading"
                        class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        :disabled="!selectedFiles.length || uploading"
                        @click="uploadFiles"
                        class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {{ uploading ? 'Mengunggah...' : `Upload ${selectedFiles.length} Gambar` }}
                    </button>
                </footer>
            </section>
        </div>

        <!-- Preview modal -->
        <div
            v-if="previewItem"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
            @click.self="previewItem = null"
            @keydown.esc="previewItem = null"
        >
            <section class="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
                <header class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div class="min-w-0">
                        <p class="truncate text-sm font-semibold text-gray-900">{{ previewItem.name }}</p>
                        <p class="mt-1 text-xs text-gray-400">{{ formatSize(previewItem.sizeBytes) }}</p>
                    </div>
                    <button
                        type="button"
                        @click="previewItem = null"
                        class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                    >
                        ✕
                    </button>
                </header>
                <div class="flex max-h-[75vh] items-center justify-center bg-gray-100 p-4">
                    <img
                        v-if="previewItem.type === 'image' && previewItem.url"
                        :src="previewItem.url"
                        :alt="previewItem.alt || previewItem.name"
                        class="max-h-[70vh] max-w-full rounded-lg object-contain"
                    />
                    <div v-else class="py-16 text-center">
                        <div class="text-6xl">📄</div>
                        <p class="mt-4 text-sm text-gray-600">Preview file belum tersedia.</p>
                        <a v-if="previewItem.url" :href="previewItem.url" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline">
                            Buka file
                        </a>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import api from '@/services/api'

const MEDIA_ENDPOINT = '/website/media'
const UPLOAD_ENDPOINT = '/website/media/upload'

const search = ref('')
const typeFilter = ref('all')
const media = ref([])
const loading = ref(false)
const showUpload = ref(false)
const selectedFiles = ref([])
const previewItem = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
const uploadError = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const deletingId = ref(null)
const page = ref(1)
const lastPage = ref(1)

const filteredMedia = computed(() => {
    if (typeFilter.value === 'all') return media.value
    return media.value.filter((item) =>
        typeFilter.value === 'image' ? item.type === 'image' : item.type !== 'image'
    )
})

function normalizeMedia(raw) {
    const item = raw?.attributes
        ? { id: raw.id, ...raw.attributes }
        : raw

    const mime =
        item.mime_type ||
        item.mimeType ||
        item.mimetype ||
        ''

    const filename =
        item.file_name ||
        item.filename ||
        item.name ||
        item.original_name ||
        `Media #${item.id}`

    const url =
        item.url ||
        item.full_url ||
        item.public_url ||
        item.path_url ||
        ''

    const size = Number(
        item.size ?? item.file_size ?? item.bytes ?? 0
    )

    const isImage =
        String(mime).toLowerCase().startsWith('image/') ||
        /\.(jpe?g|png|webp|gif|svg)$/i.test(filename)

    return {
        ...item,
        id: item.id,
        name: filename,
        url,
        alt: item.alt ?? item.alt_text ?? '',
        type: isImage ? 'image' : 'other',
        sizeBytes: size,
    }
}

function normalizeList(data) {
    // Laravel paginator: { data: [...], current_page, last_page }
    // Resource wrapper: { data: { data: [...], current_page, last_page } }
    let root = data
    if (root?.data && !Array.isArray(root.data) && typeof root.data === 'object') {
        root = root.data
    }
    const items = Array.isArray(root?.data)
        ? root.data
        : Array.isArray(root)
            ? root
            : []

    return {
        items: items.map(normalizeMedia),
        currentPage: Number(root?.current_page || data?.current_page || 1),
        lastPage: Number(root?.last_page || data?.last_page || 1),
    }
}

async function fetchMedia() {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        const response = await api.get(MEDIA_ENDPOINT, {
            params: {
                search: search.value.trim() || undefined,
                type: typeFilter.value === 'all' ? undefined : typeFilter.value,
                page: page.value,
                per_page: 20,
            },
        })
        console.log(response)
        const result = normalizeList(response.data)
        media.value = result.items
        page.value = result.currentPage || page.value
        lastPage.value = Math.max(1, result.lastPage || 1)
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Gagal memuat media dari server.'
    } finally {
        loading.value = false
    }
}

function openUpload() {
    selectedFiles.value = []
    uploadError.value = ''
    showUpload.value = true
}

function closeUpload() {
    if (uploading.value) return
    showUpload.value = false
    clearSelectedFiles()
    if (fileInput.value) fileInput.value.value = ''
}

function clearSelectedFiles() {
    selectedFiles.value.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview)
    })
    selectedFiles.value = []
}

function handleFiles(event) {
    const incoming = Array.from(event.target.files || [])
    event.target.value = ''
    uploadError.value = ''

    if (!incoming.length) return

    const combined = [...selectedFiles.value.map((item) => item.file), ...incoming]
    if (combined.length > 10) {
        uploadError.value = 'Maksimal 10 gambar sekali upload.'
        return
    }

    const invalid = combined.find((file) =>
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
        || file.size > 10 * 1024 * 1024
    )

    if (invalid) {
        uploadError.value = `File "${invalid.name}" tidak valid. Gunakan JPG, PNG, atau WebP maksimal 10 MB per file.`
        return
    }

    const existingKeys = new Set(selectedFiles.value.map((item) => `${item.file.name}:${item.file.size}:${item.file.lastModified}`))
    incoming.forEach((file) => {
        const key = `${file.name}:${file.size}:${file.lastModified}`
        if (existingKeys.has(key)) return
        selectedFiles.value.push({
            file,
            preview: URL.createObjectURL(file),
        })
        existingKeys.add(key)
    })
}

function removeSelectedFile(index) {
    const item = selectedFiles.value[index]
    if (item?.preview) URL.revokeObjectURL(item.preview)
    selectedFiles.value.splice(index, 1)
    uploadError.value = ''
}

async function uploadFiles() {
    if (!selectedFiles.value.length || uploading.value) return

    const payload = new FormData()
    selectedFiles.value.forEach(({ file }) => payload.append('files[]', file))

    uploading.value = true
    uploadError.value = ''
    errorMessage.value = ''
    successMessage.value = ''

    try {
        await api.post(UPLOAD_ENDPOINT, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        showUpload.value = false
        clearSelectedFiles()
        page.value = 1
        search.value = ''
        typeFilter.value = 'all'
        successMessage.value = 'Media berhasil diunggah.'
        await fetchMedia()
    } catch (error) {
        uploadError.value = error.response?.data?.message
            || Object.values(error.response?.data?.errors || {}).flat().join(' ')
            || 'Upload gagal. Periksa route, validasi, dan log backend.'
    } finally {
        uploading.value = false
    }
}

async function deleteMedia(item) {
    const confirmed = window.confirm(`Hapus file "${item.name}"?`)
    if (!confirmed) return

    deletingId.value = item.id
    errorMessage.value = ''
    successMessage.value = ''

    try {
        await api.delete(`${MEDIA_ENDPOINT}/${item.id}`)
        media.value = media.value.filter((mediaItem) => mediaItem.id !== item.id)
        if (previewItem.value?.id === item.id) previewItem.value = null
        successMessage.value = 'Media berhasil dihapus.'
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Gagal menghapus media.'
    } finally {
        deletingId.value = null
    }
}

function previewMedia(item) {
    previewItem.value = item
}

async function changePage(nextPage) {
    if (nextPage < 1 || nextPage > lastPage.value) return
    page.value = nextPage
    await fetchMedia()
}

function formatSize(bytes) {
    if (!bytes) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

onMounted(() => {
    fetchMedia()
})

onBeforeUnmount(() => {
    clearSelectedFiles()
})
</script>