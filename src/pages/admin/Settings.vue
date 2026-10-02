<template>
    <div class="space-y-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                Pengaturan
            </h1>

            <p class="mt-1 text-sm text-gray-500">
                Kelola informasi dan konfigurasi website MJI.
            </p>
        </div>

        <!-- Company -->
        <section
            class="rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="border-b border-gray-100 px-5 py-4">
                <h2 class="font-semibold text-gray-900">
                    Informasi Website
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Informasi utama yang digunakan pada website.
                </p>
            </div>

            <div class="grid gap-5 p-5 md:grid-cols-2">
                <div class="md:col-span-2">
                    <label class="text-sm font-medium text-gray-700">
                        Nama Perusahaan
                    </label>

                    <input
                        v-model="settings.companyName"
                        type="text"
                        class="mt-2 h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div class="md:col-span-2">
                    <label class="text-sm font-medium text-gray-700">
                        Deskripsi Singkat
                    </label>

                    <textarea
                        v-model="settings.description"
                        rows="4"
                        class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    ></textarea>
                </div>
            </div>
        </section>

        <!-- Contact -->
        <section
            class="rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="border-b border-gray-100 px-5 py-4">
                <h2 class="font-semibold text-gray-900">
                    Informasi Kontak
                </h2>

                <p class="mt-1 text-xs text-gray-500">
                    Informasi kontak yang ditampilkan kepada pengunjung.
                </p>
            </div>

            <div class="grid gap-5 p-5 md:grid-cols-2">
                <div>
                    <label class="text-sm font-medium text-gray-700">
                        Email
                    </label>

                    <input
                        v-model="settings.email"
                        type="email"
                        class="mt-2 h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-700">
                        Telepon
                    </label>

                    <input
                        v-model="settings.phone"
                        type="text"
                        class="mt-2 h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div class="md:col-span-2">
                    <label class="text-sm font-medium text-gray-700">
                        Alamat
                    </label>

                    <textarea
                        v-model="settings.address"
                        rows="3"
                        class="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    ></textarea>
                </div>
            </div>
        </section>

        <!-- Social -->
        <section
            class="rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="border-b border-gray-100 px-5 py-4">
                <h2 class="font-semibold text-gray-900">
                    Media Sosial
                </h2>
            </div>

            <div class="grid gap-5 p-5 md:grid-cols-2">
                <div>
                    <label class="text-sm font-medium text-gray-700">
                        Instagram
                    </label>

                    <input
                        v-model="settings.instagram"
                        type="text"
                        placeholder="@manunggaljasa"
                        class="mt-2 h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label class="text-sm font-medium text-gray-700">
                        Facebook
                    </label>

                    <input
                        v-model="settings.facebook"
                        type="text"
                        class="mt-2 h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>
        </section>

        <!-- Save -->
        <div class="flex justify-end">
            <button
                type="button"
                class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
                @click="saveSettings"
            >
                Simpan Pengaturan
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'

const settings = reactive({
    companyName: 'Manunggal Jasa Investindo',
    description:
        'Solusi bisnis terpadu untuk kebutuhan logistik, teknologi, dan layanan digital.',
    email: 'info@manunggal.com',
    phone: '0812-0000-0000',
    address: 'Surabaya, Jawa Timur, Indonesia',
    instagram: '@manunggaljasa',
    facebook: 'Manunggal Jasa Investindo',
})

function saveSettings() {
    console.log('Settings:', settings)
}
</script>