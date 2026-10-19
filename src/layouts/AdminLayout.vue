
<template>
    <div class="min-h-screen bg-[#f5f7fa] text-gray-900">
        <!-- Mobile Overlay -->
        <div
            v-if="isSidebarOpen"
            class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
            @click="isSidebarOpen = false"
        />

        <div class="flex min-h-screen">
            <!-- Sidebar -->
            <AdminSidebar
                :is-open="isSidebarOpen"
                :user="authUser"
                :unread-messages="unreadMessages"
                @close="isSidebarOpen = false"
            />

            <!-- Main Area -->
            <div class="flex min-w-0 flex-1 flex-col">
                <!-- Topbar -->
                <AdminTopbar
                    @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                />

                <!-- Page -->
                <main class="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
                    <RouterView />
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

import AdminSidebar from '../components/admin/AdminSidebar.vue'
import AdminTopbar from '../components/admin/AdminTopbar.vue'

const isSidebarOpen = ref(false)

// Sementara: ganti dengan data user login dari aplikasi kamu.
const authUser = ref({
    name: 'Admin MJI',
    email: 'admin@manunggal.com',
})

// Sementara: hubungkan ke API pesan masuk jika sudah tersedia.
const unreadMessages = ref(0)
</script>
