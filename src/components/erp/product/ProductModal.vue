<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        @click.self="close"
    >
        <div
            class="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
            <!-- HEADER -->
            <div
                class="flex items-start justify-between border-b border-slate-200 px-6 py-5"
            >
                <div>
                    <h2 class="text-lg font-bold text-slate-900">
                        {{ isEdit ? 'Edit Produk' : 'Tambah Produk' }}
                    </h2>

                    <p class="mt-1 text-sm text-slate-500">
                        {{
                            isEdit
                                ? 'Perbarui informasi produk.'
                                : 'Tambahkan produk baru ke master data.'
                        }}
                    </p>
                </div>

                <button
                    type="button"
                    @click="close"
                    class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                    <XIcon class="h-5 w-5" />
                </button>
            </div>

            <!-- BODY -->
            <form
                class="overflow-y-auto"
                @submit.prevent="submit"
            >
                <div class="space-y-6 px-6 py-6">

                    <!-- IDENTITAS PRODUK -->
                    <section>
                        <div class="mb-4">
                            <h3 class="text-sm font-semibold text-slate-800">
                                Identitas Produk
                            </h3>

                            <p class="mt-1 text-xs text-slate-400">
                                Informasi utama produk.
                            </p>
                        </div>

                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <!-- CODE -->
                            <div>
                                <label class="form-label">
                                    Kode Produk
                                </label>

                                <input
                                    v-model="form.code"
                                    type="text"
                                    class="form-input"
                                    placeholder="Generated automatically if left empty"
                                    :disabled="saving"
                                />
                            </div>

                            <!-- NAME -->
                            <div>
                                <label class="form-label">
                                    Nama Produk
                                    <span class="text-red-500">*</span>
                                </label>

                                <input
                                    v-model="form.name"
                                    type="text"
                                    class="form-input"
                                    placeholder="Nama barang / produk"
                                    :disabled="saving"
                                />

                                <p
                                    v-if="errors.name"
                                    class="form-error"
                                >
                                    {{ errors.name }}
                                </p>
                            </div>

                            <!-- TYPE -->
                            <div>
                                <div class="mb-1.5 flex items-center justify-between">
                                    <label class="form-label mb-0">
                                        Tipe Produk
                                    </label>

                                    <button
                                        type="button"
                                        class="text-xs font-semibold text-[#0052cc] hover:text-[#003f9e]"
                                        @click="openCreateProductType"
                                    >
                                        + Kelola Tipe Produk
                                    </button>
                                </div>

                                <select
                                    v-model="form.type_id"
                                    class="form-input"
                                    :disabled="saving"
                                >
                                    <option value="">
                                        Pilih Type
                                    </option>

                                    <option
                                        v-for="type in localProductTypes"
                                        :key="type.id"
                                        :value="type.id"
                                    >
                                        {{ type.name }}
                                    </option>
                                </select>

                                <p
                                    v-if="errors.type_id"
                                    class="form-error"
                                >
                                    {{ errors.type_id }}
                                </p>
                            </div>

                            <!-- CATEGORY -->
                            <div>
                                <div class="mb-1.5 flex items-center justify-between">
                                    <label class="form-label mb-0">
                                        Kategori
                                    </label>

                                    <button
                                        type="button"
                                        class="text-xs font-semibold text-[#0052cc] hover:text-[#003f9e]"
                                        @click="openCreateProductCategory"
                                    >
                                        + Kelola Kategori
                                    </button>
                                </div>

                                <select
                                    v-model="form.category_id"
                                    class="form-input"
                                    :disabled="saving"
                                >
                                    <option value="">
                                        Pilih Kategori
                                    </option>

                                    <option
                                        v-for="category in localCategories"
                                        :key="category.id"
                                        :value="category.id"
                                    >
                                        {{ category.name }}
                                    </option>
                                </select>

                                <p
                                    v-if="errors.category_id"
                                    class="form-error"
                                >
                                    {{ errors.category_id }}
                                </p>
                            </div>

                            <!-- UNIT -->
                            <div>
                                <label class="form-label">
                                    Satuan Utama
                                </label>

                                <select
                                    v-model="form.unit_id"
                                    class="form-input"
                                    :disabled="saving"
                                >
                                    <option value="">
                                        Pilih Satuan
                                    </option>

                                    <option
                                        v-for="unit in units"
                                        :key="unit.id"
                                        :value="unit.id"
                                    >
                                        {{ unit.name }}
                                        <template v-if="unit.code">
                                            ({{ unit.code }})
                                        </template>
                                    </option>
                                </select>

                                <p
                                    v-if="errors.unit_id"
                                    class="form-error"
                                >
                                    {{ errors.unit_id }}
                                </p>
                            </div>

                            <!-- BRAND -->
                            <div>
                                <label class="form-label">
                                    Merk
                                </label>

                                <input
                                    v-model="form.brand"
                                    type="text"
                                    class="form-input"
                                    placeholder="Contoh: Bosch, Philips, TOTO"
                                    :disabled="saving"
                                />

                                <p
                                    v-if="errors.brand"
                                    class="form-error"
                                >
                                    {{ errors.brand }}
                                </p>
                            </div>

                            <!-- BARCODE -->
                            <div class="md:col-span-2">
                                <label class="form-label">
                                    Barcode
                                </label>

                                <input
                                    v-model="form.barcode"
                                    type="text"
                                    class="form-input"
                                    placeholder="Scan / masukkan barcode"
                                    :disabled="saving"
                                />

                                <p
                                    v-if="errors.barcode"
                                    class="form-error"
                                >
                                    {{ errors.barcode }}
                                </p>
                            </div>

                        </div>
                    </section>

                    <!-- HARGA -->
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <!-- PURCHASE -->
                        <div>
                            <label class="form-label">
                                Harga Beli
                            </label>

                            <div
                                class="flex overflow-hidden rounded-lg border border-slate-300 bg-white
                                    focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100"
                            >
                                <div
                                    class="flex items-center border-r border-slate-200 bg-slate-50 px-3
                                        text-sm font-medium text-slate-500"
                                >
                                    Rp
                                </div>

                                <input
                                    v-model="form.purchase_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5
                                        text-sm text-slate-700 outline-none focus:ring-0"
                                    placeholder="0"
                                    :disabled="saving"
                                />
                            </div>

                            <p
                                v-if="errors.purchase_price"
                                class="form-error"
                            >
                                {{ errors.purchase_price }}
                            </p>
                        </div>

                        <!-- SELLING -->
                        <div>
                            <label class="form-label">
                                Harga Jual
                            </label>

                            <div
                                class="flex overflow-hidden rounded-lg border border-slate-300 bg-white
                                    focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100"
                            >
                                <div
                                    class="flex items-center border-r border-slate-200 bg-slate-50 px-3
                                        text-sm font-medium text-slate-500"
                                >
                                    Rp
                                </div>

                                <input
                                    v-model="form.selling_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5
                                        text-sm text-slate-700 outline-none focus:ring-0"
                                    placeholder="0"
                                    :disabled="saving"
                                />
                            </div>

                            <p
                                v-if="errors.selling_price"
                                class="form-error"
                            >
                                {{ errors.selling_price }}
                            </p>
                        </div>

                    </div>

                    <!-- INVENTORY -->
                    <section
                        class="border-t border-slate-100 pt-6"
                    >
                        <div class="mb-4">
                            <h3 class="text-sm font-semibold text-slate-800">
                                Inventory
                            </h3>

                            <p class="mt-1 text-xs text-slate-400">
                                Pengaturan dasar untuk pengelolaan stok.
                            </p>
                        </div>

                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <!-- MINIMUM STOCK -->
                            <div>
                                <label class="form-label">
                                    Minimum Stok
                                </label>

                                <input
                                    v-model="form.minimum_stock"
                                    type="number"
                                    min="0"
                                    step="0.001"
                                    class="form-input"
                                    placeholder="0"
                                    :disabled="
                                        saving ||
                                        !form.track_stock
                                    "
                                />

                                <p class="mt-1 text-xs text-slate-400">
                                    Digunakan sebagai batas peringatan stok minimum.
                                </p>

                                <p
                                    v-if="errors.minimum_stock"
                                    class="form-error"
                                >
                                    {{ errors.minimum_stock }}
                                </p>
                            </div>

                            <!-- TRACK STOCK -->
                            <div>
                                <label class="form-label">
                                    Pengelolaan Stok
                                </label>

                                <button
                                    type="button"
                                    @click="form.track_stock = !form.track_stock"
                                    :disabled="saving"
                                    class="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300"
                                >
                                    <div>
                                        <p class="text-sm font-medium text-slate-700">
                                            Track Stock
                                        </p>

                                        <p class="mt-0.5 text-xs text-slate-400">
                                            {{
                                                form.track_stock
                                                    ? 'Produk mengikuti saldo inventory.'
                                                    : 'Produk tidak menggunakan inventory.'
                                            }}
                                        </p>
                                    </div>

                                    <span
                                        :class="
                                            form.track_stock
                                                ? 'bg-[#14a2d8]'
                                                : 'bg-slate-300'
                                        "
                                        class="relative h-6 w-11 shrink-0 rounded-full transition"
                                    >
                                        <span
                                            :class="
                                                form.track_stock
                                                    ? 'translate-x-5'
                                                    : 'translate-x-0.5'
                                            "
                                            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition"
                                        ></span>
                                    </span>
                                </button>
                            </div>

                        </div>
                    </section>

                    <!-- DESCRIPTION -->
                    <section
                        class="border-t border-slate-100 pt-6"
                    >
                        <div class="mb-4">
                            <h3 class="text-sm font-semibold text-slate-800">
                                Keterangan
                            </h3>
                        </div>

                        <textarea
                            v-model="form.description"
                            rows="4"
                            class="form-input resize-none"
                            placeholder="Keterangan tambahan mengenai produk..."
                            :disabled="saving"
                        ></textarea>

                        <p
                            v-if="errors.description"
                            class="form-error"
                        >
                            {{ errors.description }}
                        </p>
                    </section>

                    <!-- STATUS -->
                    <section
                        class="border-t border-slate-100 pt-6"
                    >
                        <div
                            class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                            <div>
                                <p class="text-sm font-semibold text-slate-700">
                                    Status Produk
                                </p>

                                <p class="mt-0.5 text-xs text-slate-400">
                                    Produk tidak aktif tidak dapat digunakan
                                    untuk transaksi baru.
                                </p>
                            </div>

                            <button
                                type="button"
                                @click="form.is_active = !form.is_active"
                                :disabled="saving"
                                :class="
                                    form.is_active
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-300'
                                "
                                class="relative h-6 w-11 shrink-0 rounded-full transition"
                            >
                                <span
                                    :class="
                                        form.is_active
                                            ? 'translate-x-5'
                                            : 'translate-x-0.5'
                                    "
                                    class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition"
                                ></span>
                            </button>
                        </div>
                    </section>

                </div>

                <!-- FOOTER -->
                <div
                    class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4"
                >
                    <button
                        type="button"
                        @click="close"
                        :disabled="saving"
                        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        :disabled="saving"
                        class="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#118fbe] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Loader2Icon
                            v-if="saving"
                            class="h-4 w-4 animate-spin"
                        />

                        <SaveIcon
                            v-else
                            class="h-4 w-4"
                        />

                        {{ saving ? 'Menyimpan...' : 'Simpan Produk' }}
                    </button>
                </div>
            </form>
        </div>
    </div>

    <ProductTypeModal
        v-if="showProductTypeModal"
        @close="showProductTypeModal = false"
        @saved="handleProductTypeSaved"
    />

    <ProductCategoryModal
        v-if="showProductCategoryModal"
        @close="showProductCategoryModal = false"
        @saved="handleProductCategorySaved"
    />

