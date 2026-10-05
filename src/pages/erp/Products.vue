<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Produk / Barang
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola master produk dan barang yang digunakan dalam transaksi ERP.
                </p>
            </div>

            <button type="button" @click="openForm()"
                class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]">
                + Tambah Produk
            </button>
        </div>

        <!-- Filters -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="grid gap-3 md:grid-cols-4">
                <!-- Search -->
                <div class="md:col-span-2">
                    <input v-model="search" type="text" placeholder="Cari kode, nama produk..."
                        class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                </div>

                <!-- Category -->
                <select v-model="categoryFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500">
                    <option value="all">
                        Semua Kategori
                    </option>

                    <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                    </option>
                </select>

                <!-- Status -->
                <select v-model="statusFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500">
                    <option value="all">
                        Semua Status
                    </option>

                    <option value="active">
                        Aktif
                    </option>

                    <option value="inactive">
                        Nonaktif
                    </option>
                </select>
            </div>
        </div>

        <!-- Summary -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p class="text-xs text-gray-500">
                    Total Produk
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ products.length }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p class="text-xs text-gray-500">
                    Produk Aktif
                </p>

                <p class="mt-2 text-2xl font-bold text-green-600">
                    {{ activeCount }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p class="text-xs text-gray-500">
                    Produk Nonaktif
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-500">
                    {{ inactiveCount }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p class="text-xs text-gray-500">
                    Stok Menipis
                </p>

                <p class="mt-2 text-2xl font-bold text-red-600">
                    {{ lowStockCount }}
                </p>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full min-w-[1050px] text-left">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Produk
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Kategori
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Satuan
                            </th>

                            <th class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                Harga Beli
                            </th>

                            <th class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                Harga Jual
                            </th>

                            <th class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                Stok
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                                Status
                            </th>

                            <th class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                            <!-- Product -->
                            <td class="px-5 py-4">
                                <div>
                                    <p class="font-semibold text-gray-900">
                                        {{ product.name }}
                                    </p>

                                    <p class="mt-1 text-xs text-gray-500">
                                        {{ product.code }}
                                    </p>
                                </div>
                            </td>

                            <!-- Category -->
                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ product.category }}
                            </td>

                            <!-- Unit -->
                            <td class="px-5 py-4 text-sm text-gray-600">
                                {{ product.unit }}
                            </td>

                            <!-- Purchase -->
                            <td class="px-5 py-4 text-right text-sm text-gray-700">
                                {{ formatCurrency(product.purchasePrice) }}
                            </td>

                            <!-- Sale -->
                            <td class="px-5 py-4 text-right text-sm font-medium text-gray-900">
                                {{ formatCurrency(product.salePrice) }}
                            </td>

                            <!-- Stock -->
                            <td class="px-5 py-4 text-right">
                                <span class="font-semibold" :class="product.stock <= product.minimumStock
                                        ? 'text-red-600'
                                        : 'text-gray-700'
                                    ">
                                    {{ product.stock }}
                                </span>

                                <span class="ml-1 text-xs text-gray-400">
                                    {{ product.unit }}
                                </span>
                            </td>

                            <!-- Status -->
                            <td class="px-5 py-4">
                                <span class="rounded-full px-3 py-1 text-xs font-medium" :class="product.active
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                    ">
                                    {{
                                        product.active
                                            ? 'Aktif'
                                            : 'Nonaktif'
                                    }}
                                </span>
                            </td>

                            <!-- Actions -->
                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <button type="button" @click="openForm(product)"
                                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100">
                                        Edit
                                    </button>

                                    <button type="button" @click="toggleProduct(product)"
                                        class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                                        {{
                                            product.active
                                                ? 'Nonaktifkan'
                                                : 'Aktifkan'
                                        }}
                                    </button>

                                    <button type="button" @click="deleteProduct(product.id)"
                                        class="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50">
                                        Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Empty -->
                        <tr v-if="filteredProducts.length === 0">
                            <td colspan="8" class="px-5 py-14 text-center">
                                <div class="text-4xl">
                                    📦
                                </div>

                                <p class="mt-4 text-sm font-semibold text-gray-900">
                                    Produk tidak ditemukan
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    Coba ubah pencarian atau filter.
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-100 px-5 py-4">
                <p class="text-xs text-gray-500">
                    Menampilkan
                    <span class="font-semibold text-gray-700">
                        {{ filteredProducts.length }}
                    </span>
                    dari
                    <span class="font-semibold text-gray-700">
                        {{ products.length }}
                    </span>
                    produk
                </p>
            </div>
        </div>

        <!-- Create / Edit Modal -->
        <Transition name="modal">
            <div v-if="showForm"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                @click.self="closeForm">
                <div
                    class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <!-- Modal Header -->
                    <div
                        class="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
                        <div>
                            <h2 class="text-lg font-bold text-gray-900">
                                {{
                                    editingProduct
                                        ? 'Edit Produk'
                                        : 'Tambah Produk'
                                }}
                            </h2>

                            <p class="mt-1 text-sm text-gray-500">
                                {{
                                    editingProduct
                                        ? 'Perbarui informasi produk yang dipilih.'
                                        : 'Masukkan informasi master produk baru.'
                                }}
                            </p>
                        </div>

                        <button type="button" @click="closeForm"
                            class="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                            ✕
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                        <div class="grid gap-5 sm:grid-cols-2">

                            <!-- Code -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Kode Produk
                                </label>

                                <input v-model="form.code" type="text" placeholder="PRD-0001"
                                    class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm uppercase outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10" />

                                <p class="mt-1 text-xs text-gray-400">
                                    Kode harus unik.
                                </p>
                            </div>

                            <!-- Name -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Nama Produk
                                </label>

                                <input v-model="form.name" type="text" placeholder="Nama barang"
                                    class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10" />
                            </div>

                            <!-- Category -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Kategori
                                </label>

                                <select v-model="form.category"
                                    class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10">
                                    <option value="">
                                        Pilih kategori
                                    </option>

                                    <option v-for="category in categories" :key="category" :value="category">
                                        {{ category }}
                                    </option>
                                </select>
                            </div>

                            <!-- Unit -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Satuan
                                </label>

                                <select v-model="form.unit"
                                    class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10">
                                    <option value="">
                                        Pilih satuan
                                    </option>

                                    <option v-for="unit in units" :key="unit" :value="unit">
                                        {{ unit }}
                                    </option>
                                </select>
                            </div>

                            <!-- Purchase Price -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Harga Beli
                                </label>

                                <div class="relative mt-1.5">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                        Rp
                                    </span>

                                    <input v-model.number="form.purchasePrice" type="number" min="0"
                                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10" />
                                </div>
                            </div>

                            <!-- Sale Price -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Harga Jual
                                </label>

                                <div class="relative mt-1.5">
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                        Rp
                                    </span>

                                    <input v-model.number="form.salePrice" type="number" min="0"
                                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10" />
                                </div>
                            </div>

                            <!-- Minimum Stock -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Minimum Stok
                                </label>

                                <input v-model.number="form.minimumStock" type="number" min="0"
                                    class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10" />

                                <p class="mt-1 text-xs text-gray-400">
                                    Batas peringatan stok menipis.
                                </p>
                            </div>

                            <!-- Initial Stock -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    Stok Awal
                                </label>

                                <input v-model.number="form.stock" type="number" min="0"
                                    class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10" />

                                <p class="mt-1 text-xs text-gray-400">
                                    Untuk mockup. Nanti stok berasal dari inventory.
                                </p>
                            </div>

                            <!-- Description -->
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-medium text-gray-700">
                                    Keterangan
                                </label>

                                <textarea v-model="form.description" rows="3" placeholder="Keterangan produk..."
                                    class="mt-1.5 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"></textarea>
                            </div>

                            <!-- Status -->
                            <div
                                class="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">
                                        Status Produk
                                    </p>

                                    <p class="mt-1 text-xs text-gray-500">
                                        Produk nonaktif tidak dapat digunakan pada
                                        transaksi baru.
                                    </p>
                                </div>

                                <button type="button" @click="form.active = !form.active"
                                    class="relative h-6 w-11 shrink-0 rounded-full transition" :class="form.active
                                            ? 'bg-[#0052cc]'
                                            : 'bg-gray-300'
                                        ">
                                    <span class="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition"
                                        :class="form.active
                                                ? 'left-6'
                                                : 'left-1'
                                            "></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div
                        class="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button type="button" @click="closeForm"
                            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>

                        <button type="button" @click="saveProduct"
                            class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]">
                            {{
                                editingProduct
                                    ? 'Simpan Perubahan'
                                    : 'Tambah Produk'
                            }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const search = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')

const showForm = ref(false)
const editingProduct = ref(null)

const categories = [
    'Material',
    'Elektrikal',
    'Sanitary',
    'Hardware',
    'Tools',
    'Lainnya',
]

const units = [
    'PCS',
    'SET',
    'BOX',
    'PACK',
    'UNIT',
    'METER',
    'KG',
    'LITER',
]

const products = ref([
    {
        id: 1,
        code: 'PRD-0001',
        name: 'Saklar Single',
        category: 'Elektrikal',
        unit: 'PCS',
        purchasePrice: 15000,
        salePrice: 22000,
        stock: 25,
        minimumStock: 10,
        description: 'Saklar single untuk kebutuhan instalasi listrik.',
        active: true,
    },
    {
        id: 2,
        code: 'PRD-0002',
        name: 'Stop Kontak',
        category: 'Elektrikal',
        unit: 'PCS',
        purchasePrice: 18000,
        salePrice: 27000,
        stock: 8,
        minimumStock: 10,
        description: 'Stop kontak dinding standar.',
        active: true,
    },
    {
        id: 3,
        code: 'PRD-0003',
        name: 'Pipa PVC 1/2"',
        category: 'Material',
        unit: 'METER',
        purchasePrice: 12500,
        salePrice: 18000,
        stock: 4,
        minimumStock: 10,
        description: 'Pipa PVC untuk kebutuhan instalasi air.',
        active: true,
    },
    {
        id: 4,
        code: 'PRD-0004',
        name: 'Kran Air',
        category: 'Sanitary',
        unit: 'PCS',
        purchasePrice: 35000,
        salePrice: 50000,
        stock: 18,
        minimumStock: 5,
        description: 'Kran air untuk kebutuhan sanitasi.',
        active: true,
    },
    {
        id: 5,
        code: 'PRD-0005',
        name: 'Bor Tangan',
        category: 'Tools',
        unit: 'UNIT',
        purchasePrice: 450000,
        salePrice: 575000,
        stock: 0,
        minimumStock: 2,
        description: 'Bor tangan untuk kebutuhan pekerjaan teknis.',
        active: false,
    },
])

const form = reactive({
    id: null,
    code: '',
    name: '',
    category: '',
    unit: '',
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    minimumStock: 0,
    description: '',
    active: true,
})

const filteredProducts = computed(() => {
    const keyword = search.value
        .toLowerCase()
        .trim()

    return products.value.filter((product) => {
        const matchesSearch =
            !keyword ||
            product.code
                .toLowerCase()
                .includes(keyword) ||
            product.name
                .toLowerCase()
                .includes(keyword)

        const matchesCategory =
            categoryFilter.value === 'all' ||
            product.category === categoryFilter.value

        const matchesStatus =
            statusFilter.value === 'all' ||
            (
                statusFilter.value === 'active' &&
                product.active
            ) ||
            (
                statusFilter.value === 'inactive' &&
                !product.active
            )

        return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
        )
    })
})

