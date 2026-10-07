<template>
    <Transition name="modal">
        <div
            v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
            @click.self="close"
        >
            <div
                class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div
                    class="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6"
                >
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">
                            Buat Purchase Request
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Buat permintaan kebutuhan pembelian baru.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="close"
                        class="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <!-- Body -->
                <div class="flex-1 overflow-y-auto p-5 sm:p-6">
                    <!-- Informasi PR -->
                    <div class="grid gap-5 sm:grid-cols-2">
                        <!-- Tipe Produk -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Tipe Pengadaan
                            </label>

                            <select
                                v-model="form.productTypeId"
                                @change="handleProductTypeChange"
                                :disabled="saving || loadingTypes"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                            >
                                <option :value="null">
                                    {{
                                        loadingTypes
                                            ? 'Memuat tipe...'
                                            : 'Pilih tipe pengadaan'
                                    }}
                                </option>

                                <option
                                    v-for="type in productTypes"
                                    :key="type.id"
                                    :value="type.id"
                                >
                                    {{ type.name }}
                                    <template v-if="type.code">
                                        ({{ type.code }})
                                    </template>
                                </option>
                            </select>

                            <p class="mt-1 text-xs text-gray-400">
                                Diambil dari Master Product Type.
                            </p>
                        </div>

                        <!-- Tanggal -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Tanggal Permintaan
                            </label>

                            <input
                                v-model="form.requestDate"
                                type="date"
                                :disabled="saving"
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                            />
                        </div>

                        <!-- Nomor PR -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Nomor PR
                            </label>

                            <div
                                class="mt-1.5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5"
                            >
                                <span
                                    class="rounded-md bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-600"
                                >
                                    AUTO
                                </span>

                                <span class="text-sm text-gray-500">
                                    Dibuat otomatis saat disimpan
                                </span>
                            </div>

                            <p class="mt-1 text-xs text-gray-400">
                                Nomor PR dibuat oleh server.
                            </p>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <div
                                class="mt-1.5 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5"
                            >
                                <span
                                    class="h-2 w-2 rounded-full bg-gray-400"
                                ></span>

                                <span
                                    class="text-sm font-medium text-gray-600"
                                >
                                    Draft
                                </span>
                            </div>

                            <p class="mt-1 text-xs text-gray-400">
                                PR baru selalu dibuat sebagai draft.
                            </p>
                        </div>

                        <!-- Catatan -->
                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium text-gray-700">
                                Catatan
                            </label>

                            <textarea
                                v-model="form.notes"
                                rows="3"
                                :disabled="saving"
                                placeholder="Catatan atau keterangan kebutuhan..."
                                class="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Items -->
                    <div class="mt-7">
                        <div class="mb-3 flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900">
                                    Barang yang Dibutuhkan
                                </h3>

                                <p class="mt-1 text-xs text-gray-500">
                                    Tentukan produk dan jumlah yang dibutuhkan.
                                </p>
                            </div>

                            <button
                                type="button"
                                @click="addItem"
                                :disabled="saving"
                                class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                + Tambah Barang
                            </button>
                        </div>

                        <div
                            class="overflow-x-auto rounded-xl border border-gray-200"
                        >
                            <table class="w-full min-w-[760px]">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-3 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Produk
                                        </th>

                                        <th
                                            class="w-28 px-3 py-3 text-right text-xs font-semibold text-gray-500"
                                        >
                                            Qty
                                        </th>

                                        <th
                                            class="w-32 px-3 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Satuan
                                        </th>

                                        <th
                                            class="w-64 px-3 py-3 text-left text-xs font-semibold text-gray-500"
                                        >
                                            Catatan
                                        </th>

                                        <th class="w-12 px-3 py-3"></th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-100">
                                    <tr
                                        v-for="(item, index) in form.items"
                                        :key="item.key"
                                    >
                                        <!-- Produk -->
                                        <td class="px-3 py-3">
                                            <select
                                                v-model="item.productId"
                                                @change="syncProduct(item)"
                                                :disabled="saving"
                                                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                                            >
                                                <option :value="null">
                                                    Pilih barang
                                                </option>

                                                <option
                                                    v-for="product in filteredProducts"
                                                    :key="product.id"
                                                    :value="product.id"
                                                >
                                                    {{ product.name }}
                                                    <template
                                                        v-if="product.code"
                                                    >
                                                        —
                                                        {{ product.code }}
                                                    </template>
                                                </option>
                                            </select>

                                            <p
                                                v-if="
                                                    form.productTypeId &&
                                                    !filteredProducts.length
                                                "
                                                class="mt-1 text-xs text-amber-600"
                                            >
                                                Belum ada produk untuk tipe
                                                ini.
                                            </p>
                                        </td>

                                        <!-- Qty -->
                                        <td class="px-3 py-3">
                                            <input
                                                v-model.number="item.quantity"
                                                type="number"
                                                min="0.001"
                                                step="0.001"
                                                :disabled="saving"
                                                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                                            />
                                        </td>

                                        <!-- Unit -->
                                        <td class="px-3 py-3">
                                            <div
                                                class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                                            >
                                                {{
                                                    item.unitName ||
                                                    '—'
                                                }}
                                            </div>
                                        </td>

                                        <!-- Notes -->
                                        <td class="px-3 py-3">
                                            <input
                                                v-model="item.notes"
                                                type="text"
                                                :disabled="saving"
                                                placeholder="Opsional"
                                                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                                            />
                                        </td>

                                        <!-- Remove -->
                                        <td class="px-3 py-3 text-center">
                                            <button
                                                type="button"
                                                @click="removeItem(index)"
                                                :disabled="
                                                    saving ||
                                                    form.items.length === 1
                                                "
                                                class="text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Error -->
                    <div
                        v-if="errorMessage"
                        class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                    >
                        <div
                            class="flex items-start gap-2 text-sm text-red-700"
                        >
                            <span class="font-semibold">Gagal:</span>

                            <span>{{ errorMessage }}</span>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div
                    class="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6"
                >
                    <button
                        type="button"
                        @click="close"
                        :disabled="saving"
                        class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="save"
                        :disabled="saving"
                        class="rounded-lg bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0047b3] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span v-if="saving">
                            Menyimpan...
                        </span>

                        <span v-else>
                            Simpan Draft
                        </span>
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
    show: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const productTypes      = ref([])