</template>

<script setup>
import {
    computed,
    reactive,
    ref,
    watch,
} from 'vue'

import {
    XIcon,
    SaveIcon,
    Loader2Icon,
} from 'lucide-vue-next'

import { erpApi, } from '@/services/api'

import ProductTypeModal from './ProductTypeModal.vue'
import ProductCategoryModal from './ProductCategoryModal.vue'

const props = defineProps({
    product: {
        type: Object,
        default: null,
    },

    productTypes: {
        type: Array,
        default: () => [],
    },

    categories: {
        type: Array,
        default: () => [],
    },

    units: {
        type: Array,
        default: () => [],
    },
})


const emit = defineEmits([
    'close',
    'saved',
])


const saving = ref(false)
const errors = reactive({})
const localProductTypes = ref([])
const localCategories = ref([])

const showProductCategoryModal = ref(false)
function openCreateProductCategory() {
    showProductCategoryModal.value = true
}
async function handleProductCategorySaved(category) {
    showProductCategoryModal.value = false
    await loadCategories()
    if (category?.id) {
        form.category_id = category.id
    }
}
async function loadCategories() {
    try {
        const response =
            await erpApi.master.productCategories.list({
                is_active: true,
            })

        const data =
            response?.data?.data ??
            response?.data ??
            []

        localCategories.value = Array.isArray(data)
            ? data
            : []
    } catch (error) {
        console.error(
            'Gagal reload kategori:',
            error
        )
    }
}

