<script setup>
const props = defineProps({
    block: { type: Object, default: () => ({}) },
})
</script>

<template>
    <div
        v-if="block.variant !== 'divider'"
        aria-hidden="true"
        :style="{ height: `${Math.min(400, Math.max(0, Number(block.height) || 32))}px` }"
    />

    <hr
        v-else
        class="border-0 border-t border-slate-200"
        :style="{
            marginTop: `${Math.max(0, Number(block.marginTop) || 16)}px`,
            marginBottom: `${Math.max(0, Number(block.marginBottom) || 16)}px`,
        }"
    />
</template>
