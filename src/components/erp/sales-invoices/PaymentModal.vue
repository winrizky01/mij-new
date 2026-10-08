<script setup>
import {
    computed,
    ref,
    watch,
} from 'vue'

import {
    X,
    CreditCard,
} from 'lucide-vue-next'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    invoice: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

const loading = ref(false)

const form = ref({
    amount: '',
    payment_date: '',
    notes: '',
})

const errorMessage = ref('')

const totalAmount = computed(() => {
    return Number(
        props.invoice?.total_amount ?? 0
    )
})

const paidAmount = computed(() => {
    return Number(
        props.invoice?.paid_amount ?? 0
    )
})

const remainingAmount = computed(() => {
    return Math.max(
        totalAmount.value -
        paidAmount.value,
        0
    )
})

const paymentAmount = computed(() => {
    return Number(
        form.value.amount || 0
    )
})

const afterPayment = computed(() => {
    return Math.max(
        remainingAmount.value -
        paymentAmount.value,
        0
    )
})

const isFullPayment = computed(() => {
    return (
        paymentAmount.value > 0 &&
        paymentAmount.value >=
            remainingAmount.value
    )
})

function today() {
    const date = new Date()

    const year =
        date.getFullYear()

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, '0')

    const day =
        String(
            date.getDate()
        ).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function resetForm() {
    form.value = {
        amount: '',
        payment_date: today(),
        notes: '',
    }

    errorMessage.value = ''
}

function fillRemaining() {
    form.value.amount =
        remainingAmount.value
}

function close() {
    if (loading.value) {
        return
    }

    emit('close')
}

async function submit() {
    errorMessage.value = ''

    const amount =
        Number(form.value.amount)

    if (!amount || amount <= 0) {
        errorMessage.value =
            'Jumlah pembayaran harus lebih dari 0.'

        return
    }

    if (
        amount >
        remainingAmount.value
    ) {
        errorMessage.value =
            'Jumlah pembayaran melebihi sisa tagihan.'

        return
    }

    if (!form.value.payment_date) {
        errorMessage.value =
            'Tanggal pembayaran wajib diisi.'

        return
    }

    loading.value = true

    try {
        emit('saved', {
            amount,
            payment_date:
                form.value.payment_date,
            notes:
                form.value.notes || null,
        })
    } finally {
        loading.value = false
    }
}

watch(
    () => props.show,
    value => {
        if (value) {
            resetForm()
        }
    }
)
</script>