const showProductTypeModal = ref(false)
function openCreateProductType() {
    showProductTypeModal.value = true
}
async function handleProductTypeSaved(type) {
    showProductTypeModal.value = false
    await loadProductTypes()

    if (type?.id) {
        form.type_id = type.id
    }

}
async function loadProductTypes() {
    try {
        const response =
            await erpApi.master.productTypes.list({
                is_active: true,
            })

        const data =
            response?.data?.data ??
            response?.data ??
            []

        localProductTypes.value =
            Array.isArray(data)
                ? data
                : []
    } catch (error) {
        console.error(
            'Gagal reload tipe produk:',
            error
        )
    }
}


const emptyForm = () => ({
    code            : '',
    name            : '',
    category_id     : '',
    type_id         : '',
    unit_id         : '',
    brand           : '',
    barcode         : '',
    description     : '',
    purchase_price  : 0,
    selling_price   : 0,
    minimum_stock   : 0,
    track_stock     : true,
    is_active       : true,
})


const form = reactive(
    emptyForm()
)


const isEdit = computed(
    () => !!props.product?.id
)


function fillForm(product) {

    Object.assign(
        form,
        emptyForm()
    )

    if (!product) {
        return
    }

    Object.assign(
        form,
        {
            code: product.code ?? '',
            name: product.name ?? '',
            category_id: product.category_id ?? '',
            type_id: product.type_id ?? '',
            unit_id: product.unit_id ?? '',
            brand: product.brand ?? '',
            barcode: product.barcode ?? '',
            description: product.description ?? '',
            purchase_price: product.purchase_price ?? 0,
            selling_price: product.selling_price ?? 0,
            minimum_stock: product.minimum_stock ?? 0,
            track_stock: product.track_stock ?? true,
            is_active: product.is_active ?? true,
        }
    )
}


