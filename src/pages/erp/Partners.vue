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
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">
                            Total Partner
                        </p>

                        <p class="mt-2 text-2xl font-bold text-gray-900">
                            {{ partners.length }}
                        </p>
                    </div>

                    <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc]">
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
                                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                            />
                            <circle cx="9" cy="7" r="4" />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">
                            Customer
                        </p>

                        <p class="mt-2 text-2xl font-bold text-gray-900">
                            {{ customerCount }}
                        </p>
                    </div>

                    <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
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
                                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                            />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">
                            Supplier
                        </p>

                        <p class="mt-2 text-2xl font-bold text-gray-900">
                            {{ supplierCount }}
                        </p>
                    </div>

                    <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
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
                                d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">
                            Customer + Supplier
                        </p>

                        <p class="mt-2 text-2xl font-bold text-gray-900">
                            {{ bothCount }}
                        </p>
                    </div>

                    <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
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
                                d="M8 7h8M8 12h8M8 17h5"
                            />
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Card -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <!-- Toolbar -->
            <div class="border-b border-gray-100 p-4">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <!-- Search -->
                    <div class="relative w-full lg:max-w-md">
                        <svg
                            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="8"
                            />
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
                        />
                    </div>

                    <!-- Filter -->
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
                            @click="activeFilter = filter.value"
                        >
                            {{ filter.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Desktop Table -->
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
                                Kota
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
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-semibold text-[#0052cc]">
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

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="typeBadgeClass(partner.type)"
                                >
                                    {{ typeLabel(partner.type) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div>
                                    <p class="text-sm text-gray-700">
                                        {{ partner.contactPerson || '-' }}
                                    </p>

                                    <p class="text-xs text-gray-400">
                                        {{ partner.phone || '-' }}
                                    </p>
                                </div>
                            </td>

                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ partner.cityName || '-' }}
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="
                                        partner.active
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                    "
                                >
                                    {{ partner.active ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-1">
                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-[#0052cc]"
                                        title="Detail"
                                        @click="openShowModal(partner)"
                                    >
                                        <svg
                                            class="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <path
                                                stroke-linecap="round"
                                                d="M12 11v5"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                d="M12 8h.01"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-400 transition hover:bg-yellow-50 hover:text-yellow-600"
                                        title="Edit"
                                        @click="openEditModal(partner)"
                                    >
                                        <svg
                                            class="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M12 20h9"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M16.5 3.5a2.12 2.12 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                        title="Hapus"
                                        @click="deletePartner(partner)"
                                    >
                                        <svg
                                            class="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M3 6h18M9 6V4h6v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredPartners.length === 0">
                            <td
                                colspan="6"
                                class="px-5 py-12 text-center"
                            >
                                <div class="text-sm text-gray-500">
                                    Tidak ada partner yang ditemukan.
                                </div>
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
                            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-semibold text-[#0052cc]">
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
                                Contact
                            </p>

                            <p class="mt-1 text-gray-700">
                                {{ partner.contactPerson || '-' }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-gray-400">
                                Kota
                            </p>

                            <p class="mt-1 text-gray-700">
                                {{ partner.cityName || '-' }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-4 flex items-center justify-between">
                        <span
                            class="rounded-full px-2.5 py-1 text-xs font-medium"
                            :class="
                                partner.active
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                            "
                        >
                            {{ partner.active ? 'Aktif' : 'Nonaktif' }}
                        </span>

                        <div class="flex gap-1">
                            <button
                                type="button"
                                class="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-[#0052cc]"
                                @click="openShowModal(partner)"
                            >
                                Detail
                            </button>

                            <button
                                type="button"
                                class="rounded-lg p-2 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600"
                                @click="openEditModal(partner)"
                            >
                                Edit
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
        </div>

        <!-- Modals -->
        <PartnerCreateModal
            :show="showCreateModal"
            :code="nextPartnerCode"
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
import { computed, ref } from 'vue'

import PartnerCreateModal from '../../components/erp/partners/PartnerCreateModal.vue'
import PartnerEditModal from '../../components/erp/partners/PartnerEditModal.vue'
import PartnerShowModal from '../../components/erp/partners/PartnerShowModal.vue'

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

const partners = ref([
    {
        id: 1,
        code: 'PT-0001',
        name: 'PT Maju Bersama',
        type: 'customer',
        phone: '081234567890',
        email: 'info@majubersama.co.id',
        contactPerson: 'Budi',
        taxNumber: '01.234.567.8-901.000',
        address: 'Jl. Raya Industri No. 10',
        provinceName: 'Jawa Timur',
        cityName: 'Surabaya',
        notes: '',
        active: true,
    },

    {
        id: 2,
        code: 'PT-0002',
        name: 'CV Supplier Jaya',
        type: 'supplier',
        phone: '081298765432',
        email: 'sales@supplierjaya.co.id',
        contactPerson: 'Andi',
        taxNumber: '02.345.678.9-012.000',
        address: 'Jl. Industri Raya No. 25',
        provinceName: 'Jawa Timur',
        cityName: 'Sidoarjo',
        notes: 'Supplier material dan sparepart.',
        active: true,
    },

    {
        id: 3,
        code: 'PT-0003',
        name: 'PT Sumber Makmur',
        type: 'both',
        phone: '081311223344',
        email: 'admin@sumbermakmur.co.id',
        contactPerson: 'Hendra',
        taxNumber: '03.456.789.0-123.000',
        address: 'Jl. Diponegoro No. 15',
        provinceName: 'Jawa Timur',
        cityName: 'Mojokerto',
        notes: 'Customer sekaligus supplier.',
        active: true,
    },

    {
        id: 4,
        code: 'PT-0004',
        name: 'CV Berkah Logistik',
        type: 'supplier',
        phone: '082233445566',
        email: 'info@berkahlogistik.co.id',
        contactPerson: 'Siti',
        taxNumber: '',
        address: 'Jl. Pergudangan No. 8',
        provinceName: 'Jawa Timur',
        cityName: 'Gresik',
        notes: '',
        active: true,
    },
])

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
    const keyword = search.value.trim().toLowerCase()

    return partners.value.filter(partner => {
        const matchesFilter =
            activeFilter.value === 'all' ||
            partner.type === activeFilter.value

        const matchesSearch =
            !keyword ||
            partner.code.toLowerCase().includes(keyword) ||
            partner.name.toLowerCase().includes(keyword) ||
            partner.phone.toLowerCase().includes(keyword) ||
            partner.email.toLowerCase().includes(keyword) ||
            partner.contactPerson.toLowerCase().includes(keyword) ||
            partner.cityName.toLowerCase().includes(keyword)

        return matchesFilter && matchesSearch
    })
})

const nextPartnerCode = computed(() => {
    const numbers = partners.value
        .map(partner => {
            const match = partner.code?.match(/(\d+)$/)

            return match
                ? Number(match[1])
                : 0
        })
        .filter(Boolean)

    const nextNumber =
        numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1

    return `PT-${String(nextNumber).padStart(4, '0')}`
})

function getInitial(name) {
    if (!name) return '?'

    return name
        .trim()
        .split(' ')
        .slice(0, 2)
        .map(word => word.charAt(0))
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
        customer: 'bg-green-50 text-green-700',
        supplier: 'bg-orange-50 text-orange-700',
        both: 'bg-purple-50 text-purple-700',
    }

    return classes[type] || 'bg-gray-100 text-gray-600'
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
    if (!selectedPartner.value) return

    showShowModal.value = false
    showEditModal.value = true
}

function handleCreateSaved(payload) {
    partners.value.unshift({
        id: Date.now(),
        ...payload,
    })

    showCreateModal.value = false
}

function handleEditSaved(payload) {
    const index = partners.value.findIndex(
        partner => partner.id === payload.id
    )

    if (index === -1) return

    partners.value[index] = {
        ...partners.value[index],
        ...payload,
    }

    showEditModal.value = false
    selectedPartner.value = null
}

function deletePartner(partner) {
    const confirmed = window.confirm(
        `Hapus partner "${partner.name}"?`
    )

    if (!confirmed) return

    partners.value = partners.value.filter(
        item => item.id !== partner.id
    )
}
</script>