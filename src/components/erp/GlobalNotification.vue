
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { ShieldAlert, X } from 'lucide-vue-next'

const notification = ref(null)
let timeoutId = null

function showForbidden(event) {
    notification.value = {
        title: 'Akses Ditolak',
        message:
            event.detail?.message ||
            'Kamu tidak memiliki izin untuk melakukan tindakan ini.',
    }

    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
        notification.value = null
    }, 5000)
}

function closeNotification() {
    notification.value = null
    clearTimeout(timeoutId)
}

onMounted(() => {
    window.addEventListener('mji:forbidden', showForbidden)
})

onUnmounted(() => {
    window.removeEventListener('mji:forbidden', showForbidden)
    clearTimeout(timeoutId)
})
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="translate-y-2 opacity-0"
        >
            <div
                v-if="notification"
                class="fixed right-5 top-5 z-[9999] w-[calc(100%-2.5rem)] max-w-md rounded-xl border border-red-200 bg-white p-4 shadow-xl"
                role="alert"
                aria-live="assertive"
            >
                <div class="flex items-start gap-3">
                    <div class="rounded-lg bg-red-50 p-2 text-red-600">
                        <ShieldAlert class="h-5 w-5" />
                    </div>

                    <div class="min-w-0 flex-1">
                        <h3 class="text-sm font-semibold text-slate-900">
                            {{ notification.title }}
                        </h3>

                        <p class="mt-1 text-sm leading-5 text-slate-600">
                            {{ notification.message }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Tutup notifikasi"
                        @click="closeNotification"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
