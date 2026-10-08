<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <div class="flex items-center gap-2">
                    <h1 class="text-2xl font-bold text-slate-800">Piutang</h1>
                    <span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Pengembangan
                    </span>
                </div>

                <p class="mt-1 text-sm text-slate-500">
                    Pantau tagihan customer dan pembayaran piutang.
                </p>
            </div>

            <button
                @click="openPaymentModal()"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#118fbe]"
            >
                <Plus class="h-4 w-4" />
                Catat Pembayaran
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ErpSummaryCard
                title="Total Piutang"
                value="Rp 48.750.000"
                subtitle="Outstanding"
                :icon="WalletCards"
                icon-class="bg-blue-50 text-blue-600"
            />

            <ErpSummaryCard
                title="Belum Jatuh Tempo"
                value="Rp 31.250.000"
                subtitle="6 invoice"
                :icon="Clock3"
                icon-class="bg-emerald-50 text-emerald-600"
            />

            <ErpSummaryCard
                title="Jatuh Tempo"
                value="Rp 11.500.000"
                subtitle="3 invoice"
                :icon="CalendarClock"
                icon-class="bg-orange-50 text-orange-600"
            />

            <ErpSummaryCard
                title="Terlambat"
                value="Rp 6.000.000"
                subtitle="2 invoice"
                :icon="AlertTriangle"
                icon-class="bg-red-50 text-red-600"
            />
        </div>

        <!-- AGING -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div
                v-for="aging in agingData"
                :key="aging.label"
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-slate-500">{{ aging.label }}</p>
                <p class="mt-2 text-lg font-bold text-slate-800">
                    {{ formatCurrency(aging.value) }}
                </p>
                <p class="mt-1 text-xs text-slate-400">
                    {{ aging.count }} invoice
                </p>

                <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        class="h-full rounded-full"
                        :class="aging.color"
                        :style="{ width: aging.percent + '%' }"
                    />
                </div>
            </div>
        </div>

        <!-- TABLE -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 p-5">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 class="font-semibold text-slate-800">Daftar Piutang</h2>
                        <p class="text-sm text-slate-500">
                            Invoice customer yang masih memiliki saldo.
                        </p>
                    </div>

                    <div class="flex flex-col gap-2 sm:flex-row">
                        <div class="relative">
                            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                v-model="search"
                                placeholder="Cari invoice/customer..."
                                class="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#14a2d8] sm:w-64"
                            />
                        </div>

                        <select
                            v-model="statusFilter"
                            class="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#14a2d8]"
                        >
                            <option value="all">Semua</option>
                            <option value="current">Belum Jatuh Tempo</option>
                            <option value="due">Jatuh Tempo</option>
                            <option value="overdue">Terlambat</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[950px] text-sm">
                    <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th class="px-5 py-3">Invoice</th>
                            <th class="px-5 py-3">Customer</th>
                            <th class="px-5 py-3">Tanggal</th>
                            <th class="px-5 py-3">Jatuh Tempo</th>
                            <th class="px-5 py-3 text-right">Total</th>
                            <th class="px-5 py-3 text-right">Terbayar</th>
                            <th class="px-5 py-3 text-right">Piutang</th>
                            <th class="px-5 py-3 text-center">Status</th>
                            <th class="px-5 py-3"></th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        <tr
                            v-for="item in filteredReceivables"
                            :key="item.id"
                            class="hover:bg-slate-50"
                        >
                            <td class="px-5 py-4 font-semibold text-slate-800">
                                {{ item.invoice }}
                            </td>

                            <td class="px-5 py-4 text-slate-700">
                                {{ item.customer }}
                            </td>

                            <td class="px-5 py-4 text-slate-500">
                                {{ item.date }}
                            </td>

                            <td class="px-5 py-4 text-slate-500">
                                {{ item.dueDate }}
                            </td>

                            <td class="px-5 py-4 text-right">
                                {{ formatCurrency(item.total) }}
                            </td>

                            <td class="px-5 py-4 text-right text-emerald-600">
                                {{ formatCurrency(item.paid) }}
                            </td>

                            <td class="px-5 py-4 text-right font-bold text-slate-800">
                                {{ formatCurrency(item.outstanding) }}
                            </td>

                            <td class="px-5 py-4 text-center">
                                <span
                                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="statusClass(item.status)"
                                >
                                    {{ statusLabel(item.status) }}
                                </span>
                            </td>

                            <td class="px-5 py-4 text-right">
                                <button
                                    @click="openDetail(item)"
                                    class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <Eye class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>

                        <tr v-if="filteredReceivables.length === 0">
                            <td colspan="9" class="px-5 py-12 text-center text-slate-400">
                                Data piutang tidak ditemukan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- DEVELOPMENT -->
        <ErpDevelopmentModal
            v-model="showDevelopmentModal"
            title="Piutang masih dalam pengembangan"
            description="Data customer, invoice dan pembayaran pada halaman ini masih berupa data dummy. Belum ada koneksi ke backend."
        />

        <!-- DETAIL -->
        <ErpBaseModal
            v-if="showDetailModal"
            title="Detail Piutang"
            @close="showDetailModal = false"
        >
            <div v-if="selectedItem" class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-slate-400">Invoice</p>
                        <p class="mt-1 font-semibold">{{ selectedItem.invoice }}</p>
                    </div>

                    <div>
                        <p class="text-xs text-slate-400">Customer</p>
                        <p class="mt-1 font-semibold">{{ selectedItem.customer }}</p>
                    </div>

                    <div>
                        <p class="text-xs text-slate-400">Tanggal</p>
                        <p class="mt-1">{{ selectedItem.date }}</p>
                    </div>

                    <div>
                        <p class="text-xs text-slate-400">Jatuh Tempo</p>
                        <p class="mt-1">{{ selectedItem.dueDate }}</p>
                    </div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-5">
                    <div class="flex justify-between">
                        <span>Total Invoice</span>
                        <b>{{ formatCurrency(selectedItem.total) }}</b>
                    </div>

                    <div class="mt-3 flex justify-between text-emerald-600">
                        <span>Sudah Dibayar</span>
                        <b>{{ formatCurrency(selectedItem.paid) }}</b>
                    </div>

                    <div class="mt-3 flex justify-between border-t border-slate-200 pt-3 text-lg">
                        <span class="font-semibold">Sisa Piutang</span>
                        <b>{{ formatCurrency(selectedItem.outstanding) }}</b>
                    </div>
                </div>
            </div>

            <template #footer>
                <button
                    @click="showDetailModal = false"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
                >
                    Tutup
                </button>

                <button
                    @click="openPaymentModal(selectedItem)"
                    class="rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white"
                >
                    Catat Pembayaran
                </button>
            </template>
        </ErpBaseModal>

        <!-- PAYMENT -->
        <ErpBaseModal
            v-if="showPaymentModal"
            title="Catat Pembayaran Piutang"
            @close="showPaymentModal = false"
        >
            <div class="space-y-4">
                <div class="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                    Pembayaran ini hanya simulasi dan belum masuk database.
                </div>

                <div>
                    <label class="label">Invoice</label>
                    <select v-model="paymentForm.invoice" class="input">
                        <option
                            v-for="item in receivables"
                            :key="item.id"
                            :value="item.invoice"
                        >
                            {{ item.invoice }} — {{ item.customer }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="label">Tanggal Pembayaran</label>
                    <input v-model="paymentForm.date" type="date" class="input" />
                </div>

                <div>
                    <label class="label">Rekening Penerimaan</label>
                    <select v-model="paymentForm.account" class="input">
                        <option>Bank BCA</option>
                        <option>Bank Mandiri</option>
                        <option>Kas Utama</option>
                    </select>
                </div>

                <div>
                    <label class="label">Nominal</label>
                    <input v-model="paymentForm.amount" type="number" class="input" />
                </div>

                <div>
                    <label class="label">Keterangan</label>
                    <textarea v-model="paymentForm.notes" rows="3" class="input" />
                </div>
            </div>

            <template #footer>
                <button
                    @click="showPaymentModal = false"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
                >
                    Batal
                </button>

                <button
                    @click="dummyPayment"
                    class="rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white"
                >
                    Simpan Dummy
                </button>
            </template>
        </ErpBaseModal>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
    Plus,
    Search,
    Eye,
    WalletCards,
    Clock3,
    CalendarClock,
    AlertTriangle,
} from 'lucide-vue-next'

