<script setup>
import { computed, ref, onMounted } from 'vue'
import {
  CalendarDays,
  Truck,
  Users,
  Wallet,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  RotateCcw,
  ChevronDown,
  ReceiptText,
  Download,
  Eye,
  X,
  ChartNoAxesColumn,
  MapPinned,
} from 'lucide-vue-next'

import { erpApi, getApiError } from '@/services/api'
import { useToast } from '@/composables/useToast'

// =====================================================
// INITIALIZATION
// =====================================================

const toast = useToast()

const today = new Date()

const currentMonth = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
].join('-')

const loading = ref(false)
const shipments = ref([])

const selectedDriver = ref(null)
const showCostDetails = ref(false)

const filters = ref({
  month: currentMonth,
  driver: '',
  region: 'all',
  status: 'all',
  search: '',
})

// Mengubah nilai menjadi angka dengan aman.
function toNumber(value, fallback = 0) {
  const result = Number(value)

  return Number.isFinite(result) ? result : fallback
}

// =====================================================
// STATUS
// =====================================================

const statusOptions = [
  { value: 'all', label: 'Semua status' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Terjadwal' },
  { value: 'departed', label: 'Berangkat' },
  { value: 'on_route', label: 'Dalam perjalanan' },
  { value: 'arrived', label: 'Tiba' },
  { value: 'completed', label: 'Selesai' },
]

const statusLabel = value =>
  statusOptions.find(item => item.value === value)?.label || value

const statusClass = status => ({
  draft: 'bg-slate-100 text-slate-600',
  scheduled: 'bg-blue-50 text-blue-700',
  departed: 'bg-indigo-50 text-indigo-700',
  on_route: 'bg-amber-50 text-amber-700',
  arrived: 'bg-violet-50 text-violet-700',
  completed: 'bg-emerald-50 text-emerald-700',
}[status] || 'bg-slate-100 text-slate-600')

// =====================================================
// API RESPONSE
// =====================================================

// Mendukung response Laravel pagination maupun non-pagination.
function extractPagination(response) {
  const body = response?.data

  if (Array.isArray(body?.data)) {
    return {
      rows: body.data,
      lastPage: Number(body.last_page || 1),
    }
  }

  if (Array.isArray(body?.data?.data)) {
    return {
      rows: body.data.data,
      lastPage: Number(body.data.last_page || 1),
    }
  }

  if (Array.isArray(body)) {
    return {
      rows: body,
      lastPage: 1,
    }
  }

  return {
    rows: [],
    lastPage: 1,
  }
}

// =====================================================
// SHIPMENT NORMALIZATION
// =====================================================

// Semua struktur API dinormalisasi di sini.
// Bagian lain cukup membaca struktur hasil normalisasi.
function normalizeShipment(item) {
  const driver = item.driver || {}
  const truck = item.truck || {}

  const driverRate = toNumber(item.driver_rate)
  const driverAdditional = toNumber(item.driver_additional)
  const driverCorrection = toNumber(item.driver_correction)
  const driverBalen = toNumber(item.balen_driver_payment)

  const vendorRate = toNumber(item.vendor_rate)
  const vendorAdditional = toNumber(item.vendor_additional)
  const vendorCorrection = toNumber(item.vendor_correction)
  const vendorBalen = toNumber(item.balen_vendor_charge)

  // Total dasar dari backend.
  // Jika tidak disediakan, gunakan penjumlahan komponen.
  const driverBaseTotal = item.driver_total == null
    ? driverRate + driverAdditional + driverCorrection
    : toNumber(item.driver_total)

  const vendorBaseTotal = item.vendor_total == null
    ? vendorRate + vendorAdditional + vendorCorrection
    : toNumber(item.vendor_total)

  const costs = {
    driver: {
      rate: driverRate,
      additional: driverAdditional,
      correction: driverCorrection,
      balen: driverBalen,
      baseTotal: driverBaseTotal,
      total: driverBaseTotal + driverBalen,
    },

    vendor: {
      rate: vendorRate,
      additional: vendorAdditional,
      correction: vendorCorrection,
      balen: vendorBalen,
      baseTotal: vendorBaseTotal,
      total: vendorBaseTotal + vendorBalen,
    },
  }

  return {
    id: item.id,
    number: item.shipment_number || '-',
    date: item.shipment_date || '',

    driverId: driver.id ?? item.driver_id ?? null,
    driver: driver.name || item.driver_name || '-',

    truckId: truck.id ?? item.truck_id ?? null,
    truck: truck.plate_number || truck.name || '-',

    destination:
      item.destination_company ||
      item.destination_city ||
      '-',

    province:
      item.destination_province_name ||
      item.destination_province ||
      '',

    status: item.status || 'draft',

    costs,

    // Total pembayaran driver termasuk balen.
    driverTotal: costs.driver.total,

    // Total biaya vendor termasuk balen.
    vendorTotal: costs.vendor.total,

    // Selisih per shipment.
    mjiTotal: costs.vendor.total - costs.driver.total,
  }
}

// =====================================================
// LOAD SHIPMENTS
// =====================================================

async function loadShipments() {
  loading.value = true

  try {
    const allRows = []

    let page = 1
    let lastPage = 1

    do {
      const response = await erpApi.shipments.list({
        page,
        per_page: 100,
        sort_by: 'shipment_date',
        sort_direction: 'desc',
      })

      const pagination = extractPagination(response)

      allRows.push(...pagination.rows)

      lastPage = pagination.lastPage
      page++
    } while (page <= lastPage)

    shipments.value = allRows.map(normalizeShipment)

  } catch (error) {
    console.error('Gagal mengambil laporan driver:', error)

    toast.error(
      getApiError(error).message ||
      'Gagal mengambil data laporan driver.'
    )
  } finally {
    loading.value = false
  }
}

// =====================================================
// FILTER OPTIONS
// =====================================================

const drivers = computed(() => {
  const unique = new Map()

  shipments.value.forEach(item => {
    if (item.driverId != null && item.driver !== '-') {
      unique.set(String(item.driverId), {
        id: item.driverId,
        name: item.driver,
      })
    }
  })

  return [...unique.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'id')
  )
})

