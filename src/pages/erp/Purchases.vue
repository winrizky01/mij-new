<template>
    <div class="space-y-6">

        <!-- ===================================================== -->
        <!-- HEADER -->
        <!-- ===================================================== -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Pembelian
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola proses pembelian dari Purchase Request,
                    Purchase Order hingga Goods Receipt.
                </p>
            </div>

            <button
                type="button"
                @click="openCreateModal"
                class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0047b3]"
            >
                + Buat Purchase Request
            </button>
        </div>


        <!-- ===================================================== -->
        <!-- PROCUREMENT FLOW -->
        <!-- ===================================================== -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm font-semibold text-gray-900">
                        Alur Pembelian
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                        Pantau proses setiap pengajuan sampai barang diterima.
                    </p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <span
                        class="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600"
                    >
                        PR
                    </span>

                    <span class="text-gray-300">
                        →
                    </span>

                    <span
                        class="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700"
                    >
                        PO
                    </span>

                    <span class="text-gray-300">
                        →
                    </span>

                    <span
                        class="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700"
                    >
                        GR
                    </span>
                </div>
            </div>
        </div>


        <!-- ===================================================== -->
        <!-- SUMMARY -->
        <!-- ===================================================== -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-6">

            <div
                v-for="item in summaryCards"
                :key="item.label"
                class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
                <p class="text-xs text-gray-500">
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


        <!-- ===================================================== -->
        <!-- FILTER -->
        <!-- ===================================================== -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="grid gap-3 md:grid-cols-4">

                <div class="md:col-span-2">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Cari nomor PR..."
                        class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        @keyup.enter="loadPurchases"
                    />
                </div>

                <select
                    v-model="statusFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500"
                    @change="loadPurchases"
                >
                    <option value="all">
                        Semua Status PR
                    </option>

                    <option value="draft">
                        PR · Dibuat
                    </option>

                    <option value="submitted">
                        PR · Diajukan
                    </option>

                    <option value="approved">
                        PR · Disetujui
                    </option>

                    <option value="rejected">
                        PR · Ditolak
                    </option>

                    <option value="cancelled">
                        PR · Dibatalkan
                    </option>
                </select>

                <button
                    type="button"
                    @click="loadPurchases"
                    :disabled="loading"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {{ loading ? 'Memuat...' : 'Refresh' }}
                </button>

            </div>
        </div>


        <!-- ===================================================== -->
        <!-- ERROR -->
        <!-- ===================================================== -->
        <div
            v-if="errorMessage"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
            {{ errorMessage }}
        </div>


        <!-- ===================================================== -->
        <!-- TABLE -->
        <!-- ===================================================== -->
        <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >

            <div class="overflow-x-auto">

                <table class="w-full min-w-[1250px] text-left">

                    <thead class="border-b border-gray-100 bg-gray-50">

                        <tr>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Purchase Request
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Peminta
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Tanggal
                            </th>

                            <th
                                class="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-500"
                            >
                                Item
                            </th>

                            <th
                                class="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-500"
                            >
                                PR
                            </th>

                            <th
                                class="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-500"
                            >
                                PO
                            </th>

                            <th
                                class="px-5 py-4 text-center text-xs font-semibold uppercase text-gray-500"
                            >
                                GR
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500"
                            >
                                Aksi
                            </th>

                        </tr>

                    </thead>


                    <tbody class="divide-y divide-gray-100">

                        <tr
                            v-for="purchase in purchases"
                            :key="purchase.id"
                            class="transition hover:bg-gray-50"
                        >

                            <!-- PR -->
                            <td class="px-5 py-4">

                                <div>
                                    <p class="font-semibold text-gray-900">
                                        {{ purchase.request_number }}
                                    </p>

                                    <p class="mt-1 text-xs text-gray-400">
                                        Purchase Request
                                    </p>
                                </div>

                            </td>


                            <!-- REQUESTER -->
                            <td class="px-5 py-4">

                                <p class="text-sm font-medium text-gray-800">
                                    {{
                                        purchase.requested_by?.name ||
                                        purchase.requestedBy?.name ||
                                        purchase.created_by?.name ||
                                        purchase.created_by?.full_name ||
                                        '-'
                                    }}
                                </p>

                            </td>


                            <!-- DATE -->
                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ formatDate(purchase.request_date) }}
                            </td>


                            <!-- ITEMS -->
                            <td class="px-5 py-4 text-center">

                                <span
                                    class="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
                                >
                                    {{ purchase.items?.length || 0 }}
                                </span>

                            </td>


                            <!-- PR STATUS -->
                            <td class="px-5 py-4 text-center">

                                <span
                                    class="inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold"
                                    :class="statusClass(purchase.status)"
                                >
                                    {{ statusLabel(purchase.status) }}
                                </span>

                            </td>


                            <!-- PO STATUS -->
                            <td class="px-5 py-4 text-center">

                                <span
                                    class="inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold"
                                    :class="poStatusClass(getPurchaseOrder(purchase))"
                                >
                                    {{ poStatusLabel(getPurchaseOrder(purchase)) }}
                                </span>

                            </td>


                            <!-- GR STATUS -->
                            <td class="px-5 py-4 text-center">

                                <span
                                    class="inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold"
                                    :class="grStatusClass(getGoodsReceipt(purchase))"
                                >
                                    {{ grStatusLabel(getGoodsReceipt(purchase)) }}
                                </span>

                            </td>


                            <!-- ACTION -->
                            <td class="px-5 py-4">

                                <div class="flex justify-end gap-2">

                                    <!-- LIHAT -->
                                    <button
                                        type="button"
                                        @click="openShowModal(purchase)"
                                        class="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                                    >
                                        Lihat
                                    </button>


                                    <!-- EDIT PR -->
                                    <button
                                        v-if="
                                            purchase.status === 'draft' ||
                                            purchase.status === 'submitted'
                                        "
                                        type="button"
                                        @click="openEditModal(purchase)"
                                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                                    >
                                        Edit
                                    </button>


                                    <!-- APPROVAL PR -->
                                    <button
                                        v-if="
                                            purchase.status === 'submitted'
                                        "
                                        type="button"
                                        @click="openApprovalModal(purchase)"
                                        class="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                                    >
                                        Approval
                                    </button>


                                    <!-- ================================================= -->
                                    <!-- PURCHASE ORDER -->
                                    <!-- ================================================= -->

                                    <!-- BUAT PO -->
                                    <button
                                        v-if="
                                            purchase.status === 'approved' &&
                                            !getPurchaseOrder(purchase)
                                        "
                                        type="button"
                                        @click="openPOModal(purchase)"
                                        class="rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
                                    >
                                        Buat PO
                                    </button>


                                    <!-- EDIT PO DRAFT -->
                                    <button
                                        v-if="
                                            purchase.status === 'approved' &&
                                            getPurchaseOrder(purchase)?.status === 'draft'
                                        "
                                        type="button"
                                        @click="openPOModal(purchase)"
                                        class="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                                    >
                                        Edit PO
                                    </button>


                                    <!-- PESAN PO -->
                                    <button
                                        v-if="
                                            purchase.status === 'approved' &&
                                            getPurchaseOrder(purchase)?.status === 'draft'
                                        "
                                        type="button"
                                        @click="orderPurchaseOrder(purchase)"
                                        class="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                                    >
                                        Pesan PO
                                    </button>


                                    <!-- BUAT GR -->
                                    <button
                                        v-if="
                                            getPurchaseOrder(purchase) &&
                                            canCreateGoodsReceipt(purchase) &&
                                            !getGoodsReceipt(purchase)
                                        "
                                        type="button"
                                        @click="openReceiveModal(purchase)"
                                        class="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100"
                                    >
                                        Buat GR
                                    </button>


                                    <!-- EDIT / LANJUTKAN GR DRAFT -->
                                    <button
                                        v-if="
                                            getGoodsReceipt(purchase)?.status === 'draft'
                                        "
                                        type="button"
                                        @click="openReceiveModal(purchase)"
                                        class="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700 transition hover:bg-yellow-100"
                                    >
                                        Lanjutkan GR
                                    </button>


                                    <!-- TERIMA BARANG -->
                                    <button
                                        v-if="
                                            getGoodsReceipt(purchase)?.status === 'draft'
                                        "
                                        type="button"
                                        @click="receiveGoodsReceipt(purchase)"
                                        class="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                                    >
                                        Terima Barang
                                    </button>


                                    <!-- GR SUDAH DITERIMA -->
                                    <span
                                        v-if="
                                            getGoodsReceipt(purchase)?.status === 'received'
                                        "
                                        class="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
                                    >
                                        GR Diterima
                                    </span>


                                    <!-- PO SELESAI -->
                                    <span
                                        v-if="
                                            getPurchaseOrder(purchase)?.status === 'received'
                                        "
                                        class="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
                                    >
                                        Selesai
                                    </span>

                                </div>

                            </td>

                        </tr>


                        <!-- LOADING -->
                        <tr v-if="loading">

                            <td
                                colspan="8"
                                class="px-5 py-14 text-center"
                            >

                                <div
                                    class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600"
                                ></div>

                                <p class="mt-4 text-sm text-gray-500">
                                    Memuat data pembelian...
                                </p>

                            </td>

                        </tr>


                        <!-- EMPTY -->
                        <tr
                            v-else-if="purchases.length === 0"
                        >

                            <td
                                colspan="8"
                                class="px-5 py-14 text-center"
                            >

                                <div class="text-4xl">
                                    🧾
                                </div>

                                <p
                                    class="mt-4 text-sm font-semibold text-gray-900"
                                >
                                    Data pembelian tidak ditemukan
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    Belum ada Purchase Request atau filter
                                    tidak menemukan data.
                                </p>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- FOOTER -->
            <div class="border-t border-gray-100 px-5 py-4">

                <p class="text-xs text-gray-500">

                    Menampilkan

                    <span class="font-semibold text-gray-700">
                        {{ purchases.length }}
                    </span>

                    Purchase Request

                </p>

            </div>

        </div>


        <!-- ===================================================== -->
        <!-- CREATE -->
        <!-- ===================================================== -->
        <PurchaseCreateModal
            :show="showCreateModal"
            @close="showCreateModal = false"
            @saved="handleCreated"
        />


        <!-- ===================================================== -->
        <!-- EDIT -->
        <!-- ===================================================== -->
        <PurchaseEditModal
            :show="showEditModal"
            :purchase="selectedPurchase"
            @close="showEditModal = false"
            @saved="handleEdited"
        />


        <!-- ===================================================== -->
        <!-- SHOW -->
        <!-- ===================================================== -->
        <PurchaseShowModal
            :show="showShowModal"
            :purchase="selectedPurchase"
            @close="showShowModal = false"
            @edit="handleShowEdit"
        />


        <!-- ===================================================== -->
        <!-- APPROVAL -->
        <!-- ===================================================== -->
        <PurchaseApprovalModal
            :show="showApprovalModal"
            :purchase="selectedPurchase"
            @close="showApprovalModal = false"
            @approved="handleApproval"
            @rejected="handleRejected"
        />


        <!-- ===================================================== -->
        <!-- PURCHASE ORDER -->
        <!-- ===================================================== -->
        <PurchaseOrderModal
            :show="showPOModal"
            :purchase="selectedPurchase"
            @close="showPOModal = false"
            @saved="handlePOSaved"
        />


        <!-- ===================================================== -->
        <!-- GOODS RECEIPT -->
        <!-- ===================================================== -->
        <PurchaseReceiveModal
            :show="showReceiveModal"
            :purchase="selectedPurchase"
            @close="showReceiveModal = false"
            @received="handleReceived"
        />

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


