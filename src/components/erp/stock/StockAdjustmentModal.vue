<script setup>
import { computed, ref, watch } from 'vue'
import {
    X,
    Package,
    Plus,
    Trash2,
    AlertTriangle,
    CheckCircle2,
} from 'lucide-vue-next'

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

const saving = ref(false)

const errors = ref({})

const form = ref({
    adjustment_date: new Date()
        .toISOString()
        .slice(0, 10),

    warehouse_id: '',

    reason: '',

    notes: '',

    items: [],
})


/*
|--------------------------------------------------------------------------
| Product Options
|--------------------------------------------------------------------------
*/

const productOptions = computed(() => {
    const map = new Map()

    props.items.forEach(item => {
        if (!item.product_id) {
            return
        }

        if (!map.has(item.product_id)) {
            map.set(item.product_id, item)
        }
    })

    return Array.from(map.values())
})


/*
|--------------------------------------------------------------------------
| Add Item
|--------------------------------------------------------------------------
*/

function addItem() {
    form.value.items.push({
        product_id: '',
        location_id: null,
        system_quantity: 0,
        physical_quantity: '',
        difference_quantity: 0,
        notes: '',
    })
}


/*
|--------------------------------------------------------------------------
| Remove Item
|--------------------------------------------------------------------------
*/

function removeItem(index) {
    form.value.items.splice(index, 1)
}


/*
|--------------------------------------------------------------------------
| Product Selected
|--------------------------------------------------------------------------
*/

function handleProductChange(row) {
    const item = props.items.find(
        item =>
            String(item.product_id) ===
            String(row.product_id)
            &&
            (
                !form.value.warehouse_id
                ||
                String(item.warehouse?.id) ===
                String(form.value.warehouse_id)
            )
    )

    if (!item) {
        row.system_quantity = 0
        row.difference_quantity = 0
        return
    }

    row.system_quantity = Number(
        item.stock || 0
    )

    row.location_id = null

    calculateDifference(row)
}


/*
|--------------------------------------------------------------------------
| Difference
|--------------------------------------------------------------------------
*/

function calculateDifference(row) {
    const physical = Number(
        row.physical_quantity || 0
    )

    const system = Number(
        row.system_quantity || 0
    )

    row.difference_quantity =
        physical - system
}


/*
|--------------------------------------------------------------------------
| Unit
|--------------------------------------------------------------------------
*/

function getUnit(row) {
    const item = props.items.find(
        item =>
            String(item.product_id) ===
            String(row.product_id)
    )

    return (
        item?.unit?.code ||
        item?.unit?.name ||
        ''
    )
}


/*
|--------------------------------------------------------------------------
| Product Name
|--------------------------------------------------------------------------
*/

function getProduct(item) {
    return props.items.find(
        row =>
            String(row.product_id) ===
            String(item.product_id)
    )
}


/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validate() {
    errors.value = {}

    if (!form.value.adjustment_date) {
        errors.value.adjustment_date =
            'Tanggal wajib diisi.'
    }

    if (!form.value.warehouse_id) {
        errors.value.warehouse_id =
            'Gudang wajib dipilih.'
    }

    if (!form.value.reason.trim()) {
        errors.value.reason =
            'Alasan penyesuaian wajib diisi.'
    }

    if (!form.value.items.length) {
        errors.value.items =
            'Minimal satu barang harus ditambahkan.'
    }

    const duplicateProducts = new Set()

    for (const row of form.value.items) {
        if (!row.product_id) {
            errors.value.items =
                'Semua baris harus memiliki barang.'
            break
        }

        if (
            duplicateProducts.has(
                String(row.product_id)
            )
        ) {
            errors.value.items =
                'Barang yang sama tidak boleh dipilih dua kali.'
            break
        }

        duplicateProducts.add(
            String(row.product_id)
        )

        if (
            row.physical_quantity === ''
            ||
            Number(row.physical_quantity) < 0
        ) {
            errors.value.items =
                'Stok fisik harus diisi dan tidak boleh negatif.'
            break
        }
    }

    return Object.keys(errors.value).length === 0
}


/*
|--------------------------------------------------------------------------
| Save
|--------------------------------------------------------------------------
*/

function handleSave() {
    if (!validate()) {
        return
    }

    const payload = {
        adjustment_date:
            form.value.adjustment_date,

        warehouse_id:
            form.value.warehouse_id,

        reason:
            form.value.reason.trim(),

        notes:
            form.value.notes.trim(),

        items:
            form.value.items.map(item => ({
                product_id: item.product_id,
                location_id: item.location_id,
                physical_quantity:
                    Number(item.physical_quantity),
                notes:
                    item.notes?.trim() || null,
            })),
    }

    emit('saved', payload)
}


/*
|--------------------------------------------------------------------------
| Reset
|--------------------------------------------------------------------------
*/

function resetForm() {
    form.value = {
        adjustment_date: new Date()
            .toISOString()
            .slice(0, 10),

        warehouse_id: '',
        reason: '',
        notes: '',
        items: [],
    }

    errors.value = {}
}


