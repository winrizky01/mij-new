<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Kelola Layanan</h1>
                <p class="mt-1 text-sm text-gray-500">
                    Kelola layanan yang ditampilkan pada website MJI.
                </p>
            </div>

            <button
                type="button"
                @click="openForm()"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3] disabled:opacity-50"
            >
                <Plus :size="18" />
                Tambah Layanan
            </button>
        </div>

        <!-- Search & Filter -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="flex flex-col gap-3 sm:flex-row">
                <div class="relative flex-1">
                    <Search
                        :size="18"
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        v-model="search"
                        type="search"
                        placeholder="Cari nama atau deskripsi layanan..."
                        class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <select
                    v-model="statusFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
            </div>
        </div>

        <!-- Loading -->
        <div
            v-if="loading"
            class="flex items-center justify-center gap-3 rounded-2xl border bg-white py-16 text-sm text-gray-500"
        >
            <LoaderCircle :size="20" class="animate-spin" />
            Memuat data layanan...
        </div>

        <!-- Error -->
        <div
            v-else-if="loadError"
            class="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
        >
            <p class="font-semibold">Gagal memuat layanan</p>
            <p class="mt-1">{{ loadError }}</p>
            <button
                type="button"
                @click="fetchServices"
                class="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 font-medium hover:bg-red-100"
            >
                Coba lagi
            </button>
        </div>

        <!-- Cards -->
        <div
            v-else-if="filteredServices.length"
            class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
            <article
                v-for="service in filteredServices"
                :key="service.id"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-100 hover:shadow-md"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0052cc]">
                        <component
                            :is="getIconComponent(service.icon)"
                            :size="25"
                            :stroke-width="1.8"
                        />
                    </div>

                    <span
                        class="rounded-full px-3 py-1 text-xs font-medium"
                        :class="service.is_active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'"
                    >
                        {{ service.is_active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                </div>

                <h2 class="mt-5 font-semibold text-gray-900">
                    {{ service.name }}
                </h2>

                <p class="mt-2 min-h-12 whitespace-pre-line text-sm leading-6 text-gray-500">
                    {{ service.short_description || service.description || 'Belum ada deskripsi.' }}
                </p>

                <div class="mt-4 flex items-center justify-between gap-3 text-xs text-gray-400">
                    <span>Urutan {{ service.sort_order }}</span>
                    <span class="truncate">{{ service.slug }}</span>
                </div>

                <div class="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        @click="openForm(service)"
                        class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Pencil :size="15" />
                        Edit
                    </button>

                    <button
                        type="button"
                        @click="toggleService(service)"
                        :disabled="busyId === service.id"
                        class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {{ service.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                    </button>

                    <button
                        type="button"
                        @click="deleteService(service)"
                        :disabled="busyId === service.id"
                        aria-label="Hapus layanan"
                        class="grid size-9 shrink-0 place-items-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                        <Trash2 :size="17" />
                    </button>
                </div>
            </article>
        </div>

        <!-- Empty -->
        <div
            v-else
            class="rounded-2xl border border-gray-100 bg-white px-5 py-14 text-center shadow-sm"
        >
            <Wrench :size="36" class="mx-auto text-gray-300" />
            <p class="mt-4 text-sm font-semibold text-gray-900">
                Layanan tidak ditemukan
            </p>
            <p class="mt-1 text-xs text-gray-500">
                Coba ubah kata pencarian atau filter status.
            </p>
        </div>

        <!-- Create / Edit Modal -->
        <Teleport to="body">
            <div
                v-if="showForm"
                class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
                @click.self="closeForm"
                @keydown.esc="closeForm"
            >
                <section
                    class="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="editingService ? 'Edit layanan' : 'Tambah layanan'"
                >
                    <!-- Modal Header -->
                    <div class="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                        <div>
                            <h2 class="text-lg font-bold text-gray-900">
                                {{ editingService ? 'Edit Layanan' : 'Tambah Layanan' }}
                            </h2>
                            <p class="mt-1 text-sm text-gray-500">
                                Lengkapi informasi layanan website MJI.
                            </p>
                        </div>

                        <button
                            type="button"
                            @click="closeForm"
                            class="grid size-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"
                            aria-label="Tutup modal"
                        >
                            <X :size="20" />
                        </button>
                    </div>

                    <form @submit.prevent="saveService">
                        <div class="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                            <div
                                v-if="formError"
                                class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {{ formError }}
                            </div>

                            <!-- Icon Picker -->
                            <div>
                                <label class="mb-2 block text-sm font-medium text-gray-700">
                                    Icon layanan
                                </label>

                                <div class="flex items-center gap-3">
                                    <div class="grid size-14 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-[#0052cc]">
                                        <component
                                            :is="getIconComponent(form.icon)"
                                            :size="29"
                                            :stroke-width="1.8"
                                        />
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <p class="truncate text-sm font-semibold text-gray-900">
                                            {{ form.icon || 'Wrench' }}
                                        </p>
                                        <p class="mt-1 text-xs text-gray-500">
                                            Pilih icon dari koleksi Lucide.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        @click="showIconPicker = !showIconPicker"
                                        class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        {{ showIconPicker ? 'Tutup' : 'Pilih Icon' }}
                                    </button>
                                </div>

                                <!-- Searchable icon picker -->
                                <div
                                    v-if="showIconPicker"
                                    class="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                                >
                                    <div class="relative">
                                        <Search
                                            :size="16"
                                            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            v-model="iconSearch"
                                            type="search"
                                            placeholder="Cari icon, contoh: truck, code, wrench..."
                                            class="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <p class="mb-2 mt-3 text-xs text-gray-500">
                                        {{ filteredIcons.length }} icon cocok
                                        <span v-if="filteredIcons.length > iconDisplayLimit">
                                            · Menampilkan {{ iconDisplayLimit }} pertama, persempit pencarian untuk lainnya.
                                        </span>
                                    </p>

                                    <div class="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6 md:grid-cols-8">
                                        <button
                                            v-for="item in displayedIcons"
                                            :key="item.name"
                                            type="button"
                                            :title="item.name"
                                            @click="selectIcon(item.name)"
                                            class="flex min-w-0 flex-col items-center gap-1 rounded-lg border p-2 transition"
                                            :class="form.icon === item.name
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                                : 'border-transparent bg-white text-gray-600 hover:border-gray-200 hover:bg-blue-50'"
                                        >
                                            <component :is="item.component" :size="21" />
                                            <span class="w-full truncate text-[10px]">
                                                {{ item.name }}
                                            </span>
                                        </button>
                                    </div>

                                    <p
                                        v-if="!filteredIcons.length"
                                        class="py-6 text-center text-sm text-gray-500"
                                    >
                                        Icon tidak ditemukan. Coba kata kunci lain.
                                    </p>
                                </div>
                            </div>

                            <!-- Name -->
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                    Nama layanan <span class="text-red-500">*</span>
                                </label>
                                <input
                                    v-model.trim="form.name"
                                    type="text"
                                    maxlength="255"
                                    required
                                    placeholder="Contoh: Trucking"
                                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                                />
                            </div>

                            <!-- Slug -->
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                    Slug
                                </label>
                                <input
                                    v-model.trim="form.slug"
                                    type="text"
                                    maxlength="255"
                                    placeholder="trucking (otomatis jika kosong)"
                                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                                />
                                <p class="mt-1 text-xs text-gray-400">
                                    Digunakan sebagai identitas URL layanan.
                                </p>
                            </div>

                            <!-- Short description -->
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                    Deskripsi singkat
                                </label>
                                <input
                                    v-model="form.short_description"
                                    type="text"
                                    maxlength="255"
                                    placeholder="Ringkasan layanan untuk kartu website"
                                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                                />
                            </div>

                            <!-- Description -->
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                    Deskripsi lengkap
                                </label>
                                <textarea
                                    v-model="form.description"
                                    rows="4"
                                    placeholder="Jelaskan layanan secara lengkap..."
                                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                                />
                            </div>

                            <!-- Order & Status -->
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                        Urutan tampil
                                    </label>
                                    <input
                                        v-model.number="form.sort_order"
                                        type="number"
                                        min="0"
                                        step="1"
                                        class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                                    />
                                </div>

                                <div class="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                                    <div>
                                        <p class="text-sm font-medium text-gray-800">
                                            Status layanan
                                        </p>
                                        <p class="mt-1 text-xs text-gray-500">
                                            {{ form.is_active ? 'Aktif' : 'Nonaktif' }}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        role="switch"
                                        :aria-checked="form.is_active"
                                        @click="form.is_active = !form.is_active"
                                        class="relative h-6 w-11 rounded-full transition"
                                        :class="form.is_active ? 'bg-[#0052cc]' : 'bg-gray-300'"
                                    >
                                        <span
                                            class="absolute top-1 size-4 rounded-full bg-white shadow-sm transition"
                                            :class="form.is_active ? 'left-6' : 'left-1'"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                            <button
                                type="button"
                                @click="closeForm"
                                :disabled="saving"
                                class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                :disabled="saving"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <LoaderCircle
                                    v-if="saving"
                                    :size="16"
                                    class="animate-spin"
                                />
                                {{ saving ? 'Menyimpan...' : (editingService ? 'Simpan Perubahan' : 'Tambah Layanan') }}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    LoaderCircle,
    Wrench,
    Truck,
    Code,
    ChartNoAxesCombined,
    Smartphone,
    Globe,
    BriefcaseBusiness,
    Settings,
    Building2,
    Monitor,
    Database,
    Package,
    ShieldCheck,
    Headset,
    Lightbulb,
    Hammer,
    HardHat,
    Palette,
    Megaphone,
    ShoppingCart,
    Wallet,
    Handshake,
    Users,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    FileText,
    Cog,
    Boxes,
    Network,
    Cloud,
    Zap,
    Rocket,
    HeartHandshake,
    CircleHelp,
} from 'lucide-vue-next'
import api from '@/services/api'

const services = ref([])
const loading = ref(false)
const loadError = ref('')
const search = ref('')
const statusFilter = ref('all')

const showForm = ref(false)
const showIconPicker = ref(false)
const iconSearch = ref('')
const editingService = ref(null)
const saving = ref(false)
const formError = ref('')
const busyId = ref(null)

const iconDisplayLimit = 120

const form = reactive({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    icon: 'Wrench',
    sort_order: 0,
    is_active: true,
})

/*
 * Ambil komponen icon Lucide yang diekspor oleh lucide-vue-next.
 * Hanya komponen yang nama internalnya cocok dengan nama export
 * yang dimasukkan ke dalam pilihan icon.
 */

const iconOptions = [
    ['Wrench', Wrench],
    ['Truck', Truck],
    ['Code', Code],
    ['ChartNoAxesCombined', ChartNoAxesCombined],
    ['Smartphone', Smartphone],
    ['Globe', Globe],
    ['BriefcaseBusiness', BriefcaseBusiness],
    ['Settings', Settings],
    ['Building2', Building2],
    ['Monitor', Monitor],
    ['Database', Database],
    ['Package', Package],
    ['ShieldCheck', ShieldCheck],
    ['Headset', Headset],
    ['Lightbulb', Lightbulb],
    ['Hammer', Hammer],
    ['HardHat', HardHat],
    ['Palette', Palette],
    ['Megaphone', Megaphone],
    ['ShoppingCart', ShoppingCart],
    ['Wallet', Wallet],
    ['Handshake', Handshake],
    ['Users', Users],
    ['Mail', Mail],
    ['Phone', Phone],
    ['MapPin', MapPin],
    ['CalendarDays', CalendarDays],
    ['FileText', FileText],
    ['Cog', Cog],
    ['Boxes', Boxes],
    ['Network', Network],
    ['Cloud', Cloud],
    ['Zap', Zap],
    ['Rocket', Rocket],
    ['HeartHandshake', HeartHandshake],
    ['CircleHelp', CircleHelp],
].map(([name, component]) => ({ name, component }))

const filteredIcons = computed(() => {
    const keyword = iconSearch.value.trim().toLowerCase()

    if (!keyword) return iconOptions

    return iconOptions.filter(item =>
        item.name.toLowerCase().includes(keyword)
    )
})

const displayedIcons = computed(() =>
    filteredIcons.value.slice(0, iconDisplayLimit)
)

function getIconComponent(name) {
    return iconOptions.find(item => item.name === name)?.component || Wrench
}

function selectIcon(name) {
    form.icon = name
    showIconPicker.value = false
}


const filteredServices = computed(() => {
    const keyword = search.value.trim().toLowerCase()

    return services.value
        .filter(service => {
            const searchable = [
                service.name,
                service.slug,
                service.short_description,
                service.description,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            const matchesSearch =
                !keyword || searchable.includes(keyword)

            const matchesStatus =
                statusFilter.value === 'all' ||
                (statusFilter.value === 'active' && service.is_active) ||
                (statusFilter.value === 'inactive' && !service.is_active)

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => a.sort_order - b.sort_order)
})

function normalizeService(item) {
    return {
        ...item,
        id: item.id,
        name: item.name ?? '',
        slug: item.slug ?? '',
        short_description: item.short_description ?? '',
        description: item.description ?? '',
        icon: item.icon || 'Wrench',
        sort_order: Number(item.sort_order ?? 0),
        is_active: Boolean(item.is_active),
    }
}

async function fetchServices() {
    loading.value = true
    loadError.value = ''

    try {
        const response = await api.get('/website/services', {
            params: { per_page: 100 },
        })

        const body = response.data
        const rows = Array.isArray(body)
            ? body
            : Array.isArray(body?.data)
                ? body.data
                : []

        services.value = rows.map(normalizeService)
    } catch (error) {
        loadError.value =
            error.response?.data?.message ||
            'Tidak dapat mengambil data layanan dari server.'
    } finally {
        loading.value = false
    }
}

function resetForm() {
    form.name = ''
    form.slug = ''
    form.short_description = ''
    form.description = ''
    form.icon = 'Wrench'
    form.sort_order = services.value.length
        ? Math.max(...services.value.map(item => item.sort_order)) + 1
        : 0
    form.is_active = true

    formError.value = ''
    iconSearch.value = ''
    showIconPicker.value = false
}

function openForm(service = null) {
    resetForm()
    editingService.value = service

    if (service) {
        Object.assign(form, {
            name: service.name,
            slug: service.slug,
            short_description: service.short_description,
            description: service.description,
            icon: service.icon || 'Wrench',
            sort_order: service.sort_order,
            is_active: service.is_active,
        })
    }

    showForm.value = true
}

function closeForm() {
    if (saving.value) return

    showForm.value = false
    showIconPicker.value = false
    editingService.value = null
    formError.value = ''
}

function generateSlug(value) {
    return value
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

async function saveService() {
    formError.value = ''

    if (!form.name.trim()) {
        formError.value = 'Nama layanan wajib diisi.'
        return
    }

    const sortOrder = Number(form.sort_order)

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
        formError.value = 'Urutan harus berupa bilangan bulat minimal 0.'
        return
    }

    const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || generateSlug(form.name),
        short_description: form.short_description.trim() || null,
        description: form.description.trim() || null,
        icon: form.icon || 'Wrench',
        sort_order: sortOrder,
        is_active: form.is_active,
    }

    saving.value = true

    try {
        if (editingService.value) {
            await api.patch(
                `/website/services/${editingService.value.id}`,
                payload
            )
        } else {
            await api.post('/website/services', payload)
        }

        closeForm()
        await fetchServices()
    } catch (error) {
        const errors = error.response?.data?.errors
        const firstValidationError = errors
            ? Object.values(errors).flat()[0]
            : null

        formError.value =
            firstValidationError ||
            error.response?.data?.message ||
            'Gagal menyimpan layanan. Periksa koneksi dan validasi server.'
    } finally {
        saving.value = false
    }
}

async function toggleService(service) {
    const previousStatus = service.is_active
    busyId.value = service.id

    // Optimistic UI
    service.is_active = !previousStatus

    try {
        await api.patch(`/website/services/${service.id}`, {
            is_active: service.is_active,
        })
    } catch (error) {
        service.is_active = previousStatus

        window.alert(
            error.response?.data?.message ||
            'Gagal mengubah status layanan.'
        )
    } finally {
        busyId.value = null
    }
}

async function deleteService(service) {
    const confirmed = window.confirm(
        `Hapus layanan "${service.name}"? Tindakan ini tidak dapat dibatalkan.`
    )

    if (!confirmed) return

    busyId.value = service.id

    try {
        await api.delete(`/website/services/${service.id}`)
        services.value = services.value.filter(
            item => item.id !== service.id
        )
    } catch (error) {
        window.alert(
            error.response?.data?.message ||
            'Gagal menghapus layanan.'
        )
    } finally {
        busyId.value = null
    }
}

onMounted(fetchServices)
</script>