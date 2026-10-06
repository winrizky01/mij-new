<script setup>
import { computed, onMounted, ref } from 'vue'
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    RefreshCw,
    Package,
    CheckCircle2,
    XCircle,
    ArrowRight,
} from 'lucide-vue-next'

import {
    erpApi,
    getApiError,
} from '@/services/api'

import UnitModal from '../../components/erp/unit/UnitModal.vue'

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const units = ref([])
const loading = ref(false)
const error = ref('')

const showModal = ref(false)
const selectedUnit = ref(null)

const filters = ref({
    search: '',
    status: '',
})

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
|
| Sesuaikan import ini dengan helper API MJI kamu jika sudah tersedia.
|
*/

// import erpApi from '../../services/erpApi'

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const filteredUnits = computed(() => {
    const search = filters.value.search.trim().toLowerCase()

    return units.value.filter((unit) => {
        const matchesSearch =
            !search ||
            unit.name?.toLowerCase().includes(search) ||
            unit.code?.toLowerCase().includes(search) ||
            unit.symbol?.toLowerCase().includes(search) ||
            unit.base_unit?.name?.toLowerCase().includes(search)

        const matchesStatus =
            !filters.value.status ||
            String(unit.is_active) === filters.value.status

        return matchesSearch && matchesStatus
    })
})

const totalUnits = computed(() => units.value.length)

const activeUnits = computed(() =>
    units.value.filter((unit) => unit.is_active).length
)

const inactiveUnits = computed(() =>
    units.value.filter((unit) => !unit.is_active).length
)

const derivedUnits = computed(() =>
    units.value.filter((unit) => unit.base_unit_id).length
)

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 6,
    }).format(Number(value || 0))
}

function resetFilters() {
    filters.value = {
        search: '',
        status: '',
    }
}

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

