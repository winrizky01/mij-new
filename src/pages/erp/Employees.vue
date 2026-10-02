<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Master Karyawan
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola data karyawan, tipe kerja, status, dan informasi kepegawaian.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003f9e]"
                @click="openCreateModal"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4v16m8-8H4"
                    />
                </svg>

                Tambah Karyawan
            </button>
        </div>

        <!-- STATISTICS -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div class="text-xs font-semibold text-gray-500">
                    Total
                </div>

                <div class="mt-2 text-2xl font-bold text-[#003366]">
                    {{ employees.length }}
                </div>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div class="text-xs font-semibold text-gray-500">
                    Aktif
                </div>

                <div class="mt-2 text-2xl font-bold text-green-600">
                    {{ activeCount }}
                </div>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div class="text-xs font-semibold text-gray-500">
                    Tetap
                </div>

                <div class="mt-2 text-2xl font-bold text-blue-600">
                    {{ permanentCount }}
                </div>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div class="text-xs font-semibold text-gray-500">
                    Trial
                </div>

                <div class="mt-2 text-2xl font-bold text-amber-600">
                    {{ trialCount }}
                </div>
            </div>

            <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div class="text-xs font-semibold text-gray-500">
                    Magang
                </div>

                <div class="mt-2 text-2xl font-bold text-purple-600">
                    {{ internCount }}
                </div>
            </div>
        </div>

        <!-- FILTER -->
        <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="grid gap-3 md:grid-cols-4">
                <div class="md:col-span-2">
                    <label class="mb-1.5 block text-xs font-semibold text-gray-600">
                        Cari Karyawan
                    </label>

                    <div class="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 1 6.05 6.05a7.5 7.5 0 0 1 10.6 10.6Z"
                            />
                        </svg>

                        <input
                            v-model="filters.search"
                            type="text"
                            placeholder="Nama, kode, NIK, email..."
                            class="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                        />
                    </div>
                </div>

                <div>
                    <label class="mb-1.5 block text-xs font-semibold text-gray-600">
                        Tipe Karyawan
                    </label>

                    <select
                        v-model="filters.type"
                        class="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    >
                        <option value="">
                            Semua Tipe
                        </option>

                        <option value="tetap">
                            Tetap
                        </option>

                        <option value="trial">
                            Trial
                        </option>

                        <option value="magang">
                            Magang
                        </option>
                    </select>
                </div>

                <div>
                    <label class="mb-1.5 block text-xs font-semibold text-gray-600">
                        Status
                    </label>

                    <select
                        v-model="filters.status"
                        class="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    >
                        <option value="">
                            Semua Status
                        </option>

                        <option value="aktif">
                            Aktif
                        </option>

                        <option value="resign">
                            Resign
                        </option>

                        <option value="pensiun">
                            Pensiun
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- TABLE -->
        <div class="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="border-b border-gray-200 bg-gray-50">
                        <tr>
                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Karyawan
                            </th>

                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Jabatan
                            </th>

                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Departemen
                            </th>

                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Tipe
                            </th>

                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Tanggal Masuk
                            </th>

                            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Status
                            </th>

                            <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="employee in filteredEmployees"
                            :key="employee.id"
                            class="transition hover:bg-gray-50"
                        >
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0052cc]/10 text-sm font-bold text-[#0052cc]"
                                    >
                                        {{ getInitials(employee.name) }}
                                    </div>

                                    <div>
                                        <div class="font-semibold text-gray-900">
                                            {{ employee.name }}
                                        </div>

                                        <div class="mt-0.5 text-xs text-gray-500">
                                            {{ employee.code }} · NIK {{ employee.nik }}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td class="px-5 py-4">
                                <span class="text-sm font-medium text-gray-800">
                                    {{ employee.position }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <span class="text-sm text-gray-600">
                                    {{ employee.department }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="typeClasses(employee.type)"
                                >
                                    {{ typeLabel(employee.type) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <span class="text-sm text-gray-600">
                                    {{ formatDate(employee.joinDate) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="statusClasses(employee.status)"
                                >
                                    {{ statusLabel(employee.status) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-1">
                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#0052cc]"
                                        title="Lihat"
                                        @click="openShowModal(employee)"
                                    >
                                        👁
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#0052cc]"
                                        title="Edit"
                                        @click="openEditModal(employee)"
                                    >
                                        ✎
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                        title="Hapus"
                                        @click="removeEmployee(employee)"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredEmployees.length === 0">
                            <td
                                colspan="7"
                                class="px-5 py-12 text-center"
                            >
                                <div class="text-sm font-medium text-gray-500">
                                    Tidak ada data karyawan.
                                </div>

                                <div class="mt-1 text-xs text-gray-400">
                                    Coba ubah filter atau tambahkan karyawan baru.
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MOBILE -->
        <div class="space-y-3 lg:hidden">
            <div
                v-for="employee in filteredEmployees"
                :key="employee.id"
                class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div
                            class="flex h-11 w-11 items-center justify-center rounded-full bg-[#0052cc]/10 text-sm font-bold text-[#0052cc]"
                        >
                            {{ getInitials(employee.name) }}
                        </div>

                        <div>
                            <div class="font-semibold text-gray-900">
                                {{ employee.name }}
                            </div>

                            <div class="text-xs text-gray-500">
                                {{ employee.code }}
                            </div>
                        </div>
                    </div>

                    <span
                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                        :class="statusClasses(employee.status)"
                    >
                        {{ statusLabel(employee.status) }}
                    </span>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-3">
                    <div>
                        <div class="text-xs text-gray-400">
                            Jabatan
                        </div>

                        <div class="mt-1 text-sm font-medium text-gray-700">
                            {{ employee.position }}
                        </div>
                    </div>

                    <div>
                        <div class="text-xs text-gray-400">
                            Departemen
                        </div>

                        <div class="mt-1 text-sm font-medium text-gray-700">
                            {{ employee.department }}
                        </div>
                    </div>

                    <div>
                        <div class="text-xs text-gray-400">
                            Tipe
                        </div>

                        <div class="mt-1">
                            <span
                                class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                :class="typeClasses(employee.type)"
                            >
                                {{ typeLabel(employee.type) }}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div class="text-xs text-gray-400">
                            Tanggal Masuk
                        </div>

                        <div class="mt-1 text-sm font-medium text-gray-700">
                            {{ formatDate(employee.joinDate) }}
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                    <button
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                        @click="openShowModal(employee)"
                    >
                        Lihat
                    </button>

                    <button
                        type="button"
                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0052cc] hover:bg-blue-100"
                        @click="openEditModal(employee)"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- CREATE -->
    <EmployeeCreateModal
        :show="showCreateModal"
        :employees="employees"
        :departments="departments"
        @close="showCreateModal = false"
        @saved="handleCreateSaved"
    />

    <!-- EDIT -->
    <EmployeeEditModal
        :show="showEditModal"
        :employee="selectedEmployee"
        :departments="departments"
        @close="showEditModal = false"
        @saved="handleEditSaved"
    />

    <!-- SHOW -->
    <EmployeeShowModal
        :show="showShowModal"
        :employee="selectedEmployee"
        @close="showShowModal = false"
        @edit="openEditFromShow"
    />
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

import EmployeeCreateModal from '../../components/erp/employees/EmployeeCreateModal.vue'
import EmployeeEditModal from '../../components/erp/employees/EmployeeEditModal.vue'
import EmployeeShowModal from '../../components/erp/employees/EmployeeShowModal.vue'

const departments = [
    'Management',
    'Operasional',
    'Finance',
    'Accounting',
    'Purchasing',
    'Sales',
    'Marketing',
    'IT',
    'HR',
    'Warehouse',
    'Logistik',
]

const employees = ref([
    {
        id: 1,
        code: 'EMP-0001',
        nik: '3578XXXXXXXXXX',
        name: 'Administrator',
        phone: '081234567890',
        email: 'admin@mji.co.id',
        position: 'Manager',
        department: 'Management',
        type: 'tetap',
        status: 'aktif',
        joinDate: '2022-01-10',
        endDate: null,
        address: 'Surabaya',
        notes: 'Administrator perusahaan.',
    },

    {
        id: 2,
        code: 'EMP-0002',
        nik: '3578XXXXXXXXXX',
        name: 'Budi Santoso',
        phone: '081234567891',
        email: 'budi@mji.co.id',
        position: 'Staff Operasional',
        department: 'Operasional',
        type: 'tetap',
        status: 'aktif',
        joinDate: '2023-04-03',
        endDate: null,
        address: 'Sidoarjo',
        notes: '',
    },

    {
        id: 3,
        code: 'EMP-0003',
        nik: '3578XXXXXXXXXX',
        name: 'Andi Pratama',
        phone: '081234567892',
        email: 'andi@mji.co.id',
        position: 'Staff Purchasing',
        department: 'Purchasing',
        type: 'trial',
        status: 'aktif',
        joinDate: '2026-09-01',
        endDate: null,
        address: 'Mojokerto',
        notes: 'Masa trial.',
    },

    {
        id: 4,
        code: 'EMP-0004',
        nik: '3578XXXXXXXXXX',
        name: 'Siti Rahma',
        phone: '081234567893',
        email: 'siti@mji.co.id',
        position: 'Admin',
        department: 'Finance',
        type: 'magang',
        status: 'aktif',
        joinDate: '2026-08-01',
        endDate: null,
        address: 'Surabaya',
        notes: 'Program magang.',
    },

    {
        id: 5,
        code: 'EMP-0005',
        nik: '3578XXXXXXXXXX',
        name: 'Hendra Wijaya',
        phone: '081234567894',
        email: 'hendra@mji.co.id',
        position: 'Driver',
        department: 'Operasional',
        type: 'tetap',
        status: 'resign',
        joinDate: '2020-05-12',
        endDate: '2026-08-31',
        address: 'Gresik',
        notes: 'Data historis karyawan.',
    },
])

const filters = reactive({
    search: '',
    type: '',
    status: '',
})

const selectedEmployee = ref(null)

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showShowModal = ref(false)

const filteredEmployees = computed(() => {
    const search = filters.search.trim().toLowerCase()

    return employees.value.filter((employee) => {
        const matchesSearch =
            !search ||
            employee.name.toLowerCase().includes(search) ||
            employee.code.toLowerCase().includes(search) ||
            employee.nik.toLowerCase().includes(search) ||
            employee.email.toLowerCase().includes(search)

        const matchesType =
            !filters.type ||
            employee.type === filters.type

        const matchesStatus =
            !filters.status ||
            employee.status === filters.status

        return (
            matchesSearch &&
            matchesType &&
            matchesStatus
        )
    })
})

const activeCount = computed(() =>
    employees.value.filter(
        (employee) => employee.status === 'aktif'
    ).length
)

const permanentCount = computed(() =>
    employees.value.filter(
        (employee) => employee.type === 'tetap'
    ).length
)

const trialCount = computed(() =>
    employees.value.filter(
        (employee) => employee.type === 'trial'
    ).length
)

const internCount = computed(() =>
    employees.value.filter(
        (employee) => employee.type === 'magang'
    ).length
)

function generateEmployeeCode() {
    const numbers = employees.value
        .map((employee) => {
            const match = employee.code?.match(/EMP-(\d+)/)

            return match
                ? Number(match[1])
                : 0
        })
        .filter(Boolean)

    const nextNumber =
        numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1

    return `EMP-${String(nextNumber).padStart(4, '0')}`
}

function getInitials(name) {
    if (!name) return '?'

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
}

function formatDate(date) {
    if (!date) return '-'

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}

function typeLabel(type) {
    return {
        tetap: 'Tetap',
        trial: 'Trial',
        magang: 'Magang',
    }[type] || type
}

function typeClasses(type) {
    return {
        tetap: 'bg-blue-50 text-blue-700',
        trial: 'bg-amber-50 text-amber-700',
        magang: 'bg-purple-50 text-purple-700',
    }[type] || 'bg-gray-100 text-gray-600'
}

function statusLabel(status) {
    return {
        aktif: 'Aktif',
        resign: 'Resign',
        pensiun: 'Pensiun',
    }[status] || status
}

function statusClasses(status) {
    return {
        aktif: 'bg-green-50 text-green-700',
        resign: 'bg-red-50 text-red-700',
        pensiun: 'bg-gray-100 text-gray-600',
    }[status] || 'bg-gray-100 text-gray-600'
}

function openCreateModal() {
    showCreateModal.value = true
}

function openEditModal(employee) {
    selectedEmployee.value = employee
    showEditModal.value = true
}

function openShowModal(employee) {
    selectedEmployee.value = employee
    showShowModal.value = true
}

function openEditFromShow(employee) {
    showShowModal.value = false
    selectedEmployee.value = employee
    showEditModal.value = true
}

function handleCreateSaved(employee) {
    employees.value.unshift({
        id: Date.now(),
        ...employee,
    })

    showCreateModal.value = false
}

function handleEditSaved(updatedEmployee) {
    const index = employees.value.findIndex(
        (employee) => employee.id === updatedEmployee.id
    )

    if (index !== -1) {
        employees.value[index] = {
            ...employees.value[index],
            ...updatedEmployee,
        }
    }

    showEditModal.value = false
}

function removeEmployee(employee) {
    const confirmed = window.confirm(
        `Hapus data karyawan "${employee.name}"?`
    )

    if (!confirmed) return

    employees.value = employees.value.filter(
        (item) => item.id !== employee.id
    )
}
</script>