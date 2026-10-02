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
                    v-model="search"
                    type="text"
                    placeholder="Cari nomor, vendor, tujuan, atau truk..."
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="statusFilter"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua Status
                    </option>

                    <option value="draft">
                        Dibuat
                    </option>

                    <option value="scheduled">
                        Dijadwalkan
                    </option>

                    <option value="departed">
                        Berangkat
                    </option>

                    <option value="on_route">
                        Dalam Perjalanan
                    </option>

                    <option value="arrived">
                        Sampai Tujuan
                    </option>

                    <option value="completed">
                        Selesai
                    </option>
                </select>

                <input
                    v-model="dateFilter"
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
                <table class="min-w-[1250px] w-full text-sm">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Pengiriman
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Vendor
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
                        <tr
                            v-for="shipment in filteredShipments"
                            :key="shipment.id"
                            class="transition hover:bg-gray-50"
                        >
                            <td class="px-5 py-4">
                                <p class="font-semibold text-[#003366]">
                                    {{ shipment.shipmentNumber }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ formatDate(shipment.date) }}
                                </p>

                                <span
                                    v-if="shipment.hasCorrection"
                                    class="mt-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
                                >
                                    Ada Koreksi
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <p class="font-medium text-gray-900">
                                    {{ shipment.vendorName }}
                                </p>
                            </td>

                            <td class="px-5 py-4">
                                <p class="font-medium text-gray-900">
                                    {{ shipment.plateNumber }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ shipment.truckName }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    Driver: {{ shipment.driverName }}
                                </p>
                            </td>

                            <td class="px-5 py-4">
                                <p class="font-medium text-gray-900">
                                    {{ shipment.destination.companyName }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ shipment.destination.city }}
                                </p>
                            </td>

                            <td class="px-5 py-4 text-right font-semibold text-gray-900">
                                {{ formatCurrency(shipment.vendorTotal) }}
                            </td>

                            <td class="px-5 py-4 text-right font-semibold text-gray-900">
                                {{ formatCurrency(shipment.driverTotal) }}
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
                                    <button
                                        type="button"
                                        class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                        @click="openShow(shipment)"
                                    >
                                        Lihat
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0052cc] hover:bg-blue-100"
                                        @click="openEdit(shipment)"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                                        @click="openCorrection(shipment)"
                                    >
                                        Koreksi
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredShipments.length === 0">
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

        <!-- CREATE / EDIT / CORRECTION MODAL -->
        <ShipmentModal
            :show="showModal"
            :mode="modalMode"
            :shipment="selectedShipment"
            :trucks="trucks"
            :employees="employees"
            :vendors="vendors"
            :tariffs="tariffs"
            @close="closeModal"
            @saved="handleSaved"
        />

        <!-- SHOW MODAL -->
        <div
            v-if="showShowModal && selectedShipment"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @click.self="showShowModal = false"
        >
            <div class="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            {{ selectedShipment.shipmentNumber }}
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
                    <!-- STATUS -->
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <span
                            :class="statusClass(selectedShipment.status)"
                            class="rounded-full px-3 py-1.5 text-xs font-semibold"
                        >
                            {{ statusLabel(selectedShipment.status) }}
                        </span>

                        <span
                            v-if="selectedShipment.hasCorrection"
                            class="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
                        >
                            Telah Dikoreksi Admin
                        </span>
                    </div>

                    <!-- INFO -->
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div class="rounded-2xl bg-gray-50 p-5">
                            <p class="mb-4 text-sm font-bold text-[#003366]">
                                Informasi Pengiriman
                            </p>

                            <div class="space-y-3 text-sm">
                                <InfoRow label="Tanggal">
                                    {{ formatDate(selectedShipment.date) }}
                                </InfoRow>

                                <InfoRow label="Vendor">
                                    {{ selectedShipment.vendorName }}
                                </InfoRow>

                                <InfoRow label="Truk">
                                    {{ selectedShipment.truckName }}
                                    -
                                    {{ selectedShipment.plateNumber }}
                                </InfoRow>

                                <InfoRow label="Driver">
                                    {{ selectedShipment.driverName }}
                                </InfoRow>

                                <InfoRow label="Tujuan">
                                    {{ selectedShipment.destination.companyName }}
                                </InfoRow>

                                <InfoRow label="Kota">
                                    {{ selectedShipment.destination.city }}
                                </InfoRow>
                            </div>
                        </div>

                        <!-- FINANCIAL -->
                        <div class="rounded-2xl bg-gray-50 p-5">
                            <p class="mb-4 text-sm font-bold text-[#003366]">
                                Perhitungan
                            </p>

                            <div class="space-y-3 text-sm">
                                <InfoRow label="Tarif Vendor">
                                    {{ formatCurrency(selectedShipment.vendorRate) }}
                                </InfoRow>

                                <InfoRow label="Tambahan Vendor">
                                    {{ formatCurrency(selectedShipment.vendorAdditional) }}
                                </InfoRow>

                                <InfoRow label="Balen Vendor">
                                    {{ formatCurrency(selectedShipment.balen.vendorCharge) }}
                                </InfoRow>

                                <div class="border-t border-gray-200 pt-3">
                                    <InfoRow label="Total Tagihan Vendor">
                                        <strong>
                                            {{ formatCurrency(selectedShipment.vendorTotal) }}
                                        </strong>
                                    </InfoRow>
                                </div>

                                <div class="border-t border-gray-200 pt-3">
                                    <InfoRow label="Total Bayar Driver">
                                        <strong>
                                            {{ formatCurrency(selectedShipment.driverTotal) }}
                                        </strong>
                                    </InfoRow>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- CORRECTION -->
                    <div
                        v-if="selectedShipment.hasCorrection"
                        class="rounded-2xl border border-amber-200 bg-amber-50 p-5"
                    >
                        <p class="font-semibold text-amber-800">
                            Koreksi Admin
                        </p>

                        <p class="mt-2 text-sm text-amber-700">
                            {{ selectedShipment.correctionNote || '-' }}
                        </p>

                        <p class="mt-3 text-xs text-amber-600">
                            Dikoreksi oleh:
                            {{ selectedShipment.correctedBy || 'Administrator' }}
                        </p>
                    </div>

                    <!-- NOTES -->
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
import { computed, ref } from 'vue'
import InfoRow from '../../components/erp/shipments/InfoRow.vue'
import ShipmentModal from '../../components/erp/shipments/ShipmentModal.vue'

