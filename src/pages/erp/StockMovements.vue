<template>
    <div class="space-y-6">

        <!-- HEADER -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Pergerakan Stok
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Pantau seluruh riwayat barang masuk, keluar, dan saldo stok.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                :disabled="loading"
                @click="loadMovements"
            >
                <span
                    v-if="loading"
                    class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#003366]"
                />

                <span>
                    {{ loading ? 'Memuat...' : 'Refresh' }}
                </span>
            </button>
        </div>


        <!-- STATS -->
        <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">

            <div
                v-for="stat in stats"
                :key="stat.label"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    {{ stat.label }}
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ formatQuantity(stat.value) }}
                </p>

                <p class="mt-1 text-xs text-gray-400">
                    {{ stat.description }}
                </p>
            </div>

        </div>


        <!-- ERROR -->
        <div
            v-if="errorMessage"
            class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
            {{ errorMessage }}
        </div>


        <!-- FILTER -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">

                <!-- SEARCH -->
                <input
                    v-model="filters.search"
                    type="text"
                    placeholder="Cari produk / gudang..."
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                    @keyup.enter="loadMovements"
                />

                <!-- MOVEMENT TYPE -->
                <select
                    v-model="filters.movement_type"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua pergerakan
                    </option>

                    <option value="in">
                        Barang Masuk
                    </option>

                    <option value="out">
                        Barang Keluar
                    </option>

                    <option value="adjustment">
                        Penyesuaian
                    </option>
                </select>

                <!-- WAREHOUSE -->
                <select
                    v-model="filters.warehouse_id"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua gudang
                    </option>

                    <option
                        v-for="warehouse in warehouses"
                        :key="warehouse.id"
                        :value="warehouse.id"
                    >
                        {{ warehouse.name }}
                    </option>
                </select>

                <!-- DATE FROM -->
                <input
                    v-model="filters.date_from"
                    type="date"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                />

                <!-- DATE TO -->
                <input
                    v-model="filters.date_to"
                    type="date"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                />

                <!-- FILTER BUTTON -->
                <button
                    type="button"
                    class="rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00457f]"
                    :disabled="loading"
                    @click="loadMovements"
                >
                    Terapkan
                </button>

            </div>
        </div>


        <!-- TABLE -->
        <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >

            <!-- DESKTOP -->
            <div class="hidden overflow-x-auto lg:block">

                <table class="w-full min-w-[1150px]">

                    <thead>
                        <tr
                            class="border-b border-gray-100 bg-gray-50 text-left"
                        >

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Tanggal
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Produk
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Gudang
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Lokasi
                            </th>

                            <th
                                class="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Pergerakan
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Masuk
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Keluar
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Saldo
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
                            v-for="movement in movements"
                            :key="movement.id"
                            class="transition hover:bg-gray-50"
                        >

                            <!-- DATE -->
                            <td class="px-5 py-4">

                                <p class="text-sm font-medium text-gray-800">
                                    {{ formatDate(movement.movement_date) }}
                                </p>

                                <p class="mt-0.5 text-xs text-gray-400">
                                    {{ formatTime(movement.movement_date) }}
                                </p>

                            </td>


                            <!-- PRODUCT -->
                            <td class="px-5 py-4">

                                <p class="text-sm font-semibold text-gray-800">
                                    {{ productName(movement) }}
                                </p>

                                <p class="mt-0.5 text-xs text-gray-400">
                                    {{ productCode(movement) }}
                                </p>

                            </td>


                            <!-- WAREHOUSE -->
                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ warehouseName(movement) }}
                            </td>


                            <!-- LOCATION -->
                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ locationName(movement) }}
                            </td>


                            <!-- MOVEMENT -->
                            <td class="px-5 py-4 text-center">

                                <span
                                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="movementClass(movement)"
                                >
                                    {{ movementLabel(movement) }}
                                </span>

                            </td>


                            <!-- IN -->
                            <td class="px-5 py-4 text-right">

                                <span
                                    v-if="Number(movement.quantity_in) > 0"
                                    class="font-semibold text-green-600"
                                >
                                    +{{ formatQuantity(movement.quantity_in) }}
                                </span>

                                <span
                                    v-else
                                    class="text-gray-300"
                                >
                                    -
                                </span>

                            </td>


                            <!-- OUT -->
                            <td class="px-5 py-4 text-right">

                                <span
                                    v-if="Number(movement.quantity_out) > 0"
                                    class="font-semibold text-red-600"
                                >
                                    -{{ formatQuantity(movement.quantity_out) }}
                                </span>

                                <span
                                    v-else
                                    class="text-gray-300"
                                >
                                    -
                                </span>

                            </td>


                            <!-- BALANCE -->
                            <td class="px-5 py-4 text-right">

                                <span class="font-bold text-gray-800">
                                    {{ formatQuantity(movement.balance_quantity) }}
                                </span>

                            </td>


                            <!-- ACTION -->
                            <td class="px-5 py-4 text-right">

                                <button
                                    type="button"
                                    class="rounded-lg px-3 py-2 text-xs font-semibold text-[#0052cc] hover:bg-blue-50"
                                    @click="openDetail(movement)"
                                >
                                    Detail
                                </button>

                            </td>

                        </tr>


                        <!-- EMPTY -->
                        <tr
                            v-if="!loading && movements.length === 0"
                        >
                            <td
                                colspan="9"
                                class="px-5 py-12 text-center text-sm text-gray-500"
                            >
                                Tidak ada riwayat pergerakan stok.
                            </td>
                        </tr>


                        <!-- LOADING -->
                        <tr v-if="loading">

                            <td
                                colspan="9"
                                class="px-5 py-12 text-center text-sm text-gray-500"
                            >
                                Memuat riwayat stok...
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- MOBILE -->
            <div class="divide-y divide-gray-100 lg:hidden">

                <div
                    v-for="movement in movements"
                    :key="movement.id"
                    class="p-4"
                >

                    <!-- TOP -->
                    <div class="flex items-start justify-between gap-3">

                        <div>

                            <p class="font-semibold text-gray-800">
                                {{ productName(movement) }}
                            </p>

                            <p class="mt-1 text-xs text-gray-400">
                                {{ productCode(movement) }}
                            </p>

                            <p class="mt-1 text-xs text-gray-400">
                                {{ formatDateTime(movement.movement_date) }}
                            </p>

                        </div>


                        <span
                            class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            :class="movementClass(movement)"
                        >
                            {{ movementLabel(movement) }}
                        </span>

                    </div>


                    <!-- INFO -->
                    <div class="mt-4 rounded-xl bg-gray-50 p-3">

                        <div class="grid grid-cols-2 gap-3">

                            <div>

                                <p class="text-xs text-gray-400">
                                    Gudang
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ warehouseName(movement) }}
                                </p>

                            </div>


                            <div>

                                <p class="text-xs text-gray-400">
                                    Lokasi
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ locationName(movement) }}
                                </p>

                            </div>


                            <div>

                                <p class="text-xs text-gray-400">
                                    Barang Masuk
                                </p>

                                <p class="mt-1 text-sm font-semibold text-green-600">
                                    {{
                                        Number(movement.quantity_in) > 0
                                            ? '+' + formatQuantity(movement.quantity_in)
                                            : '-'
                                    }}
                                </p>

                            </div>


                            <div>

                                <p class="text-xs text-gray-400">
                                    Barang Keluar
                                </p>

                                <p class="mt-1 text-sm font-semibold text-red-600">
                                    {{
                                        Number(movement.quantity_out) > 0
                                            ? '-' + formatQuantity(movement.quantity_out)
                                            : '-'
                                    }}
                                </p>

                            </div>

                        </div>


                        <!-- BALANCE -->
                        <div
                            class="mt-3 border-t border-gray-200 pt-3"
                        >

                            <div class="flex items-center justify-between">

                                <p class="text-xs text-gray-400">
                                    Saldo Setelah Transaksi
                                </p>

                                <p class="text-sm font-bold text-gray-800">
                                    {{ formatQuantity(movement.balance_quantity) }}
                                </p>

                            </div>

                        </div>

                    </div>


                    <!-- ACTION -->
                    <div class="mt-3">

                        <button
                            type="button"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#0052cc] transition hover:bg-blue-50"
                            @click="openDetail(movement)"
                        >
                            Lihat Detail
                        </button>

                    </div>

                </div>


                <!-- MOBILE EMPTY -->
                <div
                    v-if="!loading && movements.length === 0"
                    class="px-5 py-12 text-center text-sm text-gray-500"
                >
                    Tidak ada riwayat pergerakan stok.
                </div>


                <!-- MOBILE LOADING -->
                <div
                    v-if="loading"
                    class="px-5 py-12 text-center text-sm text-gray-500"
                >
                    Memuat riwayat stok...
                </div>

            </div>

        </div>


        <!-- DETAIL MODAL -->
        <div
            v-if="showDetailModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @click.self="closeDetail"
        >

            <div
                class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >

                <!-- MODAL HEADER -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-5 py-4"
                >

                    <div>

                        <h2 class="text-lg font-bold text-[#003366]">
                            Detail Pergerakan Stok
                        </h2>

                        <p class="mt-0.5 text-xs text-gray-400">
                            ID #{{ selectedMovement?.id }}
                        </p>

                    </div>


                    <button
                        type="button"
                        class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        @click="closeDetail"
                    >
                        ✕
                    </button>

                </div>


                <!-- MODAL BODY -->
                <div
                    v-if="selectedMovement"
                    class="space-y-4 p-5"
                >

                    <!-- PRODUCT -->
                    <div
                        class="rounded-xl bg-gray-50 p-4"
                    >

                        <p class="text-xs text-gray-400">
                            Produk
                        </p>

                        <p class="mt-1 font-semibold text-gray-800">
                            {{ productName(selectedMovement) }}
                        </p>

                        <p class="mt-1 text-xs text-gray-400">
                            {{ productCode(selectedMovement) }}
                        </p>

                    </div>


                    <!-- INFO GRID -->
                    <div class="grid grid-cols-2 gap-4">

                        <div>

                            <p class="text-xs text-gray-400">
                                Tanggal
                            </p>

                            <p class="mt-1 text-sm font-medium text-gray-700">
                                {{ formatDateTime(selectedMovement.movement_date) }}
                            </p>

                        </div>


                        <div>

                            <p class="text-xs text-gray-400">
                                Jenis
                            </p>

                            <span
                                class="mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                :class="movementClass(selectedMovement)"
                            >
                                {{ movementLabel(selectedMovement) }}
                            </span>

                        </div>


                        <div>

                            <p class="text-xs text-gray-400">
                                Gudang
                            </p>

                            <p class="mt-1 text-sm font-medium text-gray-700">
                                {{ warehouseName(selectedMovement) }}
                            </p>

                        </div>


                        <div>

                            <p class="text-xs text-gray-400">
                                Lokasi
                            </p>

                            <p class="mt-1 text-sm font-medium text-gray-700">
                                {{ locationName(selectedMovement) }}
                            </p>

                        </div>

                    </div>


                    <!-- QUANTITY -->
                    <div
                        class="rounded-xl border border-gray-100 p-4"
                    >

                        <div class="grid grid-cols-3 gap-3 text-center">

                            <div>

                                <p class="text-xs text-gray-400">
                                    Masuk
                                </p>

                                <p class="mt-1 text-lg font-bold text-green-600">
                                    +{{ formatQuantity(selectedMovement.quantity_in) }}
                                </p>

                            </div>


                            <div>

                                <p class="text-xs text-gray-400">
                                    Keluar
                                </p>

                                <p class="mt-1 text-lg font-bold text-red-600">
                                    -{{ formatQuantity(selectedMovement.quantity_out) }}
                                </p>

                            </div>


                            <div>

                                <p class="text-xs text-gray-400">
                                    Saldo
                                </p>

                                <p class="mt-1 text-lg font-bold text-gray-800">
                                    {{ formatQuantity(selectedMovement.balance_quantity) }}
                                </p>

                            </div>

                        </div>

                    </div>


                    <!-- REFERENCE -->
                    <div
                        v-if="
                            selectedMovement.reference_type ||
                            selectedMovement.reference_id
                        "
                        class="rounded-xl bg-blue-50 p-4"
                    >

                        <p class="text-xs font-semibold text-blue-600">
                            Referensi Transaksi
                        </p>

                        <p class="mt-1 text-sm text-blue-900">
                            {{ referenceLabel(selectedMovement) }}
                        </p>

                    </div>

                </div>


                <!-- MODAL FOOTER -->
                <div
                    class="border-t border-gray-100 px-5 py-4"
                >

                    <button
                        type="button"
                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        @click="closeDetail"
                    >
                        Tutup
                    </button>

                </div>

            </div>

        </div>

    </div>