import ErpSummaryCard from '../../components/erp/finance/ErpSummaryCard.vue'
import ErpBaseModal from '../../components/erp/finance/ErpBaseModal.vue'
import ErpDevelopmentModal from '../../components/erp/finance/ErpDevelopmentModal.vue'

const showDevelopmentModal = ref(false)
const showDetailModal = ref(false)
const showPaymentModal = ref(false)

const search = ref('')
const statusFilter = ref('all')
const selectedItem = ref(null)

const agingData = [
    { label: 'Belum Jatuh Tempo', value: 31250000, count: 6, percent: 64, color: 'bg-emerald-500' },
    { label: '1–30 Hari', value: 8500000, count: 2, percent: 17, color: 'bg-yellow-500' },
    { label: '31–60 Hari', value: 5000000, count: 1, percent: 10, color: 'bg-orange-500' },
    { label: '> 60 Hari', value: 4000000, count: 1, percent: 9, color: 'bg-red-500' },
]

const receivables = ref([
    {
        id: 1,
        invoice: 'INV-2026-0012',
        customer: 'PT Maju Bersama',
        date: '2026-09-15',
        dueDate: '2026-10-15',
        total: 18500000,
        paid: 5000000,
        outstanding: 13500000,
        status: 'current',
    },
    {
        id: 2,
        invoice: 'INV-2026-0015',
        customer: 'CV Sumber Rejeki',
        date: '2026-09-01',
        dueDate: '2026-10-01',
        total: 12000000,
        paid: 2000000,
        outstanding: 10000000,
        status: 'due',
    },
    {
        id: 3,
        invoice: 'INV-2026-0008',
        customer: 'PT Sentosa Abadi',
        date: '2026-08-05',
        dueDate: '2026-09-05',
        total: 8500000,
        paid: 2500000,
        outstanding: 6000000,
        status: 'overdue',
    },
    {
        id: 4,
        invoice: 'INV-2026-0018',
        customer: 'UD Berkah Jaya',
        date: '2026-09-28',
        dueDate: '2026-10-28',
        total: 19250000,
        paid: 13250000,
        outstanding: 6000000,
        status: 'current',
    },
])

