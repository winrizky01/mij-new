<template>
    <Transition name="modal">
        <div
            v-if="show && purchase"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div
                class="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div
                    class="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6"
                >
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">
                            Edit Purchase Request
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ form.requestNumber || '—' }}
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

                <!-- Body -->
                <div class="flex-1 overflow-y-auto p-5 sm:p-6">
                    <!-- Error -->
                    <div
                        v-if="errorMessage"
                        class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {{ errorMessage }}
                    </div>

                    <!-- Header Form -->
                    <div class="grid gap-5 sm:grid-cols-2">
                        <!-- Nomor PR -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Nomor PR
                            </label>

                            <input
                                v-model="form.requestNumber"
                                readonly
                                class="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
                            />
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <input
                                :value="statusLabel(form.status)"
                                readonly
                                class="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
                            />
                        </div>

                        <!-- Tanggal -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Tanggal Permintaan
                            </label>

                            <input
                                v-model="form.requestDate"
                                type="date"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                            />
                        </div>

                        <!-- Requested By -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Diminta Oleh
                            </label>

                            <input
                                :value="requestedByName"
                                readonly
                                class="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
                            />
                        </div>

                        <!-- Catatan -->
                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium text-gray-700">
                                Catatan
                            </label>

                            <textarea
                                v-model="form.notes"
                                rows="3"
                                placeholder="Tambahkan catatan jika diperlukan..."
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Items -->
                    <div class="mt-6">
                        <div class="mb-3 flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900">
                                    Barang
                                </h3>

                                <p class="mt-1 text-xs text-gray-500">
                                    Tentukan barang dan jumlah yang dibutuhkan.
                                </p>
                            </div>

                            <button
                                type="button"
                                @click="addItem"
                                class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                            >
                                + Tambah Barang
                            </button>
                        </div>

                        <div
                            v-if="loadingProducts"
                            class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500"
                        >
                            Memuat daftar produk...
                        </div>

                        <div
                            v-else
                            class="overflow-x-auto rounded-xl border border-gray-200"
                        >
                            <table class="w-full min-w-[700px]">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-3 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Produk
                                        </th>

                                        <th
                                            class="px-3 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Qty
                                        </th>

                                        <th
                                            class="px-3 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Satuan
                                        </th>

                                        <th
                                            class="px-3 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Catatan
                                        </th>

                                        <th
                                            class="w-12 px-3 py-3"
                                        ></th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-100">
                                    <tr
                                        v-for="(item, index) in form.items"
                                        :key="item.key"
                                    >
                                        <!-- Product -->
                                        <td class="px-3 py-3">
                                            <select
                                                v-model="item.productId"
                                                @change="syncProduct(item)"
                                                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option :value="null">
                                                    Pilih barang
                                                </option>

                                                <option
                                                    v-for="product in products"
                                                    :key="product.id"
                                                    :value="product.id"
                                                >
                                                    {{ product.code
                                                        ? `${product.code} - ${product.name}`
                                                        : product.name }}
                                                </option>
                                            </select>
                                        </td>

                                        <!-- Qty -->
                                        <td class="px-3 py-3">
                                            <input
                                                v-model.number="item.quantity"
                                                type="number"
                                                min="0.001"
                                                step="0.001"
                                                class="w-28 rounded-lg border border-gray-300 px-3 py-2 text-right text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </td>

                                        <!-- Unit -->
                                        <td class="px-3 py-3">
                                            <div
                                                class="min-w-[100px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                                            >
                                                {{
                                                    item.unit?.name ||
                                                    item.unit?.code ||
                                                    '—'
                                                }}
                                            </div>
                                        </td>

                                        <!-- Notes -->
                                        <td class="px-3 py-3">
                                            <input
                                                v-model="item.notes"
                                                type="text"
                                                placeholder="Catatan item..."
                                                class="w-full min-w-[180px] rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </td>

                                        <!-- Delete -->
                                        <td class="px-3 py-3 text-center">
                                            <button
                                                type="button"
                                                @click="removeItem(index)"
                                                :disabled="form.items.length === 1"
                                                class="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>

                                    <tr v-if="!form.items.length">
                                        <td
                                            colspan="5"
                                            class="px-4 py-8 text-center text-sm text-gray-400"
                                        >
                                            Belum ada barang.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    class="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end"
                >
                    <button
                        type="button"
                        @click="close"
                        :disabled="saving"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="save(false)"
                        :disabled="saving"
                        class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </button>

                    <button
                        type="button"
                        @click="save(true)"
                        :disabled="saving"
                        class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {{ saving ? 'Memproses...' : 'Ajukan PR' }}
                    </button>
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
    show: Boolean,

    purchase: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

const products = ref([])
const loadingProducts = ref(false)
const saving = ref(false)
const errorMessage = ref('')

let itemKey = 1

