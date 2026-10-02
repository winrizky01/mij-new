<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Stok Barang
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Monitor ketersediaan barang di setiap gudang.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00457f]"
                @click="openAdjustment"
            >
                <span class="text-lg leading-none">+</span>
                Penyesuaian Stok
            </button>
        </div>

        <!-- STATS -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
                v-for="stat in stats"
                :key="stat.label"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-sm text-gray-500">
                            {{ stat.label }}
                        </p>

                        <p class="mt-2 text-2xl font-bold text-gray-900">
                            {{ stat.value }}
                        </p>

                        <p class="mt-1 text-xs text-gray-400">
                            {{ stat.description }}
                        </p>
                    </div>

                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                        :class="stat.iconClass"
                    >
                        {{ stat.icon }}
                    </div>
                </div>
            </div>
        </div>

        <!-- FILTER -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <!-- SEARCH -->
                <div class="relative xl:col-span-2">
                    <input
                        v-model="filters.search"
                        type="text"
                        placeholder="Cari kode atau nama barang..."
                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 pl-10 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                    />

                    <span
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                        ⌕
                    </span>
                </div>

                <!-- KLASIFIKASI -->
                <select
                    v-model="filters.classification"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">Semua klasifikasi</option>
                    <option value="barang">Barang</option>
                    <option value="asset">Asset</option>
                    <option value="jasa">Jasa</option>
                </select>

                <!-- GUDANG -->
                <select
                    v-model="filters.warehouse"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">Semua gudang</option>

                    <option
                        v-for="warehouse in warehouses"
                        :key="warehouse"
                        :value="warehouse"
                    >
                        {{ warehouse }}
                    </option>
                </select>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
                <button
                    v-for="status in statusFilters"
                    :key="status.value"
                    type="button"
                    class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                    :class="
                        filters.status === status.value
                            ? 'bg-[#003366] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    "
                    @click="filters.status = status.value"
                >
                    {{ status.label }}
                </button>
            </div>
        </div>

        <!-- TABLE -->
        <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <!-- DESKTOP -->
            <div class="hidden overflow-x-auto lg:block">
                <table class="w-full min-w-[1000px]">
                    <thead>
                        <tr
                            class="border-b border-gray-100 bg-gray-50 text-left"
                        >
                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Barang
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Klasifikasi
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Gudang
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Stok
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Minimum
                            </th>

                            <th
                                class="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="item in filteredItems"
                            :key="item.id"
                            class="transition hover:bg-gray-50"
                        >
                            <td class="px-5 py-4">
                                <div>
                                    <p class="font-semibold text-gray-800">
                                        {{ item.name }}
                                    </p>

                                    <p class="mt-0.5 text-xs text-gray-400">
                                        {{ item.code }}
                                    </p>
                                </div>
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                                >
                                    {{ item.category }}
                                </span>
                            </td>

                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ item.warehouse }}
                            </td>

                            <td class="px-5 py-4 text-right">
                                <p class="font-bold text-gray-900">
                                    {{ formatNumber(item.stock) }}
                                </p>

                                <p class="text-xs text-gray-400">
                                    {{ item.uom }}
                                </p>
                            </td>

                            <td
                                class="px-5 py-4 text-right text-sm text-gray-600"
                            >
                                {{ formatNumber(item.minimum) }}
                                {{ item.uom }}
                            </td>

                            <td class="px-5 py-4 text-center">
                                <span
                                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="statusClass(item)"
                                >
                                    {{ statusLabel(item) }}
                                </span>
                            </td>

                            <td class="px-5 py-4 text-right">
                                <button
                                    type="button"
                                    class="rounded-lg px-3 py-2 text-xs font-semibold text-[#0052cc] hover:bg-blue-50"
                                    @click="showDetail(item)"
                                >
                                    Detail
                                </button>
                            </td>
                        </tr>

                        <tr v-if="filteredItems.length === 0">
                            <td
                                colspan="7"
                                class="px-5 py-12 text-center text-sm text-gray-500"
                            >
                                Tidak ada data stok yang sesuai.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- MOBILE -->
            <div class="divide-y divide-gray-100 lg:hidden">
                <div
                    v-for="item in filteredItems"
                    :key="item.id"
                    class="p-4"
                >
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="font-semibold text-gray-800">
                                {{ item.name }}
                            </p>

                            <p class="mt-0.5 text-xs text-gray-400">
                                {{ item.code }}
                            </p>
                        </div>

                        <span
                            class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            :class="statusClass(item)"
                        >
                            {{ statusLabel(item) }}
                        </span>
                    </div>

                    <div
                        class="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3"
                    >
                        <div>
                            <p class="text-xs text-gray-400">
                                Gudang
                            </p>

                            <p class="mt-1 text-sm font-medium text-gray-700">
                                {{ item.warehouse }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-gray-400">
                                Klasifikasi
                            </p>

                            <p class="mt-1 text-sm font-medium text-gray-700">
                                {{ item.category }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-gray-400">
                                Stok
                            </p>

                            <p class="mt-1 text-sm font-bold text-gray-900">
                                {{ formatNumber(item.stock) }}
                                {{ item.uom }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-gray-400">
                                Minimum
                            </p>

                            <p class="mt-1 text-sm font-medium text-gray-700">
                                {{ formatNumber(item.minimum) }}
                                {{ item.uom }}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="mt-3 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#0052cc] hover:bg-blue-50"
                        @click="showDetail(item)"
                    >
                        Lihat Detail
                    </button>
                </div>

                <div
                    v-if="filteredItems.length === 0"
                    class="px-5 py-12 text-center text-sm text-gray-500"
                >
                    Tidak ada data stok yang sesuai.
                </div>
            </div>
        </div>

        <!-- DETAIL MODAL -->
        <div
            v-if="showDetailModal && selectedItem"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @click.self="showDetailModal = false"
        >
            <div
                class="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            >
                <div
                    class="flex items-start justify-between border-b border-gray-100 px-5 py-4"
                >
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            Detail Stok
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ selectedItem.code }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        @click="showDetailModal = false"
                    >
                        ✕
                    </button>
                </div>

                <div class="space-y-4 p-5">
                    <div>
                        <p class="text-xs text-gray-400">
                            Nama Barang
                        </p>

                        <p class="mt-1 font-semibold text-gray-800">
                            {{ selectedItem.name }}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs text-gray-400">
                                Klasifikasi
                            </p>

                            <p class="mt-1 text-sm font-medium">
                                {{ selectedItem.category }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-gray-400">
                                Gudang
                            </p>

                            <p class="mt-1 text-sm font-medium">
                                {{ selectedItem.warehouse }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-gray-400">
                                Stok Saat Ini
                            </p>

                            <p class="mt-1 text-lg font-bold text-[#003366]">
                                {{ formatNumber(selectedItem.stock) }}
                                {{ selectedItem.uom }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-gray-400">
                                Stok Minimum
                            </p>

                            <p class="mt-1 text-lg font-bold text-gray-800">
                                {{ formatNumber(selectedItem.minimum) }}
                                {{ selectedItem.uom }}
                            </p>
                        </div>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-4">
                        <div
                            class="flex items-center justify-between"
                        >
                            <span class="text-sm text-gray-500">
                                Status stok
                            </span>

                            <span
                                class="rounded-full px-3 py-1 text-xs font-semibold"
                                :class="statusClass(selectedItem)"
                            >
                                {{ statusLabel(selectedItem) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    class="flex justify-end border-t border-gray-100 px-5 py-4"
                >
                    <button
                        type="button"
                        class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        @click="showDetailModal = false"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </div>

    <StockAdjustmentModal
        :show="showAdjustmentModal"
        :items="items"
        :warehouses="warehouses"
        @close="showAdjustmentModal = false"
        @saved="handleAdjustmentSaved"
    />
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import StockAdjustmentModal from '../../components/erp/inventory/StockAdjustmentModal.vue'

const warehouses = [
    'Gudang Utama',
    'Gudang Sparepart',
    'Gudang Operasional',
]

const filters = reactive({
    search: '',
    classification: '',
    warehouse: '',
    status: '',
})

const statusFilters = [
    {
        value: '',
        label: 'Semua',
    },
    {
        value: 'safe',
        label: 'Aman',
    },
    {
        value: 'low',
        label: 'Menipis',
    },
    {
        value: 'empty',
        label: 'Habis',
    },
]

const items = ref([
    {
        id: 1,
        code: 'BRG-0001',
        name: 'Saklar',
        classification: 'barang',
        category: 'Barang',
        warehouse: 'Gudang Utama',
        stock: 25,
        minimum: 10,
        uom: 'pcs',
    },
    {
        id: 2,
        code: 'SPR-0001',
        name: 'Oli Mesin 15W-40',
        classification: 'barang',
        category: 'Consumable',
        warehouse: 'Gudang Sparepart',
        stock: 8,
        minimum: 10,
        uom: 'liter',
    },
    {
        id: 3,
        code: 'SPR-0002',
        name: 'Kampas Rem',
        classification: 'barang',
        category: 'Sparepart',
        warehouse: 'Gudang Sparepart',
        stock: 0,
        minimum: 4,
        uom: 'set',
    },
    {
        id: 4,
        code: 'SPR-0003',
        name: 'Ban Truk',
        classification: 'barang',
        category: 'Sparepart',
        warehouse: 'Gudang Sparepart',
        stock: 3,
        minimum: 2,
        uom: 'pcs',
    },
    {
        id: 5,
        code: 'ATK-0001',
        name: 'Kertas A4',
        classification: 'barang',
        category: 'ATK',
        warehouse: 'Gudang Operasional',
        stock: 15,
        minimum: 5,
        uom: 'rim',
    },
    {
        id: 6,
        code: 'KBR-0001',
        name: 'Sabun Lantai',
        classification: 'barang',
        category: 'Kebersihan',
        warehouse: 'Gudang Operasional',
        stock: 2,
        minimum: 5,
        uom: 'botol',
    },
])

const filteredItems = computed(() => {
    const search = filters.search.toLowerCase().trim()

    return items.value.filter((item) => {
        const matchesSearch =
            !search ||
            item.code.toLowerCase().includes(search) ||
            item.name.toLowerCase().includes(search)

        const matchesClassification =
            !filters.classification ||
            item.classification === filters.classification

        const matchesWarehouse =
            !filters.warehouse ||
            item.warehouse === filters.warehouse

        const matchesStatus =
            !filters.status ||
            getStatus(item) === filters.status

        return (
            matchesSearch &&
            matchesClassification &&
            matchesWarehouse &&
            matchesStatus
        )
    })
})

const stats = computed(() => [
    {
        label: 'Total Item',
        value: items.value.length,
        description: 'Item dengan stok tercatat',
        icon: '▦',
        iconClass: 'bg-blue-50 text-blue-600',
    },
    {
        label: 'Stok Aman',
        value: items.value.filter(
            (item) => getStatus(item) === 'safe'
        ).length,
        description: 'Stok di atas minimum',
        icon: '✓',
        iconClass: 'bg-green-50 text-green-600',
    },
    {
        label: 'Stok Menipis',
        value: items.value.filter(
            (item) => getStatus(item) === 'low'
        ).length,
        description: 'Perlu diperhatikan',
        icon: '!',
        iconClass: 'bg-yellow-50 text-yellow-600',
    },
    {
        label: 'Stok Habis',
        value: items.value.filter(
            (item) => getStatus(item) === 'empty'
        ).length,
        description: 'Perlu segera dipenuhi',
        icon: '×',
        iconClass: 'bg-red-50 text-red-600',
    },
])

const showDetailModal = ref(false)
const showAdjustmentModal = ref(false)
const selectedItem = ref(null)

function getStatus(item) {
    if (item.stock <= 0) {
        return 'empty'
    }

    if (item.stock <= item.minimum) {
        return 'low'
    }

    return 'safe'
}

function statusLabel(item) {
    const status = getStatus(item)

    const labels = {
        safe: 'Aman',
        low: 'Menipis',
        empty: 'Habis',
    }

    return labels[status]
}

function statusClass(item) {
    const status = getStatus(item)

    const classes = {
        safe: 'bg-green-50 text-green-700',
        low: 'bg-yellow-50 text-yellow-700',
        empty: 'bg-red-50 text-red-700',
    }

    return classes[status]
}

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(value || 0)
}

function showDetail(item) {
    selectedItem.value = item
    showDetailModal.value = true
}

function openAdjustment() {
    showAdjustmentModal.value = true
}

function handleAdjustmentSaved(data) {
    const item = items.value.find(
        (item) => item.id === data.itemId
    )

    if (item) {
        item.stock = data.physicalStock
    }

    showAdjustmentModal.value = false

    console.log('Penyesuaian stok:', data)
}
</script>