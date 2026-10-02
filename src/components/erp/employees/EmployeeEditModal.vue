<template>
    <div
        v-if="show && employee"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <!-- HEADER -->
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        Edit Karyawan
                    </h2>

                    <p class="mt-0.5 text-xs text-gray-500">
                        {{ employee.code }} · {{ employee.name }}
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
                            <FormField label="Kode Karyawan">
                                <input
                                    :value="form.code"
                                    type="text"
                                    readonly
                                    class="form-input bg-gray-50"
                                />
                            </FormField>

                            <FormField
                                label="NIK"
                                required
                            >
                                <input
                                    v-model="form.nik"
                                    type="text"
                                    class="form-input"
                                    required
                                />
                            </FormField>

                            <FormField
                                label="Nama Lengkap"
                                required
                            >
                                <input
                                    v-model="form.name"
                                    type="text"
                                    class="form-input"
                                    required
                                />
                            </FormField>

                            <FormField label="No. HP">
                                <input
                                    v-model="form.phone"
                                    type="text"
                                    class="form-input"
                                />
                            </FormField>

                            <FormField label="Email">
                                <input
                                    v-model="form.email"
                                    type="email"
                                    class="form-input"
                                />
                            </FormField>

                            <FormField label="Alamat">
                                <input
                                    v-model="form.address"
                                    type="text"
                                    class="form-input"
                                />
                            </FormField>
                        </div>
                    </section>

                    <!-- KEPEGAWAIAN -->
                    <section>
                        <h3 class="mb-3 text-sm font-bold text-gray-900">
                            Informasi Kepegawaian
                        </h3>

                        <div class="grid gap-4 md:grid-cols-2">
                            <FormField
                                label="Jabatan"
                                required
                            >
                                <input
                                    v-model="form.position"
                                    type="text"
                                    class="form-input"
                                    required
                                />
                            </FormField>

                            <FormField
                                label="Departemen"
                                required
                            >
                                <select
                                    v-model="form.department"
                                    class="form-input"
                                    required
                                >
                                    <option value="">
                                        Pilih Departemen
                                    </option>

                                    <option
                                        v-for="department in departments"
                                        :key="department"
                                        :value="department"
                                    >
                                        {{ department }}
                                    </option>
                                </select>
                            </FormField>

                            <FormField
                                label="Tipe Karyawan"
                                required
                            >
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
                            </FormField>

                            <FormField
                                label="Status Karyawan"
                                required
                            >
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
                            </FormField>

                            <FormField
                                label="Tanggal Masuk"
                                required
                            >
                                <input
                                    v-model="form.joinDate"
                                    type="date"
                                    class="form-input"
                                    required
                                />
                            </FormField>

                            <FormField label="Tanggal Keluar">
                                <input
                                    v-model="form.endDate"
                                    type="date"
                                    class="form-input"
                                    :disabled="form.status === 'aktif'"
                                />

                                <p class="mt-1 text-xs text-gray-400">
                                    Diisi apabila resign atau pensiun.
                                </p>
                            </FormField>
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
                        />
                    </section>
                </div>

                <!-- FOOTER -->
                <div class="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
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
    code: '',
    nik: '',
    name: '',
    phone: '',
    email: '',
    position: '',
    department: '',
    type: 'tetap',
    status: 'aktif',
    joinDate: '',
    endDate: '',
    address: '',
    notes: '',
})

watch(
    () => props.employee,
    (employee) => {
        if (!employee) return

        Object.assign(form, {
            ...employee,
            endDate: employee.endDate || '',
        })
    },
    {
        immediate: true,
    }
)

watch(
    () => form.status,
    (status) => {
        if (status === 'aktif') {
            form.endDate = ''
        }
    }
)

function close() {
    emit('close')
}

function save() {
    emit('saved', {
        id: form.id,
        code: form.code,
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
    })
}

const FormField = {
    props: {
        label: String,
        required: Boolean,
    },

    template: `
        <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-600">
                {{ label }}
                <span v-if="required" class="text-red-500">*</span>
            </label>

            <slot />
        </div>
    `,
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