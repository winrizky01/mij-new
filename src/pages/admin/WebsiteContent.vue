<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { websiteContentService } from '@/services/websiteContent'

const route = useRoute()

const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const pages = ref([])
const sections = ref([])
const selectedPageId = ref('')
const editingId = ref(null)
const showEditor = ref(false)
const imageFile = ref(null)

const defaultTypes = [
    { value: 'hero', label: 'Hero Banner' },
    { value: 'about', label: 'Tentang MJI' },
    { value: 'contact', label: 'Kontak' },
    { value: 'services', label: 'Layanan' },
    { value: 'features', label: 'Keunggulan' },
    { value: 'testimonials', label: 'Testimoni' },
    { value: 'faq', label: 'FAQ' },
    { value: 'gallery', label: 'Galeri' },
    { value: 'custom', label: 'Section Generik' },
]

const form = reactive({
    type: 'hero',
    title: '',
    subtitle: '',
    content: '',
    image: '',
    button_text: '',
    button_url: '',
    is_active: true,
    sort_order: 0,
    settings: {},
})

const pageOptions = computed(() =>
    pages.value.map(page => ({
        id: page.id,
        label: page.title || page.name || page.slug,
        slug: page.slug,
    }))
)

const currentPage = computed(() =>
    pages.value.find(
        page => String(page.id) === String(selectedPageId.value)
    )
)

const typeLabel = type =>
    defaultTypes.find(item => item.value === type)?.label || type

const backendOrigin = computed(() => {
    const base = import.meta.env.VITE_API_BASE_URL
        || import.meta.env.VITE_API_URL
        || ''

    return String(base).replace(/\/api\/?$/, '').replace(/\/$/, '')
})

function imageUrl(path) {
    if (!path) return ''
    if (/^https?:\/\//i.test(path) || path.startsWith('data:')) {
        return path
    }

    return `${backendOrigin.value}${path.startsWith('/') ? '' : '/'}${path}`
}

function resetMessages() {
    errorMessage.value = ''
    successMessage.value = ''
}

function emptyForm() {
    Object.assign(form, {
        type: 'hero',
        title: '',
        subtitle: '',
        content: '',
        image: '',
        button_text: '',
        button_url: '',
        is_active: true,
        sort_order: sections.value.length,
        settings: {},
    })

    imageFile.value = null
}

function parseSettings(settings) {
    if (!settings) return {}
    if (typeof settings === 'object' && !Array.isArray(settings)) {
        return { ...settings }
    }

    try {
        const parsed = JSON.parse(settings)
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? parsed
            : {}
    } catch {
        return {}
    }
}

async function loadPages() {
    pages.value = await websiteContentService.getPages()

    const requestedPageId = route.query.page_id
    const home = pages.value.find(page => page.slug === 'home')

    if (requestedPageId &&
        pages.value.some(page => String(page.id) === String(requestedPageId))) {
        selectedPageId.value = String(requestedPageId)
    } else if (home) {
        selectedPageId.value = String(home.id)
    } else if (pages.value.length) {
        selectedPageId.value = String(pages.value[0].id)
    }
}

async function loadSections() {
    if (!selectedPageId.value) {
        sections.value = []
        return
    }

    loading.value = true
    resetMessages()

    try {
        sections.value = await websiteContentService.getSections({
            page_id: selectedPageId.value,
        })
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message || 'Gagal memuat section.'
    } finally {
        loading.value = false
    }
}

function addSection(type = 'hero') {
    resetMessages()
    emptyForm()
    form.type = type
    form.sort_order = sections.value.length
    editingId.value = null
    showEditor.value = true
}

function editSection(section) {
    resetMessages()
    emptyForm()

    editingId.value = section.id

    Object.assign(form, {
        type: section.type || 'custom',
        title: section.title || '',
        subtitle: section.subtitle || '',
        content: section.content || '',
        image: section.image || '',
        button_text: section.button_text || '',
        button_url: section.button_url || '',
        is_active: Boolean(section.is_active),
        sort_order: Number(section.sort_order || 0),
        settings: parseSettings(section.settings),
    })

    form.settings.statsText = JSON.stringify(
        parseSettings(section.settings).stats || [],
        null,
        2
    )
    showEditor.value = true
}

function changeType(value) {
    form.type = value
    // Jangan menghapus settings ketika tipe berubah.
}

