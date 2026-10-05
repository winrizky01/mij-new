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
            <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
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
                        <label
                            class="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            v-model="form.email"
                            type="email"
                            autocomplete="email"
                            placeholder="nama@mji.co.id"
                            :disabled="loading"
                            class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400"
                        />
                    </div>

                    <!-- Password -->
                    <div>
                        <label
                            class="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            v-model="form.password"
                            type="password"
                            autocomplete="current-password"
                            placeholder="••••••••"
                            :disabled="loading"
                            class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400"
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
import { authApi, getApiError } from '@/services/api'

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
        const response = await authApi.login(
            form.email,
            form.password
        )

        const user = response.user

        /*
        |--------------------------------------------------------------------------
        | ACCESS SYSTEM
        |--------------------------------------------------------------------------
        |
        | Untuk tahap awal:
        |
        | admin → bisa masuk Admin + ERP
        |
        | Nanti kalau role sudah lebih spesifik:
        | website_admin → Admin
        | erp → ERP
        |
        */

        const roles = user?.roles || []

        const access = []

        if (
            roles.includes('admin') ||
            roles.includes('website_admin')
        ) {
            access.push('admin')
        }

        if (
            roles.includes('admin') ||
            roles.includes('erp')
        ) {
            access.push('erp')
        }

        /*
        |--------------------------------------------------------------------------
        | Simpan user dengan informasi access
        |--------------------------------------------------------------------------
        |
        | authApi.login() sudah menyimpan token + user.
        | Kita update user agar router / SelectSystem
        | tetap mendapatkan informasi access.
        |
        */

        const storedUser = {
            ...user,
            access,
        }

        localStorage.setItem(
            'mji_user',
            JSON.stringify(storedUser)
        )

        /*
        |--------------------------------------------------------------------------
        | Redirect
        |--------------------------------------------------------------------------
        */

        if (access.length === 0) {
            error.value =
                'Akun Anda belum memiliki akses ke sistem.'

            return
        }

        if (access.length === 1) {
            if (access[0] === 'admin') {
                await router.push('/admin/dashboard')
            } else {
                await router.push('/erp/dashboard')
            }

            return
        }

        // Memiliki akses Admin + ERP
        await router.push('/select-system')

    } catch (err) {
        const apiError = getApiError(err)

        if (apiError.status === 422) {
            error.value =
                apiError.errors?.email?.[0] ||
                apiError.errors?.password?.[0] ||
                apiError.message
        } else if (apiError.status === 401) {
            error.value = 'Email atau password salah.'
        } else if (apiError.status === 403) {
            error.value =
                apiError.message ||
                'Akun Anda tidak memiliki akses.'
        } else {
            error.value =
                apiError.message ||
                'Terjadi kesalahan saat login.'
        }

    } finally {
        loading.value = false
    }
}
</script>
