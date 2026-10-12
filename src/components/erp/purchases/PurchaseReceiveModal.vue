
<template>
    <Transition name="modal">
        <div
            v-if="show && purchase"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div
                class="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- HEADER -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6"
                >
                    <div>
                        <div class="flex items-center gap-2">
                            <div
                                class="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600"
                            >
                                <svg
                                    class="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                >
                                    <path
                                        d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"
                                    />
                                    <path d="m3 7.5 9 4.5 9-4.5M12 12v9M7.5 5.25l9 4.5" />
                                </svg>
                            </div>

                            <div>
                                <h2 class="text-lg font-bold text-gray-900">
                                    Penerimaan Barang
                                </h2>

                                <p class="mt-0.5 text-xs text-gray-500">
                                    {{ poNumber }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="close"
                        :disabled="saving"
                        class="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <!-- CONTENT -->
                <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
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

                    <!-- SUMMARY -->
                    <div class="mb-5 grid gap-3 sm:grid-cols-3">
                        <div class="rounded-xl border border-gray-200 p-4">
                            <p class="text-xs text-gray-500">
                                Nomor Purchase Order
                            </p>
                            <p class="mt-1 font-semibold text-gray-900">
                                {{ poNumber }}
                            </p>
                        </div>

                        <div class="rounded-xl border border-gray-200 p-4">
                            <p class="text-xs text-gray-500">
                                Total item PO
                            </p>
                            <p class="mt-1 text-lg font-bold text-gray-900">
                                {{ form.items.length }} barang
                            </p>
                        </div>

                        <div
                            class="rounded-xl border p-4"
                            :class="
                                hasPriceChanges
                                    ? 'border-amber-200 bg-amber-50'
                                    : 'border-gray-200 bg-white'
                            "
                        >
                            <p class="text-xs text-gray-500">
                                Dampak revisi seluruh PO
                            </p>

                            <p
                                class="mt-1 text-lg font-bold"
                                :class="
                                    hasPriceChanges
                                        ? 'text-amber-700'
                                        : 'text-gray-900'
                                "
                            >
                                {{ formatCurrency(totalPriceDifference) }}
                            </p>

                            <p class="mt-1 text-xs text-gray-500">
                                {{ hasPriceChanges
                                    ? 'Perubahan total nilai item PO'
                                    : 'Tidak ada perubahan harga'
                                }}
                            </p>
                        </div>
                    </div>

                    <!-- DATE -->
                    <div class="mb-6 max-w-sm">
                        <label class="text-sm font-medium text-gray-700">
                            Tanggal Penerimaan
                            <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="form.receiptDate"
                            type="date"
                            :disabled="saving"
                            class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-gray-100"
                        />
                    </div>

                    <!-- PRICE INFO -->
                    <div
                        class="mb-4 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4"
                    >
                        <svg
                            class="mt-0.5 h-5 w-5 shrink-0 text-sky-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 11v5m0-8h.01" />
                        </svg>

                        <div>
                            <p class="text-sm font-semibold text-sky-900">
                                Pemeriksaan harga Purchase Order
                            </p>

                            <p class="mt-1 text-xs leading-5 text-sky-800">
                                Harga baru akan dibandingkan dengan harga PO
                                saat ini. Dampak dihitung berdasarkan seluruh
                                kuantitas pesanan, termasuk yang sudah diterima.
                                Pada tahap ini, harga belum disimpan ke PO.
                            </p>
                        </div>
                    </div>

                    <!-- ITEMS -->
                    <div class="mt-6">
                        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h3 class="text-base font-bold tracking-tight text-gray-900">
                                    Detail Barang dan Harga
                                </h3>
                                <p class="mt-1 text-sm text-gray-500">
                                    Periksa kuantitas penerimaan dan sesuaikan harga jika diperlukan.
                                </p>
                            </div>

                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                <span class="h-2 w-2 rounded-full bg-sky-500"></span>
                                {{ form.items.length }} item PO
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div
                                v-for="(item, index) in form.items"
                                :key="item.purchaseOrderItemId"
                                class="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-gray-300"
                            >
                                <!-- ITEM HEADER -->
                                <div class="flex items-start gap-3 border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-5">
                                    <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-500">
                                        {{ String(index + 1).padStart(2, '0') }}
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <h4 class="text-sm font-bold text-gray-900">
                                                {{ item.productName }}
                                            </h4>

                                            <span
                                                v-if="priceChanged(item)"
                                                class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800"
                                            >
                                                Harga berubah
                                            </span>
                                        </div>

                                        <p class="mt-1 text-xs text-gray-500">
                                            Satuan: {{ item.unitName || '-' }}
                                        </p>
                                    </div>

                                    <div class="hidden text-right sm:block">
                                        <p class="text-[11px] text-gray-400">
                                            Nilai PO awal
                                        </p>
                                        <p class="mt-1 text-sm font-semibold text-gray-700">
                                            {{ formatCurrency(item.quantity * item.originalUnitPrice) }}
                                        </p>
                                    </div>
                                </div>

                                <div class="p-4 sm:p-5">
                                    <!-- QUANTITY SUMMARY -->
                                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                            <p class="text-[11px] font-medium text-gray-500">
                                                Dipesan
                                            </p>
                                            <p class="mt-1 text-sm font-bold text-gray-900">
                                                {{ formatQuantity(item.quantity) }}
                                            </p>
                                        </div>

                                        <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                            <p class="text-[11px] font-medium text-gray-500">
                                                Sudah diterima
                                            </p>
                                            <p class="mt-1 text-sm font-bold text-gray-700">
                                                {{ formatQuantity(item.receivedQuantity) }}
                                            </p>
                                        </div>

                                        <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                            <p class="text-[11px] font-medium text-gray-500">
                                                Sisa pesanan
                                            </p>
                                            <p
                                                class="mt-1 text-sm font-bold"
                                                :class="remaining(item) > 0 ? 'text-orange-600' : 'text-green-600'"
                                            >
                                                {{ formatQuantity(remaining(item)) }}
                                            </p>
                                        </div>

                                        <div class="rounded-xl border border-sky-100 bg-sky-50/70 p-3">
                                            <label
                                                :for="`receive-qty-${item.purchaseOrderItemId}`"
                                                class="block text-[11px] font-medium text-sky-800"
                                            >
                                                Terima sekarang
                                            </label>

                                            <input
                                                :id="`receive-qty-${item.purchaseOrderItemId}`"
                                                v-model.number="item.receiveQuantity"
                                                type="number"
                                                min="0"
                                                :max="remaining(item)"
                                                step="0.001"
                                                :disabled="saving || remaining(item) <= 0"
                                                class="mt-1 w-full border-0 bg-transparent p-0 text-sm font-bold text-sky-900 outline-none focus:ring-0 disabled:opacity-50"
                                            />

                                            <p
                                                v-if="Number(item.receiveQuantity) > remaining(item)"
                                                class="mt-1 text-[10px] font-medium text-red-600"
                                            >
                                                Melebihi sisa
                                            </p>
                                        </div>
                                    </div>

                                    <!-- PRICE SECTION -->
                                    <div class="mt-5 rounded-xl border border-gray-200 p-4">
                                        <div class="mb-3 flex items-center justify-between gap-2">
                                            <div>
                                                <h5 class="text-xs font-bold uppercase tracking-wider text-gray-700">
                                                    Harga satuan
                                                </h5>
                                                <p class="mt-1 text-[11px] text-gray-500">
                                                    Perbandingan harga lama dan harga baru
                                                </p>
                                            </div>

                                            <div class="flex h-5 w-5 shrink-0 items-center justify-center text-sm font-semibold text-gray-400">
                                                Rp
                                            </div>
                                        </div>

                                        <div class="grid gap-3 sm:grid-cols-2">
                                            <!-- OLD PRICE -->
                                            <div class="rounded-xl bg-gray-50 p-3">
                                                <p class="text-xs font-medium text-gray-500">
                                                    Harga PO saat ini
                                                </p>
                                                <p class="mt-2 text-base font-semibold text-gray-700">
                                                    {{ formatCurrency(item.originalUnitPrice) }}
                                                </p>
                                                <p class="mt-1 text-[11px] text-gray-400">
                                                    Harga sebelum revisi
                                                </p>
                                            </div>

                                            <!-- NEW PRICE -->
                                            <div
                                                class="rounded-xl border p-3"
                                                :class="priceChanged(item)
                                                    ? 'border-amber-200 bg-amber-50/60'
                                                    : 'border-sky-100 bg-sky-50/50'"
                                            >
                                                <label
                                                    :for="`new-price-${item.purchaseOrderItemId}`"
                                                    class="block text-xs font-semibold"
                                                    :class="priceChanged(item) ? 'text-amber-800' : 'text-sky-800'"
                                                >
                                                    Harga baru per satuan
                                                </label>

                                                <div class="mt-2 flex items-center gap-2">
                                                    <span class="text-xs font-semibold text-gray-500">
                                                        Rp
                                                    </span>

                                                    <input
                                                        :id="`new-price-${item.purchaseOrderItemId}`"
                                                        v-model.number="item.newUnitPrice"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        :disabled="saving"
                                                        class="min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-right text-sm font-bold outline-none transition focus:ring-2 disabled:bg-gray-100"
                                                        :class="priceChanged(item)
                                                            ? 'border-amber-300 text-amber-900 focus:border-amber-500 focus:ring-amber-100'
                                                            : 'border-sky-200 text-gray-900 focus:border-sky-500 focus:ring-sky-100'"
                                                    />
                                                </div>

                                                <div class="mt-2 flex items-center justify-between gap-2">
                                                    <span class="text-[11px] text-gray-500">
                                                        {{ priceChanged(item) ? 'Selisih per satuan' : 'Tidak ada perubahan' }}
                                                    </span>

                                                    <span
                                                        v-if="priceChanged(item)"
                                                        class="text-xs font-bold"
                                                        :class="priceDifference(item) > 0 ? 'text-red-600' : 'text-green-600'"
                                                    >
                                                        {{ priceDifference(item) > 0 ? '+' : '' }}{{ formatCurrency(priceDifference(item)) }}
                                                    </span>

                                                    <span
                                                        v-else
                                                        class="text-xs font-semibold text-sky-700"
                                                    >
                                                        Tetap
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- ITEM IMPACT -->
                                        <div
                                            v-if="priceChanged(item)"
                                            class="mt-3 flex flex-col gap-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <p class="text-xs font-medium text-gray-600">
                                                    Dampak pada total kuantitas item
                                                </p>
                                                <p class="mt-0.5 text-[11px] text-gray-500">
                                                    {{ formatQuantity(item.quantity) }} × selisih harga
                                                </p>
                                            </div>

                                            <p
                                                class="text-sm font-bold"
                                                :class="priceDifference(item) > 0 ? 'text-red-700' : 'text-green-700'"
                                            >
                                                {{ priceDifference(item) > 0 ? '+' : '' }}
                                                {{ formatCurrency(item.quantity * priceDifference(item)) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- EMPTY STATE -->
                            <div
                                v-if="!form.items.length"
                                class="rounded-2xl border border-dashed border-gray-300 px-5 py-12 text-center"
                            >
                                <div class="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gray-100 text-gray-400">
                                    <svg
                                        class="h-6 w-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.7"
                                    >
                                        <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
                                        <path d="m3 7.5 9 4.5 9-4.5M12 12v9" />
                                    </svg>
                                </div>

                                <p class="mt-3 text-sm font-semibold text-gray-800">
                                    Tidak ada barang yang dapat diterima
                                </p>
                                <p class="mt-1 text-xs text-gray-500">
                                    Semua kuantitas PO mungkin sudah diterima.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- PRICE REVISION SUMMARY -->
                    <div
                        v-if="hasPriceChanges"
                        class="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"
                    >
                        <div class="flex items-start gap-3">
                            <div class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
                                <svg
                                    class="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                >
                                    <path d="M12 3 22 20H2L12 3Z" />
                                    <path d="M12 9v5m0 3h.01" />
                                </svg>
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-bold text-amber-900">
                                    Ada perubahan harga PO
                                </p>

                                <p class="mt-1 text-xs leading-5 text-amber-800">
                                    Perubahan ini berdampak pada keseluruhan
                                    kuantitas pesanan, bukan hanya barang yang
                                    diterima sekarang.
                                </p>

                                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                                    <div class="rounded-lg border border-amber-200 bg-white p-3">
                                        <p class="text-xs text-gray-500">
                                            Total PO sebelum revisi
                                        </p>

                                        <p class="mt-1 font-semibold text-gray-800">
                                            {{ formatCurrency(originalItemsTotal) }}
                                        </p>
                                    </div>

                                    <div class="rounded-lg border border-amber-200 bg-white p-3">
                                        <p class="text-xs text-gray-500">
                                            Total item PO setelah revisi
                                        </p>

                                        <p class="mt-1 font-semibold text-gray-900">
                                            {{ formatCurrency(revisedItemsTotal) }}
                                        </p>
                                    </div>
                                </div>

                                <div class="mt-3">
                                    <label class="text-sm font-semibold text-amber-900">
                                        Alasan revisi harga
                                        <span class="text-red-600">*</span>
                                    </label>

                                    <textarea
                                        v-model="form.priceRevisionReason"
                                        rows="2"
                                        :disabled="saving"
                                        placeholder="Contoh: Perubahan harga berdasarkan konfirmasi terbaru dari supplier."
                                        class="mt-1.5 w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-gray-100"
                                    ></textarea>

                                    <p class="mt-1 text-xs text-amber-800">
                                        Alasan ini nantinya perlu dicatat sebagai
                                        riwayat revisi harga di backend.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- NOTES -->
                    <div class="mt-6">
                        <label class="text-sm font-medium text-gray-700">
                            Catatan Penerimaan
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            :disabled="saving"
                            placeholder="Contoh: Barang diterima lengkap dan kondisi baik."
                            class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-gray-100"
                        ></textarea>
                    </div>

                    <!-- DRAFT INFO -->
                    <div class="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div class="flex items-start gap-3">
                            <svg
                                class="mt-0.5 h-5 w-5 shrink-0 text-gray-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 11v5m0-8h.01" />
                            </svg>

                            <div>
                                <p class="text-sm font-semibold text-gray-800">
                                    Penerimaan disimpan sebagai draft GR
                                </p>

                                <p class="mt-1 text-xs leading-5 text-gray-600">
                                    Penyimpanan modal ini belum menerapkan
                                    perubahan harga ke PO. Harga revisi baru
                                    bisa diproses setelah integrasi backend
                                    selesai.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FOOTER -->
                <div
                    class="flex flex-col-reverse gap-2 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                    <p class="text-xs text-gray-500">
                        {{ form.items.filter(item => Number(item.receiveQuantity) > 0).length }}
                        barang akan diterima
                    </p>

                    <div class="flex flex-col-reverse gap-2 sm:flex-row">
                        <button
                            type="button"
                            @click="close"
                            :disabled="saving"
                            class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            @click="receive"
                            :disabled="saving || !canSubmit"
                            class="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
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

                            {{ saving ? 'Menyimpan...' : 'Simpan Penerimaan' }}
                        </button>
                    </div>
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
    priceRevisionReason: '',
    items: [],
})

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

const hasPriceChanges = computed(() => {
    return form.items.some(priceChanged)
})

const originalItemsTotal = computed(() => {
    return form.items.reduce((total, item) => {
        return total +
            Number(item.quantity || 0) *
            Number(item.originalUnitPrice || 0)
    }, 0)
})

const revisedItemsTotal = computed(() => {
    return form.items.reduce((total, item) => {
        return total +
            Number(item.quantity || 0) *
            Number(item.newUnitPrice || 0)
    }, 0)
})

const totalPriceDifference = computed(() => {
    return revisedItemsTotal.value - originalItemsTotal.value
})

const canSubmit = computed(() => {
    if (!purchaseOrderId.value || !form.receiptDate) {
        return false
    }

    const hasReceivedQuantity = form.items.some(
        item => Number(item.receiveQuantity || 0) > 0
    )

    if (!hasReceivedQuantity) {
        return false
    }

    if (
        hasPriceChanges.value &&
        !form.priceRevisionReason.trim()
    ) {
        return false
    }

    return true
})

watch(
    () => [props.purchase, props.show],
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

function resetForm(purchase) {
    errorMessage.value = ''

    form.receiptDate = new Date()
        .toLocaleDateString('en-CA', {
            timeZone: 'Asia/Jakarta',
        })

    form.notes = ''
    form.priceRevisionReason = ''

    const po =
        purchase?.purchase_order ||
        purchase?.purchaseOrder ||
        purchase?.purchaseOrderData ||
        purchase

    const sourceItems = po?.items || purchase?.items || []

    form.items = sourceItems
        .map(item => {
            const quantity = Number(item.quantity || 0)

            const receivedQuantity = Number(
                item.received_quantity ??
                item.receivedQuantity ??
                0
            )

            const remainingQuantity = Math.max(
                0,
                quantity - receivedQuantity
            )

            const originalUnitPrice = Number(
                item.unit_price ??
                item.unitPrice ??
                0
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

                originalUnitPrice,
                newUnitPrice: originalUnitPrice,
            }
        })
        .filter(item =>
            item.purchaseOrderItemId &&
            item.remainingQuantity > 0
        )
}

function remaining(item) {
    return Math.max(
        0,
        Number(item.quantity || 0) -
        Number(item.receivedQuantity || 0)
    )
}

function priceChanged(item) {
    return Math.abs(
        Number(item.newUnitPrice || 0) -
        Number(item.originalUnitPrice || 0)
    ) > 0.000001
}

function priceDifference(item) {
    return Number(item.newUnitPrice || 0) -
        Number(item.originalUnitPrice || 0)
}

function formatQuantity(value) {
    return Number(value || 0).toLocaleString('id-ID', {
        maximumFractionDigits: 3,
    })
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 2,
    }).format(Number(value || 0))
}

