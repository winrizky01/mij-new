<template>
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
            <div>
                <p class="text-sm text-slate-500">
                    {{ title }}
                </p>

                <p class="mt-2 text-xl font-bold text-slate-800">
                    {{ value }}
                </p>

                <p class="mt-1 text-xs text-slate-400">
                    {{ subtitle }}
                </p>
            </div>

            <div
                class="flex h-11 w-11 items-center justify-center rounded-xl"
                :class="iconClass"
            >
                <component
                    :is="icon"
                    class="h-5 w-5"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    icon: {
        type: [Object, Function],
        required: true,
    },
    iconClass: {
        type: String,
        default: 'bg-blue-50 text-blue-600',
    },
})
</script>