<template>
    <div
        v-if="show && employee"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div
            class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
            <!-- HEADER -->
            <div
                class="flex items-center justify-between border-b border-gray-200 px-5 py-4"
            >
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        Edit Karyawan
                    </h2>

                    <p class="mt-0.5 text-xs text-gray-500">
                        {{ employee.employee_number || employee.code }} ·
                        {{ employee.name }}
                    </p>
                </div>

                <button
                    type="button"
                    class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    @click="close"
                >
                    ✕
                </button>
            </div>

            <!-- BODY -->
            <form
                class="overflow-y-auto p-5"
                @submit.prevent="save"
            >
                <div class="space-y-6">

                    <!-- IDENTITAS -->
                    <section>
                        <h3 class="mb-3 text-sm font-bold text-gray-900">
                            Identitas Karyawan
                        </h3>

                        <div class="grid gap-4 md:grid-cols-2">

                            <!-- KODE -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Kode Karyawan
                                </label>

                                <input
                                    :value="form.employee_number"
                                    type="text"
                                    readonly
                                    class="form-input bg-gray-50"
                                />
                            </div>

                            <!-- NIK -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    NIK
                                </label>

                                <input
                                    v-model="form.nik"
                                    type="text"
                                    class="form-input"
                                />
                            </div>

                            <!-- NAMA -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Nama Lengkap
                                    <span class="text-red-500">*</span>
                                </label>

                                <input
                                    v-model="form.name"
                                    type="text"
                                    class="form-input"
                                    required
                                />
                            </div>

                            <!-- PHONE -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    No. HP
                                </label>

                                <input
                                    v-model="form.phone"
                                    type="text"
                                    class="form-input"
                                />
                            </div>

                            <!-- EMAIL -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Email
                                </label>

                                <input
                                    v-model="form.email"
                                    type="email"
                                    class="form-input"
                                />
                            </div>

                            <!-- ALAMAT -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Alamat
                                </label>

                                <input
                                    v-model="form.address"
                                    type="text"
                                    class="form-input"
                                />
                            </div>

                        </div>
                    </section>

                    <!-- KEPEGAWAIAN -->
                    <section>
                        <h3 class="mb-3 text-sm font-bold text-gray-900">
                            Informasi Kepegawaian
                        </h3>

                        <div class="grid gap-4 md:grid-cols-2">

                            <!-- JABATAN -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Jabatan
                                    <span class="text-red-500">*</span>
                                </label>

                                <input
                                    v-model="form.position"
                                    type="text"
                                    class="form-input"
                                    required
                                />
                            </div>

                            <!-- DEPARTEMEN -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Departemen
                                    <span class="text-red-500">*</span>
                                </label>

                                <select
                                    v-model="form.department_id"
                                    class="form-input"
                                    required
                                >
                                    <option value="">
                                        Pilih Departemen
                                    </option>

                                    <option
                                        v-for="department in departments"
                                        :key="department.id"
                                        :value="department.id"
                                    >
                                        {{ department.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- TIPE -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Tipe Karyawan
                                    <span class="text-red-500">*</span>
                                </label>

                                <select
                                    v-model="form.employment_type"
                                    class="form-input"
                                    required
                                >
                                    <option value="permanent">
                                        Tetap
                                    </option>

                                    <option value="trial">
                                        Trial
                                    </option>

                                    <option value="intern">
                                        Magang
                                    </option>
                                </select>
                            </div>

                            <!-- STATUS -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Status Karyawan
                                    <span class="text-red-500">*</span>
                                </label>

                                <select
                                    v-model="form.status"
                                    class="form-input"
                                    required
                                >
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

                            <!-- TANGGAL MASUK -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Tanggal Masuk
                                    <span class="text-red-500">*</span>
                                </label>

                                <input
                                    v-model="form.join_date"
                                    type="date"
                                    class="form-input"
                                    required
                                />
                            </div>

                            <!-- TANGGAL KELUAR -->
                            <div>
                                <label
                                    class="mb-1.5 block text-xs font-semibold text-gray-600"
                                >
                                    Tanggal Keluar
                                </label>

                                <input
                                    v-model="form.exit_date"
                                    type="date"
                                    class="form-input"
                                    :disabled="form.status === 'active'"
                                />

                                <p class="mt-1 text-xs text-gray-400">
                                    Diisi apabila resign atau pensiun.
                                </p>
                            </div>

                        </div>
                    </section>

                    <!-- CATATAN -->
                    <section>
                        <h3 class="mb-3 text-sm font-bold text-gray-900">
                            Catatan
                        </h3>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            class="form-input resize-none"
                        ></textarea>
                    </section>

                </div>

                <!-- FOOTER -->
                <div
                    class="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4"
                >
                    <button
                        type="button"
                        class="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        @click="close"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e]"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    employee: {
        type: Object,
        default: null,
    },

    departments: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

const form = reactive({
    id: null,

    employee_number: '',
    nik: '',
    name: '',

    phone: '',
    email: '',
    address: '',

    position: '',
    department_id: '',

    employment_type: 'permanent',
    status: 'active',

    join_date: '',
    exit_date: '',

    notes: '',
})

watch(
    () => props.employee,
    (employee) => {
        if (!employee) return

        form.id = employee.id ?? null

        form.employee_number =
            employee.employee_number ||
            employee.code ||
            ''

        form.nik =
            employee.nik ||
            ''

        form.name =
            employee.name ||
            ''

        form.phone =
            employee.phone ||
            ''

        form.email =
            employee.email ||
            ''

        form.address =
            employee.address ||
            ''

        form.position =
            employee.position ||
            ''

        form.department_id =
            employee.department_id ||
            employee.department?.id ||
            ''

        form.employment_type =
            normalizeEmploymentType(
                employee.employment_type ||
                employee.type
            )

        form.status =
            normalizeStatus(
                employee.status
            )

        form.join_date =
            formatDate(employee.join_date || employee.joinDate)

        form.exit_date =
            formatDate(
                employee.exit_date ||
                employee.endDate ||
                employee.exitDate
            )

        form.notes =
            employee.notes ||
            ''
    },
    {
        immediate: true,
    }
)

watch(
    () => form.status,
    (status) => {
        if (status === 'active') {
            form.exit_date = ''
        }
    }
)

function normalizeEmploymentType(value) {
    const map = {
        tetap: 'permanent',
        permanent: 'permanent',

        trial: 'trial',

        magang: 'intern',
        intern: 'intern',
    }

    return map[value] || 'permanent'
}

function normalizeStatus(value) {
    const map = {
        aktif: 'active',
        active: 'active',

        resign: 'resigned',
        resigned: 'resigned',

        pensiun: 'retired',
        retired: 'retired',
    }

    return map[value] || 'active'
}

function formatDate(value) {
    if (!value) return ''

    if (typeof value === 'string') {
        return value.substring(0, 10)
    }

    return ''
}

function close() {
    emit('close')
}

function save() {
    emit('saved', {
        id: form.id,

        employee_number:
            form.employee_number.trim(),

        nik:
            form.nik?.trim() || null,

        name:
            form.name.trim(),

        phone:
            form.phone?.trim() || null,

        email:
            form.email?.trim() || null,

        address:
            form.address?.trim() || null,

        position:
            form.position.trim(),

        department_id:
            form.department_id
                ? Number(form.department_id)
                : null,

        employment_type:
            form.employment_type,

        status:
            form.status,

        join_date:
            form.join_date,

        exit_date:
            form.status === 'active'
                ? null
                : form.exit_date || null,

        notes:
            form.notes?.trim() || null,
    })
}
</script>

<style scoped>
.form-input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #d1d5db;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.form-input:focus {
    border-color: #0052cc;
    box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.1);
}

.form-input:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
}
</style>