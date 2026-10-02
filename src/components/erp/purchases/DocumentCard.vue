<template>
    <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
        <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {{ label }}
        </p>

        <p class="mt-1 truncate text-xs font-semibold text-gray-800">
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