/*
|--------------------------------------------------------------------------
| Close
|--------------------------------------------------------------------------
*/

function closeModal() {
    if (saving.value) {
        return
    }

    resetForm()

    emit('close')
}


/*
|--------------------------------------------------------------------------
| Watch
|--------------------------------------------------------------------------
*/

watch(
    () => props.show,
    value => {
        if (value) {
            resetForm()
        }
    }
)
</script>


<template>
    <Teleport to="body">

        <div
            v-if="show"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
            @click.self="closeModal"
        >

            <div
                class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >

                <!-- HEADER -->
                <div
                    class="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"
                >

                    <div class="flex items-center gap-3">

                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14a2d8]/10 text-[#14a2d8]"
                        >
                            <Package class="h-5 w-5" />
                        </div>

                        <div>
                            <h2 class="text-base font-bold text-slate-800">
                                Penyesuaian Stok
                            </h2>

                            <p class="text-xs text-slate-500">
                                Catat hasil stok fisik dan selisih stok sistem.
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        @click="closeModal"
                        class="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                    >
                        <X class="h-5 w-5" />
                    </button>

                </div>


                <!-- BODY -->
                <div class="overflow-y-auto p-5 sm:p-6">

                    <!-- HEADER FORM -->
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <!-- Tanggal -->
                        <div>
                            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                Tanggal
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.adjustment_date"
                                type="date"
                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                            />

                            <p
                                v-if="errors.adjustment_date"
                                class="mt-1 text-xs text-red-500"
                            >
                                {{ errors.adjustment_date }}
                            </p>
                        </div>


                        <!-- Gudang -->
                        <div>
                            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                Gudang
                                <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.warehouse_id"
                                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                            >
                                <option value="">
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

                            <p
                                v-if="errors.warehouse_id"
                                class="mt-1 text-xs text-red-500"
                            >
                                {{ errors.warehouse_id }}
                            </p>
                        </div>


                        <!-- Alasan -->
                        <div>
                            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                Alasan
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.reason"
                                type="text"
                                placeholder="Contoh: Stock opname"
                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                            />

                            <p
                                v-if="errors.reason"
                                class="mt-1 text-xs text-red-500"
                            >
                                {{ errors.reason }}
                            </p>
                        </div>

                    </div>


                    <!-- ITEMS -->
                    <div class="mt-6">

                        <div class="mb-3 flex items-center justify-between">

                            <div>
                                <h3 class="text-sm font-bold text-slate-800">
                                    Detail Barang
                                </h3>

                                <p class="text-xs text-slate-500">
                                    Masukkan jumlah fisik hasil pengecekan.
                                </p>
                            </div>

                            <button
                                type="button"
                                @click="addItem"
                                class="inline-flex items-center gap-2 rounded-xl bg-[#14a2d8] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#118fc0]"
                            >
                                <Plus class="h-4 w-4" />
                                Tambah Barang
                            </button>

                        </div>


                        <div
                            v-if="errors.items"
                            class="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600"
                        >
                            <AlertTriangle class="h-4 w-4 shrink-0" />
                            {{ errors.items }}
                        </div>


                        <!-- DESKTOP -->
                        <div class="hidden overflow-x-auto rounded-2xl border border-slate-200 md:block">

                            <table class="min-w-full">

                                <thead class="bg-slate-50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                            Barang
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                            Stok Sistem
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                            Stok Fisik
                                        </th>

                                        <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                            Selisih
                                        </th>

                                        <th class="w-12 px-2 py-3"></th>
                                    </tr>
                                </thead>


                                <tbody class="divide-y divide-slate-100">

                                    <tr
                                        v-for="(row, index) in form.items"
                                        :key="index"
                                    >

                                        <!-- Barang -->
                                        <td class="px-4 py-3">

                                            <select
                                                v-model="row.product_id"
                                                @change="handleProductChange(row)"
                                                class="w-full min-w-[240px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#14a2d8]"
                                            >
                                                <option value="">
                                                    Pilih barang
                                                </option>

                                                <option
                                                    v-for="item in productOptions"
                                                    :key="item.product_id"
                                                    :value="item.product_id"
                                                >
                                                    {{ item.code }} - {{ item.name }}
                                                </option>
                                            </select>

                                        </td>


                                        <!-- System -->
                                        <td class="px-4 py-3 text-right">

                                            <div class="font-semibold text-slate-700">
                                                {{ row.system_quantity }}
                                            </div>

                                            <div class="text-[11px] text-slate-400">
                                                {{ getUnit(row) }}
                                            </div>

                                        </td>


                                        <!-- Physical -->
                                        <td class="px-4 py-3">

                                            <input
                                                v-model="row.physical_quantity"
                                                @input="calculateDifference(row)"
                                                type="number"
                                                min="0"
                                                step="0.001"
                                                placeholder="0"
                                                class="w-32 rounded-lg border border-slate-200 px-3 py-2 text-right text-sm font-semibold outline-none focus:border-[#14a2d8]"
                                            />

                                        </td>


                                        <!-- Difference -->
                                        <td class="px-4 py-3 text-right">

                                            <span
                                                v-if="row.product_id"
                                                class="font-bold"
                                                :class="{
                                                    'text-emerald-600': row.difference_quantity > 0,
                                                    'text-red-600': row.difference_quantity < 0,
                                                    'text-slate-400': row.difference_quantity === 0,
                                                }"
                                            >
                                                {{
                                                    row.difference_quantity > 0
                                                        ? '+'
                                                        : ''
                                                }}{{ row.difference_quantity }}
                                            </span>

                                            <span class="ml-1 text-xs text-slate-400">
                                                {{ getUnit(row) }}
                                            </span>

                                        </td>


                                        <!-- Delete -->
                                        <td class="px-2 py-3 text-center">

                                            <button
                                                type="button"
                                                @click="removeItem(index)"
                                                class="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2 class="h-4 w-4" />
                                            </button>

                                        </td>

                                    </tr>


                                    <tr v-if="!form.items.length">
                                        <td
                                            colspan="5"
                                            class="px-5 py-10 text-center"
                                        >
                                            <Package class="mx-auto h-8 w-8 text-slate-300" />

                                            <p class="mt-2 text-sm font-medium text-slate-500">
                                                Belum ada barang
                                            </p>

                                            <p class="mt-1 text-xs text-slate-400">
                                                Tambahkan barang yang ingin dicek.
                                            </p>
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>


                        <!-- MOBILE -->
                        <div class="space-y-3 md:hidden">

                            <div
                                v-for="(row, index) in form.items"
                                :key="index"
                                class="rounded-2xl border border-slate-200 p-4"
                            >

                                <div class="mb-3 flex items-center justify-between">

                                    <span class="text-xs font-semibold text-slate-500">
                                        Barang {{ index + 1 }}
                                    </span>

                                    <button
                                        type="button"
                                        @click="removeItem(index)"
                                        class="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>

                                </div>


                                <select
                                    v-model="row.product_id"
                                    @change="handleProductChange(row)"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#14a2d8]"
                                >
                                    <option value="">
                                        Pilih barang
                                    </option>

                                    <option
                                        v-for="item in productOptions"
                                        :key="item.product_id"
                                        :value="item.product_id"
                                    >
                                        {{ item.code }} - {{ item.name }}
                                    </option>
                                </select>


                                <div class="mt-3 grid grid-cols-3 gap-2">

                                    <div class="rounded-xl bg-slate-50 p-3">
                                        <p class="text-[10px] text-slate-400">
                                            Sistem
                                        </p>

                                        <p class="mt-1 text-sm font-bold text-slate-700">
                                            {{ row.system_quantity }}
                                        </p>
                                    </div>


                                    <div class="rounded-xl bg-slate-50 p-3">

                                        <p class="text-[10px] text-slate-400">
                                            Fisik
                                        </p>

                                        <input
                                            v-model="row.physical_quantity"
                                            @input="calculateDifference(row)"
                                            type="number"
                                            min="0"
                                            step="0.001"
                                            class="mt-1 w-full bg-transparent text-sm font-bold text-slate-700 outline-none"
                                            placeholder="0"
                                        />

                                    </div>


                                    <div class="rounded-xl bg-slate-50 p-3">

                                        <p class="text-[10px] text-slate-400">
                                            Selisih
                                        </p>

                                        <p
                                            class="mt-1 text-sm font-bold"
                                            :class="{
                                                'text-emerald-600': row.difference_quantity > 0,
                                                'text-red-600': row.difference_quantity < 0,
                                                'text-slate-400': row.difference_quantity === 0,
                                            }"
                                        >
                                            {{
                                                row.difference_quantity > 0
                                                    ? '+'
                                                    : ''
                                            }}{{ row.difference_quantity }}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div
                                v-if="!form.items.length"
                                class="rounded-2xl border border-dashed border-slate-200 py-10 text-center"
                            >
                                <Package class="mx-auto h-8 w-8 text-slate-300" />

                                <p class="mt-2 text-sm text-slate-500">
                                    Belum ada barang
                                </p>
                            </div>

                        </div>

                    </div>


                    <!-- NOTES -->
                    <div class="mt-5">

                        <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                            Catatan
                            <span class="font-normal text-slate-400">
                                (opsional)
                            </span>
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Catatan umum penyesuaian stok..."
                            class="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                        ></textarea>

                    </div>

                </div>


                <!-- FOOTER -->
                <div
                    class="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6"
                >

                    <div class="hidden items-center gap-2 text-xs text-slate-500 sm:flex">

                        <CheckCircle2 class="h-4 w-4 text-[#14a2d8]" />

                        <span>
                            Data akan disimpan sebagai draft.
                        </span>

                    </div>


                    <div class="flex w-full justify-end gap-3 sm:w-auto">

                        <button
                            type="button"
                            @click="closeModal"
                            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            @click="handleSave"
                            :disabled="saving"
                            class="rounded-xl bg-[#14a2d8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#118fc0] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Simpan Draft
                        </button>

                    </div>

                </div>

            </div>

        </div>

    </Teleport>
</template>