const products          = ref([])
const loadingTypes      = ref(false)
const loadingProducts   = ref(false)
const saving            = ref(false)
const errorMessage      = ref('')

let itemKey = 0

const form = reactive({
    productTypeId: null,

    requestDate: '',

    notes: '',

    items: [],
})

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const filteredProducts = computed(() => {
    if (!form.productTypeId) {
        return products.value
    }

    return products.value.filter(
        product =>
            Number(product.type_id) ===
            Number(form.productTypeId)
    )
})

/*
|--------------------------------------------------------------------------
| Watch Modal
|--------------------------------------------------------------------------
*/

watch(
    () => props.show,
    async (value) => {
        if (!value) {
            return
        }

        reset()

        await Promise.all([
            loadProductTypes(),
            loadProducts(),
        ])
    }
)

/*
|--------------------------------------------------------------------------
| Load Product Types
|--------------------------------------------------------------------------
*/

async function loadProductTypes() {
    loadingTypes.value = true
    errorMessage.value = ''

    try {
        const response =
            await erpApi.master.productTypes.list({
                is_active: true,
            })

        productTypes.value =
            response?.data?.data || []
    } catch (error) {
        console.error(error)

        errorMessage.value =
            getApiError(error) ||
            'Gagal memuat Product Type.'
    } finally {
        loadingTypes.value = false
    }
}

