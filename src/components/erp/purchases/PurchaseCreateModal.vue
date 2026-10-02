<template>
    <Transition name="modal">
        <div
            v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div
                class="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div
                    class="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6"
                >
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">
                            Buat Pembelian
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Buat draft kebutuhan pembelian baru.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="close"
                        class="grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                <!-- Body -->
                <div class="flex-1 overflow-y-auto p-5 sm:p-6">
                    <div class="grid gap-5 sm:grid-cols-2">
                        <!-- Nomor PR -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Nomor PR
                            </label>

                            <input
                                v-model="form.prNumber"
                                readonly
                                class="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-600"
                            />

                            <p class="mt-1 text-xs text-gray-400">
                                Nomor dibuat otomatis berdasarkan jenis
                                pembelian.
                            </p>
                        </div>

                        <!-- Jenis Pembelian -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Jenis Pembelian
                            </label>

                            <select
                                v-model="form.purchaseType"
                                @change="syncDocumentNumber"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            >
                                <option
                                    v-for="type in purchaseTypes"
                                    :key="type.value"
                                    :value="type.value"
                                >
                                    {{ type.label }}
                                </option>
                            </select>

                            <p class="mt-1 text-xs text-gray-400">
                                Jenis menentukan kode pada nomor dokumen.
                            </p>
                        </div>

                        <!-- Tanggal -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Tanggal
                            </label>

                            <input
                                v-model="form.date"
                                type="date"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>

                        <!-- Supplier -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Supplier
                            </label>

                            <select
                                v-model="form.supplierId"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            >
                                <option :value="null">
                                    Belum ditentukan
                                </option>

                                <option
                                    v-for="supplier in suppliers"
                                    :key="supplier.id"
                                    :value="supplier.id"
                                >
                                    {{ supplier.name }}
                                </option>
                            </select>

                            <p class="mt-1 text-xs text-gray-400">
                                Supplier boleh dikosongkan pada tahap awal.
                            </p>
                        </div>

                        <!-- Keperluan -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Keperluan
                            </label>

                            <input
                                v-model="form.purpose"
                                type="text"
                                placeholder="Contoh: Kebutuhan sparepart kendaraan"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>

                        <!-- Catatan -->
                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium text-gray-700">
                                Catatan
                            </label>

                            <textarea
                                v-model="form.notes"
                                rows="2"
                                placeholder="Catatan tambahan..."
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Items -->
                    <div class="mt-6">
                        <div class="mb-3 flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900">
                                    Barang yang Dibutuhkan
                                </h3>

                                <p class="mt-1 text-xs text-gray-500">
                                    Harga boleh dikosongkan.
                                </p>
                            </div>

                            <button
                                type="button"
                                @click="addItem"
                                class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                            >
                                + Tambah Barang
                            </button>
                        </div>

                        <div
                            class="overflow-x-auto rounded-xl border border-gray-200"
                        >
                            <table class="w-full min-w-[720px]">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-3 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Produk
                                        </th>

                                        <th
                                            class="w-28 px-3 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Qty
                                        </th>

                                        <th
                                            class="w-40 px-3 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Harga
                                        </th>

                                        <th
                                            class="w-40 px-3 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Subtotal
                                        </th>

                                        <th
                                            class="w-12 px-3 py-3"
                                        ></th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-100">
                                    <tr
                                        v-for="(item, index) in form.items"
                                        :key="index"
                                    >
                                        <td class="px-3 py-3">
                                            <select
                                                v-model="item.productId"
                                                @change="syncProduct(item)"
                                                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                            >
                                                <option :value="null">
                                                    Pilih barang
                                                </option>

                                                <option
                                                    v-for="product in products"
                                                    :key="product.id"
                                                    :value="product.id"
                                                >
                                                    {{ product.name }}
                                                </option>
                                            </select>
                                        </td>

                                        <td class="px-3 py-3">
                                            <input
                                                v-model.number="item.quantity"
                                                type="number"
                                                min="1"
                                                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm"
                                            />
                                        </td>

                                        <td class="px-3 py-3">
                                            <input
                                                v-model.number="item.price"
                                                type="number"
                                                min="0"
                                                placeholder="Opsional"
                                                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm"
                                            />
                                        </td>

                                        <td
                                            class="px-3 py-3 text-right text-sm font-semibold"
                                        >
                                            {{ formatCurrency(subtotal(item)) }}
                                        </td>

                                        <td class="px-3 py-3 text-center">
                                            <button
                                                type="button"
                                                @click="removeItem(index)"
                                                class="text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Total -->
                        <div class="mt-4 flex justify-end">
                            <div
                                class="w-full max-w-sm rounded-xl bg-gray-50 p-4"
                            >
                                <div
                                    class="flex items-center justify-between"
                                >
                                    <span class="text-sm text-gray-500">
                                        Total
                                    </span>

                                    <span
                                        class="text-lg font-bold text-gray-900"
                                    >
                                        {{ formatCurrency(total) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    class="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6"
                >
                    <button
                        type="button"
                        @click="close"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="save"
                        class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
                    >
                        Simpan Draft
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
    show: Boolean,

    products: {
        type: Array,
        default: () => [],
    },

    suppliers: {
        type: Array,
        default: () => [],
    },

    /**
     * Dipakai untuk menentukan sequence nomor PR.
     * Parent cukup mengirimkan data purchases yang sudah ada.
     */
    purchases: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['close', 'saved'])

/*
|--------------------------------------------------------------------------
| Jenis Pembelian
|--------------------------------------------------------------------------
*/

const purchaseTypes = [
    {
        value: 'barang',
        label: 'Barang Dagangan',
        code: 'BRG',
    },
    {
        value: 'sparepart',
        label: 'Sparepart',
        code: 'SPR',
    },
    {
        value: 'consumable',
        label: 'Consumable',
        code: 'CON',
    },
    {
        value: 'asset',
        label: 'Asset',
        code: 'AST',
    },
    {
        value: 'service',
        label: 'Jasa',
        code: 'JSA',
    },
]

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = reactive({
    prNumber: '',
    purchaseType: 'barang',
    date: '',
    supplierId: null,
    purpose: '',
    notes: '',
    items: [],
})

/*
|--------------------------------------------------------------------------
| Reset ketika modal dibuka
|--------------------------------------------------------------------------
*/

watch(
    () => props.show,
    (value) => {
        if (value) {
            reset()
        }
    }
)

/*
|--------------------------------------------------------------------------
| Total
|--------------------------------------------------------------------------
*/

const total = computed(() => {
    return form.items.reduce(
        (sum, item) => sum + subtotal(item),
        0
    )
})

/*
|--------------------------------------------------------------------------
| Reset Form
|--------------------------------------------------------------------------
*/

function reset() {
    form.purchaseType = 'barang'

    form.prNumber = generateDocumentNumber(
        'PR',
        form.purchaseType
    )

    form.date = new Date().toISOString().slice(0, 10)

    form.supplierId = null
    form.purpose = ''
    form.notes = ''

    form.items = [
        {
            productId: null,
            productName: '',
            quantity: 1,
            unit: '',
            price: null,
            subtotal: null,
            receivedQuantity: 0,
        },
    ]
}

/*
|--------------------------------------------------------------------------
| Generate Nomor PR
|--------------------------------------------------------------------------
|
| Contoh:
|
| PR-BRG-2026-0001
| PR-SPR-2026-0001
| PR-CON-2026-0001
| PR-AST-2026-0001
| PR-JSA-2026-0001
|
*/

function generateDocumentNumber(documentType, purchaseType) {
    const year = new Date().getFullYear()

    const type = purchaseTypes.find(
        (item) => item.value === purchaseType
    )

    const typeCode = type?.code || 'BRG'

    const prefix = `${documentType}-${typeCode}-${year}`

    const numbers = props.purchases
        .map((purchase) => {
            const number = getDocumentNumber(
                purchase,
                documentType
            )

            if (!number) return 0

            if (!number.startsWith(`${prefix}-`)) {
                return 0
            }

            const sequence = Number(
                number.split('-').pop()
            )

            return Number.isFinite(sequence)
                ? sequence
                : 0
        })
        .filter(Boolean)

    const nextNumber =
        numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1

    return `${prefix}-${String(nextNumber).padStart(4, '0')}`
}

/*
|--------------------------------------------------------------------------
| Ambil nomor berdasarkan jenis dokumen
|--------------------------------------------------------------------------
*/

function getDocumentNumber(purchase, documentType) {
    switch (documentType) {
        case 'PR':
            return (
                purchase.prNumber ||
                purchase.documentNumber ||
                null
            )

        case 'REQ':
            return purchase.requestNumber || null

        case 'PO':
            return purchase.purchaseOrderNumber || null

        case 'GR':
            return purchase.receiptNumber || null

        default:
            return null
    }
}

/*
|--------------------------------------------------------------------------
| Ketika jenis pembelian berubah
|--------------------------------------------------------------------------
*/

function syncDocumentNumber() {
    form.prNumber = generateDocumentNumber(
        'PR',
        form.purchaseType
    )
}

/*
|--------------------------------------------------------------------------
| Item
|--------------------------------------------------------------------------
*/

function addItem() {
    form.items.push({
        productId: null,
        productName: '',
        quantity: 1,
        unit: '',
        price: null,
        subtotal: null,
        receivedQuantity: 0,
    })
}

function removeItem(index) {
    if (form.items.length === 1) {
        return
    }

    form.items.splice(index, 1)
}

function syncProduct(item) {
    const product = props.products.find(
        (itemProduct) => itemProduct.id === item.productId
    )

    if (!product) {
        return
    }

    item.productName = product.name
    item.unit = product.unit
}

/*
|--------------------------------------------------------------------------
| Subtotal
|--------------------------------------------------------------------------
*/

function subtotal(item) {
    if (
        item.price === null ||
        item.price === '' ||
        !item.quantity
    ) {
        return 0
    }

    return (
        Number(item.price) *
        Number(item.quantity)
    )
}

/*
|--------------------------------------------------------------------------
| Save
|--------------------------------------------------------------------------
*/

function save() {
    if (!form.purpose.trim()) {
        alert('Keperluan pembelian wajib diisi.')
        return
    }

    const validItems = form.items.filter(
        (item) =>
            item.productId &&
            Number(item.quantity) > 0
    )

    if (!validItems.length) {
        alert('Minimal tambahkan satu barang.')
        return
    }

    const supplier = props.suppliers.find(
        (item) => item.id === form.supplierId
    )

    const purchaseType = purchaseTypes.find(
        (type) => type.value === form.purchaseType
    )

    const purchase = {
        id: Date.now(),

        /*
        |--------------------------------------------------------------------------
        | Identitas Jenis Pembelian
        |--------------------------------------------------------------------------
        */

        purchaseType: form.purchaseType,

        purchaseTypeLabel:
            purchaseType?.label || '',

        typeCode:
            purchaseType?.code || 'BRG',

        /*
        |--------------------------------------------------------------------------
        | Nomor Dokumen
        |--------------------------------------------------------------------------
        */

        prNumber: form.prNumber,

        requestNumber: null,

        purchaseOrderNumber: null,

        receiptNumber: null,

        /*
        |--------------------------------------------------------------------------
        | Informasi Pembelian
        |--------------------------------------------------------------------------
        */

        date: form.date,

        supplierId: form.supplierId,

        supplierName:
            supplier?.name || null,

        purpose:
            form.purpose.trim(),

        notes:
            form.notes.trim(),

        status: 'draft',

        /*
        |--------------------------------------------------------------------------
        | Items
        |--------------------------------------------------------------------------
        */

        items: validItems.map((item) => ({
            ...item,

            subtotal:
                item.price !== null &&
                item.price !== ''
                    ? Number(item.price) *
                      Number(item.quantity)
                    : null,

            receivedQuantity: 0,
        })),

        total: total.value,
    }

    emit('saved', purchase)
}

function close() {
    emit('close')
}

function formatCurrency(value) {
    if (!value) {
        return '-'
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>