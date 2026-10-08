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
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="loading"
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


        <!-- ERROR -->
        <div
            v-if="error"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
            {{ error }}
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

                        <option
                            v-for="status in employeeStatuses"
                            :key="status.id"
                            :value="status.code"
                        >
                            {{ status.name }}
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

                        <option value="active">
                            Aktif
                        </option>

                        <option value="resigned">
                            Resign
                        </option>

                        <option value="retired">
                            Pensiun
                        </option>
                    </select>

                </div>

            </div>

        </div>


        <!-- LOADING -->
        <div
            v-if="loading"
            class="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center shadow-sm"
        >
            <div class="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#0052cc]"></div>

            <p class="mt-3 text-sm text-gray-500">
                Memuat data karyawan...
            </p>
        </div>


        <!-- DESKTOP TABLE -->
        <div
            v-else
            class="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block"
        >

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
                                            {{ employee.employee_number }}
                                            <span v-if="employee.nik">
                                                · NIK {{ employee.nik }}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </td>


                            <td class="px-5 py-4">
                                <span class="text-sm font-medium text-gray-800">
                                    {{ employee.position || '-' }}
                                </span>
                            </td>


                            <td class="px-5 py-4">
                                <span class="text-sm text-gray-600">
                                    {{ employee.department?.name || '-' }}
                                </span>
                            </td>


                            <td class="px-5 py-4">

                                <span
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="typeClasses(employee.employment_type)"
                                >
                                    {{ typeLabel(employee.employment_type) }}
                                </span>

                            </td>


                            <td class="px-5 py-4">

                                <span class="text-sm text-gray-600">
                                    {{ formatDate(employee.join_date) }}
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
                                <div class="flex justify-end gap-1.5">

                                    <!-- Detail -->
                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                        title="Lihat"
                                        @click="openShowModal(employee)"
                                    >
                                        <EyeIcon class="h-4 w-4" />
                                    </button>

                                    <!-- Edit -->
                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                        title="Edit"
                                        @click="openEditModal(employee)"
                                    >
                                        <PencilIcon class="h-4 w-4" />
                                    </button>

                                    <!-- Hapus -->
                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                        title="Hapus"
                                        @click="removeEmployee(employee)"
                                    >
                                        <Trash2Icon class="h-4 w-4" />
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
        <div
            v-if="!loading"
            class="space-y-3 lg:hidden"
        >

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
                                {{ employee.employee_number }}
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
                            {{ employee.position || '-' }}
                        </div>

                    </div>


                    <div>

                        <div class="text-xs text-gray-400">
                            Departemen
                        </div>

                        <div class="mt-1 text-sm font-medium text-gray-700">
                            {{ employee.department?.name || '-' }}
                        </div>

                    </div>


                    <div>

                        <div class="text-xs text-gray-400">
                            Tipe
                        </div>

                        <div class="mt-1">

                            <span
                                class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                :class="typeClasses(employee.employment_type)"
                            >
                                {{ typeLabel(employee.employment_type) }}
                            </span>

                        </div>

                    </div>


                    <div>

                        <div class="text-xs text-gray-400">
                            Tanggal Masuk
                        </div>

                        <div class="mt-1 text-sm font-medium text-gray-700">
                            {{ formatDate(employee.join_date) }}
                        </div>

                    </div>

                </div>


                <div class="flex gap-1.5">

                    <button
                        type="button"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        title="Lihat"
                        @click="openShowModal(employee)"
                    >
                        <EyeIcon class="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Edit"
                        @click="openEditModal(employee)"
                    >
                        <PencilIcon class="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        title="Hapus"
                        @click="removeEmployee(employee)"
                    >
                        <Trash2Icon class="h-4 w-4" />
                    </button>

                </div>

            </div>


            <div
                v-if="filteredEmployees.length === 0"
                class="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm"
            >
                <div class="text-sm font-medium text-gray-500">
                    Tidak ada data karyawan.
                </div>

                <div class="mt-1 text-xs text-gray-400">
                    Coba ubah filter atau tambahkan karyawan baru.
                </div>
            </div>

        </div>

    </div>


    <!-- CREATE -->
    <EmployeeCreateModal
        :show="showCreateModal"
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
import {
    EyeIcon,
    PencilIcon,
    Trash2Icon,
} from 'lucide-vue-next'

import {
    computed,
    onMounted,
    reactive,
    ref,
} from 'vue'

import EmployeeCreateModal
    from '../../components/erp/employees/EmployeeCreateModal.vue'

