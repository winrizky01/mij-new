<template>
    <div>
        <h3 class="text-base font-bold text-[#003366]">
            {{ title }}
        </h3>

        <p class="mt-1 text-xs text-gray-500">
            {{ description }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: '',
    },

    description: {
        type: String,
        default: '',
    },
})
</script>