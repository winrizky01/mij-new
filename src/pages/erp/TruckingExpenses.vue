<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Biaya Operasional</h1>
        <p class="mt-1 text-sm text-gray-500">
          Monitoring pendapatan dan pengeluaran operasional armada.
        </p>
      </div>

      <button @click="openForm"
        class="rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00264d]">
        + Tambah Biaya
      </button>
    </div>

    <!-- SUMMARY -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="card in summary" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-5">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">{{ card.label }}</p>
          <span class="h-2.5 w-2.5 rounded-full" :class="card.color" />
        </div>

        <p class="mt-3 text-2xl font-bold" :class="card.textColor">
          {{ card.value }}
        </p>
      </div>
    </div>

    <!-- CHART -->
    <div class="rounded-2xl border border-gray-100 bg-white p-5">
      <div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 class="font-bold text-gray-800">Grafik Arus Kas Trucking</h2>
          <p class="mt-1 text-xs text-gray-500">
            Perbandingan uang masuk dan uang keluar per bulan.
          </p>
        </div>

        <select v-model="filterYear" class="rounded-xl border border-gray-200 px-3 py-2 text-sm">
          <option v-for="year in yearOptions" :key="year" :value="String(year)">
            Tahun {{ year }}
          </option>
        </select>
      </div>

      <div class="mb-5 flex flex-wrap gap-5">
        <div class="flex items-center gap-2 text-xs text-gray-600">
          <span class="h-3 w-3 rounded-sm bg-green-500" />
          Uang Masuk
        </div>

        <div class="flex items-center gap-2 text-xs text-gray-600">
          <span class="h-3 w-3 rounded-sm bg-red-500" />
          Uang Keluar
        </div>
      </div>

      <div v-if="!chartHasData" class="py-12 text-center text-sm text-gray-400">
        Belum ada transaksi pada tahun {{ filterYear }}.
      </div>

      <div v-else class="overflow-x-auto">
        <div class="flex min-w-[650px] items-end gap-3">
          <div v-for="month in monthlyChart" :key="month.value" class="flex min-w-0 flex-1 flex-col items-center">
            <div class="mb-2 flex h-48 w-full items-end justify-center gap-1 border-b border-gray-100">
              <div class="w-3/12 max-w-5 rounded-t-sm bg-green-500 transition-all"
                :style="{ height: `${month.incomeHeight}%` }" :title="`Masuk: ${formatRupiah(month.income)}`" />

              <div class="w-3/12 max-w-5 rounded-t-sm bg-red-500 transition-all"
                :style="{ height: `${month.expenseHeight}%` }" :title="`Keluar: ${formatRupiah(month.expense)}`" />
            </div>

            <span class="text-[11px] text-gray-500">
              {{ month.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
        <div>
          <p class="text-xs text-gray-500">Total Uang Masuk {{ filterYear }}</p>
          <p class="mt-1 font-bold text-green-700">
            {{ formatRupiah(chartTotals.income) }}
          </p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Total Uang Keluar {{ filterYear }}</p>
          <p class="mt-1 font-bold text-red-700">
            {{ formatRupiah(chartTotals.expense) }}
          </p>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div class="border-b border-gray-100 p-5">
        <div class="mb-4">
          <h2 class="font-bold text-gray-800">Riwayat Transaksi</h2>
          <p class="mt-1 text-xs text-gray-500">
            Daftar pendapatan dan pengeluaran armada.
          </p>
        </div>

        <!-- FILTER -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input v-model="search" type="text" placeholder="Cari kendaraan, kategori, referensi..."
            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400" />

          <select v-model="filterCategory" class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
            <option value="">Semua kategori</option>
            <option v-for="category in categories" :key="category.id" :value="String(category.id)">
              {{ category.name }}
            </option>
          </select>

          <select v-model="filterMonth" class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
            <option value="">Semua bulan</option>
            <option v-for="month in months" :key="month.value" :value="String(month.value)">
              {{ month.label }}
            </option>
          </select>

          <select v-model="filterYear" class="rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
            <option v-for="year in yearOptions" :key="year" :value="String(year)">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="py-12 text-center text-sm text-gray-500">
        Memuat data biaya operasional...
      </div>

      <!-- TABLE CONTENT -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="whitespace-nowrap p-3">Tanggal</th>
              <th class="p-3">Kendaraan</th>
              <th class="p-3">Kategori</th>
              <th class="p-3">Keterangan</th>
              <th class="whitespace-nowrap p-3 text-right">Nominal</th>
              <th class="p-3">Pembayaran</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in items" :key="item.id" :class="getTransactionClass(item.category?.transaction_type)"
              class="transition-colors">
              <td class="whitespace-nowrap p-3">
                {{ formatDate(item.expense_date) }}
              </td>

              <td class="p-3 font-medium">
                <div>{{ item.truck?.code || '-' }}</div>
                <div class="text-xs text-gray-500">
                  {{ item.truck?.plate_number || '-' }}
                </div>
              </td>

              <td class="p-3">
                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="getTransactionBadgeClass(item.category?.transaction_type)">
                  {{ getTransactionLabel(item.category?.transaction_type) }}
                </span>

                <div class="mt-1 font-medium text-gray-800">
                  {{ item.category?.name || '-' }}
                </div>
              </td>

              <td class="max-w-xs p-3">
                <div>{{ item.description || '-' }}</div>

                <div v-if="item.reference_number" class="mt-1 text-xs text-gray-400">
                  Ref: {{ item.reference_number }}
                </div>

                <div v-if="item.shipment" class="mt-1 text-xs text-gray-400">
                  Shipment: {{ item.shipment.shipment_number }}
                </div>
              </td>

              <td class="whitespace-nowrap px-4 py-3 text-right font-bold tabular-nums"
                :class="getAmountClass(item.category?.transaction_type)">
                {{ item.category?.transaction_type === 'income' ? '+' : '-' }}
                {{ formatRupiah(item.amount) }}
              </td>

              <td class="whitespace-nowrap p-3">
                <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="paymentClass(item.payment_status)">
                  {{ paymentLabel(item.payment_status) }}
                </span>
              </td>
            </tr>

            <tr v-if="!items.length">
              <td colspan="6" class="p-10 text-center text-gray-400">
                Tidak ada data transaksi.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div v-if="!loading && pagination.total > 0"
        class="flex flex-col justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center">
        <p class="text-xs text-gray-500">
          Menampilkan
          <strong>{{ pagination.from }}</strong>
          -
          <strong>{{ pagination.to }}</strong>
          dari
          <strong>{{ pagination.total }}</strong>
          transaksi
        </p>

        <div class="flex items-center gap-2">
          <select v-model.number="perPage" class="rounded-lg border border-gray-200 px-2 py-1.5 text-xs">
            <option :value="10">10 / halaman</option>
            <option :value="25">25 / halaman</option>
            <option :value="50">50 / halaman</option>
            <option :value="100">100 / halaman</option>
          </select>

          <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1 || loading"
            class="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">
            ‹
          </button>

          <span class="whitespace-nowrap text-xs text-gray-600">
            {{ pagination.current_page }} / {{ pagination.last_page }}
          </span>

          <button @click="changePage(currentPage + 1)" :disabled="currentPage >= pagination.last_page || loading"
            class="rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">
            ›
          </button>
        </div>
      </div>
    </div>

    <!-- FORM MODAL -->
    <div v-if="showForm" class="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div class="my-auto w-full max-w-xl rounded-2xl bg-white p-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-800">
            Tambah Biaya Operasional
          </h2>

          <button type="button" @click="showForm = false" class="text-xl text-gray-400 hover:text-gray-700">
            &times;
          </button>
        </div>

        <form @submit.prevent="save" class="mt-5 space-y-4">
          <!-- VEHICLE -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Kendaraan <span class="text-red-500">*</span>
            </label>

            <select v-model="form.truck_id" required class="w-full rounded-xl border p-3 text-sm">
              <option value="">Pilih kendaraan</option>
              <option v-for="truck in trucks" :key="truck.id" :value="String(truck.id)">
                {{ truck.code }} - {{ truck.plate_number }}
              </option>
            </select>
          </div>

          <!-- CATEGORY -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Kategori Biaya <span class="text-red-500">*</span>
            </label>

            <select v-model="form.category_id" required class="w-full rounded-xl border p-3 text-sm">
              <option value="">Pilih kategori</option>
              <option v-for="category in activeExpenseCategories" :key="category.id" :value="String(category.id)">
                {{ category.code }} - {{ category.name }}
              </option>
            </select>
          </div>

          <!-- DATE -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Tanggal <span class="text-red-500">*</span>
            </label>

            <input v-model="form.expense_date" type="date" required class="w-full rounded-xl border p-3 text-sm" />
          </div>

          <!-- AMOUNT -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Nominal (Rp) <span class="text-red-500">*</span>
            </label>

            <input v-model.number="form.amount" type="number" min="0.01" step="0.01" required
              class="w-full rounded-xl border p-3 text-sm" placeholder="Contoh: 150000" />
          </div>

          <!-- DESCRIPTION -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Keterangan
            </label>

            <textarea v-model="form.description" rows="3" class="w-full rounded-xl border p-3 text-sm"
              placeholder="Keterangan transaksi" />
          </div>

          <!-- REFERENCE -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Nomor Referensi
            </label>

            <input v-model="form.reference_number" class="w-full rounded-xl border p-3 text-sm"
              placeholder="Nomor nota / bukti transaksi" />
          </div>

          <!-- VALIDITY -->
          <div v-if="selectedCategory?.requires_validity">
            <label class="mb-1 block text-sm font-medium">
              Berlaku Sampai <span class="text-red-500">*</span>
            </label>

            <input v-model="form.valid_until" type="date" required class="w-full rounded-xl border p-3 text-sm" />
          </div>

          <!-- ODOMETER -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Odometer (KM)
            </label>

            <input v-model.number="form.odometer_km" type="number" min="0" step="0.1"
              class="w-full rounded-xl border p-3 text-sm" placeholder="Contoh: 12500.5" />
          </div>

          <!-- PAYMENT -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Status Pembayaran
            </label>

            <select v-model="form.payment_status" class="w-full rounded-xl border p-3 text-sm">
              <option value="paid">Sudah Dibayar</option>
              <option value="unpaid">Belum Dibayar</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <!-- ACTION -->
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showForm = false" class="rounded-xl border px-4 py-2 text-sm">
              Batal
            </button>

            <button type="submit" :disabled="saving"
              class="rounded-xl bg-[#003366] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ERROR -->
    <div v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref, watch } from 'vue'
import api, { getApiError } from '@/services/api'

// ======================================================
// STATE
// ======================================================

const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)
const errorMessage = ref('')

