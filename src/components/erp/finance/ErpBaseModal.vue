<template>
    <Teleport to="body">
        <div
            class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4"
            @click.self="$emit('close')"
        >
            <div
                class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- HEADER -->
                <div
                    class="flex items-center justify-between border-b border-slate-200 px-6 py-4"
                >
                    <h3 class="font-semibold text-slate-800">
                        {{ title }}
                    </h3>

                    <button
                        type="button"
                        @click="$emit('close')"
                        class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        ✕
                    </button>
                </div>

                <!-- BODY -->
                <div class="max-h-[70vh] overflow-y-auto p-6">
                    <slot />
                </div>

                <!-- FOOTER -->
                <div
                    v-if="$slots.footer"
                    class="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4"
                >
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
})

defineEmits(['close'])
</script>