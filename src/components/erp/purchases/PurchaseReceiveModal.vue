<template>
    <Transition name="modal">
        <div
            v-if="show && purchase"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div
                class="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- HEADER -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-5 py-4"
                >
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">
                            Penerimaan Barang
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ purchase.purchaseOrderNumber || poNumber }}
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="close"
                        :disabled="saving"
                        class="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <!-- CONTENT -->
                <div
                    class="max-h-[72vh] overflow-y-auto p-5 sm:p-6"
                >
                    <!-- ERROR -->
                    <div
                        v-if="errorMessage"
                        class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                    >
                        <p class="text-sm font-semibold text-red-800">
                            Penerimaan gagal
                        </p>

                        <p class="mt-1 text-xs text-red-700">
                            {{ errorMessage }}
                        </p>
                    </div>

                    <!-- HEADER FORM -->
                    <div class="grid gap-4 sm:grid-cols-2">
                        <!-- DATE -->
                        <div>
                            <label
                                class="text-sm font-medium text-gray-700"
                            >
                                Tanggal Penerimaan
                            </label>

                            <input
                                v-model="form.receiptDate"
                                type="date"
                                :disabled="saving"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                            />
                        </div>

                    </div>

                    <!-- ITEMS -->
                    <div class="mt-6">
                        <div
                            class="mb-3 flex items-center justify-between"
                        >
                            <h3
                                class="text-sm font-bold text-gray-900"
                            >
                                Barang Diterima
                            </h3>

                            <span
                                class="text-xs text-gray-500"
                            >
                                Isi jumlah barang yang benar-benar diterima
                            </span>
                        </div>

                        <div
                            class="overflow-x-auto rounded-xl border border-gray-200"
                        >
                            <table
                                class="w-full min-w-[720px]"
                            >
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Barang
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Dipesan
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Sudah Diterima
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Sisa
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Terima
                                        </th>
                                    </tr>
                                </thead>

                                <tbody
                                    class="divide-y divide-gray-100"
                                >
                                    <tr
                                        v-for="item in form.items"
                                        :key="item.purchaseOrderItemId"
                                    >
                                        <!-- PRODUCT -->
                                        <td class="px-4 py-3">
                                            <p
                                                class="text-sm font-semibold text-gray-900"
                                            >
                                                {{ item.productName }}
                                            </p>

                                            <p
                                                class="mt-0.5 text-xs text-gray-400"
                                            >
                                                {{ item.unitName || '-' }}
                                            </p>
                                        </td>

                                        <!-- ORDERED -->
                                        <td
                                            class="px-4 py-3 text-right text-sm text-gray-700"
                                        >
                                            {{ formatQuantity(item.quantity) }}
                                        </td>

                                        <!-- RECEIVED -->
                                        <td
                                            class="px-4 py-3 text-right text-sm text-gray-500"
                                        >
                                            {{
                                                formatQuantity(
                                                    item.receivedQuantity
                                                )
                                            }}
                                        </td>

                                        <!-- REMAINING -->
                                        <td
                                            class="px-4 py-3 text-right"
                                        >
                                            <span
                                                class="text-sm font-semibold"
                                                :class="
                                                    remaining(item) === 0
                                                        ? 'text-green-600'
                                                        : 'text-orange-600'
                                                "
                                            >
                                                {{
                                                    formatQuantity(
                                                        remaining(item)
                                                    )
                                                }}
                                            </span>
                                        </td>

                                        <!-- RECEIVE -->
                                        <td
                                            class="px-4 py-3 text-right"
                                        >
                                            <input
                                                v-model.number="
                                                    item.receiveQuantity
                                                "
                                                type="number"
                                                min="0"
                                                :max="
                                                    remaining(item)
                                                "
                                                step="0.001"
                                                :disabled="
                                                    saving ||
                                                    remaining(item) <= 0
                                                "
                                                class="w-28 rounded-lg border border-gray-300 px-3 py-2 text-right text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                                            />

                                            <p
                                                v-if="
                                                    Number(
                                                        item.receiveQuantity
                                                    ) >
                                                    remaining(item)
                                                "
                                                class="mt-1 text-[11px] text-red-500"
                                            >
                                                Melebihi sisa
                                            </p>
                                        </td>
                                    </tr>

                                    <tr
                                        v-if="!form.items.length"
                                    >
                                        <td
                                            colspan="5"
                                            class="px-4 py-8 text-center text-sm text-gray-500"
                                        >
                                            Tidak ada barang yang dapat
                                            diterima.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- NOTES -->
                    <div class="mt-5">
                        <label
                            class="text-sm font-medium text-gray-700"
                        >
                            Catatan Penerimaan
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            :disabled="saving"
                            placeholder="Contoh: Barang diterima lengkap dan kondisi baik."
                            class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                        ></textarea>
                    </div>

                    <!-- INFO -->
                    <div
                        class="mt-5 rounded-xl border border-green-100 bg-green-50 p-4"
                    >
                        <p
                            class="text-sm font-semibold text-green-800"
                        >
                            Dokumen penerimaan akan dibuat sebagai GR.
                        </p>

                        <p
                            class="mt-1 text-xs text-green-700"
                        >
                            Nomor GR dan status penerimaan akan diproses
                            oleh server.
                        </p>
                    </div>
                </div>

                <!-- FOOTER -->
                <div
                    class="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end"
                >
                    <button
                        type="button"
                        @click="close"
                        :disabled="saving"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="receive"
                        :disabled="saving || !canSubmit"
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            v-if="saving"
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
                                class="opacity-30"
                            />

                            <path
                                d="M21 12a9 9 0 0 0-9-9"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                            />
                        </svg>

                        {{
                            saving
                                ? 'Menyimpan...'
                                : 'Simpan Penerimaan'
                        }}
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import {
    computed,
    reactive,
    ref,
    watch,
} from 'vue'

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
    'received',
])