const search = ref('')
const statusFilter = ref('')
const dateFilter = ref('')

const showModal = ref(false)
const showShowModal = ref(false)

const modalMode = ref('create')
const selectedShipment = ref(null)

const vendors = ref([
    {
        id: 1,
        name: 'PT ABC Manufacturing',
    },
    {
        id: 2,
        name: 'PT Maju Bersama',
    },
    {
        id: 3,
        name: 'CV Sumber Makmur',
    },
])

const trucks = ref([
    {
        id: 1,
        code: 'TRK-001',
        name: 'Colt Diesel 01',
        plateNumber: 'L 8123 AB',
        truckType: 'Colt Diesel',
    },
    {
        id: 2,
        code: 'TRK-002',
        name: 'Colt Diesel 02',
        plateNumber: 'L 8456 CD',
        truckType: 'Colt Diesel',
    },
    {
        id: 3,
        code: 'TRK-003',
        name: 'Fuso 01',
        plateNumber: 'N 9123 EF',
        truckType: 'Fuso',
    },
])

/*
 * Nanti ini berasal dari modul Karyawan.
 * Untuk sementara mock.
 */
const employees = ref([
    {
        id: 1,
        name: 'Budi',
        position: 'Driver',
    },
    {
        id: 2,
        name: 'Joko',
        position: 'Driver',
    },
    {
        id: 3,
        name: 'Agus',
        position: 'Driver',
    },
])

const tariffs = ref([
    {
        id: 1,
        provinceId: 15,
        cityId: 3576,
        province: 'Jawa Timur',
        city: 'Kota Mojokerto',
        tariffType: 'Reguler',
        truckType: 'Colt Diesel',
        vendorRate: 850000,
        driverRate: 350000,
        vendorAdditional: 0,
        driverAdditional: 0,
        status: 'active',
    },
    {
        id: 2,
        provinceId: 15,
        cityId: 3576,
        province: 'Jawa Timur',
        city: 'Kota Mojokerto',
        tariffType: 'Khusus',
        truckType: 'Colt Diesel',
        vendorRate: 950000,
        driverRate: 400000,
        vendorAdditional: 100000,
        driverAdditional: 50000,
        status: 'active',
    },
    {
        id: 3,
        provinceId: 15,
        cityId: 3525,
        province: 'Jawa Timur',
        city: 'Kabupaten Gresik',
        tariffType: 'Reguler',
        truckType: 'Fuso',
        vendorRate: 1200000,
        driverRate: 500000,
        vendorAdditional: 0,
        driverAdditional: 0,
        status: 'active',
    },
])

