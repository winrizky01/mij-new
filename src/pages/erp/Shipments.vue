<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Pengiriman
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola perjalanan truk, tujuan, tarif vendor, dan pembayaran driver.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003f9e]"
                @click="openCreate"
            >
                + Tambah Pengiriman
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <div
                v-for="item in summaryCards"
                :key="item.label"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    {{ item.label }}
                </p>

                <p
                    class="mt-2 text-2xl font-bold"
                    :class="item.color"
                >
                    {{ item.value }}
                </p>
            </div>
        </div>

        <!-- FILTER -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
                <input
                    v-model="filters.search"
                    type="text"
                    placeholder="Cari nomor, vendor, tujuan, atau truk..."
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="filters.status"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua Status
                    </option>

                    <option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </option>
                </select>

                <input
                    v-model="filters.date"
                    type="date"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                />

                <button
                    type="button"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    @click="resetFilter"
                >
                    Reset Filter
                </button>
            </div>
        </div>

        <!-- TABLE -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div class="overflow-x-auto">
                <table class="min-w-[1200px] w-full text-sm">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Pengiriman
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Truk / Driver
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Tujuan
                            </th>

                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
                                Tagihan Vendor
                            </th>

                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
                                Bayar Driver
                            </th>

                            <th class="px-5 py-4 text-center font-semibold text-gray-600">
                                Status
                            </th>

                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr v-if="loading">
                            <td
                                colspan="8"
                                class="px-5 py-12 text-center text-gray-400"
                            >
                                Memuat data pengiriman...
                            </td>
                        </tr>

                        <tr
                            v-for="shipment in filteredShipments"
                            v-else
                            :key="shipment.id"
                            class="transition hover:bg-gray-50"
                        >
                            <td class="px-5 py-4">
                                <p class="font-semibold text-[#003366]">
                                    {{ shipment.shipment_number }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ formatDate(shipment.shipment_date) }}
                                </p>

                                <span
                                    v-if="shipment.has_correction"
                                    class="mt-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
                                >
                                    Ada Koreksi
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <p class="font-medium text-gray-900">
                                    {{ shipment.truck?.plate_number || '-' }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ shipment.truck?.name || shipment.truck?.code || '-' }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    Driver:
                                    {{ shipment.driver?.name || '-' }}
                                </p>
                            </td>

                            <td class="px-5 py-4">
                                <p class="font-medium text-gray-900">
                                    {{ shipment.destination_company || '-' }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ shipment.destination_city || '-' }}
                                </p>
                            </td>

                            <td class="px-5 py-4 text-right font-semibold text-gray-900">
                                {{ formatCurrency(shipment.vendor_total) }}
                            </td>

                            <td class="px-5 py-4 text-right font-semibold text-gray-900">
                                {{ formatCurrency(shipment.driver_total) }}
                            </td>

                            <td class="px-5 py-4 text-center">
                                <span
                                    :class="statusClass(shipment.status)"
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                >
                                    {{ statusLabel(shipment.status) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <!-- LIHAT -->
                                    <button
                                        type="button"
                                        title="Lihat pengiriman"
                                        aria-label="Lihat pengiriman"
                                        class="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                                        @click="openShow(shipment)"
                                    >
                                        <EyeIcon class="h-4 w-4" />
                                    </button>

                                    <!-- EDIT -->
                                    <button
                                        type="button"
                                        title="Edit pengiriman"
                                        aria-label="Edit pengiriman"
                                        class="rounded-lg bg-blue-50 p-2 text-[#0052cc] transition hover:bg-blue-100"
                                        @click="openEdit(shipment)"
                                    >
                                        <PencilIcon class="h-4 w-4" />
                                    </button>

                                    <!-- KOREKSI -->
                                    <button
                                        type="button"
                                        title="Koreksi pengiriman"
                                        aria-label="Koreksi pengiriman"
                                        class="rounded-lg bg-amber-50 p-2 text-amber-700 transition hover:bg-amber-100"
                                        @click="openCorrection(shipment)"
                                    >
                                        <ClipboardPenIcon class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="!loading && filteredShipments.length === 0">
                            <td
                                colspan="8"
                                class="px-5 py-12 text-center text-gray-400"
                            >
                                Tidak ada data pengiriman.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- FORM MODAL -->
        <ShipmentModal
            :show="showModal"
            :mode="modalMode"
            :shipment="selectedShipment"
            @close="closeModal"
            @saved="handleSaved"
        />

        <!-- DETAIL MODAL -->
        <div
            v-if="showShowModal && selectedShipment"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @click.self="showShowModal = false"
        >
            <div class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            {{ selectedShipment.delivery_order_number }}
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Detail pengiriman
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl text-gray-400 hover:text-gray-700"
                        @click="showShowModal = false"
                    >
                        ×
                    </button>
                </div>

                <div class="space-y-6 p-6">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <span
                            :class="statusClass(selectedShipment.status)"
                            class="rounded-full px-3 py-1.5 text-xs font-semibold"
                        >
                            {{ statusLabel(selectedShipment.status) }}
                        </span>

                        <span
                            v-if="selectedShipment.has_correction"
                            class="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
                        >
                            Telah Dikoreksi Admin
                        </span>
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div class="rounded-2xl bg-gray-50 p-5">
                            <p class="mb-4 text-sm font-bold text-[#003366]">
                                Informasi Pengiriman
                            </p>

                            <div class="space-y-3 text-sm">
                                <InfoRow label="Tanggal">
                                    {{ formatDate(selectedShipment.shipment_date) }}
                                </InfoRow>

                                <InfoRow label="Vendor">
                                    {{ selectedShipment.vendor?.name || '-' }}
                                </InfoRow>

                                <InfoRow label="Truk">
                                    {{ selectedShipment.truck?.name || '-' }}
                                    -
                                    {{ selectedShipment.truck?.plate_number || '-' }}
                                </InfoRow>

                                <InfoRow label="Driver">
                                    {{ selectedShipment.driver?.name || '-' }}
                                </InfoRow>

                                <InfoRow label="Tujuan">
                                    {{ selectedShipment.destination_company || '-' }}
                                </InfoRow>

                                <InfoRow label="Kota">
                                    {{ selectedShipment.destination_city || '-' }}
                                </InfoRow>
                            </div>
                        </div>

                        <div class="rounded-2xl bg-gray-50 p-5">
                            <p class="mb-4 text-sm font-bold text-[#003366]">
                                Perhitungan
                            </p>

                            <div class="space-y-3 text-sm">
                                <InfoRow label="Tarif Vendor">
                                    {{ formatCurrency(selectedShipment.vendor_rate) }}
                                </InfoRow>

                                <InfoRow label="Tambahan Vendor">
                                    {{ formatCurrency(selectedShipment.vendor_additional) }}
                                </InfoRow>

                                <InfoRow label="Koreksi Vendor">
                                    {{ formatCurrency(selectedShipment.vendor_correction) }}
                                </InfoRow>

                                <InfoRow label="Balen Vendor">
                                    {{ formatCurrency(selectedShipment.balen_vendor_charge) }}
                                </InfoRow>

                                <div class="border-t border-gray-200 pt-3">
                                    <InfoRow label="Total Tagihan Vendor">
                                        <strong>
                                            {{ formatCurrency(selectedShipment.vendor_total) }}
                                        </strong>
                                    </InfoRow>
                                </div>

                                <InfoRow label="Total Bayar Driver">
                                    <strong>
                                        {{ formatCurrency(selectedShipment.driver_total) }}
                                    </strong>
                                </InfoRow>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="selectedShipment.has_correction"
                        class="rounded-2xl border border-amber-200 bg-amber-50 p-5"
                    >
                        <p class="font-semibold text-amber-800">
                            Koreksi Admin
                        </p>

                        <p class="mt-2 text-sm text-amber-700">
                            {{ selectedShipment.correction_note || '-' }}
                        </p>

                        <p class="mt-3 text-xs text-amber-600">
                            Dikoreksi:
                            {{ formatDateTime(selectedShipment.corrected_at) }}
                        </p>
                    </div>

                    <div>
                        <p class="mb-2 text-sm font-semibold text-gray-800">
                            Catatan
                        </p>

                        <div class="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                            {{ selectedShipment.notes || 'Tidak ada catatan.' }}
                        </div>
                    </div>
                </div>

                <div class="flex justify-end border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        @click="showShowModal = false"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
    EyeIcon,
    PencilIcon,
    ClipboardPenIcon,
} from 'lucide-vue-next'


import InfoRow from '../../components/erp/shipments/InfoRow.vue'
import ShipmentModal from '../../components/erp/shipments/ShipmentModal.vue'
import { erpApi } from '../../services/api'

const loading = ref(false)

const shipments = ref([])

const showModal = ref(false)
const showShowModal = ref(false)

const modalMode = ref('create')
const selectedShipment = ref(null)

const filters = reactive({
    search: '',
    status: '',
    date: '',
})

const statusOptions = [
    {
        value: 'draft',
        label: 'Dibuat',
    },
    {
        value: 'scheduled',
        label: 'Dijadwalkan',
    },
    {
        value: 'departed',
        label: 'Berangkat',
    },
    {
        value: 'on_route',
        label: 'Dalam Perjalanan',
    },
    {
        value: 'arrived',
        label: 'Sampai Tujuan',
    },
    {
        value: 'completed',
        label: 'Selesai',
    },
]

const filteredShipments = computed(() => {
    const keyword = filters.search
        .toLowerCase()
        .trim()

    return shipments.value.filter(shipment => {
        if (filters.status && shipment.status !== filters.status) {
            return false
        }

        if (
            filters.date &&
            shipment.shipment_date !== filters.date
        ) {
            return false
        }

        if (!keyword) {
            return true
        }

        const searchable = [
            shipment.shipment_number,
            shipment.vendor?.name,
            shipment.truck?.plate_number,
            shipment.truck?.name,
            shipment.driver?.name,
            shipment.destination_company,
            shipment.destination_city,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

        return searchable.includes(keyword)
    })
})

const summaryCards = computed(() => [
    {
        label: 'Total',
        value: shipments.value.length,
        color: 'text-gray-900',
    },
    {
        label: 'Dalam Perjalanan',
        value: shipments.value.filter(
            item => item.status === 'on_route'
        ).length,
        color: 'text-blue-600',
    },
    {
        label: 'Selesai',
        value: shipments.value.filter(
            item => item.status === 'completed'
        ).length,
        color: 'text-emerald-600',
    },
    {
        label: 'Koreksi',
        value: shipments.value.filter(
            item => item.has_correction
        ).length,
        color: 'text-amber-600',
    },
    {
        label: 'Balen',
        value: shipments.value.filter(
            item => item.has_balen
        ).length,
        color: 'text-purple-600',
    },
])

watch(
    () => [
        filters.search,
        filters.status,
        filters.date,
    ],
    () => {
        loadShipments()
    }
)

onMounted(() => {
    loadShipments()
})

async function loadShipments() {
    loading.value = true

    try {
        const response = await erpApi.shipments.list({
            search: filters.search || undefined,
            status: filters.status || undefined,
            shipment_date: filters.date || undefined,
        })

        const data = response?.data ?? response

        shipments.value = Array.isArray(data)
            ? data
            : data?.data ?? []
    } catch (error) {
        console.error(
            'Gagal memuat pengiriman:',
            error
        )

        shipments.value = []
    } finally {
        loading.value = false
    }
}

async function openCreate() {
    selectedShipment.value = null
    modalMode.value = 'create'
    showModal.value = true
}

async function openEdit(shipment) {
    selectedShipment.value = shipment
    modalMode.value = 'edit'
    showModal.value = true
}

async function openCorrection(shipment) {
    selectedShipment.value = shipment
    modalMode.value = 'correction'
    showModal.value = true
}

async function openShow(shipment) {
    try {
        const response = await erpApi.shipments.get(
            shipment.id
        )

        const data = response?.data ?? response

        selectedShipment.value =
            data?.data ?? data

        showShowModal.value = true
    } catch (error) {
        console.error(
            'Gagal memuat detail pengiriman:',
            error
        )
    }
}

function closeModal() {
    showModal.value = false
    selectedShipment.value = null
}

async function handleSaved() {
    closeModal()
    await loadShipments()
}

function resetFilter() {
    filters.search = ''
    filters.status = ''
    filters.date = ''
}

function statusLabel(status) {
    const item = statusOptions.find(
        option => option.value === status
    )

    return item?.label || status || '-'
}

function statusClass(status) {
    const classes = {
        draft: 'bg-gray-100 text-gray-600',
        scheduled: 'bg-blue-50 text-blue-700',
        departed: 'bg-indigo-50 text-indigo-700',
        on_route: 'bg-amber-50 text-amber-700',
        arrived: 'bg-purple-50 text-purple-700',
        completed: 'bg-emerald-50 text-emerald-700',
    }

    return (
        classes[status] ||
        'bg-gray-100 text-gray-600'
    )
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0))
}

function formatDate(value) {
    if (!value) return '-'

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value))
}

function formatDateTime(value) {
    if (!value) return '-'

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}
</script>