const saving = ref(false)
const errorMessage = ref('')

const form = reactive({
    receiptDate: '',
    notes: '',
    items: [],
})

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const poNumber = computed(() => {
    return (
        props.purchase?.purchaseOrderNumber ||
        props.purchase?.purchase_order?.po_number ||
        props.purchase?.purchaseOrder?.po_number ||
        '-'
    )
})

const purchaseOrder = computed(() => {
    return (
        props.purchase?.purchase_order ||
        props.purchase?.purchaseOrder ||
        props.purchase?.purchaseOrderData ||
        null
    )
})

const purchaseOrderId = computed(() => {
    return (
        purchaseOrder.value?.id ||
        props.purchase?.purchase_order_id ||
        props.purchase?.purchaseOrderId ||
        null
    )
})

const canSubmit = computed(() => {
    if (!purchaseOrderId.value) {
        return false
    }

    if (!form.receiptDate) {
        return false
    }

    return form.items.some(
        (item) =>
            Number(item.receiveQuantity || 0) > 0
    )
})

/*
|--------------------------------------------------------------------------
| Watch Purchase
|--------------------------------------------------------------------------
*/

watch(
    () => [
        props.purchase,
        props.show,
    ],
    ([purchase, show]) => {
        if (!purchase || !show) {
            return
        }

        resetForm(purchase)
    },
    {
        immediate: true,
        deep: false,
    }
)

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

