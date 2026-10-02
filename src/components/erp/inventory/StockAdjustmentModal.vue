<template>
    <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div
            class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
            <!-- HEADER -->
            <div
                class="flex items-start justify-between border-b border-gray-100 px-5 py-4"
            >
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        Penyesuaian Stok
                    </h2>

                    <p class="mt-1 text-xs text-gray-500">
                        Sesuaikan jumlah stok berdasarkan kondisi fisik barang.
                    </p>
                </div>

                <button
                    type="button"
                    class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    @click="close"
                >
                    ✕
                </button>
            </div>

            <!-- BODY -->
            <div class="overflow-y-auto p-5">
                <div class="space-y-5">
                    <!-- INFO -->
                    <div
                        class="rounded-xl border border-blue-100 bg-blue-50 p-4"
                    >
                        <div class="flex gap-3">
                            <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600"
                            >
                                i
                            </div>

                            <div>
                                <p
                                    class="text-sm font-semibold text-blue-900"
                                >
                                    Penyesuaian stok
                                </p>

                                <p
                                    class="mt-1 text-xs leading-5 text-blue-700"
                                >
                                    Gunakan fitur ini jika jumlah stok fisik
                                    berbeda dengan stok yang tercatat di sistem.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- FORM -->
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <!-- TANGGAL -->
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Tanggal
                            </label>

                            <input
                                v-model="form.date"
                                type="date"
                                required
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                            />
                        </div>

                        <!-- GUDANG -->
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Gudang
                            </label>

                            <select
                                v-model="form.warehouse"
                                required
                                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
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

                        <!-- BARANG -->
                        <div class="sm:col-span-2">
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Barang
                            </label>

                            <select
                                v-model="form.itemId"
                                required
                                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                            >
                                <option value="">
                                    Pilih barang
                                </option>

                                <option
                                    v-for="item in items"
                                    :key="item.id"
                                    :value="item.id"
                                >
                                    {{ item.code }} - {{ item.name }}
                                </option>
                            </select>
                        </div>

                        <!-- STOK SISTEM -->
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Stok Sistem
                            </label>

                            <div
                                class="flex min-h-[42px] items-center rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-gray-700"
                            >
                                {{ formatNumber(selectedItem?.stock || 0) }}
                                {{ selectedItem?.uom || '' }}
                            </div>
                        </div>

                        <!-- STOK FISIK -->
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Stok Fisik
                            </label>

                            <input
                                v-model.number="form.physicalStock"
                                type="number"
                                min="0"
                                required
                                placeholder="Masukkan stok fisik"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                            />
                        </div>
                    </div>

                    <!-- SELISIH -->
                    <div
                        v-if="form.itemId !== ''"
                        class="rounded-xl border p-4"
                        :class="
                            difference === 0
                                ? 'border-gray-200 bg-gray-50'
                                : difference > 0
                                  ? 'border-green-100 bg-green-50'
                                  : 'border-red-100 bg-red-50'
                        "
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <p
                                    class="text-xs font-medium"
                                    :class="
                                        difference === 0
                                            ? 'text-gray-500'
                                            : difference > 0
                                              ? 'text-green-600'
                                              : 'text-red-600'
                                    "
                                >
                                    Selisih Stok
                                </p>

                                <p
                                    class="mt-1 text-xl font-bold"
                                    :class="
                                        difference === 0
                                            ? 'text-gray-800'
                                            : difference > 0
                                              ? 'text-green-700'
                                              : 'text-red-700'
                                    "
                                >
                                    {{ difference > 0 ? '+' : '' }}{{
                                        formatNumber(difference)
                                    }}
                                    {{ selectedItem?.uom || '' }}
                                </p>
                            </div>

                            <span
                                class="rounded-full px-3 py-1.5 text-xs font-semibold"
                                :class="differenceClass"
                            >
                                {{ differenceLabel }}
                            </span>
                        </div>
                    </div>

                    <!-- ALASAN -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Alasan Penyesuaian
                        </label>

                        <select
                            v-model="form.reason"
                            required
                            class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                        >
                            <option value="">
                                Pilih alasan
                            </option>

                            <option value="stock_opname">
                                Stock Opname
                            </option>

                            <option value="barang_rusak">
                                Barang Rusak
                            </option>

                            <option value="barang_hilang">
                                Barang Hilang
                            </option>

                            <option value="kesalahan_input">
                                Kesalahan Input
                            </option>

                            <option value="lainnya">
                                Lainnya
                            </option>
                        </select>
                    </div>

                    <!-- CATATAN -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Catatan
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Tambahkan catatan jika diperlukan..."
                            class="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-50"
                        ></textarea>
                    </div>
                </div>
            </div>

            <!-- FOOTER -->
            <div
                class="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end"
            >
                <button
                    type="button"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    @click="close"
                >
                    Batal
                </button>

                <button
                    type="button"
                    :disabled="!canSubmit"
                    class="rounded-xl bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00457f] disabled:cursor-not-allowed disabled:opacity-50"
                    @click="submit"
                >
                    Simpan Penyesuaian
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
})

const emit = defineEmits([
    'close',
    'saved',
])

const form = reactive({
    date: '',
    warehouse: '',
    itemId: '',
    physicalStock: null,
    reason: '',
    notes: '',
})

const selectedItem = computed(() => {
    return props.items.find(
        (item) => String(item.id) === String(form.itemId)
    )
})

const systemStock = computed(() => {
    return selectedItem.value?.stock || 0
})

const difference = computed(() => {
    if (
        form.itemId === '' ||
        form.physicalStock === null ||
        form.physicalStock === ''
    ) {
        return 0
    }

    return Number(form.physicalStock) - Number(systemStock.value)
})

const differenceLabel = computed(() => {
    if (difference.value === 0) {
        return 'Tidak ada selisih'
    }

    if (difference.value > 0) {
        return 'Stok bertambah'
    }

    return 'Stok berkurang'
})

const differenceClass = computed(() => {
    if (difference.value === 0) {
        return 'bg-gray-100 text-gray-600'
    }

    if (difference.value > 0) {
        return 'bg-green-100 text-green-700'
    }

    return 'bg-red-100 text-red-700'
})

const canSubmit = computed(() => {
    return (
        form.date &&
        form.warehouse &&
        form.itemId &&
        form.physicalStock !== null &&
        form.physicalStock !== '' &&
        Number(form.physicalStock) >= 0 &&
        form.reason
    )
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
    form.warehouse = ''
    form.itemId = ''
    form.physicalStock = null
    form.reason = ''
    form.notes = ''
}

function close() {
    emit('close')
}

function submit() {
    if (!canSubmit.value) {
        return
    }

    const item = selectedItem.value

    emit('saved', {
        id: Date.now(),
        date: form.date,
        warehouse: form.warehouse,
        itemId: item.id,
        itemCode: item.code,
        itemName: item.name,
        uom: item.uom,
        systemStock: systemStock.value,
        physicalStock: Number(form.physicalStock),
        difference: difference.value,
        reason: form.reason,
        notes: form.notes,
    })
}

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(value || 0)
}
</script>