<template>
    <div class="min-h-screen bg-[#f5f7fa] text-gray-900">

        <!-- Mobile / Tablet Overlay -->
        <Transition name="fade">
            <div
                v-if="sidebarOpen"
                class="fixed inset-0 z-40 bg-black/40 lg:hidden"
                @click="sidebarOpen = false"
            ></div>
        </Transition>

        <div class="flex min-h-screen">

            <!-- =========================================
                 SIDEBAR
            ========================================== -->
            <aside
                class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0"
                :class="
                    sidebarOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                "
            >

                <!-- Logo -->
                <div
                    class="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-5"
                >
                    <div class="flex min-w-0 items-center gap-3">

                        <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003366] text-sm font-bold text-white"
                        >
                            M
                        </div>

                        <div class="min-w-0">
                            <div
                                class="truncate text-base font-bold text-[#003366]"
                            >
                                Manunggal Jasa
                            </div>

                            <div class="text-xs text-gray-500">
                                ERP System
                            </div>
                        </div>

                    </div>

                    <!-- Close Mobile -->
                    <button
                        type="button"
                        class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
                        @click="sidebarOpen = false"
                    >
                        ✕
                    </button>
                </div>


                <!-- Navigation -->
                <nav class="flex-1 overflow-y-auto p-3">

                    <!-- MAIN -->
                    <div class="mb-6">

                        <p class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Main
                        </p>

                        <RouterLink
                            to="/erp/dashboard"
                            class="erp-nav"
                            @click="closeSidebar"
                        >
                            <span class="erp-icon">
                                📊
                            </span>

                            <span>
                                Dashboard
                            </span>
                        </RouterLink>

                    </div>


                    <!-- MASTER DATA -->
                    <div class="mb-6">

                        <p class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Master Data
                        </p>

                        <div class="space-y-1">

                            <RouterLink
                                to="/erp/products"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    📦
                                </span>

                                <span>
                                    Produk / Barang
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/partners"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    🏢
                                </span>

                                <span>
                                    Partner
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/employees"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    👤
                                </span>

                                <span>
                                    Karyawan
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/trucks"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    🚛
                                </span>

                                <span>
                                    Truk
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/tariffs"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    💵
                                </span>

                                <span>
                                    Tarif
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/provinces"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    🗺️
                                </span>

                                <span>
                                    Provinsi
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/units"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    ⚙️
                                </span>

                                <span>
                                    Satuan
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/general"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    ⚙️
                                </span>

                                <span>
                                    General
                                </span>
                            </RouterLink>

                        </div>
                    </div>


                    <!-- TRANSAKSI -->
                    <div class="mb-6">

                        <p class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Transaksi
                        </p>

                        <div class="space-y-1">

                            <RouterLink
                                to="/erp/invoices"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    🧾
                                </span>

                                <span>
                                    Invoice
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/purchases"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    🛒
                                </span>

                                <span>
                                    Pembelian
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/shipments"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    🚚
                                </span>

                                <span>
                                    Pengiriman
                                </span>
                            </RouterLink>

                        </div>
                    </div>


                    <!-- INVENTORY -->
                    <div class="mb-6">

                        <p class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Inventory
                        </p>

                        <div class="space-y-1">

                            <RouterLink
                                to="/erp/stocks"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    📋
                                </span>

                                <span>
                                    Stok Barang
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/stock-issues"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    📝
                                </span>

                                <span>
                                    Pengeluaran Barang
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/stock-movements"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    🔄
                                </span>

                                <span>
                                    Mutasi Stok
                                </span>
                            </RouterLink>

                        </div>
                    </div>


                    <!-- KEUANGAN -->
                    <div class="mb-6">

                        <p class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Keuangan
                        </p>

                        <div class="space-y-1">

                            <RouterLink
                                to="/erp/cash-bank"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    💰
                                </span>

                                <span>
                                    Kas & Bank
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/receivables"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    📥
                                </span>

                                <span>
                                    Piutang
                                </span>
                            </RouterLink>


                            <RouterLink
                                to="/erp/payables"
                                class="erp-nav"
                                @click="closeSidebar"
                            >
                                <span class="erp-icon">
                                    📤
                                </span>

                                <span>
                                    Hutang
                                </span>
                            </RouterLink>

                        </div>
                    </div>

                </nav>


                <!-- Bottom User -->
                <div class="shrink-0 border-t border-gray-100 p-3">

                    <div
                        class="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >

                        <!-- Avatar -->
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#003366] text-xs font-semibold text-white"
                        >
                            {{ userInitials }}
                        </div>


                        <!-- User Info -->
                        <div class="min-w-0 flex-1">

                            <p
                                class="truncate text-sm font-semibold text-gray-800"
                            >
                                {{ userName }}
                            </p>

                            <p
                                class="truncate text-xs text-gray-500"
                            >
                                {{ userPosition }}
                            </p>

                        </div>


                        <!-- Logout -->
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-gray-700"
                            title="Logout"
                            @click="logout"
                        >
                            ⋮
                        </button>

                    </div>

                </div>

            </aside>


            <!-- =========================================
                 MAIN AREA
            ========================================== -->
            <div class="flex min-w-0 flex-1 flex-col">

                <!-- Topbar -->
                <header
                    class="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6"
                >

                    <!-- Left -->
                    <div class="flex min-w-0 items-center gap-3">

                        <!-- Hamburger -->
                        <button
                            type="button"
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden"
                            @click="sidebarOpen = true"
                        >
                            ☰
                        </button>

                        <div class="min-w-0">

                            <h2
                                class="truncate text-sm font-semibold text-gray-900 sm:text-base"
                            >
                                MJI ERP
                            </h2>

                            <p
                                class="hidden text-xs text-gray-500 sm:block"
                            >
                                Enterprise Resource Planning
                            </p>

                        </div>

                    </div>


                    <!-- Right -->
                    <div class="flex items-center gap-2 sm:gap-3">

                        <!-- Search -->
                        <button
                            type="button"
                            class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                            title="Pencarian"
                        >
                            🔍
                        </button>


                        <!-- Notification -->
                        <button
                            type="button"
                            class="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100"
                        >
                            🔔

                            <span
                                class="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"
                            ></span>
                        </button>


                        <!-- User -->
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full bg-[#003366] text-xs font-semibold text-white"
                            :title="userName"
                        >
                            {{ userInitials }}
                        </div>

                    </div>

                </header>


                <!-- Page -->
                <main
                    class="min-w-0 flex-1 p-3 sm:p-5 lg:p-6"
                >
                    <RouterView />
                </main>

            </div>

        </div>

    </div>
</template>


<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/api'

const router = useRouter()

const sidebarOpen = ref(false)

const user = ref(
    JSON.parse(
        localStorage.getItem('mji_user') || 'null'
    )
)


const userName = computed(() => {
    return (
        user.value?.employee?.name ||
        user.value?.name ||
        'User'
    )
})


const userPosition = computed(() => {
    return (
        user.value?.employee?.position ||
        'ERP User'
    )
})


const userInitials = computed(() => {
    const name = userName.value

    if (!name) {
        return 'U'
    }

    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase()
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase()
})


function closeSidebar() {
    sidebarOpen.value = false
}


async function logout() {
    try {
        await authApi.logout()
    } finally {
        user.value = null
        await router.push('/login')
    }
}
</script>


<style scoped>
.erp-nav {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    border-radius: 0.75rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    transition: all 0.2s ease;
}

.erp-nav:hover {
    background: #eff6ff;
    color: #2563eb;
}

.erp-nav.router-link-active {
    background: #eff6ff;
    color: #2563eb;
}

.erp-icon {
    display: flex;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    background: #f3f4f6;
    font-size: 0.95rem;
}

.erp-nav.router-link-active .erp-icon {
    background: #dbeafe;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>