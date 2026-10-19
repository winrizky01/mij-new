<script setup>
import { computed } from 'vue'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const columnsClass = computed(() => ({
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
}[Math.min(4, Math.max(2, Number(props.block.columns) || 3))]))

const images = computed(() =>
    Array.isArray(props.block.images) ? props.block.images : []
)
</script>

<template>
    <div
        v-if="images.length"
        class="grid gap-4"
        :class="columnsClass"
    >
        <figure
            v-for="(image, index) in images"
            :key="image.id ?? index"
            class="overflow-hidden rounded-xl"
        >
            <img
                :src="image.url"
                :alt="image.alt || ''"
                loading="lazy"
                class="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-[1.02]"
            />
            <figcaption
                v-if="image.caption"
                class="pt-2 text-xs text-slate-500"
            >
                {{ image.caption }}
            </figcaption>
        </figure>
    </div>

    <div
        v-else
        class="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400"
    >
        Belum ada gambar di galeri
    </div>
</template>
