<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Provinsi & Kabupaten/Kota
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola master wilayah Indonesia untuk kebutuhan tujuan dan tarif pengiriman.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003f9e]"
                @click="openCreate"
            >
                + Tambah Wilayah
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Total Provinsi
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ provinces.length }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Kabupaten / Kota
                </p>

                <p class="mt-2 text-2xl font-bold text-[#0052cc]">
                    {{ totalCities }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Provinsi Aktif
                </p>

                <p class="mt-2 text-2xl font-bold text-emerald-600">
                    {{ activeProvinceCount }}
                </p>
            </div>
        </div>

        <!-- SEARCH -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
                <div class="relative">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Cari provinsi atau kabupaten/kota..."
                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <select
                    v-model="statusFilter"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc]"
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

        <!-- PROVINCES -->
        <div class="space-y-3">
            <div
                v-for="province in filteredProvinces"
                :key="province.id"
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
                <!-- PROVINCE HEADER -->
                <button
                    type="button"
                    class="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-50"
                    @click="toggleProvince(province.id)"
                >
                    <div class="flex min-w-0 items-center gap-4">
                        <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-[#0052cc]"
                        >
                            {{ province.code }}
                        </div>

                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <h2 class="font-semibold text-gray-900">
                                    {{ province.name }}
                                </h2>

                                <span
                                    :class="province.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-gray-100 text-gray-500'"
                                    class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                >
                                    {{ province.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>

                            <p class="mt-0.5 text-xs text-gray-500">
                                {{ province.cities.length }} Kabupaten/Kota
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <span class="hidden text-xs text-gray-400 sm:block">
                            {{ isExpanded(province.id) ? 'Tutup' : 'Lihat wilayah' }}
                        </span>

                        <span
                            class="text-xl text-gray-400 transition"
                            :class="isExpanded(province.id) ? 'rotate-180' : ''"
                        >
                           ⌄
                        </span>
                    </div>
                </button>

                <!-- CITIES -->
                <div
                    v-if="isExpanded(province.id)"
                    class="border-t border-gray-100"
                >
                    <div
                        v-if="province.cities.length"
                        class="divide-y divide-gray-100"
                    >
                        <div
                            v-for="city in province.cities"
                            :key="city.id"
                            class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-xs font-semibold text-gray-500"
                                >
                                    {{ city.type === 'KOTA' ? 'K' : 'KB' }}
                                </div>

                                <div>
                                    <p class="font-medium text-gray-900">
                                        {{ city.name }}
                                    </p>

                                    <p class="text-xs text-gray-500">
                                        {{ city.type }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <span
                                    :class="city.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-gray-100 text-gray-500'"
                                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                                >
                                    {{ city.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                </span>

                                <button
                                    type="button"
                                    class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                    @click="openEdit(province, city)"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else
                        class="px-5 py-8 text-center text-sm text-gray-400"
                    >
                        Belum ada kabupaten/kota pada provinsi ini.
                    </div>
                </div>
            </div>

            <div
                v-if="filteredProvinces.length === 0"
                class="rounded-2xl border border-gray-100 bg-white px-5 py-12 text-center text-sm text-gray-400 shadow-sm"
            >
                Wilayah tidak ditemukan.
            </div>
        </div>

        <!-- MODAL -->
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @click.self="closeModal"
        >
            <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <!-- MODAL HEADER -->
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            {{ editingId ? 'Edit Kabupaten/Kota' : 'Tambah Kabupaten/Kota' }}
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Data wilayah digunakan oleh modul tujuan dan tarif.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl leading-none text-gray-400 hover:text-gray-700"
                        @click="closeModal"
                    >
                        ×
                    </button>
                </div>

                <!-- FORM -->
                <form
                    class="space-y-4 p-6"
                    @submit.prevent="saveCity"
                >
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Provinsi
                        </label>

                        <select
                            v-model="form.provinceId"
                            required
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                Pilih provinsi
                            </option>

                            <option
                                v-for="province in provinces"
                                :key="province.id"
                                :value="province.id"
                            >
                                {{ province.name }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Jenis Wilayah
                        </label>

                        <select
                            v-model="form.type"
                            required
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="KOTA">
                                Kota
                            </option>

                            <option value="KABUPATEN">
                                Kabupaten
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Nama Kabupaten / Kota
                        </label>

                        <input
                            v-model="form.name"
                            required
                            placeholder="Contoh: Kota Mojokerto"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Kode
                        </label>

                        <input
                            v-model="form.code"
                            placeholder="Contoh: 35.76"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#0052cc]"
                        />
                    </div>

                    <div class="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                        <div>
                            <p class="text-sm font-medium text-gray-800">
                                Status Aktif
                            </p>

                            <p class="mt-0.5 text-xs text-gray-500">
                                Wilayah dapat digunakan pada transaksi.
                            </p>
                        </div>

                        <button
                            type="button"
                            class="relative h-6 w-11 rounded-full transition"
                            :class="form.status === 'active'
                                ? 'bg-[#0052cc]'
                                : 'bg-gray-300'"
                            @click="form.status = form.status === 'active' ? 'inactive' : 'active'"
                        >
                            <span
                                class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition"
                                :class="form.status === 'active'
                                    ? 'left-6'
                                    : 'left-1'"
                            />
                        </button>
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
                            Simpan
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
const statusFilter = ref('')
const showModal = ref(false)
const editingId = ref(null)
const expandedProvinces = ref([])

const form = reactive({
    provinceId: '',
    type: 'KOTA',
    name: '',
    code: '',
    status: 'active',
})

/*
|--------------------------------------------------------------------------
| MASTER PROVINSI INDONESIA
|--------------------------------------------------------------------------
| Untuk sementara kota/kabupaten diisi beberapa contoh.
| Nanti dataset kota/kabupaten lengkap dimasukkan ke master wilayah.
*/
const provinces = ref([
    { id: 1, code: '11', name: 'Aceh', status: 'active', cities: [] },
    { id: 2, code: '12', name: 'Sumatera Utara', status: 'active', cities: [] },
    { id: 3, code: '13', name: 'Sumatera Barat', status: 'active', cities: [] },
    { id: 4, code: '14', name: 'Riau', status: 'active', cities: [] },
    { id: 5, code: '15', name: 'Jambi', status: 'active', cities: [] },
    { id: 6, code: '16', name: 'Sumatera Selatan', status: 'active', cities: [] },
    { id: 7, code: '17', name: 'Bengkulu', status: 'active', cities: [] },
    { id: 8, code: '18', name: 'Lampung', status: 'active', cities: [] },
    { id: 9, code: '19', name: 'Kepulauan Bangka Belitung', status: 'active', cities: [] },
    { id: 10, code: '21', name: 'Kepulauan Riau', status: 'active', cities: [] },

    { id: 11, code: '31', name: 'DKI Jakarta', status: 'active', cities: [] },
    { id: 12, code: '32', name: 'Jawa Barat', status: 'active', cities: [] },
    { id: 13, code: '33', name: 'Jawa Tengah', status: 'active', cities: [] },
    { id: 14, code: '34', name: 'DI Yogyakarta', status: 'active', cities: [] },

    {
        id: 15,
        code: '35',
        name: 'Jawa Timur',
        status: 'active',
        cities: [
            {
                id: 3501,
                code: '35.01',
                name: 'Kabupaten Pacitan',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3502,
                code: '35.02',
                name: 'Kabupaten Ponorogo',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3503,
                code: '35.03',
                name: 'Kabupaten Trenggalek',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3504,
                code: '35.04',
                name: 'Kabupaten Tulungagung',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3510,
                code: '35.10',
                name: 'Kabupaten Mojokerto',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3515,
                code: '35.15',
                name: 'Kabupaten Sidoarjo',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3516,
                code: '35.16',
                name: 'Kabupaten Madiun',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3517,
                code: '35.17',
                name: 'Kabupaten Magetan',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3518,
                code: '35.18',
                name: 'Kabupaten Ngawi',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3520,
                code: '35.20',
                name: 'Kabupaten Jombang',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3525,
                code: '35.25',
                name: 'Kabupaten Gresik',
                type: 'KABUPATEN',
                status: 'active',
            },
            {
                id: 3576,
                code: '35.76',
                name: 'Kota Mojokerto',
                type: 'KOTA',
                status: 'active',
            },
            {
                id: 3578,
                code: '35.78',
                name: 'Kota Surabaya',
                type: 'KOTA',
                status: 'active',
            },
        ],
    },

    { id: 16, code: '36', name: 'Banten', status: 'active', cities: [] },

    { id: 17, code: '51', name: 'Bali', status: 'active', cities: [] },
    { id: 18, code: '52', name: 'Nusa Tenggara Barat', status: 'active', cities: [] },
    { id: 19, code: '53', name: 'Nusa Tenggara Timur', status: 'active', cities: [] },

    { id: 20, code: '61', name: 'Kalimantan Barat', status: 'active', cities: [] },
    { id: 21, code: '62', name: 'Kalimantan Tengah', status: 'active', cities: [] },
    { id: 22, code: '63', name: 'Kalimantan Selatan', status: 'active', cities: [] },
    { id: 23, code: '64', name: 'Kalimantan Timur', status: 'active', cities: [] },
    { id: 24, code: '65', name: 'Kalimantan Utara', status: 'active', cities: [] },

    { id: 25, code: '71', name: 'Sulawesi Utara', status: 'active', cities: [] },
    { id: 26, code: '72', name: 'Sulawesi Tengah', status: 'active', cities: [] },
    { id: 27, code: '73', name: 'Sulawesi Selatan', status: 'active', cities: [] },
    { id: 28, code: '74', name: 'Sulawesi Tenggara', status: 'active', cities: [] },
    { id: 29, code: '75', name: 'Gorontalo', status: 'active', cities: [] },
    { id: 30, code: '76', name: 'Sulawesi Barat', status: 'active', cities: [] },

    { id: 31, code: '81', name: 'Maluku', status: 'active', cities: [] },
    { id: 32, code: '82', name: 'Maluku Utara', status: 'active', cities: [] },

    { id: 33, code: '91', name: 'Papua', status: 'active', cities: [] },
    { id: 34, code: '92', name: 'Papua Barat', status: 'active', cities: [] },
    { id: 35, code: '93', name: 'Papua Selatan', status: 'active', cities: [] },
    { id: 36, code: '94', name: 'Papua Tengah', status: 'active', cities: [] },
    { id: 37, code: '95', name: 'Papua Pegunungan', status: 'active', cities: [] },
    { id: 38, code: '96', name: 'Papua Barat Daya', status: 'active', cities: [] },
])

const filteredProvinces = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return provinces.value
        .map(province => {
            if (!keyword) {
                return province
            }

            const provinceMatch =
                province.name.toLowerCase().includes(keyword)

            const matchingCities = province.cities.filter(city =>
                city.name.toLowerCase().includes(keyword)
            )

            if (provinceMatch) {
                return province
            }

            if (matchingCities.length) {
                return {
                    ...province,
                    cities: matchingCities,
                }
            }

            return null
        })
        .filter(Boolean)
        .filter(province => {
            if (!statusFilter.value) {
                return true
            }

            return province.status === statusFilter.value
        })
})

const totalCities = computed(() =>
    provinces.value.reduce(
        (total, province) => total + province.cities.length,
        0
    )
)

const activeProvinceCount = computed(() =>
    provinces.value.filter(
        province => province.status === 'active'
    ).length
)

function isExpanded(id) {
    return expandedProvinces.value.includes(id)
}

function toggleProvince(id) {
    if (expandedProvinces.value.includes(id)) {
        expandedProvinces.value =
            expandedProvinces.value.filter(item => item !== id)

        return
    }

    expandedProvinces.value.push(id)
}

function resetForm() {
    Object.assign(form, {
        provinceId: '',
        type: 'KOTA',
        name: '',
        code: '',
        status: 'active',
    })
}

function openCreate() {
    editingId.value = null
    resetForm()
    showModal.value = true
}

function openEdit(province, city) {
    editingId.value = city.id

    Object.assign(form, {
        provinceId: province.id,
        type: city.type,
        name: city.name,
        code: city.code || '',
        status: city.status,
    })

    showModal.value = true
}

function closeModal() {
    showModal.value = false
}

function saveCity() {
    const province = provinces.value.find(
        item => item.id === Number(form.provinceId)
    )

    if (!province) {
        return
    }

    if (editingId.value) {
        const city = province.cities.find(
            item => item.id === editingId.value
        )

        if (city) {
            Object.assign(city, {
                type: form.type,
                name: form.name,
                code: form.code,
                status: form.status,
            })
        }
    } else {
        province.cities.push({
            id: Date.now(),
            code: form.code,
            name: form.name,
            type: form.type,
            status: form.status,
        })
    }

    expandedProvinces.value = [
        ...new Set([
            ...expandedProvinces.value,
            province.id,
        ]),
    ]

    closeModal()
}
</script>