const items = ref([])
const categories = ref([])
const trucks = ref([])

const search = ref('')
const filterCategory = ref('')
const filterMonth = ref('')
const filterYear = ref(String(new Date().getFullYear()))

// ======================================================
// SERVER PAGINATION
// ======================================================

const currentPage = ref(1)
const perPage = ref(10)

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
})

function changePage(page) {
  if (page < 1 || page > pagination.last_page || loading.value) return

  currentPage.value = page
  loadData()
}

// ======================================================
// CONSTANTS
// ======================================================

const months = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
]

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()

  return Array.from(
    { length: 6 },
    (_, index) => currentYear - index
  )
})

// ======================================================
// FORM
// ======================================================

function getLocalDate() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const defaultForm = () => ({
  truck_id: '',
  category_id: '',
  expense_date: getLocalDate(),
  amount: null,
  description: '',
  reference_number: '',
  valid_until: '',
  odometer_km: null,
  payment_status: 'paid',
})

const form = reactive(defaultForm())

const selectedCategory = computed(() => {
  return categories.value.find(
    category => String(category.id) === String(form.category_id)
  ) || null
})

const activeExpenseCategories = computed(() => {
  return categories.value.filter(category =>
    category.is_active &&
    category.transaction_type === 'expense'
  )
})

// ======================================================
// SUMMARY & CHART DATA
// Data berasal dari agregasi backend.
// ======================================================

