<template>
    <div class="flex items-center justify-between gap-4">
        <span
            class="text-sm"
            :class="
                strong
                    ? 'font-semibold text-gray-800'
                    : 'text-gray-600'
            "
        >
            {{ label }}
        </span>

        <span
            class="text-sm"
            :class="
                strong
                    ? 'font-bold text-gray-900'
                    : 'font-medium text-gray-700'
            "
        >
            {{ formattedValue }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        default: '',
    },

    value: {
        type: Number,
        default: 0,
    },

    strong: {
        type: Boolean,
        default: false,
    },
})

const formattedValue = computed(() => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(props.value || 0)
})
</script>