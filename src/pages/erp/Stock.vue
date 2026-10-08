<script setup>
import { computed, onMounted, ref } from 'vue'
import {
    Search,
    RefreshCw,
    Package,
    AlertTriangle,
    XCircle,
    Eye,
    SlidersHorizontal,
} from 'lucide-vue-next'

import {
    erpApi,
    getApiError,
} from '@/services/api'

import StockAdjustmentModal from '../../components/erp/stock/StockAdjustmentModal.vue'


/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const loading = ref(false)
const error = ref('')

const items = ref([])
const warehouses = ref([])

const showDetailModal = ref(false)
const showAdjustmentModal = ref(false)

const selectedItem = ref(null)

const filters = ref({
    search: '',
    category_id: '',
    type_id: '',
    warehouse_id: '',
    status: '',
})


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizeArray(value) {
    if (Array.isArray(value)) {
        return value
    }

    return []
}

function getName(value, fallback = '-') {
    if (!value) {
        return fallback
    }

    if (typeof value === 'string') {
        return value
    }

    return value.name || value.code || fallback
}

function getWarehouseName(item) {
    return getName(item?.warehouse)
}

function getCategoryName(item) {
    return getName(item?.category)
}

function getTypeName(item) {
    return getName(item?.type)
}

function getUnitName(item) {
    return (
        item?.unit?.code ||
        item?.unit?.name ||
        '-'
    )
}

function getStockStatus(item) {
    const stock = Number(item?.stock || 0)
    const minimum = Number(item?.minimum_stock || 0)

    if (stock <= 0) {
        return 'empty'
    }

    if (stock <= minimum) {
        return 'low'
    }

    return 'safe'
}

function getStatusLabel(status) {
    const labels = {
        safe: 'Aman',
        low: 'Menipis',
        empty: 'Habis',
    }

    return labels[status] || status
}

function getStatusClass(status) {
    const classes = {
        safe: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        low: 'bg-amber-50 text-amber-700 border-amber-100',
        empty: 'bg-red-50 text-red-700 border-red-100',
    }

    return classes[status] || 'bg-slate-50 text-slate-600 border-slate-100'
}

function getStatusIcon(status) {
    if (status === 'empty') {
        return XCircle
    }

    if (status === 'low') {
        return AlertTriangle
    }

    return Package
}


/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const totalItems = computed(() => {
    return items.value.length
})

const safeItems = computed(() => {
    return items.value.filter(
        item => getStockStatus(item) === 'safe'
    ).length
})

const lowItems = computed(() => {
    return items.value.filter(
        item => getStockStatus(item) === 'low'
    ).length
})

const emptyItems = computed(() => {
    return items.value.filter(
        item => getStockStatus(item) === 'empty'
    ).length
})


/*
|--------------------------------------------------------------------------
| Load Stock
|--------------------------------------------------------------------------
*/

async function loadStocks() {
    loading.value = true
    error.value = ''

    try {
        const params = {}

        if (filters.value.search) {
            params.search = filters.value.search
        }

        if (filters.value.category_id) {
            params.category_id = filters.value.category_id
        }

        if (filters.value.type_id) {
            params.type_id = filters.value.type_id
        }

        if (filters.value.warehouse_id) {
            params.warehouse_id = filters.value.warehouse_id
        }

        const response = await erpApi.inventory.stocks.list(params)

        const data = response?.data?.data ?? response?.data ?? []

        items.value = normalizeArray(data).map(item => ({
            ...item,

            stock: Number(item.stock || 0),
            minimum_stock: Number(item.minimum_stock || 0),

            status: getStockStatus(item),
        }))

        /*
         * Ambil daftar warehouse dari response stock.
         * Jadi tidak perlu hardcode lagi.
         */
        const warehouseMap = new Map()

        items.value.forEach(item => {
            if (
                item.warehouse &&
                item.warehouse.id
            ) {
                warehouseMap.set(
                    item.warehouse.id,
                    item.warehouse
                )
            }
        })

        warehouses.value = Array.from(
            warehouseMap.values()
        )
    } catch (err) {
        console.error(err)

        error.value = getApiError(
            err,
            'Gagal mengambil data stok.'
        )

        items.value = []
    } finally {
        loading.value = false
    }
}


/*
|--------------------------------------------------------------------------
| Search / Filter
|--------------------------------------------------------------------------
*/

let searchTimer = null

