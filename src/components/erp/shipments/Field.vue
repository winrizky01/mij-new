<template>
    <div>
        <label
            class="mb-1.5 block text-sm font-medium text-gray-700"
        >
            {{ label }}
        </label>

        <slot />
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