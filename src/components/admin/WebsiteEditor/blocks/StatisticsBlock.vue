<script setup>
import { computed } from 'vue'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const items = computed(() =>
    Array.isArray(props.block.items) ? props.block.items : []
)
</script>

<template>
    <section>
        <h2
            v-if="block.title"
            class="mb-6 text-center text-2xl font-bold text-slate-900"
        >
            {{ block.title }}
        </h2>

        <div
            v-if="items.length"
            class="grid grid-cols-2 gap-5 md:grid-cols-4"
        >
            <div
                v-for="(item, index) in items"
                :key="item.id ?? index"
                class="rounded-xl bg-slate-50 p-5 text-center"
            >
                <p class="text-3xl font-bold text-[#14a2d8]">
                    {{ item.value ?? '—' }}
                </p>
                <p class="mt-2 text-sm text-slate-600">
                    {{ item.label || item.title }}
                </p>
            </div>
        </div>

        <p v-else class="text-center text-sm text-slate-400">
            Statistik belum dikonfigurasi.
        </p>
    </section>
</template>