// =====================================================
// FILTERED SHIPMENTS
// =====================================================

const filteredShipments = computed(() => {
  const keyword = filters.value.search.trim().toLowerCase()

  return shipments.value
    .filter(item => {
      if (!filters.value.month) return true

      return String(item.date).startsWith(filters.value.month)
    })
    .filter(item => {
      if (!filters.value.driver) return true

      return String(item.driverId) === String(filters.value.driver)
    })
    .filter(item => {
      if (filters.value.status === 'all') return true

      return item.status === filters.value.status
    })
    .filter(item => {
      if (filters.value.region === 'all') return true

      if (filters.value.region === 'jatim') {
        return item.province === 'Jawa Timur'
      }

      if (filters.value.region === 'outside') {
        return item.province !== 'Jawa Timur'
      }

      return true
    })
    .filter(item => {
      if (!keyword) return true

      return [
        item.number,
        item.driver,
        item.truck,
        item.destination,
        item.province,
      ].some(value =>
        String(value || '').toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) =>
      String(b.date).localeCompare(String(a.date))
    )
})

// =====================================================
// FINANCIAL SUMMARY
// =====================================================

// Seluruh perhitungan keuangan terpusat di sini.
// Sumber perhitungan adalah data shipment yang sudah difilter.
const financialSummary = computed(() => {
  const result = {
    driver: {
      rate: 0,
      additional: 0,
      correction: 0,
      balen: 0,
      baseTotal: 0,
      adjustment: 0,
      total: 0,
    },

    vendor: {
      rate: 0,
      additional: 0,
      correction: 0,
      balen: 0,
      baseTotal: 0,
      adjustment: 0,
      total: 0,
    },

    mji: 0,
    shipmentCount: filteredShipments.value.length,
  }

  filteredShipments.value.forEach(item => {
    const driver = item.costs.driver
    const vendor = item.costs.vendor

    // DRIVER
    result.driver.rate += driver.rate
    result.driver.additional += driver.additional
    result.driver.correction += driver.correction
    result.driver.balen += driver.balen
    result.driver.baseTotal += driver.baseTotal
    result.driver.total += driver.total

    // Selisih untuk rekonsiliasi apabila total backend
    // berbeda dari jumlah tiga komponen dasarnya.
    result.driver.adjustment +=
      driver.baseTotal -
      driver.rate -
      driver.additional -
      driver.correction

    // VENDOR
    result.vendor.rate += vendor.rate
    result.vendor.additional += vendor.additional
    result.vendor.correction += vendor.correction
    result.vendor.balen += vendor.balen
    result.vendor.baseTotal += vendor.baseTotal
    result.vendor.total += vendor.total

    result.vendor.adjustment +=
      vendor.baseTotal -
      vendor.rate -
      vendor.additional -
      vendor.correction
  })

  // OPSI B: MJI = Total Vendor - Total Driver.
  result.mji = result.vendor.total - result.driver.total

  return result
})

// Alias untuk binding pada kartu ringkasan.
const driverRateTotal = computed(() =>
  financialSummary.value.driver.rate
)

const driverAdditionalTotal = computed(() =>
  financialSummary.value.driver.additional
)

const driverCorrectionTotal = computed(() =>
  financialSummary.value.driver.correction
)

const driverAdjustmentTotal = computed(() =>
  financialSummary.value.driver.adjustment
)

const driverBalenTotal = computed(() =>
  financialSummary.value.driver.balen
)

const driverGrandTotal = computed(() =>
  financialSummary.value.driver.total
)

const vendorRateTotal = computed(() =>
  financialSummary.value.vendor.rate
)

const vendorAdditionalTotal = computed(() =>
  financialSummary.value.vendor.additional
)

const vendorCorrectionTotal = computed(() =>
  financialSummary.value.vendor.correction
)

const vendorAdjustmentTotal = computed(() =>
  financialSummary.value.vendor.adjustment
)

const vendorBalenTotal = computed(() =>
  financialSummary.value.vendor.balen
)

const vendorGrandTotal = computed(() =>
  financialSummary.value.vendor.total
)

const mjiTotal = computed(() =>
  financialSummary.value.mji
)

// =====================================================
// KPI
// =====================================================

const totalTrips = computed(() =>
  filteredShipments.value.length
)

const totalMoney = computed(() =>
  driverGrandTotal.value
)

const jatimTrips = computed(() =>
  filteredShipments.value.filter(item =>
    item.province === 'Jawa Timur'
  ).length
)

const outsideTrips = computed(() =>
  totalTrips.value - jatimTrips.value
)

const averageCost = computed(() =>
  totalTrips.value
    ? totalMoney.value / totalTrips.value
    : 0
)

const jatimPercent = computed(() =>
  totalTrips.value
    ? jatimTrips.value / totalTrips.value * 100
    : 0
)

const outsidePercent = computed(() =>
  totalTrips.value
    ? outsideTrips.value / totalTrips.value * 100
    : 0
)

const completedTrips = computed(() =>
  filteredShipments.value.filter(item =>
    item.status === 'completed'
  ).length
)

// =====================================================
// DRIVER SUMMARY
// =====================================================

const driverSummary = computed(() => {
  const grouped = new Map()

  filteredShipments.value.forEach(item => {
    const key = String(item.driverId ?? item.driver)

    if (!grouped.has(key)) {
      grouped.set(key, {
        driverId: item.driverId,
        driver: item.driver,
        trips: 0,
        jatim: 0,
        outside: 0,
        total: 0,
        completed: 0,
      })
    }

    const row = grouped.get(key)

    row.trips++
    row.total += item.driverTotal

    if (item.province === 'Jawa Timur') {
      row.jatim++
    } else {
      row.outside++
    }

    if (item.status === 'completed') {
      row.completed++
    }
  })

  return [...grouped.values()].sort((a, b) =>
    b.total - a.total
  )
})

// =====================================================
// DRIVER DETAIL MODAL
// =====================================================

const selectedDriverName = computed(() => {
  if (selectedDriver.value == null) {
    return 'Seluruh driver'
  }

  return shipments.value.find(item =>
    String(item.driverId) === String(selectedDriver.value)
  )?.driver || 'Driver tidak ditemukan'
})

const selectedCostShipments = computed(() =>
  filteredShipments.value.filter(item => {
    if (selectedDriver.value == null) return true

    return String(item.driverId) === String(selectedDriver.value)
  })
)

// Ringkasan setiap komponen untuk modal.
const detailCostBreakdown = computed(() => {
  const rows = selectedCostShipments.value

  const summary = {
    rate: 0,
    additional: 0,
    correction: 0,
    adjustment: 0,
    balen: 0,
  }

  rows.forEach(item => {
    const cost = item.costs.driver

    summary.rate += cost.rate
    summary.additional += cost.additional
    summary.correction += cost.correction
    summary.adjustment +=
      cost.baseTotal -
      cost.rate -
      cost.additional -
      cost.correction
    summary.balen += cost.balen
  })

  return [
    {
      key: 'rate',
      label: 'Tarif driver',
      total: summary.rate,
    },
    {
      key: 'additional',
      label: 'Tambahan driver',
      total: summary.additional,
    },
    {
      key: 'correction',
      label: 'Koreksi driver',
      total: summary.correction,
    },
    {
      key: 'adjustment',
      label: 'Penyesuaian rekonsiliasi',
      total: summary.adjustment,
    },
    {
      key: 'balen',
      label: 'Balen driver',
      total: summary.balen,
    },
  ]
})

const detailTotalMoney = computed(() =>
  selectedCostShipments.value.reduce(
    (sum, item) => sum + item.driverTotal,
    0
  )
)

// =====================================================
// FORMATTERS
// =====================================================

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const money = value => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(toNumber(value))

const number = value =>
  new Intl.NumberFormat('id-ID').format(toNumber(value))

const monthLabel = computed(() => {
  if (!filters.value.month) return 'Semua periode'

  const [year, month] = filters.value.month.split('-')

  return new Date(
    Number(year),
    Number(month) - 1,
    1
  ).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })
})

