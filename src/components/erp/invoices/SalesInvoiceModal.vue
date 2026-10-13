
<template>
    <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        @click.self="emit('close')"
    >
        <div
            class="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
            <!-- Header -->
            <div
                class="flex items-center justify-between border-b border-slate-200 px-6 py-4"
            >
                <div>
                    <h2 class="text-lg font-bold text-[#172033]">
                        {{ modalTitle }}
                    </h2>

                    <p class="mt-1 text-sm text-[#667085]">
                        Kelola informasi invoice, item penjualan, dan pajak.
                    </p>
                </div>

                <button
                    type="button"
                    @click="emit('close')"
                    class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                    <X :size="20" />
                </button>
            </div>

            <!-- Body -->
            <div class="min-h-0 flex-1 overflow-y-auto p-6">
                <!-- Informasi Invoice -->
                <section>
                    <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                        Informasi Invoice
                    </h3>

                    <div
                        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                        <!-- Seri -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                                Seri Invoice <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-if="!isEdit"
                                v-model="form.invoice_series_id"
                                :disabled="loadingMaster"
                                class="form-input"
                            >
                                <option value="">Pilih Seri Invoice</option>

                                <option
                                    v-for="series in invoiceSeries"
                                    :key="series.id"
                                    :value="series.id"
                                >
                                    {{ series.code }} - {{ series.name }}
                                </option>
                            </select>

                            <div
                                v-else
                                class="flex h-[42px] items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm text-slate-600"
                            >
                                {{
                                    invoice?.invoice_series?.code
                                        ? `${invoice.invoice_series.code} - ${invoice.invoice_series.name}`
                                        : 'Seri invoice tersimpan'
                                }}
                            </div>
                        </div>

                        <!-- Customer -->
                        <div class="lg:col-span-2">
                            <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                                Customer <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="form.customer_id"
                                :disabled="loadingMaster"
                                class="form-input"
                            >
                                <option value="">Pilih Customer</option>

                                <option
                                    v-for="customer in customers"
                                    :key="customer.id"
                                    :value="customer.id"
                                >
                                    {{ customer.code }} - {{ customer.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Nomor -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                                No. Invoice
                            </label>

                            <div class="form-readonly">
                                {{ invoice?.invoice_number ?? 'Otomatis saat disimpan' }}
                            </div>
                        </div>

                        <!-- Tanggal -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                                Tanggal Invoice <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="form.invoice_date"
                                type="date"
                                class="form-input"
                            />
                        </div>

                        <!-- Jatuh Tempo -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                                Jatuh Tempo
                            </label>

                            <input
                                v-model="form.due_date"
                                type="date"
                                class="form-input"
                            />
                        </div>
                    </div>
                </section>

                <!-- Item Invoice -->
                <section class="mt-8">
                    <div class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 class="font-semibold text-[#172033]">
                                Item Invoice
                            </h3>

                            <p class="mt-1 text-xs text-[#667085]">
                                Harga dan diskon dimasukkan per item. Pajak dihitung di ringkasan invoice.
                            </p>
                        </div>

                        <button
                            type="button"
                            @click="addItem"
                            class="inline-flex items-center justify-center gap-2 rounded-lg border border-[#14a2d8] px-3 py-2 text-xs font-semibold text-[#14a2d8] hover:bg-[#14a2d8]/5"
                        >
                            <Plus :size="15" />
                            Tambah Item
                        </button>
                    </div>

                    <div class="overflow-x-auto rounded-xl border border-slate-200">
                        <table class="w-full min-w-[900px] text-sm">
                            <thead>
                                <tr class="bg-slate-50">
                                    <th class="px-3 py-3 text-left font-semibold text-[#667085]">
                                        Produk / Jasa
                                    </th>

                                    <th class="w-24 px-3 py-3 text-right font-semibold text-[#667085]">
                                        Qty
                                    </th>

                                    <th class="w-36 px-3 py-3 text-left font-semibold text-[#667085]">
                                        Satuan
                                    </th>

                                    <th class="w-40 px-3 py-3 text-right font-semibold text-[#667085]">
                                        Harga
                                    </th>

                                    <th class="w-36 px-3 py-3 text-right font-semibold text-[#667085]">
                                        Diskon
                                    </th>

                                    <th class="w-44 px-3 py-3 text-right font-semibold text-[#667085]">
                                        Subtotal Item
                                    </th>

                                    <th class="w-12 px-3 py-3"></th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">
                                <tr
                                    v-for="(item, index) in form.items"
                                    :key="item.key"
                                >
                                    <td class="p-2">
                                        <input
                                            v-model="item.description"
                                            type="text"
                                            placeholder="Nama produk / jasa"
                                            class="form-input"
                                        />
                                    </td>

                                    <td class="p-2">
                                        <input
                                            v-model.number="item.quantity"
                                            type="number"
                                            min="0.001"
                                            step="0.001"
                                            class="form-input text-right"
                                        />
                                    </td>

                                    <td class="p-2">
                                        <select
                                            v-model="item.unit_id"
                                            class="form-input"
                                        >
                                            <option value="">Pilih Satuan</option>

                                            <option
                                                v-for="unit in units"
                                                :key="unit.id"
                                                :value="unit.id"
                                            >
                                                {{ unit.code }} - {{ unit.name }}
                                            </option>
                                        </select>
                                    </td>

                                    <td class="p-2">
                                        <input
                                            v-model.number="item.unit_price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            class="form-input text-right"
                                        />
                                    </td>

                                    <td class="p-2">
                                        <input
                                            v-model.number="item.discount_amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            class="form-input text-right"
                                        />
                                    </td>

                                    <td class="p-2 text-right">
                                        <span class="font-medium text-slate-700">
                                            {{ formatCurrency(itemSubtotal(item)) }}
                                        </span>
                                    </td>

                                    <td class="p-2 text-center">
                                        <button
                                            type="button"
                                            @click="removeItem(index)"
                                            :disabled="form.items.length === 1"
                                            class="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <Trash2 :size="16" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Pajak dan Ringkasan -->
                <section class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <!-- Pengaturan Pajak -->
                    <div class="rounded-2xl border border-slate-200 p-5">
                        <h3 class="font-semibold text-[#172033]">
                            Pajak Invoice
                        </h3>

                        <p class="mt-1 text-xs leading-5 text-[#667085]">
                            Masukkan tarif pajak dalam persen. Perhitungan dilakukan pada tingkat invoice, bukan per item.
                        </p>

                        <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <!-- PPN -->
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                                    Tarif PPN (%)
                                </label>

                                <div class="relative">
                                    <input
                                        v-model.number="form.ppn_rate"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        class="form-input pr-10 text-right"
                                        placeholder="0"
                                    />

                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        %
                                    </span>
                                </div>

                                <p class="mt-1.5 text-xs text-[#667085]">
                                    PPN: {{ formatCurrency(ppnAmount) }}
                                </p>
                            </div>

                            <!-- PPh -->
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                                    Tarif PPh (%)
                                </label>

                                <div class="relative">
                                    <input
                                        v-model.number="form.pph_rate"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        class="form-input pr-10 text-right"
                                        placeholder="0"
                                    />

                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        %
                                    </span>
                                </div>

                                <p class="mt-1.5 text-xs text-[#667085]">
                                    PPh: {{ formatCurrency(pphAmount) }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-4 rounded-xl bg-slate-50 p-3">
                            <div class="flex justify-between gap-4 text-sm">
                                <span class="text-slate-600">Dasar pengenaan pajak</span>

                                <span class="text-right font-semibold text-slate-800">
                                    {{ formatCurrency(dpp) }}
                                </span>
                            </div>
                        </div>

                        <p class="mt-3 text-xs leading-5 text-amber-700">
                            Pastikan tarif dan dasar pengenaan pajak sesuai jenis transaksi. PPh di sini diperlakukan sebagai potongan pembayaran yang dipotong customer.
                        </p>
                    </div>

                    <!-- Ringkasan -->
                    <div class="rounded-2xl border border-slate-200 p-5">
                        <h3 class="font-semibold text-[#172033]">
                            Ringkasan Invoice
                        </h3>

                        <div class="mt-5 space-y-3">
                            <div class="flex justify-between gap-4 text-sm">
                                <span class="text-[#667085]">Subtotal item</span>

                                <span class="font-medium text-[#172033]">
                                    {{ formatCurrency(subtotal) }}
                                </span>
                            </div>

                            <div class="flex justify-between gap-4 text-sm">
                                <span class="text-[#667085]">Diskon item</span>

                                <span class="font-medium text-[#172033]">
                                    - {{ formatCurrency(totalDiscount) }}
                                </span>
                            </div>

                            <div class="flex justify-between gap-4 border-t border-slate-100 pt-3 text-sm">
                                <span class="text-[#667085]">DPP</span>

                                <span class="font-medium text-[#172033]">
                                    {{ formatCurrency(dpp) }}
                                </span>
                            </div>

                            <div class="flex justify-between gap-4 text-sm">
                                <span class="text-[#667085]">
                                    PPN ({{ normalizedRate(form.ppn_rate) }}%)
                                </span>

                                <span class="font-medium text-[#172033]">
                                    + {{ formatCurrency(ppnAmount) }}
                                </span>
                            </div>

                            <div class="flex justify-between gap-4 text-sm">
                                <span class="text-[#667085]">
                                    PPh ({{ normalizedRate(form.pph_rate) }}%)
                                </span>

                                <span class="font-medium text-rose-600">
                                    - {{ formatCurrency(pphAmount) }}
                                </span>
                            </div>

                            <div class="border-t border-slate-200 pt-4">
                                <div class="flex items-start justify-between gap-4">
                                    <div>
                                        <p class="font-semibold text-[#172033]">
                                            Total Tagihan
                                        </p>

                                        <p class="mt-1 text-xs text-[#667085]">
                                            Setelah PPN dan potongan PPh
                                        </p>
                                    </div>

                                    <span class="text-right text-xl font-bold text-[#003366]">
                                        {{ formatCurrency(grandTotal) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Catatan -->
                <section class="mt-6">
                    <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                        Catatan
                    </label>

                    <textarea
                        v-model="form.notes"
                        rows="3"
                        placeholder="Catatan invoice..."
                        class="form-input resize-none"
                    ></textarea>
                </section>
            </div>

            <!-- Footer -->
            <div
                class="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <p class="text-xs text-[#667085]">
                        Total tagihan
                    </p>

                    <p class="text-lg font-bold text-[#003366]">
                        {{ formatCurrency(grandTotal) }}
                    </p>
                </div>

                <div class="flex justify-end gap-3">
                    <button
                        type="button"
                        @click="emit('close')"
                        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] hover:bg-slate-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="save"
                        :disabled="saving || loadingMaster"
                        class="inline-flex items-center gap-2 rounded-xl bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00284f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            v-if="saving"
                            :size="16"
                            class="animate-spin"
                        />

                        <Save v-else :size="16" />

                        {{ saving ? 'Menyimpan...' : 'Simpan Draft' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    computed,
    onMounted,
    reactive,
    ref,
    watch,
} from 'vue'

import {
    Plus,
    Trash2,
    X,
    Save,
    RefreshCw,
} from 'lucide-vue-next'

import {
    erpApi,
    getApiError,
} from '@/services/api'

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

const emit = defineEmits(['close', 'saved'])

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const saving = ref(false)
const loadingMaster = ref(false)

const customers = ref([])
const units = ref([])
const invoiceSeries = ref([])

const form = reactive({
    invoice_series_id: '',
    customer_id: '',
    invoice_date: '',
    due_date: '',
    notes: '',
    ppn_rate: 0,
    pph_rate: 0,
    items: [],
})

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => !!props.invoice)

const modalTitle = computed(() => {
    return isEdit.value ? 'Edit Invoice' : 'Buat Invoice'
})

// Subtotal kotor seluruh item sebelum diskon.
const subtotal = computed(() => {
    return form.items.reduce((sum, item) => {
        return sum + (
            (Number(item.quantity) || 0) *
            (Number(item.unit_price) || 0)
        )
    }, 0)
})

// Total diskon seluruh item.
const totalDiscount = computed(() => {
    return form.items.reduce((sum, item) => {
        return sum + Math.max(
            0,
            Number(item.discount_amount) || 0,
        )
    }, 0)
})

// Dasar pengenaan pajak sederhana: subtotal dikurangi diskon.
const dpp = computed(() => {
    return Math.max(0, subtotal.value - totalDiscount.value)
})

const ppnAmount = computed(() => {
    return dpp.value * normalizedRate(form.ppn_rate) / 100
})

const pphAmount = computed(() => {
    return dpp.value * normalizedRate(form.pph_rate) / 100
})

// PPh diperlakukan sebagai pemotongan dari pembayaran customer.
const grandTotal = computed(() => {
    return Math.max(
        0,
        dpp.value + ppnAmount.value - pphAmount.value,
    )
})

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function today() {
    const date = new Date()
    const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
    )

    return localDate.toISOString().slice(0, 10)
}

function plusDays(dateString, days) {
    const date = new Date(`${dateString}T00:00:00`)
    date.setDate(date.getDate() + days)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function createEmptyItem() {
    return {
        key: `${Date.now()}-${Math.random()}`,
        product_id: null,
        description: '',
        quantity: 1,
        unit_id: '',
        unit_price: 0,
        discount_amount: 0,
        account_id: null,
        notes: '',
    }
}

function normalizedRate(value) {
    const rate = Number(value)

    if (!Number.isFinite(rate)) {
        return 0
    }

    return Math.min(100, Math.max(0, rate))
}

function itemSubtotal(item) {
    const quantity = Math.max(0, Number(item.quantity) || 0)
    const price = Math.max(0, Number(item.unit_price) || 0)
    const discount = Math.max(0, Number(item.discount_amount) || 0)

    return Math.max(0, quantity * price - discount)
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 2,
    }).format(Number(value) || 0)
}

/*
|--------------------------------------------------------------------------
| Master Data
|--------------------------------------------------------------------------
*/

async function loadMasterData() {
    loadingMaster.value = true

    try {
        const [
            customerResponse,
            unitResponse,
            seriesResponse,
        ] = await Promise.all([
            erpApi.master.partners.list({
                is_active: true,
            }),

            erpApi.master.units.list({
                is_active: true,
            }),

            erpApi.master.general.list({
                group: 'invoice_series',
                is_active: true,
            }),
        ])

        customers.value =
            customerResponse?.data?.data ??
            customerResponse?.data ??
            []

        units.value =
            unitResponse?.data?.data ??
            []

        invoiceSeries.value =
            seriesResponse?.data?.data ??
            seriesResponse?.data ??
            []
    } catch (error) {
        console.error('Failed to load invoice master data:', error)

        alert(
            getApiError(
                error,
                'Gagal memuat master data invoice.',
            ),
        )
    } finally {
        loadingMaster.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

function resetForm() {
    form.invoice_series_id = ''
    form.customer_id = ''
    form.invoice_date = today()
    form.due_date = plusDays(form.invoice_date, 30)
    form.notes = ''
    form.ppn_rate = 0
    form.pph_rate = 0
    form.items = [createEmptyItem()]
}

function fillForm(invoice) {
    form.invoice_series_id =
        invoice.invoice_series_id ??
        invoice.invoice_series?.id ??
        ''

    form.customer_id =
        invoice.customer_id ??
        invoice.customer?.id ??
        ''

    form.invoice_date =
        invoice.invoice_date ?? today()

    form.due_date =
        invoice.due_date ??
        plusDays(form.invoice_date, 30)

    form.notes = invoice.notes ?? ''

    form.ppn_rate = Number(invoice.ppn_rate) || 0
    form.pph_rate = Number(invoice.pph_rate) || 0

    form.items = (invoice.items ?? []).map(item => ({
        key: `${item.id ?? Date.now()}-${Math.random()}`,

        product_id: item.product_id ?? null,

        description:
            item.description ??
            item.product?.name ??
            '',

        quantity: Number(item.quantity) || 1,

        unit_id:
            item.unit_id ??
            item.unit?.id ??
            '',

        unit_price: Number(item.unit_price) || 0,

        discount_amount:
            Number(item.discount_amount) || 0,

        account_id: item.account_id ?? null,

        notes: item.notes ?? '',
    }))

    if (!form.items.length) {
        form.items = [createEmptyItem()]
    }
}

function addItem() {
    form.items.push(createEmptyItem())
}

function removeItem(index) {
    if (form.items.length > 1) {
        form.items.splice(index, 1)
    }
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validateForm() {
    if (!form.invoice_series_id) {
        alert('Seri Invoice wajib dipilih.')
        return false
    }

    if (!form.customer_id) {
        alert('Customer wajib dipilih.')
        return false
    }

    if (!form.invoice_date) {
        alert('Tanggal invoice wajib diisi.')
        return false
    }

    if (
        form.due_date &&
        form.due_date < form.invoice_date
    ) {
        alert('Jatuh tempo tidak boleh sebelum tanggal invoice.')
        return false
    }

    if (!form.items.length) {
        alert('Minimal satu item invoice.')
        return false
    }

    for (let i = 0; i < form.items.length; i++) {
        const item = form.items[i]
        const quantity = Number(item.quantity)
        const price = Number(item.unit_price)
        const discount = Number(item.discount_amount)

        if (!String(item.description ?? '').trim()) {
            alert(`Deskripsi item ke-${i + 1} wajib diisi.`)
            return false
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
            alert(`Qty item ke-${i + 1} harus lebih dari 0.`)
            return false
        }

        if (!Number.isFinite(price) || price < 0) {
            alert(`Harga item ke-${i + 1} tidak valid.`)
            return false
        }

        if (!Number.isFinite(discount) || discount < 0) {
            alert(`Diskon item ke-${i + 1} tidak valid.`)
            return false
        }

        if (discount > quantity * price) {
            alert(`Diskon item ke-${i + 1} melebihi subtotal item.`)
            return false
        }
    }

    for (const [label, value] of [
        ['PPN', form.ppn_rate],
        ['PPh', form.pph_rate],
    ]) {
        const rate = Number(value)

        if (
            !Number.isFinite(rate) ||
            rate < 0 ||
            rate > 100
        ) {
            alert(`Tarif ${label} harus antara 0 sampai 100%.`)
            return false
        }
    }

    return true
}

/*
|--------------------------------------------------------------------------
| Save
|--------------------------------------------------------------------------
*/

async function save() {
    if (!validateForm()) {
        return
    }

    saving.value = true

    try {
        const payload = {
            invoice_series_id: Number(form.invoice_series_id),
            customer_id: Number(form.customer_id),

            invoice_date: form.invoice_date,
            due_date: form.due_date || null,
            notes: form.notes || null,

            // Pajak berada di tingkat invoice.
            ppn_rate: normalizedRate(form.ppn_rate),
            pph_rate: normalizedRate(form.pph_rate),
            ppn_amount: Number(ppnAmount.value.toFixed(2)),
            pph_amount: Number(pphAmount.value.toFixed(2)),

            subtotal: Number(subtotal.value.toFixed(2)),
            discount_amount: Number(totalDiscount.value.toFixed(2)),
            dpp: Number(dpp.value.toFixed(2)),
            grand_total: Number(grandTotal.value.toFixed(2)),

            items: form.items.map(item => ({
                product_id: item.product_id || null,

                description: String(item.description).trim(),

                quantity: Number(item.quantity),

                unit_id: item.unit_id
                    ? Number(item.unit_id)
                    : null,

                unit_price: Number(item.unit_price),

                discount_amount: Number(item.discount_amount) || 0,

                // Pajak tidak lagi dikirim per item.
                account_id: item.account_id || null,
                notes: item.notes || null,
            })),
        }

        if (isEdit.value) {
            await erpApi.sales.invoices.update(
                props.invoice.id,
                payload,
            )
        } else {
            await erpApi.sales.invoices.store(payload)
        }

        emit('saved')
    } catch (error) {
        alert(getApiError(error, 'Gagal menyimpan invoice.'))
    } finally {
        saving.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

watch(
    () => [props.show, props.invoice],
    async ([visible, invoice]) => {
        if (!visible) {
            return
        }

        if (
            !customers.value.length ||
            !units.value.length ||
            !invoiceSeries.value.length
        ) {
            await loadMasterData()
        }

        if (invoice) {
            fillForm(invoice)
        } else {
            resetForm()
        }
    },
    { immediate: true },
)

onMounted(() => {
    if (
        !customers.value.length ||
        !units.value.length ||
        !invoiceSeries.value.length
    ) {
        loadMasterData()
    }
})
</script>

<style scoped>
.form-input {
    width: 100%;
    min-width: 0;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    background-color: white;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    outline: none;
}

.form-input:focus {
    border-color: #14a2d8;
    box-shadow: 0 0 0 2px rgb(20 162 216 / 10%);
}

.form-input:disabled {
    cursor: not-allowed;
    background-color: #f8fafc;
}

.form-readonly {
    display: flex;
    height: 42px;
    align-items: center;
    border: 1px dashed #cbd5e1;
    border-radius: 0.75rem;
    background-color: #f8fafc;
    padding: 0 1rem;
    font-size: 0.875rem;
    color: #667085;
}
</style>
