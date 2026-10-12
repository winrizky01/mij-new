
<template>
    <div class="space-y-6 p-6">
        <!-- HEADER -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">
                    Sales Quotation
                </h1>
                <p class="mt-1 text-sm text-slate-500">
                    Kelola penawaran harga customer dan konversi ke Sales Order.
                </p>
            </div>

            <button
                type="button"
                @click="openCreate"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
                <Plus class="h-4 w-4" />
                Buat Quotation
            </button>
        </div>

        <!-- ERROR -->
        <div
            v-if="errorMessage"
            class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
            {{ errorMessage }}
        </div>

        <!-- FILTER -->
        <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row">
            <div class="relative flex-1">
                <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    v-model="filters.search"
                    @keyup.enter="loadQuotations"
                    placeholder="Cari nomor quotation atau customer..."
                    class="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <select
                v-model="filters.status"
                @change="loadQuotations"
                class="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
                <option value="">Semua status</option>
                <option value="draft">Draft</option>
                <option value="sent">Terkirim</option>
                <option value="accepted">Disetujui</option>
                <option value="rejected">Ditolak</option>
                <option value="expired">Kedaluwarsa</option>
                <option value="converted">Menjadi SO</option>
            </select>

            <button
                type="button"
                @click="loadQuotations"
                class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
                Cari
            </button>
        </div>

        <!-- TABLE -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-left">
                    <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th class="px-5 py-4">Nomor</th>
                            <th class="px-5 py-4">Customer</th>
                            <th class="px-5 py-4">Tanggal</th>
                            <th class="px-5 py-4">Berlaku Sampai</th>
                            <th class="px-5 py-4 text-right">Total</th>
                            <th class="px-5 py-4">Status</th>
                            <th class="px-5 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                        <tr v-if="loading">
                            <td colspan="7" class="px-5 py-12 text-center text-sm text-slate-500">
                                Memuat quotation...
                            </td>
                        </tr>

                        <tr
                            v-else-if="quotations.length === 0"
                        >
                            <td colspan="7" class="px-5 py-12 text-center text-sm text-slate-500">
                                Belum ada Sales Quotation.
                            </td>
                        </tr>

                        <tr
                            v-for="quotation in quotations"
                            :key="quotation.id"
                            class="hover:bg-slate-50/70"
                        >
                            <td class="px-5 py-4">
                                <p class="font-semibold text-slate-800">
                                    {{ quotation.quotation_number }}
                                </p>
                                <p class="mt-1 text-xs text-slate-500">
                                    {{ quotation.items_count || quotation.items?.length || 0 }} baris
                                </p>
                            </td>

                            <td class="px-5 py-4 text-sm text-slate-700">
                                {{ quotation.customer?.name || '-' }}
                            </td>

                            <td class="px-5 py-4 text-sm text-slate-600">
                                {{ formatDate(quotation.quotation_date) }}
                            </td>

                            <td class="px-5 py-4 text-sm text-slate-600">
                                {{ formatDate(quotation.valid_until) }}
                            </td>

                            <td class="px-5 py-4 text-right text-sm font-semibold text-slate-800">
                                {{ currency(quotation.grand_total) }}
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="statusClass(quotation.status)"
                                >
                                    {{ statusLabel(quotation.status) }}
                                </span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        title="Lihat detail"
                                        @click="openEdit(quotation.id, true)"
                                        class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                                    >
                                        <Eye class="h-4 w-4" />
                                    </button>

                                    <button
                                        v-if="quotation.status !== 'converted'"
                                        type="button"
                                        title="Edit quotation"
                                        @click="openEdit(quotation.id, false)"
                                        class="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"
                                    >
                                        <Pencil class="h-4 w-4" />
                                    </button>

                                    <button
                                        v-if="quotation.status === 'accepted'"
                                        type="button"
                                        title="Konversi ke Sales Order"
                                        @click="convertQuotation(quotation)"
                                        class="rounded-lg bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100"
                                    >
                                        <ArrowRightLeft class="h-4 w-4" />
                                    </button>

                                    <button
                                        v-if="quotation.status !== 'converted'"
                                        type="button"
                                        title="Hapus quotation"
                                        @click="deleteQuotation(quotation)"
                                        class="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- PAGINATION -->
            <div class="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                <p class="text-xs text-slate-500">
                    Total {{ pagination.total }} quotation
                </p>

                <div class="flex gap-2">
                    <button
                        type="button"
                        :disabled="pagination.currentPage <= 1 || loading"
                        @click="changePage(pagination.currentPage - 1)"
                        class="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                    >
                        Sebelumnya
                    </button>

                    <span class="self-center text-sm text-slate-600">
                        {{ pagination.currentPage }} / {{ pagination.lastPage }}
                    </span>

                    <button
                        type="button"
                        :disabled="pagination.currentPage >= pagination.lastPage || loading"
                        @click="changePage(pagination.currentPage + 1)"
                        class="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>
        </div>

        <!-- FORM MODAL -->
        <div
            v-if="showForm"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6"
            @click.self="closeForm"
        >
            <div class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div class="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-slate-800">
                            {{ editingId ? 'Detail Sales Quotation' : 'Buat Sales Quotation' }}
                        </h2>
                        <p class="mt-1 text-xs text-slate-500">
                            Barang dan jasa dapat digabung dalam satu penawaran.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="closeForm"
                        class="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100"
                    >
                        ×
                    </button>
                </div>

                <div class="flex-1 space-y-6 overflow-y-auto p-6">
                    <div
                        v-if="formError"
                        class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {{ formError }}
                    </div>

                    <!-- HEADER FIELDS -->
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <label class="block text-sm">
                            <span class="mb-1.5 block font-medium text-slate-700">Customer *</span>
                            <select
                                v-model.number="form.customer_id"
                                :disabled="readOnly"
                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-slate-50"
                            >
                                <option :value="null">Pilih customer</option>
                                <option
                                    v-for="customer in customers"
                                    :key="customer.id"
                                    :value="customer.id"
                                >
                                    {{ customer.name }}
                                </option>
                            </select>
                        </label>

                        <label class="block text-sm">
                            <span class="mb-1.5 block font-medium text-slate-700">Tanggal quotation *</span>
                            <input
                                v-model="form.quotation_date"
                                type="date"
                                :disabled="readOnly"
                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-slate-50"
                            />
                        </label>

                        <label class="block text-sm">
                            <span class="mb-1.5 block font-medium text-slate-700">Berlaku sampai</span>
                            <input
                                v-model="form.valid_until"
                                type="date"
                                :disabled="readOnly"
                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-slate-50"
                            />
                        </label>

                        <label class="block text-sm">
                            <span class="mb-1.5 block font-medium text-slate-700">Referensi customer</span>
                            <input
                                v-model="form.reference_number"
                                :disabled="readOnly"
                                placeholder="Nomor RFQ / referensi"
                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-slate-50"
                            />
                        </label>

                        <label class="block text-sm">
                            <span class="mb-1.5 block font-medium text-slate-700">Status</span>
                            <select
                                v-model="form.status"
                                :disabled="readOnly || form.status === 'converted'"
                                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-slate-50"
                            >
                                <option value="draft">Draft</option>
                                <option value="sent">Terkirim</option>
                                <option value="accepted">Disetujui</option>
                                <option value="rejected">Ditolak</option>
                                <option value="expired">Kedaluwarsa</option>
                            </select>
                        </label>
                    </div>

                    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <!-- Header -->
                        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                            <div>
                                <h3 class="text-sm font-semibold text-slate-800">
                                    Detail penawaran
                                </h3>
                                <p class="mt-0.5 text-xs text-slate-500">
                                    Daftar barang dan jasa yang ditawarkan.
                                </p>
                            </div>

                            <button
                                v-if="!readOnly"
                                type="button"
                                @click="addItem"
                                class="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                            >
                                <Plus class="h-4 w-4" />
                                Tambah item
                            </button>
                        </div>

                        <!-- Items -->
                        <div class="divide-y divide-slate-200">
                            <div
                                v-for="(item, index) in form.items"
                                :key="item._key"
                                class="px-4 py-4"
                            >
                                <!-- Item heading -->
                                <div class="mb-4 flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <span
                                            class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600"
                                        >
                                            {{ String(index + 1).padStart(2, '0') }}
                                        </span>

                                        <div>
                                            <p class="text-sm font-semibold text-slate-800">
                                                {{ item.item_name || `Item ${index + 1}` }}
                                            </p>
                                            <p class="mt-0.5 text-xs text-slate-500">
                                                {{ item.item_type === 'service' ? 'Jasa' : 'Barang' }}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        v-if="!readOnly && form.items.length > 1"
                                        type="button"
                                        @click="removeItem(index)"
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                        title="Hapus item"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </button>
                                </div>

                                <!-- Main fields -->
                                <div class="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-12">
                                    <label class="text-sm md:col-span-2">
                                        <span class="mb-1.5 block text-xs font-medium text-slate-600">
                                            Jenis
                                        </span>
                                        <select
                                            v-model="item.item_type"
                                            :disabled="readOnly"
                                            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                        >
                                            <option value="product">Barang</option>
                                            <option value="service">Jasa</option>
                                        </select>
                                    </label>

                                    <label class="text-sm md:col-span-6">
                                        <span class="mb-1.5 block text-xs font-medium text-slate-600">
                                            Nama barang / jasa <span class="text-red-500">*</span>
                                        </span>
                                        <input
                                            v-model="item.item_name"
                                            :disabled="readOnly"
                                            placeholder="Masukkan nama item"
                                            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                        />
                                    </label>

                                    <label class="text-sm md:col-span-4">
                                        <span class="mb-1.5 block text-xs font-medium text-slate-600">
                                            Satuan
                                        </span>
                                        <input
                                            v-model="item.unit"
                                            :disabled="readOnly"
                                            placeholder="PCS / KG / JAM"
                                            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                        />
                                    </label>

                                    <label class="text-sm md:col-span-3">
                                        <span class="mb-1.5 block text-xs font-medium text-slate-600">
                                            Kuantitas <span class="text-red-500">*</span>
                                        </span>
                                        <input
                                            v-model.number="item.quantity"
                                            :disabled="readOnly"
                                            type="number"
                                            min="1"
                                            step="1"
                                            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                        />
                                    </label>

                                    <label class="text-sm md:col-span-5">
                                        <span class="mb-1.5 block text-xs font-medium text-slate-600">
                                            Harga satuan <span class="text-red-500">*</span>
                                        </span>
                                        <div class="flex overflow-hidden rounded-lg border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                                            <span class="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-500">
                                                Rp
                                            </span>
                                            <input
                                                v-model.number="item.unit_price"
                                                :disabled="readOnly"
                                                type="number"
                                                min="0"
                                                class="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none disabled:bg-slate-50"
                                            />
                                        </div>
                                    </label>

                                    <div class="flex items-end md:col-span-4">
                                        <div class="w-full rounded-lg bg-slate-50 px-3 py-2.5">
                                            <p class="text-xs text-slate-500">Subtotal item</p>
                                            <p class="mt-0.5 text-base font-semibold tabular-nums text-slate-800">
                                                {{ currency(lineSubtotal(item)) }}
                                            </p>
                                        </div>
                                    </div>

                                    <label class="text-sm md:col-span-12">
                                        <span class="mb-1.5 block text-xs font-medium text-slate-600">
                                            Deskripsi <span class="font-normal text-slate-400">(opsional)</span>
                                        </span>
                                        <textarea
                                            v-model="item.description"
                                            :disabled="readOnly"
                                            rows="2"
                                            placeholder="Spesifikasi barang atau ruang lingkup jasa"
                                            class="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                                        ></textarea>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                            <span class="text-xs text-slate-500">
                                {{ form.items.length }} item penawaran
                            </span>
                            <span class="text-sm font-semibold text-slate-700">
                                Subtotal item:
                                <span class="ml-1 tabular-nums text-slate-900">
                                    {{ currency(subtotal) }}
                                </span>
                            </span>
                        </div>
                    </div>

                    <!-- NOTES -->
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label class="text-sm">
                            <span class="mb-1.5 block font-medium text-slate-700">Catatan</span>
                            <textarea
                                v-model="form.notes"
                                :disabled="readOnly"
                                rows="3"
                                class="w-full rounded-xl border px-3 py-2.5 disabled:bg-slate-50"
                            ></textarea>
                        </label>

                        <label class="text-sm">
                            <span class="mb-1.5 block font-medium text-slate-700">Syarat dan ketentuan</span>
                            <textarea
                                v-model="form.terms"
                                :disabled="readOnly"
                                rows="3"
                                class="w-full rounded-xl border px-3 py-2.5 disabled:bg-slate-50"
                            ></textarea>
                        </label>
                    </div>

                    <!-- TOTALS -->
                    <div class="flex justify-end">
                        <div class="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div class="mt-3 flex justify-between border-t pt-3 text-sm">
                                <span class="text-slate-500">Subtotal item</span>
                                <span class="font-bold text-slate-800">
                                </span>
                            </div>

                            <div class="grid grid-cols-2 gap-3 border-t border-slate-200 py-3">
                                <label class="text-sm">
                                    <span class="mb-1.5 block font-medium text-slate-700">PPN (%)</span>
                                    <input
                                        v-model.number="form.ppn_percent"
                                        :disabled="readOnly"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 disabled:bg-slate-100"
                                    />
                                    <span class="mt-1 block text-xs text-slate-500">
                                        {{ currency(ppnTotal) }}
                                    </span>
                                </label>

                                <label class="text-sm">
                                    <span class="mb-1.5 block font-medium text-slate-700">PPh (%)</span>
                                    <input
                                        v-model.number="form.pph_percent"
                                        :disabled="readOnly"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 disabled:bg-slate-100"
                                    />
                                    <span class="mt-1 block text-xs text-slate-500">
                                        {{ currency(pphTotal) }}
                                    </span>
                                </label>
                            </div>

                            <div class="flex justify-between border-t border-slate-200 pt-3 text-sm text-slate-600">
                                <span>Subtotal + PPN − PPh</span>
                                <span>{{ currency(grandTotal) }}</span>
                            </div>

                            <div class="mt-2 flex items-center justify-between border-t border-slate-200 pt-3">
                                <span class="font-bold text-slate-800">Grand Total</span>
                                <span class="text-xl font-bold text-[#0052cc]">
                                    {{ currency(grandTotal) }}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="flex flex-wrap justify-end gap-3 border-t bg-white px-6 py-4">
                    <button
                        type="button"
                        @click="closeForm"
                        class="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Tutup
                    </button>

                    <button
                        v-if="!readOnly"
                        type="button"
                        :disabled="saving"
                        @click="saveQuotation"
                        class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {{ saving ? 'Menyimpan...' : 'Simpan Quotation' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    ArrowRightLeft,
} from 'lucide-vue-next'

import { erpApi, getApiError } from '@/services/api'

const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const formError = ref('')

const quotations = ref([])
const customers = ref([])
const showForm = ref(false)
const readOnly = ref(false)
const editingId = ref(null)

const filters = reactive({
    search: '',
    status: '',
    page: 1,
})

const pagination = reactive({
    currentPage: 1,
    lastPage: 1,
    total: 0,
})

function number(value) {
    const result = Number(value)
    return Number.isFinite(result) ? result : 0
}

const emptyItem = () => ({
    _key: `${Date.now()}-${Math.random()}`,
    item_type: 'product',
    item_name: '',
    description: '',
    unit: '',
    quantity: 1,
    unit_price: 0,
})

const emptyForm = () => ({
    customer_id: null,
    quotation_date: new Date().toLocaleDateString('en-CA'),
    valid_until: '',
    status: 'draft',
    reference_number: '',
    notes: '',
    terms: '',
    ppn_percent: 0,
    pph_percent: 0,
    items: [emptyItem()],
})

const form = reactive(emptyForm())

const subtotal = computed(() =>
    form.items.reduce((sum, item) => sum + lineSubtotal(item), 0)
)

const ppnTotal = computed(() =>
    subtotal.value * number(form.ppn_percent) / 100
)

const pphTotal = computed(() =>
    subtotal.value * number(form.pph_percent) / 100
)

const grandTotal = computed(() =>
    subtotal.value + ppnTotal.value - pphTotal.value
)

function lineSubtotal(item) {
    return number(item.quantity) * number(item.unit_price)
}

function currency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(number(value))
}

