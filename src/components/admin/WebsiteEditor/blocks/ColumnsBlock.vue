<script setup>
import { computed } from 'vue'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const columnCount = computed(() =>
    Math.min(4, Math.max(1, Number(props.block.columns) || 2))
)

const gridClass = computed(() => ({
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}[columnCount.value]))
</script>

<template>
    <div
        class="grid gap-6"
        :class="gridClass"
        :style="{ gap: `${block.gap ?? 24}px` }"
    >
        <slot />
    </div>
</template>
