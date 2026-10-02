<template>
    <Transition name="modal">
        <div
            v-if="show && purchase"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div class="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">
                            Penerimaan Barang
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ purchase.purchaseOrderNumber }}
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

                <div class="max-h-[72vh] overflow-y-auto p-5 sm:p-6">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Tanggal Penerimaan
                            </label>

                            <input
                                v-model="form.receivedDate"
                                type="date"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                            />
                        </div>

                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Gudang
                            </label>

                            <select
                                v-model="form.warehouseId"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
                            >
                                <option :value="null">
                                    Pilih gudang
                                </option>

                                <option
                                    v-for="warehouse in warehouses"
                                    :key="warehouse.id"
                                    :value="warehouse.id"
                                >
                                    {{ warehouse.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-6">
                        <h3 class="mb-3 text-sm font-bold text-gray-900">
                            Barang Diterima
                        </h3>

                        <div class="overflow-x-auto rounded-xl border border-gray-200">
                            <table class="w-full min-w-[650px]">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                                            Barang
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                            Dipesan
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                            Diterima
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                                            Sisa
                                        </th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-100">
                                    <tr
                                        v-for="(item, index) in form.items"
                                        :key="index"
                                    >
                                        <td class="px-4 py-3">
                                            <p class="text-sm font-semibold text-gray-900">
                                                {{ item.productName }}
                                            </p>

                                            <p class="text-xs text-gray-400">
                                                {{ item.unit }}
                                            </p>
                                        </td>

                                        <td class="px-4 py-3 text-right text-sm">
                                            {{ item.quantity }}
                                        </td>

                                        <td class="px-4 py-3 text-right">
                                            <input
                                                v-model.number="item.receivedQuantity"
                                                type="number"
                                                min="0"
                                                :max="item.quantity"
                                                class="w-28 rounded-lg border border-gray-300 px-3 py-2 text-right text-sm"
                                            />
                                        </td>

                                        <td class="px-4 py-3 text-right">
                                            <span
                                                class="text-sm font-semibold"
                                                :class="
                                                    remaining(item) === 0
                                                        ? 'text-green-600'
                                                        : 'text-orange-600'
                                                "
                                            >
                                                {{ remaining(item) }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="mt-5">
                        <label class="text-sm font-medium text-gray-700">
                            Catatan Penerimaan
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Contoh: Barang diterima lengkap dan kondisi baik."
                            class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                        ></textarea>
                    </div>

                    <div class="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">
                        <p class="text-sm font-semibold text-green-800">
                            Stok akan bertambah setelah penerimaan disimpan.
                        </p>

                        <p class="mt-1 text-xs text-green-700">
                            Dokumen penerimaan akan dibuat dengan nomor GR.
                        </p>
                    </div>
                </div>

                <div class="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        @click="close"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="receive"
                        class="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Simpan Penerimaan
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
    show: Boolean,
    purchase: {
        type: Object,
        default: null,
    },
    warehouses: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['close', 'received'])

const form = reactive({
    receivedDate: '',
    warehouseId: null,
    notes: '',
    items: [],
})

watch(
    () => props.purchase,
    (purchase) => {
        if (!purchase) return

        form.receivedDate =
            new Date().toISOString().slice(0, 10)

        form.warehouseId = null
        form.notes = ''

        form.items = JSON.parse(
            JSON.stringify(
                purchase.items.map((item) => ({
                    ...item,
                    receivedQuantity:
                        item.receivedQuantity || 0,
                }))
            )
        )
    },
    {
        immediate: true,
    }
)

function remaining(item) {
    return Math.max(
        0,
        Number(item.quantity) -
            Number(item.receivedQuantity || 0)
    )
}

function receive() {
    if (!form.warehouseId) {
        alert('Gudang penerimaan wajib dipilih.')
        return
    }

    const hasReceived = form.items.some(
        (item) =>
            Number(item.receivedQuantity) > 0
    )

    if (!hasReceived) {
        alert('Minimal satu barang harus diterima.')
        return
    }

    const invalid = form.items.some(
        (item) =>
            Number(item.receivedQuantity) >
            Number(item.quantity)
    )

    if (invalid) {
        alert('Jumlah diterima tidak boleh melebihi jumlah dipesan.')
        return
    }

    const warehouse = props.warehouses.find(
        (item) => item.id === form.warehouseId
    )

    const year = new Date().getFullYear()

    emit('received', {
        ...props.purchase,

        status: 'received',

        receiptNumber:
            props.purchase.receiptNumber ||
            `GR-${year}-${String(Date.now()).slice(-4)}`,

        receivedDate: form.receivedDate,

        warehouseId: form.warehouseId,

        warehouseName: warehouse?.name || null,

        notes: form.notes,

        items: form.items,

        received: true,
    })
}

function close() {
    emit('close')
}
</script>