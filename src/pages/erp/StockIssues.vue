<template>
    <div class="space-y-6">

        <!-- HEADER -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Pengeluaran Barang
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola permintaan dan pengeluaran barang dari gudang.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00457f]"
                @click="openCreateModal"
            >
                <span class="text-lg leading-none">+</span>
                Pengeluaran Barang
            </button>
        </div>

        <!-- STATS -->
        <div class="grid grid-cols-2 gap-4 xl:grid-cols-5">
            <div
                v-for="stat in stats"
                :key="stat.label"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
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
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">

                <input
                    v-model="filters.search"
                    type="text"
                    placeholder="Cari nomor, pemohon, atau keperluan..."
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                />

                <select
                    v-model="filters.status"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua status
                    </option>

                    <option value="draft">
                        Draft
                    </option>

                    <option value="submitted">
                        Diajukan
                    </option>

                    <option value="approved">
                        Disetujui
                    </option>

                    <option value="issued">
                        Dikeluarkan
                    </option>

                    <option value="cancelled">
                        Dibatalkan
                    </option>
                </select>

                <button
                    type="button"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    :disabled="loading"
                    @click="loadIssues"
                >
                    {{ loading ? 'Memuat...' : 'Refresh' }}
                </button>
            </div>
        </div>

        <!-- TABLE -->
        <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="hidden overflow-x-auto lg:block">

                <table class="w-full min-w-[1000px]">

                    <thead>
                        <tr
                            class="border-b border-gray-100 bg-gray-50 text-left"
                        >
                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Nomor
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Pemohon
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Gudang
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Keperluan
                            </th>

                            <th
                                class="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Item
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
                            v-for="issue in filteredIssues"
                            :key="issue.id"
                            class="transition hover:bg-gray-50"
                        >

                            <!-- NOMOR -->
                            <td class="px-5 py-4">
                                <p class="font-semibold text-gray-800">
                                    {{ issue.issue_number }}
                                </p>

                                <p class="mt-0.5 text-xs text-gray-400">
                                    {{ formatDate(issue.issue_date) }}
                                </p>
                            </td>

                            <!-- PEMOHON -->
                            <td class="px-5 py-4">
                                <p class="text-sm font-medium text-gray-800">
                                    {{ requesterName(issue) }}
                                </p>
                            </td>

                            <!-- GUDANG -->
                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ warehouseName(issue) }}
                            </td>

                            <!-- KEPERLUAN -->
                            <td class="max-w-[260px] px-5 py-4">
                                <p class="truncate text-sm text-gray-600">
                                    {{ issue.purpose || '-' }}
                                </p>
                            </td>

                            <!-- ITEM -->
                            <td class="px-5 py-4 text-center">
                                <span
                                    class="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
                                >
                                    {{ issue.items?.length || 0 }} item
                                </span>
                            </td>

                            <!-- STATUS -->
                            <td class="px-5 py-4 text-center">
                                <span
                                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="statusClass(issue.status)"
                                >
                                    {{ statusLabel(issue.status) }}
                                </span>
                            </td>

                            <!-- ACTION -->
                            <td class="px-5 py-4 text-right">
                                <div class="flex justify-end gap-1">

                                    <button
                                        type="button"
                                        class="rounded-lg px-3 py-2 text-xs font-semibold text-[#0052cc] hover:bg-blue-50"
                                        @click="openShowModal(issue)"
                                    >
                                        Detail
                                    </button>

                                    <button
                                        v-if="issue.status === 'draft'"
                                        type="button"
                                        class="rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                                        @click="submitIssue(issue)"
                                    >
                                        Ajukan
                                    </button>

                                    <button
                                        v-if="issue.status === 'submitted'"
                                        type="button"
                                        class="rounded-lg px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-50"
                                        @click="approveIssue(issue)"
                                    >
                                        Setujui
                                    </button>

                                    <button
                                        v-if="issue.status === 'approved'"
                                        type="button"
                                        class="rounded-lg px-3 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-50"
                                        @click="issueStock(issue)"
                                    >
                                        Keluarkan
                                    </button>

                                    <button
                                        v-if="
                                            issue.status === 'draft' ||
                                            issue.status === 'submitted' ||
                                            issue.status === 'approved'
                                        "
                                        type="button"
                                        class="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                        @click="cancelIssue(issue)"
                                    >
                                        Batal
                                    </button>

                                </div>
                            </td>
                        </tr>

                        <tr v-if="!loading && filteredIssues.length === 0">
                            <td
                                colspan="7"
                                class="px-5 py-12 text-center text-sm text-gray-500"
                            >
                                Tidak ada data pengeluaran barang.
                            </td>
                        </tr>

                        <tr v-if="loading">
                            <td
                                colspan="7"
                                class="px-5 py-12 text-center text-sm text-gray-500"
                            >
                                Memuat data...
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- MOBILE -->
            <div class="divide-y divide-gray-100 lg:hidden">

                <div
                    v-for="issue in filteredIssues"
                    :key="issue.id"
                    class="p-4"
                >

                    <div class="flex items-start justify-between gap-3">

                        <div>
                            <p class="font-semibold text-gray-800">
                                {{ issue.issue_number }}
                            </p>

                            <p class="mt-1 text-xs text-gray-400">
                                {{ formatDate(issue.issue_date) }}
                            </p>
                        </div>

                        <span
                            class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            :class="statusClass(issue.status)"
                        >
                            {{ statusLabel(issue.status) }}
                        </span>

                    </div>

                    <div class="mt-4 rounded-xl bg-gray-50 p-3">

                        <div class="grid grid-cols-2 gap-3">

                            <div>
                                <p class="text-xs text-gray-400">
                                    Pemohon
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ requesterName(issue) }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-400">
                                    Gudang
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ warehouseName(issue) }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-400">
                                    Item
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ issue.items?.length || 0 }} item
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-400">
                                    Status
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ statusLabel(issue.status) }}
                                </p>
                            </div>

                        </div>

                        <div class="mt-3 border-t border-gray-200 pt-3">

                            <p class="text-xs text-gray-400">
                                Keperluan
                            </p>

                            <p class="mt-1 text-sm text-gray-700">
                                {{ issue.purpose || '-' }}
                            </p>

                        </div>

                    </div>

                    <div class="mt-3 flex flex-wrap gap-2">

                        <button
                            type="button"
                            class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#0052cc] hover:bg-blue-50"
                            @click="openShowModal(issue)"
                        >
                            Detail
                        </button>

                        <button
                            v-if="issue.status === 'draft'"
                            type="button"
                            class="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            @click="submitIssue(issue)"
                        >
                            Ajukan
                        </button>

                        <button
                            v-if="issue.status === 'submitted'"
                            type="button"
                            class="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                            @click="approveIssue(issue)"
                        >
                            Setujui
                        </button>

                        <button
                            v-if="issue.status === 'approved'"
                            type="button"
                            class="flex-1 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                            @click="issueStock(issue)"
                        >
                            Keluarkan
                        </button>

                    </div>
                </div>

                <div
                    v-if="!loading && filteredIssues.length === 0"
                    class="px-5 py-12 text-center text-sm text-gray-500"
                >
                    Tidak ada data pengeluaran barang.
                </div>

            </div>
        </div>

        <!-- CREATE -->
        <StockIssueCreateModal
            :show="showCreateModal"
            :items="items"
            :warehouses="warehouses"
            @close="showCreateModal = false"
            @saved="handleCreated"
        />

        <!-- SHOW -->
        <StockIssueShowModal
            :show="showShowModal"
            :issue="selectedIssue"
            @close="showShowModal = false"
        />

        <!-- APPROVAL / PROCESS -->
        <StockIssueApprovalModal
            :show="showApprovalModal"
            :issue="selectedIssue"
            @close="showApprovalModal = false"
            @processed="handleProcessed"
        />

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

