<script setup>
import { computed, ref, watch } from 'vue'
import {
    X,
    Save,
    Loader2,
    Package,
    AlertCircle,
} from 'lucide-vue-next'

import {
    erpApi,
    getApiError,
} from '@/services/api'

const props = defineProps({
    unit: {
        type: Object,
        default: null,
    },

    units: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

const form = ref({
    name: '',
    code: '',
    symbol: '',
    conversion_value: 1,
    base_unit_id: '',
    is_active: true,
})

const errors = ref({})
const saving = ref(false)

const isEdit = computed(() => !!props.unit)

const modalTitle = computed(() =>
    isEdit.value ? 'Edit Unit' : 'Tambah Unit'
)

const availableBaseUnits = computed(() => {
    return props.units.filter((item) => {
        if (!props.unit) return true

        return item.id !== props.unit.id
    })
})

function emptyForm() {
    return {
        name: '',
        code: '',
        symbol: '',
        conversion_value: 1,
        base_unit_id: '',
        is_active: true,
    }
}

function fillForm(unit) {
    if (!unit) {
        form.value = emptyForm()
        return
    }

    form.value = {
        name: unit.name ?? '',
        code: unit.code ?? '',
        symbol: unit.symbol ?? '',
        conversion_value: unit.conversion_value ?? 1,
        base_unit_id: unit.base_unit_id ?? '',
        is_active: Boolean(unit.is_active),
    }
}

function clearErrors() {
    errors.value = {}
}

function close() {
    if (saving.value) return

    emit('close')
}

function validate() {
    clearErrors()

    if (!form.value.name.trim()) {
        errors.value.name = 'Nama unit wajib diisi.'
    }

    if (!form.value.code.trim()) {
        errors.value.code = 'Kode unit wajib diisi.'
    }

    if (
        form.value.conversion_value === '' ||
        Number(form.value.conversion_value) <= 0
    ) {
        errors.value.conversion_value =
            'Nilai konversi harus lebih besar dari 0.'
    }

    if (
        props.unit &&
        form.value.base_unit_id &&
        Number(form.value.base_unit_id) === Number(props.unit.id)
    ) {
        errors.value.base_unit_id =
            'Unit tidak boleh menjadi base unit untuk dirinya sendiri.'
    }

    return Object.keys(errors.value).length === 0
}

async function submit() {
    if (!validate()) return

    saving.value = true
    clearErrors()

    try {
        const payload = {
            name: form.value.name.trim(),
            code: form.value.code.trim().toUpperCase(),
            symbol: form.value.symbol?.trim() || null,
            conversion_value: Number(
                form.value.conversion_value
            ),
            base_unit_id:
                form.value.base_unit_id
                    ? Number(form.value.base_unit_id)
                    : null,
            is_active: Boolean(form.value.is_active),
        }

        let response

        if (isEdit.value) {
            response = await erpApi.master.units.update(
                props.unit.id,
                payload
            )
        } else {
            response = await erpApi.master.units.create(payload)
        }

        emit(
            'saved',
            response.data?.data ?? null
        )
    } catch (err) {
        console.error('SAVE UNIT ERROR:', err)

        if (err?.response?.status === 422) {
            errors.value =
                err.response?.data?.errors || {}

            if (
                err.response?.data?.message &&
                !Object.keys(errors.value).length
            ) {
                errors.value.general =
                    err.response.data.message
            }
        } else {
            errors.value.general =
                getApiError(err) ||
                'Terjadi kesalahan saat menyimpan unit.'
        }
    } finally {
        saving.value = false
    }
}

watch(
    () => props.unit,
    (unit) => {
        clearErrors()
        fillForm(unit)
    },
    {
        immediate: true,
    }
)
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        @click.self="close"
    >
        <div
            class="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >

            <!-- ================================================= -->
            <!-- HEADER -->
            <!-- ================================================= -->

            <div
                class="flex items-center justify-between border-b border-slate-200 px-5 py-4"
            >
                <div class="flex items-center gap-3">

                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14a2d8]/10 text-[#14a2d8]"
                    >
                        <Package class="h-5 w-5" />
                    </div>

                    <div>
                        <h2
                            class="text-base font-bold text-slate-800"
                        >
                            {{ modalTitle }}
                        </h2>

                        <p
                            class="text-xs text-slate-500"
                        >
                            {{
                                isEdit
                                    ? 'Perbarui informasi unit.'
                                    : 'Tambahkan satuan baru.'
                            }}
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    :disabled="saving"
                    @click="close"
                >
                    <X class="h-5 w-5" />
                </button>
            </div>

            <!-- ================================================= -->
            <!-- BODY -->
            <!-- ================================================= -->

            <form
                class="overflow-y-auto p-5"
                @submit.prevent="submit"
            >

                <!-- General error -->

                <div
                    v-if="errors.general"
                    class="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-600"
                >
                    <AlertCircle
                        class="mt-0.5 h-4 w-4 shrink-0"
                    />

                    <span>
                        {{ errors.general }}
                    </span>
                </div>

                <div class="space-y-5">

                    <!-- ================================================= -->
                    <!-- NAME -->
                    <!-- ================================================= -->

                    <div>
                        <label
                            class="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                            Nama Unit
                            <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="Contoh: Dus"
                            class="w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2"
                            :class="
                                errors.name
                                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                    : 'border-slate-200 focus:border-[#14a2d8] focus:ring-[#14a2d8]/10'
                            "
                        />

                        <p
                            v-if="errors.name"
                            class="mt-1 text-xs text-red-500"
                        >
                            {{ errors.name }}
                        </p>
                    </div>

                    <!-- ================================================= -->
                    <!-- CODE + SYMBOL -->
                    <!-- ================================================= -->

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>
                            <label
                                class="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Kode
                                <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.code"
                                type="text"
                                placeholder="BOX"
                                maxlength="50"
                                class="w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm font-medium uppercase text-slate-700 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:bg-white focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                                :class="
                                    errors.code
                                        ? 'border-red-300'
                                        : 'border-slate-200'
                                "
                            />

                            <p
                                v-if="errors.code"
                                class="mt-1 text-xs text-red-500"
                            >
                                {{ errors.code }}
                            </p>
                        </div>

                        <div>
                            <label
                                class="mb-1.5 block text-sm font-semibold text-slate-700"
                            >
                                Simbol
                            </label>

                            <input
                                v-model="form.symbol"
                                type="text"
                                placeholder="box"
                                maxlength="20"
                                class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#14a2d8] focus:bg-white focus:ring-2 focus:ring-[#14a2d8]/10"
                            />
                        </div>

                    </div>

                    <!-- ================================================= -->
                    <!-- BASE UNIT -->
                    <!-- ================================================= -->

                    <div
                        class="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Base Unit
                                </label>

                                <select
                                    v-model="form.base_unit_id"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                                    :class="{
                                        'border-red-300':
                                            errors.base_unit_id
                                    }"
                                >
                                    <option value="">
                                        Tidak menggunakan base unit
                                    </option>

                                    <option
                                        v-for="baseUnit in availableBaseUnits"
                                        :key="baseUnit.id"
                                        :value="baseUnit.id"
                                    >
                                        {{ baseUnit.name }}
                                        ({{ baseUnit.code }})
                                    </option>
                                </select>

                                <p
                                    v-if="errors.base_unit_id"
                                    class="mt-1 text-xs text-red-500"
                                >
                                    {{ errors.base_unit_id }}
                                </p>
                            </div>

                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Nilai Konversi
                                    <span class="text-red-500">*</span>
                                </label>

                                <input
                                    v-model.number="form.conversion_value"
                                    type="number"
                                    min="0.000001"
                                    step="0.000001"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                                    :class="{
                                        'border-red-300':
                                            errors.conversion_value
                                    }"
                                />

                                <p
                                    v-if="errors.conversion_value"
                                    class="mt-1 text-xs text-red-500"
                                >
                                    {{ errors.conversion_value }}
                                </p>
                            </div>

                        </div>

                        <div
                            v-if="form.base_unit_id"
                            class="mt-3 rounded-lg bg-white px-3 py-2 text-xs text-slate-500"
                        >
                            <span class="font-semibold text-slate-700">
                                1 {{ form.name || 'Unit' }}
                            </span>

                            =
                            <span class="font-semibold text-[#14a2d8]">
                                {{ form.conversion_value || 0 }}
                            </span>

                            {{
                                units.find(
                                    unit =>
                                        Number(unit.id) ===
                                        Number(form.base_unit_id)
                                )?.name || 'Base Unit'
                            }}
                        </div>
                    </div>

                    <!-- ================================================= -->
                    <!-- STATUS -->
                    <!-- ================================================= -->

                    <div
                        class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                    >
                        <div>
                            <p
                                class="text-sm font-semibold text-slate-700"
                            >
                                Status Unit
                            </p>

                            <p
                                class="mt-0.5 text-xs text-slate-500"
                            >
                                Unit aktif dapat digunakan pada produk.
                            </p>
                        </div>

                        <button
                            type="button"
                            class="relative h-6 w-11 rounded-full transition"
                            :class="
                                form.is_active
                                    ? 'bg-[#14a2d8]'
                                    : 'bg-slate-300'
                            "
                            @click="
                                form.is_active =
                                    !form.is_active
                            "
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

                </div>
            </form>

            <!-- ================================================= -->
            <!-- FOOTER -->
            <!-- ================================================= -->

            <div
                class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4"
            >
                <button
                    type="button"
                    class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                    :disabled="saving"
                    @click="close"
                >
                    Batal
                </button>

                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl bg-[#14a2d8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#118fbe] disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="saving"
                    @click="submit"
                >
                    <Loader2
                        v-if="saving"
                        class="h-4 w-4 animate-spin"
                    />

                    <Save
                        v-else
                        class="h-4 w-4"
                    />

                    {{ saving ? 'Menyimpan...' : 'Simpan' }}
                </button>
            </div>

        </div>
    </div>
</template>