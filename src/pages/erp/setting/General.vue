<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">
                    General Master Data
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Kelola data referensi yang digunakan oleh sistem ERP.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0043a8]"
                @click="openForm()"
            >
                <span class="text-lg leading-none">+</span>
                Tambah {{ activeMaster.label }}
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <p class="text-xs font-medium text-gray-500">
                    Total Data
                </p>
                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ currentItems.length }}
                </p>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <p class="text-xs font-medium text-gray-500">
                    Aktif
                </p>
                <p class="mt-2 text-2xl font-bold text-green-600">
                    {{ activeCount }}
                </p>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <p class="text-xs font-medium text-gray-500">
                    Nonaktif
                </p>
                <p class="mt-2 text-2xl font-bold text-gray-500">
                    {{ inactiveCount }}
                </p>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <p class="text-xs font-medium text-gray-500">
                    Ditampilkan
                </p>
                <p class="mt-2 text-2xl font-bold text-[#0052cc]">
                    {{ filteredItems.length }}
                </p>
            </div>
        </div>

        <!-- MASTER TABS -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div class="overflow-x-auto border-b border-gray-200">
                <div class="flex min-w-max">
                    <button
                        v-for="master in masters"
                        :key="master.key"
                        type="button"
                        class="relative px-5 py-4 text-sm font-medium transition"
                        :class="
                            activeTab === master.key
                                ? 'text-[#0052cc]'
                                : 'text-gray-500 hover:text-gray-900'
                        "
                        @click="changeTab(master.key)"
                    >
                        <span class="mr-2">{{ master.icon }}</span>
                        {{ master.label }}

                        <span
                            class="ml-2 rounded-full px-2 py-0.5 text-[10px]"
                            :class="
                                activeTab === master.key
                                    ? 'bg-blue-50 text-[#0052cc]'
                                    : 'bg-gray-100 text-gray-500'
                            "
                        >
                            {{ master.items.length }}
                        </span>

                        <span
                            v-if="activeTab === master.key"
                            class="absolute inset-x-0 bottom-0 h-0.5 bg-[#0052cc]"
                        />
                    </button>
                </div>
            </div>

            <!-- TOOLBAR -->
            <div
                class="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="relative w-full sm:max-w-sm">
                    <span
                        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                        🔍
                    </span>

                    <input
                        v-model="search"
                        type="text"
                        :placeholder="`Cari ${activeMaster.label.toLowerCase()}...`"
                        class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#0052cc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <select
                    v-model="statusFilter"
                    class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#0052cc]"
                >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
            </div>

            <!-- TABLE -->
            <div class="overflow-x-auto">
                <table class="w-full min-w-[760px] text-left">
                    <thead>
                        <tr class="border-b border-gray-100 bg-gray-50">
                            <th
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Kode
                            </th>

                            <th
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Nama
                            </th>

                            <th
                                v-if="activeTab === 'uom'"
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Simbol
                            </th>

                            <th
                                v-if="activeTab === 'item-types'"
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Klasifikasi
                            </th>

                            <th
                                v-if="activeTab === 'warehouses'"
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Lokasi
                            </th>

                            <th
                                v-if="activeTab === 'locations'"
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Keterangan
                            </th>

                            <th
                                v-if="activeTab === 'departments'"
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Penanggung Jawab
                            </th>

                            <th
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="item in filteredItems"
                            :key="item.id"
                            class="transition hover:bg-gray-50"
                        >
                            <td class="px-5 py-4">
                                <span
                                    class="font-mono text-xs font-semibold text-gray-700"
                                >
                                    {{ item.code }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div>
                                    <p class="text-sm font-semibold text-gray-900">
                                        {{ item.name }}
                                    </p>

                                    <p
                                        v-if="item.description"
                                        class="mt-0.5 max-w-xs truncate text-xs text-gray-400"
                                    >
                                        {{ item.description }}
                                    </p>
                                </div>
                            </td>

                            <td
                                v-if="activeTab === 'uom'"
                                class="px-5 py-4"
                            >
                                <span
                                    class="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700"
                                >
                                    {{ item.symbol }}
                                </span>
                            </td>

                            <td
                                v-if="activeTab === 'item-types'"
                                class="px-5 py-4"
                            >
                                <span
                                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="
                                        classificationBadge(item.classification)
                                    "
                                >
                                    {{ classificationLabel(item.classification) }}
                                </span>
                            </td>

                            <td
                                v-if="activeTab === 'warehouses'"
                                class="px-5 py-4 text-sm text-gray-600"
                            >
                                {{ item.location || '-' }}
                            </td>

                            <td
                                v-if="activeTab === 'locations'"
                                class="px-5 py-4 text-sm text-gray-600"
                            >
                                {{ item.description || '-' }}
                            </td>

                            <td
                                v-if="activeTab === 'departments'"
                                class="px-5 py-4 text-sm text-gray-600"
                            >
                                {{ item.personInCharge || '-' }}
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="
                                        item.active
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                    "
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full"
                                        :class="
                                            item.active
                                                ? 'bg-green-500'
                                                : 'bg-gray-400'
                                        "
                                    />
                                    {{ item.active ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-1">
                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#0052cc]"
                                        title="Edit"
                                        @click="openForm(item)"
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-yellow-50 hover:text-yellow-600"
                                        :title="
                                            item.active
                                                ? 'Nonaktifkan'
                                                : 'Aktifkan'
                                        "
                                        @click="toggleStatus(item)"
                                    >
                                        {{ item.active ? '⏸️' : '▶️' }}
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                        title="Hapus"
                                        @click="deleteItem(item)"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredItems.length === 0">
                            <td
                                :colspan="tableColumnCount"
                                class="px-5 py-16 text-center"
                            >
                                <div class="text-4xl">📂</div>

                                <p class="mt-3 text-sm font-semibold text-gray-700">
                                    Data tidak ditemukan
                                </p>

                                <p class="mt-1 text-xs text-gray-400">
                                    Coba ubah pencarian atau tambahkan data baru.
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- FORM MODAL -->
        <div
            v-if="showForm"
            class="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
            @click.self="closeForm"
        >
            <div
                class="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
            >
                <!-- MODAL HEADER -->
                <div
                    class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4"
                >
                    <div>
                        <h2 class="text-base font-bold text-gray-900">
                            {{ editingItem ? 'Edit' : 'Tambah' }}
                            {{ activeMaster.label }}
                        </h2>

                        <p class="mt-0.5 text-xs text-gray-400">
                            Isi informasi {{ activeMaster.label.toLowerCase() }}.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        @click="closeForm"
                    >
                        ✕
                    </button>
                </div>

                <!-- FORM -->
                <form
                    class="space-y-4 p-5"
                    @submit.prevent="saveItem"
                >
                    <!-- KODE -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Kode
                        </label>

                        <input
                            v-model="form.code"
                            type="text"
                            :placeholder="activeMaster.codePlaceholder"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                        />

                        <p class="mt-1 text-[11px] text-gray-400">
                            Kosongkan untuk menggunakan kode otomatis.
                        </p>
                    </div>

                    <!-- NAMA -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Nama
                            <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="form.name"
                            type="text"
                            :placeholder="`Nama ${activeMaster.label}`"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <!-- UOM -->
                    <template v-if="activeTab === 'uom'">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Simbol
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.symbol"
                                type="text"
                                placeholder="Contoh: PCS"
                                class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Tipe Satuan
                            </label>

                            <select
                                v-model="form.uomType"
                                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="quantity">Quantity</option>
                                <option value="length">Panjang</option>
                                <option value="weight">Berat</option>
                                <option value="volume">Volume</option>
                                <option value="area">Luas</option>
                                <option value="time">Waktu</option>
                                <option value="service">Jasa</option>
                            </select>
                        </div>
                    </template>

                    <!-- ITEM TYPE -->
                    <template v-if="activeTab === 'item-types'">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Klasifikasi
                                <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.classification"
                                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="barang">Barang</option>
                                <option value="asset">Asset</option>
                                <option value="service">Jasa</option>
                            </select>
                        </div>
                    </template>

                    <!-- WAREHOUSE -->
                    <template v-if="activeTab === 'warehouses'">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Lokasi
                            </label>

                            <input
                                v-model="form.location"
                                type="text"
                                placeholder="Contoh: Surabaya"
                                class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Penanggung Jawab
                            </label>

                            <input
                                v-model="form.personInCharge"
                                type="text"
                                placeholder="Contoh: Kepala Gudang"
                                class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </template>

                    <!-- DEPARTMENT -->
                    <template v-if="activeTab === 'departments'">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Penanggung Jawab
                            </label>

                            <input
                                v-model="form.personInCharge"
                                type="text"
                                placeholder="Contoh: Manager Operasional"
                                class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </template>

                    <!-- DESCRIPTION -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Keterangan
                        </label>

                        <textarea
                            v-model="form.description"
                            rows="3"
                            placeholder="Keterangan tambahan..."
                            class="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <!-- ACTIVE -->
                    <label
                        class="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                        <div>
                            <p class="text-sm font-medium text-gray-800">
                                Status Aktif
                            </p>

                            <p class="text-xs text-gray-400">
                                Data dapat digunakan oleh modul ERP.
                            </p>
                        </div>

                        <input
                            v-model="form.active"
                            type="checkbox"
                            class="h-4 w-4 rounded border-gray-300 text-[#0052cc] focus:ring-[#0052cc]"
                        />
                    </label>

                    <!-- ACTION -->
                    <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                            @click="closeForm"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            class="rounded-lg bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0043a8]"
                        >
                            {{ editingItem ? 'Simpan Perubahan' : 'Simpan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const activeTab = ref('categories')
const search = ref('')
const statusFilter = ref('all')

const showForm = ref(false)
const editingItem = ref(null)

const form = reactive({
    id: null,
    code: '',
    name: '',
    symbol: '',
    uomType: 'quantity',
    classification: 'barang',
    location: '',
    personInCharge: '',
    description: '',
    active: true,
})

const masters = ref([
    {
        key: 'categories',
        label: 'Kategori Item',
        icon: '🏷️',
        codePrefix: 'CAT',
        codePlaceholder: 'CAT-0001',
        items: [
            {
                id: 1,
                code: 'CAT-0001',
                name: 'Elektrikal',
                description: 'Material dan barang kebutuhan elektrikal.',
                active: true,
            },
            {
                id: 2,
                code: 'CAT-0002',
                name: 'Material',
                description: 'Material umum untuk kebutuhan pekerjaan.',
                active: true,
            },
            {
                id: 3,
                code: 'CAT-0003',
                name: 'Sparepart Kendaraan',
                description: 'Suku cadang kendaraan operasional.',
                active: true,
            },
            {
                id: 4,
                code: 'CAT-0004',
                name: 'ATK',
                description: 'Alat tulis dan kebutuhan administrasi.',
                active: true,
            },
            {
                id: 5,
                code: 'CAT-0005',
                name: 'Kebersihan',
                description: 'Kebutuhan kebersihan kantor dan fasilitas.',
                active: true,
            },
            {
                id: 6,
                code: 'CAT-0006',
                name: 'Peralatan Kantor',
                description: 'Peralatan yang digunakan untuk operasional kantor.',
                active: true,
            },
            {
                id: 7,
                code: 'CAT-0007',
                name: 'Maintenance',
                description: 'Kebutuhan pemeliharaan fasilitas dan peralatan.',
                active: true,
            },
        ],
    },

    {
        key: 'item-types',
        label: 'Jenis Item',
        icon: '📦',
        codePrefix: 'TYP',
        codePlaceholder: 'TYP-0001',
        items: [
            {
                id: 1,
                code: 'TYP-0001',
                name: 'Barang Dagangan',
                classification: 'barang',
                description: 'Barang yang dibeli dan dijual kembali.',
                active: true,
            },
            {
                id: 2,
                code: 'TYP-0002',
                name: 'Sparepart',
                classification: 'barang',
                description: 'Suku cadang kendaraan atau peralatan.',
                active: true,
            },
            {
                id: 3,
                code: 'TYP-0003',
                name: 'Consumable',
                classification: 'barang',
                description: 'Barang yang habis digunakan dalam operasional.',
                active: true,
            },
            {
                id: 4,
                code: 'TYP-0004',
                name: 'ATK',
                classification: 'barang',
                description: 'Kebutuhan alat tulis kantor.',
                active: true,
            },
            {
                id: 5,
                code: 'TYP-0005',
                name: 'Kebersihan',
                classification: 'barang',
                description: 'Kebutuhan kebersihan.',
                active: true,
            },
            {
                id: 6,
                code: 'TYP-0006',
                name: 'Asset',
                classification: 'asset',
                description: 'Barang yang dicatat sebagai aset perusahaan.',
                active: true,
            },
            {
                id: 7,
                code: 'TYP-0007',
                name: 'Jasa',
                classification: 'service',
                description: 'Layanan atau pekerjaan dari pihak internal/eksternal.',
                active: true,
            },
        ],
    },

    {
        key: 'uom',
        label: 'UOM / Satuan',
        icon: '📏',
        codePrefix: 'UOM',
        codePlaceholder: 'UOM-0001',
        items: [
            {
                id: 1,
                code: 'UOM-0001',
                name: 'Pieces',
                symbol: 'PCS',
                uomType: 'quantity',
                description: 'Satuan per buah.',
                active: true,
            },
            {
                id: 2,
                code: 'UOM-0002',
                name: 'Unit',
                symbol: 'UNIT',
                uomType: 'quantity',
                description: 'Satuan unit.',
                active: true,
            },
            {
                id: 3,
                code: 'UOM-0003',
                name: 'Meter',
                symbol: 'M',
                uomType: 'length',
                description: 'Satuan panjang.',
                active: true,
            },
            {
                id: 4,
                code: 'UOM-0004',
                name: 'Kilogram',
                symbol: 'KG',
                uomType: 'weight',
                description: 'Satuan berat.',
                active: true,
            },
            {
                id: 5,
                code: 'UOM-0005',
                name: 'Liter',
                symbol: 'L',
                uomType: 'volume',
                description: 'Satuan volume.',
                active: true,
            },
            {
                id: 6,
                code: 'UOM-0006',
                name: 'Box',
                symbol: 'BOX',
                uomType: 'quantity',
                description: 'Satuan per box.',
                active: true,
            },
            {
                id: 7,
                code: 'UOM-0007',
                name: 'Jasa',
                symbol: 'JASA',
                uomType: 'service',
                description: 'Satuan untuk transaksi jasa.',
                active: true,
            },
        ],
    },

    {
        key: 'warehouses',
        label: 'Gudang',
        icon: '🏭',
        codePrefix: 'WH',
        codePlaceholder: 'WH-0001',
        items: [
            {
                id: 1,
                code: 'WH-0001',
                name: 'Gudang Utama',
                location: 'Surabaya',
                personInCharge: 'Kepala Gudang',
                description: 'Gudang utama penyimpanan barang.',
                active: true,
            },
            {
                id: 2,
                code: 'WH-0002',
                name: 'Gudang Sparepart',
                location: 'Surabaya',
                personInCharge: 'Staff Operasional',
                description: 'Penyimpanan sparepart kendaraan.',
                active: true,
            },
            {
                id: 3,
                code: 'WH-0003',
                name: 'Gudang Consumable',
                location: 'Surabaya',
                personInCharge: 'Staff General Affair',
                description: 'Penyimpanan barang consumable.',
                active: true,
            },
        ],
    },

    {
        key: 'locations',
        label: 'Lokasi',
        icon: '📍',
        codePrefix: 'LOC',
        codePlaceholder: 'LOC-0001',
        items: [
            {
                id: 1,
                code: 'LOC-0001',
                name: 'Kantor Surabaya',
                description: 'Lokasi kantor utama.',
                active: true,
            },
            {
                id: 2,
                code: 'LOC-0002',
                name: 'Workshop',
                description: 'Lokasi workshop kendaraan dan maintenance.',
                active: true,
            },
            {
                id: 3,
                code: 'LOC-0003',
                name: 'Gudang Utama',
                description: 'Area penyimpanan barang utama.',
                active: true,
            },
        ],
    },

    {
        key: 'departments',
        label: 'Departemen',
        icon: '🏢',
        codePrefix: 'DPT',
        codePlaceholder: 'DPT-0001',
        items: [
            {
                id: 1,
                code: 'DPT-0001',
                name: 'Operasional',
                personInCharge: 'Manager Operasional',
                description: 'Departemen operasional perusahaan.',
                active: true,
            },
            {
                id: 2,
                code: 'DPT-0002',
                name: 'Finance',
                personInCharge: 'Finance Manager',
                description: 'Departemen keuangan dan accounting.',
                active: true,
            },
            {
                id: 3,
                code: 'DPT-0003',
                name: 'IT',
                personInCharge: 'IT Administrator',
                description: 'Teknologi informasi dan sistem.',
                active: true,
            },
            {
                id: 4,
                code: 'DPT-0004',
                name: 'HR & GA',
                personInCharge: 'HR Manager',
                description: 'Human resource dan general affair.',
                active: true,
            },
            {
                id: 5,
                code: 'DPT-0005',
                name: 'Purchasing',
                personInCharge: 'Purchasing Staff',
                description: 'Pengadaan barang dan jasa.',
                active: true,
            },
        ],
    },

    {
        key: 'asset-statuses',
        label: 'Status Asset',
        icon: '💼',
        codePrefix: 'AST',
        codePlaceholder: 'AST-0001',
        items: [
            {
                id: 1,
                code: 'AST-0001',
                name: 'Aktif',
                description: 'Asset sedang digunakan.',
                active: true,
            },
            {
                id: 2,
                code: 'AST-0002',
                name: 'Maintenance',
                description: 'Asset sedang dalam pemeliharaan.',
                active: true,
            },
            {
                id: 3,
                code: 'AST-0003',
                name: 'Rusak',
                description: 'Asset mengalami kerusakan.',
                active: true,
            },
            {
                id: 4,
                code: 'AST-0004',
                name: 'Hilang',
                description: 'Asset tidak ditemukan.',
                active: true,
            },
            {
                id: 5,
                code: 'AST-0005',
                name: 'Dijual',
                description: 'Asset sudah dijual atau dilepas.',
                active: true,
            },
        ],
    },
])

const activeMaster = computed(() => {
    return masters.value.find(
        (master) => master.key === activeTab.value
    )
})

const currentItems = computed(() => {
    return activeMaster.value?.items ?? []
})

const filteredItems = computed(() => {
    const keyword = search.value.trim().toLowerCase()

    return currentItems.value.filter((item) => {
        const matchesSearch =
            !keyword ||
            item.code?.toLowerCase().includes(keyword) ||
            item.name?.toLowerCase().includes(keyword) ||
            item.description?.toLowerCase().includes(keyword) ||
            item.symbol?.toLowerCase().includes(keyword)

        const matchesStatus =
            statusFilter.value === 'all' ||
            (statusFilter.value === 'active' && item.active) ||
            (statusFilter.value === 'inactive' && !item.active)

        return matchesSearch && matchesStatus
    })
})

const activeCount = computed(() => {
    return currentItems.value.filter((item) => item.active).length
})

const inactiveCount = computed(() => {
    return currentItems.value.filter((item) => !item.active).length
})

const tableColumnCount = computed(() => {
    let count = 4

    if (activeTab.value === 'uom') count++
    if (activeTab.value === 'item-types') count++
    if (activeTab.value === 'warehouses') count++
    if (activeTab.value === 'locations') count++
    if (activeTab.value === 'departments') count++

    return count
})

function changeTab(tab) {
    activeTab.value = tab
    search.value = ''
    statusFilter.value = 'all'
    closeForm()
}

function resetForm() {
    form.id = null
    form.code = ''
    form.name = ''
    form.symbol = ''
    form.uomType = 'quantity'
    form.classification = 'barang'
    form.location = ''
    form.personInCharge = ''
    form.description = ''
    form.active = true
}

function openForm(item = null) {
    resetForm()

    if (item) {
        editingItem.value = item

        Object.assign(form, {
            id: item.id,
            code: item.code ?? '',
            name: item.name ?? '',
            symbol: item.symbol ?? '',
            uomType: item.uomType ?? 'quantity',
            classification: item.classification ?? 'barang',
            location: item.location ?? '',
            personInCharge: item.personInCharge ?? '',
            description: item.description ?? '',
            active: item.active ?? true,
        })
    } else {
        editingItem.value = null
    }

    showForm.value = true
}

function closeForm() {
    showForm.value = false
    editingItem.value = null
    resetForm()
}

function generateCode(master) {
    const nextNumber = master.items.length + 1

    return `${master.codePrefix}-${String(nextNumber).padStart(4, '0')}`
}

function saveItem() {
    if (!form.name.trim()) {
        alert('Nama wajib diisi.')
        return
    }

    if (activeTab.value === 'uom' && !form.symbol.trim()) {
        alert('Simbol UOM wajib diisi.')
        return
    }

    const master = activeMaster.value

    if (!master) return

    const payload = {
        id: form.id,
        code:
            form.code.trim().toUpperCase() ||
            generateCode(master),
        name: form.name.trim(),
        symbol:
            activeTab.value === 'uom'
                ? form.symbol.trim().toUpperCase()
                : undefined,
        uomType:
            activeTab.value === 'uom'
                ? form.uomType
                : undefined,
        classification:
            activeTab.value === 'item-types'
                ? form.classification
                : undefined,
        location:
            activeTab.value === 'warehouses'
                ? form.location.trim()
                : undefined,
        personInCharge:
            activeTab.value === 'warehouses' ||
            activeTab.value === 'departments'
                ? form.personInCharge.trim()
                : undefined,
        description: form.description.trim(),
        active: form.active,
    }

    Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
            delete payload[key]
        }
    })

    if (editingItem.value) {
        Object.assign(editingItem.value, payload)
    } else {
        master.items.push({
            ...payload,
            id: Date.now(),
        })
    }

    closeForm()
}

function toggleStatus(item) {
    item.active = !item.active
}

function deleteItem(item) {
    const confirmed = confirm(
        `Hapus ${activeMaster.value.label.toLowerCase()} "${item.name}"?`
    )

    if (!confirmed) return

    const master = activeMaster.value

    const index = master.items.findIndex(
        (data) => data.id === item.id
    )

    if (index === -1) return

    master.items.splice(index, 1)
}

function classificationLabel(value) {
    const labels = {
        barang: 'Barang',
        asset: 'Asset',
        service: 'Jasa',
    }

    return labels[value] ?? value
}

function classificationBadge(value) {
    const classes = {
        barang: 'bg-blue-50 text-blue-700',
        asset: 'bg-purple-50 text-purple-700',
        service: 'bg-orange-50 text-orange-700',
    }

    return classes[value] ?? 'bg-gray-100 text-gray-600'
}
</script>