import StockIssueCreateModal
    from '../../components/erp/stock-issues/StockIssueCreateModal.vue'

import StockIssueShowModal
    from '../../components/erp/stock-issues/StockIssueShowModal.vue'

import StockIssueApprovalModal
    from '../../components/erp/stock-issues/StockIssueApprovalModal.vue'


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const issues = ref([])
const items = ref([])

const loading = ref(false)
const errorMessage = ref('')

const filters = reactive({
    search: '',
    status: '',
})

const showCreateModal = ref(false)
const showShowModal = ref(false)
const showApprovalModal = ref(false)

const selectedIssue = ref(null)


/*
|--------------------------------------------------------------------------
| WAREHOUSE
|--------------------------------------------------------------------------
|
| Untuk sekarang Office = warehouse ID 1.
| Tidak perlu UI pilihan gudang.
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
| FILTERED DATA
|--------------------------------------------------------------------------
*/

const filteredIssues = computed(() => {
    const search =
        filters.search
            .toLowerCase()
            .trim()

    return issues.value.filter((issue) => {

        const requester =
            requesterName(issue)
                .toLowerCase()

        const purpose =
            (issue.purpose || '')
                .toLowerCase()

        const number =
            (issue.issue_number || '')
                .toLowerCase()

        const matchesSearch =
            !search ||
            number.includes(search) ||
            requester.includes(search) ||
            purpose.includes(search)

        const matchesStatus =
            !filters.status ||
            issue.status === filters.status

        return (
            matchesSearch &&
            matchesStatus
        )
    })
})