import EmployeeEditModal
    from '../../components/erp/employees/EmployeeEditModal.vue'

import EmployeeShowModal
    from '../../components/erp/employees/EmployeeShowModal.vue'

import {
    erpApi,
    getApiError,
} from '@/services/api'


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const employees = ref([])
const employeeStatuses = ref([])
const departments = ref([])
const loading = ref(false)
const error = ref('')
const selectedEmployee = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)

const showShowModal = ref(false)
const filters = reactive({
    search: '',
    type: '',
    status: '',
})

/*
|--------------------------------------------------------------------------
| FILTERED EMPLOYEES
|--------------------------------------------------------------------------
*/

const filteredEmployees = computed(() => {

    const search =
        filters.search
            .trim()
            .toLowerCase()

    return employees.value.filter(
        (employee) => {

            const matchesSearch =
                !search ||
                employee.name
                    ?.toLowerCase()
                    .includes(search) ||
                employee.employee_number
                    ?.toLowerCase()
                    .includes(search) ||
                employee.nik
                    ?.toLowerCase()
                    .includes(search) ||
                employee.email
                    ?.toLowerCase()
                    .includes(search)

            const matchesType =
                !filters.type ||
                employee.employment_type === filters.type

            const matchesStatus =
                !filters.status ||
                employee.status === filters.status

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            )
        }
    )
})


/*
|--------------------------------------------------------------------------
| STATISTICS
|--------------------------------------------------------------------------
*/

const activeCount = computed(() =>
    employees.value.filter(
        employee =>
            employee.status === 'active'
    ).length
)


const permanentCount = computed(() =>
    employees.value.filter(
        employee =>
            employee.employment_type === 'permanent'
    ).length
)


const trialCount = computed(() =>
    employees.value.filter(
        employee =>
            employee.employment_type === 'trial'
    ).length
)


const internCount = computed(() =>
    employees.value.filter(
        employee =>
            employee.employment_type === 'intern'
    ).length
)


/*
|--------------------------------------------------------------------------
| LOAD EMPLOYEES
|--------------------------------------------------------------------------
*/

async function loadEmployees() {

    loading.value = true

    error.value = ''

    try {

        const response =
            await erpApi.master.employees.list()

        /*
         * Support dua kemungkinan:
         *
         * response.data
         * atau langsung array
         *
         * tergantung implementasi api.js
         */

        employees.value =
            response?.data ||
            response ||
            []

    } catch (err) {

        console.error(
            'EMPLOYEES API ERROR:',
            err
        )

        const apiError =
            getApiError(err)

        error.value =
            apiError.message ||
            'Gagal memuat data karyawan.'

    } finally {

        loading.value = false

    }
}

async function loadDepartments() {
    try {
        const response = await erpApi.master.departments.list()
        departments.value = response?.data?.data ?? response ?? []
    } catch (error) {
        console.error('Gagal memuat departemen:', error)

        departments.value = []
    }
}

async function loadEmployeeStatuses() {
    try {
        const response = await erpApi.master.general.list({
            group       : 'employee_status',
            is_active   : true,
        })

        const data = response?.data ?? response
        employeeStatuses.value = Array.isArray(data)
            ? data
            : data?.data ?? []
    } catch (error) {
        console.error('Gagal memuat status karyawan:', error)
        employeeStatuses.value = []
    }
}

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

function openCreateModal() {

    error.value = ''

    showCreateModal.value = true
}


async function handleCreateSaved(employee) {

    error.value = ''

    try {

        const payload =
            normalizeEmployeePayload(
                employee
            )

        const response =
            await erpApi.master.employees.create(
                payload
            )

        const created =
            response?.data ||
            response

        employees.value.unshift(
            created
        )

        showCreateModal.value = false

    } catch (err) {

        console.error(
            'CREATE EMPLOYEE ERROR:',
            err
        )

        const apiError =
            getApiError(err)

        error.value =
            apiError.message ||
            'Gagal menambahkan karyawan.'

    }

}


/*
|--------------------------------------------------------------------------
| EDIT
|--------------------------------------------------------------------------
*/

function openEditModal(employee) {

    selectedEmployee.value =
        employee

    showEditModal.value = true
}


async function handleEditSaved(updatedEmployee) {

    error.value = ''

    try {

        const payload =
            normalizeEmployeePayload(
                updatedEmployee
            )

        const response =
            await erpApi.master.employees.update(
                updatedEmployee.id,
                payload
            )

        const updated =
            response?.data ||
            response

        const index =
            employees.value.findIndex(
                employee =>
                    employee.id === updated.id
            )

        if (index !== -1) {

            employees.value[index] =
                updated

        }

        selectedEmployee.value =
            updated

        showEditModal.value = false

    } catch (err) {

        console.error(
            'UPDATE EMPLOYEE ERROR:',
            err
        )

        const apiError =
            getApiError(err)

        error.value =
            apiError.message ||
            'Gagal memperbarui data karyawan.'

    }

}


