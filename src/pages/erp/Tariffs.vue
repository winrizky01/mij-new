<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Tarif Pengiriman
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola tarif vendor dan pembayaran driver berdasarkan
                    tujuan dan jenis armada.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e]"
                @click="openCreate"
            >
                + Tambah Tarif
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Total Detail Tarif
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ tariffs.length }}
                </p>
            </div>

            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Kota
                </p>

                <p class="mt-2 text-2xl font-bold text-[#0052cc]">
                    {{ cityCount }}
                </p>
            </div>

            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Tarif Aktif
                </p>

                <p class="mt-2 text-2xl font-bold text-emerald-600">
                    {{ activeCount }}
                </p>
            </div>
        </div>

        <!-- FILTER -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari kode, nama, kota, provinsi, atau jenis tarif..."
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="truckFilter"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua Truck
                    </option>

                    <option
                        v-for="truck in trucks"
                        :key="truck.id"
                        :value="String(truck.id)"
                    >
                        {{ truck.plate_number }}
                        —
                        {{ truck.brand || '' }}
                        {{ truck.model || '' }}
                    </option>
                </select>

                <select
                    v-model="statusFilter"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
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

        <!-- LOADING -->
        <div
            v-if="loading"
            class="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500 shadow-sm"
        >
            Memuat data tarif...
        </div>

        <!-- TABLE -->
        <div
            v-else
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="overflow-x-auto">
                <table class="min-w-[1200px] w-full text-sm">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Tarif
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Kota
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Jenis Tarif
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Truk
                            </th>

                            <th
                                class="px-5 py-4 text-right font-semibold text-gray-600"
                            >
                                Vendor
                            </th>

                            <th
                                class="px-5 py-4 text-right font-semibold text-gray-600"
                            >
                                Driver
                            </th>

                            <th
                                class="px-5 py-4 text-right font-semibold text-gray-600"
                            >
                                Tambahan
                            </th>

                            <th
                                class="px-5 py-4 text-center font-semibold text-gray-600"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-4 text-right font-semibold text-gray-600"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="tariff in filteredTariffs"
                            :key="tariff.id"
                            class="hover:bg-gray-50"
                        >
                            <!-- TARIF -->
                            <td class="px-5 py-4">
                                <p
                                    class="font-semibold text-gray-900"
                                >
                                    {{ tariff.tariffName }}
                                </p>

                                <p
                                    class="mt-0.5 text-xs text-gray-400"
                                >
                                    {{ tariff.tariffCode }}
                                </p>
                            </td>

                            <!-- KOTA -->
                            <td class="px-5 py-4">
                                <p class="font-semibold text-gray-900">
                                    {{ tariff.city }}
                                </p>

                                <p class="mt-0.5 text-xs text-gray-500">
                                    {{ tariff.province }}
                                </p>
                            </td>

                            <!-- TYPE -->
                            <td class="px-5 py-4">
                                <span
                                    class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                                >
                                    {{ tariff.tariffType }}
                                </span>
                            </td>

                            <!-- TRUCK -->
                            <td class="px-5 py-4 text-gray-600">
                                {{ tariff.truck }}
                            </td>

                            <!-- VENDOR -->
                            <td
                                class="px-5 py-4 text-right font-semibold text-gray-900"
                            >
                                {{ formatCurrency(tariff.vendorRate) }}
                            </td>

                            <!-- DRIVER -->
                            <td
                                class="px-5 py-4 text-right font-semibold text-gray-900"
                            >
                                {{ formatCurrency(tariff.driverRate) }}
                            </td>

                            <!-- ADDITIONAL -->
                            <td class="px-5 py-4 text-right">
                                <div class="text-xs">
                                    <div class="text-gray-600">
                                        V:
                                        {{
                                            formatCurrency(
                                                tariff.vendorAdditional
                                            )
                                        }}
                                    </div>

                                    <div class="text-gray-600">
                                        D:
                                        {{
                                            formatCurrency(
                                                tariff.driverAdditional
                                            )
                                        }}
                                    </div>
                                </div>
                            </td>

                            <!-- STATUS -->
                            <td class="px-5 py-4 text-center">
                                <span
                                    :class="
                                        tariff.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-gray-100 text-gray-500'
                                    "
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                >
                                    {{
                                        tariff.status === 'active'
                                            ? 'Aktif'
                                            : 'Nonaktif'
                                    }}
                                </span>
                            </td>

                            <!-- ACTION -->
                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-1.5">

                                    <!-- Edit -->
                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                        title="Edit"
                                        @click="openEdit(tariff)"
                                    >
                                        <PencilIcon class="h-4 w-4" />
                                    </button>

                                    <!-- Toggle Status -->
                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition"
                                        :class="
                                            tariff.status === 'active'
                                                ? 'hover:bg-red-50 hover:text-red-600'
                                                : 'hover:bg-emerald-50 hover:text-emerald-600'
                                        "
                                        :title="
                                            tariff.status === 'active'
                                                ? 'Nonaktifkan'
                                                : 'Aktifkan'
                                        "
                                        @click="toggleStatus(tariff)"
                                    >
                                        <PowerIcon class="h-4 w-4" />
                                    </button>

                                </div>
                            </td>
                        </tr>

                        <tr
                            v-if="filteredTariffs.length === 0"
                        >
                            <td
                                colspan="9"
                                class="px-5 py-12 text-center text-gray-400"
                            >
                                Tidak ada tarif ditemukan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL -->
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @click.self="closeModal"
        >
            <div
                class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            >
                <!-- MODAL HEADER -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-6 py-4"
                >
                    <div>
                        <h2
                            class="text-lg font-bold text-[#003366]"
                        >
                            {{
                                editingId
                                    ? 'Edit Tarif'
                                    : 'Tambah Tarif'
                            }}
                        </h2>

                        <p
                            class="mt-1 text-xs text-gray-500"
                        >
                            Atur informasi tarif dan detail tujuan
                            pengiriman.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl text-gray-400 hover:text-gray-700"
                        @click="closeModal"
                    >
                        ×
                    </button>
                </div>

                <form
                    class="space-y-6 p-6"
                    @submit.prevent="saveTariff"
                >
                    <!-- HEADER TARIF -->
                    <div>
                        <div
                            class="mb-3 flex items-center gap-2"
                        >
                            <div
                                class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700"
                            >
                                1
                            </div>

                            <h3
                                class="font-semibold text-gray-800"
                            >
                                Informasi Tarif
                            </h3>
                        </div>

                        <div
                            class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                            <!-- CODE -->
                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Kode Tarif
                                </label>

                                <input
                                    v-model="form.code"
                                    required
                                    placeholder="Contoh: TARIF-JATIM-001"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                />
                            </div>

                            <!-- NAME -->
                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Nama Tarif
                                </label>

                                <input
                                    v-model="form.name"
                                    required
                                    placeholder="Contoh: Tarif Jawa Timur"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                />
                            </div>

                            <!-- EFFECTIVE -->
                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Berlaku Mulai
                                </label>

                                <input
                                    v-model="form.effective_date"
                                    type="date"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                />
                            </div>

                            <!-- EXPIRED -->
                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Berlaku Sampai
                                </label>

                                <input
                                    v-model="form.expired_date"
                                    type="date"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                />
                            </div>

                            <!-- STATUS -->
                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Status
                                </label>

                                <select
                                    v-model="form.status"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                >
                                    <option value="active">
                                        Aktif
                                    </option>

                                    <option value="inactive">
                                        Nonaktif
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- DETAIL -->
                    <div>
                        <div
                            class="mb-3 flex items-center gap-2"
                        >
                            <div
                                class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700"
                            >
                                2
                            </div>

                            <h3
                                class="font-semibold text-gray-800"
                            >
                                Detail Tarif
                            </h3>
                        </div>

                        <div
                            class="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
                        >
                            <!-- LOCATION -->
                            <div
                                class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                            >
                                <!-- PROVINCE -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Provinsi
                                    </label>

                                    <select
                                        v-model="form.province_id"
                                        required
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                        @change="loadCities"
                                    >
                                        <option value="">
                                            Pilih provinsi
                                        </option>

                                        <option
                                            v-for="province in provinces"
                                            :key="province.id"
                                            :value="String(province.id)"
                                        >
                                            {{ province.name }}
                                        </option>
                                    </select>
                                </div>

                                <!-- CITY -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Kota
                                    </label>

                                    <select
                                        v-model="form.city_id"
                                        required
                                        :disabled="
                                            !form.province_id ||
                                            loadingCities
                                        "
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-100"
                                    >
                                        <option value="">
                                            {{
                                                loadingCities
                                                    ? 'Memuat kota...'
                                                    : 'Pilih kota'
                                            }}
                                        </option>

                                        <option
                                            v-for="city in cities"
                                            :key="city.id"
                                            :value="String(city.id)"
                                        >
                                            {{ city.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- TYPE -->
                            <div
                                class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                            >
                                <!-- TARIFF TYPE -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Jenis Tarif
                                    </label>

                                    <input
                                        v-model="form.tariff_type"
                                        required
                                        placeholder="Contoh: Reguler"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />
                                </div>

                                <!-- TRUCK TYPE -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Truck
                                    </label>

                                    <select
                                        v-model="form.truck_id"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    >
                                        <option value="">
                                            Pilih truck
                                        </option>

                                        <option
                                            v-for="truck in trucks"
                                            :key="truck.id"
                                            :value="String(truck.id)"
                                        >
                                            {{ truck.plate_number }}
                                            —
                                            {{ truck.brand || '' }}
                                            {{ truck.model || '' }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- RATES -->
                            <div
                                class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                            >
                                <!-- VENDOR -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Tarif Vendor
                                    </label>

                                    <input
                                        v-model.number="form.vendor_rate"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />
                                </div>

                                <!-- DRIVER -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Tarif Driver
                                    </label>

                                    <input
                                        v-model.number="form.driver_rate"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />
                                </div>

                                <!-- VENDOR ADDITIONAL -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Tambahan Vendor
                                    </label>

                                    <input
                                        v-model.number="form.vendor_additional"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />
                                </div>

                                <!-- DRIVER ADDITIONAL -->
                                <div>
                                    <label
                                        class="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Tambahan Driver
                                    </label>

                                    <input
                                        v-model.number="form.driver_additional"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />
                                </div>
                            </div>

                            <!-- DETAIL NOTES -->
                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Keterangan Detail
                                </label>

                                <textarea
                                    v-model="form.detail_notes"
                                    rows="3"
                                    placeholder="Keterangan tarif..."
                                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- HEADER NOTES -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Catatan Tarif
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Catatan umum tarif..."
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        ></textarea>
                    </div>

                    <!-- FOOTER -->
                    <div
                        class="flex justify-end gap-3 border-t border-gray-100 pt-4"
                    >
                        <button
                            type="button"
                            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            @click="closeModal"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="saving"
                            class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {{
                                saving
                                    ? 'Menyimpan...'
                                    : 'Simpan Tarif'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    PencilIcon,
    PowerIcon,
} from 'lucide-vue-next'

import {
    computed,
    onMounted,
    reactive,
    ref,
} from 'vue'

import {
    erpApi,
    getApiError,
} from '@/services/api'

const search = ref('')
const truckFilter = ref('')
const statusFilter = ref('')

const showModal = ref(false)
const editingId = ref(null)
const saving = ref(false)
const loading = ref(false)
const loadingCities = ref(false)

const tariffs = ref([])
const provinces = ref([])
const cities = ref([])
const trucks = ref([])

const form = reactive({
    code: '',
    name: '',
    status: 'active',
    effective_date: '',
    expired_date: '',
    notes: '',

    province_id: '',
    city_id: '',
    tariff_type: 'REGUREL',
    truck_id: '',

    vendor_rate: 0,
    vendor_additional: 0,
    driver_rate: 0,
    driver_additional: 0,

    detail_notes: '',
})

/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const activeCount = computed(() =>
    tariffs.value.filter(
        item => item.status === 'active'
    ).length
)

const cityCount = computed(() =>
    new Set(
        tariffs.value
            .map(item => item.city_id)
            .filter(Boolean)
    ).size
)

const filteredTariffs = computed(() => {
    const keyword = search.value
        .toLowerCase()
        .trim()

    return tariffs.value.filter(tariff => {
        const searchable = [
            tariff.tariffCode,
            tariff.tariffName,
            tariff.city,
            tariff.province,
            tariff.tariffType,
            tariff.truck,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

        const matchesSearch =
            !keyword ||
            searchable.includes(keyword)

        const matchesTruck =
            !truckFilter.value ||
            String(tariff.truckId) ===
                String(truckFilter.value)

        const matchesStatus =
            !statusFilter.value ||
            tariff.status === statusFilter.value

        return (
            matchesSearch &&
            matchesTruck &&
            matchesStatus
        )
    })
})

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0)
}

function unwrapData(response) {
    return response?.data ?? response
}

function resetForm() {
    Object.assign(form, {
        code: '',
        name: '',
        status: 'active',
        effective_date: '',
        expired_date: '',
        notes: '',

        province_id: '',
        city_id: '',
        tariff_type: 'REGUREL',
        truck_id: '',

        vendor_rate: 0,
        vendor_additional: 0,
        driver_rate: 0,
        driver_additional: 0,

        detail_notes: '',
    })

    cities.value = []
}

/*
|--------------------------------------------------------------------------
| LOAD MASTER
|--------------------------------------------------------------------------
*/

async function loadProvinces() {
    try {
        const response =
            await erpApi.master.provinces.list({
                is_active: true,
            })

        const data = unwrapData(response)

        provinces.value = Array.isArray(data)
            ? data
            : []
    } catch (error) {
        console.error(
            'Gagal memuat provinsi:',
            error
        )

        provinces.value = []
    }
}

async function loadTrucks() {
    try {
        const response =
            await erpApi.master.trucks.list({
                status: 'available',
            })

        const data = response?.data?.data ?? []

        trucks.value = Array.isArray(data)
            ? data
            : []
    } catch (error) {
        console.error(
            'Gagal memuat truck:',
            error
        )

        trucks.value = []
    }
}

async function loadCities() {
    form.city_id = ''
    cities.value = []

    if (!form.province_id) {
        return
    }

    loadingCities.value = true

    try {
        const response =
            await erpApi.master.cities.list({
                province_id: form.province_id,
                is_active: true,
            })

        const data = unwrapData(response)

        cities.value = Array.isArray(data)
            ? data
            : []
    } catch (error) {
        console.error(
            'Gagal memuat kota:',
            error
        )

        cities.value = []
    } finally {
        loadingCities.value = false
    }
}

/*
|--------------------------------------------------------------------------
| LOAD TARIFF
|--------------------------------------------------------------------------
*/

function normalizeTariffs(response) {
    const data = unwrapData(response)

    if (!Array.isArray(data)) {
        return []
    }

    const rows = []

    data.forEach(tariff => {
        const details =
            Array.isArray(tariff.details)
                ? tariff.details
                : []

        details.forEach(detail => {
            const truck = detail.truck

            rows.push({
                id: detail.id,

                tariffId: tariff.id,
                tariffCode: tariff.code,
                tariffName: tariff.name,

                status:
                    detail.is_active &&
                    tariff.status === 'active'
                        ? 'active'
                        : 'inactive',

                provinceId: detail.province_id,
                province: detail.province,

                cityId: detail.city_id,
                city: detail.city,

                tariffType: detail.tariff_type,

                // Truck aktual
                truckId: detail.truck_id,

                truck: truck
                    ? [
                        truck.plate_number,
                        truck.brand,
                        truck.model,
                    ]
                        .filter(Boolean)
                        .join(' — ')
                    : '-',

                // Bisa dipakai kalau nanti perlu filter
                truckTypeId:
                    truck?.truck_type_id || null,

                truckType:
                    truck?.truck_type?.name ||
                    '-',

                vendorRate:
                    Number(detail.vendor_rate) || 0,

                vendorAdditional:
                    Number(
                        detail.vendor_additional
                    ) || 0,

                driverRate:
                    Number(detail.driver_rate) || 0,

                driverAdditional:
                    Number(
                        detail.driver_additional
                    ) || 0,

                effectiveDate:
                    tariff.effective_date,

                expiredDate:
                    tariff.expired_date,

                notes:
                    detail.notes ||
                    tariff.notes ||
                    '',
            })
        })
    })

    return rows
}

async function loadTariffs() {
    loading.value = true

    try {
        const response =
            await erpApi.master.shippingTariffs.list()

        tariffs.value =
            normalizeTariffs(response)
    } catch (error) {
        console.error(
            'Gagal memuat tarif:',
            error
        )

        alert(
            getApiError(error)?.message ||
            'Gagal memuat data tarif.'
        )

        tariffs.value = []
    } finally {
        loading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| MODAL
|--------------------------------------------------------------------------
*/

async function openCreate() {
    editingId.value = null

    resetForm()

    showModal.value = true
}

async function openEdit(tariff) {
    editingId.value = tariff.tariffId

    Object.assign(form, {
        code: tariff.tariffCode,
        name: tariff.tariffName,
        status: tariff.status,

        effective_date:
            tariff.effectiveDate || '',

        expired_date:
            tariff.expiredDate || '',

        notes: tariff.notes || '',

        province_id:
            tariff.provinceId
                ? String(tariff.provinceId)
                : '',

        city_id:
            tariff.cityId
                ? String(tariff.cityId)
                : '',

        tariff_type:
            tariff.tariffType || 'REGUREL',

        truck_id:
            tariff.truckId
                ? String(tariff.truckId)
                : '',

        vendor_rate:
            tariff.vendorRate,

        vendor_additional:
            tariff.vendorAdditional,

        driver_rate:
            tariff.driverRate,

        driver_additional:
            tariff.driverAdditional,

        detail_notes:
            tariff.notes || '',
    })

    showModal.value = true

    if (form.province_id) {
        await loadCities()

        form.city_id = tariff.cityId
            ? String(tariff.cityId)
            : ''
    }
}

function closeModal() {
    showModal.value = false
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

async function saveTariff() {
    saving.value = true

    try {
        const payload = {
            code: form.code.trim(),
            name: form.name.trim(),
            status: form.status,

            effective_date:
                form.effective_date || null,

            expired_date:
                form.expired_date || null,

            notes:
                form.notes.trim() || null,

            details: [
                {
                    province_id:
                        form.province_id
                            ? Number(
                                  form.province_id
                              )
                            : null,

                    city_id:
                        form.city_id
                            ? Number(
                                  form.city_id
                              )
                            : null,

                    tariff_type:
                        form.tariff_type.trim(),

                    truck_id:
                        form.truck_id
                            ? Number(form.truck_id)
                            : null,

                    vendor_rate:
                        Number(
                            form.vendor_rate
                        ) || 0,

                    vendor_additional:
                        Number(
                            form.vendor_additional
                        ) || 0,

                    driver_rate:
                        Number(
                            form.driver_rate
                        ) || 0,

                    driver_additional:
                        Number(
                            form.driver_additional
                        ) || 0,

                    is_active:
                        form.status === 'active',

                    notes:
                        form.detail_notes
                            .trim() ||
                        null,
                },
            ],
        }

        let response

        if (editingId.value) {
            response =
                await erpApi.master.shippingTariffs.update(
                    editingId.value,
                    payload
                )
        } else {
            response =
                await erpApi.master.shippingTariffs.create(
                    payload
                )
        }

        const saved =
            unwrapData(response)

        if (!saved) {
            throw new Error(
                'Response API tidak valid.'
            )
        }

        closeModal()

        await loadTariffs()
    } catch (error) {
        console.error(
            'Gagal menyimpan tarif:',
            error
        )

        const apiError =
            getApiError(error)

        alert(
            apiError?.message ||
            'Gagal menyimpan tarif.'
        )
    } finally {
        saving.value = false
    }
}

/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

async function toggleStatus(tariff) {
    const newStatus =
        tariff.status === 'active'
            ? 'inactive'
            : 'active'

    try {
        const payload = {
            status: newStatus,
        }

        await erpApi.master.shippingTariffs.update(
            tariff.tariffId,
            payload
        )

        await loadTariffs()
    } catch (error) {
        console.error(
            'Gagal mengubah status tarif:',
            error
        )

        const apiError =
            getApiError(error)

        alert(
            apiError?.message ||
            'Gagal mengubah status tarif.'
        )
    }
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
    await Promise.all([
        loadProvinces(),
        loadTrucks(),
        loadTariffs(),
    ])
})
</script>