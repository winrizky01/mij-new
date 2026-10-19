<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    FileText,
    Globe,
    Eye,
    EyeOff,
    X,
    LoaderCircle,
    RefreshCw,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    LayoutTemplate,
    CheckCircle2,
    AlertCircle,
} from 'lucide-vue-next'
import api from '@/services/api'

const router = useRouter()

const pages = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const editingPage = ref(null)
const selectedPage = ref(null)
const errorMessage = ref('')
const successMessage = ref('')

const search = ref('')
const statusFilter = ref('')
const activeFilter = ref('')
const currentPage = ref(1)
const lastPage = ref(1)
const totalPages = ref(0)
const perPage = 10

const emptyForm = () => ({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    status: 'draft',
    is_active: true,
    sort_order: 0,
})

const form = reactive(emptyForm())

const extractRows = (response) => {
    const data = response?.data?.data

    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data

    return []
}

const filteredPages = computed(() => {
    const keyword = search.value.trim().toLowerCase()

    if (!keyword) return pages.value

    return pages.value.filter((page) =>
        [
            page.title,
            page.slug,
            page.meta_title,
            page.meta_description,
        ].some((value) => String(value ?? '').toLowerCase().includes(keyword)),
    )
})

const publishedCount = computed(() =>
    pages.value.filter((page) => page.status === 'published').length,
)

const draftCount = computed(() =>
    pages.value.filter((page) => page.status === 'draft').length,
)

const activeCount = computed(() =>
    pages.value.filter((page) => page.is_active).length,
)

const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
}

const loadPages = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        const params = {
            per_page: perPage,
            page: currentPage.value,
        }

        if (statusFilter.value) {
            params.status = statusFilter.value
        }

        if (activeFilter.value !== '') {
            params.is_active = activeFilter.value
        }

        const response = await api.get('/website/pages', { params })

        pages.value = extractRows(response)

        const pagination = response?.data?.data

        currentPage.value = Number(pagination?.current_page ?? currentPage.value)
        lastPage.value = Number(pagination?.last_page ?? 1)
        totalPages.value = Number(pagination?.total ?? pages.value.length)
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message ||
            'Gagal mengambil daftar halaman. Periksa koneksi API dan autentikasi admin.'
    } finally {
        loading.value = false
    }
}

watch([statusFilter, activeFilter], () => {
    currentPage.value = 1
    loadPages()
})

const slugify = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

watch(
    () => form.title,
    (value) => {
        if (!editingPage.value) {
            form.slug = slugify(value)
        }
    },
)

const openCreateModal = () => {
    clearMessages()
    editingPage.value = null
    Object.assign(form, emptyForm())
    showModal.value = true
}

const openEditModal = (page) => {
    clearMessages()
    editingPage.value = page

    Object.assign(form, {
        title: page.title ?? '',
        slug: page.slug ?? '',
        meta_title: page.meta_title ?? '',
        meta_description: page.meta_description ?? '',
        status: page.status ?? 'draft',
        is_active: Boolean(page.is_active),
        sort_order: Number(page.sort_order ?? 0),
    })

    showModal.value = true
}

const closeModal = () => {
    if (saving.value) return

    showModal.value = false
    editingPage.value = null
}

const savePage = async () => {
    clearMessages()

    if (!form.title.trim()) {
        errorMessage.value = 'Nama halaman wajib diisi.'
        return
    }

    if (!form.slug.trim()) {
        errorMessage.value = 'Slug halaman wajib diisi.'
        return
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
        errorMessage.value =
            'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.'
        return
    }

    saving.value = true

    const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        meta_title: form.meta_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
        status: form.status,
        is_active: Boolean(form.is_active),
        sort_order: Number(form.sort_order || 0),
    }

    const isEditing = Boolean(editingPage.value)
    
    try {
        if (isEditing) {
            await api.put(
                `/website/pages/${editingPage.value.id}`,
                payload,
            )
            successMessage.value = 'Halaman berhasil diperbarui.'
        } else {
            await api.post('/website/pages', payload)
            successMessage.value = 'Halaman berhasil ditambahkan.'
        }

        showModal.value = false
        editingPage.value = null

        // Setelah membuat halaman, kembali ke halaman pertama
        // agar data yang baru ditambahkan langsung terlihat.
        if (!isEditing) {
            currentPage.value = 1
        }

        await loadPages()
    } catch (error) {
        const errors = error.response?.data?.errors
        const firstValidationError = errors
            ? Object.values(errors).flat()[0]
            : null

        errorMessage.value =
            firstValidationError ||
            error.response?.data?.message ||
            'Gagal menyimpan halaman.'
    } finally {
        saving.value = false
    }
}

