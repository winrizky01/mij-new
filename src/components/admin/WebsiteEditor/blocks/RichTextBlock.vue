<script setup>
defineProps({
    block: { type: Object, default: () => ({}) },
})
</script>

<template>
    <div
        class="text-sm leading-7 text-slate-600 sm:text-base"
        :style="{ textAlign: block.alignment || 'left' }"
    >
        <h2
            v-if="block.title"
            class="mb-3 text-xl font-bold text-slate-900"
        >
            {{ block.title }}
        </h2>

        <p class="whitespace-pre-line">
            {{ block.content || block.description || 'Tulis konten di sini.' }}
        </p>
    </div>
</template>
