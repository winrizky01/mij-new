<script setup>
import { computed, ref } from 'vue'
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

const today = new Date()
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

const filters = ref({
    month: currentMonth,
    driver: '',
    region: 'all',
    status: 'all',
    search: '',
})

const selectedDriver = ref(null)
const showCostDetails = ref(false)

// MOCK DATA — nanti diganti dengan respons API.
const shipments = ref([
    {
        id: 1,
        number: 'SHP-2026-001',
        date: `${currentMonth}-02`,
        driver: 'Budi Santoso',
        truck: 'L 8012 AB',
        destination: 'Sidoarjo',
        province: 'Jawa Timur',
        status: 'completed',
        driverTotal: 450000,
        costs: { driverRate: 300000, meal: 50000, accommodation: 0, other: 100000 },
    },
    {
        id: 2,
        number: 'SHP-2026-002',
        date: `${currentMonth}-04`,
        driver: 'Agus Setiawan',
        truck: 'N 8123 CD',
        destination: 'Probolinggo',
        province: 'Jawa Timur',
        status: 'completed',
        driverTotal: 400000,
        costs: { driverRate: 280000, meal: 50000, accommodation: 0, other: 70000 },
    },
    {
        id: 3,
        number: 'SHP-2026-003',
        date: `${currentMonth}-06`,
        driver: 'Budi Santoso',
        truck: 'L 8012 AB',
        destination: 'Semarang',
        province: 'Jawa Tengah',
        status: 'on_route',
        driverTotal: 850000,
        costs: { driverRate: 550000, meal: 100000, accommodation: 100000, other: 100000 },
    },
    {
        id: 4,
        number: 'SHP-2026-004',
        date: `${currentMonth}-08`,
        driver: 'Dedi Kurniawan',
        truck: 'W 8234 EF',
        destination: 'Gresik',
        province: 'Jawa Timur',
        status: 'scheduled',
        driverTotal: 350000,
        costs: { driverRate: 250000, meal: 50000, accommodation: 0, other: 50000 },
    },
    {
        id: 5,
        number: 'SHP-2026-005',
        date: `${currentMonth}-10`,
        driver: 'Agus Setiawan',
        truck: 'N 8123 CD',
        destination: 'Yogyakarta',
        province: 'DI Yogyakarta',
        status: 'completed',
        driverTotal: 750000,
        costs: { driverRate: 500000, meal: 100000, accommodation: 50000, other: 100000 },
    },
    {
        id: 6,
        number: 'SHP-2026-006',
        date: `${currentMonth}-12`,
        driver: 'Dedi Kurniawan',
        truck: 'W 8234 EF',
        destination: 'Madiun',
        province: 'Jawa Timur',
        status: 'departed',
        driverTotal: 380000,
        costs: { driverRate: 280000, meal: 50000, accommodation: 0, other: 50000 },
    },
    {
        id: 7,
        number: 'SHP-2026-007',
        date: `${currentMonth}-14`,
        driver: 'Budi Santoso',
        truck: 'L 8012 AB',
        destination: 'Banyuwangi',
        province: 'Jawa Timur',
        status: 'completed',
        driverTotal: 500000,
        costs: { driverRate: 350000, meal: 50000, accommodation: 0, other: 100000 },
    },
    {
        id: 8,
        number: 'SHP-2026-008',
        date: `${currentMonth}-16`,
        driver: 'Agus Setiawan',
        truck: 'N 8123 CD',
        destination: 'Bandung',
        province: 'Jawa Barat',
        status: 'draft',
        driverTotal: 950000,
        costs: { driverRate: 600000, meal: 100000, accommodation: 150000, other: 100000 },
    },
    {
        id: 9,
        number: 'SHP-2026-009',
        date: `${currentMonth}-18`,
        driver: 'Dedi Kurniawan',
        truck: 'W 8234 EF',
        destination: 'Pasuruan',
        province: 'Jawa Timur',
        status: 'arrived',
        driverTotal: 420000,
        costs: { driverRate: 300000, meal: 50000, accommodation: 0, other: 70000 },
    },
    {
        id: 10,
        number: 'SHP-2026-010',
        date: `${currentMonth}-20`,
        driver: 'Budi Santoso',
        truck: 'L 8012 AB',
        destination: 'Solo',
        province: 'Jawa Tengah',
        status: 'completed',
        driverTotal: 800000,
        costs: { driverRate: 500000, meal: 100000, accommodation: 100000, other: 100000 },
    },
])

