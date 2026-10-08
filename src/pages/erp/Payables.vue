<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <div class="flex items-center gap-2">
                    <h1 class="text-2xl font-bold text-slate-800">Hutang</h1>

                    <span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Pengembangan
                    </span>
                </div>

                <p class="mt-1 text-sm text-slate-500">
                    Pantau kewajiban pembayaran kepada supplier.
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

        <!-- INFO -->
        <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div class="flex gap-3">
                <Info class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                    <p class="font-semibold text-amber-800">
                        Modul hutang masih dalam tahap pengembangan
                    </p>

                    <p class="mt-1 text-sm leading-6 text-amber-700">
                        Data di bawah hanya simulasi. Purchase Order belum dianggap
                        sebagai hutang sampai tersedia modul invoice/tagihan supplier.
                    </p>
                </div>
            </div>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ErpSummaryCard
                title="Total Hutang"
                value="Rp 37.850.000"
                subtitle="Outstanding"
                :icon="CreditCard"
                icon-class="bg-blue-50 text-blue-600"
            />

            <ErpSummaryCard
                title="Belum Jatuh Tempo"
                value="Rp 24.500.000"
                subtitle="5 tagihan"
                :icon="Clock3"
                icon-class="bg-emerald-50 text-emerald-600"
            />

            <ErpSummaryCard
                title="Jatuh Tempo"
                value="Rp 8.350.000"
                subtitle="2 tagihan"
                :icon="CalendarClock"
                icon-class="bg-orange-50 text-orange-600"
            />

            <ErpSummaryCard
                title="Terlambat"
                value="Rp 5.000.000"
                subtitle="1 tagihan"
                :icon="AlertTriangle"
                icon-class="bg-red-50 text-red-600"
            />
        </div>

        <!-- SUPPLIER SUMMARY -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div
                v-for="supplier in supplierSummary"
                :key="supplier.name"
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div class="flex items-start justify-between">
                    <div>
                        <p class="font-semibold text-slate-800">
                            {{ supplier.name }}
                        </p>

                        <p class="mt-1 text-xs text-slate-400">
                            {{ supplier.invoiceCount }} tagihan
                        </p>
                    </div>

                    <span
                        class="rounded-full px-2.5 py-1 text-xs font-semibold"
                        :class="supplier.status === 'overdue'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-emerald-50 text-emerald-700'"
                    >
                        {{ supplier.status === 'overdue' ? 'Ada terlambat' : 'Normal' }}
                    </span>
                </div>

                <p class="mt-5 text-xl font-bold text-slate-800">
                    {{ formatCurrency(supplier.amount) }}
                </p>

                <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        class="h-full rounded-full"
                        :class="supplier.status === 'overdue'
                            ? 'bg-red-500'
                            : 'bg-[#14a2d8]'"
                        :style="{ width: supplier.percent + '%' }"
                    />
                </div>
            </div>
        </div>

        <!-- TABLE -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 p-5">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 class="font-semibold text-slate-800">
                            Daftar Hutang
                        </h2>

                        <p class="text-sm text-slate-500">
                            Tagihan supplier yang masih harus dibayar.
                        </p>
                    </div>

                    <div class="flex flex-col gap-2 sm:flex-row">
                        <div class="relative">
                            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                v-model="search"
                                placeholder="Cari tagihan/supplier..."
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
                            <th class="px-5 py-3">No. Tagihan</th>
                            <th class="px-5 py-3">Supplier</th>
                            <th class="px-5 py-3">Tanggal</th>
                            <th class="px-5 py-3">Jatuh Tempo</th>
                            <th class="px-5 py-3 text-right">Total</th>
                            <th class="px-5 py-3 text-right">Terbayar</th>
                            <th class="px-5 py-3 text-right">Hutang</th>
                            <th class="px-5 py-3 text-center">Status</th>
                            <th class="px-5 py-3"></th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        <tr
                            v-for="item in filteredPayables"
                            :key="item.id"
                            class="hover:bg-slate-50"
                        >
                            <td class="px-5 py-4 font-semibold text-slate-800">
                                {{ item.invoice }}
                            </td>

                            <td class="px-5 py-4 text-slate-700">
                                {{ item.supplier }}
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

                        <tr v-if="filteredPayables.length === 0">
                            <td colspan="9" class="px-5 py-12 text-center text-slate-400">
                                Data hutang tidak ditemukan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- DEVELOPMENT -->
        <ErpDevelopmentModal
            v-model="showDevelopmentModal"
            title="Hutang masih dalam pengembangan"
            description="Modul hutang belum terhubung dengan Purchase Invoice karena backend saat ini belum memiliki modul tagihan supplier. Data yang tampil hanya dummy."
        />

        <!-- DETAIL -->
        <ErpBaseModal
            v-if="showDetailModal"
            title="Detail Hutang"
            @close="showDetailModal = false"
        >
            <div v-if="selectedItem" class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-slate-400">No. Tagihan</p>
                        <p class="mt-1 font-semibold">{{ selectedItem.invoice }}</p>
                    </div>

                    <div>
                        <p class="text-xs text-slate-400">Supplier</p>
                        <p class="mt-1 font-semibold">{{ selectedItem.supplier }}</p>
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
                        <span>Total Tagihan</span>
                        <b>{{ formatCurrency(selectedItem.total) }}</b>
                    </div>

                    <div class="mt-3 flex justify-between text-emerald-600">
                        <span>Sudah Dibayar</span>
                        <b>{{ formatCurrency(selectedItem.paid) }}</b>
                    </div>

                    <div class="mt-3 flex justify-between border-t border-slate-200 pt-3 text-lg">
                        <span class="font-semibold">Sisa Hutang</span>
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
            title="Pembayaran Hutang"
            @close="showPaymentModal = false"
        >
            <div class="space-y-4">
                <div class="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                    Mode pengembangan. Pembayaran belum disimpan ke database.
                </div>

                <div>
                    <label class="label">No. Tagihan</label>

                    <select v-model="paymentForm.invoice" class="input">
                        <option
                            v-for="item in payables"
                            :key="item.id"
                            :value="item.invoice"
                        >
                            {{ item.invoice }} — {{ item.supplier }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="label">Tanggal Pembayaran</label>
                    <input
                        v-model="paymentForm.date"
                        type="date"
                        class="input"
                    />
                </div>

                <div>
                    <label class="label">Rekening Pembayaran</label>

                    <select v-model="paymentForm.account" class="input">
                        <option>Bank BCA</option>
                        <option>Bank Mandiri</option>
                        <option>Kas Utama</option>
                    </select>
                </div>

                <div>
                    <label class="label">Nominal</label>

                    <input
                        v-model="paymentForm.amount"
                        type="number"
                        class="input"
                    />
                </div>

                <div>
                    <label class="label">Keterangan</label>

                    <textarea
                        v-model="paymentForm.notes"
                        rows="3"
                        class="input"
                    />
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
    Info,
    CreditCard,
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

const supplierSummary = [
    {
        name: 'PT Sumber Makmur',
        invoiceCount: 3,
        amount: 15500000,
        percent: 42,
        status: 'normal',
    },
    {
        name: 'CV Berkah Jaya',
        invoiceCount: 2,
        amount: 12350000,
        percent: 33,
        status: 'normal',
    },
    {
        name: 'PT Sentosa Supplier',
        invoiceCount: 2,
        amount: 10000000,
        percent: 25,
        status: 'overdue',
    },
]

const payables = ref([
    {
        id: 1,
        invoice: 'BILL-2026-0011',
        supplier: 'PT Sumber Makmur',
        date: '2026-09-20',
        dueDate: '2026-10-20',
        total: 18500000,
        paid: 5000000,
        outstanding: 13500000,
        status: 'current',
    },
    {
        id: 2,
        invoice: 'BILL-2026-0009',
        supplier: 'CV Berkah Jaya',
        date: '2026-09-01',
        dueDate: '2026-10-01',
        total: 10500000,
        paid: 2150000,
        outstanding: 8350000,
        status: 'due',
    },
    {
        id: 3,
        invoice: 'BILL-2026-0005',
        supplier: 'PT Sentosa Supplier',
        date: '2026-07-25',
        dueDate: '2026-08-25',
        total: 8000000,
        paid: 3000000,
        outstanding: 5000000,
        status: 'overdue',
    },
    {
        id: 4,
        invoice: 'BILL-2026-0014',
        supplier: 'CV Berkah Jaya',
        date: '2026-09-28',
        dueDate: '2026-10-28',
        total: 10000000,
        paid: 4000000,
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

const filteredPayables = computed(() => {
    const keyword = search.value.toLowerCase()

    return payables.value.filter((item) => {
        const matchesSearch =
            !keyword ||
            item.invoice.toLowerCase().includes(keyword) ||
            item.supplier.toLowerCase().includes(keyword)

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
    } else if (!paymentForm.value.invoice && payables.value.length) {
        paymentForm.value.invoice = payables.value[0].invoice
        paymentForm.value.amount = payables.value[0].outstanding
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
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    outline: none;
}

.input:focus {
    border-color: #14a2d8;
    box-shadow: 0 0 0 2px rgba(20, 162, 216, 0.1);
}
</style>