function formatDate(value) {
    if (!value) return '-'

    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)

    if (Number.isNaN(date.getTime())) return '-'

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

function statusLabel(status) {
    return ({
        draft: 'Draft',
        sent: 'Terkirim',
        accepted: 'Disetujui',
        rejected: 'Ditolak',
        expired: 'Kedaluwarsa',
        converted: 'Menjadi SO',
    })[status] || status || '-'
}

function statusClass(status) {
    return ({
        draft: 'bg-slate-100 text-slate-700',
        sent: 'bg-blue-100 text-blue-700',
        accepted: 'bg-emerald-100 text-emerald-700',
        rejected: 'bg-red-100 text-red-700',
        expired: 'bg-amber-100 text-amber-700',
        converted: 'bg-violet-100 text-violet-700',
    })[status] || 'bg-slate-100 text-slate-700'
}

function unwrap(response) {
    return response?.data?.data ?? response?.data ?? response
}

async function loadCustomers() {
    try {
        const response = await erpApi.master.partners.list({
            is_active: true,
        })

        const payload = response?.data

        customers.value = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
                ? payload.data
                : Array.isArray(payload?.data?.data)
                    ? payload.data.data
                    : []
    } catch (error) {
        console.error('Gagal memuat customer:', error)
    }
}

async function loadQuotations() {
    loading.value = true
    errorMessage.value = ''

    try {
        const response = await erpApi.purchases.quotations.list({
            search: filters.search || undefined,
            status: filters.status || undefined,
            page: filters.page,
            per_page: 15,
        })

        const payload = unwrap(response)
        const page = payload?.data && !Array.isArray(payload.data)
            ? payload.data
            : payload

        quotations.value = page?.data || []

        pagination.currentPage = page?.current_page || 1
        pagination.lastPage = page?.last_page || 1
        pagination.total = page?.total || 0
    } catch (error) {
        errorMessage.value =
            getApiError(error) || 'Gagal memuat Sales Quotation.'
    } finally {
        loading.value = false
    }
}

