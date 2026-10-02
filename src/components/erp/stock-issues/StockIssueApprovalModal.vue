<template>
    <div
        v-if="show && issue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div
            class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
        >
            <div class="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        Proses Pengeluaran Barang
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

            <div class="p-5">
                <div class="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                    <p class="text-sm font-semibold text-yellow-800">
                        Periksa barang sebelum dikeluarkan
                    </p>

                    <p class="mt-1 text-xs leading-5 text-yellow-700">
                        Setelah barang dikeluarkan, jumlah stok gudang akan
                        berkurang sesuai jumlah yang diberikan.
                    </p>
                </div>

                <div class="mt-5 grid grid-cols-2 gap-4">
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

                    <div class="col-span-2">
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

                    <div class="mt-3 space-y-3">
                        <div
                            v-for="item in localItems"
                            :key="item.itemId"
                            class="rounded-xl border border-gray-200 p-4"
                        >
                            <div class="flex items-center justify-between gap-4">
                                <div>
                                    <p class="text-sm font-semibold text-gray-800">
                                        {{ item.itemName }}
                                    </p>

                                    <p class="mt-1 text-xs text-gray-400">
                                        {{ item.itemCode }}
                                    </p>
                                </div>

                                <div class="text-right">
                                    <p class="text-xs text-gray-400">
                                        Jumlah
                                    </p>

                                    <p class="mt-1 font-bold text-gray-900">
                                        {{ item.quantity }}
                                        {{ item.uom }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-5">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700">
                        Catatan Proses
                    </label>

                    <textarea
                        v-model="notes"
                        rows="3"
                        placeholder="Catatan jika ada..."
                        class="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                    ></textarea>
                </div>
            </div>

            <div class="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    @click="close"
                >
                    Batal
                </button>

                <button
                    type="button"
                    class="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    @click="process"
                >
                    Keluarkan Barang
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    issue: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'close',
    'processed',
])

const notes = ref('')
const localItems = ref([])

watch(
    () => props.issue,
    (issue) => {
        if (!issue) {
            localItems.value = []
            return
        }

        notes.value = ''

        localItems.value = issue.items.map((item) => ({
            ...item,
        }))
    },
    {
        immediate: true,
    }
)

function close() {
    emit('close')
}

function process() {
    if (!props.issue) {
        return
    }

    emit('processed', {
        id: props.issue.id,
        status: 'completed',
        items: localItems.value,
        notes: notes.value,
    })
}
</script>