<template>
    <div class="space-y-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Pesan / Kontak
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola pesan dan inquiry dari pengunjung website.
                </p>
            </div>

            <div
                class="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
            >
                {{ filteredInquiries.length }} pesan
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <div
                v-for="stat in stats"
                :key="stat.label"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">
                            {{ stat.label }}
                        </p>

                        <p class="mt-2 text-2xl font-bold text-gray-900">
                            {{ stat.value }}
                        </p>
                    </div>

                    <div
                        class="grid h-10 w-10 place-items-center rounded-xl"
                        :class="stat.iconClass"
                    >
                        {{ stat.icon }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
        >
            <div
                class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
            >
                <!-- Search -->
                <div class="relative w-full lg:max-w-md">
                    <span
                        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                        🔍
                    </span>

                    <input
                        v-model="search"
                        type="text"
                        placeholder="Cari nama, email, atau pesan..."
                        class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <!-- Status -->
                <select
                    v-model="selectedStatus"
                    class="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-auto"
                >
                    <option value="all">
                        Semua Status
                    </option>

                    <option value="Baru">
                        Baru
                    </option>

                    <option value="Diproses">
                        Diproses
                    </option>

                    <option value="Selesai">
                        Selesai
                    </option>
                </select>
            </div>
        </div>

        <!-- Desktop Table -->
        <div
            class="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block"
        >
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-left">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Kontak
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Layanan
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Pesan
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Tanggal
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="item in filteredInquiries"
                            :key="item.id"
                            class="transition hover:bg-gray-50"
                        >
                            <!-- Contact -->
                            <td class="px-5 py-4">
                                <p class="font-medium text-gray-900">
                                    {{ item.name }}
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    {{ item.email }}
                                </p>

                                <p class="mt-1 text-xs text-gray-400">
                                    {{ item.phone }}
                                </p>
                            </td>

                            <!-- Service -->
                            <td class="px-5 py-4">
                                <span
                                    class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                                >
                                    {{ item.service }}
                                </span>
                            </td>

                            <!-- Message -->
                            <td class="max-w-xs px-5 py-4">
                                <p
                                    class="truncate text-sm text-gray-600"
                                    :title="item.message"
                                >
                                    {{ item.message }}
                                </p>
                            </td>

                            <!-- Status -->
                            <td class="px-5 py-4">
                                <span
                                    class="rounded-full px-3 py-1 text-xs font-medium"
                                    :class="statusClass(item.status)"
                                >
                                    {{ item.status }}
                                </span>
                            </td>

                            <!-- Date -->
                            <td class="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                                {{ item.date }}
                            </td>

                            <!-- Action -->
                            <td class="px-5 py-4 text-right">
                                <button
                                    type="button"
                                    class="rounded-lg px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                    @click="openInquiry(item)"
                                >
                                    Detail
                                </button>
                            </td>
                        </tr>

                        <tr v-if="filteredInquiries.length === 0">
                            <td
                                colspan="6"
                                class="px-5 py-12 text-center text-sm text-gray-500"
                            >
                                Tidak ada inquiry yang ditemukan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Mobile Cards -->
        <div class="space-y-3 md:hidden">
            <div
                v-for="item in filteredInquiries"
                :key="item.id"
                class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <p class="font-semibold text-gray-900">
                            {{ item.name }}
                        </p>

                        <p class="mt-1 truncate text-xs text-gray-500">
                            {{ item.email }}
                        </p>
                    </div>

                    <span
                        class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                        :class="statusClass(item.status)"
                    >
                        {{ item.status }}
                    </span>
                </div>

                <div class="mt-4">
                    <span
                        class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                    >
                        {{ item.service }}
                    </span>
                </div>

                <p class="mt-3 line-clamp-2 text-sm text-gray-600">
                    {{ item.message }}
                </p>

                <div
                    class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3"
                >
                    <span class="text-xs text-gray-400">
                        {{ item.date }}
                    </span>

                    <button
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                        @click="openInquiry(item)"
                    >
                        Lihat Detail →
                    </button>
                </div>
            </div>

            <div
                v-if="filteredInquiries.length === 0"
                class="rounded-2xl border border-gray-100 bg-white px-5 py-12 text-center text-sm text-gray-500"
            >
                Tidak ada inquiry yang ditemukan.
            </div>
        </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
        <div
            v-if="selectedInquiry"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            @click.self="closeInquiry"
        >
            <div
                class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >
                <!-- Modal Header -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-5 py-4"
                >
                    <div>
                        <h2 class="font-semibold text-gray-900">
                            Detail Inquiry
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ selectedInquiry.date }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"
                        @click="closeInquiry"
                    >
                        ✕
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="space-y-5 p-5">
                    <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Nama
                        </p>

                        <p class="mt-1 text-sm font-medium text-gray-900">
                            {{ selectedInquiry.name }}
                        </p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Email
                            </p>

                            <p class="mt-1 break-all text-sm text-gray-700">
                                {{ selectedInquiry.email }}
                            </p>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Telepon
                            </p>

                            <p class="mt-1 text-sm text-gray-700">
                                {{ selectedInquiry.phone }}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Layanan
                        </p>

                        <span
                            class="mt-2 inline-block rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                        >
                            {{ selectedInquiry.service }}
                        </span>
                    </div>

                    <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Pesan
                        </p>

                        <div
                            class="mt-2 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700"
                        >
                            {{ selectedInquiry.message }}
                        </div>
                    </div>

                    <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Status
                        </p>

                        <span
                            class="mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
                            :class="statusClass(selectedInquiry.status)"
                        >
                            {{ selectedInquiry.status }}
                        </span>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div
                    class="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end"
                >
                    <button
                        type="button"
                        class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        @click="closeInquiry"
                    >
                        Tutup
                    </button>

                    <button
                        v-if="selectedInquiry.status === 'Baru'"
                        type="button"
                        class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0047b3]"
                        @click="markAsProcessed"
                    >
                        Tandai Diproses
                    </button>

                    <button
                        v-else-if="selectedInquiry.status === 'Diproses'"
                        type="button"
                        class="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                        @click="markAsCompleted"
                    >
                        Tandai Selesai
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'

