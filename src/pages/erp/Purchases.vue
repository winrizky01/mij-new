<template>
    <div class="space-y-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Pembelian
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Kelola pengajuan, persetujuan, pembelian, dan penerimaan
                    barang.
                </p>
            </div>

            <button
                type="button"
                @click="openCreateModal"
                class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
                + Buat Pembelian
            </button>
        </div>

        <!-- Summary -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
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

        <!-- Filters -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="grid gap-3 md:grid-cols-4">
                <div class="md:col-span-2">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Cari nomor dokumen, keperluan, supplier..."
                        class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <select
                    v-model="statusFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                    <option value="all">
                        Semua Status
                    </option>
                    <option value="draft">
                        Dibuat
                    </option>
                    <option value="submitted">
                        Diajukan
                    </option>
                    <option value="purchased">
                        Dibeli
                    </option>
                    <option value="received">
                        Diterima
                    </option>
                </select>

                <select
                    v-model="supplierFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                    <option value="all">
                        Semua Supplier
                    </option>
                    <option
                        v-for="supplier in suppliers"
                        :key="supplier.id"
                        :value="supplier.id"
                    >
                        {{ supplier.name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Table -->
        <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="overflow-x-auto">
                <table class="w-full min-w-[1100px] text-left">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Dokumen
                            </th>
                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Keperluan
                            </th>
                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Supplier
                            </th>
                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Tanggal
                            </th>
                            <th class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                Total
                            </th>
                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Status
                            </th>
                            <th class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="purchase in filteredPurchases"
                            :key="purchase.id"
                            class="hover:bg-gray-50"
                        >
                            <td class="px-5 py-4">
                                <div>
                                    <p class="font-semibold text-gray-900">
                                        {{ purchase.documentNumber }}
                                    </p>

                                    <p class="mt-1 text-xs text-gray-400">
                                        {{ documentNumberLabel(purchase) }}
                                    </p>
                                </div>
                            </td>

                            <td class="px-5 py-4">
                                <p class="text-sm font-medium text-gray-800">
                                    {{ purchase.purpose }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ purchase.items.length }} item
                                </p>
                            </td>

                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ purchase.supplierName || '-' }}
                            </td>

                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ formatDate(purchase.date) }}
                            </td>

                            <td class="px-5 py-4 text-right">
                                <span class="text-sm font-semibold text-gray-900">
                                    {{ formatCurrency(purchase.total) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="rounded-full px-3 py-1 text-xs font-medium"
                                    :class="statusClass(purchase.status)"
                                >
                                    {{ statusLabel(purchase.status) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        @click="openShowModal(purchase)"
                                        class="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                                    >
                                        Lihat
                                    </button>

                                    <button
                                        v-if="purchase.status === 'draft'"
                                        type="button"
                                        @click="openEditModal(purchase)"
                                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        v-if="purchase.status === 'submitted'"
                                        type="button"
                                        @click="openApprovalModal(purchase)"
                                        class="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                                    >
                                        Approval
                                    </button>

                                    <button
                                        v-if="purchase.status === 'purchased'"
                                        type="button"
                                        @click="openReceiveModal(purchase)"
                                        class="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100"
                                    >
                                        Terima
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredPurchases.length === 0">
                            <td
                                colspan="7"
                                class="px-5 py-14 text-center"
                            >
                                <div class="text-4xl">
                                    🧾
                                </div>

                                <p class="mt-4 text-sm font-semibold text-gray-900">
                                    Data pembelian tidak ditemukan
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    Coba ubah pencarian atau filter.
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="border-t border-gray-100 px-5 py-4">
                <p class="text-xs text-gray-500">
                    Menampilkan
                    <span class="font-semibold text-gray-700">
                        {{ filteredPurchases.length }}
                    </span>
                    dari
                    <span class="font-semibold text-gray-700">
                        {{ purchases.length }}
                    </span>
                    pembelian
                </p>
            </div>
        </div>

        <!-- Modals -->
        <PurchaseCreateModal
            :show="showCreateModal"
            :products="products"
            :suppliers="suppliers"
            :purchases="purchases"
            @close="showCreateModal = false"
            @saved="handleCreateSaved"
        />

        <PurchaseEditModal
            :show="showEditModal"
            :purchase="selectedPurchase"
            :products="products"
            :suppliers="suppliers"
            @close="showEditModal = false"
            @saved="handleEdited"
        />

        <PurchaseShowModal
            :show="showShowModal"
            :purchase="selectedPurchase"
            @close="showShowModal = false"
            @edit="handleShowEdit"
        />

        <PurchaseApprovalModal
            :show="showApprovalModal"
            :purchase="selectedPurchase"
            :purchases="purchases"
            @close="showApprovalModal = false"
            @approved="handleApproval"
        />

        <PurchaseReceiveModal
            :show="showReceiveModal"
            :purchase="selectedPurchase"
            :warehouses="warehouses"
            @close="showReceiveModal = false"
            @received="handleReceived"
        />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import PurchaseCreateModal from '../../components/erp/purchases/PurchaseCreateModal.vue'
import PurchaseEditModal from '../../components/erp/purchases/PurchaseEditModal.vue'
import PurchaseShowModal from '../../components/erp/purchases/PurchaseShowModal.vue'
import PurchaseApprovalModal from '../../components/erp/purchases/PurchaseApprovalModal.vue'
import PurchaseReceiveModal from '../../components/erp/purchases/PurchaseReceiveModal.vue'

const search = ref('')
const statusFilter = ref('all')
const supplierFilter = ref('all')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showShowModal = ref(false)
const showApprovalModal = ref(false)
const showReceiveModal = ref(false)

const selectedPurchase = ref(null)

const suppliers = ref([
    {
        id: 1,
        name: 'PT Supplier Jaya',
    },
    {
        id: 2,
        name: 'CV Sumber Makmur',
    },
    {
        id: 3,
        name: 'PT Maju Bersama',
    },
])

const products = ref([
    {
        id: 1,
        name: 'Ban Truk',
        code: 'PRD-0001',
        unit: 'PCS',
    },
    {
        id: 2,
        name: 'Oli Mesin 15W-40',
        code: 'PRD-0002',
        unit: 'LITER',
    },
    {
        id: 3,
        name: 'Kampas Rem',
        code: 'PRD-0003',
        unit: 'SET',
    },
    {
        id: 4,
        name: 'Saklar Single',
        code: 'PRD-0004',
        unit: 'PCS',
    },
])

const warehouses = ref([
    {
        id: 1,
        name: 'Gudang Utama',
    },
    {
        id: 2,
        name: 'Gudang Sparepart',
    },
])

const purchases = ref([
    {
        id: 1,
        documentNumber: 'PR-2026-0001',
        requestNumber: null,
        purchaseOrderNumber: null,
        receiptNumber: null,
        date: '2026-10-02',
        supplierId: null,
        supplierName: null,
        purpose: 'Kebutuhan sparepart kendaraan',
        notes: 'Pengadaan untuk stok operasional.',
        status: 'draft',
        items: [
            {
                productId: 1,
                productName: 'Ban Truk',
                quantity: 4,
                unit: 'PCS',
                price: null,
                subtotal: null,
                receivedQuantity: 0,
            },
            {
                productId: 2,
                productName: 'Oli Mesin 15W-40',
                quantity: 10,
                unit: 'LITER',
                price: null,
                subtotal: null,
                receivedQuantity: 0,
            },
        ],
        total: 0,
    },

    {
        id: 2,
        documentNumber: 'REQ-2026-0001',
        requestNumber: 'REQ-2026-0001',
        purchaseOrderNumber: null,
        receiptNumber: null,
        date: '2026-10-01',
        supplierId: 1,
        supplierName: 'PT Supplier Jaya',
        purpose: 'Pembelian kebutuhan maintenance',
        notes: '',
        status: 'submitted',
        items: [
            {
                productId: 3,
                productName: 'Kampas Rem',
                quantity: 2,
                unit: 'SET',
                price: 350000,
                subtotal: 700000,
                receivedQuantity: 0,
            },
        ],
        total: 700000,
    },

    {
        id: 3,
        documentNumber: 'PO-2026-0001',
        requestNumber: 'REQ-2026-0002',
        purchaseOrderNumber: 'PO-2026-0001',
        receiptNumber: null,
        date: '2026-09-30',
        supplierId: 2,
        supplierName: 'CV Sumber Makmur',
        purpose: 'Pengadaan oli kendaraan',
        notes: '',
        status: 'purchased',
        items: [
            {
                productId: 2,
                productName: 'Oli Mesin 15W-40',
                quantity: 20,
                unit: 'LITER',
                price: 85000,
                subtotal: 1700000,
                receivedQuantity: 0,
            },
        ],
        total: 1700000,
    },

    {
        id: 4,
        documentNumber: 'GR-2026-0001',
        requestNumber: 'REQ-2026-0003',
        purchaseOrderNumber: 'PO-2026-0002',
        receiptNumber: 'GR-2026-0001',
        date: '2026-09-28',
        supplierId: 3,
        supplierName: 'PT Maju Bersama',
        purpose: 'Pengadaan tools workshop',
        notes: 'Barang sudah diterima lengkap.',
        status: 'received',
        items: [
            {
                productId: 4,
                productName: 'Saklar Single',
                quantity: 10,
                unit: 'PCS',
                price: 15000,
                subtotal: 150000,
                receivedQuantity: 10,
            },
        ],
        total: 150000,
        receivedDate: '2026-09-29',
        warehouseId: 1,
        warehouseName: 'Gudang Utama',
    },
])

const filteredPurchases = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return purchases.value.filter((purchase) => {
        const matchesSearch =
            !keyword ||
            purchase.documentNumber
                ?.toLowerCase()
                .includes(keyword) ||
            purchase.requestNumber
                ?.toLowerCase()
                .includes(keyword) ||
            purchase.purchaseOrderNumber
                ?.toLowerCase()
                .includes(keyword) ||
            purchase.purpose
                ?.toLowerCase()
                .includes(keyword) ||
            purchase.supplierName
                ?.toLowerCase()
                .includes(keyword)

        const matchesStatus =
            statusFilter.value === 'all' ||
            purchase.status === statusFilter.value

        const matchesSupplier =
            supplierFilter.value === 'all' ||
            purchase.supplierId === Number(supplierFilter.value)

        return (
            matchesSearch &&
            matchesStatus &&
            matchesSupplier
        )
    })
})

const summaryCards = computed(() => [
    {
        label: 'Dibuat',
        value: purchases.value.filter(
            (item) => item.status === 'draft'
        ).length,
        color: 'text-gray-900',
    },
    {
        label: 'Diajukan',
        value: purchases.value.filter(
            (item) => item.status === 'submitted'
        ).length,
        color: 'text-blue-600',
    },
    {
        label: 'Dibeli',
        value: purchases.value.filter(
            (item) => item.status === 'purchased'
        ).length,
        color: 'text-orange-600',
    },
    {
        label: 'Diterima',
        value: purchases.value.filter(
            (item) => item.status === 'received'
        ).length,
        color: 'text-green-600',
    },
    {
        label: 'Total Pembelian',
        value: formatCurrency(
            purchases.value.reduce(
                (total, item) => total + Number(item.total || 0),
                0
            )
        ),
        color: 'text-[#003366]',
    },
])

function openCreateModal() {
    showCreateModal.value = true
}

function openEditModal(purchase) {
    selectedPurchase.value = purchase
    showEditModal.value = true
}

function openShowModal(purchase) {
    selectedPurchase.value = purchase
    showShowModal.value = true
}

function openApprovalModal(purchase) {
    selectedPurchase.value = purchase
    showApprovalModal.value = true
}

function openReceiveModal(purchase) {
    selectedPurchase.value = purchase
    showReceiveModal.value = true
}

function handleCreated(purchase) {
    purchases.value.unshift(purchase)
    showCreateModal.value = false
}

function handleEdited(updatedPurchase) {
    const index = purchases.value.findIndex(
        (item) => item.id === updatedPurchase.id
    )

    if (index !== -1) {
        purchases.value[index] = updatedPurchase
    }

    showEditModal.value = false
}

function handleShowEdit(purchase) {
    showShowModal.value = false
    openEditModal(purchase)
}

function handleApproved(updatedPurchase) {
    const index = purchases.value.findIndex(
        (item) => item.id === updatedPurchase.id
    )

    if (index !== -1) {
        purchases.value[index] = updatedPurchase
    }

    showApprovalModal.value = false
}

function handleReceived(updatedPurchase) {
    const index = purchases.value.findIndex(
        (item) => item.id === updatedPurchase.id
    )

    if (index !== -1) {
        purchases.value[index] = updatedPurchase
    }

    showReceiveModal.value = false
}

function statusLabel(status) {
    return {
        draft: 'Dibuat',
        submitted: 'Diajukan',
        purchased: 'Dibeli',
        received: 'Diterima',
    }[status] || status
}

function statusClass(status) {
    return {
        draft: 'bg-gray-100 text-gray-600',
        submitted: 'bg-blue-50 text-blue-700',
        purchased: 'bg-orange-50 text-orange-700',
        received: 'bg-green-50 text-green-700',
    }[status]
}

function documentNumberLabel(purchase) {
    if (purchase.status === 'draft') {
        return 'Purchase Request'
    }

    if (purchase.status === 'submitted') {
        return 'Request Approval'
    }

    if (purchase.status === 'purchased') {
        return 'Purchase Order'
    }

    return 'Goods Receipt'
}

function formatCurrency(value) {
    if (value === null || value === undefined) {
        return '-'
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
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