<template>
    <header
        class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6"
    >
        <!-- Left -->
        <div class="flex min-w-0 items-center gap-3">
            <!-- Mobile Menu -->
            <button
                type="button"
                class="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden"
                @click="$emit('toggle-sidebar')"
            >
                ☰
            </button>

            <!-- Title -->
            <div class="min-w-0">
                <p
                    class="truncate text-sm font-semibold text-gray-900 sm:text-base"
                >
                    Admin Panel
                </p>

                <p class="hidden truncate text-xs text-gray-400 sm:block">
                    Manunggal Jasa Investindo
                </p>
            </div>
        </div>

        <!-- Right -->
        <div class="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
            <!-- Notification -->
            <button
                type="button"
                class="relative grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
            >
                🔔

                <!-- Notification Badge -->
                <span
                    class="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white"
                >
                    4
                </span>
            </button>

            <!-- User -->
            <div
                class="grid h-9 w-9 place-items-center rounded-full bg-[#0052cc] text-xs font-bold text-white"
            >
                AD
            </div>
        </div>
    </header>
</template>

<script setup>
defineEmits(['toggle-sidebar'])
</script>