// =====================================================
// ACTIONS
// =====================================================

function resetFilters() {
  filters.value = {
    month: currentMonth,
    driver: '',
    region: 'all',
    status: 'all',
    search: '',
  }

  selectedDriver.value = null
}

function openDriver(driverId) {
  selectedDriver.value = driverId
  showCostDetails.value = true
}

function closeCostDetails() {
  showCostDetails.value = false
  selectedDriver.value = null
}

// =====================================================
// EXPORT CSV
// =====================================================

function exportCsv() {
  const headers = [
    'Nomor Pengiriman',
    'Tanggal',
    'Driver',
    'Truk',
    'Tujuan',
    'Provinsi',
    'Status',

    'Tarif Driver',
    'Tambahan Driver',
    'Koreksi Driver',
    'Balen Driver',
    'Total Driver',

    'Tarif Vendor',
    'Tambahan Vendor',
    'Koreksi Vendor',
    'Balen Vendor',
    'Total Vendor',

    'Selisih MJI',
  ]

  const rows = filteredShipments.value.map(item => [
    item.number,
    item.date,
    item.driver,
    item.truck,
    item.destination,
    item.province,
    statusLabel(item.status),

    item.costs.driver.rate,
    item.costs.driver.additional,
    item.costs.driver.correction,
    item.costs.driver.balen,
    item.driverTotal,

    item.costs.vendor.rate,
    item.costs.vendor.additional,
    item.costs.vendor.correction,
    item.costs.vendor.balen,
    item.vendorTotal,

    item.mjiTotal,
  ])

  const csv = [headers, ...rows]
    .map(row =>
      row.map(value =>
        `"${String(value ?? '').replaceAll('"', '""')}"`
      ).join(',')
    )
    .join('\r\n')

  const blob = new Blob(
    ['\uFEFF' + csv],
    { type: 'text/csv;charset=utf-8;' }
  )

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `laporan-driver-${filters.value.month || 'semua-periode'}.csv`

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}

