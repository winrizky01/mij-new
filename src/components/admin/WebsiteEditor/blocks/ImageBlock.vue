<script setup>
defineProps({
    block: { type: Object, default: () => ({}) },
})
</script>

<template>
    <figure class="w-full">
        <div
            v-if="!block.imageUrl"
            class="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400"
        >
            Gambar belum dipilih
        </div>

        <img
            v-else
            :src="block.imageUrl"
            :alt="block.alt || ''"
            :loading="block.loading || 'lazy'"
            class="h-auto w-full rounded-xl object-cover"
            :style="{
                maxHeight: block.maxHeight ? `${block.maxHeight}px` : undefined,
                objectFit: block.objectFit || 'cover',
            }"
        />

        <figcaption
            v-if="block.caption"
            class="mt-2 text-center text-xs text-slate-500"
        >
            {{ block.caption }}
        </figcaption>
    </figure>
</template>