function parseGenericSettings() {
    let settings = form.settings

    if (typeof settings === 'string') {
        try {
            settings = JSON.parse(settings)
        } catch {
            throw new Error('Format JSON settings tidak valid.')
        }
    }

    if (
        !settings ||
        Array.isArray(settings) ||
        typeof settings !== 'object'
    ) {
        throw new Error('Settings harus berupa object JSON.')
    }

    settings = { ...settings }

    // statsText hanya field bantu form, bukan data database.
    if (Object.prototype.hasOwnProperty.call(settings, 'statsText')) {
        try {
            settings.stats = typeof settings.statsText === 'string'
                ? JSON.parse(settings.statsText)
                : settings.statsText

            if (!Array.isArray(settings.stats)) {
                throw new Error('Statistik harus berupa JSON array.')
            }

            delete settings.statsText
        } catch (error) {
            throw new Error(
                error.message || 'Format statistik tidak valid.'
            )
        }
    }

    return settings
}

async function uploadSelectedImage() {
    if (!imageFile.value) return

    uploading.value = true
    resetMessages()

    try {
        const result = await websiteContentService.uploadImage(imageFile.value)
        const url = result?.url || result?.path

        if (!url) {
            throw new Error('Respons upload tidak memiliki url atau path.')
        }

        form.image = url
        imageFile.value = null
        successMessage.value = 'Gambar berhasil diunggah.'
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message ||
            error.message ||
            'Upload gambar gagal.'
    } finally {
        uploading.value = false
    }
}

async function saveSection() {
    resetMessages()

    if (!selectedPageId.value) {
        errorMessage.value = 'Pilih halaman terlebih dahulu.'
        return
    }

    if (!/^[a-z][a-z0-9_-]*$/.test(form.type)) {
        errorMessage.value =
            'Slug tipe harus dimulai huruf kecil dan hanya berisi huruf, angka, _ atau -.'
        return
    }

    saving.value = true

    try {
        const payload = {
            page_id: Number(selectedPageId.value),
            type: form.type,
            title: form.title || null,
            subtitle: form.subtitle || null,
            content: form.content || null,
            image: form.image || null,
            button_text: form.button_text || null,
            button_url: form.button_url || null,
            is_active: Boolean(form.is_active),
            sort_order: Number(form.sort_order || 0),
            settings: parseGenericSettings(),
        }

        if (editingId.value) {
            await websiteContentService.updateSection(editingId.value, payload)
            successMessage.value = 'Section berhasil diperbarui.'
        } else {
            await websiteContentService.createSection(payload)
            successMessage.value = 'Section berhasil ditambahkan.'
        }

        showEditor.value = false
        await loadSections()
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message ||
            error.message ||
            'Gagal menyimpan section.'
    } finally {
        saving.value = false
    }
}

async function toggleActive(section) {
    resetMessages()

    try {
        await websiteContentService.updateSection(section.id, {
            page_id: section.page_id,
            type: section.type,
            title: section.title,
            subtitle: section.subtitle,
            content: section.content,
            image: section.image,
            button_text: section.button_text,
            button_url: section.button_url,
            sort_order: section.sort_order,
            settings: parseSettings(section.settings),
            is_active: !section.is_active,
        })

        await loadSections()
        successMessage.value = 'Status section berhasil diperbarui.'
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message || 'Gagal mengubah status section.'
    }
}

async function deleteSection(section) {
    if (!window.confirm(`Hapus section "${section.title || section.type}"?`)) {
        return
    }

    resetMessages()

    try {
        await websiteContentService.deleteSection(section.id)
        await loadSections()
        successMessage.value = 'Section berhasil dihapus.'
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message || 'Gagal menghapus section.'
    }
}

async function moveSection(index, direction) {
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= sections.value.length) return

    const original = [...sections.value]
    const reordered = [...sections.value]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(nextIndex, 0, moved)

    sections.value = reordered

    try {
        await websiteContentService.reorderSections(
            Number(selectedPageId.value),
            reordered
        )
        await loadSections()
        successMessage.value = 'Urutan section berhasil disimpan.'
    } catch (error) {
        sections.value = original
        errorMessage.value =
            error.response?.data?.message || 'Gagal menyimpan urutan section.'
    }
}

watch(selectedPageId, async () => {
    showEditor.value = false
    await loadSections()
})

onMounted(async () => {
    try {
        await loadPages()
        await loadSections()
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message || 'Gagal memuat CMS website.'
    }
})
</script>