async function receive() {
    if (saving.value) {
        return
    }

    errorMessage.value = ''

    if (!purchaseOrderId.value) {
        errorMessage.value = 'Purchase Order tidak ditemukan.'
        return
    }

    if (!form.receiptDate) {
        errorMessage.value = 'Tanggal penerimaan wajib diisi.'
        return
    }

    if (
        hasPriceChanges.value &&
        !form.priceRevisionReason.trim()
    ) {
        errorMessage.value =
            'Alasan revisi harga wajib diisi.'
        return
    }

    const items = form.items
        .map(item => ({
            ...item,
            receiveQuantity: Number(item.receiveQuantity || 0),
            newUnitPrice: Number(item.newUnitPrice),
        }))
        .filter(item => item.receiveQuantity > 0)

    if (!items.length) {
        errorMessage.value =
            'Minimal satu barang harus diterima.'
        return
    }

    const invalidItem = items.find(item =>
        item.receiveQuantity > remaining(item)
    )

    if (invalidItem) {
        errorMessage.value =
            `Jumlah diterima untuk ${invalidItem.productName} melebihi sisa barang.`
        return
    }

    const invalidPrice = form.items.find(item =>
        !Number.isFinite(Number(item.newUnitPrice)) ||
        Number(item.newUnitPrice) < 0
    )

    if (invalidPrice) {
        errorMessage.value =
            `Harga baru untuk ${invalidPrice.productName} tidak valid.`
        return
    }

    const invalidId = items.find(
        item => !item.purchaseOrderItemId
    )

    if (invalidId) {
        errorMessage.value =
            'Data item Purchase Order tidak valid.'
        return
    }

    saving.value = true

    try {
        const payload = {
            purchase_order_id: purchaseOrderId.value,

            supplier_id:
                purchaseOrder.value?.supplier_id ||
                purchaseOrder.value?.supplier?.id ||
                props.purchase?.supplier_id ||
                props.purchase?.supplier?.id,

            receipt_date: form.receiptDate,
            notes: form.notes || null,

            items: items.map(item => ({
                purchase_order_item_id:
                    item.purchaseOrderItemId,
                product_id: item.productId,
                quantity: item.receiveQuantity,
                unit_id: item.unitId || null,
            })),
        }

        if (!payload.supplier_id) {
            errorMessage.value =
                'Supplier Purchase Order tidak ditemukan.'
            return
        }

        /*
         * Catatan:
         * Harga revisi dan alasan belum dikirim ke backend.
         * Endpoint revisi harga harus dibuat terpisah/diintegrasikan
         * sebelum perubahan harga dapat disimpan secara permanen.
         */
        const response =
            await erpApi.purchases.receipts.create(payload)

        const goodsReceipt =
            response?.data?.data ||
            response?.data ||
            null

        if (!goodsReceipt?.id) {
            throw new Error(
                'Goods Receipt berhasil dibuat tetapi ID GR tidak ditemukan.'
            )
        }

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

function close() {
    if (saving.value) {
        return
    }

    emit('close')
}
</script>