/*
|--------------------------------------------------------------------------
| SHOW
|--------------------------------------------------------------------------
*/

function openShowModal(employee) {

    selectedEmployee.value =
        employee

    showShowModal.value = true
}


function openEditFromShow(employee) {

    showShowModal.value = false

    selectedEmployee.value =
        employee

    showEditModal.value = true
}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

async function removeEmployee(employee) {

    const confirmed =
        window.confirm(
            `Karyawan "${employee.name}" tidak akan benar-benar dihapus dari database. Lanjutkan?`
        )

    if (!confirmed) {
        return
    }

    error.value = ''

    try {

        await erpApi.master.employees.remove(
            employee.id
        )

        /*
         * Backend memang menolak hard delete.
         * Jadi kalau endpoint mengembalikan 422,
         * masuk ke catch.
         */

        employees.value =
            employees.value.filter(
                item =>
                    item.id !== employee.id
            )

    } catch (err) {

        const apiError =
            getApiError(err)

        error.value =
            apiError.message ||
            'Karyawan tidak dapat dihapus. Ubah status menjadi Resign atau Pensiun.'

    }

}


/*
|--------------------------------------------------------------------------
| NORMALIZE PAYLOAD
|--------------------------------------------------------------------------
|
| Modal lama masih menggunakan camelCase
| dan value Indonesia.
|
| Kita konversi di sini sebelum dikirim ke Laravel.
|
*/

function normalizeEmployeePayload(employee) {

    return {

        employee_number:
            employee.employee_number ||
            employee.code ||
            '',

        nik:
            employee.nik ||
            null,

        name:
            employee.name ||
            '',

        department_id:
            employee.department_id ||
            employee.department?.id ||
            null,

        employment_type:
            normalizeEmploymentType(
                employee.employment_type ||
                employee.type
            ),

        position:
            employee.position ||
            null,

        phone:
            employee.phone ||
            null,

        email:
            employee.email ||
            null,

        address:
            employee.address ||
            null,

        join_date:
            employee.join_date ||
            employee.joinDate ||
            null,

        exit_date:
            employee.exit_date ||
            employee.endDate ||
            employee.exitDate ||
            null,

        status:
            normalizeStatus(
                employee.status
            ),

        notes:
            employee.notes ||
            null,

    }

}


function normalizeEmploymentType(type) {

    const map = {
        tetap: 'permanent',
        trial: 'trial',
        magang: 'intern',

        permanent: 'permanent',
        intern: 'intern',
    }

    return map[type] || type

}


function normalizeStatus(status) {

    const map = {
        aktif: 'active',
        resign: 'resigned',
        pensiun: 'retired',

        active: 'active',
        resigned: 'resigned',
        retired: 'retired',
    }

    return map[status] || status

}


/*
|--------------------------------------------------------------------------
| UI HELPERS
|--------------------------------------------------------------------------
*/

function getInitials(name) {

    if (!name) {
        return '?'
    }

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join('')

}


function formatDate(date) {

    if (!date) {
        return '-'
    }

    const parsed =
        new Date(date)

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return '-'
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }
    ).format(parsed)

}


function typeLabel(type) {

    return {
        permanent: 'Tetap',
        trial: 'Trial',
        intern: 'Magang',
    }[type] || type || '-'

}


function typeClasses(type) {

    return {
        permanent:
            'bg-blue-50 text-blue-700',

        trial:
            'bg-amber-50 text-amber-700',

        intern:
            'bg-purple-50 text-purple-700',

    }[type] ||
        'bg-gray-100 text-gray-600'

}


function statusLabel(status) {

    return {
        active: 'Aktif',
        resigned: 'Resign',
        retired: 'Pensiun',
    }[status] || status || '-'

}


function statusClasses(status) {

    return {
        active:
            'bg-green-50 text-green-700',

        resigned:
            'bg-red-50 text-red-700',

        retired:
            'bg-gray-100 text-gray-600',

    }[status] ||
        'bg-gray-100 text-gray-600'

}


/*
|--------------------------------------------------------------------------
| INITIAL LOAD
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadEmployees()
    loadDepartments()
    loadEmployeeStatuses()
})
</script>