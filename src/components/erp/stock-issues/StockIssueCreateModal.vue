<template>
    <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div
            class="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >

            <!-- HEADER -->
            <div
                class="flex items-start justify-between border-b border-gray-100 px-5 py-4"
            >
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        Pengeluaran Barang
                    </h2>

                    <p class="mt-1 text-xs text-gray-500">
                        Buat permintaan pengeluaran barang dari Office.
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

            <!-- BODY -->
            <div class="overflow-y-auto p-5">

                <!-- ERROR -->
                <div
                    v-if="errorMessage"
                    class="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {{ errorMessage }}
                </div>

                <!-- HEADER FORM -->
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
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        />
                    </div>

                    <!-- PEMOHON -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Pemohon
                        </label>

                        <select
                            v-model="form.requestedBy"
                            class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        >
                            <option value="">
                                Pilih pemohon
                            </option>

                            <option
                                v-for="employee in employees"
                                :key="employee.id"
                                :value="employee.id"
                            >
                                {{ employee.name }}
                            </option>
                        </select>
                    </div>

                    <!-- GUDANG -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Gudang
                        </label>

                        <div
                            class="flex h-[42px] items-center rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700"
                        >
                            Office
                        </div>

                        <p class="mt-1 text-[11px] text-gray-400">
                            Gudang default perusahaan.
                        </p>
                    </div>

                    <!-- KEPERLUAN -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
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

                            <div
                                class="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end"
                            >

                                <!-- BARANG -->
                                <div>

                                    <label
                                        class="mb-1.5 block text-xs font-medium text-gray-500"
                                    >
                                        Barang
                                    </label>

                                    <select
                                        v-model="row.productId"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    >

                                        <option value="">
                                            Pilih barang
                                        </option>

                                        <option
                                            v-for="item in availableItems(row.productId)"
                                            :key="item.id"
                                            :value="item.id"
                                        >
                                            {{ item.code || item.sku || '-' }}
                                            -
                                            {{ item.name }}
                                            <template v-if="item.stock !== undefined">
                                                (stok
                                                {{ item.stock }}
                                                {{ item.unit?.symbol || item.uom || '' }})
                                            </template>
                                        </option>

                                    </select>

                                </div>

                                <!-- JUMLAH -->
                                <div>

                                    <label
                                        class="mb-1.5 block text-xs font-medium text-gray-500"
                                    >
                                        Jumlah
                                    </label>

                                    <input
                                        v-model.number="row.quantity"
                                        type="number"
                                        min="0.001"
                                        step="0.001"
                                        class="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />

                                </div>

                                <!-- HAPUS -->
                                <button
                                    type="button"
                                    class="rounded-xl border border-red-100 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                                    @click="removeItem(index)"
                                >
                                    Hapus
                                </button>

                            </div>

                            <!-- STOCK INFO -->
                            <p
                                v-if="getProduct(row.productId)"
                                class="mt-2 text-xs text-gray-400"
                            >
                                Stok tersedia:

                                <strong>
                                    {{ getStock(row.productId) }}
                                    {{ getUnitName(row.productId) }}
                                </strong>
                            </p>

                            <!-- EXCEED STOCK -->
                            <p
                                v-if="
                                    getProduct(row.productId) &&
                                    Number(row.quantity) > getStock(row.productId)
                                "
                                class="mt-1 text-xs font-medium text-red-600"
                            >
                                Jumlah melebihi stok tersedia.
                            </p>

                        </div>

                    </div>
                </div>

                <!-- NOTES -->
                <div class="mt-5">

                    <label
                        class="mb-1.5 block text-sm font-medium text-gray-700"
                    >
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

            <!-- FOOTER -->
            <div
                class="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end"
            >

                <button
                    type="button"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    :disabled="saving"
                    @click="close"
                >
                    Batal
                </button>

                <button
                    type="button"
                    :disabled="!canSubmit || saving"
                    class="rounded-xl bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00457f] disabled:cursor-not-allowed disabled:opacity-50"
                    @click="submit"
                >
                    {{ saving ? 'Menyimpan...' : 'Simpan Pengeluaran' }}
                </button>

            </div>

        </div>
    </div>
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


/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = defineProps({

    show: {
        type: Boolean,
        default: false,
    },

    items: {
        type: Array,
        default: () => [],
    },

})


/*
|--------------------------------------------------------------------------
| EMITS
|--------------------------------------------------------------------------
*/

const emit = defineEmits([
    'close',
    'saved',
])


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const saving        = ref(false)
const errorMessage  = ref('')
const employees     = ref([])

const form = reactive({
    date: '',
    requestedBy: '',
    purpose: '',
    notes: '',
    items: [],
})