function resetForm(purchase) {
    errorMessage.value = ''

    form.receiptDate =
        new Date().toISOString().slice(0, 10)

    form.warehouseId = null
    form.notes = ''

    const po =
        purchase?.purchase_order ||
        purchase?.purchaseOrder ||
        purchase?.purchaseOrderData ||
        purchase

    const sourceItems =
        po?.items ||
        purchase?.items ||
        []

    form.items = sourceItems
        .map((item) => {
            const quantity = Number(
                item.quantity || 0
            )

            const receivedQuantity = Number(
                item.received_quantity ??
                    item.receivedQuantity ??
                    0
            )

            const remainingQuantity = Math.max(
                0,
                quantity - receivedQuantity
            )

            return {
                purchaseOrderItemId:
                    item.id ||
                    item.purchase_order_item_id ||
                    item.purchaseOrderItemId,

                productId:
                    item.product_id ||
                    item.productId ||
                    item.product?.id ||
                    null,

                productName:
                    item.product?.name ||
                    item.product_name ||
                    item.productName ||
                    '-',

                unitId:
                    item.unit_id ||
                    item.unitId ||
                    item.unit?.id ||
                    null,

                unitName:
                    item.unit?.name ||
                    item.unit_name ||
                    item.unitName ||
                    '-',

                quantity,

                receivedQuantity,

                remainingQuantity,

                receiveQuantity:
                    remainingQuantity > 0
                        ? remainingQuantity
                        : 0,
            }
        })
        .filter(
            (item) =>
                item.purchaseOrderItemId &&
                item.remainingQuantity > 0
        )
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function remaining(item) {
    return Math.max(
        0,
        Number(item.quantity || 0) -
            Number(item.receivedQuantity || 0)
    )
}

function formatQuantity(value) {
    const number = Number(value || 0)

    return number.toLocaleString(
        'id-ID',
        {
            maximumFractionDigits: 3,
        }
    )
}

/*
|--------------------------------------------------------------------------
| Simpan Goods Receipt
|--------------------------------------------------------------------------
|
| Fungsi ini HANYA membuat GR dengan status draft.
|
| Flow:
| PO ordered
|     ↓
| Buat GR
|     ↓
| GR draft
|     ↓
| User klik "Terima Barang"
|     ↓
| Pembelian.vue memanggil endpoint receive()
|
*/
async function receive() {
    if (saving.value) {
        return
    }

    errorMessage.value = ''

    /*
    |--------------------------------------------------------------------------
    | VALIDASI HEADER
    |--------------------------------------------------------------------------
    */

    if (!purchaseOrderId.value) {
        errorMessage.value =
            'Purchase Order tidak ditemukan.'
        return
    }

    if (!form.receiptDate) {
        errorMessage.value =
            'Tanggal penerimaan wajib diisi.'
        return
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDASI ITEM
    |--------------------------------------------------------------------------
    */

    const items = form.items
        .map((item) => ({
            ...item,

            receiveQuantity: Number(
                item.receiveQuantity || 0
            ),
        }))
        .filter(
            (item) =>
                item.receiveQuantity > 0
        )

    if (!items.length) {
        errorMessage.value =
            'Minimal satu barang harus diterima.'
        return
    }

    /*
    |--------------------------------------------------------------------------
    | CEK QTY TIDAK MELEBIHI SISA
    |--------------------------------------------------------------------------
    */

    const invalidItem = items.find(
        (item) =>
            item.receiveQuantity >
            remaining(item)
    )

    if (invalidItem) {
        errorMessage.value =
            `Jumlah diterima untuk ${invalidItem.productName} melebihi sisa barang.`

        return
    }

    /*
    |--------------------------------------------------------------------------
    | CEK ID ITEM PO
    |--------------------------------------------------------------------------
    */

    const invalidId = items.find(
        (item) =>
            !item.purchaseOrderItemId
    )

    if (invalidId) {
        errorMessage.value =
            'Data item Purchase Order tidak valid.'

        return
    }

    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    saving.value = true

    try {
        /*
        |--------------------------------------------------------------------------
        | BUAT GOODS RECEIPT
        |
        | Status awal ditentukan backend:
        | draft
        |--------------------------------------------------------------------------
        */

        const payload = {
            purchase_order_id:
                purchaseOrderId.value,

            supplier_id:
                purchaseOrder.value?.supplier_id ||
                purchaseOrder.value?.supplier?.id ||
                props.purchase?.supplier_id ||
                props.purchase?.supplier?.id,

            receipt_date:
                form.receiptDate,

            notes:
                form.notes || null,

            items: items.map((item) => ({
                purchase_order_item_id:
                    item.purchaseOrderItemId,

                product_id:
                    item.productId,

                quantity:
                    item.receiveQuantity,

                unit_id:
                    item.unitId || null,
            })),
        }

        /*
        |--------------------------------------------------------------------------
        | SUPPLIER WAJIB ADA
        |--------------------------------------------------------------------------
        */

        if (!payload.supplier_id) {
            errorMessage.value =
                'Supplier Purchase Order tidak ditemukan.'

            return
        }

        /*
        |--------------------------------------------------------------------------
        | CREATE GR
        |--------------------------------------------------------------------------
        */

        const response =
            await erpApi.purchases.receipts.create(
                payload
            )

        const goodsReceipt =
            response?.data?.data ||
            response?.data ||
            null

        if (!goodsReceipt?.id) {
            throw new Error(
                'Goods Receipt berhasil dibuat tetapi ID GR tidak ditemukan.'
            )
        }

        /*
        |--------------------------------------------------------------------------
        | SELESAI
        |
        | Jangan panggil:
        |
        | erpApi.purchases.receipts.receive(...)
        |
        | karena GR masih draft.
        |--------------------------------------------------------------------------
        */

        emit('received', goodsReceipt)
    } catch (error) {
        console.error(
            'Gagal menyimpan Goods Receipt:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            error?.message ||
            'Goods Receipt gagal disimpan.'
    } finally {
        saving.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Close
|--------------------------------------------------------------------------
*/

function close() {
    if (saving.value) {
        return
    }

    emit('close')
}
</script>