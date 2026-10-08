<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <div class="flex items-center gap-2">
                    <h1 class="text-2xl font-bold text-slate-800">Kas & Bank</h1>
                    <span
                        class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"
                    >
                        Pengembangan
                    </span>
                </div>

                <p class="mt-1 text-sm text-slate-500">
                    Kelola kas, rekening bank, penerimaan dan pengeluaran.
                </p>
            </div>

            <button
                @click="openTransactionModal()"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#118fbe]"
            >
                <Plus class="h-4 w-4" />
                Transaksi Baru
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ErpSummaryCard
                title="Total Saldo"
                value="Rp 184.750.000"
                subtitle="Semua rekening"
                :icon="Wallet"
                icon-class="bg-blue-50 text-blue-600"
            />

            <ErpSummaryCard
                title="Saldo Kas"
                value="Rp 42.500.000"
                subtitle="Kas utama"
                :icon="Banknote"
                icon-class="bg-emerald-50 text-emerald-600"
            />

            <ErpSummaryCard
                title="Saldo Bank"
                value="Rp 142.250.000"
                subtitle="3 rekening aktif"
                :icon="Landmark"
                icon-class="bg-violet-50 text-violet-600"
            />

            <ErpSummaryCard
                title="Mutasi Bulan Ini"
                value="Rp 38.450.000"
                subtitle="Netto"
                :icon="ArrowLeftRight"
                icon-class="bg-orange-50 text-orange-600"
            />
        </div>

        <!-- ACCOUNT CARDS -->
        <div>
            <div class="mb-3 flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-slate-800">Rekening Kas & Bank</h2>
                    <p class="text-sm text-slate-500">
                        Saldo berdasarkan rekening.
                    </p>
                </div>

                <button
                    @click="openAccountModal()"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14a2d8] hover:underline"
                >
                    <Plus class="h-4 w-4" />
                    Rekening
                </button>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div
                    v-for="account in accounts"
                    :key="account.id"
                    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <div class="flex items-start justify-between">
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-xl"
                            :class="account.type === 'bank'
                                ? 'bg-violet-50 text-violet-600'
                                : 'bg-emerald-50 text-emerald-600'"
                        >
                            <Landmark v-if="account.type === 'bank'" class="h-5 w-5" />
                            <Wallet v-else class="h-5 w-5" />
                        </div>

                        <button
                            @click="openAccountModal(account)"
                            class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                            <MoreHorizontal class="h-5 w-5" />
                        </button>
                    </div>

                    <p class="mt-4 text-sm font-medium text-slate-500">
                        {{ account.name }}
                    </p>

                    <p class="mt-1 text-xl font-bold text-slate-800">
                        {{ formatCurrency(account.balance) }}
                    </p>

                    <p class="mt-2 text-xs text-slate-400">
                        {{ account.description }}
                    </p>
                </div>
            </div>
        </div>

        <!-- TRANSACTION TABLE -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 p-5">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 class="font-semibold text-slate-800">
                            Mutasi Kas & Bank
                        </h2>
                        <p class="text-sm text-slate-500">
                            Riwayat transaksi kas dan rekening bank.
                        </p>
                    </div>

                    <div class="flex flex-col gap-2 sm:flex-row">
                        <div class="relative">
                            <Search
                                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                v-model="search"
                                type="text"
                                placeholder="Cari transaksi..."
                                class="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10 sm:w-64"
                            />
                        </div>

                        <select
                            v-model="transactionFilter"
                            class="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#14a2d8]"
                        >
                            <option value="all">Semua transaksi</option>
                            <option value="in">Penerimaan</option>
                            <option value="out">Pengeluaran</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-sm">
                    <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th class="px-5 py-3 font-semibold">Tanggal</th>
                            <th class="px-5 py-3 font-semibold">No. Transaksi</th>
                            <th class="px-5 py-3 font-semibold">Rekening</th>
                            <th class="px-5 py-3 font-semibold">Keterangan</th>
                            <th class="px-5 py-3 text-right font-semibold">Nominal</th>
                            <th class="px-5 py-3 text-center font-semibold">Status</th>
                            <th class="px-5 py-3 text-right font-semibold"></th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        <tr
                            v-for="item in filteredTransactions"
                            :key="item.id"
                            class="hover:bg-slate-50"
                        >
                            <td class="px-5 py-4 text-slate-600">
                                {{ item.date }}
                            </td>

                            <td class="px-5 py-4 font-semibold text-slate-800">
                                {{ item.number }}
                            </td>

                            <td class="px-5 py-4">
                                <div class="font-medium text-slate-700">
                                    {{ item.account }}
                                </div>
                                <div class="text-xs text-slate-400">
                                    {{ item.accountNumber }}
                                </div>
                            </td>

                            <td class="px-5 py-4 text-slate-600">
                                {{ item.description }}
                            </td>

                            <td
                                class="px-5 py-4 text-right font-semibold"
                                :class="item.direction === 'in'
                                    ? 'text-emerald-600'
                                    : 'text-red-500'"
                            >
                                {{ item.direction === 'in' ? '+' : '-' }}
                                {{ formatCurrency(item.amount) }}
                            </td>

                            <td class="px-5 py-4 text-center">
                                <span
                                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="item.status === 'posted'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'"
                                >
                                    {{ item.status === 'posted' ? 'Posted' : 'Draft' }}
                                </span>
                            </td>

                            <td class="px-5 py-4 text-right">
                                <button
                                    @click="openTransactionModal(item)"
                                    class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <Eye class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>

                        <tr v-if="filteredTransactions.length === 0">
                            <td colspan="7" class="px-5 py-12 text-center text-slate-400">
                                Data transaksi tidak ditemukan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- DEVELOPMENT MODAL -->
        <ErpDevelopmentModal
            v-model="showDevelopmentModal"
            title="Kas & Bank masih dalam pengembangan"
            description="Halaman ini sudah disiapkan untuk kebutuhan UI dan simulasi transaksi. Data yang tampil saat ini masih berupa data dummy dan belum tersambung ke backend."
        />

        <!-- TRANSACTION MODAL -->
        <ErpBaseModal
            v-if="showTransactionModal"
            title="Transaksi Kas & Bank"
            @close="showTransactionModal = false"
        >
            <div class="space-y-4">
                <div class="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                    Mode pengembangan. Transaksi belum disimpan ke database.
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label class="label">Tanggal</label>
                        <input v-model="transactionForm.date" type="date" class="input" />
                    </div>

                    <div>
                        <label class="label">Jenis</label>
                        <select v-model="transactionForm.direction" class="input">
                            <option value="in">Penerimaan</option>
                            <option value="out">Pengeluaran</option>
                        </select>
                    </div>

                    <div>
                        <label class="label">Rekening</label>
                        <select v-model="transactionForm.account" class="input">
                            <option>Kas Utama</option>
                            <option>Bank BCA</option>
                            <option>Bank Mandiri</option>
                            <option>Bank BRI</option>
                        </select>
                    </div>

                    <div>
                        <label class="label">Nominal</label>
                        <input
                            v-model="transactionForm.amount"
                            type="number"
                            class="input"
                            placeholder="0"
                        />
                    </div>

                    <div class="md:col-span-2">
                        <label class="label">Keterangan</label>
                        <textarea
                            v-model="transactionForm.description"
                            rows="3"
                            class="input"
                            placeholder="Keterangan transaksi..."
                        />
                    </div>
                </div>
            </div>

            <template #footer>
                <button
                    @click="showTransactionModal = false"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
                >
                    Batal
                </button>

                <button
                    @click="showDummySavedMessage"
                    class="rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white"
                >
                    Simpan Dummy
                </button>
            </template>
        </ErpBaseModal>

        <!-- ACCOUNT MODAL -->
        <ErpBaseModal
            v-if="showAccountModal"
            title="Rekening Kas / Bank"
            @close="showAccountModal = false"
        >
            <div class="space-y-4">
                <div>
                    <label class="label">Nama Rekening</label>
                    <input v-model="accountForm.name" class="input" />
                </div>

                <div>
                    <label class="label">Jenis</label>
                    <select v-model="accountForm.type" class="input">
                        <option value="cash">Kas</option>
                        <option value="bank">Bank</option>
                    </select>
                </div>

                <div>
                    <label class="label">Nomor Rekening</label>
                    <input v-model="accountForm.number" class="input" />
                </div>

                <div>
                    <label class="label">Saldo Awal</label>
                    <input v-model="accountForm.balance" type="number" class="input" />
                </div>
            </div>

            <template #footer>
                <button
                    @click="showAccountModal = false"
                    class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
                >
                    Batal
                </button>

                <button
                    @click="showDummySavedMessage"
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
    Wallet,
    Banknote,
    Landmark,
    ArrowLeftRight,
    MoreHorizontal,
} from 'lucide-vue-next'

