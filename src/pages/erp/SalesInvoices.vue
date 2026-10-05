<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#172033]">
          Invoice Penjualan
        </h1>
        <p class="mt-1 text-sm text-[#667085]">
          Kelola invoice penjualan dan tagihan customer.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00284f]"
      >
        <span class="text-lg leading-none">+</span>
        Buat Invoice
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-[#667085]">
              {{ stat.label }}
            </p>

            <p class="mt-2 text-2xl font-bold text-[#172033]">
              {{ stat.value }}
            </p>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl"
            :class="stat.iconClass"
          >
            <span class="text-lg">{{ stat.icon }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <!-- Toolbar -->
      <div class="border-b border-slate-200 p-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full lg:max-w-md">
            <input
              v-model="search"
              type="text"
              placeholder="Cari invoice atau customer..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm outline-none transition focus:border-[#14a2d8] focus:bg-white focus:ring-2 focus:ring-[#14a2d8]/10"
            />

            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔎
            </span>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <select
              v-model="statusFilter"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#172033] outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="issued">Terbit</option>
              <option value="partial">Sebagian Dibayar</option>
              <option value="paid">Lunas</option>
              <option value="cancelled">Dibatalkan</option>
            </select>

            <input
              v-model="dateFilter"
              type="month"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#172033] outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
            />
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50">
              <th class="px-5 py-3 text-left font-semibold text-[#667085]">
                No. Invoice
              </th>

              <th class="px-5 py-3 text-left font-semibold text-[#667085]">
                Customer
              </th>

              <th class="px-5 py-3 text-left font-semibold text-[#667085]">
                Tanggal
              </th>

              <th class="px-5 py-3 text-left font-semibold text-[#667085]">
                Jatuh Tempo
              </th>

              <th class="px-5 py-3 text-right font-semibold text-[#667085]">
                Total
              </th>

              <th class="px-5 py-3 text-center font-semibold text-[#667085]">
                Status
              </th>

              <th class="px-5 py-3 text-center font-semibold text-[#667085]">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="invoice in filteredInvoices"
              :key="invoice.id"
              class="transition hover:bg-slate-50"
            >
              <td class="whitespace-nowrap px-5 py-4">
                <button
                  @click="openDetail(invoice)"
                  class="font-semibold text-[#003366] hover:text-[#14a2d8]"
                >
                  {{ invoice.number }}
                </button>
              </td>

              <td class="px-5 py-4">
                <div>
                  <p class="font-medium text-[#172033]">
                    {{ invoice.customer }}
                  </p>

                  <p class="mt-0.5 text-xs text-[#667085]">
                    {{ invoice.customerCode }}
                  </p>
                </div>
              </td>

              <td class="whitespace-nowrap px-5 py-4 text-[#667085]">
                {{ formatDate(invoice.date) }}
              </td>

              <td class="whitespace-nowrap px-5 py-4 text-[#667085]">
                {{ formatDate(invoice.dueDate) }}
              </td>

              <td class="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#172033]">
                {{ formatCurrency(invoice.total) }}
              </td>

              <td class="px-5 py-4 text-center">
                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClass(invoice.status)"
                >
                  {{ statusLabel(invoice.status) }}
                </span>
              </td>

              <td class="px-5 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openDetail(invoice)"
                    class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-[#667085] transition hover:border-[#14a2d8] hover:text-[#14a2d8]"
                  >
                    Detail
                  </button>

                  <button
                    @click="printInvoice(invoice)"
                    class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-[#667085] transition hover:border-[#003366] hover:text-[#003366]"
                  >
                    Cetak
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredInvoices.length === 0">
              <td
                colspan="7"
                class="px-5 py-12 text-center"
              >
                <div class="text-3xl">📄</div>

                <p class="mt-3 font-medium text-[#172033]">
                  Invoice tidak ditemukan
                </p>

                <p class="mt-1 text-sm text-[#667085]">
                  Coba ubah pencarian atau filter.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-[#667085]">
          Menampilkan
          <span class="font-semibold text-[#172033]">
            {{ filteredInvoices.length }}
          </span>
          invoice
        </p>

        <div class="text-sm text-[#667085]">
          Total:
          <span class="font-bold text-[#172033]">
            {{ formatCurrency(filteredTotal) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="closeCreateModal"
    >
      <div class="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 class="text-lg font-bold text-[#172033]">
              Buat Invoice Penjualan
            </h2>

            <p class="mt-1 text-sm text-[#667085]">
              Masukkan informasi invoice dan item penjualan.
            </p>
          </div>

          <button
            @click="closeCreateModal"
            class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="max-h-[calc(90vh-150px)] overflow-y-auto p-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                No. Invoice
              </label>

              <input
                v-model="form.number"
                type="text"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
              />
            </div>

            <div class="lg:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                Customer
              </label>

              <select
                v-model="form.customer"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
              >
                <option value="">
                  Pilih Customer
                </option>

                <option
                  v-for="customer in customers"
                  :key="customer.code"
                  :value="customer.name"
                >
                  {{ customer.code }} - {{ customer.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                Tanggal
              </label>

              <input
                v-model="form.date"
                type="date"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-[#172033]">
                Jatuh Tempo
              </label>

              <input
                v-model="form.dueDate"
                type="date"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
              />
            </div>
          </div>

          <!-- Items -->
          <div class="mt-6">
            <div class="mb-3 flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-[#172033]">
                  Item Invoice
                </h3>

                <p class="mt-1 text-xs text-[#667085]">
                  COA dapat ditentukan untuk setiap item.
                </p>
              </div>

              <button
                @click="addItem"
                class="rounded-lg border border-[#14a2d8] px-3 py-2 text-xs font-semibold text-[#14a2d8] transition hover:bg-[#14a2d8]/5"
              >
                + Tambah Item
              </button>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="min-w-[950px] w-full text-sm">
                <thead>
                  <tr class="bg-slate-50">
                    <th class="px-3 py-3 text-left font-semibold text-[#667085]">
                      Produk / Jasa
                    </th>

                    <th class="w-24 px-3 py-3 text-right font-semibold text-[#667085]">
                      Qty
                    </th>

                    <th class="w-28 px-3 py-3 text-left font-semibold text-[#667085]">
                      Satuan
                    </th>

                    <th class="w-36 px-3 py-3 text-right font-semibold text-[#667085]">
                      Harga
                    </th>

                    <th class="w-24 px-3 py-3 text-right font-semibold text-[#667085]">
                      Diskon
                    </th>

                    <th class="w-44 px-3 py-3 text-left font-semibold text-[#667085]">
                      COA
                    </th>

                    <th class="w-12 px-3 py-3"></th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="(item, index) in form.items"
                    :key="item.id"
                  >
                    <td class="p-2">
                      <select
                        v-model="item.product"
                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#14a2d8]"
                      >
                        <option value="">
                          Pilih Produk / Jasa
                        </option>

                        <option
                          v-for="product in products"
                          :key="product.code"
                          :value="product.name"
                        >
                          {{ product.name }}
                        </option>
                      </select>
                    </td>

                    <td class="p-2">
                      <input
                        v-model.number="item.qty"
                        type="number"
                        min="0"
                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-[#14a2d8]"
                      />
                    </td>

                    <td class="p-2">
                      <select
                        v-model="item.unit"
                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#14a2d8]"
                      >
                        <option value="PCS">PCS</option>
                        <option value="SET">SET</option>
                        <option value="KG">KG</option>
                        <option value="LTR">LTR</option>
                        <option value="UNIT">UNIT</option>
                      </select>
                    </td>

                    <td class="p-2">
                      <input
                        v-model.number="item.price"
                        type="number"
                        min="0"
                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-[#14a2d8]"
                      />
                    </td>

                    <td class="p-2">
                      <input
                        v-model.number="item.discount"
                        type="number"
                        min="0"
                        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-[#14a2d8]"
                      />
                    </td>

                    <td class="p-2">
                      <select
                        v-model="item.coa"
                        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#14a2d8]"
                      >
                        <option value="">
                          Pilih COA
                        </option>

                        <option
                          v-for="coa in coas"
                          :key="coa.code"
                          :value="coa.code"
                        >
                          {{ coa.code }} - {{ coa.name }}
                        </option>
                      </select>
                    </td>

                    <td class="p-2 text-center">
                      <button
                        @click="removeItem(index)"
                        :disabled="form.items.length === 1"
                        class="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Summary -->
          <div class="mt-6 flex justify-end">
            <div class="w-full max-w-sm space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-[#667085]">Subtotal</span>
                <span class="font-medium text-[#172033]">
                  {{ formatCurrency(subtotal) }}
                </span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-[#667085]">Diskon</span>
                <span class="font-medium text-[#172033]">
                  {{ formatCurrency(totalDiscount) }}
                </span>
              </div>

              <div class="border-t border-slate-200 pt-3">
                <div class="flex justify-between">
                  <span class="font-semibold text-[#172033]">
                    Total
                  </span>

                  <span class="text-lg font-bold text-[#003366]">
                    {{ formatCurrency(grandTotal) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-6">
            <label class="mb-1.5 block text-sm font-medium text-[#172033]">
              Catatan
            </label>

            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Catatan invoice..."
              class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
            ></textarea>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            @click="closeCreateModal"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            @click="saveInvoice('draft')"
            class="rounded-xl border border-[#003366] px-4 py-2.5 text-sm font-semibold text-[#003366] hover:bg-[#003366]/5"
          >
            Simpan Draft
          </button>

          <button
            @click="saveInvoice('issued')"
            class="rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00284f]"
          >
            Terbitkan Invoice
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="closeDetail"
    >
      <div class="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 class="text-lg font-bold text-[#172033]">
              Detail Invoice
            </h2>

            <p class="mt-1 text-sm text-[#667085]">
              {{ selectedInvoice?.number }}
            </p>
          </div>

          <button
            @click="closeDetail"
            class="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div
          v-if="selectedInvoice"
          class="max-h-[calc(90vh-80px)] overflow-y-auto p-6"
        >
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs text-[#667085]">Customer</p>
              <p class="mt-1 font-semibold text-[#172033]">
                {{ selectedInvoice.customer }}
              </p>
            </div>

            <div>
              <p class="text-xs text-[#667085]">Status</p>

              <span
                class="mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusClass(selectedInvoice.status)"
              >
                {{ statusLabel(selectedInvoice.status) }}
              </span>
            </div>

            <div>
              <p class="text-xs text-[#667085]">Tanggal Invoice</p>
              <p class="mt-1 font-medium text-[#172033]">
                {{ formatDate(selectedInvoice.date) }}
              </p>
            </div>

            <div>
              <p class="text-xs text-[#667085]">Jatuh Tempo</p>
              <p class="mt-1 font-medium text-[#172033]">
                {{ formatDate(selectedInvoice.dueDate) }}
              </p>
            </div>
          </div>

          <div class="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <table class="min-w-full text-sm">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold text-[#667085]">
                    Item
                  </th>

                  <th class="px-4 py-3 text-right font-semibold text-[#667085]">
                    Qty
                  </th>

                  <th class="px-4 py-3 text-right font-semibold text-[#667085]">
                    Harga
                  </th>

                  <th class="px-4 py-3 text-right font-semibold text-[#667085]">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="item in selectedInvoice.items"
                  :key="item.id"
                >
                  <td class="px-4 py-3">
                    {{ item.product }}
                  </td>

                  <td class="px-4 py-3 text-right">
                    {{ item.qty }} {{ item.unit }}
                  </td>

                  <td class="px-4 py-3 text-right">
                    {{ formatCurrency(item.price) }}
                  </td>

                  <td class="px-4 py-3 text-right font-medium">
                    {{ formatCurrency(item.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-5 flex justify-end">
            <div class="w-full max-w-xs">
              <div class="flex justify-between border-t border-slate-200 pt-3">
                <span class="font-semibold text-[#172033]">
                  Total
                </span>

                <span class="text-lg font-bold text-[#003366]">
                  {{ formatCurrency(selectedInvoice.total) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const search = ref('')
const statusFilter = ref('all')
const dateFilter = ref('')

const showCreateModal = ref(false)
const showDetailModal = ref(false)

const selectedInvoice = ref(null)

const customers = [
  {
    code: 'CUS-001',
    name: 'PT Maju Jaya',
  },
  {
    code: 'CUS-002',
    name: 'PT Sinar Abadi',
  },
  {
    code: 'CUS-003',
    name: 'CV Berkah Teknik',
  },
]

const products = [
  {
    code: 'PRD-001',
    name: 'Produk A',
  },
  {
    code: 'PRD-002',
    name: 'Produk B',
  },
  {
    code: 'PRD-003',
    name: 'Jasa Maintenance',
  },
]

const coas = [
  {
    code: '4-1001',
    name: 'Penjualan Barang',
  },
  {
    code: '4-1002',
    name: 'Pendapatan Jasa',
  },
]

const invoices = ref([
  {
    id: 1,
    number: 'INV-2026-0001',
    customer: 'PT Maju Jaya',
    customerCode: 'CUS-001',
    date: '2026-10-01',
    dueDate: '2026-10-31',
    status: 'paid',
    total: 12500000,
    items: [
      {
        id: 1,
        product: 'Produk A',
        qty: 10,
        unit: 'PCS',
        price: 1250000,
        total: 12500000,
      },
    ],
  },
  {
    id: 2,
    number: 'INV-2026-0002',
    customer: 'PT Sinar Abadi',
    customerCode: 'CUS-002',
    date: '2026-10-02',
    dueDate: '2026-11-01',
    status: 'issued',
    total: 8750000,
    items: [
      {
        id: 2,
        product: 'Produk B',
        qty: 10,
        unit: 'PCS',
        price: 875000,
        total: 8750000,
      },
    ],
  },
  {
    id: 3,
    number: 'INV-2026-0003',
    customer: 'CV Berkah Teknik',
    customerCode: 'CUS-003',
    date: '2026-10-03',
    dueDate: '2026-11-02',
    status: 'partial',
    total: 5200000,
    items: [
      {
        id: 3,
        product: 'Jasa Maintenance',
        qty: 1,
        unit: 'UNIT',
        price: 5200000,
        total: 5200000,
      },
    ],
  },
  {
    id: 4,
    number: 'INV-2026-0004',
    customer: 'PT Maju Jaya',
    customerCode: 'CUS-001',
    date: '2026-10-04',
    dueDate: '2026-11-03',
    status: 'draft',
    total: 3400000,
    items: [
      {
        id: 4,
        product: 'Produk A',
        qty: 4,
        unit: 'PCS',
        price: 850000,
        total: 3400000,
      },
    ],
  },
])

const form = reactive({
  number: '',
  customer: '',
  date: '',
  dueDate: '',
  notes: '',
  items: [],
})

const stats = computed(() => {
  const data = invoices.value

  return [
    {
      label: 'Total Invoice',
      value: data.length,
      icon: '📄',
      iconClass: 'bg-blue-50',
    },
    {
      label: 'Belum Lunas',
      value: data.filter(
        item => ['issued', 'partial'].includes(item.status),
      ).length,
      icon: '⏳',
      iconClass: 'bg-amber-50',
    },
    {
      label: 'Lunas',
      value: data.filter(
        item => item.status === 'paid',
      ).length,
      icon: '✓',
      iconClass: 'bg-emerald-50',
    },
    {
      label: 'Total Nilai',
      value: formatCurrency(
        data.reduce((sum, item) => sum + item.total, 0),
      ),
      icon: 'Rp',
      iconClass: 'bg-slate-100',
    },
  ]
})

const filteredInvoices = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return invoices.value.filter(invoice => {
    const matchesSearch =
      !keyword ||
      invoice.number.toLowerCase().includes(keyword) ||
      invoice.customer.toLowerCase().includes(keyword)

    const matchesStatus =
      statusFilter.value === 'all' ||
      invoice.status === statusFilter.value

    const matchesDate =
      !dateFilter.value ||
      invoice.date.startsWith(dateFilter.value)

    return matchesSearch && matchesStatus && matchesDate
  })
})

const filteredTotal = computed(() => {
  return filteredInvoices.value.reduce(
    (sum, invoice) => sum + invoice.total,
    0,
  )
})

const subtotal = computed(() => {
  return form.items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0,
  )
})

const totalDiscount = computed(() => {
  return form.items.reduce((sum, item) => {
    const itemSubtotal =
      (Number(item.qty) || 0) * (Number(item.price) || 0)

    const discount =
      itemSubtotal * ((Number(item.discount) || 0) / 100)

    return sum + discount
  }, 0)
})

const grandTotal = computed(() => {
  return subtotal.value - totalDiscount.value
})

function createEmptyItem() {
  return {
    id: Date.now() + Math.random(),
    product: '',
    qty: 1,
    unit: 'PCS',
    price: 0,
    discount: 0,
    coa: '',
  }
}

function openCreateModal() {
  const today = new Date()
  const date = today.toISOString().slice(0, 10)

  const due = new Date(today)
  due.setDate(due.getDate() + 30)

  form.number = `INV-2026-${String(invoices.value.length + 1).padStart(4, '0')}`
  form.customer = ''
  form.date = date
  form.dueDate = due.toISOString().slice(0, 10)
  form.notes = ''
  form.items = [createEmptyItem()]

  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function addItem() {
  form.items.push(createEmptyItem())
}

function removeItem(index) {
  if (form.items.length === 1) return

  form.items.splice(index, 1)
}

function saveInvoice(status) {
  if (!form.customer) {
    alert('Customer wajib dipilih.')
    return
  }

  if (!form.items.length) {
    alert('Minimal ada satu item invoice.')
    return
  }

  const customer = customers.find(
    item => item.name === form.customer,
  )

  const items = form.items.map(item => ({
    id: Date.now() + Math.random(),
    product: item.product || 'Item belum dipilih',
    qty: Number(item.qty) || 0,
    unit: item.unit,
    price: Number(item.price) || 0,
    total:
      (Number(item.qty) || 0) *
      (Number(item.price) || 0) *
      (1 - (Number(item.discount) || 0) / 100),
  }))

  const invoice = {
    id: Date.now(),
    number: form.number,
    customer: form.customer,
    customerCode: customer?.code || '-',
    date: form.date,
    dueDate: form.dueDate,
    status,
    total: grandTotal.value,
    items,
  }

  invoices.value.unshift(invoice)

  closeCreateModal()

  alert(
    status === 'draft'
      ? 'Invoice berhasil disimpan sebagai draft.'
      : 'Invoice berhasil diterbitkan.',
  )
}

function openDetail(invoice) {
  selectedInvoice.value = invoice
  showDetailModal.value = true
}

function closeDetail() {
  showDetailModal.value = false
  selectedInvoice.value = null
}

function printInvoice(invoice) {
  console.log('Print invoice:', invoice)

  alert(`Print ${invoice.number}`)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function formatDate(value) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function statusLabel(status) {
  const labels = {
    draft: 'Draft',
    issued: 'Terbit',
    partial: 'Sebagian Dibayar',
    paid: 'Lunas',
    cancelled: 'Dibatalkan',
  }

  return labels[status] || status
}

function statusClass(status) {
  const classes = {
    draft: 'bg-slate-100 text-slate-600',
    issued: 'bg-blue-50 text-blue-700',
    partial: 'bg-amber-50 text-amber-700',
    paid: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
  }

  return classes[status] || 'bg-slate-100 text-slate-600'
}
</script>