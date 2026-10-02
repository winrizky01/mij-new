<template>
    <div class="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">

        <div class="w-full max-w-3xl">

            <!-- Header -->
            <div class="mb-8 text-center">

                <div
                    class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003366] text-xl font-bold text-white"
                >
                    M
                </div>

                <h1 class="mt-5 text-2xl font-bold text-gray-900">
                    Selamat datang, {{ user?.name }}
                </h1>

                <p class="mt-2 text-sm text-gray-500">
                    Pilih sistem yang ingin Anda gunakan.
                </p>

            </div>

            <!-- Systems -->
            <div class="grid gap-5 md:grid-cols-2">

                <!-- Admin -->
                <button
                    v-if="hasAccess('admin')"
                    @click="enterSystem('admin')"
                    class="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                    <div
                        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl"
                    >
                        🌐
                    </div>

                    <h2 class="mt-5 text-xl font-bold text-gray-900">
                        Website Admin
                    </h2>

                    <p class="mt-2 text-sm leading-6 text-gray-500">
                        Kelola website, layanan, pesan masuk,
                        konten dan pengaturan website MJI.
                    </p>

                    <div class="mt-6 text-sm font-semibold text-blue-600">
                        Masuk ke Website Admin →
                    </div>
                </button>

                <!-- ERP -->
                <button
                    v-if="hasAccess('erp')"
                    @click="enterSystem('erp')"
                    class="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                    <div
                        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl"
                    >
                        📊
                    </div>

                    <h2 class="mt-5 text-xl font-bold text-gray-900">
                        MJI ERP
                    </h2>

                    <p class="mt-2 text-sm leading-6 text-gray-500">
                        Kelola penjualan, pembelian, stok,
                        keuangan dan operasional bisnis.
                    </p>

                    <div class="mt-6 text-sm font-semibold text-green-600">
                        Masuk ke ERP →
                    </div>
                </button>

            </div>

            <!-- Logout -->
            <div class="mt-8 text-center">
                <button
                    @click="logout"
                    class="text-sm text-gray-500 hover:text-red-600"
                >
                    Keluar dari akun
                </button>
            </div>

        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = computed(() => {
    const data = localStorage.getItem('mji_user')

    return data ? JSON.parse(data) : null
})

function hasAccess(system) {
    return user.value?.access?.includes(system)
}

function enterSystem(system) {
    if (!hasAccess(system)) {
        return
    }

    if (system === 'admin') {
        router.push('/admin/dashboard')
        return
    }

    if (system === 'erp') {
        router.push('/erp/dashboard')
    }
}

function logout() {
    localStorage.removeItem('mji_user')

    router.push('/login')
}
</script>