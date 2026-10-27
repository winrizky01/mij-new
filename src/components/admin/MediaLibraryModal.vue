<template>
    <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
        @click.self="close"
        @keydown.esc="close"
    >
        <section class="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <header class="flex items-center justify-between border-b p-5">
                <div>
                    <h2 class="text-lg font-bold text-gray-900">Media Library</h2>
                    <p class="mt-1 text-sm text-gray-500">Pilih gambar atau upload file baru.</p>
                </div>

                <button
                    type="button"
                    class="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                    aria-label="Tutup Media Library"
                    @click="close"
                >
                    ✕
                </button>
            </header>

            <div class="space-y-4 border-b p-4">
                <div class="flex flex-col gap-3 sm:flex-row">
                    <input
                        v-model="search"
                        type="search"
                        placeholder="Cari nama gambar..."
                        class="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                        @keyup.enter="searchMedia"
                    />

                    <button
                        type="button"
                        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        @click="openUploadModal"
                    >
                        + Upload gambar
                    </button>

                    <button
                        type="button"
                        class="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        @click="searchMedia"
                    >
                        Cari
                    </button>
                </div>

                <p v-if="message" class="text-sm text-blue-700">{{ message }}</p>
                <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
                <p class="text-xs text-gray-500">
                    JPG, PNG, WebP · Maksimal 10 MB per gambar · Maksimal 10 gambar sekali upload.
                </p>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto p-4">
                <div v-if="loading" class="py-12 text-center text-gray-500">
                    Memuat media...
                </div>

                <div
                    v-else-if="media.length"
                    class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                    <button
                        v-for="item in media"
                        :key="item.id"
                        type="button"
                        class="overflow-hidden rounded-xl border text-left transition hover:border-blue-500"
                        :class="selected?.id === item.id
                            ? 'border-blue-600 ring-2 ring-blue-200'
                            : 'border-gray-200'"
                        @click="selectForPreview(item)"
                    >
                        <div class="aspect-square bg-gray-100">
                            <img
                                :src="item.url"
                                :alt="item.alt || item.title || item.file_name"
                                class="h-full w-full object-contain"
                                loading="lazy"
                            />
                        </div>

                        <div class="space-y-1 p-3">
                            <p class="truncate text-sm font-medium text-gray-800">
                                {{ item.title || item.file_name || `Media #${item.id}` }}
                            </p>
                            <p class="text-xs text-gray-500">
                                {{ item.width || '?' }} × {{ item.height || '?' }} px
                            </p>
                            <p class="text-xs text-gray-500">{{ formatBytes(item.size) }}</p>
                        </div>
                    </button>
                </div>

                <div v-else class="py-16 text-center text-sm text-gray-500">
                    Belum ada gambar atau hasil pencarian tidak ditemukan.
                </div>

                <div class="mt-5 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        :disabled="page <= 1 || loading"
                        class="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                        @click="changePage(page - 1)"
                    >
                        Sebelumnya
                    </button>

                    <span class="py-2 text-sm text-gray-500">
                        Halaman {{ page }} / {{ lastPage }}
                    </span>

                    <button
                        type="button"
                        :disabled="page >= lastPage || loading"
                        class="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                        @click="changePage(page + 1)"
                    >
                        Berikutnya
                    </button>
                </div>

                <div
                    v-if="selected"
                    class="mt-6 grid gap-5 rounded-xl border bg-gray-50 p-4 md:grid-cols-[180px_1fr]"
                >
                    <img
                        :src="selected.url"
                        :alt="selected.alt || ''"
                        class="aspect-square w-full rounded-lg bg-white object-contain"
                    />

                    <div class="space-y-4">
                        <div>
                            <h3 class="font-semibold text-gray-900">Detail gambar</h3>
                            <p class="mt-1 break-all text-xs text-gray-500">{{ selected.file_name }}</p>
                            <p class="mt-1 text-xs text-gray-500">
                                {{ selected.width || '?' }} × {{ selected.height || '?' }} px
                            </p>
                        </div>

                        <div class="grid gap-3 sm:grid-cols-2">
                            <label class="text-sm">
                                Judul
                                <input
                                    v-model="selected.title"
                                    class="mt-1 w-full rounded-lg border bg-white px-3 py-2"
                                />
                            </label>

                            <label class="text-sm">
                                Alt text
                                <input
                                    v-model="selected.alt"
                                    class="mt-1 w-full rounded-lg border bg-white px-3 py-2"
                                    placeholder="Deskripsi gambar untuk aksesibilitas"
                                />
                            </label>
                        </div>

                        <div class="flex flex-wrap items-end gap-3">
                            <label class="text-sm">
                                Lebar resize
                                <select
                                    v-model.number="resizeWidth"
                                    class="mt-1 block rounded-lg border bg-white px-3 py-2"
                                >
                                    <option :value="400">400 px</option>
                                    <option :value="800">800 px</option>
                                    <option :value="1200">1200 px</option>
                                    <option :value="1920">1920 px</option>
                                </select>
                            </label>

                            <button
                                type="button"
                                :disabled="resizing || !selected.width || resizeWidth >= selected.width"
                                class="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40"
                                @click="resizeSelected"
                            >
                                {{ resizing ? 'Memproses...' : 'Buat varian resize' }}
                            </button>

                            <button
                                type="button"
                                :disabled="savingMetadata"
                                class="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40"
                                @click="saveMetadata"
                            >
                                {{ savingMetadata ? 'Menyimpan...' : 'Simpan metadata' }}
                            </button>
                        </div>

                        <p class="text-xs text-gray-500">
                            Resize mempertahankan rasio gambar dan tidak memperbesar gambar kecil.
                            File asli tetap aman.
                        </p>

                        <button
                            type="button"
                            class="text-sm font-semibold text-blue-700 hover:underline"
                            @click="chooseImage"
                        >
                            Gunakan gambar ini
                        </button>
                    </div>
                </div>
            </div>

            <footer class="flex justify-end gap-3 border-t p-4">
                <button
                    type="button"
                    class="rounded-lg border px-4 py-2 text-sm"
                    @click="close"
                >
                    Batal
                </button>
                <button
                    type="button"
                    :disabled="!selected"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                    @click="chooseImage"
                >
                    Pilih gambar
                </button>
            </footer>
        </section>
    </div>

    <!-- Modal upload terpisah dari Media Library -->
    <div
        v-if="uploadModalOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
        @click.self="closeUploadModal"
        @keydown.esc="closeUploadModal"
    >
        <section class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header class="flex items-center justify-between border-b p-5">
                <div>
                    <h2 class="text-lg font-bold text-gray-900">Upload gambar</h2>
                    <p class="mt-1 text-sm text-gray-500">Pilih satu atau beberapa gambar untuk Media Library.</p>
                </div>
                <button
                    type="button"
                    class="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                    aria-label="Tutup modal upload"
                    @click="closeUploadModal"
                >
                    ✕
                </button>
            </header>

            <div class="space-y-4 p-5">
                <label
                    class="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition hover:border-blue-500 hover:bg-blue-50/50"
                    :class="uploading ? 'cursor-not-allowed opacity-60' : ''"
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        class="hidden"
                        :disabled="uploading"
                        @change="onFilesSelected"
                    />
                    <span class="text-3xl text-blue-600">↑</span>
                    <span class="mt-2 text-sm font-semibold text-gray-800">
                        Klik untuk memilih gambar
                    </span>
                    <span class="mt-1 text-xs text-gray-500">JPG, PNG, WebP · Maks. 10 MB per file</span>
                </label>

                <div v-if="uploadFilesList.length" class="space-y-2">
                    <div
                        v-for="(file, index) in uploadFilesList"
                        :key="`${file.name}-${file.size}-${index}`"
                        class="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2"
                    >
                        <div class="min-w-0">
                            <p class="truncate text-sm font-medium text-gray-800">{{ file.name }}</p>
                            <p class="text-xs text-gray-500">{{ formatBytes(file.size) }}</p>
                        </div>
                        <button
                            type="button"
                            :disabled="uploading"
                            class="shrink-0 rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40"
                            @click="removeUploadFile(index)"
                        >
                            Hapus
                        </button>
                    </div>
                    <p class="text-xs text-gray-500">{{ uploadFilesList.length }} file dipilih.</p>
                </div>

                <p v-if="uploadError" class="text-sm text-red-600">{{ uploadError }}</p>
                <p v-if="uploading" class="text-sm text-blue-700">Sedang mengunggah gambar...</p>
            </div>

            <footer class="flex justify-end gap-3 border-t p-4">
                <button
                    type="button"
                    :disabled="uploading"
                    class="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                    @click="closeUploadModal"
                >
                    Batal
                </button>
                <button
                    type="button"
                    :disabled="uploading || !uploadFilesList.length"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                    @click="uploadFiles"
                >
                    {{ uploading ? 'Mengunggah...' : `Upload ${uploadFilesList.length || ''} gambar` }}
                </button>
            </footer>
        </section>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue', 'select'])