function clearErrors() {
    Object.keys(errors).forEach(
        key => delete errors[key]
    )
}


watch(
    () => props.productTypes,
    value => {
        localProductTypes.value = [...value]
    },
    {
        immediate: true,
    }
)


watch(
    () => props.categories,
    value => {
        localCategories.value = [...value]
    },
    {
        immediate: true,
    }
)


watch(
    () => props.product,
    product => {
        clearErrors()
        fillForm(product)
    },
    {
        immediate: true,
    }
)


function close() {
    if (saving.value) {
        return
    }

    emit('close')
}


function validate() {

    clearErrors()

    if (!form.name.trim()) {
        errors.name = 'Nama produk wajib diisi.'
    }

    return Object.keys(errors).length === 0
}


async function submit() {

    if (!validate()) {
        return
    }

    saving.value = true

    try {

        const payload = {
            code: form.code ? form.code : null,
            name: form.name.trim(),

            category_id:
                form.category_id
                    ? Number(form.category_id)
                    : null,

            type_id:
                form.type_id
                    ? Number(form.type_id)
                    : null,

            unit_id:
                form.unit_id
                    ? Number(form.unit_id)
                    : null,

            brand:
                form.brand.trim() || null,

            barcode:
                form.barcode.trim() || null,

            description:
                form.description.trim() || null,

            purchase_price:
                Number(form.purchase_price || 0),

            selling_price:
                Number(form.selling_price || 0),

            minimum_stock:
                Number(form.minimum_stock || 0),

            track_stock:
                Boolean(form.track_stock),

            is_active:
                Boolean(form.is_active),
        }

        if (isEdit.value) {
            await erpApi.master.products.update(
                props.product.id,
                payload
            )
        } else {
            await erpApi.master.products.create(
                payload
            )
        }

        emit('saved', payload)

    } catch (error) {

        console.error(
            'Gagal menyimpan produk:',
            error
        )

    } finally {

        saving.value = false
    }
}
</script>

<style scoped>
.form-label {
    display: block;
    margin-bottom: 0.375rem;
    color: #334155;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
}

.form-input {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    background-color: #fff;
    padding: 0.625rem 0.875rem;
    color: #334155;
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
}

.form-input::placeholder {
    color: #94a3b8;
}

.form-input:focus {
    border-color: #14a2d8;
    box-shadow: 0 0 0 2px rgb(20 162 216 / 10%);
}

.form-input:disabled {
    cursor: not-allowed;
    background-color: #f8fafc;
    color: #94a3b8;
}

.form-error {
    margin-top: 0.375rem;
    color: #ef4444;
    font-size: 0.75rem;
    line-height: 1rem;
}
</style>