<template>
    <div class="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
        <div class="w-full max-w-md">

            <!-- Logo -->
            <div class="mb-8 text-center">
                <div
                    class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003366] text-xl font-bold text-white"
                >
                    M
                </div>

                <h1 class="mt-4 text-2xl font-bold text-gray-900">
                    Manunggal Jasa Investindo
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Admin & ERP System
                </p>
            </div>

            <!-- Login Card -->
            <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

                <div class="mb-6">
                    <h2 class="text-xl font-semibold text-gray-900">
                        Masuk
                    </h2>

                    <p class="mt-1 text-sm text-gray-500">
                        Gunakan akun Anda untuk melanjutkan.
                    </p>
                </div>

                <form
                    class="space-y-5"
                    @submit.prevent="login"
                >

                    <!-- Email -->
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            v-model="form.email"
                            type="email"
                            placeholder="admin@mji.co.id"
                            class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <input
                            v-model="form.password"
                            type="password"
                            placeholder="••••••••"
                            class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <!-- Error -->
                    <div
                        v-if="error"
                        class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                        {{ error }}
                    </div>

                    <!-- Button -->
                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full rounded-xl bg-[#003366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00264d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {{ loading ? 'Memproses...' : 'Masuk' }}
                    </button>

                </form>

                <!-- Demo -->
                <div class="mt-6 rounded-xl bg-gray-50 p-4">
                    <p class="text-xs font-medium text-gray-500">
                        DEMO LOGIN
                    </p>

                    <p class="mt-2 text-xs text-gray-500">
                        Email:
                        <span class="font-medium text-gray-700">
                            admin@mji.co.id
                        </span>
                    </p>

                    <p class="mt-1 text-xs text-gray-500">
                        Password:
                        <span class="font-medium text-gray-700">
                            password
                        </span>
                    </p>
                </div>

            </div>

            <p class="mt-6 text-center text-xs text-gray-400">
                © {{ new Date().getFullYear() }} Manunggal Jasa Investindo
            </p>

        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const error = ref('')

const form = reactive({
    email: '',
    password: '',
})

async function login() {
    error.value = ''

    if (!form.email || !form.password) {
        error.value = 'Email dan password wajib diisi.'
        return
    }

    loading.value = true

    try {
        // ==========================================
        // MOCK LOGIN
        // Nanti diganti API Laravel
        // ==========================================

        if (
            form.email !== 'admin@mji.co.id' ||
            form.password !== 'password'
        ) {
            error.value = 'Email atau password salah.'
            return
        }

        const user = {
            id: 1,
            name: 'Administrator',
            email: form.email,

            // User ini punya akses ke dua sistem
            access: [
                'admin',
                'erp',
            ],
        }

        localStorage.setItem(
            'mji_user',
            JSON.stringify(user)
        )

        // Kalau hanya punya satu akses
        if (user.access.length === 1) {
            if (user.access[0] === 'admin') {
                router.push('/admin/dashboard')
            } else {
                router.push('/erp/dashboard')
            }

            return
        }

        // Kalau punya lebih dari satu akses
        router.push('/select-system')

    } finally {
        loading.value = false
    }
}
</script>