const confirmDelete = (page) => {
    clearMessages()

    if (page.slug === 'home') {
        errorMessage.value =
            'Halaman Beranda tidak dapat dihapus dari menu ini.'
        return
    }

    selectedPage.value = page
    showDeleteModal.value = true
}

const deletePage = async () => {
    if (!selectedPage.value || deleting.value) return

    deleting.value = true
    clearMessages()

    try {
        await api.delete(`/website/pages/${selectedPage.value.id}`)

        showDeleteModal.value = false
        selectedPage.value = null
        successMessage.value = 'Halaman berhasil dihapus.'

        if (pages.value.length === 1 && currentPage.value > 1) {
            currentPage.value--
        }

        await loadPages()
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message || 'Gagal menghapus halaman.'
        showDeleteModal.value = false
    } finally {
        deleting.value = false
    }
}

const openContentEditor = (page) => {
    router.push({
        path: 'website-editor',
    })
}

const changePage = (page) => {
    if (page < 1 || page > lastPage.value || loading.value) return

    currentPage.value = page
    loadPages()
}

const statusLabel = (status) =>
    status === 'published' ? 'Published' : 'Draft'

onMounted(loadPages)
</script>

<template>
    <div class="space-y-6 pb-8">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                    <Globe class="h-4 w-4" />
                    <span>Pengelolaan Website</span>
                    <span>/</span>
                    <span class="font-medium text-slate-700">Halaman</span>
                </div>

                <h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Halaman Website
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Kelola halaman website dan status publikasinya.
                    Susunan konten diatur melalui Editor Website.
                </p>
            </div>

            <div class="flex flex-wrap gap-2">
                <button
                    type="button"
                    @click="loadPages"
                    :disabled="loading"
                    class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        class="h-4 w-4"
                        :class="{ 'animate-spin': loading }"
                    />
                    Refresh
                </button>

                <button
                    type="button"
                    @click="openCreateModal"
                    class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus class="h-4 w-4" />
                    Tambah Halaman
                </button>
            </div>
        </div>

        <!-- NOTIFICATION -->
        <div
            v-if="errorMessage"
            class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
            <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
            <div class="flex-1">{{ errorMessage }}</div>
            <button type="button" @click="errorMessage = ''">
                <X class="h-4 w-4" />
            </button>
        </div>

        <div
            v-if="successMessage"
            class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
            <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0" />
            <div class="flex-1">{{ successMessage }}</div>
            <button type="button" @click="successMessage = ''">
                <X class="h-4 w-4" />
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-500">
                        Halaman di daftar
                    </span>
                    <div class="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                        <FileText class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-4 text-3xl font-bold text-slate-900">
                    {{ totalPages }}
                </div>
                <p class="mt-1 text-xs text-slate-500">Total berdasarkan filter</p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-500">
                        Published
                    </span>
                    <div class="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                        <Globe class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-4 text-3xl font-bold text-slate-900">
                    {{ publishedCount }}
                </div>
                <p class="mt-1 text-xs text-slate-500">Pada halaman saat ini</p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-500">
                        Draft
                    </span>
                    <div class="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                        <Pencil class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-4 text-3xl font-bold text-slate-900">
                    {{ draftCount }}
                </div>
                <p class="mt-1 text-xs text-slate-500">Pada halaman saat ini</p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-500">
                        Aktif
                    </span>
                    <div class="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                        <Eye class="h-5 w-5" />
                    </div>
                </div>
                <div class="mt-4 text-3xl font-bold text-slate-900">
                    {{ activeCount }}
                </div>
                <p class="mt-1 text-xs text-slate-500">Pada halaman saat ini</p>
            </div>
        </div>

        <!-- TABLE CONTAINER -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <!-- FILTER BAR -->
            <div class="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
                <div class="relative min-w-0 flex-1">
                    <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Cari nama halaman, slug, atau SEO..."
                        class="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <select
                        v-model="statusFilter"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                        <option value="">Semua status publikasi</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>

                    <select
                        v-model="activeFilter"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                        <option value="">Aktif dan nonaktif</option>
                        <option value="1">Aktif</option>
                        <option value="0">Nonaktif</option>
                    </select>
                </div>
            </div>

            <!-- LOADING -->
            <div
                v-if="loading && pages.length === 0"
                class="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500"
            >
                <LoaderCircle class="h-8 w-8 animate-spin text-blue-600" />
                <p class="text-sm">Memuat halaman website...</p>
            </div>

            <!-- TABLE -->
            <div v-else class="overflow-x-auto">
                <table class="w-full min-w-[950px] text-left">
                    <thead class="border-b border-slate-200 bg-slate-50">
                        <tr class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <th class="px-5 py-4">Halaman</th>
                            <th class="px-5 py-4">SEO</th>
                            <th class="px-5 py-4">Publikasi</th>
                            <th class="px-5 py-4">Status</th>
                            <th class="px-5 py-4 text-center">Urutan</th>
                            <th class="px-5 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        <tr
                            v-for="page in filteredPages"
                            :key="page.id"
                            class="transition hover:bg-slate-50/70"
                        >
                            <td class="px-5 py-4">
                                <div class="flex items-start gap-3">
                                    <div class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <LayoutTemplate class="h-5 w-5" />
                                    </div>

                                    <div class="min-w-0">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <p class="font-semibold text-slate-900">
                                                {{ page.title }}
                                            </p>
                                            <span
                                                v-if="page.slug === 'home'"
                                                class="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700"
                                            >
                                                Beranda
                                            </span>
                                        </div>
                                        <p class="mt-1 text-xs text-slate-500">
                                            /{{ page.slug }}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <td class="px-5 py-4">
                                <p class="max-w-56 truncate text-sm text-slate-700">
                                    {{ page.meta_title || 'Belum diatur' }}
                                </p>
                                <p class="mt-1 max-w-56 truncate text-xs text-slate-400">
                                    {{ page.meta_description || 'Belum ada deskripsi SEO' }}
                                </p>
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="page.status === 'published'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full"
                                        :class="page.status === 'published'
                                            ? 'bg-emerald-500'
                                            : 'bg-amber-500'"
                                    />
                                    {{ statusLabel(page.status) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex items-center gap-1.5 text-xs font-medium"
                                    :class="page.is_active
                                        ? 'text-emerald-700'
                                        : 'text-slate-400'"
                                >
                                    <component
                                        :is="page.is_active ? Eye : EyeOff"
                                        class="h-4 w-4"
                                    />
                                    {{ page.is_active ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </td>

                            <td class="px-5 py-4 text-center text-sm text-slate-600">
                                {{ page.sort_order ?? 0 }}
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex items-center justify-end gap-1.5">
                                    <button
                                        type="button"
                                        @click="openContentEditor(page)"
                                        title="Atur section halaman"
                                        class="inline-flex items-center gap-1.5 rounded-lg
                                            border border-slate-200 px-3 py-2 text-xs
                                            font-semibold text-slate-700 transition
                                            hover:border-blue-200 hover:bg-blue-50
                                            hover:text-blue-700"
                                    >
                                        <LayoutTemplate class="h-4 w-4" />
                                        Editor
                                    </button>

                                    <button
                                        type="button"
                                        @click="openEditModal(page)"
                                        title="Edit halaman"
                                        class="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        @click="confirmDelete(page)"
                                        title="Hapus halaman"
                                        :disabled="page.slug === 'home'"
                                        class="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="!loading && filteredPages.length === 0">
                            <td colspan="6" class="px-5 py-16 text-center">
                                <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                    <FileText class="h-7 w-7" />
                                </div>
                                <p class="mt-4 font-semibold text-slate-800">
                                    {{ search ? 'Halaman tidak ditemukan' : 'Belum ada halaman' }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">
                                    {{
                                        search
                                            ? 'Coba kata kunci pencarian lain.'
                                            : 'Tambahkan halaman website pertama kamu.'
                                    }}
                                </p>
                                <button
                                    v-if="!search"
                                    type="button"
                                    @click="openCreateModal"
                                    class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    <Plus class="h-4 w-4" />
                                    Tambah Halaman
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- PAGINATION -->
            <div class="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs text-slate-500">
                    Menampilkan {{ filteredPages.length }} halaman pada halaman ini
                    <span v-if="totalPages"> · Total {{ totalPages }} halaman</span>
                </p>

                <div class="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        @click="changePage(currentPage - 1)"
                        :disabled="currentPage <= 1 || loading"
                        class="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft class="h-4 w-4" />
                        Sebelumnya
                    </button>

                    <span class="px-2 text-sm font-medium text-slate-700">
                        {{ currentPage }} / {{ lastPage }}
                    </span>

                    <button
                        type="button"
                        @click="changePage(currentPage + 1)"
                        :disabled="currentPage >= lastPage || loading"
                        class="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Berikutnya
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- CREATE / EDIT MODAL -->
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
            @click.self="closeModal"
        >
            <div class="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div class="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 class="text-lg font-bold text-slate-900">
                            {{ editingPage ? 'Edit Halaman' : 'Tambah Halaman' }}
                        </h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Atur identitas halaman dan informasi SEO.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="closeModal"
                        class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <form @submit.prevent="savePage">
                    <div class="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
                        <div>
                            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                Nama halaman <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="form.title"
                                required
                                maxlength="255"
                                placeholder="Contoh: Tentang Kami"
                                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                Slug URL <span class="text-red-500">*</span>
                            </label>
                            <div class="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-blue-500">
                                <span class="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                                    /
                                </span>
                                <input
                                    v-model="form.slug"
                                    required
                                    maxlength="255"
                                    placeholder="tentang-kami"
                                    class="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                                />
                            </div>
                            <p class="mt-1.5 text-xs text-slate-500">
                                Gunakan huruf kecil, angka, dan tanda hubung.
                                Slug harus unik.
                            </p>
                        </div>

                        <div class="rounded-xl border border-slate-200 p-4">
                            <div class="mb-4 flex items-center gap-2">
                                <Globe class="h-4 w-4 text-blue-600" />
                                <h3 class="text-sm font-bold text-slate-800">
                                    Pengaturan SEO
                                </h3>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                                        Meta title
                                    </label>
                                    <input
                                        v-model="form.meta_title"
                                        maxlength="255"
                                        placeholder="Judul yang tampil di mesin pencari"
                                        class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />
                                    <p class="mt-1 text-right text-xs text-slate-400">
                                        {{ form.meta_title.length }}/255
                                    </p>
                                </div>

                                <div>
                                    <label class="mb-1.5 block text-sm font-medium text-slate-700">
                                        Meta description
                                    </label>
                                    <textarea
                                        v-model="form.meta_description"
                                        rows="3"
                                        placeholder="Ringkasan isi halaman untuk mesin pencari..."
                                        class="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />
                                    <p class="mt-1 text-xs text-slate-400">
                                        Tulis ringkasan yang relevan dengan isi halaman.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Status publikasi
                                </label>
                                <select
                                    v-model="form.status"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div>
                                <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Urutan tampilan
                                </label>
                                <input
                                    v-model.number="form.sort_order"
                                    type="number"
                                    min="0"
                                    class="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <label class="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
                            <div>
                                <p class="text-sm font-semibold text-slate-800">
                                    Halaman aktif
                                </p>
                                <p class="mt-1 text-xs text-slate-500">
                                    Nonaktifkan jika halaman tidak ingin ditampilkan.
                                </p>
                            </div>

                            <input
                                v-model="form.is_active"
                                type="checkbox"
                                class="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                        </label>

                        <p class="text-xs leading-relaxed text-slate-500">
                            Catatan: status Published dan kondisi Aktif harus sama-sama
                            terpenuhi agar halaman dapat ditampilkan oleh endpoint publik
                            yang menerapkan kedua filter tersebut.
                        </p>
                    </div>

                    <div class="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            @click="closeModal"
                            :disabled="saving"
                            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="saving"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            <LoaderCircle
                                v-if="saving"
                                class="h-4 w-4 animate-spin"
                            />
                            <span>
                                {{ saving ? 'Menyimpan...' : editingPage ? 'Simpan Perubahan' : 'Buat Halaman' }}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- DELETE CONFIRMATION -->
        <div
            v-if="showDeleteModal"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            @click.self="showDeleteModal = false"
        >
            <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Trash2 class="h-6 w-6" />
                </div>

                <h2 class="mt-4 text-lg font-bold text-slate-900">
                    Hapus halaman ini?
                </h2>

                <p class="mt-2 text-sm leading-relaxed text-slate-500">
                    Halaman
                    <strong class="text-slate-800">
                        {{ selectedPage?.title }}
                    </strong>
                    akan dihapus. Pastikan halaman ini tidak lagi diperlukan.
                </p>

                <div class="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        @click="showDeleteModal = false"
                        :disabled="deleting"
                        class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="deletePage"
                        :disabled="deleting"
                        class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        <LoaderCircle
                            v-if="deleting"
                            class="h-4 w-4 animate-spin"
                        />
                        Hapus Halaman
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