// =====================================================
// LIFECYCLE
// =====================================================

onMounted(() => {
  loadShipments()
})
</script>

<template>
  <div class="min-h-screen space-y-6 bg-slate-50/70 p-4 md:p-6">
    <!-- HEADER -->
    <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-[#003366] md:text-3xl">
          Laporan Driver
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Analisis perjalanan dan rekap pembayaran driver per bulan.
        </p>
      </div>

      <button type="button" @click="exportCsv"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
        <Download class="h-4 w-4" />
        Export CSV
      </button>
    </div>

    <!-- FILTER -->
    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="font-semibold text-slate-800">Filter laporan</h2>
          <p class="mt-1 text-xs text-slate-500">
            Pilih periode dan kriteria untuk menganalisis pengiriman.
          </p>
        </div>
        <button type="button" @click="resetFilters"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800">
          <RotateCcw class="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-600">Periode bulan</span>
          <div class="relative">
            <CalendarDays class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="filters.month" type="month"
              class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
        </label>

        <label class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-600">Driver</span>
          <div class="relative">
            <Users class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select v-model="filters.driver"
              class="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="">Semua driver</option>
              <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                {{ driver.name }}
              </option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </label>

        <label class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-600">Wilayah tujuan</span>
          <div class="relative">
            <MapPinned class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select v-model="filters.region"
              class="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="all">Semua wilayah</option>
              <option value="jatim">Dalam Provinsi Jatim</option>
              <option value="outside">Luar Provinsi Jatim</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </label>

        <label class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-600">Status pengiriman</span>
          <select v-model="filters.status"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </label>

        <label class="space-y-1.5">
          <span class="text-xs font-semibold text-slate-600">Cari pengiriman</span>
          <div class="relative">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input v-model="filters.search" type="text" placeholder="No. shipment, driver..."
              class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
        </label>
      </div>
    </section>

    <!-- PERIOD LABEL -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2 text-sm">
        <CalendarDays class="h-4 w-4 text-[#0052cc]" />
        <span class="font-semibold text-slate-800">{{ monthLabel }}</span>
        <span class="text-slate-400">·</span>
        <span class="text-slate-500">{{ number(totalTrips) }} pengiriman sesuai filter</span>
      </div>
      <span class="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
        {{ loading ? 'Memuat data...' : 'Data aktual ERP' }}
      </span>
    </div>

    <!-- KPI CARDS -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="rounded-xl bg-blue-50 p-3 text-[#0052cc]">
            <Truck class="h-5 w-5" />
          </div>
          <span class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            Semua status
          </span>
        </div>
        <p class="mt-4 text-sm text-slate-500">Total perjalanan</p>
        <p class="mt-1 text-3xl font-bold tracking-tight text-[#003366]">
          {{ number(totalTrips) }}
        </p>
        <p class="mt-1 text-xs text-slate-400">Berdasarkan filter periode</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="rounded-xl bg-emerald-50 p-3 text-emerald-700">
            <MapPin class="h-5 w-5" />
          </div>
          <ArrowUpRight class="h-4 w-4 text-emerald-600" />
        </div>
        <p class="mt-4 text-sm text-slate-500">Dalam Provinsi Jatim</p>
        <p class="mt-1 text-3xl font-bold tracking-tight text-slate-800">
          {{ number(jatimTrips) }}
          <span class="text-base font-medium text-slate-400">trip</span>
        </p>
        <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div class="h-full rounded-full bg-emerald-500 transition-all" :style="{ width: `${jatimPercent}%` }" />
        </div>
        <p class="mt-1.5 text-xs text-slate-400">{{ jatimPercent.toFixed(1) }}% dari perjalanan</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="rounded-xl bg-orange-50 p-3 text-orange-700">
            <MapPinned class="h-5 w-5" />
          </div>
          <ArrowDownRight class="h-4 w-4 text-orange-600" />
        </div>
        <p class="mt-4 text-sm text-slate-500">Luar Provinsi Jatim</p>
        <p class="mt-1 text-3xl font-bold tracking-tight text-slate-800">
          {{ number(outsideTrips) }}
          <span class="text-base font-medium text-slate-400">trip</span>
        </p>
        <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div class="h-full rounded-full bg-orange-500 transition-all" :style="{ width: `${outsidePercent}%` }" />
        </div>
        <p class="mt-1.5 text-xs text-slate-400">{{ outsidePercent.toFixed(1) }}% dari perjalanan</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="rounded-xl bg-violet-50 p-3 text-violet-700">
            <Wallet class="h-5 w-5" />
          </div>
          <ReceiptText class="h-4 w-4 text-violet-500" />
        </div>
        <p class="mt-4 text-sm text-slate-500">Total uang driver</p>
        <p class="mt-1 break-words text-2xl font-bold tracking-tight text-[#003366]">
          {{ money(totalMoney) }}
        </p>
        <p class="mt-1 text-xs text-slate-400">
          Rata-rata {{ money(averageCost) }} / trip
        </p>
      </div>
    </section>

    <!-- REGIONAL ANALYSIS + FINANCIAL BREAKDOWN -->
    <section class="grid gap-6 xl:grid-cols-4">

      <!-- KOMPOSISI WILAYAH -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="font-bold text-[#003366]">Komposisi wilayah perjalanan</h2>
            <p class="mt-1 text-xs text-slate-500">Perbandingan tujuan pengiriman</p>
          </div>
          <div class="rounded-xl bg-blue-50 p-2.5 text-[#0052cc]">
            <ChartNoAxesColumn class="h-5 w-5" />
          </div>
        </div>

        <div class="mt-7 space-y-5">
          <div>
            <div class="mb-2 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span class="text-sm font-medium text-slate-700">Dalam Provinsi Jatim</span>
              </div>
              <span class="text-sm font-bold text-slate-800">
                {{ jatimTrips }} trip
              </span>
            </div>
            <div class="h-3 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-emerald-500 transition-all" :style="{ width: `${jatimPercent}%` }">
              </div>
            </div>
          </div>

          <div>
            <div class="mb-2 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                <span class="text-sm font-medium text-slate-700">Luar Provinsi Jatim</span>
              </div>
              <span class="text-sm font-bold text-slate-800">
                {{ outsideTrips }} trip
              </span>
            </div>
            <div class="h-3 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-orange-500 transition-all" :style="{ width: `${outsidePercent}%` }">
              </div>
            </div>
          </div>
        </div>

        <div class="mt-7 rounded-xl bg-slate-50 p-4">
          <p class="text-xs leading-5 text-slate-500">
            Wilayah ditentukan dari provinsi tujuan yang tersimpan pada pengiriman.
            Tujuan di Jawa Timur dihitung sebagai dalam provinsi; provinsi lainnya
            dihitung sebagai luar provinsi.
          </p>
        </div>
      </div>

      <!-- RINCIAN DRIVER -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-bold text-[#003366]">Rincian Driver</h2>
            <p class="mt-1 text-xs text-slate-500">
              Akumulasi pembayaran driver
            </p>
          </div>
          <div class="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <Wallet class="h-5 w-5" />
          </div>
        </div>

        <div class="mt-5 divide-y divide-slate-100">
          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Tarif driver</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(driverRateTotal) }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Tambahan driver</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(driverAdditionalTotal) }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Koreksi driver</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(driverCorrectionTotal) }}
            </span>
          </div>

          <!-- <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Penyesuaian rekonsiliasi</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(driverAdjustmentTotal) }}
            </span>
          </div> -->

          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Balen driver</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(driverBalenTotal) }}
            </span>
          </div>
        </div>

        <div class="mt-3 rounded-xl bg-blue-50 p-4">
          <p class="text-xs font-medium text-blue-700">Total pembayaran driver</p>
          <p class="mt-1 text-xl font-bold text-[#003366]">
            {{ money(driverGrandTotal) }}
          </p>
        </div>
      </div>

      <!-- RINCIAN VENDOR -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-bold text-[#003366]">Rincian Vendor</h2>
            <p class="mt-1 text-xs text-slate-500">
              Akumulasi biaya vendor pengiriman
            </p>
          </div>
          <div class="rounded-xl bg-orange-50 p-2.5 text-orange-600">
            <ReceiptText class="h-5 w-5" />
          </div>
        </div>

        <div class="mt-5 divide-y divide-slate-100">
          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Tarif vendor</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(vendorRateTotal) }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Tambahan vendor</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(vendorAdditionalTotal) }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Koreksi vendor</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(vendorCorrectionTotal) }}
            </span>
          </div>

          <!-- <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Penyesuaian rekonsiliasi</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(vendorAdjustmentTotal) }}
            </span>
          </div> -->

          <div class="flex items-center justify-between gap-3 py-3">
            <span class="text-sm text-slate-600">Balen vendor</span>
            <span class="text-sm font-semibold tabular-nums text-slate-800">
              {{ money(vendorBalenTotal) }}
            </span>
          </div>
        </div>

        <div class="mt-3 rounded-xl bg-orange-50 p-4">
          <p class="text-xs font-medium text-orange-700">Total biaya vendor</p>
          <p class="mt-1 text-xl font-bold text-[#003366]">
            {{ money(vendorGrandTotal) }}
          </p>
        </div>
      </div>

      <!-- SELISIH MJI -->
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-bold text-[#003366]">Selisih MJI</h2>
            <p class="mt-1 text-xs text-slate-500">
              Selisih biaya vendor dan pembayaran driver
            </p>
          </div>
          <div class="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
            <ChartNoAxesColumn class="h-5 w-5" />
          </div>
        </div>

        <div class="mt-5 space-y-4">
          <div>
            <p class="text-xs text-slate-500">Total biaya vendor</p>
            <p class="mt-1 text-base font-bold text-slate-800">
              {{ money(vendorGrandTotal) }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-500">Total pembayaran driver</p>
            <p class="mt-1 text-base font-bold text-slate-800">
              {{ money(driverGrandTotal) }}
            </p>
          </div>

          <div class="border-t border-dashed border-slate-200 pt-4">
            <p class="text-xs font-medium text-emerald-700">
              Selisih Vendor - Driver
            </p>
            <p class="mt-1 text-2xl font-bold" :class="mjiTotal >= 0 ? 'text-emerald-600' : 'text-red-600'">
              {{ money(mjiTotal) }}
            </p>
          </div>
        </div>

        <div class="mt-4 rounded-xl bg-slate-50 p-3">
          <p class="text-xs leading-5 text-slate-500">
            Selisih dihitung dari total biaya vendor dikurangi total pembayaran
            driver, termasuk komponen balen.
          </p>
        </div>
      </div>

    </section>

    <!-- DRIVER SUMMARY -->
    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-lg font-bold text-[#003366]">Rekap perjalanan per driver</h2>
          <p class="mt-1 text-sm text-slate-500">
            Ringkasan produktivitas dan total pembayaran per driver.
          </p>
        </div>
        <span class="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
          {{ driverSummary.length }} driver
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[850px] text-left">
          <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-4">Driver</th>
              <th class="px-5 py-4 text-center">Total trip</th>
              <th class="px-5 py-4 text-center">Dalam Jatim</th>
              <th class="px-5 py-4 text-center">Luar Jatim</th>
              <th class="px-5 py-4 text-center">Selesai</th>
              <th class="px-5 py-4 text-right">Total uang driver</th>
              <th class="px-5 py-4 text-center">Detail</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="!driverSummary.length">
              <td colspan="7" class="px-5 py-12 text-center">
                <Truck class="mx-auto h-8 w-8 text-slate-300" />
                <p class="mt-3 text-sm font-medium text-slate-600">Tidak ada data</p>
                <p class="mt-1 text-xs text-slate-400">Ubah filter untuk melihat data lainnya.</p>
              </td>
            </tr>
            <tr v-for="row in driverSummary" :key="row.driver" class="transition hover:bg-slate-50/80">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0052cc]">
                    {{row.driver.split(' ').map(word => word[0]).slice(0, 2).join('')}}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-800">{{ row.driver }}</p>
                    <p class="mt-0.5 text-xs text-slate-400">Driver pengiriman</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 text-center text-sm font-semibold text-slate-800">
                {{ row.trips }}
              </td>
              <td class="px-5 py-4 text-center">
                <span
                  class="inline-flex min-w-9 justify-center rounded-lg bg-emerald-50 px-2.5 py-1.5 text-sm font-semibold text-emerald-700">
                  {{ row.jatim }}
                </span>
              </td>
              <td class="px-5 py-4 text-center">
                <span
                  class="inline-flex min-w-9 justify-center rounded-lg bg-orange-50 px-2.5 py-1.5 text-sm font-semibold text-orange-700">
                  {{ row.outside }}
                </span>
              </td>
              <td class="px-5 py-4 text-center text-sm text-slate-600">
                {{ row.completed }}
              </td>
              <td class="px-5 py-4 text-right text-sm font-bold text-[#003366]">
                {{ money(row.total) }}
              </td>
              <td class="px-5 py-4 text-center">
                <button type="button" @click="openDriver(row.driverId)"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#0052cc] transition hover:border-blue-200 hover:bg-blue-50">
                  <Eye class="h-3.5 w-3.5" />
                  Lihat
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="driverSummary.length" class="border-t-2 border-slate-200 bg-slate-50">
            <tr>
              <td class="px-5 py-4 text-sm font-bold text-slate-800">TOTAL</td>
              <td class="px-5 py-4 text-center text-sm font-bold text-slate-800">{{ totalTrips }}</td>
              <td class="px-5 py-4 text-center text-sm font-bold text-emerald-700">{{ jatimTrips }}</td>
              <td class="px-5 py-4 text-center text-sm font-bold text-orange-700">{{ outsideTrips }}</td>
              <td class="px-5 py-4 text-center text-sm font-bold text-slate-800">
                {{filteredShipments.filter(item => item.status === 'completed').length}}
              </td>
              <td class="px-5 py-4 text-right text-sm font-bold text-[#003366]">{{ money(totalMoney) }}</td>
              <td class="px-5 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

    <!-- SHIPMENT DETAIL -->
    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-lg font-bold text-[#003366]">Detail perjalanan</h2>
          <p class="mt-1 text-sm text-slate-500">
            Seluruh pengiriman sesuai periode, status, driver, dan wilayah yang dipilih.
          </p>
        </div>
        <span class="text-sm text-slate-500">
          {{ filteredShipments.length }} data
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1050px] text-left">
          <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-4">Tanggal / Nomor</th>
              <th class="px-5 py-4">Driver & Truk</th>
              <th class="px-5 py-4">Tujuan</th>
              <th class="px-5 py-4">Klasifikasi wilayah</th>
              <th class="px-5 py-4">Status</th>
              <th class="px-5 py-4 text-right">Uang driver</th>
              <th class="px-5 py-4 text-center">Rincian</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="!filteredShipments.length">
              <td colspan="7" class="px-5 py-12 text-center text-sm text-slate-500">
                Tidak ada pengiriman yang cocok dengan filter.
              </td>
            </tr>
            <tr v-for="item in filteredShipments" :key="item.id" class="transition hover:bg-slate-50/80">
              <td class="px-5 py-4">
                <p class="text-sm font-semibold text-slate-800">{{ item.number }}</p>
                <p class="mt-1 text-xs text-slate-400">{{ formatDateTime(item.date) }}</p>
              </td>
              <td class="px-5 py-4">
                <p class="text-sm font-medium text-slate-800">{{ item.driver }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.truck }}</p>
              </td>
              <td class="px-5 py-4">
                <p class="text-sm font-medium text-slate-800">{{ item.destination }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ item.province }}</p>
              </td>
              <td class="px-5 py-4">
                <span :class="item.province === 'Jawa Timur'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-orange-50 text-orange-700'" class="inline-flex rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                  {{ item.province === 'Jawa Timur' ? 'Dalam Provinsi Jatim' : 'Luar Provinsi Jatim' }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span :class="statusClass(item.status)"
                  class="inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold">
                  {{ statusLabel(item.status) }}
                </span>
              </td>
              <td class="px-5 py-4 text-right text-sm font-semibold text-slate-800">
                {{ money(item.driverTotal) }}
              </td>
              <td class="px-5 py-4 text-center">
                <button type="button" @click="selectedDriver = item.driverId; showCostDetails = true"
                  class="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-[#0052cc]"
                  title="Lihat komponen biaya">
                  <Eye class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- DRIVER DETAIL MODAL -->
    <div v-if="showCostDetails"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      @click.self="closeCostDetails">
      <div class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <!-- HEADER -->
        <div class="flex items-start justify-between border-b border-slate-100 p-5">
          <div>
            <h3 class="text-lg font-bold text-[#003366]">
              Rincian pembayaran driver
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              {{ selectedDriverName }} · {{ monthLabel }}
            </p>

            <p class="mt-1 text-xs text-slate-400">
              {{ number(selectedCostShipments.length) }} pengiriman
            </p>
          </div>

          <button type="button" @click="closeCostDetails"
            class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- BODY -->
        <div class="p-5">

          <div v-if="!selectedCostShipments.length" class="rounded-xl bg-slate-50 p-8 text-center">
            <ReceiptText class="mx-auto h-8 w-8 text-slate-300" />

            <p class="mt-3 text-sm font-medium text-slate-600">
              Tidak ada data pembayaran
            </p>

            <p class="mt-1 text-xs text-slate-400">
              Tidak ditemukan pengiriman untuk driver dan filter tersebut.
            </p>
          </div>

          <template v-else>
            <!-- COMPONENT BREAKDOWN -->
            <div class="divide-y divide-slate-100">
              <div v-for="component in detailCostBreakdown" :key="component.key"
                class="flex items-center justify-between gap-4 py-3">
                <span class="text-sm text-slate-600">
                  {{ component.label }}
                </span>

                <span class="text-sm font-semibold tabular-nums text-slate-800">
                  {{ money(component.total) }}
                </span>
              </div>
            </div>

            <!-- TOTAL -->
            <div class="mt-4 rounded-xl bg-blue-50 p-4">
              <p class="text-xs font-medium text-blue-700">
                Total pembayaran driver
              </p>

              <p class="mt-1 text-2xl font-bold text-[#003366]">
                {{ money(detailTotalMoney) }}
              </p>
            </div>

            <!-- SHIPMENT COUNT -->
            <div class="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span class="text-xs text-slate-500">
                Jumlah pengiriman
              </span>

              <span class="text-sm font-bold text-slate-800">
                {{ number(selectedCostShipments.length) }} trip
              </span>
            </div>
          </template>

          <button type="button" @click="closeCostDetails"
            class="mt-5 w-full rounded-xl bg-[#0052cc] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
