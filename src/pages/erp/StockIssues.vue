<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                    {{ stat.value }}
                </p>

                <p class="mt-1 text-xs text-gray-400">
                    {{ stat.description }}
                </p>
            </div>
        </div>

        <!-- FILTER -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div class="xl:col-span-2">
                    <input
                        v-model="filters.search"
                        type="text"
                        placeholder="Cari nomor, pemohon, atau keperluan..."
                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                    />
                </div>

                <select
                    v-model="filters.department"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua bagian
                    </option>

                    <option
                        v-for="department in departments"
                        :key="department"
                        :value="department"
                    >
                        {{ department }}
                    </option>
                </select>

                <select
                    v-model="filters.status"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua status
                    </option>

                    <option value="draft">
                        Dibuat
                    </option>

                    <option value="requested">
                        Diajukan
                    </option>

                    <option value="approved">
                        Disetujui
                    </option>

                    <option value="issued">
                        Dikeluarkan
                    </option>

                    <option value="completed">
                        Selesai
                    </option>
                </select>
            </div>
        </div>

        <!-- TABLE -->
        <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="hidden overflow-x-auto lg:block">
                <table class="w-full min-w-[1000px]">
                    <thead>
                        <tr class="border-b border-gray-100 bg-gray-50 text-left">
                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Nomor
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Pemohon
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Bagian
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Gudang
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Keperluan
                            </th>

                            <th class="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Item
                            </th>

                            <th class="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Status
                            </th>

                            <th class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                            <td class="px-5 py-4">
                                <p class="font-semibold text-gray-800">
                                    {{ issue.number }}
                                </p>

                                <p class="mt-0.5 text-xs text-gray-400">
                                    {{ formatDate(issue.date) }}
                                </p>
                            </td>

                            <td class="px-5 py-4">
                                <p class="text-sm font-medium text-gray-800">
                                    {{ issue.requester }}
                                </p>
                            </td>

                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ issue.department }}
                            </td>

                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ issue.warehouse }}
                            </td>

                            <td class="max-w-[220px] px-5 py-4">
                                <p class="truncate text-sm text-gray-600">
                                    {{ issue.purpose }}
                                </p>
                            </td>

                            <td class="px-5 py-4 text-center">
                                <span class="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                                    {{ issue.items.length }} item
                                </span>
                            </td>

                            <td class="px-5 py-4 text-center">
                                <span
                                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="statusClass(issue.status)"
                                >
                                    {{ statusLabel(issue.status) }}
                                </span>
                            </td>

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
                                        v-if="issue.status === 'requested'"
                                        type="button"
                                        class="rounded-lg px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-50"
                                        @click="openApprovalModal(issue)"
                                    >
                                        Proses
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredIssues.length === 0">
                            <td
                                colspan="8"
                                class="px-5 py-12 text-center text-sm text-gray-500"
                            >
                                Tidak ada data pengeluaran barang.
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
                                {{ issue.number }}
                            </p>

                            <p class="mt-1 text-xs text-gray-400">
                                {{ formatDate(issue.date) }}
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
                                    {{ issue.requester }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-400">
                                    Bagian
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ issue.department }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-400">
                                    Gudang
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ issue.warehouse }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-gray-400">
                                    Item
                                </p>

                                <p class="mt-1 text-sm font-medium text-gray-700">
                                    {{ issue.items.length }} item
                                </p>
                            </div>
                        </div>

                        <div class="mt-3 border-t border-gray-200 pt-3">
                            <p class="text-xs text-gray-400">
                                Keperluan
                            </p>

                            <p class="mt-1 text-sm text-gray-700">
                                {{ issue.purpose }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-3 flex gap-2">
                        <button
                            type="button"
                            class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#0052cc] hover:bg-blue-50"
                            @click="openShowModal(issue)"
                        >
                            Detail
                        </button>

                        <button
                            v-if="issue.status === 'requested'"
                            type="button"
                            class="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                            @click="openApprovalModal(issue)"
                        >
                            Proses
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- CREATE -->
        <StockIssueCreateModal
            :show="showCreateModal"
            :items="items"
            :warehouses="warehouses"
            :departments="departments"
            @close="showCreateModal = false"
            @saved="handleCreated"
        />

        <!-- SHOW -->
        <StockIssueShowModal
            :show="showShowModal"
            :issue="selectedIssue"
            @close="showShowModal = false"
        />

        <!-- APPROVAL -->
        <StockIssueApprovalModal
            :show="showApprovalModal"
            :issue="selectedIssue"
            @close="showApprovalModal = false"
            @processed="handleProcessed"
        />
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import StockIssueCreateModal from '../../components/erp/stock-issues/StockIssueCreateModal.vue'
import StockIssueShowModal from '../../components/erp/stock-issues/StockIssueShowModal.vue'
import StockIssueApprovalModal from '../../components/erp/stock-issues/StockIssueApprovalModal.vue'

const warehouses = [
    'Gudang Utama',
    'Gudang Sparepart',
    'Gudang Operasional',
]

const departments = [
    'Operasional',
    'Finance',
    'Accounting',
    'Purchasing',
    'Sales',
    'Marketing',
    'IT',
    'HR',
    'Warehouse',
    'Logistik',
]

const items = ref([
    {
        id: 1,
        code: 'BRG-0001',
        name: 'Saklar',
        stock: 25,
        uom: 'pcs',
        warehouse: 'Gudang Utama',
    },
    {
        id: 2,
        code: 'SPR-0001',
        name: 'Oli Mesin 15W-40',
        stock: 10,
        uom: 'liter',
        warehouse: 'Gudang Sparepart',
    },
    {
        id: 3,
        code: 'SPR-0002',
        name: 'Kampas Rem',
        stock: 5,
        uom: 'set',
        warehouse: 'Gudang Sparepart',
    },
    {
        id: 4,
        code: 'SPR-0003',
        name: 'Ban Truk',
        stock: 8,
        uom: 'pcs',
        warehouse: 'Gudang Sparepart',
    },
    {
        id: 5,
        code: 'ATK-0001',
        name: 'Kertas A4',
        stock: 15,
        uom: 'rim',
        warehouse: 'Gudang Operasional',
    },
    {
        id: 6,
        code: 'KBR-0001',
        name: 'Sabun Lantai',
        stock: 12,
        uom: 'botol',
        warehouse: 'Gudang Operasional',
    },
])

const issues = ref([
    {
        id: 1,
        number: 'PB-2026-0001',
        date: '2026-10-01',
        requester: 'Budi',
        department: 'Operasional',
        warehouse: 'Gudang Sparepart',
        purpose: 'Perawatan kendaraan',
        status: 'completed',
        notes: '',
        items: [
            {
                itemId: 2,
                itemCode: 'SPR-0001',
                itemName: 'Oli Mesin 15W-40',
                quantity: 2,
                uom: 'liter',
            },
        ],
    },
    {
        id: 2,
        number: 'PB-2026-0002',
        date: '2026-10-02',
        requester: 'Andi',
        department: 'Logistik',
        warehouse: 'Gudang Sparepart',
        purpose: 'Persiapan kendaraan',
        status: 'requested',
        notes: 'Untuk kendaraan operasional.',
        items: [
            {
                itemId: 3,
                itemCode: 'SPR-0002',
                itemName: 'Kampas Rem',
                quantity: 1,
                uom: 'set',
            },
            {
                itemId: 4,
                itemCode: 'SPR-0003',
                itemName: 'Ban Truk',
                quantity: 2,
                uom: 'pcs',
            },
        ],
    },
])

const filters = reactive({
    search: '',
    department: '',
    status: '',
})

const showCreateModal = ref(false)
const showShowModal = ref(false)
const showApprovalModal = ref(false)
const selectedIssue = ref(null)

const filteredIssues = computed(() => {
    const search = filters.search.toLowerCase().trim()

    return issues.value.filter((issue) => {
        const matchesSearch =
            !search ||
            issue.number.toLowerCase().includes(search) ||
            issue.requester.toLowerCase().includes(search) ||
            issue.purpose.toLowerCase().includes(search)

        const matchesDepartment =
            !filters.department ||
            issue.department === filters.department

        const matchesStatus =
            !filters.status ||
            issue.status === filters.status

        return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
        )
    })
})

