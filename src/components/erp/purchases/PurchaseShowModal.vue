<template>
    <Transition name="modal">
        <div
            v-if="show && purchase"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div
                class="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div class="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h2 class="text-lg font-bold text-gray-900">
                                {{ purchase.documentNumber }}
                            </h2>

                            <span
                                class="rounded-full px-3 py-1 text-xs font-medium"
                                :class="statusClass(purchase.status)"
                            >
                                {{ statusLabel(purchase.status) }}
                            </span>
                        </div>

                        <p class="mt-1 text-sm text-gray-500">
                            {{ purchase.purpose }}
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

                <div class="max-h-[75vh] overflow-y-auto p-5 sm:p-6">
                    <!-- Document numbers -->
                    <div class="grid gap-3 sm:grid-cols-4">
                        <DocumentCard
                            label="PR"
                            :value="purchase.documentNumber?.startsWith('PR-')
                                ? purchase.documentNumber
                                : '—'"
                        />

                        <DocumentCard
                            label="REQ"
                            :value="purchase.requestNumber || '—'"
                        />

                        <DocumentCard
                            label="PO"
                            :value="purchase.purchaseOrderNumber || '—'"
                        />

                        <DocumentCard
                            label="GR"
                            :value="purchase.receiptNumber || '—'"
                        />
                    </div>

                    <!-- Info -->
                    <div class="mt-6 grid gap-4 sm:grid-cols-3">
                        <InfoItem
                            label="Tanggal"
                            :value="formatDate(purchase.date)"
                        />

                        <InfoItem
                            label="Supplier"
                            :value="purchase.supplierName || 'Belum ditentukan'"
                        />

                        <InfoItem
                            label="Jumlah Item"
                            :value="`${purchase.items.length} item`"
                        />
                    </div>

                    <!-- Timeline -->
                    <div class="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5">
                        <h3 class="text-sm font-bold text-gray-900">
                            Progress Pembelian
                        </h3>

                        <div class="mt-5 space-y-4">
                            <TimelineItem
                                label="Dibuat"
                                :active="true"
                                :date="formatDate(purchase.date)"
                            />

                            <TimelineItem
                                label="Diajukan"
                                :active="['submitted', 'purchased', 'received'].includes(purchase.status)"
                                :date="purchase.requestNumber ? 'Pengajuan telah dibuat' : 'Menunggu pengajuan'"
                            />

                            <TimelineItem
                                label="Dibeli"
                                :active="['purchased', 'received'].includes(purchase.status)"
                                :date="purchase.purchaseOrderNumber || 'Menunggu approval'"
                            />

                            <TimelineItem
                                label="Diterima"
                                :active="purchase.status === 'received'"
                                :date="purchase.receiptNumber || 'Menunggu penerimaan'"
                                :last="true"
                            />
                        </div>
                    </div>

                    <!-- Items -->
                    <div class="mt-6">
                        <h3 class="mb-3 text-sm font-bold text-gray-900">
                            Detail Barang
                        </h3>

                        <div class="overflow-x-auto rounded-xl border border-gray-200">
                            <table class="w-full min-w-[650px]">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                                            Barang
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                            Qty
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                            Harga
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-100">
                                    <tr
                                        v-for="(item, index) in purchase.items"
                                        :key="index"
                                    >
                                        <td class="px-4 py-3">
                                            <p class="text-sm font-medium text-gray-900">
                                                {{ item.productName }}
                                            </p>

                                            <p class="text-xs text-gray-400">
                                                {{ item.unit }}
                                            </p>
                                        </td>

                                        <td class="px-4 py-3 text-right text-sm">
                                            {{ item.quantity }}
                                        </td>

                                        <td class="px-4 py-3 text-right text-sm">
                                            {{ formatCurrency(item.price) }}
                                        </td>

                                        <td class="px-4 py-3 text-right text-sm font-semibold">
                                            {{ formatCurrency(item.subtotal) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-4 flex justify-end">
                            <div class="text-right">
                                <p class="text-xs text-gray-500">
                                    Total
                                </p>

                                <p class="text-xl font-bold text-[#003366]">
                                    {{ formatCurrency(purchase.total) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div
                        v-if="purchase.notes"
                        class="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                        <p class="text-xs font-semibold uppercase text-gray-400">
                            Catatan
                        </p>

                        <p class="mt-2 text-sm text-gray-700">
                            {{ purchase.notes }}
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end gap-2 border-t border-gray-100 px-5 py-4 sm:px-6">
                    <button
                        type="button"
                        @click="close"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
                    >
                        Tutup
                    </button>

                    <button
                        v-if="purchase.status === 'draft'"
                        type="button"
                        @click="edit"
                        class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import DocumentCard from './DocumentCard.vue'
import InfoItem from './InfoItem.vue'
import TimelineItem from './TimelineItem.vue'

const props = defineProps({
    show: Boolean,
    purchase: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits(['close', 'edit'])

function close() {
    emit('close')
}

function edit() {
    emit('edit', props.purchase)
}

function statusLabel(status) {
    return {
        draft: 'Dibuat',
        submitted: 'Diajukan',
        purchased: 'Dibeli',
        received: 'Diterima',
    }[status]
}

function statusClass(status) {
    return {
        draft: 'bg-gray-100 text-gray-600',
        submitted: 'bg-blue-50 text-blue-700',
        purchased: 'bg-orange-50 text-orange-700',
        received: 'bg-green-50 text-green-700',
    }[status]
}

function formatCurrency(value) {
    if (!value) return '-'

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