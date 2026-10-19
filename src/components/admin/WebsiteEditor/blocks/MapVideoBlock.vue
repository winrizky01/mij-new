<script setup>
import { computed } from 'vue'
import { MapPin, Video } from 'lucide-vue-next'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const isVideo = computed(() => props.block.mediaType === 'video')
</script>

<template>
    <section>
        <h2
            v-if="block.title"
            class="mb-4 text-2xl font-bold text-slate-900"
        >
            {{ block.title }}
        </h2>

        <p
            v-if="block.description"
            class="mb-4 text-sm leading-6 text-slate-600"
        >
            {{ block.description }}
        </p>

        <div
            class="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400"
        >
            <Video v-if="isVideo" :size="32" />
            <MapPin v-else :size="32" />

            <p class="mt-3 text-sm font-medium">
                {{ isVideo ? 'Area video' : 'Area peta lokasi' }}
            </p>

            <p class="mt-1 text-xs">
                {{ block.url ? 'Sumber sudah diisi; embed akan diaktifkan setelah validasi sumber.' : 'Sumber belum dikonfigurasi.' }}
            </p>
        </div>
    </section>
</template>
