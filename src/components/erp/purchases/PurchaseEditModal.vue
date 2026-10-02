<template>
    <Transition name="modal">
        <div
            v-if="show && purchase"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div
                class="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <div class="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">
                            Edit Pembelian
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ purchase.prNumber }}
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

                <div class="flex-1 overflow-y-auto p-5 sm:p-6">
                    <div class="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Nomor Dokumen
                            </label>

                            <input
                                v-model="form.prNumber"
                                readonly
                                class="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
                            />
                        </div>

                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Jenis Pembelian
                            </label>

                            <select
                                v-model="form.purchaseType"
                                disabled
                                class="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
                            >
                                <option
                                    v-for="type in purchaseTypes"
                                    :key="type.value"
                                    :value="type.value"
                                >
                                    {{ type.label }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Tanggal
                            </label>

                            <input
                                v-model="form.date"
                                type="date"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Supplier
                            </label>

                            <select
                                v-model="form.supplierId"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
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
                        </div>

                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Keperluan
                            </label>

                            <input
                                v-model="form.purpose"
                                type="text"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                            />
                        </div>

                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium text-gray-700">
                                Catatan
                            </label>

                            <textarea
                                v-model="form.notes"
                                rows="2"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                            ></textarea>
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="mb-3 flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900">
                                    Barang
                                </h3>

                                <p class="mt-1 text-xs text-gray-500">
                                    Harga masih boleh kosong.
                                </p>
                            </div>

                            <button
                                type="button"
                                @click="addItem"
                                class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600"
                            >
                                + Tambah Barang
                            </button>
                        </div>

                        <div class="overflow-x-auto rounded-xl border border-gray-200">
                            <table class="w-full min-w-[720px]">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-3 py-3 text-left text-xs font-semibold text-gray-500">
                                            Produk
                                        </th>
                                        <th class="px-3 py-3 text-right text-xs font-semibold text-gray-500">
                                            Qty
                                        </th>
                                        <th class="px-3 py-3 text-right text-xs font-semibold text-gray-500">
                                            Harga
                                        </th>
                                        <th class="px-3 py-3 text-right text-xs font-semibold text-gray-500">
                                            Subtotal
                                        </th>
                                        <th></th>
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
                                                class="w-24 rounded-lg border border-gray-300 px-3 py-2 text-right text-sm"
                                            />
                                        </td>

                                        <td class="px-3 py-3">
                                            <input
                                                v-model.number="item.price"
                                                type="number"
                                                min="0"
                                                placeholder="Opsional"
                                                class="w-36 rounded-lg border border-gray-300 px-3 py-2 text-right text-sm"
                                            />
                                        </td>

                                        <td class="px-3 py-3 text-right text-sm font-semibold">
                                            {{ formatCurrency(subtotal(item)) }}
                                        </td>

                                        <td class="px-3 py-3 text-center">
                                            <button
                                                type="button"
                                                @click="removeItem(index)"
                                                class="text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-4 flex justify-end">
                            <div class="rounded-xl bg-gray-50 px-5 py-4">
                                <span class="text-xs text-gray-500">
                                    Total
                                </span>

                                <p class="text-lg font-bold text-gray-900">
                                    {{ formatCurrency(total) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        @click="close"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="save(false)"
                        class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700"
                    >
                        Simpan Perubahan
                    </button>

                    <button
                        type="button"
                        @click="save(true)"
                        class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                        Ajukan Pembelian
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
    purchase: {
        type: Object,
        default: null,
    },
    products: {
        type: Array,
        default: () => [],
    },
    suppliers: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['close', 'saved'])

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

const form = reactive({
    prNumber: '',
    purchaseType: 'barang',
    date: '',
    supplierId: null,
    purpose: '',
    notes: '',
    items: [],
})

watch(
    () => props.purchase,
    (purchase) => {
        if (!purchase) return

        form.documentNumber = purchase.documentNumber
        form.prNumber = purchase.prNumber || purchase.documentNumber || ''
        form.purchaseType = purchase.purchaseType || 'barang'
        form.date = purchase.date
        form.supplierId = purchase.supplierId
        form.purpose = purchase.purpose
        form.notes = purchase.notes || ''

        form.items = JSON.parse(
            JSON.stringify(purchase.items)
        )
    },
    {
        immediate: true,
    }
)

const total = computed(() => {
    return form.items.reduce(
        (sum, item) => sum + subtotal(item),
        0
    )
})

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
    if (form.items.length === 1) return

    form.items.splice(index, 1)
}

function syncProduct(item) {
    const product = props.products.find(
        (itemProduct) => itemProduct.id === item.productId
    )

    if (!product) return

    item.productName = product.name
    item.unit = product.unit
}

function subtotal(item) {
    if (
        item.price === null ||
        item.price === '' ||
        !item.quantity
    ) {
        return 0
    }

    return Number(item.price) * Number(item.quantity)
}

function save(submit = false) {
    if (!form.purpose.trim()) {
        alert('Keperluan pembelian wajib diisi.')
        return
    }

    const validItems = form.items.filter(
        (item) => item.productId && Number(item.quantity) > 0
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

    const updated = {
        ...props.purchase,

        prNumber: form.prNumber,

        purchaseType: form.purchaseType,
        purchaseTypeLabel: purchaseType?.label || '',
        typeCode: purchaseType?.code || 'BRG',

        date: form.date,

        supplierId: form.supplierId,
        supplierName: supplier?.name || null,

        purpose: form.purpose.trim(),
        notes: form.notes.trim(),

        status: submit
            ? 'submitted'
            : 'draft',

        requestNumber: submit
            ? props.purchase.requestNumber ||
            generateRequestNumber()
            : props.purchase.requestNumber,

        purchaseOrderNumber:
            props.purchase.purchaseOrderNumber || null,

        receiptNumber:
            props.purchase.receiptNumber || null,

        items: validItems.map((item) => ({
            ...item,
            subtotal:
                item.price !== null &&
                item.price !== ''
                    ? Number(item.price) * Number(item.quantity)
                    : null,
        })),

        total: total.value,
    }

    emit('saved', updated)
}

function generateRequestNumber() {
    const year = new Date().getFullYear()

    const purchaseType = purchaseTypes.find(
        (type) => type.value === form.purchaseType
    )

    const typeCode = purchaseType?.code || 'BRG'

    return `REQ-${typeCode}-${year}-${String(Date.now()).slice(-4)}`
}

function close() {
    emit('close')
}

function formatCurrency(value) {
    if (!value) return '-'

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
}
</script>