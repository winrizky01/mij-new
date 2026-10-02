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
                <p class="text-sm text-gray-500">Total Truk</p>
                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ trucks.length }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Aktif</p>
                <p class="mt-2 text-2xl font-bold text-emerald-600">
                    {{ activeCount }}
                </p>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p class="text-sm text-gray-500">Nonaktif</p>
                <p class="mt-2 text-2xl font-bold text-gray-400">
                    {{ inactiveCount }}
                </p>
            </div>
        </div>

        <!-- FILTER -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari kode, nomor polisi, atau nama truk..."
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                />

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
                                Nama Truk
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
                                {{ truck.plateNumber }}
                            </td>

                            <td class="px-5 py-4 text-gray-700">
                                {{ truck.name }}
                            </td>

                            <td class="px-5 py-4 text-gray-600">
                                {{ truck.truckType }}
                            </td>

                            <td class="px-5 py-4 text-gray-600">
                                {{ truck.capacity }}
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    :class="truck.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-gray-100 text-gray-500'"
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                >
                                    {{ truck.status === 'active' ? 'Aktif' : 'Nonaktif' }}
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
                                        type="button"
                                        class="rounded-lg px-3 py-1.5 text-xs font-semibold"
                                        :class="truck.status === 'active'
                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'"
                                        @click="toggleStatus(truck)"
                                    >
                                        {{ truck.status === 'active' ? 'Nonaktifkan' : 'Aktifkan' }}
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

                <form class="space-y-4 p-6" @submit.prevent="saveTruck">
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Nomor Polisi
                            </label>
                            <input
                                v-model="form.plateNumber"
                                required
                                placeholder="L 8123 AB"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Nama Truk
                        </label>
                        <input
                            v-model="form.name"
                            required
                            placeholder="Colt Diesel 01"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Jenis Truk
                            </label>
                            <select
                                v-model="form.truckType"
                                required
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            >
                                <option value="">Pilih jenis</option>
                                <option>Colt Diesel</option>
                                <option>Fuso</option>
                                <option>Engkel</option>
                                <option>Tronton</option>
                                <option>Trailer</option>
                                <option>Lainnya</option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Kapasitas
                            </label>
                            <input
                                v-model="form.capacity"
                                placeholder="Contoh: 5 Ton"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Keterangan
                        </label>
                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Keterangan tambahan..."
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

const trucks = ref([
    {
        id: 1,
        code: 'TRK-001',
        plateNumber: 'L 8123 AB',
        name: 'Colt Diesel 01',
        truckType: 'Colt Diesel',
        capacity: '5 Ton',
        notes: '',
        status: 'active',
    },
    {
        id: 2,
        code: 'TRK-002',
        plateNumber: 'L 8456 CD',
        name: 'Colt Diesel 02',
        truckType: 'Colt Diesel',
        capacity: '5 Ton',
        notes: '',
        status: 'active',
    },
    {
        id: 3,
        code: 'TRK-003',
        plateNumber: 'N 9123 EF',
        name: 'Fuso 01',
        truckType: 'Fuso',
        capacity: '10 Ton',
        notes: '',
        status: 'active',
    },
])

const form = reactive({
    code: '',
    plateNumber: '',
    name: '',
    truckType: '',
    capacity: '',
    notes: '',
})

const activeCount = computed(() =>
    trucks.value.filter(item => item.status === 'active').length
)

const inactiveCount = computed(() =>
    trucks.value.filter(item => item.status === 'inactive').length
)

const filteredTrucks = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return trucks.value.filter(truck => {
        const matchesSearch =
            !keyword ||
            truck.code.toLowerCase().includes(keyword) ||
            truck.plateNumber.toLowerCase().includes(keyword) ||
            truck.name.toLowerCase().includes(keyword)

        const matchesStatus =
            !statusFilter.value ||
            truck.status === statusFilter.value

        return matchesSearch && matchesStatus
    })
})

function resetForm() {
    form.code = ''
    form.plateNumber = ''
    form.name = ''
    form.truckType = ''
    form.capacity = ''
    form.notes = ''
}

function openCreate() {
    editingId.value = null
    resetForm()
    showModal.value = true
}

function openEdit(truck) {
    editingId.value = truck.id

    Object.assign(form, {
        code: truck.code,
        plateNumber: truck.plateNumber,
        name: truck.name,
        truckType: truck.truckType,
        capacity: truck.capacity,
        notes: truck.notes || '',
    })

    showModal.value = true
}

function closeModal() {
    showModal.value = false
}

function saveTruck() {
    if (editingId.value) {
        const index = trucks.value.findIndex(
            item => item.id === editingId.value
        )

        if (index !== -1) {
            trucks.value[index] = {
                ...trucks.value[index],
                ...form,
                plateNumber: form.plateNumber.toUpperCase(),
            }
        }
    } else {
        trucks.value.push({
            id: Date.now(),
            ...form,
            plateNumber: form.plateNumber.toUpperCase(),
            status: 'active',
        })
    }

    closeModal()
}

function toggleStatus(truck) {
    truck.status =
        truck.status === 'active'
            ? 'inactive'
            : 'active'
}
</script>