const stats = computed(() => [
    {
        label: 'Total',
        value: issues.value.length,
        description: 'Semua permintaan',
    },
    {
        label: 'Menunggu',
        value: issues.value.filter(
            (item) => item.status === 'requested'
        ).length,
        description: 'Menunggu proses',
    },
    {
        label: 'Dikeluarkan',
        value: issues.value.filter(
            (item) => item.status === 'issued'
        ).length,
        description: 'Barang sudah keluar',
    },
    {
        label: 'Selesai',
        value: issues.value.filter(
            (item) => item.status === 'completed'
        ).length,
        description: 'Transaksi selesai',
    },
])

function openCreateModal() {
    showCreateModal.value = true
}

function openShowModal(issue) {
    selectedIssue.value = issue
    showShowModal.value = true
}

function openApprovalModal(issue) {
    selectedIssue.value = issue
    showApprovalModal.value = true
}

function handleCreated(data) {
    const nextNumber = `PB-2026-${String(
        issues.value.length + 1
    ).padStart(4, '0')}`

    issues.value.unshift({
        ...data,
        id: Date.now(),
        number: nextNumber,
        status: 'requested',
    })

    showCreateModal.value = false
}

function handleProcessed(data) {
    const issue = issues.value.find(
        (item) => item.id === data.id
    )

    if (!issue) {
        return
    }

    issue.status = data.status

    if (data.status === 'issued' || data.status === 'completed') {
        data.items.forEach((issuedItem) => {
            const stockItem = items.value.find(
                (item) => item.id === issuedItem.itemId
            )

            if (stockItem) {
                stockItem.stock -= Number(
                    issuedItem.quantity
                )
            }
        })
    }

    showApprovalModal.value = false
}

function statusLabel(status) {
    const labels = {
        draft: 'Dibuat',
        requested: 'Diajukan',
        approved: 'Disetujui',
        issued: 'Dikeluarkan',
        completed: 'Selesai',
    }

    return labels[status] || status
}

function statusClass(status) {
    const classes = {
        draft: 'bg-gray-100 text-gray-600',
        requested: 'bg-yellow-50 text-yellow-700',
        approved: 'bg-blue-50 text-blue-700',
        issued: 'bg-purple-50 text-purple-700',
        completed: 'bg-green-50 text-green-700',
    }

    return classes[status] || 'bg-gray-100 text-gray-600'
}

function formatDate(date) {
    if (!date) {
        return '-'
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}
</script>