const activeCount = computed(() => {
    return products.value.filter(
        (product) => product.active
    ).length
})

const inactiveCount = computed(() => {
    return products.value.filter(
        (product) => !product.active
    ).length
})

const lowStockCount = computed(() => {
    return products.value.filter(
        (product) =>
            product.stock <= product.minimumStock
    ).length
})

function resetForm() {
    form.id = null
    form.code = ''
    form.name = ''
    form.category = ''
    form.unit = ''
    form.purchasePrice = 0
    form.salePrice = 0
    form.stock = 0
    form.minimumStock = 0
    form.description = ''
    form.active = true
}

function openForm(product = null) {
    resetForm()

    if (product) {
        editingProduct.value = product

        Object.assign(form, {
            id: product.id,
            code: product.code,
            name: product.name,
            category: product.category,
            unit: product.unit,
            purchasePrice: product.purchasePrice,
            salePrice: product.salePrice,
            stock: product.stock,
            minimumStock: product.minimumStock,
            description: product.description,
            active: product.active,
        })
    } else {
        editingProduct.value = null
    }

    showForm.value = true
}

function closeForm() {
    showForm.value = false
    editingProduct.value = null
    resetForm()
}

function saveProduct() {
    if (!form.code.trim()) {
        alert('Kode produk wajib diisi.')
        return
    }

    if (!form.name.trim()) {
        alert('Nama produk wajib diisi.')
        return
    }

    if (!form.category) {
        alert('Kategori produk wajib dipilih.')
        return
    }

    if (!form.unit) {
        alert('Satuan produk wajib dipilih.')
        return
    }

    if (form.salePrice < 0 || form.purchasePrice < 0) {
        alert('Harga tidak boleh kurang dari 0.')
        return
    }

    if (form.stock < 0 || form.minimumStock < 0) {
        alert('Stok tidak boleh kurang dari 0.')
        return
    }

    const duplicateCode = products.value.find(
        (product) =>
            product.code.toLowerCase() ===
            form.code.trim().toLowerCase() &&
            product.id !== form.id
    )

    if (duplicateCode) {
        alert('Kode produk sudah digunakan.')
        return
    }

    if (editingProduct.value) {
        Object.assign(
            editingProduct.value,
            JSON.parse(JSON.stringify(form))
        )
    } else {
        products.value.push({
            ...JSON.parse(JSON.stringify(form)),
            id: Date.now(),
            code: form.code.trim().toUpperCase(),
        })
    }

    closeForm()
}

function toggleProduct(product) {
    product.active = !product.active
}

function deleteProduct(id) {
    const product = products.value.find(
        (item) => item.id === id
    )

    if (!product) return

    const confirmed = confirm(
        `Hapus produk "${product.name}"?`
    )

    if (!confirmed) return

    products.value = products.value.filter(
        (item) => item.id !== id
    )
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
}
</script>
<style lang="css" scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
    transform: translateY(10px) scale(0.98);
    opacity: 0;
}
</style>