<template>
    <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
        <div
            class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
            <!-- HEADER -->
            <div
                class="flex items-center justify-between border-b border-gray-100 px-6 py-5"
            >
                <div>
                    <h2 class="text-lg font-bold text-gray-900">
                        {{ isEditMode ? 'Edit Purchase Order' : 'Buat Purchase Order' }}
                    </h2>

                    <p class="mt-1 text-sm text-gray-500">
                        {{
                            isEditMode
                                ? 'Ubah Purchase Order yang masih berstatus draft.'
                                : 'Buat PO berdasarkan Purchase Request yang telah disetujui.'
                        }}
                    </p>
                </div>

                <button
                    type="button"
                    @click="close"
                    :disabled="saving"
                    class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>

            <!-- BODY -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
                <!-- ERROR -->
                <div
                    v-if="errorMessage"
                    class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {{ errorMessage }}
                </div>

                <!-- PR INFO -->
                <div
                    class="mb-6 grid gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-4"
                >
                    <div>
                        <p class="text-xs text-gray-500">
                            Nomor PR
                        </p>

                        <p class="mt-1 font-semibold text-gray-900">
                            {{ purchase?.request_number || '-' }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-500">
                            Tanggal PR
                        </p>

                        <p class="mt-1 font-medium text-gray-800">
                            {{ formatDate(purchase?.request_date) }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-500">
                            Peminta
                        </p>

                        <p class="mt-1 font-medium text-gray-800">
                            {{
                                purchase?.requestedBy?.name ||
                                purchase?.requested_by?.name ||
                                purchase?.createdBy?.name ||
                                purchase?.created_by?.name ||
                                '-'
                            }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-500">
                            Status PR
                        </p>

                        <span
                            class="mt-1 inline-flex rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"
                        >
                            Disetujui
                        </span>
                    </div>
                </div>

                <!-- PO INFO -->
                <div class="mb-6">
                    <div class="mb-3 flex items-center justify-between">
                        <h3 class="text-sm font-bold text-gray-900">
                            Informasi Purchase Order
                        </h3>

                        <span
                            v-if="isEditMode && purchaseOrder?.po_number"
                            class="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                        >
                            {{ purchaseOrder.po_number }}
                        </span>
                    </div>

                    <div class="grid gap-4 md:grid-cols-3">
                        <!-- SUPPLIER -->
                        <div class="md:col-span-2">
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Supplier
                                <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.supplier_id"
                                :disabled="loadingSuppliers || saving"
                                class="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                            >
                                <option value="">
                                    {{
                                        loadingSuppliers
                                            ? 'Memuat supplier...'
                                            : 'Pilih supplier'
                                    }}
                                </option>

                                <option
                                    v-for="supplier in suppliers"
                                    :key="supplier.id"
                                    :value="supplier.id"
                                >
                                    {{
                                        supplier.name ||
                                        supplier.company_name ||
                                        supplier.partner_name ||
                                        `Supplier #${supplier.id}`
                                    }}
                                </option>
                            </select>
                        </div>

                        <!-- PO DATE -->
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Tanggal PO
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.po_date"
                                type="date"
                                :disabled="saving"
                                class="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <!-- EXPECTED DATE -->
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Perkiraan Tiba
                            </label>

                            <input
                                v-model="form.expected_date"
                                type="date"
                                :disabled="saving"
                                class="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <!-- NOTES -->
                        <div class="md:col-span-2">
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Catatan PO
                            </label>

                            <textarea
                                v-model="form.notes"
                                rows="2"
                                :disabled="saving"
                                placeholder="Catatan untuk supplier..."
                                class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- ITEMS -->
                <div>
                    <div class="mb-3 flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-bold text-gray-900">
                                Item Purchase Order
                            </h3>

                            <p class="mt-1 text-xs text-gray-500">
                                Item PR dan item tambahan dapat digabung dalam satu PO.
                            </p>
                        </div>

                        <div class="flex items-center gap-3">
                            <span class="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                {{ form.items.length }} item
                            </span>

                            <button
                                type="button"
                                @click="openAddItem"
                                :disabled="saving"
                                class="rounded-xl bg-[#0052cc] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0047b3] disabled:opacity-50"
                            >
                                + Tambah Item
                            </button>
                        </div>
                    </div>

                    <div class="overflow-hidden rounded-xl border border-gray-200">
                        <div class="overflow-x-auto">
                            <table class="w-full min-w-[900px] text-left">
                                <thead class="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                            Produk
                                        </th>
                                        <th class="w-28 px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                            Qty
                                        </th>
                                        <th class="w-28 px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                            Satuan
                                        </th>
                                        <th class="w-40 px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                            Harga
                                        </th>
                                        <th class="w-40 px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                            Subtotal
                                        </th>
                                        <th class="w-28 px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                                            Sumber / Aksi
                                        </th>
                                    </tr>
                                </thead>


                                <tbody class="divide-y divide-gray-100">
                                    <tr
                                        v-for="item in form.items"
                                        :key="item.uid"
                                    >
                                        <!-- PRODUCT -->
                                        <td class="px-4 py-4">
                                            <p class="font-medium text-gray-900">
                                                {{ item.productName }}
                                            </p>

                                            <p
                                                v-if="item.productCode"
                                                class="mt-1 text-xs text-gray-400"
                                            >
                                                {{ item.productCode }}
                                            </p>
                                        </td>

                                        <!-- QTY -->
                                        <td class="px-4 py-4">
                                            <input
                                                v-model.number="item.quantity"
                                                type="number"
                                                min="0.001"
                                                step="0.001"
                                                :disabled="saving"
                                                class="h-9 w-full rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </td>

                                        <!-- UNIT -->
                                        <td class="px-4 py-4">
                                            <span class="text-sm text-gray-600">
                                                {{ item.unitName || '-' }}
                                            </span>
                                        </td>

                                        <!-- PRICE -->
                                        <td class="px-4 py-4">
                                            <input
                                                v-model.number="item.unitPrice"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                :disabled="saving"
                                                placeholder="0"
                                                class="h-9 w-full rounded-lg border border-gray-200 px-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                            <p
                                                class="mt-1 text-[11px] text-gray-400"
                                            >
                                                Harga /
                                                {{ item.unitName || 'unit' }}
                                            </p>
                                        </td>

                                        <!-- SUBTOTAL -->
                                        <td class="px-4 py-4 text-right">
                                            <p
                                                class="font-semibold text-gray-900"
                                            >
                                                {{
                                                    formatCurrency(
                                                        itemSubtotal(item)
                                                    )
                                                }}
                                            </p>
                                        </td>

                                        <!-- Sumber -->
                                        <td class="px-4 py-3 text-center">
                                            <span
                                                v-if="item.source === 'pr'"
                                                class="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                                            >
                                                PR
                                            </span>

                                            <span
                                                v-else
                                                class="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
                                            >
                                                Tambahan
                                            </span>

                                            <button
                                                type="button"
                                                title="Hapus item"
                                                aria-label="Hapus item"
                                                class="inline-flex items-center justify-center rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                                @click="removeItem(item.uid)"
                                            >
                                                <Trash2 size="18" />
                                            </button>
                                        </td>

                                    </tr>

                                    <tr v-if="form.items.length === 0">
                                        <td
                                            colspan="5"
                                            class="px-4 py-10 text-center text-sm text-gray-500"
                                        >
                                            Tidak ada item dari Purchase Request.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TOTAL -->
                <div class="mt-6 flex justify-end">
                    <div
                        class="w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">
                                Subtotal
                            </span>

                            <span class="font-semibold text-gray-900">
                                {{ formatCurrency(subtotal) }}
                            </span>
                        </div>

                        <div class="mt-3 flex items-center justify-between">
                            <span class="text-sm text-gray-500">
                                Diskon
                            </span>

                            <input
                                v-model.number="form.discount_amount"
                                type="number"
                                min="0"
                                step="0.01"
                                :disabled="saving"
                                class="h-9 w-32 rounded-lg border border-gray-200 bg-white px-2 text-right text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div class="mt-3 flex items-center justify-between">
                            <span class="text-sm text-gray-500">
                                Pajak
                            </span>

                            <input
                                v-model.number="form.tax_amount"
                                type="number"
                                min="0"
                                step="0.01"
                                :disabled="saving"
                                class="h-9 w-32 rounded-lg border border-gray-200 bg-white px-2 text-right text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div class="my-4 border-t border-gray-200"></div>

                        <div class="flex items-center justify-between">
                            <span class="font-bold text-gray-900">
                                Total
                            </span>

                            <span class="text-xl font-bold text-[#0052cc]">
                                {{ formatCurrency(totalAmount) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FOOTER -->
            <div
                class="flex items-center justify-between border-t border-gray-100 px-6 py-4"
            >
                <p class="text-xs text-gray-400">
                    {{
                        isEditMode
                            ? 'Perubahan hanya dapat dilakukan selama PO berstatus draft.'
                            : 'PO akan dibuat dari PR yang telah disetujui.'
                    }}
                </p>

                <div class="flex gap-3">
                    <button
                        type="button"
                        @click="close"
                        :disabled="saving"
                        class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="save"
                        :disabled="saving || !canSave"
                        class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0047b3] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {{
                            saving
                                ? 'Menyimpan...'
                                : isEditMode
                                    ? 'Simpan Perubahan'
                                    : 'Buat Purchase Order'
                        }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL TAMBAH ITEM PEMBELIAN -->
    <div
    v-if="showAddItem"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
    @click.self="showAddItem = false"
    >
    <div
        class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
    >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
            <h3 class="text-lg font-bold text-slate-800">
            Tambah Item Pembelian
            </h3>
            <p class="mt-1 text-sm text-slate-500">
            Tambahkan produk di luar item Purchase Request.
            </p>
        </div>

        <button
            type="button"
            class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            @click="showAddItem = false"
        >
            ✕
        </button>
        </div>

        <!-- Form -->
        <div class="space-y-5 p-6">
        <!-- Cari produk -->
        <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">
            Cari Produk <span class="text-red-500">*</span>
            </label>

            <input
            v-model="productSearch"
            type="text"
            placeholder="Cari nama produk atau kode SKU..."
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
        </div>

        <!-- Pilih produk -->
        <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">
            Produk <span class="text-red-500">*</span>
            </label>

            <select
            v-model="selectedProductId"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            :disabled="loadingProducts"
            >
            <option value="" disabled>
                {{ loadingProducts ? 'Memuat produk...' : 'Pilih produk' }}
            </option>

            <option
                v-for="product in filteredProducts"
                :key="product.id"
                :value="String(product.id)"
            >
                {{ product.code || product.sku || '-' }}
                — {{ product.name || product.product_name }}
            </option>
            </select>

            <p
            v-if="!loadingProducts && filteredProducts.length === 0"
            class="mt-2 text-xs text-amber-600"
            >
            Produk tidak ditemukan. Coba kata kunci lain.
            </p>
        </div>

        <!-- Detail produk terpilih -->
        <div
            v-if="selectedProduct"
            class="rounded-xl border border-sky-100 bg-sky-50 p-4"
        >
            <p class="text-xs font-medium uppercase tracking-wide text-sky-700">
            Produk terpilih
            </p>

            <p class="mt-1 font-semibold text-slate-800">
            {{ selectedProduct.name || selectedProduct.product_name }}
            </p>

            <p class="mt-1 text-sm text-slate-500">
            Kode:
            {{ selectedProduct.code || selectedProduct.sku || '-' }}
            </p>
        </div>

        <!-- Qty & Harga -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">
                Kuantitas <span class="text-red-500">*</span>
            </label>

            <input
                v-model.number="additionalQuantity"
                type="number"
                min="1"
                step="1"
                placeholder="0"
                class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            </div>

            <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">
                Harga Satuan (Rp) <span class="text-red-500">*</span>
            </label>

            <input
                v-model.number="additionalUnitPrice"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            </div>
        </div>

        <!-- Subtotal -->
        <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span class="text-sm text-slate-600">Subtotal item</span>
            <span class="text-lg font-bold text-slate-800">
            {{
                (Math.max(0, Number(additionalQuantity) || 0) *
                Math.max(0, Number(additionalUnitPrice) || 0))
                .toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 2
                })
            }}
            </span>
        </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            @click="showAddItem = false"
        >
            Batal
        </button>

        <button
            type="button"
            class="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="
            loadingProducts ||
            !selectedProduct ||
            !Number.isFinite(Number(additionalQuantity)) ||
            Number(additionalQuantity) <= 0 ||
            !Number.isFinite(Number(additionalUnitPrice)) ||
            Number(additionalUnitPrice) < 0
            "
            @click="addAdditionalItem"
        >
            + Tambahkan Item
        </button>
        </div>
    </div>
    </div>

</template>

<script setup>
import {
    computed,
    reactive,
    ref,
    watch,
} from 'vue'

import {
    Trash2,
} from 'lucide-vue-next'

import {
    erpApi,
    getApiError,
} from '@/services/api'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    purchase: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'close',
    'saved',
])


// =========================================================
// STATE
// =========================================================

const suppliers = ref([])
const loadingSuppliers = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const form = reactive({
    supplier_id: '',
    po_date: '',
    expected_date: '',
    discount_amount: 0,
    tax_amount: 0,
    notes: '',
    items: [],
})

const products              = ref([])
const loadingProducts       = ref(false)
const showAddItem           = ref(false)
const productSearch         = ref('')
const selectedProductId     = ref('')
const additionalQuantity    = ref(1)
const additionalUnitPrice   = ref(0)

const filteredProducts = computed(() => {
    const keyword = productSearch.value
        .trim()
        .toLowerCase()

    if (!keyword) return products.value

    return products.value.filter(product =>
        [
            product.name,
            product.product_name,
            product.code,
            product.sku,
        ].some(value =>
            String(value || '')
                .toLowerCase()
                .includes(keyword)
        )
    )
})

const selectedProduct = computed(() =>
    products.value.find(
        product =>
            Number(product.id) ===
            Number(selectedProductId.value)
    ) || null
)

async function openAddItem() {
    showAddItem.value           = true
    productSearch.value         = ''
    selectedProductId.value     = ''
    additionalQuantity.value    = 1
    additionalUnitPrice.value   = 0

    if (products.value.length) return

    loadingProducts.value = true

    try {
        const response =
            await erpApi.master.products.list({
                is_active: true,
            })

        products.value =
            response?.data?.data ||
            response?.data ||
            []
    } catch (error) {
        errorMessage.value =
            getApiError(error) ||
            'Gagal memuat master produk.'
    } finally {
        loadingProducts.value = false
    }
}

function addAdditionalItem() {
    const product = selectedProduct.value

    if (!product) {
        errorMessage.value = 'Pilih produk terlebih dahulu.'
        return
    }

    const quantity = Number(additionalQuantity.value)
    const unitPrice = Number(additionalUnitPrice.value)

    if (
        !Number.isFinite(quantity) ||
        quantity <= 0 ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
    ) {
        errorMessage.value =
            'Kuantitas harus lebih dari nol dan harga tidak boleh negatif.'
        return
    }

    // Ambil satuan default produk.
    const unit = product.unit || product.uom || null

    form.items.push({
        uid: `additional-${Date.now()}-${Math.random()}`,
        id: null,
        purchase_request_item_id: null,
        source: 'additional',
        product_id: Number(product.id),
        productName:
            product.name ||
            product.product_name ||
            '-',
        productCode: product.code || product.sku || '',
        quantity,
        unit_id: product.unit_id ?? unit?.id ?? null,
        unitName: unit?.name || unit?.code || '-',
        unitPrice,
    })

    errorMessage.value = ''
    showAddItem.value = false
}

function removeItem(uid) {
    const index = form.items.findIndex(
        item => item.uid === uid
    )

    if (index === -1) return

    // Hanya menghapus dari form.
    // PR di database tidak disentuh.
    form.items.splice(index, 1)
}

// =========================================================
// PURCHASE ORDER
// =========================================================

const purchaseOrder = computed(() => {
    return (
        props.purchase?.purchase_order ||
        props.purchase?.purchaseOrder ||
        props.purchase?.purchase_orders?.[0] ||
        props.purchase?.purchaseOrders?.[0] ||
        null
    )
})

const isEditMode = computed(() => {
    return (
        !!purchaseOrder.value &&
        purchaseOrder.value.status === 'draft'
    )
})


// =========================================================
// COMPUTED
// =========================================================

const subtotal = computed(() => {
    return form.items.reduce(
        (total, item) =>
            total + itemSubtotal(item),
        0
    )
})

const totalAmount = computed(() => {
    return Math.max(
        0,
        subtotal.value -
            Number(form.discount_amount || 0) +
            Number(form.tax_amount || 0)
    )
})

const canSave = computed(() => {
    if (!props.purchase?.id) return false

    if (purchaseOrder.value && !isEditMode.value) {
        return false
    }

    if (!form.supplier_id || !form.po_date) {
        return false
    }

    if (!form.items.length) return false

    if (
        Number(form.discount_amount) < 0 ||
        Number(form.tax_amount) < 0 ||
        Number(form.discount_amount) > subtotal.value
    ) {
        return false
    }

    return form.items.every(item =>
        Number(item.product_id) > 0 &&
        Number(item.quantity) > 0 &&
        Number.isFinite(Number(item.unitPrice)) &&
        Number(item.unitPrice) >= 0
    )
})


// =========================================================
// LOAD SUPPLIERS
// =========================================================

async function loadSuppliers() {
    loadingSuppliers.value = true

    try {
        const response =
            await erpApi.master.partners.list({
                type: 'supplier',
                is_active: true,
            })

        suppliers.value =
            response?.data?.data ||
            response?.data ||
            []
    } catch (error) {
        console.error(
            'Gagal memuat supplier:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Gagal memuat supplier.'
    } finally {
        loadingSuppliers.value = false
    }
}


// =========================================================
// PREPARE FORM
// =========================================================

function prepareForm() {
    errorMessage.value = ''

    const po = purchaseOrder.value

    /*
    |--------------------------------------------------------------------------
    | EDIT PO DRAFT
    |--------------------------------------------------------------------------
    */

    if (po && po.status === 'draft') {

        form.supplier_id        = po.supplier_id ?? po.supplier?.id ?? ''
        form.po_date            = normalizeDate(po.po_date) || today()
        form.expected_date      = normalizeDate(po.expected_date) || ''
        form.discount_amount    = Number(po.discount_amount || 0)
        form.tax_amount         = Number(po.tax_amount || 0)
        form.notes              = po.notes || ''

        form.items = (purchaseOrder.value.items || []).map((item, index) => {
            const requestItemId = item.purchase_request_item_id ?? item.purchase_request_item?.id ?? null

            return {
                uid : `po-${item.id || index}-${index}`,
                id  : item.id || null,
                purchase_request_item_id: requestItemId,
                source: requestItemId ? 'pr' : 'additional',

                product_id  : item.product_id,
                productName : item.product?.name || item.product_name || '-',
                productCode : item.product?.code || item.product?.sku || item.product_code || '-',

                quantity : Number(item.quantity || 0),
                unit_id  : item.unit_id || null,
                unitName : item.unit?.name || item.unit?.code || item.unit_name || '-',
                unitPrice: Number(item.unit_price ?? item.unitPrice ?? 0),
            }
        })


        return
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE PO
    |--------------------------------------------------------------------------
    */

    form.supplier_id = ''

    form.po_date = today()

    form.expected_date = ''

    form.discount_amount = 0

    form.tax_amount = 0

    form.notes = ''

    form.items = (props.purchase?.items || []).map(
        (item, index) => ({
            uid: `pr-${item.id || index}-${Date.now()}`,
            id: null,

            purchase_request_item_id: item.id,
            source: 'pr',

            product_id:
                item.product_id ??
                item.product?.id ??
                null,

            productName:
                item.product?.name ||
                item.product?.product_name ||
                '-',

            productCode:
                item.product?.code ||
                item.product?.sku ||
                '',

            quantity: Number(item.quantity || 0),

            unit_id:
                item.unit_id ??
                item.unit?.id ??
                null,

            unitName:
                item.unit?.name ||
                item.unit?.code ||
                '-',

            unitPrice: 0,
        })
    )
}


// =========================================================
// ITEM CALCULATION
// =========================================================

function itemSubtotal(item) {
    return (
        Number(item.quantity || 0) *
        Number(item.unitPrice || 0)
    )
}


// =========================================================
// SAVE
// =========================================================

async function save() {
    if (!canSave.value) {
        errorMessage.value =
            'Lengkapi supplier, tanggal PO, dan harga setiap item.'

        return
    }

    saving.value = true

    errorMessage.value = ''

    try {
        const payload = {
            supplier_id:
                Number(form.supplier_id),

            /*
             * PR tetap menjadi sumber PO.
             * Pada update backend sebaiknya purchase_request_id
             * tidak dipindahkan.
             */
            purchase_request_id:
                Number(props.purchase.id),

            po_date:
                form.po_date,

            expected_date:
                form.expected_date ||
                null,

            discount_amount:
                Number(form.discount_amount || 0),

            tax_amount:
                Number(form.tax_amount || 0),

            total_amount:
                Number(totalAmount.value),

            notes:
                form.notes ||
                null,

            items: form.items.map(item => ({
                ...(isEditMode.value && item.id
                    ? { id: item.id }
                    : {}),

                purchase_request_item_id:
                    item.source === 'pr'
                        ? Number(item.purchase_request_item_id)
                        : null,

                product_id: Number(item.product_id),
                quantity: Number(item.quantity),

                unit_id: item.unit_id
                    ? Number(item.unit_id)
                    : null,

                unit_price: Number(item.unitPrice),

                discount_amount: 0,
                tax_amount: 0,

                subtotal: Number(itemSubtotal(item)),
            })),
        }

        let response

        /*
        |--------------------------------------------------------------------------
        | CREATE
        |--------------------------------------------------------------------------
        */

        if (!isEditMode.value) {
            response =
                await erpApi.purchases.orders.create(
                    payload
                )
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        else {
            response =
                await erpApi.purchases.orders.update(
                    purchaseOrder.value.id,
                    payload
                )
        }

        emit(
            'saved',
            response?.data?.data ||
            response?.data ||
            null
        )
    } catch (error) {
        console.error(
            isEditMode.value
                ? 'Gagal mengubah Purchase Order:'
                : 'Gagal membuat Purchase Order:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            (
                isEditMode.value
                    ? 'Purchase Order gagal diubah.'
                    : 'Purchase Order gagal dibuat.'
            )
    } finally {
        saving.value = false
    }
}


// =========================================================
// CLOSE
// =========================================================

function close() {
    if (saving.value) {
        return
    }

    emit('close')
}


// =========================================================
// WATCH
// =========================================================

watch(
    () => props.show,
    async (visible) => {
        if (!visible) {
            return
        }

        prepareForm()

        if (!suppliers.value.length) {
            await loadSuppliers()
        }
    }
)


// =========================================================
// HELPERS
// =========================================================

function today() {
    const date = new Date()

    const year =
        date.getFullYear()

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, '0')

    const day =
        String(
            date.getDate()
        ).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function normalizeDate(value) {
    if (!value) {
        return ''
    }

    if (
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {
        return value.substring(0, 10)
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    const year =
        date.getFullYear()

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, '0')

    const day =
        String(
            date.getDate()
        ).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function formatDate(value) {
    if (!value) {
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
        new Date(value)
    )
}

function formatCurrency(value) {
    return new Intl.NumberFormat(
        'id-ID',
        {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }
    ).format(
        Number(value || 0)
    )
}
</script>