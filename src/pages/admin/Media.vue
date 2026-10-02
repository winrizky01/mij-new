<template>
    <div class="space-y-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Media
                </h1>

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

        <!-- Search -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="flex flex-col gap-3 md:flex-row">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari file..."
                    class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 md:max-w-md"
                />

                <select
                    v-model="typeFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                    <option value="all">Semua File</option>
                    <option value="image">Gambar</option>
                    <option value="other">File Lainnya</option>
                </select>
            </div>
        </div>

        <!-- Media Grid -->
        <div
            v-if="filteredMedia.length"
            class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
            <div
                v-for="item in filteredMedia"
                :key="item.id"
                class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
                <!-- Preview -->
                <div class="relative aspect-square bg-gray-100">
                    <img
                        v-if="item.type === 'image'"
                        :src="item.url"
                        :alt="item.name"
                        class="h-full w-full object-cover"
                    />

                    <div
                        v-else
                        class="grid h-full place-items-center"
                    >
                        <div class="text-center">
                            <div class="text-4xl">
                                📄
                            </div>

                            <p
                                class="mt-2 text-xs font-medium text-gray-500"
                            >
                                File
                            </p>
                        </div>
                    </div>

                    <!-- Overlay -->
                    <div
                        class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100"
                    >
                        <button
                            type="button"
                            @click="previewMedia(item)"
                            class="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Lihat
                        </button>

                        <button
                            type="button"
                            @click="deleteMedia(item.id)"
                            class="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                        >
                            Hapus
                        </button>
                    </div>
                </div>

                <!-- Info -->
                <div class="p-3">
                    <p
                        class="truncate text-sm font-medium text-gray-900"
                        :title="item.name"
                    >
                        {{ item.name }}
                    </p>

                    <div
                        class="mt-1 flex items-center justify-between gap-2"
                    >
                        <p class="text-xs text-gray-400">
                            {{ item.size }}
                        </p>

                        <span
                            class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500"
                        >
                            {{ item.type === 'image' ? 'Gambar' : 'File' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div
            v-else
            class="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center"
        >
            <div class="text-4xl">
                🖼️
            </div>

            <p class="mt-3 text-sm font-semibold text-gray-900">
                Tidak ada media ditemukan
            </p>

            <p class="mt-1 text-xs text-gray-500">
                Upload gambar atau file untuk digunakan pada website.
            </p>

            <button
                type="button"
                @click="openUpload"
                class="mt-4 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
                + Upload Media
            </button>
        </div>

        <!-- Upload Form -->
        <div
            v-if="showUpload"
            class="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6"
        >
            <div
                class="mb-6 flex items-start justify-between gap-4"
            >
                <div>
                    <h2 class="text-lg font-bold text-gray-900">
                        Upload Media
                    </h2>

                    <p class="mt-1 text-sm text-gray-500">
                        Pilih gambar atau file dari komputer.
                    </p>
                </div>

                <button
                    type="button"
                    @click="closeUpload"
                    class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                >
                    ✕
                </button>
            </div>

            <!-- Drop Area -->
            <label
                class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-5 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
            >
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    multiple
                    class="hidden"
                    @change="handleFiles"
                />

                <div class="text-4xl">
                    📁
                </div>

                <p class="mt-4 text-sm font-semibold text-gray-900">
                    Pilih file dari komputer
                </p>

                <p class="mt-1 text-xs text-gray-500">
                    JPG, PNG, WEBP, PDF, DOC, XLS dan file lainnya
                </p>

                <span
                    class="mt-4 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white"
                >
                    Pilih File
                </span>
            </label>

            <!-- Selected Files -->
            <div
                v-if="selectedFiles.length"
                class="mt-5 space-y-2"
            >
                <p class="text-sm font-semibold text-gray-900">
                    File yang dipilih
                </p>

                <div
                    v-for="(file, index) in selectedFiles"
                    :key="`${file.name}-${index}`"
                    class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
                >
                    <!-- Preview -->
                    <div
                        class="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-gray-100"
                    >
                        <img
                            v-if="file.preview"
                            :src="file.preview"
                            alt=""
                            class="h-full w-full object-cover"
                        />

                        <span v-else>
                            📄
                        </span>
                    </div>

                    <!-- Info -->
                    <div class="min-w-0 flex-1">
                        <p
                            class="truncate text-sm font-medium text-gray-800"
                        >
                            {{ file.name }}
                        </p>

                        <p class="mt-0.5 text-xs text-gray-400">
                            {{ formatSize(file.size) }}
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="removeSelectedFile(index)"
                        class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <!-- Actions -->
            <div
                class="mt-6 flex flex-col-reverse gap-2 border-t border-blue-100 pt-5 sm:flex-row sm:justify-end"
            >
                <button
                    type="button"
                    @click="closeUpload"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Batal
                </button>

                <button
                    type="button"
                    :disabled="!selectedFiles.length"
                    @click="uploadFiles"
                    class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Upload {{ selectedFiles.length || '' }} File
                </button>
            </div>
        </div>

        <!-- Preview Modal -->
        <div
            v-if="previewItem"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            @click.self="previewItem = null"
        >
            <div
                class="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
            >
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-5 py-4"
                >
                    <div class="min-w-0">
                        <p
                            class="truncate text-sm font-semibold text-gray-900"
                        >
                            {{ previewItem.name }}
                        </p>

                        <p class="mt-1 text-xs text-gray-400">
                            {{ previewItem.size }}
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="previewItem = null"
                        class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                    >
                        ✕
                    </button>
                </div>

                <div
                    class="flex max-h-[75vh] items-center justify-center bg-gray-100 p-4"
                >
                    <img
                        v-if="previewItem.type === 'image'"
                        :src="previewItem.url"
                        :alt="previewItem.name"
                        class="max-h-[70vh] max-w-full rounded-lg object-contain"
                    />

                    <div
                        v-else
                        class="py-16 text-center"
                    >
                        <div class="text-6xl">
                            📄
                        </div>

                        <p
                            class="mt-4 text-sm text-gray-600"
                        >
                            Preview file belum tersedia.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const search = ref('')
const typeFilter = ref('all')

const showUpload = ref(false)
const selectedFiles = ref([])
const previewItem = ref(null)
const fileInput = ref(null)

const media = ref([
    {
        id: 1,
        name: 'hero-trucking.jpg',
        size: '1.2 MB',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1586528116493-da8b7b1e5f3f?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 2,
        name: 'office.jpg',
        size: '840 KB',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 3,
        name: 'technology.jpg',
        size: '920 KB',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        name: 'team.jpg',
        size: '1.4 MB',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80',
    },
])

const filteredMedia = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return media.value.filter((item) => {
        const matchesSearch =
            !keyword ||
            item.name.toLowerCase().includes(keyword)

        const matchesType =
            typeFilter.value === 'all' ||
            item.type === typeFilter.value ||
            (
                typeFilter.value === 'other' &&
                item.type !== 'image'
            )

        return matchesSearch && matchesType
    })
})

