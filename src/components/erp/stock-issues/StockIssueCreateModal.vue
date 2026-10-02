<template>
    <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div
            class="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
            <div class="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        Pengeluaran Barang
                    </h2>

                    <p class="mt-1 text-xs text-gray-500">
                        Buat permintaan pengeluaran barang dari gudang.
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
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Tanggal
                        </label>

                        <input
                            v-model="form.date"
                            type="date"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Pemohon
                        </label>

                        <input
                            v-model="form.requester"
                            type="text"
                            placeholder="Nama pemohon"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Bagian
                        </label>

                        <select
                            v-model="form.department"
                            class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        >
                            <option value="">
                                Pilih bagian
                            </option>

                            <option
                                v-for="department in departments"
                                :key="department"
                                :value="department"
                            >
                                {{ department }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Gudang
                        </label>

                        <select
                            v-model="form.warehouse"
                            class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        >
                            <option value="">
                                Pilih gudang
                            </option>

                            <option
                                v-for="warehouse in warehouses"
                                :key="warehouse"
                                :value="warehouse"
                            >
                                {{ warehouse }}
                            </option>
                        </select>
                    </div>

                    <div class="sm:col-span-2">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Keperluan
                        </label>

                        <input
                            v-model="form.purpose"
                            type="text"
                            placeholder="Contoh: Perawatan kendaraan"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        />
                    </div>
                </div>

                <!-- ITEMS -->
                <div class="mt-6">
                    <div class="mb-3 flex items-center justify-between">
                        <div>
                            <h3 class="font-bold text-[#003366]">
                                Barang yang Diminta
                            </h3>

                            <p class="mt-1 text-xs text-gray-500">
                                Tambahkan satu atau beberapa barang.
                            </p>
                        </div>

                        <button
                            type="button"
                            class="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0052cc] hover:bg-blue-100"
                            @click="addItem"
                        >
                            + Tambah Barang
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div
                            v-for="(row, index) in form.items"
                            :key="row.key"
                            class="rounded-xl border border-gray-200 p-4"
                        >
                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
                                <div>
                                    <label class="mb-1.5 block text-xs font-medium text-gray-500">
                                        Barang
                                    </label>

                                    <select
                                        v-model="row.itemId"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    >
                                        <option value="">
                                            Pilih barang
                                        </option>

                                        <option
                                            v-for="item in availableItems(row.itemId)"
                                            :key="item.id"
                                            :value="item.id"
                                        >
                                            {{ item.code }} - {{ item.name }}
                                            (stok {{ item.stock }} {{ item.uom }})
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="mb-1.5 block text-xs font-medium text-gray-500">
                                        Jumlah
                                    </label>

                                    <input
                                        v-model.number="row.quantity"
                                        type="number"
                                        min="1"
                                        class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />
                                </div>

                                <button
                                    type="button"
                                    class="rounded-xl border border-red-100 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                                    @click="removeItem(index)"
                                >
                                    Hapus
                                </button>
                            </div>

                            <p
                                v-if="getItem(row.itemId)"
                                class="mt-2 text-xs text-gray-400"
                            >
                                Stok tersedia:
                                <strong>
                                    {{ getItem(row.itemId).stock }}
                                    {{ getItem(row.itemId).uom }}
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>

                <!-- NOTES -->
                <div class="mt-5">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700">
                        Catatan
                    </label>

                    <textarea
                        v-model="form.notes"
                        rows="3"
                        placeholder="Catatan tambahan..."
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
                    :disabled="!canSubmit"
                    class="rounded-xl bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00457f] disabled:cursor-not-allowed disabled:opacity-50"
                    @click="submit"
                >
                    Ajukan Pengeluaran
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    items: {
        type: Array,
        default: () => [],
    },

    warehouses: {
        type: Array,
        default: () => [],
    },

    departments: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

const form = reactive({
    date: '',
    requester: '',
    department: '',
    warehouse: '',
    purpose: '',
    notes: '',
    items: [],
})

const canSubmit = computed(() => {
    if (
        !form.date ||
        !form.requester ||
        !form.department ||
        !form.warehouse ||
        !form.purpose
    ) {
        return false
    }

    if (!form.items.length) {
        return false
    }

    return form.items.every((row) => {
        const item = getItem(row.itemId)

        return (
            row.itemId !== '' &&
            Number(row.quantity) > 0 &&
            item &&
            Number(row.quantity) <= Number(item.stock)
        )
    })
})

watch(
    () => props.show,
    (value) => {
        if (value) {
            resetForm()
        }
    }
)

function resetForm() {
    form.date = new Date().toISOString().slice(0, 10)
    form.requester = ''
    form.department = ''
    form.warehouse = ''
    form.purpose = ''
    form.notes = ''

    form.items = [
        {
            key: Date.now(),
            itemId: '',
            quantity: 1,
        },
    ]
}

function addItem() {
    form.items.push({
        key: Date.now() + Math.random(),
        itemId: '',
        quantity: 1,
    })
}

function removeItem(index) {
    if (form.items.length === 1) {
        return
    }

    form.items.splice(index, 1)
}

function getItem(itemId) {
    return props.items.find(
        (item) => String(item.id) === String(itemId)
    )
}

function availableItems(currentId) {
    const selectedIds = form.items
        .map((row) => String(row.itemId))
        .filter((id) => id && id !== String(currentId))

    return props.items.filter(
        (item) =>
            !selectedIds.includes(String(item.id))
    )
}

function submit() {
    if (!canSubmit.value) {
        return
    }

    const payload = {
        date: form.date,
        requester: form.requester,
        department: form.department,
        warehouse: form.warehouse,
        purpose: form.purpose,
        notes: form.notes,
        items: form.items.map((row) => {
            const item = getItem(row.itemId)

            return {
                itemId: item.id,
                itemCode: item.code,
                itemName: item.name,
                quantity: Number(row.quantity),
                uom: item.uom,
            }
        }),
    }

    emit('saved', payload)
}

function close() {
    emit('close')
}
</script>