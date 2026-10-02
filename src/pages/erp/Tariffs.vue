<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Tarif Pengiriman
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Kelola tarif tagihan vendor dan pembayaran driver berdasarkan tujuan dan armada.
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
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Total Tarif</p>
                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ tariffs.length }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Kota</p>
                <p class="mt-2 text-2xl font-bold text-[#0052cc]">
                    {{ cityCount }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Tarif Aktif</p>
                <p class="mt-2 text-2xl font-bold text-emerald-600">
                    {{ activeCount }}
                </p>
            </div>
        </div>

        <!-- FILTER -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari kota, provinsi, atau jenis tarif..."
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="truckTypeFilter"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">Semua Jenis Truk</option>
                    <option
                        v-for="type in truckTypes"
                        :key="type"
                        :value="type"
                    >
                        {{ type }}
                    </option>
                </select>

                <select
                    v-model="statusFilter"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
            </div>
        </div>

        <!-- TABLE -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div class="overflow-x-auto">
                <table class="min-w-[1100px] w-full text-sm">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Kota
                            </th>
                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Provinsi
                            </th>
                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Jenis Tarif
                            </th>
                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Truk
                            </th>
                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
                                Vendor
                            </th>
                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
                                Driver
                            </th>
                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
                                Tambahan
                            </th>
                            <th class="px-5 py-4 text-center font-semibold text-gray-600">
                                Status
                            </th>
                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
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
                            <td class="px-5 py-4">
                                <p class="font-semibold text-gray-900">
                                    {{ tariff.city }}
                                </p>
                            </td>

                            <td class="px-5 py-4 text-gray-600">
                                {{ tariff.province }}
                            </td>

                            <td class="px-5 py-4">
                                <span class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                    {{ tariff.tariffType }}
                                </span>
                            </td>

                            <td class="px-5 py-4 text-gray-600">
                                {{ tariff.truckType }}
                            </td>

                            <td class="px-5 py-4 text-right font-semibold text-gray-900">
                                {{ formatCurrency(tariff.vendorRate) }}
                            </td>

                            <td class="px-5 py-4 text-right font-semibold text-gray-900">
                                {{ formatCurrency(tariff.driverRate) }}
                            </td>

                            <td class="px-5 py-4 text-right">
                                <div class="text-xs">
                                    <div class="text-gray-600">
                                        V: {{ formatCurrency(tariff.vendorAdditional) }}
                                    </div>
                                    <div class="text-gray-600">
                                        D: {{ formatCurrency(tariff.driverAdditional) }}
                                    </div>
                                </div>
                            </td>

                            <td class="px-5 py-4 text-center">
                                <span
                                    :class="tariff.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-gray-100 text-gray-500'"
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                >
                                    {{ tariff.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                        @click="openEdit(tariff)"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                                        @click="toggleStatus(tariff)"
                                    >
                                        {{ tariff.status === 'active' ? 'Nonaktifkan' : 'Aktifkan' }}
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredTariffs.length === 0">
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
            <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            {{ editingId ? 'Edit Tarif' : 'Tambah Tarif' }}
                        </h2>
                        <p class="mt-1 text-xs text-gray-500">
                            Satu kota dapat memiliki beberapa tarif.
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
                    class="space-y-5 p-6"
                    @submit.prevent="saveTariff"
                >
                    <div class="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                        <strong>Catatan:</strong>
                        Kota tidak dibuat unik. Tarif berbeda untuk kota yang sama tetap dapat dibuat.
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Provinsi
                            </label>

                            <select
                                v-model="form.province"
                                required
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            >
                                <option value="">Pilih provinsi</option>
                                <option
                                    v-for="province in provinces"
                                    :key="province"
                                    :value="province"
                                >
                                    {{ province }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Kota
                            </label>

                            <input
                                v-model="form.city"
                                required
                                placeholder="Contoh: Mojokerto"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Jenis Tarif
                            </label>

                            <input
                                v-model="form.tariffType"
                                required
                                placeholder="Contoh: Reguler"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Jenis Truk
                            </label>

                            <select
                                v-model="form.truckType"
                                required
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            >
                                <option value="">Pilih jenis truk</option>
                                <option
                                    v-for="type in truckTypes"
                                    :key="type"
                                    :value="type"
                                >
                                    {{ type }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Tarif Vendor
                            </label>

                            <input
                                v-model.number="form.vendorRate"
                                type="number"
                                min="0"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Tarif Driver
                            </label>

                            <input
                                v-model.number="form.driverRate"
                                type="number"
                                min="0"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>
                    </div>

                    <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p class="mb-3 text-sm font-semibold text-gray-800">
                            Tambahan Tarif
                        </p>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                    Tambahan Vendor
                                </label>

                                <input
                                    v-model.number="form.vendorAdditional"
                                    type="number"
                                    min="0"
                                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                />
                            </div>

                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                    Tambahan Driver
                                </label>

                                <input
                                    v-model.number="form.driverAdditional"
                                    type="number"
                                    min="0"
                                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Keterangan
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Keterangan tarif..."
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        />
                    </div>

                    <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            @click="closeModal"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e]"
                        >
                            Simpan Tarif
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const search = ref('')
const truckTypeFilter = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const editingId = ref(null)

const truckTypes = [
    'Colt Diesel',
    'Engkel',
    'Fuso',
    'Tronton',
    'Trailer',
    'Lainnya',
]

const provinces = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Kepulauan Riau',
    'Jambi',
    'Sumatera Selatan',
    'Kepulauan Bangka Belitung',
    'Bengkulu',
    'Lampung',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Banten',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Sulawesi Tengah',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Gorontalo',
    'Sulawesi Barat',
    'Maluku',
    'Maluku Utara',
    'Papua',
    'Papua Barat',
    'Papua Selatan',
    'Papua Tengah',
    'Papua Pegunungan',
    'Papua Barat Daya',
]

const tariffs = ref([
    {
        id: 1,
        province: 'Jawa Timur',
        city: 'Mojokerto',
        tariffType: 'Reguler',
        truckType: 'Colt Diesel',
        vendorRate: 850000,
        driverRate: 350000,
        vendorAdditional: 0,
        driverAdditional: 0,
        notes: '',
        status: 'active',
    },
    {
        id: 2,
        province: 'Jawa Timur',
        city: 'Mojokerto',
        tariffType: 'Khusus',
        truckType: 'Colt Diesel',
        vendorRate: 950000,
        driverRate: 400000,
        vendorAdditional: 100000,
        driverAdditional: 50000,
        notes: 'Tarif dengan tambahan operasional.',
        status: 'active',
    },
    {
        id: 3,
        province: 'Jawa Timur',
        city: 'Jombang',
        tariffType: 'Reguler',
        truckType: 'Fuso',
        vendorRate: 1200000,
        driverRate: 500000,
        vendorAdditional: 0,
        driverAdditional: 0,
        notes: '',
        status: 'active',
    },
])

const form = reactive({
    province: '',
    city: '',
    tariffType: '',
    truckType: '',
    vendorRate: 0,
    driverRate: 0,
    vendorAdditional: 0,
    driverAdditional: 0,
    notes: '',
})

const filteredTariffs = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return tariffs.value.filter(tariff => {
        const matchesSearch =
            !keyword ||
            tariff.city.toLowerCase().includes(keyword) ||
            tariff.province.toLowerCase().includes(keyword) ||
            tariff.tariffType.toLowerCase().includes(keyword)

        const matchesTruck =
            !truckTypeFilter.value ||
            tariff.truckType === truckTypeFilter.value

        const matchesStatus =
            !statusFilter.value ||
            tariff.status === statusFilter.value

        return matchesSearch && matchesTruck && matchesStatus
    })
})

const activeCount = computed(() =>
    tariffs.value.filter(item => item.status === 'active').length
)

const cityCount = computed(() =>
    new Set(tariffs.value.map(item => `${item.province}-${item.city}`)).size
)

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0)
}