const paymentForm = ref({
    invoice: '',
    date: '2026-10-08',
    account: 'Bank BCA',
    amount: '',
    notes: '',
})

const filteredReceivables = computed(() => {
    const keyword = search.value.toLowerCase()

    return receivables.value.filter((item) => {
        const matchesSearch =
            !keyword ||
            item.invoice.toLowerCase().includes(keyword) ||
            item.customer.toLowerCase().includes(keyword)

        const matchesStatus =
            statusFilter.value === 'all' ||
            item.status === statusFilter.value

        return matchesSearch && matchesStatus
    })
})

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value)
}

function statusLabel(status) {
    return {
        current: 'Belum Jatuh Tempo',
        due: 'Jatuh Tempo',
        overdue: 'Terlambat',
    }[status]
}

function statusClass(status) {
    return {
        current: 'bg-emerald-50 text-emerald-700',
        due: 'bg-orange-50 text-orange-700',
        overdue: 'bg-red-50 text-red-700',
    }[status]
}

function openDetail(item) {
    selectedItem.value = item
    showDetailModal.value = true
}

function openPaymentModal(item = null) {
    if (item) {
        paymentForm.value.invoice = item.invoice
        paymentForm.value.amount = item.outstanding
    } else if (!paymentForm.value.invoice && receivables.value.length) {
        paymentForm.value.invoice = receivables.value[0].invoice
        paymentForm.value.amount = receivables.value[0].outstanding
    }

    showPaymentModal.value = true
}

function dummyPayment() {
    alert('Mode pengembangan: pembayaran dummy tidak disimpan ke database.')
}

onMounted(() => {
    setTimeout(() => {
        showDevelopmentModal.value = true
    }, 300)
})
</script>

<style scoped>
.label {
    display: block;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #334155;
}

.input {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    outline: none;
}

.input:focus {
    border-color: #14a2d8;
    box-shadow: 0 0 0 2px rgba(20, 162, 216, 0.1);
}
</style>