const form = reactive({
    id: null,
    requestNumber: '',
    requestDate: '',
    requestedBy: null,
    status: 'draft',
    notes: '',
    items: [],
})

const requestedByName = computed(() => {
    return (
        form.requestedBy?.name ||
        form.requestedBy?.employee_name ||
        'Belum ditentukan'
    )
})

watch(
    () => props.purchase,
    async (purchase) => {
        if (!purchase) {
            resetForm()
            return
        }

        errorMessage.value = ''

        form.id = purchase.id || null

        form.requestNumber =
            purchase.request_number ||
            purchase.requestNumber ||
            ''

        form.requestDate =
            normalizeDate(purchase.request_date) ||
            normalizeDate(purchase.date) ||
            ''

        form.requestedBy =
            purchase.created_by ||
            purchase.createdBy ||
            null

        form.status =
            purchase.status ||
            'draft'

        form.notes =
            purchase.notes ||
            ''

        form.items = (
            purchase.items ||
            []
        ).map((item) => ({
            key: itemKey++,

            id: item.id || null,

            productId:
                item.product_id ||
                item.product?.id ||
                null,

            quantity:
                Number(item.quantity) || 0,

            unitId:
                item.unit_id ||
                item.unit?.id ||
                null,

            unit: item.unit || null,

            notes:
                item.notes ||
                '',
        }))

        if (!form.items.length) {
            addItem()
        }

        await loadProducts()
    },
    {
        immediate: true,
    }
)

async function loadProducts() {
    loadingProducts.value = true

    try {
        const response =
            await erpApi.master.products.list({
                is_active: true,
            })

        products.value =
            response?.data?.data || []

        /*
         * Setelah produk selesai dimuat,
         * sinkronkan ulang unit setiap item.
         */
        form.items.forEach((item) => {
            if (item.productId) {
                syncProduct(item)
            }
        })
    } catch (error) {
        console.error(error)

        errorMessage.value =
            getApiError(error) ||
            'Gagal memuat daftar produk.'
    } finally {
        loadingProducts.value = false
    }
}

function syncProduct(item) {
    const product = products.value.find(
        (product) =>
            Number(product.id) ===
            Number(item.productId)
    )

    if (!product) {
        item.unit = null
        item.unitId = null
        return
    }

    item.unit =
        product.unit ||
        null

    item.unitId =
        product.unit_id ||
        product.unit?.id ||
        null
}

function addItem() {
    form.items.push({
        key: itemKey++,
        id: null,
        productId: null,
        quantity: 1,
        unitId: null,
        unit: null,
        notes: '',
    })
}

function removeItem(index) {
    if (form.items.length <= 1) {
        return
    }

    form.items.splice(index, 1)
}

async function save(submit = false) {
    errorMessage.value = ''

    if (!form.requestDate) {
        errorMessage.value =
            'Tanggal permintaan wajib diisi.'

        return
    }

    const validItems =
        form.items.filter(
            (item) =>
                item.productId &&
                Number(item.quantity) > 0
        )

    if (!validItems.length) {
        errorMessage.value =
            'Minimal tambahkan satu barang dengan jumlah yang valid.'

        return
    }

    if (!form.id) {
        errorMessage.value =
            'ID Purchase Request tidak ditemukan.'

        return
    }

    const payload = {
        requested_by:
            form.requestedBy?.id ||
            (typeof form.requestedBy === 'number'
                ? form.requestedBy
                : null),

        request_date:
            form.requestDate,

        status:
            submit
                ? 'submitted'
                : form.status === 'submitted'
                    ? 'submitted'
                    : 'draft',

        notes:
            form.notes?.trim() || null,

        items:
            validItems.map((item) => ({
                product_id:
                    Number(item.productId),

                quantity:
                    Number(item.quantity),

                unit_id:
                    item.unitId
                        ? Number(item.unitId)
                        : null,

                notes:
                    item.notes?.trim() || null,
            })),
    }

    saving.value = true

    try {
        const response =
            await erpApi.purchases.requests.update(
                form.id,
                payload
            )

        emit(
            'saved',
            response?.data?.data ||
                response?.data
        )
    } catch (error) {
        console.error(error)

        errorMessage.value =
            getApiError(error) ||
            'Gagal memperbarui Purchase Request.'
    } finally {
        saving.value = false
    }
}

function resetForm() {
    form.id = null
    form.requestNumber = ''
    form.requestDate = ''
    form.requestedBy = null
    form.status = 'draft'
    form.notes = ''
    form.items = []
}

function close() {
    if (saving.value) {
        return
    }

    emit('close')
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

function normalizeDate(value) {
    if (!value) {
        return ''
    }

    /*
     * Laravel date / ISO datetime:
     * 2026-10-06
     * 2026-10-06T00:00:00.000000Z
     */
    return String(value).substring(0, 10)
}
</script>