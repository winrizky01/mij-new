<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Master Partner
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola customer dan supplier MJI dalam satu master data.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003f9e]"
                @click="openCreateModal"
            >
                <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 5v14M5 12h14"
                    />
                </svg>

                Tambah Partner
            </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <!-- Total -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Total Partner
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ partners.length }}
                </p>
            </div>

            <!-- Customer -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Customer
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ customerCount }}
                </p>
            </div>

            <!-- Supplier -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Supplier
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ supplierCount }}
                </p>
            </div>

            <!-- Both -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Customer + Supplier
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ bothCount }}
                </p>
            </div>
        </div>

        <!-- Main Card -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <!-- Toolbar -->
            <div class="border-b border-gray-100 p-4">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div class="relative w-full lg:max-w-md">
                        <svg
                            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21 21l-4.35-4.35"
                            />
                        </svg>

                        <input
                            v-model="search"
                            type="text"
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#0052cc] focus:bg-white"
                            placeholder="Cari nama, kode, telepon..."
                            @keyup.enter="loadPartners"
                        />
                    </div>

                    <div class="flex gap-2 overflow-x-auto">
                        <button
                            v-for="filter in filters"
                            :key="filter.value"
                            type="button"
                            class="whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition"
                            :class="
                                activeFilter === filter.value
                                    ? 'bg-[#003366] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            "
                            @click="changeFilter(filter.value)"
                        >
                            {{ filter.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div
                v-if="loading"
                class="px-5 py-12 text-center text-sm text-gray-500"
            >
                Memuat data partner...
            </div>

            <!-- Error -->
            <div
                v-else-if="errorMessage"
                class="px-5 py-12 text-center"
            >
                <p class="text-sm text-red-600">
                    {{ errorMessage }}
                </p>

                <button
                    type="button"
                    class="mt-3 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    @click="loadPartners"
                >
                    Coba Lagi
                </button>
            </div>

            <template v-else>
                <!-- Desktop -->
                <div class="hidden overflow-x-auto md:block">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-b border-gray-100 bg-gray-50/70">
                                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Partner
                                </th>

                                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Tipe
                                </th>

                                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Contact
                                </th>

                                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Perusahaan
                                </th>

                                <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Status
                                </th>

                                <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-100">
                            <tr
                                v-for="partner in filteredPartners"
                                :key="partner.id"
                                class="transition hover:bg-gray-50"
                            >
                                <!-- Partner -->
                                <td class="px-5 py-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-semibold text-[#0052cc]"
                                        >
                                            {{ getInitial(partner.name) }}
                                        </div>

                                        <div class="min-w-0">
                                            <p class="truncate font-semibold text-gray-900">
                                                {{ partner.name }}
                                            </p>

                                            <p class="mt-0.5 text-xs text-gray-400">
                                                {{ partner.code }}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <!-- Type -->
                                <td class="px-5 py-4">
                                    <span
                                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                                        :class="typeBadgeClass(partner.type)"
                                    >
                                        {{ typeLabel(partner.type) }}
                                    </span>
                                </td>

                                <!-- Contact -->
                                <td class="px-5 py-4">
                                    <div>
                                        <p class="text-sm text-gray-700">
                                            {{ partner.phone || '-' }}
                                        </p>

                                        <p class="text-xs text-gray-400">
                                            {{ partner.email || '-' }}
                                        </p>
                                    </div>
                                </td>

                                <!-- Company -->
                                <td class="px-5 py-4 text-sm text-gray-600">
                                    {{ partner.company || '-' }}
                                </td>

                                <!-- Status -->
                                <td class="px-5 py-4">
                                    <span
                                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                                        :class="
                                            partner.is_active
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                        "
                                    >
                                        {{
                                            partner.is_active
                                                ? 'Aktif'
                                                : 'Nonaktif'
                                        }}
                                    </span>
                                </td>

                                <!-- Actions -->
                                <td class="px-5 py-4">
                                    <div class="flex justify-end gap-1.5">
                                        <!-- Detail -->
                                        <button
                                            type="button"
                                            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                            title="Detail"
                                            @click="openShowModal(partner)"
                                        >
                                            <EyeIcon class="h-4 w-4" />
                                        </button>

                                        <!-- Edit -->
                                        <button
                                            type="button"
                                            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                            title="Edit"
                                            @click="openEditModal(partner)"
                                        >
                                            <PencilIcon class="h-4 w-4" />
                                        </button>

                                        <!-- Hapus -->
                                        <button
                                            type="button"
                                            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                            title="Hapus"
                                            @click="deletePartner(partner)"
                                        >
                                            <Trash2Icon class="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="filteredPartners.length === 0">
                                <td
                                    colspan="6"
                                    class="px-5 py-12 text-center text-sm text-gray-500"
                                >
                                    Tidak ada partner yang ditemukan.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Mobile -->
                <div class="divide-y divide-gray-100 md:hidden">
                    <div
                        v-for="partner in filteredPartners"
                        :key="partner.id"
                        class="p-4"
                    >
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex min-w-0 items-center gap-3">
                                <div
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-semibold text-[#0052cc]"
                                >
                                    {{ getInitial(partner.name) }}
                                </div>

                                <div class="min-w-0">
                                    <p class="truncate font-semibold text-gray-900">
                                        {{ partner.name }}
                                    </p>

                                    <p class="text-xs text-gray-400">
                                        {{ partner.code }}
                                    </p>
                                </div>
                            </div>

                            <span
                                class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                                :class="typeBadgeClass(partner.type)"
                            >
                                {{ typeLabel(partner.type) }}
                            </span>
                        </div>

                        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p class="text-xs text-gray-400">
                                    Telepon
                                </p>

                                <p class="mt-1 text-gray-700">
                                    {{ partner.phone || '-' }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-400">
                                    Perusahaan
                                </p>

                                <p class="mt-1 truncate text-gray-700">
                                    {{ partner.company || '-' }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-4 flex items-center justify-between">
                            <span
                                class="rounded-full px-2.5 py-1 text-xs font-medium"
                                :class="
                                    partner.is_active
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                "
                            >
                                {{
                                    partner.is_active
                                        ? 'Aktif'
                                        : 'Nonaktif'
                                }}
                            </span>

                            <div class="flex gap-1.5">
                                <button
                                    type="button"
                                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                    title="Detail"
                                    @click="openShowModal(partner)"
                                >
                                    <EyeIcon class="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                    title="Edit"
                                    @click="openEditModal(partner)"
                                >
                                    <PencilIcon class="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                    title="Hapus"
                                    @click="deletePartner(partner)"
                                >
                                    <Trash2Icon class="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="filteredPartners.length === 0"
                        class="p-10 text-center text-sm text-gray-500"
                    >
                        Tidak ada partner yang ditemukan.
                    </div>
                </div>
            </template>
        </div>

        <!-- Modals -->
        <PartnerCreateModal
            :show="showCreateModal"
            @close="showCreateModal = false"
            @saved="handleCreateSaved"
        />

        <PartnerEditModal
            :show="showEditModal"
            :partner="selectedPartner"
            @close="closeEditModal"
            @saved="handleEditSaved"
        />

        <PartnerShowModal
            :show="showShowModal"
            :partner="selectedPartner"
            @close="closeShowModal"
            @edit="editFromShow"
        />
    </div>
</template>

<script setup>
import {
    EyeIcon,
    PencilIcon,
    Trash2Icon,
} from 'lucide-vue-next'

import {
    computed,
    onMounted,
    ref,
} from 'vue'

import {
    erpApi,
    getApiError,
} from '@/services/api'

import PartnerCreateModal
    from '../../components/erp/partners/PartnerCreateModal.vue'

import PartnerEditModal
    from '../../components/erp/partners/PartnerEditModal.vue'

import PartnerShowModal
    from '../../components/erp/partners/PartnerShowModal.vue'

const partners = ref([])

const loading = ref(false)
const errorMessage = ref('')

const search = ref('')
const activeFilter = ref('all')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showShowModal = ref(false)

const selectedPartner = ref(null)

const filters = [
    {
        value: 'all',
        label: 'Semua',
    },
    {
        value: 'customer',
        label: 'Customer',
    },
    {
        value: 'supplier',
        label: 'Supplier',
    },
    {
        value: 'both',
        label: 'Keduanya',
    },
]

const customerCount = computed(() => {
    return partners.value.filter(
        partner =>
            partner.type === 'customer' ||
            partner.type === 'both'
    ).length
})

const supplierCount = computed(() => {
    return partners.value.filter(
        partner =>
            partner.type === 'supplier' ||
            partner.type === 'both'
    ).length
})

const bothCount = computed(() => {
    return partners.value.filter(
        partner => partner.type === 'both'
    ).length
})

const filteredPartners = computed(() => {
    const keyword = search.value
        .trim()
        .toLowerCase()

    return partners.value.filter(partner => {
        const matchesFilter =
            activeFilter.value === 'all' ||
            partner.type === activeFilter.value

        if (!keyword) {
            return matchesFilter
        }

        const searchable = [
            partner.code,
            partner.name,
            partner.company,
            partner.phone,
            partner.email,
            partner.tax_number,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

        return (
            matchesFilter &&
            searchable.includes(keyword)
        )
    })
})

async function loadPartners() {
    loading.value = true
    errorMessage.value = ''

    try {
        const params = {
            is_active: true,
        }

        if (search.value.trim()) {
            params.search = search.value.trim()
        }

        const response = await erpApi.master.partners.list(params)

        partners.value = response?.data || []
    } catch (error) {
        errorMessage.value =
            getApiError(
                error,
                'Gagal memuat data partner.'
            )
    } finally {
        loading.value = false
    }
}

function changeFilter(value) {
    activeFilter.value = value
}

function getInitial(name) {
    if (!name) return '?'

    return name
        .trim()
        .split(' ')
        .slice(0, 2)
        .map(word =>
            word.charAt(0)
        )
        .join('')
        .toUpperCase()
}

function typeLabel(type) {
    const labels = {
        customer: 'Customer',
        supplier: 'Supplier',
        both: 'Customer + Supplier',
    }

    return labels[type] || '-'
}

function typeBadgeClass(type) {
    const classes = {
        customer:
            'bg-green-50 text-green-700',

        supplier:
            'bg-orange-50 text-orange-700',

        both:
            'bg-purple-50 text-purple-700',
    }

    return (
        classes[type] ||
        'bg-gray-100 text-gray-600'
    )
}

function openCreateModal() {
    showCreateModal.value = true
}

function openEditModal(partner) {
    selectedPartner.value = partner
    showEditModal.value = true
}

function openShowModal(partner) {
    selectedPartner.value = partner
    showShowModal.value = true
}

function closeEditModal() {
    showEditModal.value = false
    selectedPartner.value = null
}

function closeShowModal() {
    showShowModal.value = false
    selectedPartner.value = null
}

function editFromShow() {
    if (!selectedPartner.value) {
        return
    }

    showShowModal.value = false
    showEditModal.value = true
}

async function handleCreateSaved() {
    showCreateModal.value = false

    await loadPartners()
}

async function handleEditSaved() {
    showEditModal.value = false
    selectedPartner.value = null

    await loadPartners()
}

async function deletePartner(partner) {
    const confirmed =
        window.confirm(
            `Hapus partner "${partner.name}"?`
        )

    if (!confirmed) {
        return
    }

    try {
        loading.value = true

        await erpApi.master.partners.delete(
            partner.id
        )

        await loadPartners()
    } catch (error) {
        window.alert(
            getApiError(
                error,
                'Partner gagal dihapus.'
            )
        )
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadPartners()
})
</script>