async function loadProducts() {
    loadingProducts.value = true

    try {
        const response =
            await erpApi.master.products.list({
                is_active: true,
            })

        products.value =
            response?.data?.data || []
    } catch (error) {
        console.error(error)

        errorMessage.value =
            getApiError(error) ||
            'Gagal memuat produk.'
    } finally {
        loadingProducts.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Reset
|--------------------------------------------------------------------------
*/

function reset() {
    errorMessage.value = ''

    form.productTypeId = null

    form.requestDate =
        new Date()
            .toISOString()
            .slice(0, 10)

    form.notes = ''

    form.items = [
        createItem(),
    ]
}

/*
|--------------------------------------------------------------------------
| Item
|--------------------------------------------------------------------------
*/

function createItem() {
    itemKey += 1

    return {
        key: itemKey,

        productId: null,

        productName: '',

        quantity: 1,

        unitId: null,

        unitName: '',

        notes: '',
    }
}

function addItem() {
    form.items.push(
        createItem()
    )
}

function removeItem(index) {
    if (form.items.length === 1) {
        return
    }

    form.items.splice(index, 1)
}

/*
|--------------------------------------------------------------------------
| Product Type
|--------------------------------------------------------------------------
*/

function handleProductTypeChange() {
    /*
     * Ketika tipe berubah, produk yang sudah dipilih
     * dan tidak sesuai tipe akan dikosongkan.
     */

    form.items.forEach((item) => {
        if (!item.productId) {
            return
        }

        const product =
            props.products.find(
                (product) =>
                    product.id === item.productId
            )

        if (!product) {
            return
        }

        const typeId =
            product.type_id ??
            product.product_type_id ??
            product.type?.id ??
            null

        if (
            Number(typeId) !==
            Number(form.productTypeId)
        ) {
            item.productId = null
            item.productName = ''
            item.unitId = null
            item.unitName = ''
        }
    })
}

/*
|--------------------------------------------------------------------------
| Product
|--------------------------------------------------------------------------
*/

function syncProduct(item) {
    const product = products.value.find(
        product => Number(product.id) === Number(item.productId)
    )

    if (!product) {
        item.unitId = null
        return
    }

    item.unitId =
        product.unit_id ??
        product.unit?.id ??
        null
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validate() {
    if (!form.productTypeId) {
        return 'Tipe pengadaan wajib dipilih.'
    }

    if (!form.requestDate) {
        return 'Tanggal permintaan wajib diisi.'
    }

    const validItems =
        form.items.filter(
            (item) =>
                item.productId &&
                Number(item.quantity) > 0
        )

    if (!validItems.length) {
        return 'Minimal tambahkan satu barang.'
    }

    for (const item of validItems) {
        if (!item.unitId) {
            return `Satuan untuk ${item.productName || 'produk'} belum tersedia.`
        }
    }

    return null
}

/*
|--------------------------------------------------------------------------
| Save
|--------------------------------------------------------------------------
*/

async function save() {
    errorMessage.value = ''

    const validationError =
        validate()

    if (validationError) {
        errorMessage.value =
            validationError

        return
    }

    saving.value = true

    try {
        const payload = {
            product_type_id:
                form.productTypeId,

            request_date:
                form.requestDate,

            status: 'draft',

            notes:
                form.notes.trim() || null,

            items:
                form.items
                    .filter(
                        (item) =>
                            item.productId &&
                            Number(item.quantity) > 0
                    )
                    .map((item) => ({
                        product_id:
                            item.productId,

                        quantity:
                            Number(item.quantity),

                        unit_id:
                            item.unitId,

                        notes:
                            item.notes.trim() ||
                            null,
                    })),
        }

        const response =
            await erpApi.purchases.requests.create(
                payload
            )

        const purchaseRequest =
            response?.data?.data

        emit(
            'saved',
            purchaseRequest
        )
    } catch (error) {
        console.error(error)

        errorMessage.value =
            getApiError(error) ||
            'Gagal membuat Purchase Request.'
    } finally {
        saving.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Close
|--------------------------------------------------------------------------
*/

function close() {
    if (saving.value) {
        return
    }

    emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
