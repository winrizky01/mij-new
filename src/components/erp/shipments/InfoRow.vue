<template>
    <div class="flex items-start justify-between gap-4">
        <span class="text-gray-500">
            {{ label }}
        </span>

        <span class="text-right font-medium text-gray-800">
            <slot />
        </span>
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        default: '',
    },
})
</script>