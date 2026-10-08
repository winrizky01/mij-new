<template>
    <div class="space-y-6">

        <!-- =========================================================
             HEADER
        ========================================================== -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Dashboard ERP
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Ringkasan operasional bisnis MJI.
                </p>
            </div>

            <button
                type="button"
                :disabled="loading"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                @click="loadDashboard"
            >
                <svg
                    v-if="loading"
                    class="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        stroke-width="3"
                        class="opacity-25"
                    />

                    <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                    />
                </svg>

                <svg
                    v-else
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />

                    <path
                        d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>

                Refresh
            </button>
        </div>


        <!-- =========================================================
             ERROR
        ========================================================== -->
        <div
            v-if="error"
            class="rounded-2xl border border-red-100 bg-red-50 p-4"
        >
            <div class="flex items-start gap-3">

                <div class="mt-0.5 text-red-500">
                    <svg
                        class="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path
                            d="M12 8v4"
                            stroke-linecap="round"
                        />
                        <path
                            d="M12 16h.01"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>

                <div>
                    <p class="text-sm font-medium text-red-800">
                        Gagal memuat dashboard
                    </p>

                    <p class="mt-1 text-sm text-red-600">
                        {{ error }}
                    </p>
                </div>
            </div>
        </div>


        <!-- =========================================================
             LOADING
        ========================================================== -->
        <div
            v-if="loading && !hasDashboardData"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
            <div
                v-for="i in 4"
                :key="i"
                class="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <div class="h-4 w-24 rounded bg-gray-200"></div>
                <div class="mt-3 h-8 w-36 rounded bg-gray-200"></div>
                <div class="mt-6 h-3 w-full rounded bg-gray-100"></div>
            </div>
        </div>


        <!-- =========================================================
             FINANCIAL STATS
        ========================================================== -->
        <div
            v-else
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >

            <div
                v-for="stat in financialStats"
                :key="stat.title"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    {{ stat.title }}
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ formatCurrency(stat.value) }}
                </p>

                <div class="mt-4 flex items-center justify-between">
                    <span class="text-xs text-gray-500">
                        {{ stat.label }}
                    </span>

                    <span class="text-xs font-medium text-blue-600">
                        {{ stat.count }}
                    </span>
                </div>
            </div>

        </div>


        <!-- =========================================================
             OPERATIONAL
        ========================================================== -->
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <!-- =====================================================
                 RECENT TRANSACTIONS
            ====================================================== -->
            <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-2"
            >

                <div
                    class="flex items-center justify-between border-b border-gray-100 p-5"
                >
                    <div>
                        <h2 class="font-semibold text-gray-900">
                            Transaksi Terbaru
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Aktivitas transaksi terakhir
                        </p>
                    </div>

                    <!-- <button
                        type="button"
                        class="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Lihat semua
                    </button> -->
                </div>


                <!-- Empty -->
                <div
                    v-if="!transactions.length"
                    class="flex min-h-48 items-center justify-center px-5"
                >
                    <div class="text-center">
                        <p class="text-sm font-medium text-gray-700">
                            Belum ada transaksi
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            Transaksi terbaru akan muncul di sini.
                        </p>
                    </div>
                </div>


                <!-- Table -->
                <div
                    v-else
                    class="overflow-x-auto"
                >
                    <table class="w-full text-left text-sm">

                        <thead
                            class="bg-gray-50 text-xs uppercase text-gray-500"
                        >
                            <tr>
                                <th class="px-5 py-3">
                                    No. Transaksi
                                </th>

                                <th class="px-5 py-3">
                                    Customer / Partner
                                </th>

                                <th class="px-5 py-3">
                                    Jenis
                                </th>

                                <th class="px-5 py-3">
                                    Nilai
                                </th>

                                <th class="px-5 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>


                        <tbody class="divide-y divide-gray-100">

                            <tr
                                v-for="transaction in transactions"
                                :key="transaction.id ?? transaction.number"
                                class="transition hover:bg-gray-50"
                            >

                                <td class="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                                    {{ transaction.number }}
                                </td>

                                <td class="px-5 py-4 text-gray-600">
                                    {{ transaction.customer }}
                                </td>

                                <td class="px-5 py-4 text-gray-600">
                                    {{ transaction.type }}
                                </td>

                                <td class="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                                    {{ formatCurrency(transaction.value) }}
                                </td>

                                <td class="px-5 py-4">
                                    <span
                                        class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                                        :class="statusClass(transaction.status)"
                                    >
                                        {{ transaction.status }}
                                    </span>
                                </td>

                            </tr>

                        </tbody>

                    </table>
                </div>

            </div>


            <!-- =====================================================
                 LOW STOCK
            ====================================================== -->
            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >

                <div class="flex items-center justify-between">

                    <div>
                        <h2 class="font-semibold text-gray-900">
                            Stok Menipis
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Perlu segera diperhatikan
                        </p>
                    </div>

                    <span
                        class="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600"
                    >
                        {{ lowStock.length }} item
                    </span>

                </div>


                <div
                    v-if="!lowStock.length"
                    class="flex min-h-48 items-center justify-center"
                >
                    <div class="text-center">
                        <p class="text-sm font-medium text-gray-700">
                            Stok aman
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            Tidak ada stok yang perlu diperhatikan.
                        </p>
                    </div>
                </div>


                <div
                    v-else
                    class="mt-6 space-y-5"
                >

                    <div
                        v-for="item in lowStock"
                        :key="item.id ?? item.name"
                    >

                        <div class="flex items-center justify-between gap-3">

                            <span
                                class="min-w-0 truncate text-sm font-medium text-gray-700"
                            >
                                {{ item.name }}
                            </span>

                            <span
                                class="whitespace-nowrap text-sm font-bold text-red-600"
                            >
                                {{ item.stock }}
                            </span>

                        </div>


                        <div
                            class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"
                        >
                            <div
                                class="h-full rounded-full bg-red-400 transition-all duration-500"
                                :style="{
                                    width: `${Math.min(
                                        Math.max(Number(item.percent) || 0,
                                        0),
                                        100
                                    )}%`
                                }"
                            ></div>
                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- =========================================================
             BOTTOM SUMMARY
        ========================================================== -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

            <!-- Sales -->
            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >

                <h2 class="font-semibold text-gray-900">
                    Penjualan
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Bulan berjalan
                </p>

                <p class="mt-6 text-3xl font-bold text-gray-900">
                    {{ formatCurrency(summary.sales.value) }}
                </p>

                <p
                    class="mt-2 text-sm"
                    :class="
                        Number(summary.sales.growth) >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                    "
                >
                    {{ formatGrowth(summary.sales.growth) }}
                    dari bulan lalu
                </p>

            </div>


            <!-- Receivables -->
            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >

                <h2 class="font-semibold text-gray-900">
                    Piutang
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Belum tertagih
                </p>

                <p class="mt-6 text-3xl font-bold text-gray-900">
                    {{ formatCurrency(summary.receivables.value) }}
                </p>

                <p class="mt-2 text-sm text-yellow-600">
                    {{ summary.receivables.count }} invoice belum lunas
                </p>

            </div>


            <!-- Payables -->
            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >

                <h2 class="font-semibold text-gray-900">
                    Hutang
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Kewajiban supplier
                </p>

                <p class="mt-6 text-3xl font-bold text-gray-900">
                    {{ formatCurrency(summary.payables.value) }}
                </p>

                <p class="mt-2 text-sm text-red-600">
                    {{ summary.payables.count }} invoice belum dibayar
                </p>

            </div>

        </div>

    </div>