import PurchaseCreateModal
    from '../../components/erp/purchases/PurchaseCreateModal.vue'

import PurchaseEditModal
    from '../../components/erp/purchases/PurchaseEditModal.vue'

import PurchaseShowModal
    from '../../components/erp/purchases/PurchaseShowModal.vue'

import PurchaseApprovalModal
    from '../../components/erp/purchases/PurchaseApprovalModal.vue'

import PurchaseOrderModal
    from '../../components/erp/purchases/PurchaseOrderModal.vue'

import PurchaseReceiveModal
    from '../../components/erp/purchases/PurchaseReceiveModal.vue'


// =========================================================
// STATE
// =========================================================

const purchases = ref([])

const loading = ref(false)

const errorMessage = ref('')

const search = ref('')

const statusFilter = ref('all')

const selectedPurchase = ref(null)


// =========================================================
// MODAL STATE
// =========================================================

const showCreateModal = ref(false)

const showEditModal = ref(false)

const showShowModal = ref(false)

const showApprovalModal = ref(false)

const showPOModal = ref(false)

const showReceiveModal = ref(false)


// =========================================================
// SUMMARY
// =========================================================

const summaryCards = computed(() => [

    {
        label: 'PR Aktif',
        value: purchases.value.filter(
            item =>
                ![
                    'rejected',
                    'cancelled',
                ].includes(item.status)
        ).length,
        color: 'text-[#003366]',
    },

    {
        label: 'Menunggu Approval',
        value: purchases.value.filter(
            item => item.status === 'submitted'
        ).length,
        color: 'text-blue-600',
    },

    {
        label: 'PR Disetujui',
        value: purchases.value.filter(
            item => item.status === 'approved'
        ).length,
        color: 'text-green-600',
    },

    {
        label: 'PO Berjalan',
        value: purchases.value.filter(
            item => {
                const po = getPurchaseOrder(item)

                return po &&
                    ![
                        'received',
                        'cancelled',
                    ].includes(po.status)
            }
        ).length,
        color: 'text-purple-600',
    },

    {
        label: 'Menunggu GR',
        value: purchases.value.filter(
            item => {
                const po = getPurchaseOrder(item)

                if (!po) {
                    return false
                }

                return canCreateGoodsReceipt(item)
            }
        ).length,
        color: 'text-orange-600',
    },

    {
        label: 'Selesai',
        value: purchases.value.filter(
            item => {
                const po = getPurchaseOrder(item)
                const gr = getGoodsReceipt(item)

                return (
                    po?.status === 'received' ||
                    gr?.status === 'received'
                )
            }
        ).length,
        color: 'text-emerald-600',
    },

])