const summaryData = ref({
  income: 0,
  expense: 0,
  balance: 0,
})

const summary = computed(() => {
  const income = Number(summaryData.value.income || 0)
  const expense = Number(summaryData.value.expense || 0)
  const balance = Number(summaryData.value.balance ?? income - expense)

  return [
    {
      label: 'Total Uang Masuk',
      value: formatRupiah(income),
      color: 'bg-green-500',
      textColor: 'text-green-700',
    },
    {
      label: 'Total Uang Keluar',
      value: formatRupiah(expense),
      color: 'bg-red-500',
      textColor: 'text-red-700',
    },
    {
      label: 'Selisih Arus Kas',
      value: formatRupiah(balance),
      color: balance >= 0 ? 'bg-green-500' : 'bg-red-500',
      textColor: balance >= 0 ? 'text-green-700' : 'text-red-700',
    },
  ]
})

const monthlyChartData = ref([])

const monthlyChart = computed(() => {
  const data = monthlyChartData.value

  const maxValue = Math.max(
    1,
    ...data.flatMap(item => [
      Number(item.income || 0),
      Number(item.expense || 0),
    ])
  )

  return months.map(month => {
    const item = data.find(
      row => Number(row.month) === month.value
    )

    const income = Number(item?.income || 0)
    const expense = Number(item?.expense || 0)

    return {
      ...month,
      income,
      expense,
      incomeHeight: income
        ? Math.max(2, (income / maxValue) * 100)
        : 0,
      expenseHeight: expense
        ? Math.max(2, (expense / maxValue) * 100)
        : 0,
    }
  })
})