function handleSearch() {
    clearTimeout(searchTimer)

    searchTimer = setTimeout(() => {
        loadStocks()
    }, 350)
}

function handleFilterChange() {
    loadStocks()
}

function resetFilters() {
    filters.value = {
        search: '',
        category_id: '',
        type_id: '',
        warehouse_id: '',
        status: '',
    }

    loadStocks()
}


/*
|--------------------------------------------------------------------------
| Client-side Status Filter
|--------------------------------------------------------------------------
*/

const filteredItems = computed(() => {
    if (!filters.value.status) {
        return items.value
    }

    return items.value.filter(
        item =>
            getStockStatus(item) === filters.value.status
    )
})


/*
|--------------------------------------------------------------------------
| Detail
|--------------------------------------------------------------------------
*/

async function openDetail(item) {
    try {
        const response = await erpApi.inventory.stocks.show(
            item.product_id,
            item.warehouse?.id
                ? {
                    warehouse_id: item.warehouse.id,
                }
                : {}
        )

        selectedItem.value =
            response?.data?.data ??
            response?.data ??
            item

        showDetailModal.value = true
    } catch (err) {
        console.error(err)

        /*
         * Kalau detail gagal, tetap tampilkan
         * data yang sudah ada di tabel.
         */
        selectedItem.value = item
        showDetailModal.value = true
    }
}

function closeDetail() {
    showDetailModal.value = false
    selectedItem.value = null
}


/*
|--------------------------------------------------------------------------
| Adjustment
|--------------------------------------------------------------------------
*/

function openAdjustment() {
    showAdjustmentModal.value = true
}

async function handleAdjustmentSaved(payload) {
    try {
        await erpApi.inventory.adjustments.store(
            payload
        )

        showAdjustmentModal.value = false

        await loadStocks()
    } catch (err) {
        console.error(err)

        error.value = getApiError(
            err,
            'Gagal menyimpan penyesuaian stok.'
        )
    }
}


/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadStocks()
})
</script>