// =========================================================
// LOAD DATA
// =========================================================

async function loadPurchases() {

    loading.value = true

    errorMessage.value = ''

    try {

        const params = {}

        if (search.value.trim()) {
            params.search =
                search.value.trim()
        }

        if (statusFilter.value !== 'all') {
            params.status =
                statusFilter.value
        }

        const response =
            await erpApi.purchases.requests.list(
                params
            )

        purchases.value =
            response?.data?.data ||
            response?.data ||
            []

    } catch (error) {

        console.error(
            'Gagal memuat Purchase Request:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Gagal memuat data pembelian.'

        purchases.value = []

    } finally {

        loading.value = false

    }

}


// =========================================================
// PURCHASE ORDER
// =========================================================

function getPurchaseOrder(purchase) {

    return (
        purchase?.purchase_order ||
        purchase?.purchaseOrder ||
        purchase?.purchase_orders?.[0] ||
        purchase?.purchaseOrders?.[0] ||
        null
    )

}

async function orderPurchaseOrder(purchase) {
    const po = getPurchaseOrder(purchase)

    if (!po?.id) {
        return
    }

    if (po.status !== 'draft') {
        return
    }

    const confirmed = window.confirm(
        `Pesan ${po.po_number}? Setelah dipesan, PO tidak dapat diedit lagi.`
    )

    if (!confirmed) {
        return
    }

    try {
        errorMessage.value = ''

        await erpApi.purchases.orders.order(po.id)

        await loadPurchases()
    } catch (error) {
        console.error(
            'Gagal memesan Purchase Order:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Purchase Order gagal dipesan.'
    }
}


// =========================================================
// GOODS RECEIPT
// =========================================================

function getGoodsReceipt(purchase) {

    const po =
        getPurchaseOrder(purchase)

    if (!po) {
        return null
    }

    return (
        po?.goods_receipt ||
        po?.goodsReceipt ||
        po?.goods_receipts?.[
            po.goods_receipts.length - 1
        ] ||
        po?.goodsReceipts?.[
            po.goodsReceipts.length - 1
        ] ||
        null
    )

}

async function receiveGoodsReceipt(purchase) {
    const gr = getGoodsReceipt(purchase)

    if (!gr?.id) {
        return
    }

    if (gr.status !== 'draft') {
        return
    }

    const confirmed = window.confirm(
        `Terima barang untuk ${gr.receipt_number}?`
    )

    if (!confirmed) {
        return
    }

    try {
        errorMessage.value = ''

        await erpApi.purchases.receipts.receive(
            gr.id
        )

        await loadPurchases()
    } catch (error) {
        console.error(
            'Gagal menerima Goods Receipt:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Barang gagal diterima.'
    }
}

// =========================================================
// CREATE
// =========================================================

function openCreateModal() {

    showCreateModal.value = true

}


async function handleCreated() {

    showCreateModal.value = false

    await loadPurchases()

}


// =========================================================
// EDIT
// =========================================================

function openEditModal(purchase) {

    selectedPurchase.value = purchase

    showEditModal.value = true

}


async function handleEdited() {

    showEditModal.value = false

    selectedPurchase.value = null

    await loadPurchases()

}


// =========================================================
// SHOW
// =========================================================

function openShowModal(purchase) {

    selectedPurchase.value = purchase

    showShowModal.value = true

}


function handleShowEdit(purchase) {

    showShowModal.value = false

    openEditModal(purchase)

}


// =========================================================
// APPROVAL
// =========================================================

function openApprovalModal(purchase) {

    selectedPurchase.value = purchase

    showApprovalModal.value = true

}


async function handleApproval() {

    showApprovalModal.value = false

    selectedPurchase.value = null

    await loadPurchases()

}


async function handleRejected() {

    showApprovalModal.value = false

    selectedPurchase.value = null

    await loadPurchases()

}


// =========================================================
// PURCHASE ORDER
// =========================================================

function openPOModal(purchase) {

    selectedPurchase.value = purchase

    showPOModal.value = true

}


async function handlePOSaved() {

    showPOModal.value = false

    selectedPurchase.value = null

    await loadPurchases()

}


// =========================================================
// GOODS RECEIPT
// =========================================================

function openReceiveModal(purchase) {

    selectedPurchase.value = purchase

    showReceiveModal.value = true

}


async function handleReceived() {

    showReceiveModal.value = false

    selectedPurchase.value = null

    await loadPurchases()

}


// =========================================================
// PR STATUS
// =========================================================

function statusLabel(status) {

    return {

        draft: 'Dibuat',

        submitted: 'Diajukan',

        approved: 'Disetujui',

        rejected: 'Ditolak',

        cancelled: 'Dibatalkan',

    }[status] || status

}


function statusClass(status) {

    return {

        draft:
            'bg-gray-100 text-gray-600',

        submitted:
            'bg-blue-50 text-blue-700',

        approved:
            'bg-green-50 text-green-700',

        rejected:
            'bg-red-50 text-red-700',

        cancelled:
            'bg-orange-50 text-orange-700',

    }[status] ||
        'bg-gray-100 text-gray-600'

}


// =========================================================
// PO STATUS
// =========================================================

function poStatusLabel(po) {

    if (!po) {
        return 'Belum PO'
    }

    return {

        draft: 'Draft',

        submitted: 'Diajukan',

        approved: 'Disetujui',

        ordered: 'Dipesan',

        partial: 'Partial',

        received: 'Selesai',

        cancelled: 'Dibatalkan',

    }[po.status] ||
        po.status ||
        '-'

}


function poStatusClass(po) {

    if (!po) {
        return 'bg-gray-100 text-gray-400'
    }

    return {

        draft:
            'bg-gray-100 text-gray-600',

        submitted:
            'bg-blue-50 text-blue-700',

        approved:
            'bg-green-50 text-green-700',

        ordered:
            'bg-purple-50 text-purple-700',

        partial:
            'bg-yellow-50 text-yellow-700',

        received:
            'bg-emerald-50 text-emerald-700',

        cancelled:
            'bg-red-50 text-red-700',

    }[po.status] ||
        'bg-gray-100 text-gray-600'

}


// =========================================================
// GR STATUS
// =========================================================

function grStatusLabel(gr) {

    if (!gr) {
        return 'Belum GR'
    }

    return {

        draft: 'Draft',

        received: 'Diterima',

        cancelled: 'Dibatalkan',

    }[gr.status] ||
        gr.status ||
        '-'

}


function grStatusClass(gr) {

    if (!gr) {
        return 'bg-gray-100 text-gray-400'
    }

    return {

        draft:
            'bg-gray-100 text-gray-600',

        received:
            'bg-emerald-50 text-emerald-700',

        cancelled:
            'bg-red-50 text-red-700',

    }[gr.status] ||
        'bg-gray-100 text-gray-600'

}


// =========================================================
// GR ACTION
// =========================================================

function canCreateGoodsReceipt(purchase) {

    const po =
        getPurchaseOrder(purchase)

    if (!po) {
        return false
    }

    return [
        'ordered',
        'partial',
    ].includes(po.status)

}


// =========================================================
// FORMAT
// =========================================================

function formatDate(value) {

    if (!value) {
        return '-'
    }

    const date =
        new Date(value)

    if (
        Number.isNaN(
            date.getTime()
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
    ).format(date)

}


// =========================================================
// INIT
// =========================================================

onMounted(() => {

    loadPurchases()

})

</script>