</template>


<script setup>
import {
    computed,
    onMounted,
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

const loading = ref(false)
const error = ref('')

const dashboard = ref({
    financial: {
        sales: {
            value: 0,
            count: 0,
        },

        purchases: {
            value: 0,
            count: 0,
        },

        receivables: {
            value: 0,
            count: 0,
        },

        payables: {
            value: 0,
            count: 0,
        },
    },

    transactions: [],

    low_stock: [],

    summary: {
        sales: {
            value: 0,
            growth: 0,
        },

        receivables: {
            value: 0,
            count: 0,
        },

        payables: {
            value: 0,
            count: 0,
        },
    },
})


/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const financialStats = computed(() => {
    const financial = dashboard.value.financial

    return [
        {
            title: 'Penjualan',
            value: Number(financial.sales?.value || 0),
            label: 'Bulan ini',
            count: `${Number(financial.sales?.count || 0)} transaksi`,
        },

        {
            title: 'Pembelian',
            value: Number(financial.purchases?.value || 0),
            label: 'Bulan ini',
            count: `${Number(financial.purchases?.count || 0)} transaksi`,
        },

        {
            title: 'Piutang',
            value: Number(financial.receivables?.value || 0),
            label: 'Belum tertagih',
            count: `${Number(financial.receivables?.count || 0)} invoice`,
        },

        {
            title: 'Hutang',
            value: Number(financial.payables?.value || 0),
            label: 'Belum dibayar',
            count: `${Number(financial.payables?.count || 0)} invoice`,
        },
    ]
})


const transactions = computed(() => {
    return Array.isArray(dashboard.value.transactions)
        ? dashboard.value.transactions
        : []
})


const lowStock = computed(() => {
    return Array.isArray(dashboard.value.low_stock)
        ? dashboard.value.low_stock
        : []
})


const summary = computed(() => {
    return dashboard.value.summary || {
        sales: {
            value: 0,
            growth: 0,
        },

        receivables: {
            value: 0,
            count: 0,
        },

        payables: {
            value: 0,
            count: 0,
        },
    }
})


const hasDashboardData = computed(() => {
    return (
        transactions.value.length > 0 ||
        lowStock.value.length > 0 ||
        financialStats.value.some(
            (item) => Number(item.value) > 0
        )
    )
})


/*
|--------------------------------------------------------------------------
| LOAD DASHBOARD
|--------------------------------------------------------------------------
*/

async function loadDashboard() {
    loading.value = true
    error.value = ''

    try {
        const response = await erpApi.dashboard()

        /*
         * Support:
         *
         * {
         *   financial: ...
         * }
         *
         * maupun:
         *
         * {
         *   data: {
         *      financial: ...
         *   }
         * }
         */
        const data = response?.data || response

        dashboard.value = {
            ...dashboard.value,
            ...data,

            financial: {
                ...dashboard.value.financial,
                ...(data?.financial || {}),
            },

            summary: {
                ...dashboard.value.summary,
                ...(data?.summary || {}),
            },

            transactions:
                Array.isArray(data?.transactions)
                    ? data.transactions
                    : [],

            low_stock:
                Array.isArray(data?.low_stock)
                    ? data.low_stock
                    : [],
        }

    } catch (err) {
        const apiError = getApiError(err)

        error.value =
            apiError.message ||
            'Gagal memuat data dashboard.'
    } finally {
        loading.value = false
    }
}


/*
|--------------------------------------------------------------------------
| FORMAT
|--------------------------------------------------------------------------
*/

function formatCurrency(value) {
    const amount = Number(value || 0)

    return new Intl.NumberFormat(
        'id-ID',
        {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }
    ).format(amount)
}


function formatGrowth(value) {
    const growth = Number(value || 0)

    const sign = growth >= 0
        ? '+'
        : ''

    return `${sign}${growth.toLocaleString(
        'id-ID',
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }
    )}%`
}


function statusClass(status) {
    const normalized = String(
        status || ''
    ).toLowerCase()

    if (
        normalized.includes('selesai') ||
        normalized.includes('paid') ||
        normalized.includes('completed') ||
        normalized.includes('approved')
    ) {
        return 'bg-green-50 text-green-600'
    }

    if (
        normalized.includes('batal') ||
        normalized.includes('cancel') ||
        normalized.includes('reject')
    ) {
        return 'bg-red-50 text-red-600'
    }

    if (
        normalized.includes('proses') ||
        normalized.includes('process') ||
        normalized.includes('pending') ||
        normalized.includes('waiting')
    ) {
        return 'bg-yellow-50 text-yellow-600'
    }

    return 'bg-gray-100 text-gray-600'
}


/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadDashboard()
})
</script>