async function fetchUnits() {
    loading.value = true
    error.value = ''

    try {
        const response = await erpApi.master.units.list({
            is_active : true
        })

        units.value = response.data?.data ?? []
    } catch (err) {
        console.error('FETCH UNITS ERROR:', err)

        error.value =
            getApiError(err) ||
            'Gagal mengambil data unit.'
    } finally {
        loading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

function openCreate() {
    selectedUnit.value = null
    showModal.value = true
}

function openEdit(unit) {
    selectedUnit.value = unit
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    selectedUnit.value = null
}

function handleSaved() {
    closeModal()
    fetchUnits()
}

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

async function deleteUnit(unit) {
    const confirmed = window.confirm(
        `Hapus unit "${unit.name}"?`
    )

    if (!confirmed) return

    try {
        await erpApi.master.units.remove(`/units/${unit.id}`)

        await fetchUnits()
    } catch (err) {
        console.error('DELETE UNIT ERROR:', err)

        window.alert(
            getApiError(err) ||
            'Unit gagal dihapus.'
        )
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
    fetchUnits()
})
</script>

<template>
    <div class="space-y-6">

        <!-- ========================================================= -->
        <!-- HEADER -->
        <!-- ========================================================= -->

        <div
            class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
            <div>
                <div class="flex items-center gap-2">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14a2d8]/10 text-[#14a2d8]"
                    >
                        <Package class="h-5 w-5" />
                    </div>

                    <div>
                        <h1
                            class="text-xl font-bold text-slate-800"
                        >
                            Unit
                        </h1>

                        <p class="text-sm text-slate-500">
                            Kelola satuan produk dan konversinya.
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#118fbe]"
                @click="openCreate"
            >
                <Plus class="h-4 w-4" />
                Tambah Unit
            </button>
        </div>

        <!-- ========================================================= -->
        <!-- SUMMARY -->
        <!-- ========================================================= -->

        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <!-- Total -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500">
                            Total Unit
                        </p>

                        <p class="mt-1 text-2xl font-bold text-slate-800">
                            {{ totalUnits }}
                        </p>
                    </div>

                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
                    >
                        <Package class="h-5 w-5" />
                    </div>
                </div>
            </div>

            <!-- Active -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500">
                            Aktif
                        </p>

                        <p class="mt-1 text-2xl font-bold text-slate-800">
                            {{ activeUnits }}
                        </p>
                    </div>

                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
                    >
                        <CheckCircle2 class="h-5 w-5" />
                    </div>
                </div>
            </div>

            <!-- Inactive -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500">
                            Tidak Aktif
                        </p>

                        <p class="mt-1 text-2xl font-bold text-slate-800">
                            {{ inactiveUnits }}
                        </p>
                    </div>

                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"
                    >
                        <XCircle class="h-5 w-5" />
                    </div>
                </div>
            </div>

            <!-- Conversion -->
            <div
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-slate-500">
                            Unit Konversi
                        </p>

                        <p class="mt-1 text-2xl font-bold text-slate-800">
                            {{ derivedUnits }}
                        </p>
                    </div>

                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#14a2d8]"
                    >
                        <ArrowRight class="h-5 w-5" />
                    </div>
                </div>
            </div>

        </div>

        <!-- ========================================================= -->
        <!-- FILTER -->
        <!-- ========================================================= -->

        <div
            class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
            <div class="flex flex-col gap-3 lg:flex-row">

                <!-- Search -->
                <div class="relative flex-1">
                    <Search
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        v-model="filters.search"
                        type="text"
                        placeholder="Cari nama, kode, simbol atau base unit..."
                        class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#14a2d8] focus:bg-white focus:ring-2 focus:ring-[#14a2d8]/10"
                    />
                </div>

                <!-- Status -->
                <select
                    v-model="filters.status"
                    class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                >
                    <option value="">
                        Semua Status
                    </option>

                    <option value="true">
                        Aktif
                    </option>

                    <option value="false">
                        Tidak Aktif
                    </option>
                </select>

                <!-- Reset -->
                <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    @click="resetFilters"
                >
                    <RefreshCw class="h-4 w-4" />
                    Reset
                </button>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- ERROR -->
        <!-- ========================================================= -->

        <div
            v-if="error"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
            {{ error }}
        </div>

        <!-- ========================================================= -->
        <!-- TABLE -->
        <!-- ========================================================= -->

        <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
            <div class="overflow-x-auto">

                <table class="w-full min-w-[850px]">
                    <thead>
                        <tr
                            class="border-b border-slate-200 bg-slate-50"
                        >
                            <th
                                class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Unit
                            </th>

                            <th
                                class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Kode
                            </th>

                            <th
                                class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Simbol
                            </th>

                            <th
                                class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Konversi
                            </th>

                            <th
                                class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Base Unit
                            </th>

                            <th
                                class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">

                        <!-- Loading -->
                        <tr v-if="loading">
                            <td
                                colspan="7"
                                class="px-5 py-12 text-center text-sm text-slate-500"
                            >
                                Memuat data unit...
                            </td>
                        </tr>

                        <!-- Empty -->
                        <tr
                            v-else-if="!filteredUnits.length"
                        >
                            <td
                                colspan="7"
                                class="px-5 py-12 text-center"
                            >
                                <div
                                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                                >
                                    <Package class="h-6 w-6" />
                                </div>

                                <p
                                    class="mt-3 text-sm font-semibold text-slate-700"
                                >
                                    Belum ada unit
                                </p>

                                <p
                                    class="mt-1 text-xs text-slate-500"
                                >
                                    Tambahkan unit pertama untuk digunakan pada produk.
                                </p>

                                <button
                                    type="button"
                                    class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#14a2d8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#118fbe]"
                                    @click="openCreate"
                                >
                                    <Plus class="h-4 w-4" />
                                    Tambah Unit
                                </button>
                            </td>
                        </tr>

                        <!-- Data -->
                        <tr
                            v-for="unit in filteredUnits"
                            :key="unit.id"
                            class="transition hover:bg-slate-50/70"
                        >
                            <!-- Name -->
                            <td class="px-5 py-4">
                                <div>
                                    <p
                                        class="text-sm font-semibold text-slate-800"
                                    >
                                        {{ unit.name }}
                                    </p>

                                    <p
                                        v-if="unit.symbol"
                                        class="mt-0.5 text-xs text-slate-400"
                                    >
                                        {{ unit.symbol }}
                                    </p>
                                </div>
                            </td>

                            <!-- Code -->
                            <td class="px-5 py-4">
                                <span
                                    class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                                >
                                    {{ unit.code }}
                                </span>
                            </td>

                            <!-- Symbol -->
                            <td class="px-5 py-4 text-sm text-slate-600">
                                {{ unit.symbol || '-' }}
                            </td>

                            <!-- Conversion -->
                            <td class="px-5 py-4">
                                <span
                                    v-if="unit.base_unit"
                                    class="text-sm font-semibold text-slate-700"
                                >
                                    {{ formatNumber(unit.conversion_value) }}
                                </span>

                                <span
                                    v-else
                                    class="text-sm text-slate-400"
                                >
                                    Base
                                </span>
                            </td>

                            <!-- Base -->
                            <td class="px-5 py-4">
                                <template v-if="unit.base_unit">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-sm font-medium text-slate-700"
                                        >
                                            {{ unit.base_unit.name }}
                                        </span>

                                        <span
                                            class="text-xs text-slate-400"
                                        >
                                            ({{ unit.base_unit.code }})
                                        </span>
                                    </div>
                                </template>

                                <span
                                    v-else
                                    class="text-xs text-slate-400"
                                >
                                    —
                                </span>
                            </td>

                            <!-- Status -->
                            <td class="px-5 py-4 text-center">
                                <span
                                    v-if="unit.is_active"
                                    class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full bg-emerald-500"
                                    ></span>

                                    Aktif
                                </span>

                                <span
                                    v-else
                                    class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full bg-slate-400"
                                    ></span>

                                    Tidak Aktif
                                </span>
                            </td>

                            <!-- Actions -->
                            <td class="px-5 py-4">
                                <div
                                    class="flex justify-end gap-2"
                                >
                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-[#14a2d8]"
                                        title="Edit"
                                        @click="openEdit(unit)"
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                                        title="Hapus"
                                        @click="deleteUnit(unit)"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>

            </div>
        </div>

    </div>

    <UnitModal
        v-if="showModal"
        :unit="selectedUnit"
        :units="units"
        @close="closeModal"
        @saved="handleSaved"
    />
</template>