function changePage(page) {
    filters.page = page
    loadQuotations()
}

function addItem() {
    form.items.push(emptyItem())
}

function removeItem(index) {
    form.items.splice(index, 1)
}

function resetForm() {
    Object.assign(form, emptyForm())
}

function openCreate() {
    editingId.value = null
    readOnly.value = false
    formError.value = ''
    resetForm()
    showForm.value = true
}

async function openEdit(id, viewOnly = false) {
    loading.value = true
    formError.value = ''

    try {
        const response = await erpApi.purchases.quotations.show(id)
        const quotation = unwrap(response)

        editingId.value = quotation.id
        readOnly.value = viewOnly

        Object.assign(form, {
            customer_id: quotation.customer_id,
            quotation_date: String(quotation.quotation_date || '').slice(0, 10),
            valid_until: String(quotation.valid_until || '').slice(0, 10),
            status: quotation.status || 'draft',
            reference_number: quotation.reference_number || '',
            notes: quotation.notes || '',
            terms: quotation.terms || '',
            ppn_percent: number(quotation.ppn_percent),
            pph_percent: number(quotation.pph_percent),
            items: (quotation.items || []).map((item, index) => ({
                _key: `saved-${item.id ?? index}`,
                item_type: item.item_type || 'product',
                item_name: item.item_name || '',
                description: item.description || '',
                unit: item.unit || '',
                quantity: number(item.quantity),
                unit_price: number(item.unit_price),
            })),
        })

        if (!form.items.length) {
            form.items = [emptyItem()]
        }

        showForm.value = true
    } catch (error) {
        errorMessage.value =
            getApiError(error) || 'Gagal membuka detail quotation.'
    } finally {
        loading.value = false
    }
}