function resetForm() {
    Object.assign(form, {
        province: '',
        city: '',
        tariffType: '',
        truckType: '',
        vendorRate: 0,
        driverRate: 0,
        vendorAdditional: 0,
        driverAdditional: 0,
        notes: '',
    })
}

function openCreate() {
    editingId.value = null
    resetForm()
    showModal.value = true
}

function openEdit(tariff) {
    editingId.value = tariff.id

    Object.assign(form, {
        province: tariff.province,
        city: tariff.city,
        tariffType: tariff.tariffType,
        truckType: tariff.truckType,
        vendorRate: tariff.vendorRate,
        driverRate: tariff.driverRate,
        vendorAdditional: tariff.vendorAdditional,
        driverAdditional: tariff.driverAdditional,
        notes: tariff.notes || '',
    })

    showModal.value = true
}

function closeModal() {
    showModal.value = false
}

function saveTariff() {
    if (editingId.value) {
        const index = tariffs.value.findIndex(
            item => item.id === editingId.value
        )

        if (index !== -1) {
            tariffs.value[index] = {
                ...tariffs.value[index],
                ...form,
            }
        }
    } else {
        tariffs.value.push({
            id: Date.now(),
            ...form,
            status: 'active',
        })
    }

    closeModal()
}

function toggleStatus(tariff) {
    tariff.status =
        tariff.status === 'active'
            ? 'inactive'
            : 'active'
}
</script>