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
                <div
                    class="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6"
                >
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h2 class="text-lg font-bold text-gray-900">
                                {{ purchase.request_number || 'Purchase Request' }}
                            </h2>

                            <span
                                class="rounded-full px-3 py-1 text-xs font-medium"
                                :class="statusClass(purchase.status)"
                            >
                                {{ statusLabel(purchase.status) }}
                            </span>
                        </div>

                        <p class="mt-1 text-sm text-gray-500">
                            Detail Purchase Request
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
                    <!-- Document -->
                    <div class="grid gap-3 sm:grid-cols-2">
                        <DocumentCard
                            label="Nomor PR"
                            :value="purchase.request_number || '—'"
                        />

                        <DocumentCard
                            label="Status"
                            :value="statusLabel(purchase.status)"
                        />
                    </div>

                    <!-- Info -->
                    <div class="mt-6 grid gap-4 sm:grid-cols-3">
                        <InfoItem
                            label="Tanggal Pengajuan"
                            :value="formatDate(purchase.request_date)"
                        />

                        <InfoItem
                            label="Diminta Oleh"
                            :value="
                                purchase.requested_by?.name ||
                                purchase.requestedBy?.name ||
                                'Belum ditentukan'
                            "
                        />

                        <InfoItem
                            label="Jumlah Item"
                            :value="`${purchase.items?.length || 0} item`"
                        />
                    </div>

                    <!-- Timeline -->
                    <div
                        class="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5"
                    >
                        <h3 class="text-sm font-bold text-gray-900">
                            Progress Purchase Request
                        </h3>

                        <div class="mt-5 space-y-4">
                            <TimelineItem
                                label="Dibuat"
                                :active="true"
                                :date="formatDate(purchase.created_at)"
                            />

                            <TimelineItem
                                label="Diajukan"
                                :active="
                                    ['submitted', 'approved', 'rejected', 'cancelled']
                                        .includes(purchase.status)
                                "
                                :date="
                                    ['submitted', 'approved', 'rejected', 'cancelled']
                                        .includes(purchase.status)
                                        ? 'Purchase Request telah diajukan'
                                        : 'Menunggu pengajuan'
                                "
                            />

                            <TimelineItem
                                label="Disetujui"
                                :active="purchase.status === 'approved'"
                                :date="
                                    purchase.status === 'approved'
                                        ? 'Purchase Request telah disetujui'
                                        : 'Menunggu approval'
                                "
                            />

                            <TimelineItem
                                label="Selesai"
                                :active="
                                    ['rejected', 'cancelled'].includes(
                                        purchase.status
                                    )
                                "
                                :date="
                                    purchase.status === 'rejected'
                                        ? 'Purchase Request ditolak'
                                        : purchase.status === 'cancelled'
                                            ? 'Purchase Request dibatalkan'
                                            : 'Belum selesai'
                                "
                                :last="true"
                            />
                        </div>
                    </div>

                    <!-- Items -->
                    <div class="mt-6">
                        <h3 class="mb-3 text-sm font-bold text-gray-900">
                            Detail Barang
                        </h3>

                        <div
                            class="overflow-x-auto rounded-xl border border-gray-200"
                        >
                            <table class="w-full min-w-[600px]">
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
                                            class="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Satuan
                                        </th>

                                        <th
                                            class="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Catatan
                                        </th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-100">
                                    <tr
                                        v-for="(item, index) in purchase.items || []"
                                        :key="item.id || index"
                                    >
                                        <td class="px-4 py-3">
                                            <p
                                                class="text-sm font-medium text-gray-900"
                                            >
                                                {{
                                                    item.product?.name ||
                                                    item.product?.product_name ||
                                                    'Produk tidak ditemukan'
                                                }}
                                            </p>

                                            <p
                                                v-if="item.product?.code"
                                                class="mt-0.5 text-xs text-gray-400"
                                            >
                                                {{ item.product.code }}
                                            </p>
                                        </td>

                                        <td
                                            class="px-4 py-3 text-right text-sm font-medium text-gray-900"
                                        >
                                            {{ item.quantity }}
                                        </td>

                                        <td
                                            class="px-4 py-3 text-sm text-gray-600"
                                        >
                                            {{
                                                item.unit?.name ||
                                                item.unit?.code ||
                                                '—'
                                            }}
                                        </td>

                                        <td
                                            class="px-4 py-3 text-sm text-gray-500"
                                        >
                                            {{ item.notes || '—' }}
                                        </td>
                                    </tr>

                                    <tr
                                        v-if="!purchase.items?.length"
                                    >
                                        <td
                                            colspan="4"
                                            class="px-4 py-8 text-center text-sm text-gray-400"
                                        >
                                            Tidak ada barang.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div
                        v-if="purchase.notes"
                        class="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                        <p
                            class="text-xs font-semibold uppercase text-gray-400"
                        >
                            Catatan
                        </p>

                        <p class="mt-2 text-sm text-gray-700">
                            {{ purchase.notes }}
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    class="flex justify-end gap-2 border-t border-gray-100 px-5 py-4 sm:px-6"
                >
                    <button
                        type="button"
                        @click="close"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Tutup
                    </button>

                    <button
                        v-if="
                            ['draft', 'submitted'].includes(
                                purchase.status
                            )
                        "
                        type="button"
                        @click="edit"
                        class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
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

const emit = defineEmits([
    'close',
    'edit',
])

function close() {
    emit('close')
}

function edit() {
    emit('edit', props.purchase)
}

function statusLabel(status) {
    return {
        draft: 'Draft',
        submitted: 'Diajukan',
        approved: 'Disetujui',
        rejected: 'Ditolak',
        cancelled: 'Dibatalkan',
    }[status] || status || '—'
}

function statusClass(status) {
    return {
        draft: 'bg-gray-100 text-gray-600',
        submitted: 'bg-blue-50 text-blue-700',
        approved: 'bg-green-50 text-green-700',
        rejected: 'bg-red-50 text-red-700',
        cancelled: 'bg-gray-100 text-gray-500',
    }[status] || 'bg-gray-100 text-gray-600'
}

function formatDate(value) {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return '-'
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}
</script>