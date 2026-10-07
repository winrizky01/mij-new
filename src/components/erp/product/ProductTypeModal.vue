<template>
    <div
        class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
        @click.self="close"
    >
        <div
            class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
            <!-- HEADER -->
            <div
                class="flex items-start justify-between border-b border-slate-200 px-6 py-5"
            >
                <div>
                    <h2 class="text-lg font-bold text-slate-900">
                        Tambah Tipe Produk
                    </h2>

                    <p class="mt-1 text-sm text-slate-500">
                        Tambahkan tipe baru untuk produk.
                    </p>
                </div>

                <button
                    type="button"
                    @click="close"
                    :disabled="saving"
                    class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                >
                    <XIcon class="h-5 w-5" />
                </button>
            </div>

            <!-- BODY -->
            <form @submit.prevent="submit">
                <div class="space-y-5 px-6 py-6">

                    <!-- CODE -->
                    <div>
                        <label class="form-label">
                            Kode Tipe
                            <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="form.code"
                            type="text"
                            class="form-input"
                            placeholder="Contoh: TPE-001"
                            :disabled="saving"
                        />

                        <p
                            v-if="errors.code"
                            class="form-error"
                        >
                            {{ errors.code }}
                        </p>
                    </div>

                    <!-- NAME -->
                    <div>
                        <label class="form-label">
                            Nama Tipe
                            <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="form.name"
                            type="text"
                            class="form-input"
                            placeholder="Contoh: ASET"
                            :disabled="saving"
                        />

                        <p
                            v-if="errors.name"
                            class="form-error"
                        >
                            {{ errors.name }}
                        </p>
                    </div>

                    <!-- DESCRIPTION -->
                    <div>
                        <label class="form-label">
                            Keterangan
                        </label>

                        <textarea
                            v-model="form.description"
                            rows="3"
                            class="form-input resize-none"
                            placeholder="Keterangan tipe..."
                            :disabled="saving"
                        ></textarea>

                        <p
                            v-if="errors.description"
                            class="form-error"
                        >
                            {{ errors.description }}
                        </p>
                    </div>

                    <!-- STATUS -->
                    <div
                        class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                        <div>
                            <p class="text-sm font-semibold text-slate-700">
                                Status Tipe
                            </p>

                            <p class="mt-0.5 text-xs text-slate-400">
                                Tipe tidak aktif tidak dapat digunakan
                                untuk produk baru.
                            </p>
                        </div>

                        <button
                            type="button"
                            @click="form.is_active = !form.is_active"
                            :disabled="saving"
                            :class="
                                form.is_active
                                    ? 'bg-emerald-500'
                                    : 'bg-slate-300'
                            "
                            class="relative h-6 w-11 shrink-0 rounded-full transition"
                        >
                            <span
                                :class="
                                    form.is_active
                                        ? 'translate-x-5'
                                        : 'translate-x-0.5'
                                "
                                class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition"
                            ></span>
                        </button>
                    </div>

                </div>

                <!-- FOOTER -->
                <div
                    class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4"
                >
                    <button
                        type="button"
                        @click="close"
                        :disabled="saving"
                        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        :disabled="saving"
                        class="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#118fbe] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Loader2Icon
                            v-if="saving"
                            class="h-4 w-4 animate-spin"
                        />

                        <SaveIcon
                            v-else
                            class="h-4 w-4"
                        />

                        {{ saving ? 'Menyimpan...' : 'Simpan Tipe Produk' }}
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
} from 'vue'

import {
    XIcon,
    SaveIcon,
    Loader2Icon,
} from 'lucide-vue-next'

import {
    erpApi,
    getApiError,
} from '@/services/api'

const emit = defineEmits([
    'close',
    'saved',
])


const saving = ref(false)

const errors = reactive({})


const form = reactive({
    code: '',
    name: '',
    description: '',
    is_active: true,
})


function clearErrors() {
    Object.keys(errors).forEach(
        key => delete errors[key]
    )
}


function close() {
    if (saving.value) {
        return
    }

    emit('close')
}


function validate() {

    clearErrors()

    if (!form.code.trim()) {
        errors.code = 'Kode tipe wajib diisi.'
    }

    if (!form.name.trim()) {
        errors.name = 'Nama tipe wajib diisi.'
    }

    return Object.keys(errors).length === 0
}


async function submit() {

    if (!validate()) {
        return
    }

    saving.value = true

    try {

        const payload = {
            code: form.code.trim(),
            name: form.name.trim(),
            description:
                form.description.trim() || null,
            is_active:
                Boolean(form.is_active),
        }


        
        const response = await erpApi.master.productTypes.create(payload)
         
        const types = response.data.data
         
        emit('saved', types)


    } catch (error) {

        console.error(
            'Gagal menyimpan tipe:',
            error
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
    color: #334155;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
}

.form-input {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    background-color: #fff;
    padding: 0.625rem 0.875rem;
    color: #334155;
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition:
        color,
        background-color,
        border-color,
        box-shadow;
}

.form-input::placeholder {
    color: #94a3b8;
}

.form-input:focus {
    border-color: #14a2d8;
    box-shadow: 0 0 0 2px rgb(20 162 216 / 10%);
}

.form-input:disabled {
    cursor: not-allowed;
    background-color: #f8fafc;
    color: #94a3b8;
}

.form-error {
    margin-top: 0.375rem;
    color: #ef4444;
    font-size: 0.75rem;
    line-height: 1rem;
}
</style>