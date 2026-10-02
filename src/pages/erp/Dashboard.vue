<template>
    <div class="space-y-6">

        <!-- Header -->
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                Dashboard ERP
            </h1>

            <p class="mt-1 text-sm text-gray-500">
                Ringkasan operasional bisnis MJI.
            </p>
        </div>

        <!-- Financial Stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div
                v-for="stat in financialStats"
                :key="stat.title"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    {{ stat.title }}
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ stat.value }}
                </p>

                <div class="mt-4 flex items-center justify-between">
                    <span class="text-xs text-gray-500">
                        {{ stat.label }}
                    </span>

                    <span class="text-xs font-medium text-blue-600">
                        {{ stat.count }}
                    </span>
                </div>
            </div>

        </div>

        <!-- Operational -->
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <!-- Recent Transactions -->
            <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-2"
            >
                <div class="flex items-center justify-between border-b border-gray-100 p-5">
                    <div>
                        <h2 class="font-semibold text-gray-900">
                            Transaksi Terbaru
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Aktivitas transaksi terakhir
                        </p>
                    </div>

                    <button
                        class="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Lihat semua
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th class="px-5 py-3">
                                    No. Transaksi
                                </th>

                                <th class="px-5 py-3">
                                    Customer
                                </th>

                                <th class="px-5 py-3">
                                    Jenis
                                </th>

                                <th class="px-5 py-3">
                                    Nilai
                                </th>

                                <th class="px-5 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-gray-100">

                            <tr
                                v-for="transaction in transactions"
                                :key="transaction.number"
                            >
                                <td class="px-5 py-4 font-medium text-gray-900">
                                    {{ transaction.number }}
                                </td>

                                <td class="px-5 py-4 text-gray-600">
                                    {{ transaction.customer }}
                                </td>

                                <td class="px-5 py-4">
                                    {{ transaction.type }}
                                </td>

                                <td class="px-5 py-4 font-medium">
                                    {{ transaction.value }}
                                </td>

                                <td class="px-5 py-4">
                                    <span
                                        class="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                                    >
                                        {{ transaction.status }}
                                    </span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Stock -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="font-semibold text-gray-900">
                            Stok Menipis
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Perlu segera diperhatikan
                        </p>
                    </div>

                    <span class="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                        4 item
                    </span>
                </div>

                <div class="mt-6 space-y-4">

                    <div
                        v-for="item in lowStock"
                        :key="item.name"
                    >
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-700">
                                {{ item.name }}
                            </span>

                            <span class="text-sm font-bold text-red-600">
                                {{ item.stock }}
                            </span>
                        </div>

                        <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                                class="h-full rounded-full bg-red-400"
                                :style="{ width: `${item.percent}%` }"
                            />
                        </div>
                    </div>

                </div>
            </div>

        </div>

        <!-- Bottom -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

            <!-- Sales -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <h2 class="font-semibold text-gray-900">
                    Penjualan
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Bulan berjalan
                </p>

                <p class="mt-6 text-3xl font-bold text-gray-900">
                    Rp 25,4 Jt
                </p>

                <p class="mt-2 text-sm text-green-600">
                    +12,5% dari bulan lalu
                </p>
            </div>

            <!-- Receivables -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <h2 class="font-semibold text-gray-900">
                    Piutang
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Belum tertagih
                </p>

                <p class="mt-6 text-3xl font-bold text-gray-900">
                    Rp 12,5 Jt
                </p>

                <p class="mt-2 text-sm text-yellow-600">
                    8 invoice belum lunas
                </p>
            </div>

            <!-- Payables -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <h2 class="font-semibold text-gray-900">
                    Hutang
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Kewajiban supplier
                </p>

                <p class="mt-6 text-3xl font-bold text-gray-900">
                    Rp 8,4 Jt
                </p>

                <p class="mt-2 text-sm text-red-600">
                    5 invoice belum dibayar
                </p>
            </div>

        </div>

    </div>
</template>

<script setup>
const financialStats = [
    {
        title: 'Penjualan',
        value: 'Rp 25,4 Jt',
        label: 'Bulan ini',
        count: '32 transaksi',
    },
    {
        title: 'Pembelian',
        value: 'Rp 18,2 Jt',
        label: 'Bulan ini',
        count: '21 transaksi',
    },
    {
        title: 'Piutang',
        value: 'Rp 12,5 Jt',
        label: 'Belum tertagih',
        count: '8 invoice',
    },
    {
        title: 'Hutang',
        value: 'Rp 8,4 Jt',
        label: 'Belum dibayar',
        count: '5 invoice',
    },
]

const transactions = [
    {
        number: 'SO-000124',
        customer: 'PT Maju Bersama',
        type: 'Penjualan',
        value: 'Rp 4.500.000',
        status: 'Selesai',
    },
    {
        number: 'PO-000087',
        customer: 'CV Supplier Jaya',
        type: 'Pembelian',
        value: 'Rp 2.800.000',
        status: 'Diproses',
    },
    {
        number: 'SO-000123',
        customer: 'CV Sejahtera',
        type: 'Penjualan',
        value: 'Rp 7.200.000',
        status: 'Selesai',
    },
    {
        number: 'PO-000086',
        customer: 'PT Sumber Makmur',
        type: 'Pembelian',
        value: 'Rp 1.950.000',
        status: 'Selesai',
    },
]

const lowStock = [
    {
        name: 'Produk A',
        stock: '5 pcs',
        percent: 25,
    },
    {
        name: 'Produk B',
        stock: '2 pcs',
        percent: 15,
    },
    {
        name: 'Produk C',
        stock: '1 pcs',
        percent: 8,
    },
    {
        name: 'Produk D',
        stock: '3 pcs',
        percent: 20,
    },
]
</script>