<template>
    <div
        v-if="show"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
        @click.self="close"
    >
        <div
            class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        >

            <!-- Header -->
            <div
                class="flex items-center justify-between border-b border-slate-200 px-6 py-4"
            >
                <div>
                    <div
                        class="flex items-center gap-2"
                    >
                        <div
                            class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
                        >
                            <CreditCard
                                :size="18"
                            />
                        </div>

                        <div>
                            <h2
                                class="text-lg font-bold text-[#172033]"
                            >
                                Pembayaran Invoice
                            </h2>

                            <p
                                class="text-xs text-[#667085]"
                            >
                                {{
                                    invoice?.invoice_number ??
                                    '-'
                                }}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    @click="close"
                    class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                    <X :size="20" />
                </button>
            </div>

            <!-- Body -->
            <div class="space-y-5 p-6">

                <!-- Summary -->
                <div
                    class="rounded-xl bg-slate-50 p-4"
                >
                    <div
                        class="flex justify-between text-sm"
                    >
                        <span
                            class="text-[#667085]"
                        >
                            Total Invoice
                        </span>

                        <span
                            class="font-semibold text-[#172033]"
                        >
                            Rp
                            {{
                                totalAmount.toLocaleString(
                                    'id-ID'
                                )
                            }}
                        </span>
                    </div>

                    <div
                        class="mt-2 flex justify-between text-sm"
                    >
                        <span
                            class="text-[#667085]"
                        >
                            Sudah Dibayar
                        </span>

                        <span
                            class="font-semibold text-emerald-600"
                        >
                            Rp
                            {{
                                paidAmount.toLocaleString(
                                    'id-ID'
                                )
                            }}
                        </span>
                    </div>

                    <div
                        class="mt-3 border-t border-slate-200 pt-3"
                    >
                        <div
                            class="flex justify-between"
                        >
                            <span
                                class="font-semibold text-[#172033]"
                            >
                                Sisa Tagihan
                            </span>

                            <span
                                class="font-bold text-amber-600"
                            >
                                Rp
                                {{
                                    remainingAmount.toLocaleString(
                                        'id-ID'
                                    )
                                }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Error -->
                <div
                    v-if="errorMessage"
                    class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    {{ errorMessage }}
                </div>

                <!-- Payment Date -->
                <div>
                    <label
                        class="mb-1.5 block text-sm font-medium text-[#172033]"
                    >
                        Tanggal Pembayaran
                    </label>

                    <input
                        v-model="
                            form.payment_date
                        "
                        type="date"
                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#172033] outline-none transition focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                    />
                </div>

                <!-- Amount -->
                <div>
                    <div
                        class="mb-1.5 flex items-center justify-between"
                    >
                        <label
                            class="block text-sm font-medium text-[#172033]"
                        >
                            Jumlah Pembayaran
                        </label>

                        <button
                            type="button"
                            @click="fillRemaining"
                            class="text-xs font-semibold text-[#14a2d8] hover:underline"
                        >
                            Bayar penuh
                        </button>
                    </div>

                    <div
                        class="relative"
                    >
                        <span
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                        >
                            Rp
                        </span>

                        <input
                            v-model="
                                form.amount
                            "
                            type="number"
                            min="1"
                            :max="
                                remainingAmount
                            "
                            step="1"
                            placeholder="0"
                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-11 text-sm text-[#172033] outline-none transition focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                        />
                    </div>

                    <p
                        class="mt-1.5 text-xs text-[#667085]"
                    >
                        Maksimal pembayaran:
                        <span
                            class="font-semibold"
                        >
                            Rp
                            {{
                                remainingAmount.toLocaleString(
                                    'id-ID'
                                )
                            }}
                        </span>
                    </p>
                </div>

                <!-- After Payment -->
                <div
                    v-if="
                        paymentAmount > 0 &&
                        paymentAmount <=
                            remainingAmount
                    "
                    class="rounded-xl border px-4 py-3"
                    :class="
                        isFullPayment
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-amber-200 bg-amber-50'
                    "
                >
                    <div
                        class="flex justify-between text-sm"
                    >
                        <span
                            class="text-[#667085]"
                        >
                            Status setelah pembayaran
                        </span>

                        <span
                            class="font-bold"
                            :class="
                                isFullPayment
                                    ? 'text-emerald-600'
                                    : 'text-amber-600'
                            "
                        >
                            {{
                                isFullPayment
                                    ? 'LUNAS'
                                    : 'SEBAGIAN'
                            }}
                        </span>
                    </div>

                    <div
                        class="mt-1 flex justify-between text-sm"
                    >
                        <span
                            class="text-[#667085]"
                        >
                            Sisa setelah pembayaran
                        </span>

                        <span
                            class="font-semibold text-[#172033]"
                        >
                            Rp
                            {{
                                afterPayment.toLocaleString(
                                    'id-ID'
                                )
                            }}
                        </span>
                    </div>
                </div>

                <!-- Notes -->
                <div>
                    <label
                        class="mb-1.5 block text-sm font-medium text-[#172033]"
                    >
                        Catatan
                        <span
                            class="font-normal text-slate-400"
                        >
                            (opsional)
                        </span>
                    </label>

                    <textarea
                        v-model="
                            form.notes
                        "
                        rows="3"
                        placeholder="Catatan pembayaran..."
                        class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#172033] outline-none transition focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                    ></textarea>
                </div>
            </div>

            <!-- Footer -->
            <div
                class="flex justify-end gap-2 border-t border-slate-200 px-6 py-4"
            >
                <button
                    type="button"
                    @click="close"
                    :disabled="loading"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#667085] transition hover:bg-slate-50 disabled:opacity-50"
                >
                    Batal
                </button>

                <button
                    type="button"
                    @click="submit"
                    :disabled="
                        loading ||
                        !paymentAmount ||
                        paymentAmount >
                            remainingAmount
                    "
                    class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <CreditCard
                        :size="16"
                    />

                    {{
                        loading
                            ? 'Menyimpan...'
                            : 'Simpan Pembayaran'
                    }}
                </button>
            </div>
        </div>
    </div>
</template>