<template>
    <div class="space-y-6">
        <header class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">
                    Website CMS
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Kelola konten dan urutan section setiap halaman website MJI.
                </p>
            </div>

            <button
                type="button"
                class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                @click="addSection()"
            >
                + Tambah Section
            </button>
        </header>

        <div class="rounded-2xl border border-slate-200 bg-white p-4">
            <label class="mb-2 block text-sm font-semibold text-slate-700">
                Halaman website
            </label>

            <select
                v-model="selectedPageId"
                class="w-full rounded-xl border border-slate-300 px-3 py-2.5 md:max-w-md"
            >
                <option value="" disabled>Pilih halaman</option>
                <option
                    v-for="page in pageOptions"
                    :key="page.id"
                    :value="String(page.id)"
                >
                    {{ page.label }} — /{{ page.slug }}
                </option>
            </select>

            <p v-if="currentPage" class="mt-2 text-xs text-slate-500">
                Slug halaman: /{{ currentPage.slug }}
            </p>
        </div>

        <div
            v-if="errorMessage"
            role="alert"
            class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
            {{ errorMessage }}
        </div>

        <div
            v-if="successMessage"
            role="status"
            class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
            {{ successMessage }}
        </div>

        <div v-if="loading" class="py-12 text-center text-slate-500">
            Memuat section...
        </div>

        <div
            v-else-if="!sections.length"
            class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"
        >
            <h2 class="font-semibold text-slate-800">Belum ada section</h2>
            <p class="mt-2 text-sm text-slate-500">
                Tambahkan Hero, Tentang, Kontak, atau tipe section lainnya.
            </p>
            <button
                class="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                @click="addSection('hero')"
            >
                Buat section pertama
            </button>
        </div>

        <div v-else class="space-y-3">
            <article
                v-for="(section, index) in sections"
                :key="section.id"
                class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center"
            >
                <div class="flex items-center gap-3 md:w-20">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600">
                        {{ index + 1 }}
                    </div>

                    <div class="flex flex-col gap-1">
                        <button
                            :disabled="index === 0"
                            title="Naikkan urutan"
                            class="text-slate-500 hover:text-blue-600 disabled:opacity-30"
                            @click="moveSection(index, -1)"
                        >
                            ↑
                        </button>
                        <button
                            :disabled="index === sections.length - 1"
                            title="Turunkan urutan"
                            class="text-slate-500 hover:text-blue-600 disabled:opacity-30"
                            @click="moveSection(index, 1)"
                        >
                            ↓
                        </button>
                    </div>
                </div>

                <img
                    v-if="section.image"
                    :src="imageUrl(section.image)"
                    :alt="section.title || section.type"
                    class="h-20 w-28 rounded-lg border border-slate-200 object-cover"
                />

                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                        <h2 class="font-semibold text-slate-900">
                            {{ section.title || typeLabel(section.type) }}
                        </h2>
                        <span class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {{ section.type }}
                        </span>
                        <span
                            :class="section.is_active
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'"
                            class="rounded-full px-2 py-1 text-xs font-medium"
                        >
                            {{ section.is_active ? 'Aktif' : 'Nonaktif' }}
                        </span>
                    </div>

                    <p class="mt-1 line-clamp-2 text-sm text-slate-500">
                        {{ section.subtitle || section.content || 'Belum ada deskripsi.' }}
                    </p>

                    <p class="mt-1 text-xs text-slate-400">
                        ID: {{ section.id }} · Urutan: {{ section.sort_order }}
                    </p>
                </div>

                <div class="flex flex-wrap gap-2">
                    <button
                        class="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                        @click="editSection(section)"
                    >
                        Edit
                    </button>

                    <button
                        class="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                        @click="toggleActive(section)"
                    >
                        {{ section.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                    </button>

                    <button
                        class="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        @click="deleteSection(section)"
                    >
                        Hapus
                    </button>
                </div>
            </article>
        </div>

        <div
            v-if="showEditor"
            class="rounded-2xl border border-slate-200 bg-white p-5 md:p-6"
        >
            <div class="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h2 class="text-lg font-bold text-slate-900">
                        {{ editingId ? 'Edit Section' : 'Tambah Section' }}
                    </h2>
                    <p class="mt-1 text-sm text-slate-500">
                        Field disimpan ke website_sections dan settings.
                    </p>
                </div>
                <button
                    class="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
                    @click="showEditor = false"
                >
                    Tutup
                </button>
            </div>

            <form class="space-y-5" @submit.prevent="saveSection">
                <div class="grid gap-4 md:grid-cols-2">
                    <div>
                        <label class="mb-2 block text-sm font-medium">Tipe section</label>
                        <input
                            :value="form.type"
                            list="website-section-types"
                            required
                            pattern="[a-z][a-z0-9_-]*"
                            maxlength="80"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            @input="changeType($event.target.value)"
                        />
                        <datalist id="website-section-types">
                            <option
                                v-for="type in defaultTypes"
                                :key="type.value"
                                :value="type.value"
                            >
                                {{ type.label }}
                            </option>
                        </datalist>
                        <p class="mt-1 text-xs text-slate-500">
                            Bisa memilih tipe yang tersedia atau mengetik slug baru.
                        </p>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">Judul</label>
                        <input
                            v-model="form.title"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            placeholder="Judul section"
                        />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">Subjudul</label>
                        <input
                            v-model="form.subtitle"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            placeholder="Subjudul"
                        />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">Urutan</label>
                        <input
                            v-model.number="form.sort_order"
                            type="number"
                            min="0"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                        />
                    </div>
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium">Konten / deskripsi</label>
                    <textarea
                        v-model="form.content"
                        rows="4"
                        class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                        placeholder="Isi konten section"
                    />
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium">Gambar</label>
                    <div class="flex flex-col gap-3 md:flex-row">
                        <input
                            v-model="form.image"
                            class="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5"
                            placeholder="/storage/website/..."
                        />
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            class="block w-full text-sm md:max-w-xs"
                            @change="imageFile = $event.target.files?.[0] || null"
                        />
                        <button
                            type="button"
                            :disabled="!imageFile || uploading"
                            class="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:opacity-50"
                            @click="uploadSelectedImage"
                        >
                            {{ uploading ? 'Mengunggah...' : 'Upload' }}
                        </button>
                    </div>

                    <img
                        v-if="form.image"
                        :src="imageUrl(form.image)"
                        alt="Preview gambar section"
                        class="mt-3 max-h-48 rounded-xl border border-slate-200 object-contain"
                    />
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                    <div>
                        <label class="mb-2 block text-sm font-medium">Teks tombol</label>
                        <input
                            v-model="form.button_text"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            placeholder="Hubungi Kami"
                        />
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-medium">URL tombol</label>
                        <input
                            v-model="form.button_url"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            placeholder="/contact"
                        />
                    </div>
                </div>

                <div
                    v-if="form.type === 'about'"
                    class="space-y-4 rounded-xl border border-slate-200 p-4"
                >
                    <h3 class="font-semibold">Pengaturan Tentang MJI</h3>

                    <div>
                        <label class="mb-2 block text-sm font-medium">Visi</label>
                        <textarea
                            v-model="form.settings.vision"
                            rows="2"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                        />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">Misi</label>
                        <textarea
                            v-model="form.settings.mission"
                            rows="3"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                        />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium">Statistik (JSON array)</label>
                        <textarea
                            v-model="form.settings.statsText"
                            rows="3"
                            class="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm"
                            placeholder='[{"label":"Pengalaman","value":"10+ tahun"}]'
                        />
                        <p class="mt-1 text-xs text-slate-500">
                            Jika statsText diisi, isinya akan divalidasi sebagai JSON saat disimpan.
                        </p>
                    </div>
                </div>

                <div
                    v-if="form.type === 'contact'"
                    class="space-y-4 rounded-xl border border-slate-200 p-4"
                >
                    <h3 class="font-semibold">Informasi Kontak</h3>

                    <div class="grid gap-4 md:grid-cols-2">
                        <div>
                            <label class="mb-2 block text-sm font-medium">Alamat</label>
                            <textarea
                                v-model="form.settings.address"
                                rows="2"
                                class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            />
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium">Email</label>
                            <input
                                v-model="form.settings.email"
                                type="email"
                                class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            />
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium">Telepon</label>
                            <input
                                v-model="form.settings.phone"
                                class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            />
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium">WhatsApp</label>
                            <input
                                v-model="form.settings.whatsapp"
                                class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            />
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium">Instagram</label>
                            <input
                                v-model="form.settings.instagram"
                                class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            />
                        </div>
                        <div>
                            <label class="mb-2 block text-sm font-medium">Facebook</label>
                            <input
                                v-model="form.settings.facebook"
                                class="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                            />
                        </div>
                    </div>
                </div>

                <div
                    v-if="!['hero', 'about', 'contact'].includes(form.type)"
                    class="space-y-3 rounded-xl border border-slate-200 p-4"
                >
                    <h3 class="font-semibold">Pengaturan tambahan</h3>
                    <p class="text-sm text-slate-500">
                        Masukkan object JSON. Data ini tersedia untuk renderer section publik.
                    </p>
                    <textarea
                        :value="JSON.stringify(form.settings, null, 2)"
                        rows="8"
                        class="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm"
                        @change="() => {
                            try {
                                const parsed = JSON.parse($event.target.value)
                                if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
                                    throw new Error('Settings harus object JSON')
                                }
                                form.settings = parsed
                            } catch (error) {
                                errorMessage = error.message
                            }
                        }"
                    />
                </div>

                <label class="flex items-center gap-3">
                    <input
                        v-model="form.is_active"
                        type="checkbox"
                        class="h-4 w-4 rounded border-slate-300"
                    />
                    <span class="text-sm font-medium text-slate-700">
                        Tampilkan section di website publik
                    </span>
                </label>

                <div class="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
                    <button
                        type="submit"
                        :disabled="saving || uploading"
                        class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {{ saving ? 'Menyimpan...' : 'Simpan Section' }}
                    </button>
                    <button
                        type="button"
                        class="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium"
                        @click="showEditor = false"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