const drivers = computed(() => [
    ...new Set(shipments.value.map(item => item.driver)),
].sort())

const statusOptions = [
    { value: 'all', label: 'Semua status' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Terjadwal' },
    { value: 'departed', label: 'Berangkat' },
    { value: 'on_route', label: 'Dalam perjalanan' },
    { value: 'arrived', label: 'Tiba' },
    { value: 'completed', label: 'Selesai' },
]

const filteredShipments = computed(() => {
    const keyword = filters.value.search.trim().toLowerCase()

    return shipments.value
        .filter(item => !filters.value.month || item.date.startsWith(filters.value.month))
        .filter(item => !filters.value.driver || item.driver === filters.value.driver)
        .filter(item => filters.value.status === 'all' || item.status === filters.value.status)
        .filter(item => {
            if (filters.value.region === 'jatim') return item.province === 'Jawa Timur'
            if (filters.value.region === 'outside') return item.province !== 'Jawa Timur'
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
            ].some(value => value.toLowerCase().includes(keyword))
        })
        .sort((a, b) => b.date.localeCompare(a.date))
})

const totalTrips = computed(() => filteredShipments.value.length)
const totalMoney = computed(() =>
    filteredShipments.value.reduce((sum, item) => sum + item.driverTotal, 0),
)
const jatimTrips = computed(() =>
    filteredShipments.value.filter(item => item.province === 'Jawa Timur').length,
)
const outsideTrips = computed(() => totalTrips.value - jatimTrips.value)
const averageCost = computed(() =>
    totalTrips.value ? totalMoney.value / totalTrips.value : 0,
)

const jatimPercent = computed(() =>
    totalTrips.value ? (jatimTrips.value / totalTrips.value) * 100 : 0,
)
const outsidePercent = computed(() =>
    totalTrips.value ? (outsideTrips.value / totalTrips.value) * 100 : 0,
)

const driverSummary = computed(() => {
    const grouped = new Map()

    filteredShipments.value.forEach(item => {
        if (!grouped.has(item.driver)) {
            grouped.set(item.driver, {
                driver: item.driver,
                trips: 0,
                jatim: 0,
                outside: 0,
                total: 0,
                completed: 0,
            })
        }

        const row = grouped.get(item.driver)
        row.trips++
        row.total += item.driverTotal

        if (item.province === 'Jawa Timur') row.jatim++
        else row.outside++

        if (item.status === 'completed') row.completed++
    })

    return [...grouped.values()].sort((a, b) => b.total - a.total)
})

const costBreakdown = computed(() => {
    const result = [
        { key: 'driverRate', label: 'Tarif dasar driver', total: 0 },
        { key: 'meal', label: 'Uang makan', total: 0 },
        { key: 'accommodation', label: 'Akomodasi', total: 0 },
        { key: 'other', label: 'Biaya lainnya', total: 0 },
    ]

    filteredShipments.value.forEach(item => {
        result.forEach(component => {
            component.total += item.costs[component.key] || 0
        })
    })

    return result
})

const money = value => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
}).format(value || 0)

const number = value => new Intl.NumberFormat('id-ID').format(value || 0)

const monthLabel = computed(() => {
    if (!filters.value.month) return 'Semua periode'
    const [year, month] = filters.value.month.split('-')
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
    })
})

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

const resetFilters = () => {
    filters.value = {
        month: currentMonth,
        driver: '',
        region: 'all',
        status: 'all',
        search: '',
    }
    selectedDriver.value = null
}

const openDriver = driver => {
    selectedDriver.value = driver
}