const media = ref([])
const selected = ref(null)
const search = ref('')
const loading = ref(false)
const uploading = ref(false)
const resizing = ref(false)
const savingMetadata = ref(false)
const uploadModalOpen = ref(false)
const uploadFilesList = ref([])
const uploadError = ref('')
const error = ref('')
const message = ref('')
const page = ref(1)
const lastPage = ref(1)
const resizeWidth = ref(800)

const MEDIA_ENDPOINT = '/website/media'
const UPLOAD_ENDPOINT = '/website/media/upload'

watch(
    () => props.modelValue,
    (open) => {
        if (open) fetchMedia()
        else {
            uploadModalOpen.value = false
            uploadFilesList.value = []
            uploadError.value = ''
        }
    },
)

function close() {
    emit('update:modelValue', false)
}

function openUploadModal() {
    uploadError.value = ''
    uploadFilesList.value = []
    uploadModalOpen.value = true
}

function closeUploadModal() {
    if (uploading.value) return
    uploadModalOpen.value = false
    uploadFilesList.value = []
    uploadError.value = ''
}

function searchMedia() {
    page.value = 1
    fetchMedia()
}

function normalizeListResponse(responseData) {
    // Mendukung bentuk paginator Laravel dan resource yang membungkus data.
    const root = responseData?.data ?? responseData
    const items = Array.isArray(root) ? root : (Array.isArray(root?.data) ? root.data : [])

    return {
        items,
        currentPage: Number(root?.current_page ?? responseData?.current_page ?? 1),
        lastPage: Number(root?.last_page ?? responseData?.last_page ?? 1),
    }
}

