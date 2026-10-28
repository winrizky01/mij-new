<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminApi } from '@/services/api'

const loading = ref(false)
const errorMessage = ref('')
const startDate = ref(getDateOffset(29))
const endDate = ref(getToday())

const summary = ref({
    total_visits: 0,
    unique_visitors: 0,
    pages_count: 0,
    today_visits: 0,
})

const trend = ref([])
const pages = ref([])
const sources = ref([])
const devices = ref([])

function getToday() {
    return new Date().toLocaleDateString('en-CA')
}

function getDateOffset(days) {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toLocaleDateString('en-CA')
}

function numberFormat(value) {
    return new Intl.NumberFormat('id-ID').format(Number(value) || 0)
}

function formatDate(value) {
    if (!value) return '-'

    return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
    })
}

const maxVisits = computed(() => Math.max(
    1,
    ...trend.value.map((item) => Number(item.visits) || 0),
))

const totalTrendVisits = computed(() => trend.value.reduce(
    (total, item) => total + (Number(item.visits) || 0),
    0,
))

async function loadTraffic() {
    loading.value = true
    errorMessage.value = ''

    try {
        const response = await adminApi.website.traffics.dashboard({
            start_date  : startDate.value,
            end_date    : endDate.value,
        })

        const data = response?.data ?? response

        summary.value = {
            total_visits: Number(data.summary?.total_visits) || 0,
            unique_visitors: Number(data.summary?.unique_visitors) || 0,
            pages_count: Number(data.summary?.pages_count) || 0,
            today_visits: Number(data.summary?.today_visits) || 0,
        }

        trend.value = Array.isArray(data.trend) ? data.trend : []
        pages.value = Array.isArray(data.pages) ? data.pages : []
        sources.value = Array.isArray(data.sources) ? data.sources : []
        devices.value = Array.isArray(data.devices) ? data.devices : []
    } catch (error) {
        console.error('Gagal memuat website traffic:', error)

        errorMessage.value =
            error.response?.data?.message ||
            'Gagal memuat statistik traffic. Pastikan endpoint API sudah tersedia.'
    } finally {
        loading.value = false
    }
}

function resetPeriod() {
    startDate.value = getDateOffset(29)
    endDate.value = getToday()
    loadTraffic()
}

onMounted(loadTraffic)
</script>

