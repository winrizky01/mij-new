<template>
    <Teleport to="body">
        <div
            v-if="modelValue"
            class="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4"
        >
            <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <!-- ICON -->
                <div
                    class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600"
                >
                    <Construction class="h-7 w-7" />
                </div>

                <!-- TITLE -->
                <h3 class="mt-5 text-center text-lg font-bold text-slate-800">
                    {{ title }}
                </h3>

                <!-- DESCRIPTION -->
                <p class="mt-2 text-center text-sm leading-6 text-slate-500">
                    {{ description }}
                </p>

                <!-- BUTTON -->
                <button
                    type="button"
                    @click="close"
                    class="mt-6 w-full rounded-xl bg-[#14a2d8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#118fbe]"
                >
                    Mengerti
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { Construction } from 'lucide-vue-next'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: 'Halaman dalam pengembangan',
    },
    description: {
        type: String,
        default: 'Halaman ini masih dalam tahap pengembangan.',
    },
})

const emit = defineEmits(['update:modelValue'])

function close() {
    emit('update:modelValue', false)
}
</script>