const shipments = ref([
    {
        id: 1,
        shipmentNumber: 'SHP-2026-0001',
        date: '2026-10-02',

        vendorId: 1,
        vendorName: 'PT ABC Manufacturing',

        truckId: 1,
        truckName: 'Colt Diesel 01',
        plateNumber: 'L 8123 AB',

        driverId: 1,
        driverName: 'Budi',

        destination: {
            provinceId: 15,
            province: 'Jawa Timur',
            cityId: 3576,
            city: 'Kota Mojokerto',
            companyName: 'PT ABC Manufacturing',
            address: 'Jl. Raya Mojokerto',
        },

        tariffId: 1,

        vendorRate: 850000,
        vendorAdditional: 0,
        vendorCorrection: 0,

        driverRate: 350000,
        driverAdditional: 0,
        driverCorrection: 0,

        hasBalen: true,

        balen: {
            description: 'Balen dari customer',
            vendorCharge: 150000,
            driverPayment: 75000,
        },

        vendorTotal: 1000000,
        driverTotal: 425000,

        status: 'completed',

        hasCorrection: false,
        correctionNote: '',
        correctedBy: '',

        notes: 'Pengiriman selesai.',
    },
    {
        id: 2,
        shipmentNumber: 'SHP-2026-0002',
        date: '2026-10-02',

        vendorId: 2,
        vendorName: 'PT Maju Bersama',

        truckId: 3,
        truckName: 'Fuso 01',
        plateNumber: 'N 9123 EF',

        driverId: 2,
        driverName: 'Joko',

        destination: {
            provinceId: 15,
            province: 'Jawa Timur',
            cityId: 3525,
            city: 'Kabupaten Gresik',
            companyName: 'PT Maju Bersama',
            address: 'Kawasan Industri Gresik',
        },

        tariffId: 3,

        vendorRate: 1200000,
        vendorAdditional: 0,
        vendorCorrection: 0,

        driverRate: 500000,
        driverAdditional: 0,
        driverCorrection: 0,

        hasBalen: false,

        balen: {
            description: '',
            vendorCharge: 0,
            driverPayment: 0,
        },

        vendorTotal: 1200000,
        driverTotal: 500000,

        status: 'on_route',

        hasCorrection: false,
        correctionNote: '',
        correctedBy: '',

        notes: '',
    },
])

const filteredShipments = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return shipments.value.filter(shipment => {
        const matchesSearch =
            !keyword ||
            shipment.shipmentNumber.toLowerCase().includes(keyword) ||
            shipment.vendorName.toLowerCase().includes(keyword) ||
            shipment.destination.companyName.toLowerCase().includes(keyword) ||
            shipment.destination.city.toLowerCase().includes(keyword) ||
            shipment.plateNumber.toLowerCase().includes(keyword) ||
            shipment.driverName.toLowerCase().includes(keyword)

        const matchesStatus =
            !statusFilter.value ||
            shipment.status === statusFilter.value

        const matchesDate =
            !dateFilter.value ||
            shipment.date === dateFilter.value

        return (
            matchesSearch &&
            matchesStatus &&
            matchesDate
        )
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
            item => item.hasCorrection
        ).length,
        color: 'text-amber-600',
    },
    {
        label: 'Balen',
        value: shipments.value.filter(
            item => item.hasBalen
        ).length,
        color: 'text-purple-600',
    },
])

function openCreate() {
    selectedShipment.value = null
    modalMode.value = 'create'
    showModal.value = true
}

function openEdit(shipment) {
    selectedShipment.value = shipment
    modalMode.value = 'edit'
    showModal.value = true
}

function openCorrection(shipment) {
    selectedShipment.value = shipment
    modalMode.value = 'correction'
    showModal.value = true
}

function openShow(shipment) {
    selectedShipment.value = shipment
    showShowModal.value = true
}

function closeModal() {
    showModal.value = false
    selectedShipment.value = null
}

function handleSaved(payload) {
    if (payload.mode === 'create') {
        shipments.value.unshift(payload.shipment)
    }

    if (payload.mode === 'edit' || payload.mode === 'correction') {
        const index = shipments.value.findIndex(
            item => item.id === payload.shipment.id
        )

        if (index !== -1) {
            shipments.value[index] = payload.shipment
        }
    }

    closeModal()
}

function resetFilter() {
    search.value = ''
    statusFilter.value = ''
    dateFilter.value = ''
}

function statusLabel(status) {
    const labels = {
        draft: 'Dibuat',
        scheduled: 'Dijadwalkan',
        departed: 'Berangkat',
        on_route: 'Dalam Perjalanan',
        arrived: 'Sampai Tujuan',
        completed: 'Selesai',
    }

    return labels[status] || status
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

    return classes[status] || 'bg-gray-100 text-gray-600'
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0)
}

function formatDate(value) {
    if (!value) return '-'

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value))
}
</script>