import ErpSummaryCard from '../../components/erp/finance/ErpSummaryCard.vue'
import ErpBaseModal from '../../components/erp/finance/ErpBaseModal.vue'
import ErpDevelopmentModal from '../../components/erp/finance/ErpDevelopmentModal.vue'


const showDevelopmentModal = ref(false)
const showTransactionModal = ref(false)
const showAccountModal = ref(false)

const search = ref('')
const transactionFilter = ref('all')

const accounts = ref([
    {
        id: 1,
        name: 'Kas Utama',
        type: 'cash',
        number: '-',
        balance: 42500000,
        description: 'Kas operasional',
    },
    {
        id: 2,
        name: 'Bank BCA',
        type: 'bank',
        number: '1234567890',
        balance: 82500000,
        description: 'Rekening operasional',
    },
    {
        id: 3,
        name: 'Bank Mandiri',
        type: 'bank',
        number: '0987654321',
        balance: 59750000,
        description: 'Rekening pembayaran',
    },
    {
        id: 4,
        name: 'Bank BRI',
        type: 'bank',
        number: '1122334455',
        balance: 10000000,
        description: 'Rekening cadangan',
    },
])

const transactions = ref([
    {
        id: 1,
        date: '2026-10-08',
        number: 'KB-00021',
        account: 'Bank BCA',
        accountNumber: '1234567890',
        description: 'Penerimaan pembayaran pelanggan',
        amount: 12500000,
        direction: 'in',
        status: 'posted',
    },
    {
        id: 2,
        date: '2026-10-07',
        number: 'KB-00020',
        account: 'Kas Utama',
        accountNumber: '-',
        description: 'Pembelian perlengkapan kantor',
        amount: 1850000,
        direction: 'out',
        status: 'posted',
    },
    {
        id: 3,
        date: '2026-10-06',
        number: 'KB-00019',
        account: 'Bank Mandiri',
        accountNumber: '0987654321',
        description: 'Pembayaran supplier',
        amount: 7200000,
        direction: 'out',
        status: 'posted',
    },
    {
        id: 4,
        date: '2026-10-05',
        number: 'KB-00018',
        account: 'Bank BCA',
        accountNumber: '1234567890',
        description: 'Transfer masuk dari pelanggan',
        amount: 5600000,
        direction: 'in',
        status: 'draft',
    },
])