const chartTotals = computed(() => {
  return monthlyChart.value.reduce(
    (totals, month) => {
      totals.income += month.income
      totals.expense += month.expense

      return totals
    },
    { income: 0, expense: 0 }
  )
})

const chartHasData = computed(() => {
  return chartTotals.value.income > 0 ||
    chartTotals.value.expense > 0
})

// ======================================================
// LOAD DATA
// GET /erp/trucking-expense
// ======================================================

async function loadData() {
  loading.value = true
  errorMessage.value = ''

  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,

      search: search.value.trim() || undefined,

      category_id: filterCategory.value || undefined,
      month: filterMonth.value || undefined,
      year: filterYear.value || undefined,
    }

    const response = await api.get('/erp/trucking-expense', {
      params,
    })

    const result = response?.data?.data ?? {}

    // Paginated expenses
    const expenseResult = result.expenses ?? {}

    items.value = Array.isArray(expenseResult.data)
      ? expenseResult.data
      : []

    // Pagination metadata
    Object.assign(pagination, {
      current_page: expenseResult.current_page || 1,
      last_page: expenseResult.last_page || 1,
      per_page: expenseResult.per_page || perPage.value,
      total: expenseResult.total || 0,
      from: expenseResult.from || 0,
      to: expenseResult.to || 0,
    })

    currentPage.value = pagination.current_page

    // Master options
    categories.value = Array.isArray(result.categories)
      ? result.categories
      : []

    trucks.value = Array.isArray(result.trucks)
      ? result.trucks
      : []

    // Aggregated summary
    summaryData.value = result.summary ?? {
      income: 0,
      expense: 0,
      balance: 0,
    }

    // Monthly chart
    monthlyChartData.value = Array.isArray(result.monthly_chart)
      ? result.monthly_chart
      : []

  } catch (error) {
    errorMessage.value = getApiError(error).message
  } finally {
    loading.value = false
  }
}

// ======================================================
// FILTER WATCHERS
// ======================================================

// Debounce search 400ms
let searchTimeout = null

watch(search, () => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadData()
  }, 400)
})

// Filter langsung melakukan request
watch(
  [filterCategory, filterMonth, filterYear],
  () => {
    currentPage.value = 1
    loadData()
  }
)

// Perubahan jumlah data per halaman
watch(perPage, () => {
  currentPage.value = 1
  loadData()
})

// ======================================================
// OPEN FORM
// ======================================================

function openForm() {
  Object.assign(form, defaultForm())

  errorMessage.value = ''
  showForm.value = true
}

// ======================================================
// SAVE DATA
// POST /erp/trucking-expense
// ======================================================

async function save() {
  saving.value = true
  errorMessage.value = ''

  try {
    const payload = {
      truck_id: Number(form.truck_id),
      category_id: Number(form.category_id),
      expense_date: form.expense_date,
      amount: Number(form.amount),

      description: form.description || null,
      reference_number: form.reference_number || null,
      valid_until: form.valid_until || null,

      odometer_km:
        form.odometer_km === null || form.odometer_km === ''
          ? null
          : Number(form.odometer_km),

      payment_status: form.payment_status,
    }

    await api.post('/erp/trucking-expense', payload)

    showForm.value = false

    // Refresh data halaman pertama
    currentPage.value = 1

    await loadData()

  } catch (error) {
    errorMessage.value = getApiError(error).message
  } finally {
    saving.value = false
  }
}

// ======================================================
// TRANSACTION COLORS
// ======================================================

function getTransactionClass(type) {
  return type === 'income'
    ? 'bg-green-50/70 hover:bg-green-100'
    : 'bg-red-50/70 hover:bg-red-100'
}

function getTransactionBadgeClass(type) {
  return type === 'income'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700'
}

function getAmountClass(type) {
  return type === 'income'
    ? 'text-green-700'
    : 'text-red-700'
}

function getTransactionLabel(type) {
  return type === 'income'
    ? 'Uang Masuk'
    : 'Uang Keluar'
}

// ======================================================
// FORMAT
// ======================================================

function formatRupiah(value) {
  return 'Rp ' + Number(value || 0).toLocaleString('id-ID', {
    maximumFractionDigits: 0,
  })
}

function formatDate(value) {
  if (!value) return '-'

  const [year, month, day] = String(value)
    .slice(0, 10)
    .split('-')

  return `${day}/${month}/${year}`
}

function paymentLabel(status) {
  return {
    paid: 'Dibayar',
    unpaid: 'Belum Dibayar',
    pending: 'Pending',
  }[status] || status || '-'
}

function paymentClass(status) {
  return {
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
  }[status] || 'bg-gray-100 text-gray-600'
}

// ======================================================
// INITIALIZATION
// ======================================================

onMounted(loadData)

</script>
