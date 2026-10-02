<template>
    <Transition name="modal">
        <div
            v-if="show && purchase"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div
                class="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-5 py-4"
                >
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">
                            Approval Pembelian
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ purchase.requestNumber }}
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
                <div
                    class="max-h-[70vh] overflow-y-auto p-5 sm:p-6"
                >
                    <!-- Document Information -->
                    <div class="grid gap-3 sm:grid-cols-3">
                        <div class="rounded-xl bg-gray-50 p-3">
                            <p class="text-[11px] text-gray-500">
                                Nomor PR
                            </p>

                            <p class="mt-1 text-sm font-semibold text-gray-900">
                                {{ purchase.prNumber || '-' }}
                            </p>
                        </div>

                        <div class="rounded-xl bg-blue-50 p-3">
                            <p class="text-[11px] text-blue-600">
                                Nomor REQ
                            </p>

                            <p class="mt-1 text-sm font-semibold text-gray-900">
                                {{ purchase.requestNumber || '-' }}
                            </p>
                        </div>

                        <div class="rounded-xl bg-green-50 p-3">
                            <p class="text-[11px] text-green-600">
                                Jenis Pembelian
                            </p>

                            <p class="mt-1 text-sm font-semibold text-gray-900">
                                {{ purchase.purchaseTypeLabel || '-' }}
                            </p>
                        </div>
                    </div>

                    <!-- Purpose -->
                    <div class="mt-5 rounded-xl bg-blue-50 p-4">
                        <p class="text-xs text-blue-600">
                            Keperluan
                        </p>

                        <p class="mt-1 font-semibold text-gray-900">
                            {{ purchase.purpose }}
                        </p>
                    </div>

                    <!-- Supplier -->
                    <div
                        class="mt-4 rounded-xl border border-gray-200 p-4"
                    >
                        <p class="text-xs text-gray-500">
                            Supplier
                        </p>

                        <p class="mt-1 text-sm font-semibold text-gray-900">
                            {{ purchase.supplierName || 'Belum ditentukan' }}
                        </p>
                    </div>

                    <!-- Items -->
                    <div
                        class="mt-5 overflow-hidden rounded-xl border border-gray-200"
                    >
                        <div
                            class="border-b border-gray-100 px-4 py-3"
                        >
                            <h3 class="text-sm font-bold text-gray-900">
                                Detail Barang
                            </h3>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full min-w-[520px]">
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
                                            Qty
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Harga
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>

                                <tbody
                                    class="divide-y divide-gray-100"
                                >
                                    <tr
                                        v-for="item in purchase.items"
                                        :key="item.productId"
                                    >
                                        <td class="px-4 py-3 text-sm font-medium">
                                            {{ item.productName }}
                                        </td>

                                        <td
                                            class="px-4 py-3 text-right text-sm"
                                        >
                                            {{ item.quantity }}
                                            {{ item.unit }}
                                        </td>

                                        <td
                                            class="px-4 py-3 text-right text-sm"
                                        >
                                            {{ formatCurrency(item.price) }}
                                        </td>

                                        <td
                                            class="px-4 py-3 text-right text-sm font-semibold"
                                        >
                                            {{ formatCurrency(item.subtotal) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Total -->
                    <div class="mt-5 flex justify-end">
                        <div class="text-right">
                            <p class="text-xs text-gray-500">
                                Total Pembelian
                            </p>

                            <p
                                class="text-xl font-bold text-[#003366]"
                            >
                                {{ formatCurrency(purchase.total) }}
                            </p>
                        </div>
                    </div>

                    <!-- Approval Information -->
                    <div
                        class="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4"
                    >
                        <p
                            class="text-sm font-semibold text-orange-800"
                        >
                            Setelah disetujui
                        </p>

                        <p
                            class="mt-1 text-xs leading-5 text-orange-700"
                        >
                            Pembelian akan berubah menjadi status
                            <strong>Dibeli</strong> dan sistem membuat
                            nomor Purchase Order baru.
                        </p>

                        <div
                            class="mt-3 rounded-lg bg-white/70 px-3 py-2"
                        >
                            <p class="text-[11px] text-orange-600">
                                Nomor PO yang akan dibuat
                            </p>

                            <p
                                class="mt-1 text-sm font-bold text-gray-900"
                            >
                                {{ previewPurchaseOrderNumber }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    class="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end"
                >
                    <button
                        type="button"
                        @click="close"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="approve"
                        class="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        ✓ Setujui Pembelian
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    show: Boolean,

    purchase: {
        type: Object,
        default: null,
    },

    /**
     * Semua transaksi pembelian.
     * Digunakan untuk mencari sequence PO berikutnya.
     */
    purchases: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'close',
    'approved',
])

/*
|--------------------------------------------------------------------------
| Preview Nomor PO
|--------------------------------------------------------------------------
*/

const previewPurchaseOrderNumber = computed(() => {
    if (!props.purchase) {
        return '-'
    }

    if (props.purchase.purchaseOrderNumber) {
        return props.purchase.purchaseOrderNumber
    }

    return generatePurchaseOrderNumber(
        props.purchase
    )
})

/*
|--------------------------------------------------------------------------
| Generate Nomor PO
|--------------------------------------------------------------------------
|
| Contoh:
|
| PR-SPR-2026-0001
| REQ-SPR-2026-0001
| PO-SPR-2026-0001
|
| PO mempunyai sequence sendiri.
|--------------------------------------------------------------------------
*/

function generatePurchaseOrderNumber(purchase) {
    const year = new Date().getFullYear()

    const typeCode =
        purchase.typeCode ||
        getTypeCode(purchase.purchaseType)

    const prefix =
        `PO-${typeCode}-${year}`

    const numbers = props.purchases
        .map((item) => {
            const number =
                item.purchaseOrderNumber

            if (!number) {
                return 0
            }

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
| Fallback type code
|--------------------------------------------------------------------------
*/

function getTypeCode(purchaseType) {
    const codes = {
        barang: 'BRG',
        sparepart: 'SPR',
        consumable: 'CON',
        asset: 'AST',
        service: 'JSA',
    }

    return codes[purchaseType] || 'BRG'
}

/*
|--------------------------------------------------------------------------
| Approve
|--------------------------------------------------------------------------
*/

function approve() {
    if (!props.purchase) {
        return
    }

    const purchaseOrderNumber =
        props.purchase.purchaseOrderNumber ||
        generatePurchaseOrderNumber(
            props.purchase
        )

    emit('approved', {
        ...props.purchase,

        status: 'purchased',

        purchaseOrderNumber,

        /*
         * GR belum dibuat.
         * Akan dibuat nanti ketika barang diterima.
         */
        receiptNumber:
            props.purchase.receiptNumber ||
            null,
    })
}

/*
|--------------------------------------------------------------------------
| Close
|--------------------------------------------------------------------------
*/

function close() {
    emit('close')
}

/*
|--------------------------------------------------------------------------
| Currency
|--------------------------------------------------------------------------
*/

function formatCurrency(value) {
    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return '-'
    }

    if (Number(value) === 0) {
        return '-'
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
}
</script>