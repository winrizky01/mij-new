<template>
    <div class="min-h-screen bg-[#f5f7fa] text-gray-900">
        <!-- Mobile Overlay -->
        <div
            v-if="isSidebarOpen"
            class="fixed inset-0 z-40 bg-black/40 lg:hidden"
            @click="isSidebarOpen = false"
        />

        <div class="flex min-h-screen">
            <!-- Sidebar -->
            <AdminSidebar
                :is-open="isSidebarOpen"
                @close="isSidebarOpen = false"
            />

            <!-- Main Area -->
            <div class="flex min-w-0 flex-1 flex-col">
                <!-- Topbar -->
                <AdminTopbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

                <!-- Page -->
                <main class="flex-1 p-4 sm:p-6">
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
</script>