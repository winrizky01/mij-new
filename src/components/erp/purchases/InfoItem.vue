<template>
    <div>
        <p class="text-xs text-gray-400">
            {{ label }}
        </p>

        <p class="mt-1 text-sm font-semibold text-gray-800">
            {{ value }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    value: String,
})
</script>