</template>


<script setup>
import {
    computed,
    onMounted,
    reactive,
    ref,
} from 'vue'

import {
    erpApi,
    getApiError,
} from '@/services/api'


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const movements = ref([])

const loading = ref(false)
const errorMessage = ref('')

const selectedMovement = ref(null)
const showDetailModal = ref(false)


/*
|--------------------------------------------------------------------------
| FILTER
|--------------------------------------------------------------------------
*/

const filters = reactive({
    search: '',
    movement_type: '',
    warehouse_id: '',
    date_from: '',
    date_to: '',
})


/*
|--------------------------------------------------------------------------
| WAREHOUSE
|--------------------------------------------------------------------------
|
| Untuk sekarang mengikuti Stock Issue:
| Office = warehouse ID 1.
|
*/

const warehouses = [
    {
        id: 1,
        name: 'Office',
    },
]


/*
|--------------------------------------------------------------------------
| STATS
|--------------------------------------------------------------------------
*/

const stats = computed(() => {

    const totalIn =
        movements.value.reduce(
            (total, movement) =>
                total +
                Number(movement.quantity_in || 0),
            0
        )

    const totalOut =
        movements.value.reduce(
            (total, movement) =>
                total +
                Number(movement.quantity_out || 0),
            0
        )

    const lastBalance =
        movements.value.length > 0
            ? Number(
                movements.value[0].balance_quantity || 0
            )
            : 0

    return [

        {
            label: 'Transaksi',
            value: movements.value.length,
            description: 'Pergerakan stok',
        },

        {
            label: 'Total Masuk',
            value: totalIn,
            description: 'Jumlah barang masuk',
        },

        {
            label: 'Total Keluar',
            value: totalOut,
            description: 'Jumlah barang keluar',
        },

        {
            label: 'Saldo Terakhir',
            value: lastBalance,
            description: 'Saldo transaksi terbaru',
        },

    ]
})