<template>
    <div class="space-y-6 p-4 md:p-6">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <p class="text-sm font-medium text-sky-600">
                    ANALITIK WEBSITE
                </p>
                <h1 class="mt-1 text-2xl font-bold text-gray-900">
                    Website Traffic
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Pantau kunjungan dan perilaku pengunjung website MJI.
                </p>
            </div>

            <button
                type="button"
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                :disabled="loading"
                @click="loadTraffic"
            >
                {{ loading ? 'Memuat...' : '↻ Refresh data' }}
            </button>
        </div>

        <div class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:items-end">
            <div class="flex-1">
                <label class="mb-1 block text-sm font-medium text-gray-600">
                    Dari tanggal
                </label>
                <input
                    v-model="startDate"
                    type="date"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
            </div>

            <div class="flex-1">
                <label class="mb-1 block text-sm font-medium text-gray-600">
                    Sampai tanggal
                </label>
                <input
                    v-model="endDate"
                    type="date"
                    :min="startDate"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
            </div>

            <button
                type="button"
                class="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                :disabled="loading || !startDate || !endDate || startDate > endDate"
                @click="loadTraffic"
            >
                Terapkan
            </button>

            <button
                type="button"
                class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                :disabled="loading"
                @click="resetPeriod"
            >
                30 hari
            </button>
        </div>

        <div
            v-if="errorMessage"
            class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
            {{ errorMessage }}
        </div>

        <div
            v-if="loading"
            class="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500"
        >
            Memuat statistik traffic...
        </div>

        <template v-else>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div class="rounded-xl border border-gray-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">Total kunjungan</p>
                        <span class="rounded-lg bg-sky-50 p-2 text-sky-600">↗</span>
                    </div>
                    <p class="mt-4 text-3xl font-bold text-gray-900">
                        {{ numberFormat(summary.total_visits) }}
                    </p>
                    <p class="mt-1 text-xs text-gray-400">Sesuai periode dipilih</p>
                </div>

                <div class="rounded-xl border border-gray-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">Pengunjung unik</p>
                        <span class="rounded-lg bg-violet-50 p-2 text-violet-600">◎</span>
                    </div>
                    <p class="mt-4 text-3xl font-bold text-gray-900">
                        {{ numberFormat(summary.unique_visitors) }}
                    </p>
                    <p class="mt-1 text-xs text-gray-400">Berdasarkan data deduplikasi backend</p>
                </div>

                <div class="rounded-xl border border-gray-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">Halaman dikunjungi</p>
                        <span class="rounded-lg bg-amber-50 p-2 text-amber-600">▤</span>
                    </div>
                    <p class="mt-4 text-3xl font-bold text-gray-900">
                        {{ numberFormat(summary.pages_count) }}
                    </p>
                    <p class="mt-1 text-xs text-gray-400">Jumlah halaman unik</p>
                </div>

                <div class="rounded-xl border border-gray-200 bg-white p-5">
                    <div class="flex items-center justify-between">
                        <p class="text-sm text-gray-500">Kunjungan hari ini</p>
                        <span class="rounded-lg bg-emerald-50 p-2 text-emerald-600">◷</span>
                    </div>
                    <p class="mt-4 text-3xl font-bold text-gray-900">
                        {{ numberFormat(summary.today_visits) }}
                    </p>
                    <p class="mt-1 text-xs text-gray-400">Total hari ini</p>
                </div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-5">
                <div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <div>
                        <h2 class="font-semibold text-gray-900">Tren kunjungan</h2>
                        <p class="mt-1 text-sm text-gray-500">
                            Total pada grafik: {{ numberFormat(totalTrendVisits) }} kunjungan
                        </p>
                    </div>
                    <span class="text-xs text-gray-400">
                        {{ startDate }} — {{ endDate }}
                    </span>
                </div>

                <div
                    v-if="trend.length"
                    class="mt-6 flex h-56 items-end gap-2 overflow-x-auto border-b border-gray-100 pb-2"
                >
                    <div
                        v-for="(item, index) in trend"
                        :key="item.date || index"
                        class="flex h-full min-w-8 flex-1 flex-col items-center justify-end gap-2"
                        :title="`${item.date}: ${numberFormat(item.visits)} kunjungan`"
                    >
                        <span class="text-[10px] text-gray-500">
                            {{ numberFormat(item.visits) }}
                        </span>
                        <div
                            class="w-full max-w-10 rounded-t-md bg-sky-500 transition-all hover:bg-sky-700"
                            :style="{
                                height: `${Math.max(3, (Number(item.visits || 0) / maxVisits) * 75)}%`,
                            }"
                        />
                        <span class="whitespace-nowrap text-[10px] text-gray-400">
                            {{ formatDate(item.date) }}
                        </span>
                    </div>
                </div>

                <div v-else class="py-12 text-center text-sm text-gray-400">
                    Belum ada data kunjungan pada periode ini.
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div class="border-b border-gray-100 p-5">
                        <h2 class="font-semibold text-gray-900">Halaman populer</h2>
                        <p class="mt-1 text-sm text-gray-500">Halaman dengan kunjungan terbanyak</p>
                    </div>

                    <div v-if="pages.length" class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th class="px-5 py-3 font-medium">Halaman</th>
                                    <th class="px-5 py-3 text-right font-medium">Kunjungan</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="(item, index) in pages" :key="item.page || index">
                                    <td class="max-w-64 break-all px-5 py-4 text-gray-700">
                                        {{ item.page }}
                                    </td>
                                    <td class="px-5 py-4 text-right font-semibold text-gray-900">
                                        {{ numberFormat(item.visits) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p v-else class="p-8 text-center text-sm text-gray-400">
                        Belum ada data halaman.
                    </p>
                </div>

                <div class="space-y-4">
                    <div class="rounded-xl border border-gray-200 bg-white p-5">
                        <h2 class="font-semibold text-gray-900">Sumber trafik</h2>
                        <p class="mt-1 text-sm text-gray-500">Asal pengunjung website</p>

                        <div v-if="sources.length" class="mt-4 space-y-4">
                            <div v-for="(item, index) in sources" :key="item.source || index">
                                <div class="mb-1 flex justify-between gap-3 text-sm">
                                    <span class="break-all text-gray-600">
                                        {{ item.source || 'Tidak diketahui' }}
                                    </span>
                                    <span class="font-medium text-gray-900">
                                        {{ numberFormat(item.visits) }}
                                    </span>
                                </div>
                                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        class="h-full rounded-full bg-sky-500"
                                        :style="{
                                            width: `${Math.min(100, (Number(item.visits || 0) / Math.max(1, Number(sources[0]?.visits || 0))) * 100)}%`,
                                        }"
                                    />
                                </div>
                            </div>
                        </div>

                        <p v-else class="mt-5 text-sm text-gray-400">
                            Belum ada data sumber trafik.
                        </p>
                    </div>

                    <div class="rounded-xl border border-gray-200 bg-white p-5">
                        <h2 class="font-semibold text-gray-900">Perangkat pengunjung</h2>
                        <p class="mt-1 text-sm text-gray-500">Desktop, mobile, atau tablet</p>

                        <div v-if="devices.length" class="mt-4 space-y-3">
                            <div
                                v-for="(item, index) in devices"
                                :key="item.device || index"
                                class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                            >
                                <span class="text-sm capitalize text-gray-600">
                                    {{ item.device || 'Tidak diketahui' }}
                                </span>
                                <span class="font-semibold text-gray-900">
                                    {{ numberFormat(item.visits) }}
                                </span>
                            </div>
                        </div>

                        <p v-else class="mt-5 text-sm text-gray-400">
                            Belum ada data perangkat.
                        </p>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>