const exportCsv = () => {
    const rows = [
        ['Nomor Pengiriman', 'Tanggal', 'Driver', 'Truk', 'Tujuan', 'Provinsi', 'Status', 'Total Uang Driver'],
        ...filteredShipments.value.map(item => [
            item.number,
            item.date,
            item.driver,
            item.truck,
            item.destination,
            item.province,
            statusLabel(item.status),
            item.driverTotal,
        ]),
    ]

    const csv = rows
        .map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\r\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `laporan-driver-${filters.value.month || 'semua-periode'}.csv`
    link.click()
    URL.revokeObjectURL(url)
}
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

            <button
                type="button"
                @click="exportCsv"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
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
                <button
                    type="button"
                    @click="resetFilters"
                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                    <RotateCcw class="h-3.5 w-3.5" />
                    Reset
                </button>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <label class="space-y-1.5">
                    <span class="text-xs font-semibold text-slate-600">Periode bulan</span>
                    <div class="relative">
                        <CalendarDays class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            v-model="filters.month"
                            type="month"
                            class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </label>

                <label class="space-y-1.5">
                    <span class="text-xs font-semibold text-slate-600">Driver</span>
                    <div class="relative">
                        <Users class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <select
                            v-model="filters.driver"
                            class="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Semua driver</option>
                            <option v-for="driver in drivers" :key="driver" :value="driver">
                                {{ driver }}
                            </option>
                        </select>
                        <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </label>

                <label class="space-y-1.5">
                    <span class="text-xs font-semibold text-slate-600">Wilayah tujuan</span>
                    <div class="relative">
                        <MapPinned class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <select
                            v-model="filters.region"
                            class="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">Semua wilayah</option>
                            <option value="jatim">Dalam Provinsi Jatim</option>
                            <option value="outside">Luar Provinsi Jatim</option>
                        </select>
                        <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </label>

                <label class="space-y-1.5">
                    <span class="text-xs font-semibold text-slate-600">Status pengiriman</span>
                    <select
                        v-model="filters.status"
                        class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                            {{ status.label }}
                        </option>
                    </select>
                </label>

                <label class="space-y-1.5">
                    <span class="text-xs font-semibold text-slate-600">Cari pengiriman</span>
                    <div class="relative">
                        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            v-model="filters.search"
                            type="text"
                            placeholder="No. shipment, driver..."
                            class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
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
            <span class="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                Data simulasi — belum terhubung backend
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
                    <div
                        class="h-full rounded-full bg-emerald-500 transition-all"
                        :style="{ width: `${jatimPercent}%` }"
                    />
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
                    <div
                        class="h-full rounded-full bg-orange-500 transition-all"
                        :style="{ width: `${outsidePercent}%` }"
                    />
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

        <!-- REGIONAL ANALYSIS + COST BREAKDOWN -->
        <section class="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
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
                                <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                <span class="text-sm font-medium text-slate-700">Dalam Provinsi Jatim</span>
                            </div>
                            <span class="text-sm font-bold text-slate-800">
                                {{ jatimTrips }} trip
                            </span>
                        </div>
                        <div class="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                                class="h-full rounded-full bg-emerald-500 transition-all"
                                :style="{ width: `${jatimPercent}%` }"
                            />
                        </div>
                    </div>

                    <div>
                        <div class="mb-2 flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <span class="h-2.5 w-2.5 rounded-full bg-orange-500" />
                                <span class="text-sm font-medium text-slate-700">Luar Provinsi Jatim</span>
                            </div>
                            <span class="text-sm font-bold text-slate-800">
                                {{ outsideTrips }} trip
                            </span>
                        </div>
                        <div class="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                                class="h-full rounded-full bg-orange-500 transition-all"
                                :style="{ width: `${outsidePercent}%` }"
                            />
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

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <h2 class="font-bold text-[#003366]">Rincian komponen uang driver</h2>
                        <p class="mt-1 text-xs text-slate-500">
                            Akumulasi komponen untuk pengiriman yang sedang difilter
                        </p>
                    </div>
                    <button
                        type="button"
                        @click="showCostDetails = true"
                        class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        <Eye class="h-3.5 w-3.5" />
                        Detail
                    </button>
                </div>

                <div class="mt-5 divide-y divide-slate-100">
                    <div
                        v-for="component in costBreakdown"
                        :key="component.key"
                        class="flex items-center justify-between gap-4 py-3"
                    >
                        <div class="flex items-center gap-3">
                            <div class="rounded-lg bg-slate-100 p-2 text-slate-500">
                                <ReceiptText class="h-4 w-4" />
                            </div>
                            <span class="text-sm text-slate-600">{{ component.label }}</span>
                        </div>
                        <span class="text-sm font-semibold tabular-nums text-slate-800">
                            {{ money(component.total) }}
                        </span>
                    </div>
                </div>

                <div class="mt-3 flex items-center justify-between rounded-xl bg-blue-50 p-4">
                    <div>
                        <p class="text-xs font-medium text-blue-700">Total uang driver</p>
                        <p class="mt-1 text-xl font-bold text-[#003366]">{{ money(totalMoney) }}</p>
                    </div>
                    <Wallet class="h-6 w-6 text-[#0052cc]" />
                </div>
                <p class="mt-3 text-xs leading-5 text-slate-400">
                    Nilai komponen pada tampilan ini merupakan simulasi. Saat backend dibuat,
                    total komponen harus direkonsiliasi dengan total uang driver dari sumber data.
                </p>
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
                        <tr
                            v-for="row in driverSummary"
                            :key="row.driver"
                            class="transition hover:bg-slate-50/80"
                        >
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0052cc]">
                                        {{ row.driver.split(' ').map(word => word[0]).slice(0, 2).join('') }}
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
                                <span class="inline-flex min-w-9 justify-center rounded-lg bg-emerald-50 px-2.5 py-1.5 text-sm font-semibold text-emerald-700">
                                    {{ row.jatim }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-center">
                                <span class="inline-flex min-w-9 justify-center rounded-lg bg-orange-50 px-2.5 py-1.5 text-sm font-semibold text-orange-700">
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
                                <button
                                    type="button"
                                    @click="openDriver(row.driver)"
                                    class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#0052cc] transition hover:border-blue-200 hover:bg-blue-50"
                                >
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
                                {{ filteredShipments.filter(item => item.status === 'completed').length }}
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
                        <tr
                            v-for="item in filteredShipments"
                            :key="item.id"
                            class="transition hover:bg-slate-50/80"
                        >
                            <td class="px-5 py-4">
                                <p class="text-sm font-semibold text-slate-800">{{ item.number }}</p>
                                <p class="mt-1 text-xs text-slate-400">{{ item.date }}</p>
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
                                <span
                                    :class="item.province === 'Jawa Timur'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-orange-50 text-orange-700'"
                                    class="inline-flex rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                                >
                                    {{ item.province === 'Jawa Timur' ? 'Dalam Provinsi Jatim' : 'Luar Provinsi Jatim' }}
                                </span>
                            </td>
                            <td class="px-5 py-4">
                                <span :class="statusClass(item.status)" class="inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold">
                                    {{ statusLabel(item.status) }}
                                </span>
                            </td>
                            <td class="px-5 py-4 text-right text-sm font-semibold text-slate-800">
                                {{ money(item.driverTotal) }}
                            </td>
                            <td class="px-5 py-4 text-center">
                                <button
                                    type="button"
                                    @click="selectedDriver = item.driver; showCostDetails = true"
                                    class="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-[#0052cc]"
                                    title="Lihat komponen biaya"
                                >
                                    <Eye class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- COST DETAIL MODAL -->
        <div
            v-if="showCostDetails"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
            @click.self="showCostDetails = false"
        >
            <div class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div class="flex items-start justify-between border-b border-slate-100 p-5">
                    <div>
                        <h3 class="text-lg font-bold text-[#003366]">Rincian uang driver</h3>
                        <p class="mt-1 text-sm text-slate-500">
                            {{ selectedDriver || 'Seluruh driver' }} · {{ monthLabel }}
                        </p>
                    </div>
                    <button
                        type="button"
                        @click="showCostDetails = false"
                        class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <div class="p-5">
                    <div class="space-y-3">
                        <div
                            v-for="component in [
                                { key: 'driverRate', label: 'Tarif dasar driver' },
                                { key: 'meal', label: 'Uang makan' },
                                { key: 'accommodation', label: 'Akomodasi' },
                                { key: 'other', label: 'Biaya lainnya' },
                            ]"
                            :key="component.key"
                            class="flex items-center justify-between gap-4 py-2"
                        >
                            <span class="text-sm text-slate-600">{{ component.label }}</span>
                            <span class="text-sm font-semibold text-slate-800">
                                {{
                                    money(
                                        filteredShipments
                                            .filter(item => !selectedDriver || item.driver === selectedDriver)
                                            .reduce((sum, item) => sum + (item.costs[component.key] || 0), 0)
                                    )
                                }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-4 rounded-xl bg-blue-50 p-4">
                        <p class="text-xs font-medium text-blue-700">Total uang driver</p>
                        <p class="mt-1 text-2xl font-bold text-[#003366]">
                            {{
                                money(
                                    filteredShipments
                                        .filter(item => !selectedDriver || item.driver === selectedDriver)
                                        .reduce((sum, item) => sum + item.driverTotal, 0)
                                )
                            }}
                        </p>
                    </div>

                    <p class="mt-3 text-xs leading-5 text-slate-400">
                        Rincian ini merupakan data simulasi. Nantinya nilai mengikuti komponen biaya
                        yang benar-benar tersimpan pada modul Shipment MJI.
                    </p>

                    <button
                        type="button"
                        @click="showCostDetails = false"
                        class="mt-5 w-full rounded-xl bg-[#0052cc] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>