/*
|--------------------------------------------------------------------------
| LOAD MOVEMENTS
|--------------------------------------------------------------------------
*/

async function loadMovements() {

    loading.value = true
    errorMessage.value = ''

    try {

        const params = {}

        if (filters.search) {
            params.search =
                filters.search
        }

        if (filters.movement_type) {
            params.movement_type =
                filters.movement_type
        }

        if (filters.warehouse_id) {
            params.warehouse_id =
                filters.warehouse_id
        }

        if (filters.date_from) {
            params.date_from =
                filters.date_from
        }

        if (filters.date_to) {
            params.date_to =
                filters.date_to
        }

        const response =
            await erpApi.inventory.mutations.list(
                params
            )

        movements.value =
            response?.data?.data ||
            response?.data ||
            []

    } catch (error) {

        console.error(
            'Gagal memuat Stock Movement:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Riwayat pergerakan stok gagal dimuat.'

    } finally {

        loading.value = false

    }
}


/*
|--------------------------------------------------------------------------
| DETAIL
|--------------------------------------------------------------------------
*/

function openDetail(movement) {

    selectedMovement.value =
        movement

    showDetailModal.value = true
}

function closeDetail() {

    showDetailModal.value = false
    selectedMovement.value = null

}


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function productName(movement) {

    return (
        movement?.product?.name ||
        movement?.product_name ||
        '-'
    )
}


function productCode(movement) {

    return (
        movement?.product?.code ||
        movement?.product_code ||
        '-'
    )
}


function warehouseName(movement) {

    return (
        movement?.warehouse?.name ||
        'Office'
    )
}


function locationName(movement) {

    return (
        movement?.location?.name ||
        '-'
    )
}


function movementType(movement) {

    if (
        movement?.movement_type
    ) {
        return movement.movement_type
            .toString()
            .toLowerCase()
    }

    const quantityIn =
        Number(movement?.quantity_in || 0)

    const quantityOut =
        Number(movement?.quantity_out || 0)

    if (quantityIn > 0) {
        return 'in'
    }

    if (quantityOut > 0) {
        return 'out'
    }

    return 'adjustment'
}


function movementLabel(movement) {

    const type =
        movementType(movement)

    const labels = {

        in: 'Barang Masuk',

        out: 'Barang Keluar',

        adjustment: 'Penyesuaian',

        transfer: 'Transfer',

    }

    return (
        labels[type] ||
        movement?.movement_type ||
        'Pergerakan'
    )
}


function movementClass(movement) {

    const type =
        movementType(movement)

    const classes = {

        in:
            'bg-green-50 text-green-700',

        out:
            'bg-red-50 text-red-700',

        adjustment:
            'bg-yellow-50 text-yellow-700',

        transfer:
            'bg-blue-50 text-blue-700',

    }

    return (
        classes[type] ||
        'bg-gray-100 text-gray-600'
    )
}


function referenceLabel(movement) {

    const type =
        movement?.reference_type

    const id =
        movement?.reference_id

    if (!type && !id) {
        return '-'
    }

    if (type && id) {
        return `${type} #${id}`
    }

    return type || `#${id}`
}


function formatQuantity(value) {

    const number =
        Number(value || 0)

    return new Intl.NumberFormat(
        'id-ID',
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
        }
    ).format(number)
}


function formatDate(date) {

    if (!date) {
        return '-'
    }

    const parsed =
        new Date(date)

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return '-'
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }
    ).format(parsed)
}


function formatTime(date) {

    if (!date) {
        return '-'
    }

    const parsed =
        new Date(date)

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return '-'
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        {
            hour: '2-digit',
            minute: '2-digit',
        }
    ).format(parsed)
}


function formatDateTime(date) {

    if (!date) {
        return '-'
    }

    return `${formatDate(date)} ${formatTime(date)}`
}


/*
|--------------------------------------------------------------------------
| INITIAL LOAD
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadMovements()
})
</script>