async function fetchMedia() {
    loading.value = true
    error.value = ''

    try {
        const response = await api.get(MEDIA_ENDPOINT, {
            params: {
                search: search.value.trim() || undefined,
                page: page.value,
                per_page: 20,
            },
        })

        const normalized = normalizeListResponse(response.data)
        media.value = normalized.items
        page.value = normalized.currentPage || page.value
        lastPage.value = Math.max(1, normalized.lastPage || 1)

        if (selected.value) {
            const refreshed = media.value.find((item) => item.id === selected.value.id)
            if (refreshed) selected.value = { ...refreshed }
            else selected.value = null
        }
    } catch (e) {
        error.value = e.response?.data?.message || 'Gagal memuat Media Library.'
    } finally {
        loading.value = false
    }
}

function onFilesSelected(event) {
    const picked = Array.from(event.target.files || [])
    event.target.value = ''
    uploadError.value = ''

    if (!picked.length) return

    const merged = [...uploadFilesList.value, ...picked]
    if (merged.length > 10) {
        uploadError.value = 'Maksimal 10 gambar sekali upload.'
        return
    }

    const invalid = merged.find((file) =>
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
        || file.size > 10 * 1024 * 1024
    )

    if (invalid) {
        uploadError.value = `File "${invalid.name}" tidak valid. Gunakan JPG, PNG, atau WebP maksimal 10 MB per file.`
        return
    }

    uploadFilesList.value = merged
}

function removeUploadFile(index) {
    uploadFilesList.value.splice(index, 1)
    uploadError.value = ''
}

async function uploadFiles() {
    if (!uploadFilesList.value.length || uploading.value) return

    const payload = new FormData()
    uploadFilesList.value.forEach((file) => payload.append('files[]', file))

    uploading.value = true
    uploadError.value = ''
    error.value = ''
    message.value = ''

    try {
        // Gunakan endpoint upload eksplisit yang didaftarkan di backend.
        await api.post(UPLOAD_ENDPOINT, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        uploadModalOpen.value = false
        uploadFilesList.value = []
        page.value = 1
        search.value = ''
        message.value = 'Upload gambar berhasil.'
        await fetchMedia()
    } catch (e) {
        uploadError.value = e.response?.data?.message
            || Object.values(e.response?.data?.errors || {}).flat().join(' ')
            || 'Upload gambar gagal. Periksa endpoint dan validasi backend.'
    } finally {
        uploading.value = false
    }
}

async function saveMetadata() {
    if (!selected.value || savingMetadata.value) return

    savingMetadata.value = true
    error.value = ''
    message.value = ''

    try {
        const response = await api.put(`${MEDIA_ENDPOINT}/${selected.value.id}`, {
            title: selected.value.title,
            alt: selected.value.alt,
        })

        selected.value = response.data?.data ?? response.data
        message.value = 'Metadata berhasil disimpan.'
        await fetchMedia()
    } catch (e) {
        error.value = e.response?.data?.message || 'Gagal menyimpan metadata.'
    } finally {
        savingMetadata.value = false
    }
}

async function resizeSelected() {
    if (!selected.value || resizing.value) return

    resizing.value = true
    error.value = ''
    message.value = ''

    try {
        await api.post(`${MEDIA_ENDPOINT}/${selected.value.id}/resize`, {
            width: resizeWidth.value,
            quality: 82,
        })

        message.value = 'Varian gambar berhasil dibuat.'
        await fetchMedia()
    } catch (e) {
        error.value = e.response?.data?.message || 'Resize gambar gagal.'
    } finally {
        resizing.value = false
    }
}

async function changePage(nextPage) {
    if (nextPage < 1 || nextPage > lastPage.value) return
    page.value = nextPage
    selected.value = null
    await fetchMedia()
}

function selectForPreview(item) {
    selected.value = { ...item }
}

function chooseImage() {
    if (!selected.value) return
    emit('select', selected.value)
    close()
}

function formatBytes(size) {
    if (size == null) return '-'
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / 1024 / 1024).toFixed(2)} MB`
}
</script>