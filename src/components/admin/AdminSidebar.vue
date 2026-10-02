<template>
    <aside
        class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#001a4d] text-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0"
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
        <!-- Logo -->
        <div class="flex h-16 shrink-0 items-center border-b border-white/10 px-5">
            <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0052cc] text-lg font-bold">
                M
            </div>

            <div class="ml-3 min-w-0">
                <h1 class="truncate text-sm font-bold">
                    Manunggal
                </h1>

                <p class="truncate text-xs text-blue-200">
                    Admin Panel
                </p>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-3 py-5">
            <!-- MAIN -->
            <p class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                Main
            </p>

            <RouterLink to="/admin/dashboard"
                class="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                :class="linkClass('/admin/dashboard')" @click="closeMobile">
                <span class="w-5 text-center">📊</span>
                <span>Dashboard</span>
            </RouterLink>

            <!-- WEBSITE -->
            <p class="mb-3 mt-6 px-3 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                Website
            </p>

            <RouterLink to="/admin/inquiries"
                class="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                :class="linkClass('/admin/inquiries')" @click="closeMobile">
                <span class="w-5 text-center">📥</span>

                <span class="flex-1 text-left">
                    Pesan / Kontak
                </span>

                <span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                    4
                </span>
            </RouterLink>

            <RouterLink to="/admin/services"
                class="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                :class="linkClass('/admin/services')" @click="closeMobile">
                <span class="w-5 text-center">🛠️</span>
                <span>Layanan</span>
            </RouterLink>

            <RouterLink to="/admin/website"
                class="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                :class="linkClass('/admin/website')" @click="closeMobile">
                <span class="w-5 text-center">🌐</span>
                <span>Halaman Website</span>
            </RouterLink>

            <RouterLink to="/admin/articles"
                class="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                :class="linkClass('/admin/articles')" @click="closeMobile">
                <span class="w-5 text-center">📝</span>
                <span>Artikel</span>
            </RouterLink>

            <RouterLink to="/admin/media"
                class="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                :class="linkClass('/admin/media')" @click="closeMobile">
                <span class="w-5 text-center">🖼️</span>
                <span>Media</span>
            </RouterLink>

            <!-- MANAGEMENT -->
            <p class="mb-3 mt-6 px-3 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                Management
            </p>

            <RouterLink to="/admin/users"
                class="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                :class="linkClass('/admin/users')" @click="closeMobile">
                <span class="w-5 text-center">👥</span>
                <span>Pengguna</span>
            </RouterLink>

            <!-- SYSTEM -->
            <p class="mb-3 mt-6 px-3 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                System
            </p>

            <RouterLink to="/admin/settings"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                :class="linkClass('/admin/settings')" @click="closeMobile">
                <span class="w-5 text-center">⚙️</span>
                <span>Pengaturan</span>
            </RouterLink>
        </nav>

        <!-- Admin -->
        <div class="shrink-0 border-t border-white/10 p-3">
            <div class="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0052cc] text-xs font-bold">
                    AD
                </div>

                <div class="min-w-0">
                    <p class="truncate text-xs font-semibold">
                        Admin PT. MJI
                    </p>

                    <p class="truncate text-[10px] text-blue-200">
                        admin@manunggal.com
                    </p>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close'])

const route = useRoute()

function closeMobile() {
    emit('close')
}

function linkClass(path) {
    const active = route.path === path

    return active
        ? 'bg-[#0052cc] text-white shadow-sm'
        : 'text-blue-100 hover:bg-white/10 hover:text-white'
}
</script>