const search = ref('')
const selectedStatus = ref('all')
const selectedInquiry = ref(null)

const inquiries = ref([
    {
        id: 1,
        name: 'PT Maju Bersama',
        email: 'info@majubersama.co.id',
        phone: '0812-3456-7890',
        service: 'Trucking',
        message:
            'Kami membutuhkan jasa trucking untuk pengiriman barang dari Surabaya ke Jakarta.',
        status: 'Baru',
        date: '02 Okt 2026, 09:15',
    },
    {
        id: 2,
        name: 'Budi Santoso',
        email: 'budi@email.com',
        phone: '0813-2222-3333',
        service: 'Software House',
        message:
            'Ingin konsultasi mengenai pembuatan aplikasi internal untuk perusahaan.',
        status: 'Diproses',
        date: '01 Okt 2026, 15:30',
    },
    {
        id: 3,
        name: 'CV Sejahtera',
        email: 'contact@sejahtera.co.id',
        phone: '0821-4444-5555',
        service: 'Digital Marketing',
        message:
            'Mohon informasi mengenai paket digital marketing untuk bisnis kami.',
        status: 'Baru',
        date: '01 Okt 2026, 11:20',
    },
    {
        id: 4,
        name: 'Andi Wijaya',
        email: 'andi@email.com',
        phone: '0856-7777-8888',
        service: 'Panggil Tukang',
        message:
            'Pertanyaan mengenai layanan dan area coverage Panggil Tukang.',
        status: 'Selesai',
        date: '30 Sep 2026, 16:45',
    },
    {
        id: 5,
        name: 'PT Nusantara Logistik',
        email: 'procurement@nusantara.co.id',
        phone: '0811-8888-9999',
        service: 'Trucking',
        message:
            'Mohon penawaran untuk kebutuhan trucking rutin bulanan.',
        status: 'Diproses',
        date: '30 Sep 2026, 10:10',
    },
])

const filteredInquiries = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return inquiries.value.filter((item) => {
        const matchesSearch =
            !keyword ||
            item.name.toLowerCase().includes(keyword) ||
            item.email.toLowerCase().includes(keyword) ||
            item.message.toLowerCase().includes(keyword)

        const matchesStatus =
            selectedStatus.value === 'all' ||
            item.status === selectedStatus.value

        return matchesSearch && matchesStatus
    })
})

const stats = computed(() => [
    {
        label: 'Total Pesan',
        value: inquiries.value.length,
        icon: '📥',
        iconClass: 'bg-blue-50 text-blue-600',
    },
    {
        label: 'Pesan Baru',
        value: inquiries.value.filter((item) => item.status === 'Baru').length,
        icon: '💬',
        iconClass: 'bg-yellow-50 text-yellow-600',
    },
    {
        label: 'Diproses',
        value: inquiries.value.filter(
            (item) => item.status === 'Diproses',
        ).length,
        icon: '🔄',
        iconClass: 'bg-purple-50 text-purple-600',
    },
    {
        label: 'Selesai',
        value: inquiries.value.filter(
            (item) => item.status === 'Selesai',
        ).length,
        icon: '✓',
        iconClass: 'bg-green-50 text-green-600',
    },
])

function statusClass(status) {
    if (status === 'Baru') {
        return 'bg-blue-50 text-blue-700'
    }

    if (status === 'Diproses') {
        return 'bg-yellow-50 text-yellow-700'
    }

    return 'bg-green-50 text-green-700'
}

function openInquiry(item) {
    selectedInquiry.value = item
}

function closeInquiry() {
    selectedInquiry.value = null
}

function markAsProcessed() {
    if (!selectedInquiry.value) {
        return
    }

    selectedInquiry.value.status = 'Diproses'
}

function markAsCompleted() {
    if (!selectedInquiry.value) {
        return
    }

    selectedInquiry.value.status = 'Selesai'
}
</script>