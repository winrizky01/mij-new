<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const items = computed(() =>
    Array.isArray(props.block.items) ? props.block.items : []
)

const activeIndex = ref(0)

watch(items, () => {
    activeIndex.value = 0
})
</script>

<template>
    <section>
        <h2
            v-if="block.title"
            class="mb-5 text-2xl font-bold text-slate-900"
        >
            {{ block.title }}
        </h2>

        <template v-if="items.length">
            <div
                role="tablist"
                class="flex gap-1 overflow-x-auto border-b border-slate-200"
            >
                <button
                    v-for="(item, index) in items"
                    :key="item.id ?? index"
                    type="button"
                    role="tab"
                    :aria-selected="activeIndex === index"
                    :class="[
                        'shrink-0 border-b-2 px-4 py-3 text-sm transition',
                        activeIndex === index
                            ? 'border-[#14a2d8] font-semibold text-[#14a2d8]'
                            : 'border-transparent text-slate-500 hover:text-slate-800',
                    ]"
                    @click="activeIndex = index"
                >
                    {{ item.label || item.title || `Tab ${index + 1}` }}
                </button>
            </div>

            <div
                role="tabpanel"
                class="py-5 text-sm leading-7 text-slate-600"
            >
                {{ items[activeIndex]?.content || 'Belum ada konten.' }}
            </div>
        </template>

        <p v-else class="text-sm text-slate-400">
            Tab belum dikonfigurasi.
        </p>
    </section>
</template>