const transactionForm = ref({
    date: '2026-10-08',
    direction: 'in',
    account: 'Kas Utama',
    amount: '',
    description: '',
})

const accountForm = ref({
    name: '',
    type: 'bank',
    number: '',
    balance: '',
})

const filteredTransactions = computed(() => {
    const keyword = search.value.toLowerCase()

    return transactions.value.filter((item) => {
        const matchesSearch =
            !keyword ||
            item.number.toLowerCase().includes(keyword) ||
            item.account.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)

        const matchesFilter =
            transactionFilter.value === 'all' ||
            item.direction === transactionFilter.value

        return matchesSearch && matchesFilter
    })
})

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value)
}

function openTransactionModal(item = null) {
    if (item) {
        transactionForm.value = {
            date: item.date,
            direction: item.direction,
            account: item.account,
            amount: item.amount,
            description: item.description,
        }
    }

    showTransactionModal.value = true
}

function openAccountModal(account = null) {
    if (account) {
        accountForm.value = {
            name: account.name,
            type: account.type,
            number: account.number,
            balance: account.balance,
        }
    } else {
        accountForm.value = {
            name: '',
            type: 'bank',
            number: '',
            balance: '',
        }
    }

    showAccountModal.value = true
}

function showDummySavedMessage() {
    alert('Mode pengembangan: data dummy tidak disimpan ke database.')
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
    color: #334155;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
}

.input {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition: border-color 150ms, box-shadow 150ms;
}

.input:focus {
    border-color: #14a2d8;
    box-shadow: 0 0 0 2px rgb(20 162 216 / 10%);
}
</style>