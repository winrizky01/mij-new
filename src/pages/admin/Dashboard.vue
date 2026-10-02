<template>
    <div class="space-y-6">

        <!-- Header -->
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                Dashboard Website
            </h1>

            <p class="mt-1 text-sm text-gray-500">
                Pantau aktivitas website dan layanan MJI.
            </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div
                v-for="stat in stats"
                :key="stat.title"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <div class="flex items-start justify-between">
                    <div>
                        <p class="text-sm text-gray-500">
                            {{ stat.title }}
                        </p>

                        <p class="mt-2 text-2xl font-bold text-gray-900">
                            {{ stat.value }}
                        </p>
                    </div>

                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                    >
                        {{ stat.icon }}
                    </div>
                </div>

                <p class="mt-4 text-xs text-green-600">
                    {{ stat.description }}
                </p>
            </div>

        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <!-- Inquiry -->
            <div
                class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-2"
            >
                <div class="flex items-center justify-between border-b border-gray-100 p-5">
                    <div>
                        <h2 class="font-semibold text-gray-900">
                            Pesan Terbaru
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Inquiry dari pengunjung website
                        </p>
                    </div>

                    <RouterLink
                        to="/admin/inquiries"
                        class="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Lihat semua
                    </RouterLink>
                </div>

                <div class="divide-y divide-gray-100">
                    <div
                        v-for="item in inquiries"
                        :key="item.id"
                        class="flex items-center justify-between gap-4 p-5"
                    >
                        <div class="min-w-0">
                            <p class="truncate font-medium text-gray-900">
                                {{ item.name }}
                            </p>

                            <p class="mt-1 truncate text-sm text-gray-500">
                                {{ item.message }}
                            </p>
                        </div>

                        <span
                            class="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                            :class="statusClass(item.status)"
                        >
                            {{ item.status }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Operational -->
            <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <h2 class="font-semibold text-gray-900">
                    Status Operasional
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Kondisi layanan saat ini
                </p>

                <div class="mt-6 space-y-4">

                    <div
                        v-for="service in services"
                        :key="service.name"
                        class="flex items-center justify-between"
                    >
                        <div class="flex items-center gap-3">
                            <span
                                class="h-2.5 w-2.5 rounded-full bg-green-500"
                            />

                            <span class="text-sm text-gray-700">
                                {{ service.name }}
                            </span>
                        </div>

                        <span class="text-xs font-medium text-green-600">
                            {{ service.status }}
                        </span>
                    </div>

                </div>
            </div>

        </div>

        <!-- Quick Actions -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <h2 class="font-semibold text-gray-900">
                Quick Actions
            </h2>

            <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <RouterLink
                    to="/admin/inquiries"
                    class="rounded-xl border border-gray-200 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50"
                >
                    <div class="text-xl">💬</div>
                    <p class="mt-2 text-sm font-medium">
                        Pesan
                    </p>
                </RouterLink>

                <RouterLink
                    to="/admin/services"
                    class="rounded-xl border border-gray-200 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50"
                >
                    <div class="text-xl">🧩</div>
                    <p class="mt-2 text-sm font-medium">
                        Layanan
                    </p>
                </RouterLink>

                <RouterLink
                    to="/admin/settings"
                    class="rounded-xl border border-gray-200 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50"
                >
                    <div class="text-xl">⚙️</div>
                    <p class="mt-2 text-sm font-medium">
                        Pengaturan
                    </p>
                </RouterLink>

                <RouterLink
                    to="/"
                    class="rounded-xl border border-gray-200 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50"
                >
                    <div class="text-xl">🌐</div>
                    <p class="mt-2 text-sm font-medium">
                        Website
                    </p>
                </RouterLink>

            </div>
        </div>

    </div>
</template>

<script setup>
const stats = [
    {
        title: 'Pesan Baru',
        value: '12',
        icon: '💬',
        description: '+4 hari ini',
    },
    {
        title: 'Layanan Aktif',
        value: '8',
        icon: '🧩',
        description: 'Semua layanan aktif',
    },
    {
        title: 'Prospek Bulan Ini',
        value: '24',
        icon: '📈',
        description: '+18% dari bulan lalu',
    },
    {
        title: 'Proyek Berjalan',
        value: '6',
        icon: '📁',
        description: '2 hampir selesai',
    },
]

const inquiries = [
    {
        id: 1,
        name: 'PT Maju Bersama',
        message: 'Kami membutuhkan jasa trucking...',
        status: 'Baru',
    },
    {
        id: 2,
        name: 'Budi Santoso',
        message: 'Ingin konsultasi pembuatan aplikasi...',
        status: 'Diproses',
    },
    {
        id: 3,
        name: 'CV Sejahtera',
        message: 'Mohon informasi digital marketing...',
        status: 'Baru',
    },
    {
        id: 4,
        name: 'Andi Wijaya',
        message: 'Pertanyaan mengenai Panggil Tukang...',
        status: 'Selesai',
    },
]

const services = [
    {
        name: 'Trucking',
        status: 'Aktif',
    },
    {
        name: 'Software House',
        status: 'Aktif',
    },
    {
        name: 'Panggil Tukang',
        status: 'Aktif',
    },
    {
        name: 'Digital Marketing',
        status: 'Aktif',
    },
]

function statusClass(status) {
    if (status === 'Baru') {
        return 'bg-blue-50 text-blue-600'
    }

    if (status === 'Diproses') {
        return 'bg-yellow-50 text-yellow-600'
    }

    return 'bg-green-50 text-green-600'
}
</script>