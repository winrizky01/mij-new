<script setup>
import { computed } from 'vue'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update'])

const headingTag = computed(() => {
    const level = Number(props.block.level) || 2
    return `h${Math.min(6, Math.max(1, level))}`
})

const headingClass = computed(() => ({
    1: 'text-3xl sm:text-5xl',
    2: 'text-2xl sm:text-4xl',
    3: 'text-xl sm:text-3xl',
    4: 'text-lg sm:text-2xl',
    5: 'text-base sm:text-xl',
    6: 'text-sm sm:text-lg',
}[Math.min(6, Math.max(1, Number(props.block.level) || 2))]))
</script>

<template>
    <component
        :is="headingTag"
        :class="[
            'font-bold leading-tight tracking-tight text-slate-900',
            headingClass,
        ]"
        :style="{ textAlign: block.alignment || 'left' }"
    >
        {{ block.title || 'Tulis judul di sini' }}
    </component>
</template>