/*
|--------------------------------------------------------------------------
| STATS
|--------------------------------------------------------------------------
*/

const stats = computed(() => [
    {
        label: 'Total',
        value: issues.value.length,
        description: 'Semua pengeluaran',
    },

    {
        label: 'Draft',
        value: issues.value.filter(
            (item) =>
                item.status === 'draft'
        ).length,
        description: 'Belum diajukan',
    },

    {
        label: 'Menunggu',
        value: issues.value.filter(
            (item) =>
                item.status === 'submitted'
        ).length,
        description: 'Menunggu approval',
    },

    {
        label: 'Disetujui',
        value: issues.value.filter(
            (item) =>
                item.status === 'approved'
        ).length,
        description: 'Siap dikeluarkan',
    },

    {
        label: 'Dikeluarkan',
        value: issues.value.filter(
            (item) =>
                item.status === 'issued'
        ).length,
        description: 'Barang sudah keluar',
    },
])


/*
|--------------------------------------------------------------------------
| LOAD ISSUES
|--------------------------------------------------------------------------
*/

async function loadIssues() {

    loading.value = true
    errorMessage.value = ''

    try {

        const params = {}

        if (filters.search) {
            params.search =
                filters.search
        }

        if (filters.status) {
            params.status =
                filters.status
        }

        const response =
            await erpApi.inventory.issues.list(
                params
            )

        issues.value =
            response?.data?.data ||
            response?.data ||
            []

    } catch (error) {

        console.error(
            'Gagal memuat Stock Issue:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Data pengeluaran barang gagal dimuat.'

    } finally {

        loading.value = false

    }
}


/*
|--------------------------------------------------------------------------
| LOAD PRODUCTS
|--------------------------------------------------------------------------
|
| Untuk kebutuhan modal create.
| Kalau endpoint master products kamu berbeda,
| bagian ini tinggal disesuaikan.
|
*/

async function loadItems() {

    try {

        const response = await erpApi.master.products.list({
            is_active: true,
            warehouse_id: 1,
        })

        items.value =
            response?.data?.data ||
            response?.data ||
            []

    } catch (error) {

        console.error(
            'Gagal memuat produk:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Data produk gagal dimuat.'

    }
}


/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

function openCreateModal() {
    errorMessage.value = ''
    showCreateModal.value = true
}

async function handleCreated() {

    showCreateModal.value = false

    await loadIssues()
}


/*
|--------------------------------------------------------------------------
| SHOW
|--------------------------------------------------------------------------
*/

function openShowModal(issue) {

    selectedIssue.value =
        issue

    showShowModal.value = true
}


/*
|--------------------------------------------------------------------------
| SUBMIT
|--------------------------------------------------------------------------
*/

async function submitIssue(issue) {

    if (!issue?.id) {
        return
    }

    const confirmed =
        window.confirm(
            `Ajukan ${issue.issue_number}?`
        )

    if (!confirmed) {
        return
    }

    try {

        errorMessage.value = ''

        await erpApi.inventory.issues.submit(
            issue.id
        )

        await loadIssues()

    } catch (error) {

        console.error(
            'Gagal mengajukan Stock Issue:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Stock Issue gagal diajukan.'

    }
}


/*
|--------------------------------------------------------------------------
| APPROVE
|--------------------------------------------------------------------------
*/

async function approveIssue(issue) {

    if (!issue?.id) {
        return
    }

    const confirmed =
        window.confirm(
            `Setujui ${issue.issue_number}?`
        )

    if (!confirmed) {
        return
    }

    try {

        errorMessage.value = ''

        await erpApi.inventory.issues.approve(
            issue.id
        )

        await loadIssues()

    } catch (error) {

        console.error(
            'Gagal menyetujui Stock Issue:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Stock Issue gagal disetujui.'

    }
}


/*
|--------------------------------------------------------------------------
| ISSUE / KELUARKAN BARANG
|--------------------------------------------------------------------------
*/

async function issueStock(issue) {

    if (!issue?.id) {
        return
    }

    const confirmed =
        window.confirm(
            `Keluarkan barang untuk ${issue.issue_number}? Stok akan berkurang.`
        )

    if (!confirmed) {
        return
    }

    try {

        errorMessage.value = ''

        await erpApi.inventory.issues.issue(
            issue.id
        )

        await loadIssues()

    } catch (error) {

        console.error(
            'Gagal mengeluarkan barang:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Barang gagal dikeluarkan.'

    }
}


/*
|--------------------------------------------------------------------------
| CANCEL
|--------------------------------------------------------------------------
*/

async function cancelIssue(issue) {

    if (!issue?.id) {
        return
    }

    const confirmed =
        window.confirm(
            `Batalkan ${issue.issue_number}?`
        )

    if (!confirmed) {
        return
    }

    try {

        errorMessage.value = ''

        await erpApi.inventory.issues.cancel(
            issue.id
        )

        await loadIssues()

    } catch (error) {

        console.error(
            'Gagal membatalkan Stock Issue:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Stock Issue gagal dibatalkan.'

    }
}


/*
|--------------------------------------------------------------------------
| PROCESSED
|--------------------------------------------------------------------------
|
| Modal lama masih boleh mengirim event.
| Setelah transaksi backend selesai,
| kita reload dari API.
|
*/

async function handleProcessed() {

    showApprovalModal.value = false
    selectedIssue.value = null

    await loadIssues()
}


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function requesterName(issue) {

    return (
        issue?.requested_by?.name ||
        issue?.requestedBy?.name ||
        issue?.requested_by?.full_name ||
        '-'
    )
}

function warehouseName(issue) {

    return (
        issue?.warehouse?.name ||
        'Office'
    )
}

function statusLabel(status) {

    const labels = {
        draft: 'Draft',
        submitted: 'Diajukan',
        approved: 'Disetujui',
        issued: 'Dikeluarkan',
        cancelled: 'Dibatalkan',
    }

    return (
        labels[status] ||
        status ||
        '-'
    )
}

function statusClass(status) {

    const classes = {

        draft:
            'bg-gray-100 text-gray-600',

        submitted:
            'bg-yellow-50 text-yellow-700',

        approved:
            'bg-blue-50 text-blue-700',

        issued:
            'bg-purple-50 text-purple-700',

        cancelled:
            'bg-red-50 text-red-700',
    }

    return (
        classes[status] ||
        'bg-gray-100 text-gray-600'
    )
}

function formatDate(date) {

    if (!date) {
        return '-'
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }
    ).format(
        new Date(date)
    )
}


/*
|--------------------------------------------------------------------------
| INITIAL LOAD
|--------------------------------------------------------------------------
*/

onMounted(async () => {

    await Promise.all([
        loadIssues(),
        loadItems(),
    ])

})
</script>