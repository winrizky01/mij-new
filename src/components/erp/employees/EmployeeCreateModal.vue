<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            @click.self="close"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-semibold text-[#003366]">
                            Tambah Karyawan
                        </h2>
                        <p class="mt-1 text-sm text-gray-500">
                            Tambahkan data karyawan baru.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        @click="close"
                    >
                        <svg
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <form
                    class="overflow-y-auto px-6 py-5"
                    @submit.prevent="submit"
                >
                    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <!-- Kode -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Kode Karyawan
                            </label>

                            <input
                                :value="code"
                                type="text"
                                readonly
                                class="w-full rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-sm text-gray-600 outline-none"
                            />
                        </div>

                        <!-- NIK -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                NIK
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.nik"
                                type="text"
                                class="form-input"
                                placeholder="Masukkan NIK"
                                required
                            />
                        </div>

                        <!-- Nama -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Nama Lengkap
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.name"
                                type="text"
                                class="form-input"
                                placeholder="Nama lengkap"
                                required
                            />
                        </div>

                        <!-- No HP -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                No. HP
                            </label>

                            <input
                                v-model="form.phone"
                                type="text"
                                class="form-input"
                                placeholder="08xxxxxxxxxx"
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                v-model="form.email"
                                type="email"
                                class="form-input"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <!-- Jabatan -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Jabatan
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.position"
                                type="text"
                                class="form-input"
                                placeholder="Contoh: Staff Operasional"
                                required
                            />
                        </div>

                        <!-- Departemen -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Departemen
                                <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.department"
                                class="form-input"
                                required
                            >
                                <option value="">
                                    Pilih departemen
                                </option>

                                <option
                                    v-for="department in departments"
                                    :key="department"
                                    :value="department"
                                >
                                    {{ department }}
                                </option>
                            </select>
                        </div>

                        <!-- Tipe -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Tipe Karyawan
                                <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.type"
                                class="form-input"
                                required
                            >
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

                        <!-- Status -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Status Karyawan
                                <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.status"
                                class="form-input"
                                required
                            >
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

                        <!-- Tanggal Masuk -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Tanggal Masuk
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.joinDate"
                                type="date"
                                class="form-input"
                                required
                            />
                        </div>

                        <!-- Tanggal Keluar -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Tanggal Keluar
                                <span
                                    v-if="form.status !== 'aktif'"
                                    class="text-red-500"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                v-model="form.endDate"
                                type="date"
                                class="form-input"
                                :required="form.status !== 'aktif'"
                            />

                            <p class="mt-1 text-xs text-gray-400">
                                Diisi untuk karyawan resign atau pensiun.
                            </p>
                        </div>

                        <!-- Alamat -->
                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Alamat
                            </label>

                            <textarea
                                v-model="form.address"
                                rows="3"
                                class="form-input resize-none"
                                placeholder="Alamat lengkap karyawan"
                            />
                        </div>

                        <!-- Catatan -->
                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-medium text-gray-700">
                                Catatan
                            </label>

                            <textarea
                                v-model="form.notes"
                                rows="3"
                                class="form-input resize-none"
                                placeholder="Catatan tambahan"
                            />
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            @click="close"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#003f9e]"
                        >
                            Simpan Karyawan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    code: {
        type: String,
        default: '',
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

function getToday() {
    const date = new Date()

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const form = reactive({
    code: '',
    nik: '',
    name: '',
    phone: '',
    email: '',
    position: '',
    department: '',
    type: 'tetap',
    status: 'aktif',
    joinDate: getToday(),
    endDate: '',
    address: '',
    notes: '',
})

function resetForm() {
    form.code = props.code
    form.nik = ''
    form.name = ''
    form.phone = ''
    form.email = ''
    form.position = ''
    form.department = ''
    form.type = 'tetap'
    form.status = 'aktif'
    form.joinDate = getToday()
    form.endDate = ''
    form.address = ''
    form.notes = ''
}

watch(
    () => props.show,
    (value) => {
        if (value) {
            resetForm()
        }
    }
)

watch(
    () => form.status,
    (value) => {
        if (value === 'aktif') {
            form.endDate = ''
        }
    }
)

function close() {
    emit('close')
}

function submit() {
    const payload = {
        code: props.code,
        nik: form.nik.trim(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        position: form.position.trim(),
        department: form.department,
        type: form.type,
        status: form.status,
        joinDate: form.joinDate,
        endDate:
            form.status === 'aktif'
                ? null
                : form.endDate || null,
        address: form.address.trim(),
        notes: form.notes.trim(),
    }

    emit('saved', payload)
}
</script>

<style scoped>
.form-input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    background: white;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    color: #374151;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
    border-color: #0052cc;
    box-shadow: 0 0 0 3px rgb(0 82 204 / 0.08);
}
</style>