<template>
    <div>
        <p class="text-xs font-medium text-gray-400">
            {{ label }}
        </p>

        <p class="mt-1 break-words text-sm font-medium text-gray-700">
            {{ value || '-' }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },

    value: {
        type: [String, Number],
        default: '',
    },
})
</script>