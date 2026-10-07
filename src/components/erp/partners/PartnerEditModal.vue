<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            @click.self="close"
        >
            <div
                class="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-6 py-5"
                >
                    <div>
                        <h2 class="text-lg font-semibold text-[#003366]">
                            Edit Partner
                        </h2>

                        <p class="mt-1 text-sm text-gray-500">
                            Perbarui informasi partner.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        :disabled="saving"
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
                            <label class="form-label">
                                Kode Partner
                            </label>

                            <input
                                v-model="form.code"
                                type="text"
                                readonly
                                class="form-input bg-gray-100 text-gray-500"
                            />

                            <p class="mt-1 text-xs text-gray-400">
                                Kode partner tidak dapat diubah.
                            </p>
                        </div>

                        <!-- Tipe -->
                        <div>
                            <label class="form-label">
                                Tipe Partner
                                <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.type"
                                class="form-input"
                                :disabled="saving"
                                required
                            >
                                <option value="customer">
                                    Customer
                                </option>

                                <option value="supplier">
                                    Supplier
                                </option>

                                <option value="both">
                                    Customer + Supplier
                                </option>
                            </select>
                        </div>

                        <!-- Nama -->
                        <div class="md:col-span-2">
                            <label class="form-label">
                                Nama Partner
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.name"
                                type="text"
                                class="form-input"
                                placeholder="Nama partner"
                                :disabled="saving"
                                required
                            />
                        </div>

                        <!-- Company -->
                        <div>
                            <label class="form-label">
                                Nama Perusahaan
                            </label>

                            <input
                                v-model="form.company"
                                type="text"
                                class="form-input"
                                placeholder="Nama badan usaha / perusahaan"
                                :disabled="saving"
                            />
                        </div>

                        <!-- NPWP -->
                        <div>
                            <label class="form-label">
                                NPWP
                            </label>

                            <input
                                v-model="form.tax_number"
                                type="text"
                                class="form-input"
                                placeholder="00.000.000.0-000.000"
                                :disabled="saving"
                            />
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="form-label">
                                No. Telepon
                            </label>

                            <input
                                v-model="form.phone"
                                type="text"
                                class="form-input"
                                placeholder="08xxxxxxxxxx"
                                :disabled="saving"
                            />
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="form-label">
                                Email
                            </label>

                            <input
                                v-model="form.email"
                                type="email"
                                class="form-input"
                                placeholder="email@perusahaan.com"
                                :disabled="saving"
                            />
                        </div>

                        <!-- Notes -->
                        <div class="md:col-span-2">
                            <label class="form-label">
                                Catatan
                            </label>

                            <textarea
                                v-model="form.notes"
                                rows="3"
                                class="form-input resize-none"
                                placeholder="Catatan tambahan"
                                :disabled="saving"
                            ></textarea>
                        </div>

                        <!-- Active -->
                        <div class="md:col-span-2">
                            <label
                                class="flex cursor-pointer items-center gap-3"
                            >
                                <input
                                    v-model="form.is_active"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-gray-300 text-[#0052cc] focus:ring-[#0052cc]"
                                    :disabled="saving"
                                />

                                <span>
                                    <span
                                        class="block text-sm font-medium text-gray-700"
                                    >
                                        Partner Aktif
                                    </span>

                                    <span
                                        class="block text-xs text-gray-400"
                                    >
                                        Partner dapat digunakan dalam transaksi.
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Error -->
                    <div
                        v-if="errorMessage"
                        class="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                        {{ errorMessage }}
                    </div>

                    <!-- Footer -->
                    <div
                        class="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end"
                    >
                        <button
                            type="button"
                            class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="saving"
                            @click="close"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="saving || !form.name.trim()"
                        >
                            <svg
                                v-if="saving"
                                class="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    d="M12 3a9 9 0 109 9"
                                />
                            </svg>

                            {{
                                saving
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
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
    show: {
        type: Boolean,
        default: false,
    },

    partner: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

const saving = ref(false)
const errorMessage = ref('')

const form = reactive({
    id: null,
    code: '',
    name: '',
    type: 'customer',
    company: '',
    tax_number: '',
    phone: '',
    email: '',
    notes: '',
    is_active: true,
})

function resetForm() {
    form.id = null
    form.code = ''
    form.name = ''
    form.type = 'customer'
    form.company = ''
    form.tax_number = ''
    form.phone = ''
    form.email = ''
    form.notes = ''
    form.is_active = true

    errorMessage.value = ''
}

function loadPartner() {
    if (!props.partner) {
        resetForm()
        return
    }

    const partner = props.partner

    form.id = partner.id
    form.code = partner.code || ''
    form.name = partner.name || ''
    form.type = partner.type || 'customer'
    form.company = partner.company || ''
    form.tax_number = partner.tax_number || ''
    form.phone = partner.phone || ''
    form.email = partner.email || ''
    form.notes = partner.notes || ''
    form.is_active = partner.is_active !== false

    errorMessage.value = ''
}

watch(
    () => props.show,
    value => {
        if (value) {
            loadPartner()
        }
    }
)

watch(
    () => props.partner,
    value => {
        if (props.show && value) {
            loadPartner()
        }
    },
    {
        deep: true,
    }
)

function close() {
    if (saving.value) {
        return
    }

    emit('close')
}

async function submit() {
    if (!props.partner?.id) {
        return
    }

    if (!form.name.trim()) {
        errorMessage.value =
            'Nama partner wajib diisi.'

        return
    }

    errorMessage.value = ''
    saving.value = true

    try {
        const payload = {
            code: form.code,
            name: form.name.trim(),
            type: form.type,

            company:
                form.company.trim() || null,

            tax_number:
                form.tax_number.trim() || null,

            phone:
                form.phone.trim() || null,

            email:
                form.email.trim() || null,

            notes:
                form.notes.trim() || null,

            is_active:
                Boolean(form.is_active),
        }

        const response =
            await erpApi.master.partners.update(
                props.partner.id,
                payload
            )

        emit(
            'saved',
            response?.data?.data || null
        )
    } catch (error) {
        errorMessage.value =
            getApiError(
                error,
                'Partner gagal diperbarui.'
            )
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
    background: white;
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    color: #374151;
    outline: none;
    transition:
        border-color 0.2s,
        box-shadow 0.2s;
}

.form-input:focus {
    border-color: #0052cc;
    box-shadow: 0 0 0 3px rgb(0 82 204 / 0.08);
}

.form-input:disabled {
    cursor: not-allowed;
    opacity: 0.65;
}
</style>