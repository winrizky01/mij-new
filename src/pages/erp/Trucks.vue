<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Truk
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola armada kendaraan operasional MJI.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003f9e]"
                @click="openCreate"
            >
                + Tambah Truk
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Total Truk
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ trucks.length }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Aktif
                </p>

                <p class="mt-2 text-2xl font-bold text-emerald-600">
                    {{ activeCount }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">
                    Nonaktif
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-400">
                    {{ inactiveCount }}
                </p>
            </div>
        </div>

        <!-- FILTER -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px]">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari kode, nomor polisi, merk, atau model..."
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="statusFilter"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua Status
                    </option>

                    <option value="available">
                        Tersedia
                    </option>

                    <option value="in_use">
                        Digunakan
                    </option>

                    <option value="maintenance">
                        Maintenance
                    </option>

                    <option value="inactive">
                        Nonaktif
                    </option>
                </select>
            </div>
        </div>

        <!-- TABLE -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Kode
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Nomor Polisi
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Kendaraan
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Jenis
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Kapasitas
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Status
                            </th>

                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="truck in filteredTrucks"
                            :key="truck.id"
                            class="transition hover:bg-gray-50"
                        >
                            <td class="px-5 py-4 font-semibold text-[#003366]">
                                {{ truck.code }}
                            </td>

                            <td class="px-5 py-4 font-semibold text-gray-900">
                                {{ truck.plate_number }}
                            </td>

                            <td class="px-5 py-4 text-gray-700">
                                <div class="font-medium">
                                    {{ vehicleName(truck) }}
                                </div>

                                <div
                                    v-if="truck.brand || truck.model"
                                    class="mt-0.5 text-xs text-gray-400"
                                >
                                    {{ truck.brand }} {{ truck.model }}
                                </div>
                            </td>

                            <td class="px-5 py-4 text-gray-600">
                                {{ truck.truck_type?.name || '-' }}
                            </td>

                            <td class="px-5 py-4 text-gray-600">
                                {{ formatCapacity(truck) }}
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="statusClass(truck.status)"
                                >
                                    {{ statusLabel(truck.status) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                        @click="openEdit(truck)"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        v-if="truck.status !== 'in_use'"
                                        type="button"
                                        class="rounded-lg px-3 py-1.5 text-xs font-semibold"
                                        :class="
                                            truck.status === 'inactive'
                                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                        "
                                        @click="toggleStatus(truck)"
                                    >
                                        {{
                                            truck.status === 'inactive'
                                                ? 'Aktifkan'
                                                : 'Nonaktifkan'
                                        }}
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredTrucks.length === 0">
                            <td
                                colspan="7"
                                class="px-5 py-12 text-center text-gray-400"
                            >
                                Tidak ada data truk.
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
            <div class="w-full max-w-xl rounded-2xl bg-white shadow-xl">
                <!-- MODAL HEADER -->
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            {{ editingId ? 'Edit Truk' : 'Tambah Truk' }}
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Data armada kendaraan operasional.
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

                <!-- FORM -->
                <form
                    class="space-y-4 p-6"
                    @submit.prevent="saveTruck"
                >
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <!-- CODE -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Kode Truk
                            </label>

                            <input
                                v-model="form.code"
                                required
                                placeholder="TRK-001"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <!-- PLATE -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Nomor Polisi
                            </label>

                            <input
                                v-model="form.plate_number"
                                required
                                placeholder="L 8123 AB"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <!-- BRAND + MODEL -->
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Merk
                            </label>

                            <input
                                v-model="form.brand"
                                placeholder="Mitsubishi"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Model
                            </label>

                            <input
                                v-model="form.model"
                                placeholder="Canter FE 74"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <!-- TYPE -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Jenis Truk
                        </label>

                        <select
                            v-model="form.truck_type_id"
                            required
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        >
                            <option value="">
                                Pilih jenis truk
                            </option>

                            <option
                                v-for="type in truckTypes"
                                :key="type.id"
                                :value="type.id"
                            >
                                {{ type.code }} - {{ type.name }}
                            </option>
                        </select>

                        <p
                            v-if="truckTypes.length === 0"
                            class="mt-1.5 text-xs text-amber-600"
                        >
                            Belum ada master jenis truk.
                        </p>
                    </div>

                    <!-- CAPACITY -->
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Kapasitas
                            </label>

                            <input
                                v-model="form.capacity"
                                type="number"
                                min="0"
                                step="0.001"
                                placeholder="5"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Satuan Kapasitas
                            </label>

                            <input
                                v-model="form.capacity_unit"
                                placeholder="Ton"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>
                    </div>

                    <!-- STATUS -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            v-model="form.status"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        >
                            <option value="available">
                                Tersedia
                            </option>

                            <option value="in_use">
                                Digunakan
                            </option>

                            <option value="maintenance">
                                Maintenance
                            </option>

                            <option value="inactive">
                                Nonaktif
                            </option>
                        </select>
                    </div>

                    <!-- NOTES -->
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Keterangan
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Keterangan tambahan..."
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        ></textarea>
                    </div>

                    <!-- ACTION -->
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
                            :disabled="saving"
                            class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {{ saving ? 'Menyimpan...' : 'Simpan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { erpApi, getApiError } from '@/services/api'

const search = ref('')
const statusFilter = ref('')

const showModal = ref(false)
const editingId = ref(null)
const saving = ref(false)

const trucks = ref([])
const truckTypes = ref([])

const form = reactive({
    code: '',
    plate_number: '',
    truck_type_id: '',
    brand: '',
    model: '',
    capacity: '',
    capacity_unit: '',
    status: 'available',
    notes: '',
})

const activeCount = computed(() =>
    trucks.value.filter(item =>
        ['available', 'in_use'].includes(item.status)
    ).length
)

const inactiveCount = computed(() =>
    trucks.value.filter(item =>
        ['inactive', 'maintenance'].includes(item.status)
    ).length
)

const filteredTrucks = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return trucks.value.filter(truck => {
        const typeName =
            truck.truck_type?.name?.toLowerCase() || ''

        const matchesSearch =
            !keyword ||
            (truck.code || '').toLowerCase().includes(keyword) ||
            (truck.plate_number || '').toLowerCase().includes(keyword) ||
            (truck.brand || '').toLowerCase().includes(keyword) ||
            (truck.model || '').toLowerCase().includes(keyword) ||
            typeName.includes(keyword)

        const matchesStatus =
            !statusFilter.value ||
            truck.status === statusFilter.value

        return matchesSearch && matchesStatus
    })
})

function resetForm() {
    Object.assign(form, {
        code: '',
        plate_number: '',
        truck_type_id: '',
        brand: '',
        model: '',
        capacity: '',
        capacity_unit: '',
        status: 'available',
        notes: '',
    })
}

function openCreate() {
    editingId.value = null
    resetForm()
    showModal.value = true
}

function openEdit(truck) {
    editingId.value = truck.id

    Object.assign(form, {
        code: truck.code || '',
        plate_number: truck.plate_number || '',
        truck_type_id: truck.truck_type_id || '',
        brand: truck.brand || '',
        model: truck.model || '',
        capacity: truck.capacity ?? '',
        capacity_unit: truck.capacity_unit || '',
        status: truck.status || 'available',
        notes: truck.notes || '',
    })

    showModal.value = true
}

function closeModal() {
    showModal.value = false
}

function vehicleName(truck) {
    const parts = [
        truck.brand,
        truck.model,
    ].filter(Boolean)

    return parts.length
        ? parts.join(' ')
        : truck.truck_type?.name || '-'
}

function formatCapacity(truck) {
    if (
        truck.capacity === null ||
        truck.capacity === undefined ||
        truck.capacity === ''
    ) {
        return '-'
    }

    return `${truck.capacity} ${truck.capacity_unit || ''}`.trim()
}

function statusLabel(status) {
    const labels = {
        available: 'Tersedia',
        in_use: 'Digunakan',
        maintenance: 'Maintenance',
        inactive: 'Nonaktif',
    }

    return labels[status] || status
}

function statusClass(status) {
    const classes = {
        available: 'bg-emerald-50 text-emerald-700',
        in_use: 'bg-blue-50 text-blue-700',
        maintenance: 'bg-amber-50 text-amber-700',
        inactive: 'bg-gray-100 text-gray-500',
    }

    return classes[status] || 'bg-gray-100 text-gray-500'
}

async function loadTruckTypes() {
    try {
        const response = await erpApi.master.truckTypes.list({
            is_active: true,
        })

        truckTypes.value = Array.isArray(response)
            ? response
            : response?.data ?? []
    } catch (error) {
        console.error('Gagal memuat jenis truk:', error)
        truckTypes.value = []
    }
}

async function loadTrucks() {
    try {
        const response = await erpApi.master.trucks.list()

        trucks.value = Array.isArray(response)
            ? response
            : response?.data ?? []
    } catch (error) {
        console.error('Gagal memuat truk:', error)

        alert(
            getApiError(error)?.message ||
            'Gagal memuat data truk.'
        )

        trucks.value = []
    }
}

async function saveTruck() {
    saving.value = true

    try {
        const payload = {
            code: form.code.trim(),
            plate_number: form.plate_number.trim().toUpperCase(),
            truck_type_id: form.truck_type_id
                ? Number(form.truck_type_id)
                : null,
            brand: form.brand.trim() || null,
            model: form.model.trim() || null,
            capacity: form.capacity !== ''
                ? Number(form.capacity)
                : null,
            capacity_unit: form.capacity_unit.trim() || null,
            status: form.status,
            notes: form.notes.trim() || null,
        }

        let response

        if (editingId.value) {
            response = await erpApi.master.trucks.update(
                editingId.value,
                payload
            )
        } else {
            response = await erpApi.master.trucks.create(payload)
        }

        const savedTruck = response?.data ?? response

        if (editingId.value) {
            const index = trucks.value.findIndex(
                item => item.id === editingId.value
            )

            if (index !== -1) {
                trucks.value[index] = savedTruck
            }
        } else {
            trucks.value.unshift(savedTruck)
        }

        // TUTUP MODAL
        closeModal()

    } catch (error) {
        console.error('Gagal menyimpan truk:', error)

        const apiError = getApiError(error)

        alert(
            apiError?.message ||
            'Gagal menyimpan data truk.'
        )
    } finally {
        saving.value = false
    }
}

async function toggleStatus(truck) {
    if (truck.status === 'in_use') {
        alert('Truk yang sedang digunakan tidak dapat dinonaktifkan.')
        return
    }

    const newStatus =
        truck.status === 'inactive'
            ? 'available'
            : 'inactive'

    try {
        const response = await erpApi.master.trucks.update(
            truck.id,
            {
                status: newStatus,
            }
        )

        const updatedTruck = response?.data ?? response

        const index = trucks.value.findIndex(
            item => item.id === truck.id
        )

        if (index !== -1) {
            trucks.value[index] = updatedTruck
        }
    } catch (error) {
        console.error('Gagal mengubah status truk:', error)

        const apiError = getApiError(error)

        alert(
            apiError?.message ||
            'Gagal mengubah status truk.'
        )
    }
}

onMounted(async () => {
    await Promise.all([
        loadTrucks(),
        loadTruckTypes(),
    ])
})
</script>