function openUpload() {
    selectedFiles.value = []
    showUpload.value = true
}

function closeUpload() {
    showUpload.value = false
    selectedFiles.value = []

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

function handleFiles(event) {
    const files = Array.from(event.target.files || [])

    selectedFiles.value = files.map((file) => ({
        file,
        name: file.name,
        size: file.size,
        preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : null,
    }))
}

function removeSelectedFile(index) {
    const item = selectedFiles.value[index]

    if (item?.preview) {
        URL.revokeObjectURL(item.preview)
    }

    selectedFiles.value.splice(index, 1)
}

function uploadFiles() {
    if (!selectedFiles.value.length) {
        return
    }

    selectedFiles.value.forEach((item) => {
        const isImage = item.file.type.startsWith('image/')

        media.value.unshift({
            id: Date.now() + Math.random(),
            name: item.name,
            size: formatSize(item.size),
            type: isImage ? 'image' : 'other',
            url: item.preview || '',
        })
    })

    alert(
        `${selectedFiles.value.length} file berhasil ditambahkan (mock).`
    )

    closeUpload()
}

function previewMedia(item) {
    previewItem.value = item
}

function deleteMedia(id) {
    const item = media.value.find(
        (mediaItem) => mediaItem.id === id
    )

    if (!item) return

    const confirmed = confirm(
        `Hapus file "${item.name}"?`
    )

    if (!confirmed) return

    media.value = media.value.filter(
        (mediaItem) => mediaItem.id !== id
    )
}

function formatSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>