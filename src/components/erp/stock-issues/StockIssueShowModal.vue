<template>
    <div
        v-if="show && issue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div
            class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
            <div class="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        Detail Pengeluaran
                    </h2>

                    <p class="mt-1 text-xs text-gray-500">
                        {{ issue.number }}
                    </p>
                </div>

                <button
                    type="button"
                    class="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                    @click="close"
                >
                    ✕
                </button>
            </div>

            <div class="overflow-y-auto p-5">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-gray-400">
                            Tanggal
                        </p>

                        <p class="mt-1 text-sm font-semibold text-gray-800">
                            {{ formatDate(issue.date) }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-400">
                            Status
                        </p>

                        <span
                            class="mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                            :class="statusClass(issue.status)"
                        >
                            {{ statusLabel(issue.status) }}
                        </span>
                    </div>

                    <div>
                        <p class="text-xs text-gray-400">
                            Pemohon
                        </p>

                        <p class="mt-1 text-sm font-semibold text-gray-800">
                            {{ issue.requester }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-400">
                            Bagian
                        </p>

                        <p class="mt-1 text-sm font-semibold text-gray-800">
                            {{ issue.department }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-400">
                            Gudang
                        </p>

                        <p class="mt-1 text-sm font-semibold text-gray-800">
                            {{ issue.warehouse }}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-400">
                            Keperluan
                        </p>

                        <p class="mt-1 text-sm font-semibold text-gray-800">
                            {{ issue.purpose }}
                        </p>
                    </div>
                </div>

                <div class="mt-6">
                    <h3 class="font-bold text-[#003366]">
                        Barang
                    </h3>

                    <div class="mt-3 overflow-hidden rounded-xl border border-gray-200">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                                        Barang
                                    </th>

                                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                        Jumlah
                                    </th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-gray-100">
                                <tr
                                    v-for="item in issue.items"
                                    :key="item.itemId"
                                >
                                    <td class="px-4 py-3">
                                        <p class="text-sm font-medium text-gray-800">
                                            {{ item.itemName }}
                                        </p>

                                        <p class="text-xs text-gray-400">
                                            {{ item.itemCode }}
                                        </p>
                                    </td>

                                    <td class="px-4 py-3 text-right text-sm font-semibold text-gray-800">
                                        {{ item.quantity }}
                                        {{ item.uom }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div
                    v-if="issue.notes"
                    class="mt-5 rounded-xl bg-gray-50 p-4"
                >
                    <p class="text-xs text-gray-400">
                        Catatan
                    </p>

                    <p class="mt-1 text-sm text-gray-700">
                        {{ issue.notes }}
                    </p>
                </div>
            </div>

            <div class="flex justify-end border-t border-gray-100 px-5 py-4">
                <button
                    type="button"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    @click="close"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    issue: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits(['close'])

function close() {
    emit('close')
}

function statusLabel(status) {
    const labels = {
        draft: 'Dibuat',
        requested: 'Diajukan',
        approved: 'Disetujui',
        issued: 'Dikeluarkan',
        completed: 'Selesai',
    }

    return labels[status] || status
}

function statusClass(status) {
    const classes = {
        draft: 'bg-gray-100 text-gray-600',
        requested: 'bg-yellow-50 text-yellow-700',
        approved: 'bg-blue-50 text-blue-700',
        issued: 'bg-purple-50 text-purple-700',
        completed: 'bg-green-50 text-green-700',
    }

    return classes[status] || 'bg-gray-100 text-gray-600'
}

function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}
</script>