<template>
    <div class="min-h-full bg-slate-50 p-4 sm:p-6">

        <!-- =========================================================
             HEADER
        ========================================================== -->
        <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14a2d8]/10 text-[#14a2d8]"
                    >
                        <Package class="h-6 w-6" />
                    </div>

                    <div>
                        <h1 class="text-xl font-bold text-slate-800">
                            Stok Barang
                        </h1>

                        <p class="text-sm text-slate-500">
                            Monitor ketersediaan barang di setiap gudang.
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                @click="openAdjustment"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#118fc0]"
            >
                <SlidersHorizontal class="h-4 w-4" />
                Penyesuaian Stok
            </button>

        </div>


        <!-- =========================================================
             ERROR
        ========================================================== -->
        <div
            v-if="error"
            class="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
            <span>{{ error }}</span>

            <button
                type="button"
                @click="loadStocks"
                class="font-semibold hover:underline"
            >
                Coba lagi
            </button>
        </div>


        <!-- =========================================================
             SUMMARY
        ========================================================== -->
        <div class="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

            <!-- Total -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500">
                            Total Item
                        </p>

                        <p class="mt-2 text-2xl font-bold text-slate-800">
                            {{ totalItems }}
                        </p>
                    </div>

                    <div class="rounded-xl bg-slate-100 p-2.5 text-slate-600">
                        <Package class="h-5 w-5" />
                    </div>
                </div>
            </div>


            <!-- Aman -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500">
                            Stok Aman
                        </p>

                        <p class="mt-2 text-2xl font-bold text-emerald-600">
                            {{ safeItems }}
                        </p>
                    </div>

                    <div class="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                        <Package class="h-5 w-5" />
                    </div>
                </div>
            </div>


            <!-- Menipis -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500">
                            Stok Menipis
                        </p>

                        <p class="mt-2 text-2xl font-bold text-amber-600">
                            {{ lowItems }}
                        </p>
                    </div>

                    <div class="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                        <AlertTriangle class="h-5 w-5" />
                    </div>
                </div>
            </div>


            <!-- Habis -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500">
                            Stok Habis
                        </p>

                        <p class="mt-2 text-2xl font-bold text-red-600">
                            {{ emptyItems }}
                        </p>
                    </div>

                    <div class="rounded-xl bg-red-50 p-2.5 text-red-600">
                        <XCircle class="h-5 w-5" />
                    </div>
                </div>
            </div>

        </div>


        <!-- =========================================================
             FILTER
        ========================================================== -->
        <div
            class="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <div class="flex flex-col gap-3 lg:flex-row">

                <!-- Search -->
                <div class="relative flex-1">
                    <Search
                        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        v-model="filters.search"
                        @input="handleSearch"
                        type="text"
                        placeholder="Cari kode, nama, brand, barcode..."
                        class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                    />
                </div>


                <!-- Warehouse -->
                <select
                    v-model="filters.warehouse_id"
                    @change="handleFilterChange"
                    class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                >
                    <option value="">
                        Semua Gudang
                    </option>

                    <option
                        v-for="warehouse in warehouses"
                        :key="warehouse.id"
                        :value="warehouse.id"
                    >
                        {{ warehouse.name }}
                    </option>
                </select>


                <!-- Status -->
                <select
                    v-model="filters.status"
                    class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                >
                    <option value="">
                        Semua Status
                    </option>

                    <option value="safe">
                        Aman
                    </option>

                    <option value="low">
                        Menipis
                    </option>

                    <option value="empty">
                        Habis
                    </option>
                </select>


                <!-- Reset -->
                <button
                    type="button"
                    @click="resetFilters"
                    class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    <RefreshCw class="h-4 w-4" />
                    Reset
                </button>

            </div>
        </div>


        <!-- =========================================================
             TABLE
        ========================================================== -->
        <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

            <!-- Loading -->
            <div
                v-if="loading"
                class="flex min-h-[300px] flex-col items-center justify-center gap-3 text-slate-500"
            >
                <RefreshCw class="h-6 w-6 animate-spin text-[#14a2d8]" />

                <span class="text-sm">
                    Memuat data stok...
                </span>
            </div>


            <!-- Empty -->
            <div
                v-else-if="filteredItems.length === 0"
                class="flex min-h-[300px] flex-col items-center justify-center px-6 text-center"
            >
                <div class="rounded-2xl bg-slate-100 p-4 text-slate-400">
                    <Package class="h-8 w-8" />
                </div>

                <h3 class="mt-4 text-sm font-semibold text-slate-700">
                    Data stok tidak ditemukan
                </h3>

                <p class="mt-1 max-w-sm text-sm text-slate-500">
                    Coba ubah kata pencarian atau filter yang digunakan.
                </p>
            </div>


            <!-- Desktop Table -->
            <div
                v-else
                class="hidden overflow-x-auto lg:block"
            >
                <table class="min-w-full">

                    <thead class="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th
                                class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Barang
                            </th>

                            <th
                                class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Klasifikasi
                            </th>

                            <th
                                class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Gudang
                            </th>

                            <th
                                class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Stok
                            </th>

                            <th
                                class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Minimum
                            </th>

                            <th
                                class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>


                    <tbody class="divide-y divide-slate-100">

                        <tr
                            v-for="item in filteredItems"
                            :key="`${item.product_id}-${item.warehouse?.id}`"
                            class="transition hover:bg-slate-50/70"
                        >

                            <!-- Barang -->
                            <td class="px-5 py-4">
                                <div>
                                    <p class="font-semibold text-slate-800">
                                        {{ item.name }}
                                    </p>

                                    <div class="mt-0.5 flex flex-wrap items-center gap-2">
                                        <span class="font-mono text-xs text-slate-400">
                                            {{ item.code }}
                                        </span>

                                        <span
                                            v-if="item.brand"
                                            class="text-xs text-slate-400"
                                        >
                                            • {{ item.brand }}
                                        </span>
                                    </div>
                                </div>
                            </td>


                            <!-- Classification -->
                            <td class="px-5 py-4">
                                <div>
                                    <p class="text-sm font-medium text-slate-700">
                                        {{ getCategoryName(item) }}
                                    </p>

                                    <p class="mt-0.5 text-xs text-slate-400">
                                        {{ getTypeName(item) }}
                                    </p>
                                </div>
                            </td>


                            <!-- Warehouse -->
                            <td class="px-5 py-4">
                                <span class="text-sm text-slate-700">
                                    {{ getWarehouseName(item) }}
                                </span>
                            </td>


                            <!-- Stock -->
                            <td class="px-5 py-4 text-right">
                                <span
                                    class="text-sm font-bold"
                                    :class="{
                                        'text-emerald-600': getStockStatus(item) === 'safe',
                                        'text-amber-600': getStockStatus(item) === 'low',
                                        'text-red-600': getStockStatus(item) === 'empty',
                                    }"
                                >
                                    {{ item.stock }}
                                </span>

                                <span class="ml-1 text-xs text-slate-400">
                                    {{ getUnitName(item) }}
                                </span>
                            </td>


                            <!-- Minimum -->
                            <td class="px-5 py-4 text-right">
                                <span class="text-sm text-slate-600">
                                    {{ item.minimum_stock }}
                                </span>

                                <span class="ml-1 text-xs text-slate-400">
                                    {{ getUnitName(item) }}
                                </span>
                            </td>


                            <!-- Status -->
                            <td class="px-5 py-4 text-center">
                                <span
                                    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
                                    :class="getStatusClass(getStockStatus(item))"
                                >
                                    <component
                                        :is="getStatusIcon(getStockStatus(item))"
                                        class="h-3.5 w-3.5"
                                    />

                                    {{ getStatusLabel(getStockStatus(item)) }}
                                </span>
                            </td>


                            <!-- Action -->
                            <td class="px-5 py-4 text-center">
                                <button
                                    type="button"
                                    @click="openDetail(item)"
                                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#14a2d8] transition hover:bg-[#14a2d8]/10"
                                >
                                    <Eye class="h-4 w-4" />
                                    Detail
                                </button>
                            </td>

                        </tr>

                    </tbody>
                </table>
            </div>


            <!-- =====================================================
                 MOBILE CARDS
            ====================================================== -->
            <div
                v-if="!loading && filteredItems.length"
                class="divide-y divide-slate-100 lg:hidden"
            >

                <div
                    v-for="item in filteredItems"
                    :key="`mobile-${item.product_id}-${item.warehouse?.id}`"
                    class="p-4"
                >

                    <div class="flex items-start justify-between gap-3">

                        <div class="min-w-0">
                            <p class="truncate font-semibold text-slate-800">
                                {{ item.name }}
                            </p>

                            <p class="mt-0.5 font-mono text-xs text-slate-400">
                                {{ item.code }}
                            </p>
                        </div>

                        <span
                            class="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold"
                            :class="getStatusClass(getStockStatus(item))"
                        >
                            <component
                                :is="getStatusIcon(getStockStatus(item))"
                                class="h-3 w-3"
                            />

                            {{ getStatusLabel(getStockStatus(item)) }}
                        </span>

                    </div>


                    <div class="mt-4 grid grid-cols-2 gap-3">

                        <div class="rounded-xl bg-slate-50 p-3">
                            <p class="text-[11px] font-medium text-slate-400">
                                Gudang
                            </p>

                            <p class="mt-1 truncate text-sm font-medium text-slate-700">
                                {{ getWarehouseName(item) }}
                            </p>
                        </div>


                        <div class="rounded-xl bg-slate-50 p-3">
                            <p class="text-[11px] font-medium text-slate-400">
                                Klasifikasi
                            </p>

                            <p class="mt-1 truncate text-sm font-medium text-slate-700">
                                {{ getCategoryName(item) }}
                            </p>
                        </div>


                        <div class="rounded-xl bg-slate-50 p-3">
                            <p class="text-[11px] font-medium text-slate-400">
                                Stok
                            </p>

                            <p
                                class="mt-1 text-sm font-bold"
                                :class="{
                                    'text-emerald-600': getStockStatus(item) === 'safe',
                                    'text-amber-600': getStockStatus(item) === 'low',
                                    'text-red-600': getStockStatus(item) === 'empty',
                                }"
                            >
                                {{ item.stock }}
                                <span class="text-xs font-normal text-slate-400">
                                    {{ getUnitName(item) }}
                                </span>
                            </p>
                        </div>


                        <div class="rounded-xl bg-slate-50 p-3">
                            <p class="text-[11px] font-medium text-slate-400">
                                Minimum
                            </p>

                            <p class="mt-1 text-sm font-medium text-slate-700">
                                {{ item.minimum_stock }}
                                <span class="text-xs text-slate-400">
                                    {{ getUnitName(item) }}
                                </span>
                            </p>
                        </div>

                    </div>


                    <button
                        type="button"
                        @click="openDetail(item)"
                        class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-[#14a2d8] transition hover:bg-[#14a2d8]/5"
                    >
                        <Eye class="h-4 w-4" />
                        Lihat Detail
                    </button>

                </div>

            </div>

        </div>


        <!-- =========================================================
             DETAIL MODAL
        ========================================================== -->
        <Teleport to="body">
            <div
                v-if="showDetailModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
                @click.self="closeDetail"
            >

                <div
                    class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                >

                    <!-- Modal Header -->
                    <div class="flex items-start justify-between border-b border-slate-100 px-5 py-4">

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Detail Stok
                            </p>

                            <h2 class="mt-1 text-lg font-bold text-slate-800">
                                {{ selectedItem?.product?.name || selectedItem?.name || '-' }}
                            </h2>

                            <p class="mt-0.5 font-mono text-xs text-slate-400">
                                {{ selectedItem?.product?.code || selectedItem?.code || '-' }}
                            </p>
                        </div>

                        <button
                            type="button"
                            @click="closeDetail"
                            class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                            <XCircle class="h-5 w-5" />
                        </button>

                    </div>


                    <!-- Modal Body -->
                    <div class="space-y-4 p-5">

                        <div class="grid grid-cols-2 gap-3">

                            <div class="rounded-xl bg-slate-50 p-4">
                                <p class="text-xs text-slate-400">
                                    Gudang
                                </p>

                                <p class="mt-1 text-sm font-semibold text-slate-700">
                                    {{
                                        selectedItem?.stock_by_warehouse?.[0]?.warehouse?.name
                                        || selectedItem?.warehouse?.name
                                        || '-'
                                    }}
                                </p>
                            </div>


                            <div class="rounded-xl bg-slate-50 p-4">
                                <p class="text-xs text-slate-400">
                                    Satuan
                                </p>

                                <p class="mt-1 text-sm font-semibold text-slate-700">
                                    {{
                                        selectedItem?.product?.unit?.code
                                        || selectedItem?.unit?.code
                                        || selectedItem?.product?.unit?.name
                                        || selectedItem?.unit?.name
                                        || '-'
                                    }}
                                </p>
                            </div>

                        </div>


                        <div class="rounded-2xl border border-slate-200 p-4">

                            <div class="flex items-end justify-between gap-4">

                                <div>
                                    <p class="text-xs text-slate-400">
                                        Stok Saat Ini
                                    </p>

                                    <p
                                        class="mt-1 text-3xl font-bold"
                                        :class="{
                                            'text-emerald-600':
                                                getStockStatus(selectedItem) === 'safe',

                                            'text-amber-600':
                                                getStockStatus(selectedItem) === 'low',

                                            'text-red-600':
                                                getStockStatus(selectedItem) === 'empty',
                                        }"
                                    >
                                        {{
                                            selectedItem?.stock
                                            ??
                                            selectedItem?.stock_by_warehouse?.[0]?.stock
                                            ??
                                            0
                                        }}
                                    </p>
                                </div>

                                <span
                                    v-if="selectedItem"
                                    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
                                    :class="getStatusClass(getStockStatus(selectedItem))"
                                >
                                    {{
                                        getStatusLabel(
                                            getStockStatus(selectedItem)
                                        )
                                    }}
                                </span>

                            </div>

                        </div>


                        <div class="grid grid-cols-2 gap-3">

                            <div class="rounded-xl border border-slate-200 p-4">
                                <p class="text-xs text-slate-400">
                                    Total Masuk
                                </p>

                                <p class="mt-1 text-lg font-bold text-emerald-600">
                                    {{
                                        selectedItem?.stock_by_warehouse?.[0]?.total_in
                                        ??
                                        selectedItem?.total_in
                                        ??
                                        0
                                    }}
                                </p>
                            </div>


                            <div class="rounded-xl border border-slate-200 p-4">
                                <p class="text-xs text-slate-400">
                                    Total Keluar
                                </p>

                                <p class="mt-1 text-lg font-bold text-red-600">
                                    {{
                                        selectedItem?.stock_by_warehouse?.[0]?.total_out
                                        ??
                                        selectedItem?.total_out
                                        ??
                                        0
                                    }}
                                </p>
                            </div>

                        </div>

                    </div>


                    <!-- Modal Footer -->
                    <div class="flex justify-end border-t border-slate-100 px-5 py-4">

                        <button
                            type="button"
                            @click="closeDetail"
                            class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Tutup
                        </button>

                    </div>

                </div>

            </div>
        </Teleport>


        <!-- =========================================================
             ADJUSTMENT MODAL
        ========================================================== -->
        <StockAdjustmentModal
            :show="showAdjustmentModal"
            :items="items"
            :warehouses="warehouses"
            @close="showAdjustmentModal = false"
            @saved="handleAdjustmentSaved"
        />

    </div>
</template>