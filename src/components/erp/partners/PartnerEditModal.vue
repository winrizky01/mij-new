<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            @click.self="close"
        >
            <div
                class="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-5">
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
                        </div>

                        <!-- Type -->
                        <div>
                            <label class="form-label">
                                Tipe Partner
                                <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.type"
                                class="form-input"
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

                        <!-- Name -->
                        <div class="md:col-span-2">
                            <label class="form-label">
                                Nama Perusahaan / Partner
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.name"
                                type="text"
                                class="form-input"
                                placeholder="Nama perusahaan"
                                required
                            />
                        </div>

                        <!-- NPWP -->
                        <div>
                            <label class="form-label">
                                NPWP
                            </label>

                            <input
                                v-model="form.taxNumber"
                                type="text"
                                class="form-input"
                                placeholder="NPWP"
                            />
                        </div>

                        <!-- Contact Person -->
                        <div>
                            <label class="form-label">
                                Contact Person
                            </label>

                            <input
                                v-model="form.contactPerson"
                                type="text"
                                class="form-input"
                                placeholder="Nama PIC"
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
                                placeholder="No. telepon"
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
                                placeholder="Email"
                            />
                        </div>

                        <!-- Province -->
                        <div>
                            <label class="form-label">
                                Provinsi
                            </label>

                            <input
                                v-model="form.provinceName"
                                type="text"
                                class="form-input"
                                placeholder="Provinsi"
                            />
                        </div>

                        <!-- City -->
                        <div>
                            <label class="form-label">
                                Kota / Kabupaten
                            </label>

                            <input
                                v-model="form.cityName"
                                type="text"
                                class="form-input"
                                placeholder="Kota / Kabupaten"
                            />
                        </div>

                        <!-- Address -->
                        <div class="md:col-span-2">
                            <label class="form-label">
                                Alamat
                            </label>

                            <textarea
                                v-model="form.address"
                                rows="3"
                                class="form-input resize-none"
                                placeholder="Alamat lengkap"
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
                            />
                        </div>

                        <!-- Active -->
                        <div class="md:col-span-2">
                            <label class="flex cursor-pointer items-center gap-3">
                                <input
                                    v-model="form.active"
                                    type="checkbox"
                                    class="h-4 w-4 rounded border-gray-300 text-[#0052cc] focus:ring-[#0052cc]"
                                />

                                <span>
                                    <span class="block text-sm font-medium text-gray-700">
                                        Partner Aktif
                                    </span>

                                    <span class="block text-xs text-gray-400">
                                        Partner dapat digunakan dalam transaksi.
                                    </span>
                                </span>
                            </label>
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
                            class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003f9e]"
                        >
                            Simpan Perubahan
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

    partner: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

const form = reactive({
    id: null,
    code: '',
    name: '',
    type: 'customer',
    phone: '',
    email: '',
    contactPerson: '',
    taxNumber: '',
    address: '',
    provinceName: '',
    cityName: '',
    notes: '',
    active: true,
})

function loadPartner() {
    if (!props.partner) return

    const partner = props.partner

    form.id = partner.id
    form.code = partner.code || ''
    form.name = partner.name || ''
    form.type = partner.type || 'customer'
    form.phone = partner.phone || ''
    form.email = partner.email || ''
    form.contactPerson = partner.contactPerson || ''
    form.taxNumber = partner.taxNumber || ''
    form.address = partner.address || ''
    form.provinceName = partner.provinceName || ''
    form.cityName = partner.cityName || ''
    form.notes = partner.notes || ''
    form.active = partner.active !== false
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
    emit('close')
}

function submit() {
    if (!props.partner) return

    emit('saved', {
        id: props.partner.id,
        code: form.code,
        name: form.name.trim(),
        type: form.type,
        phone: form.phone.trim(),
        email: form.email.trim(),
        contactPerson: form.contactPerson.trim(),
        taxNumber: form.taxNumber.trim(),
        address: form.address.trim(),
        provinceName: form.provinceName.trim(),
        cityName: form.cityName.trim(),
        notes: form.notes.trim(),
        active: form.active,
    })
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
</style>