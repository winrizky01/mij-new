<template>
    <div class="space-y-6">

        <!-- HEADER -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-slate-900">
                    Produk / Barang
                </h1>

                <p class="mt-1 text-sm text-slate-500">
                    Kelola master produk, barang, jasa, dan aset.
                </p>
            </div>

            <button
                type="button"
                @click="openCreate"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#118fbe]"
            >
                <PlusIcon class="h-5 w-5" />
                Tambah Produk
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <!-- TOTAL -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-slate-500">
                            Total Produk
                        </p>

                        <p class="mt-2 text-2xl font-bold text-slate-900">
                            {{ summary.total }}
                        </p>
                    </div>

                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100"
                    >
                        <PackageIcon class="h-5 w-5 text-slate-600" />
                    </div>
                </div>
            </div>

            <!-- ACTIVE -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-slate-500">
                            Aktif
                        </p>

                        <p class="mt-2 text-2xl font-bold text-slate-900">
                            {{ summary.active }}
                        </p>
                    </div>

                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50"
                    >
                        <CheckCircleIcon
                            class="h-5 w-5 text-emerald-600"
                        />
                    </div>
                </div>
            </div>

            <!-- INACTIVE -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-slate-500">
                            Tidak Aktif
                        </p>

                        <p class="mt-2 text-2xl font-bold text-slate-900">
                            {{ summary.inactive }}
                        </p>
                    </div>

                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100"
                    >
                        <CircleOffIcon class="h-5 w-5 text-slate-500" />
                    </div>
                </div>
            </div>

            <!-- TRACK STOCK -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-slate-500">
                            Track Stok
                        </p>

                        <p class="mt-2 text-2xl font-bold text-slate-900">
                            {{ summary.trackStock }}
                        </p>
                    </div>

                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50"
                    >
                        <BoxesIcon class="h-5 w-5 text-[#14a2d8]" />
                    </div>
                </div>
            </div>

        </div>

        <!-- FILTER -->
        <div
            class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">

                <!-- SEARCH -->
                <div class="relative xl:col-span-2">
                    <SearchIcon
                        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        v-model="filters.search"
                        type="text"
                        placeholder="Cari kode, nama, merk, barcode..."
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#14a2d8] focus:bg-white focus:ring-2 focus:ring-[#14a2d8]/10"
                    />
                </div>

                <!-- TYPE -->
                <select
                    v-model="filters.typeId"
                    class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#14a2d8] focus:bg-white focus:ring-2 focus:ring-[#14a2d8]/10"
                >
                    <option value="">
                        Semua Type
                    </option>

                    <option
                        v-for="type in productTypes"
                        :key="type.id"
                        :value="type.id"
                    >
                        {{ type.name }}
                    </option>
                </select>

                <!-- CATEGORY -->
                <select
                    v-model="filters.categoryId"
                    class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#14a2d8] focus:bg-white focus:ring-2 focus:ring-[#14a2d8]/10"
                >
                    <option value="">
                        Semua Kategori
                    </option>

                    <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                    >
                        {{ category.name }}
                    </option>
                </select>

                <!-- STATUS -->
                <select
                    v-model="filters.status"
                    class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#14a2d8] focus:bg-white focus:ring-2 focus:ring-[#14a2d8]/10"
                >
                    <option value="">
                        Semua Status
                    </option>

                    <option value="active">
                        Aktif
                    </option>

                    <option value="inactive">
                        Tidak Aktif
                    </option>
                </select>

            </div>
        </div>

        <!-- TABLE -->
        <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

            <!-- TABLE HEADER -->
            <div
                class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h2 class="font-semibold text-slate-900">
                        Daftar Produk
                    </h2>

                    <p class="mt-0.5 text-xs text-slate-500">
                        {{ filteredProducts.length }} produk ditampilkan
                    </p>
                </div>

                <button
                    type="button"
                    @click="resetFilters"
                    class="text-sm font-medium text-slate-500 transition hover:text-[#14a2d8]"
                >
                    Reset Filter
                </button>
            </div>

            <!-- DESKTOP TABLE -->
            <div class="hidden overflow-x-auto lg:block">
                <table class="min-w-full">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50/70">
                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Produk
                            </th>

                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Type
                            </th>

                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Kategori
                            </th>

                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Satuan
                            </th>

                            <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Harga Beli
                            </th>

                            <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Harga Jual
                            </th>

                            <th class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Stok
                            </th>

                            <th class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>

                            <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">

                        <tr
                            v-for="product in filteredProducts"
                            :key="product.id"
                            class="transition hover:bg-slate-50/70"
                        >

                            <!-- PRODUCT -->
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">

                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50"
                                    >
                                        <PackageIcon
                                            class="h-5 w-5 text-[#14a2d8]"
                                        />
                                    </div>

                                    <div class="min-w-0">
                                        <p class="truncate font-semibold text-slate-800">
                                            {{ product.name }}
                                        </p>

                                        <p class="mt-0.5 text-xs text-slate-400">
                                            {{ product.code }}

                                            <span
                                                v-if="product.brand"
                                            >
                                                · {{ product.brand }}
                                            </span>
                                        </p>
                                    </div>

                                </div>
                            </td>

                            <!-- TYPE -->
                            <td class="px-5 py-4">
                                <span class="text-sm text-slate-600">
                                    {{ product.type?.name || '-' }}
                                </span>
                            </td>

                            <!-- CATEGORY -->
                            <td class="px-5 py-4">
                                <span class="text-sm text-slate-600">
                                    {{ product.category?.name || '-' }}
                                </span>
                            </td>

                            <!-- UNIT -->
                            <td class="px-5 py-4">
                                <span
                                    class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                                >
                                    {{ product.unit?.code || '-' }}
                                </span>
                            </td>

                            <!-- PURCHASE -->
                            <td class="px-5 py-4 text-right">
                                <span class="text-sm font-medium text-slate-700">
                                    {{ formatCurrency(product.purchase_price) }}
                                </span>
                            </td>

                            <!-- SELLING -->
                            <td class="px-5 py-4 text-right">
                                <span class="text-sm font-medium text-slate-700">
                                    {{ formatCurrency(product.selling_price) }}
                                </span>
                            </td>

                            <!-- STOCK -->
                            <td class="px-5 py-4 text-center">
                                <span
                                    v-if="product.track_stock"
                                    class="text-sm text-slate-500"
                                >
                                    -
                                </span>

                                <span
                                    v-else
                                    class="text-xs text-slate-400"
                                >
                                    Tidak ditrack
                                </span>
                            </td>

                            <!-- STATUS -->
                            <td class="px-5 py-4 text-center">
                                <span
                                    :class="product.is_active
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-slate-100 text-slate-500'"
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                                >
                                    <span
                                        :class="product.is_active
                                            ? 'bg-emerald-500'
                                            : 'bg-slate-400'"
                                        class="h-1.5 w-1.5 rounded-full"
                                    ></span>

                                    {{
                                        product.is_active
                                            ? 'Aktif'
                                            : 'Tidak Aktif'
                                    }}
                                </span>
                            </td>

                            <!-- ACTION -->
                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-1">

                                    <button
                                        type="button"
                                        @click="openEdit(product)"
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-[#14a2d8]"
                                        title="Edit"
                                    >
                                        <PencilIcon class="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        @click="deleteProduct(product)"
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                        title="Hapus"
                                    >
                                        <Trash2Icon class="h-4 w-4" />
                                    </button>

                                </div>
                            </td>

                        </tr>

                        <!-- EMPTY -->
                        <tr v-if="filteredProducts.length === 0">
                            <td
                                colspan="9"
                                class="px-5 py-16 text-center"
                            >
                                <div
                                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100"
                                >
                                    <PackageOpenIcon
                                        class="h-6 w-6 text-slate-400"
                                    />
                                </div>

                                <p class="mt-3 font-medium text-slate-700">
                                    Produk tidak ditemukan
                                </p>

                                <p class="mt-1 text-sm text-slate-400">
                                    Coba ubah pencarian atau filter.
                                </p>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- MOBILE -->
            <div class="divide-y divide-slate-100 lg:hidden">

                <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    class="p-4"
                >
                    <div class="flex items-start justify-between gap-3">

                        <div class="flex min-w-0 gap-3">

                            <div
                                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50"
                            >
                                <PackageIcon
                                    class="h-5 w-5 text-[#14a2d8]"
                                />
                            </div>

                            <div class="min-w-0">
                                <p class="font-semibold text-slate-800">
                                    {{ product.name }}
                                </p>

                                <p class="mt-0.5 text-xs text-slate-400">
                                    {{ product.code }}
                                </p>
                            </div>

                        </div>

                        <span
                            :class="product.is_active
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'"
                            class="shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold"
                        >
                            {{
                                product.is_active
                                    ? 'Aktif'
                                    : 'Tidak Aktif'
                            }}
                        </span>

                    </div>

                    <div class="mt-4 grid grid-cols-2 gap-3">

                        <div>
                            <p class="text-xs text-slate-400">
                                Type
                            </p>

                            <p class="mt-1 text-sm font-medium text-slate-700">
                                {{ product.type?.name || '-' }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-slate-400">
                                Kategori
                            </p>

                            <p class="mt-1 text-sm font-medium text-slate-700">
                                {{ product.category?.name || '-' }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-slate-400">
                                Satuan
                            </p>

                            <p class="mt-1 text-sm font-medium text-slate-700">
                                {{ product.unit?.code || '-' }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs text-slate-400">
                                Harga Jual
                            </p>

                            <p class="mt-1 text-sm font-semibold text-slate-800">
                                {{ formatCurrency(product.selling_price) }}
                            </p>
                        </div>

                    </div>

                    <div class="mt-4 flex justify-end gap-2">

                        <button
                            type="button"
                            @click="openEdit(product)"
                            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            <PencilIcon class="h-3.5 w-3.5" />
                            Edit
                        </button>

                        <button
                            type="button"
                            @click="deleteProduct(product)"
                            class="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                            <Trash2Icon class="h-3.5 w-3.5" />
                            Hapus
                        </button>

                    </div>
                </div>

                <div
                    v-if="filteredProducts.length === 0"
                    class="px-5 py-16 text-center"
                >
                    <PackageOpenIcon
                        class="mx-auto h-8 w-8 text-slate-300"
                    />

                    <p class="mt-3 text-sm font-medium text-slate-600">
                        Produk tidak ditemukan
                    </p>
                </div>

            </div>

        </div>

        <!-- MODAL -->
        <ProductModal
            v-if="showModal"
            :product="selectedProduct"
            :product-types="productTypes"
            :categories="categories"
            :units="units"
            @close="closeModal"
            @saved="handleSaved"
        />

    </div>
</template>

<script setup>
import {
    computed,
    ref,
} from 'vue'

import {
    PlusIcon,
    SearchIcon,
    PackageIcon,
    PackageOpenIcon,
    BoxesIcon,
    CheckCircleIcon,
    CircleOffIcon,
    PencilIcon,
    Trash2Icon,
} from 'lucide-vue-next'

import ProductModal from '../../components/erp/product/ProductModal.vue'


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const showModal = ref(false)

const selectedProduct = ref(null)

const products = ref([])

const productTypes = ref([])

const categories = ref([])

const units = ref([])

const filters = ref({
    search: '',
    typeId: '',
    categoryId: '',
    status: '',
})


/*
|--------------------------------------------------------------------------
| SUMMARY
|--------------------------------------------------------------------------
*/

const summary = computed(() => {
    const list = products.value

    return {
        total: list.length,

        active: list.filter(
            item => item.is_active
        ).length,

        inactive: list.filter(
            item => !item.is_active
        ).length,

        trackStock: list.filter(
            item => item.track_stock
        ).length,
    }
})


/*
|--------------------------------------------------------------------------
| FILTER
|--------------------------------------------------------------------------
*/

const filteredProducts = computed(() => {

    const search =
        filters.value.search
            .trim()
            .toLowerCase()

    return products.value.filter(product => {

        const matchSearch =
            !search ||
            product.code
                ?.toLowerCase()
                .includes(search) ||
            product.name
                ?.toLowerCase()
                .includes(search) ||
            product.brand
                ?.toLowerCase()
                .includes(search) ||
            product.barcode
                ?.toLowerCase()
                .includes(search)

        const matchType =
            !filters.value.typeId ||
            String(product.type_id) ===
                String(filters.value.typeId)

        const matchCategory =
            !filters.value.categoryId ||
            String(product.category_id) ===
                String(filters.value.categoryId)

        const matchStatus =
            !filters.value.status ||
            (
                filters.value.status === 'active'
                    ? product.is_active
                    : !product.is_active
            )

        return (
            matchSearch &&
            matchType &&
            matchCategory &&
            matchStatus
        )
    })
})


/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

function openCreate() {
    selectedProduct.value = null
    showModal.value = true
}

function openEdit(product) {
    selectedProduct.value = product
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    selectedProduct.value = null
}

function handleSaved(product) {
    // Nanti sambungkan dengan reload API.
    console.log('Product saved:', product)

    closeModal()
}

function deleteProduct(product) {
    // Nanti sambungkan ke API + confirmation.
    console.log('Delete:', product)
}

function resetFilters() {
    filters.value = {
        search: '',
        typeId: '',
        categoryId: '',
        status: '',
    }
}


/*
|--------------------------------------------------------------------------
| FORMAT
|--------------------------------------------------------------------------
*/

function formatCurrency(value) {
    const number = Number(value || 0)

    return new Intl.NumberFormat(
        'id-ID',
        {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }
    ).format(number)
}
</script>