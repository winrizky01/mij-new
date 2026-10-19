<script setup>
defineProps({
    block: { type: Object, default: () => ({}) },
})
</script>

<template>
    <section
        class="w-full px-4 py-8 sm:px-6 lg:px-8"
        :style="{
            backgroundColor: block.backgroundColor || undefined,
            textAlign: block.alignment || 'left',
            paddingTop: `${block.paddingTop ?? 32}px`,
            paddingBottom: `${block.paddingBottom ?? 32}px`,
        }"
    >
        <div
            class="mx-auto w-full"
            :style="{ maxWidth: block.maxWidth || '1200px' }"
        >
            <slot />
        </div>
    </section>
</template>