/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

const canSubmit = computed(() => {

    if (
        !form.date ||
        !form.purpose
    ) {
        return false
    }

    if (!form.items.length) {
        return false
    }

    return form.items.every((row) => {

        const product =
            getProduct(row.productId)

        if (!product) {
            return false
        }

        const quantity =
            Number(row.quantity)

        if (
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {
            return false
        }

        const stock =
            Number(
                getStock(row.productId)
            )

        return quantity <= stock
    })

})


/*
|--------------------------------------------------------------------------
| WATCH OPEN
|--------------------------------------------------------------------------
*/

watch(
    () => props.show,
    async (value) => {

        if (value) {
            resetForm()
        }

        await Promise.all([
            loadEmployee(),
        ])

    }
)


/*
|--------------------------------------------------------------------------
| RESET
|--------------------------------------------------------------------------
*/

function resetForm() {

    errorMessage.value = ''

    form.date =
        new Date()
            .toISOString()
            .slice(0, 10)

    form.requestedBy = ''

    form.purpose = ''

    form.notes = ''

    form.items = [
        createEmptyItem(),
    ]

}


/*
|--------------------------------------------------------------------------
| ITEM
|--------------------------------------------------------------------------
*/

function createEmptyItem() {

    return {
        key:
            Date.now() +
            Math.random(),

        productId: '',

        quantity: 1,
    }

}


function addItem() {

    form.items.push(
        createEmptyItem()
    )

}


function removeItem(index) {

    if (
        form.items.length === 1
    ) {
        return
    }

    form.items.splice(
        index,
        1
    )

}


function getProduct(productId) {

    return props.items.find(
        (item) =>
            String(item.id) ===
            String(productId)
    )

}


function availableItems(currentId) {

    const selectedIds =
        form.items
            .map(
                (row) =>
                    String(
                        row.productId
                    )
            )
            .filter(
                (id) =>
                    id &&
                    id !==
                        String(currentId)
            )

    return props.items.filter(
        (item) =>
            !selectedIds.includes(
                String(item.id)
            )
    )

}


/*
|--------------------------------------------------------------------------
| STOCK
|--------------------------------------------------------------------------
*/

function getStock(productId) {

    const product =
        getProduct(productId)

    if (!product) {
        return 0
    }

    return Number(
        product.stock ??
        product.current_stock ??
        product.stock_quantity ??
        0
    )

}


function getUnitName(productId) {

    const product =
        getProduct(productId)

    if (!product) {
        return ''
    }

    return (
        product?.unit?.symbol ||
        product?.unit?.name ||
        product?.uom ||
        ''
    )

}


/*
|--------------------------------------------------------------------------
| EMPLOYEE
|--------------------------------------------------------------------------
*/
async function loadEmployee() {
    try {
        const response = await erpApi.master.employees.list({
            is_active   : true,
        })

        const data = response?.data ?? response
        employees.value = Array.isArray(data)
            ? data
            : data?.data ?? []
    } catch (error) {
        console.error('Gagal memuat karyawan:', error)
        employees.value = []
    }
}


/*
|--------------------------------------------------------------------------
| SUBMIT
|--------------------------------------------------------------------------
*/

async function submit() {

    if (
        !canSubmit.value ||
        saving.value
    ) {
        return
    }

    saving.value = true

    errorMessage.value = ''

    try {

        const payload = {

            issue_date:
                form.date,

            warehouse_id:
                1,

            requested_by:
                form.requestedBy ||
                null,

            purpose:
                form.purpose,

            notes:
                form.notes ||
                null,

            items:
                form.items.map(
                    (row) => {

                        const product =
                            getProduct(
                                row.productId
                            )

                        return {

                            product_id:
                                product.id,

                            unit_id:
                                product?.unit_id ||
                                product?.unit?.id ||
                                null,

                            requested_quantity:
                                Number(
                                    row.quantity
                                ),

                            issued_quantity:
                                0,

                        }

                    }
                ),

        }


        const response =
            await erpApi.inventory.issues.create(
                payload
            )


        const issue =
            response?.data?.data ||
            response?.data ||
            null


        if (!issue?.id) {

            throw new Error(
                'Pengeluaran berhasil dibuat tetapi ID tidak ditemukan.'
            )

        }


        emit(
            'saved',
            issue
        )


    } catch (error) {

        console.error(
            'Gagal membuat Stock Issue:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            error?.message ||
            'Pengeluaran barang gagal dibuat.'

    } finally {

        saving.value = false

    }

}


/*
|--------------------------------------------------------------------------
| CLOSE
|--------------------------------------------------------------------------
*/

function close() {

    if (saving.value) {
        return
    }

    emit('close')

}
</script>