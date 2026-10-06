<template>
    <div
        v-if="modelValue"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div
            class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
        >
            <!-- HEADER -->
            <div
                class="flex items-center justify-between border-b border-gray-100 px-6 py-4"
            >
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        {{ editingId ? 'Edit Jenis Truk' : 'Tambah Jenis Truk' }}
                    </h2>

                    <p class="mt-1 text-xs text-gray-500">
                        Kelola master jenis truk kendaraan.
                    </p>
                </div>

                <button
                    type="button"
                    class="text-2xl leading-none text-gray-400 hover:text-gray-700"
                    @click="close"
                >
                    ×
                </button>
            </div>

            <!-- FORM -->
            <form
                class="space-y-4 p-6"
                @submit.prevent="save"
            >
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="form-label">
                            Kode
                        </label>

                        <input
                            v-model="form.code"
                            type="text"
                            required
                            maxlength="50"
                            placeholder="CDD"
                            class="form-input uppercase"
                        />
                    </div>

                    <div>
                        <label class="form-label">
                            Nama Jenis Truk
                        </label>

                        <input
                            v-model="form.name"
                            type="text"
                            required
                            maxlength="150"
                            placeholder="Colt Diesel Double"
                            class="form-input"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="form-label">
                            Kapasitas
                        </label>

                        <input
                            v-model="form.capacity"
                            type="number"
                            min="0"
                            step="0.001"
                            placeholder="5"
                            class="form-input"
                        />
                    </div>

                    <div>
                        <label class="form-label">
                            Satuan Kapasitas
                        </label>

                        <input
                            v-model="form.capacity_unit"
                            type="text"
                            maxlength="30"
                            placeholder="Ton"
                            class="form-input"
                        />
                    </div>
                </div>

                <div>
                    <label class="form-label">
                        Deskripsi
                    </label>

                    <textarea
                        v-model="form.description"
                        rows="3"
                        placeholder="Keterangan jenis truk..."
                        class="form-input resize-none"
                    ></textarea>
                </div>

                <div
                    class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                    <div>
                        <p class="text-sm font-semibold text-gray-800">
                            Status
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            Jenis truk dapat digunakan pada master kendaraan.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="relative h-6 w-11 rounded-full transition"
                        :class="
                            form.is_active
                                ? 'bg-[#0052cc]'
                                : 'bg-gray-300'
                        "
                        @click="form.is_active = !form.is_active"
                    >
                        <span
                            class="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition"
                            :class="
                                form.is_active
                                    ? 'left-6'
                                    : 'left-1'
                            "
                        ></span>
                    </button>
                </div>

                <div
                    v-if="errorMessage"
                    class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {{ errorMessage }}
                </div>

                <!-- FOOTER -->
                <div
                    class="flex justify-end gap-3 border-t border-gray-100 pt-4"
                >
                    <button
                        type="button"
                        class="btn-secondary"
                        :disabled="saving"
                        @click="close"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        :disabled="saving"
                        class="btn-primary"
                    >
                        {{ saving ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import {
    reactive,
    ref,
    watch,
} from 'vue'

import {
    erpApi,
    getApiError,
} from '@/services/api'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },

    truckType: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'update:modelValue',
    'saved',
])

const saving = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const form = reactive({
    code: '',
    name: '',
    capacity: '',
    capacity_unit: '',
    description: '',
    is_active: true,
})

function resetForm() {
    Object.assign(form, {
        code: '',
        name: '',
        capacity: '',
        capacity_unit: '',
        description: '',
        is_active: true,
    })

    editingId.value = null
    errorMessage.value = ''
}

function fillForm(type) {
    if (!type) {
        resetForm()
        return
    }

    editingId.value = type.id

    Object.assign(form, {
        code: type.code || '',
        name: type.name || '',
        capacity: type.capacity ?? '',
        capacity_unit: type.capacity_unit || '',
        description: type.description || '',
        is_active:
            type.is_active !== false,
    })

    errorMessage.value = ''
}

watch(
    () => props.modelValue,
    value => {
        if (value) {
            fillForm(props.truckType)
        }
    }
)

watch(
    () => props.truckType,
    value => {
        if (props.modelValue) {
            fillForm(value)
        }
    }
)

function close() {
    if (saving.value) {
        return
    }

    emit(
        'update:modelValue',
        false
    )
}

function unwrapData(response) {
    return response?.data ?? response
}

async function save() {
    errorMessage.value = ''

    if (!form.code.trim()) {
        errorMessage.value =
            'Kode jenis truk wajib diisi.'

        return
    }

    if (!form.name.trim()) {
        errorMessage.value =
            'Nama jenis truk wajib diisi.'

        return
    }

    saving.value = true

    try {
        const payload = {
            code:
                form.code
                    .trim()
                    .toUpperCase(),

            name:
                form.name.trim(),

            capacity:
                form.capacity !== ''
                    ? Number(form.capacity)
                    : null,

            capacity_unit:
                form.capacity_unit.trim() ||
                null,

            description:
                form.description.trim() ||
                null,

            is_active:
                form.is_active,
        }

        let response

        if (editingId.value) {
            response =
                await erpApi.master.truckTypes.update(
                    editingId.value,
                    payload
                )
        } else {
            response =
                await erpApi.master.truckTypes.create(
                    payload
                )
        }

        const savedType =
            unwrapData(response)

        emit('saved', savedType)

        close()
    } catch (error) {
        console.error(
            'Gagal menyimpan jenis truk:',
            error
        )

        errorMessage.value =
            getApiError(error)?.message ||
            'Gagal menyimpan jenis truk.'
    } finally {
        saving.value = false
    }
}
</script>

<style scoped>
.form-label {
    display: block;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.form-input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.form-input:focus {
    border-color: #0052cc;
    box-shadow:
        0 0 0 2px
        rgba(59, 130, 246, 0.1);
}

.btn-primary {
    border-radius: 0.75rem;
    background-color: #0052cc;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #ffffff;
    transition: background-color 0.2s ease;
}

.btn-primary:hover {
    background-color: #003f9e;
}

.btn-primary:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.btn-secondary {
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    transition: background-color 0.2s ease;
}

.btn-secondary:hover {
    background-color: #f9fafb;
}

.btn-secondary:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>