function validateForm() {
    if (!form.customer_id) {
        formError.value = 'Customer wajib dipilih.'
        return false
    }

    if (!form.quotation_date) {
        formError.value = 'Tanggal quotation wajib diisi.'
        return false
    }

    if (!form.items.length) {
        formError.value = 'Tambahkan minimal satu item.'
        return false
    }

    for (let i = 0; i < form.items.length; i++) {
        const item = form.items[i]

        if (!item.item_name?.trim()) {
            formError.value = `Nama item #${i + 1} wajib diisi.`
            return false
        }

        if (number(item.quantity) <= 0) {
            formError.value = `Kuantitas item #${i + 1} harus lebih dari 0.`
            return false
        }

        if (number(item.unit_price) < 0) {
            formError.value = `Harga item #${i + 1} tidak valid.`
            return false
        }
    }

    if (
        number(form.ppn_percent) < 0 ||
        number(form.ppn_percent) > 100 ||
        number(form.pph_percent) < 0 ||
        number(form.pph_percent) > 100
    ) {
        formError.value = 'Persentase PPN dan PPh harus antara 0–100%.'
        return false
    }

    return true
}

async function saveQuotation() {
    formError.value = ''

    if (!validateForm()) return

    saving.value = true

    try {
        const payload = {
            customer_id: Number(form.customer_id),
            quotation_date: form.quotation_date,
            valid_until: form.valid_until || null,
            status: form.status,
            reference_number: form.reference_number || null,
            notes: form.notes || null,
            terms: form.terms || null,
            ppn_percent: number(form.ppn_percent),
            pph_percent: number(form.pph_percent),
            items: form.items.map(item => ({
                item_type: item.item_type,
                item_name: item.item_name.trim(),
                description: item.description || null,
                unit: item.unit || null,
                quantity: number(item.quantity),
                unit_price: number(item.unit_price),
            })),
        }

        if (editingId.value) {
            await erpApi.purchases.quotations.update(
                editingId.value,
                payload
            )
        } else {
            await erpApi.purchases.quotations.create(payload)
        }

        closeForm()
        await loadQuotations()
    } catch (error) {
        formError.value =
            getApiError(error) || 'Gagal menyimpan quotation.'
    } finally {
        saving.value = false
    }
}

async function deleteQuotation(quotation) {
    if (!window.confirm(`Hapus quotation ${quotation.quotation_number}?`)) {
        return
    }

    errorMessage.value = ''

    try {
        await erpApi.purchases.quotations.delete(quotation.id)
        await loadQuotations()
    } catch (error) {
        errorMessage.value =
            getApiError(error) || 'Gagal menghapus quotation.'
    }
}

async function convertQuotation(quotation) {
    if (!window.confirm(
        `Konversi ${quotation.quotation_number} menjadi Sales Order?`
    )) {
        return
    }

    errorMessage.value = ''

    try {
        const response = await erpApi.purchases.quotations.convert(
            quotation.id
        )

        const payload = unwrap(response)
        const order = payload?.sales_order

        window.alert(
            `Berhasil dikonversi menjadi Sales Order ${order?.so_number || ''}.`
        )

        await loadQuotations()
    } catch (error) {
        errorMessage.value =
            getApiError(error) || 'Gagal mengonversi quotation.'
    }
}

function closeForm() {
    showForm.value = false
    editingId.value = null
    readOnly.value = false
}

onMounted(async () => {
    await Promise.all([
        loadCustomers(),
        loadQuotations(),
    ])
})
</script>

