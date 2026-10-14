
<script setup>
import { useToast } from '@/composables/useToast'
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from 'lucide-vue-next'

const { toast, dismiss } = useToast()

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
}

const styles = {
    success: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    error: 'border-red-200 text-red-700 bg-red-50',
    warning: 'border-amber-200 text-amber-700 bg-amber-50',
    info: 'border-sky-200 text-sky-700 bg-sky-50',
}
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="translate-y-2 opacity-0"
        >
            <div
                v-if="toast.show"
                class="fixed right-5 top-5 z-[10000] w-[calc(100%-2.5rem)] max-w-sm"
                role="status"
                aria-live="polite"
            >
                <div
                    class="flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg"
                    :class="styles[toast.type]"
                >
                    <component
                        :is="icons[toast.type]"
                        class="mt-0.5 h-5 w-5 shrink-0"
                    />

                    <div class="min-w-0 flex-1">
                        <p class="text-sm font-semibold">
                            {{ toast.title }}
                        </p>

                        <p class="mt-1 break-words text-sm text-slate-600">
                            {{ toast.message }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="rounded-md p-1 text-slate-400 hover:bg-black/5"
                        aria-label="Tutup notifikasi"
                        @click="dismiss"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
