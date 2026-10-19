<script setup>
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const openIndex = ref(0)

const items = computed(() =>
    Array.isArray(props.block.items) ? props.block.items : []
)
</script>

<template>
    <section>
        <h2 class="mb-6 text-2xl font-bold text-slate-900">
            {{ block.title || 'Pertanyaan yang Sering Diajukan' }}
        </h2>

        <div v-if="items.length" class="divide-y divide-slate-200">
            <article
                v-for="(item, index) in items"
                :key="item.id ?? index"
                class="py-4"
            >
                <button
                    type="button"
                    class="flex w-full items-center justify-between gap-4 text-left"
                    :aria-expanded="openIndex === index"
                    @click="openIndex = openIndex === index ? -1 : index"
                >
                    <span class="text-sm font-semibold text-slate-800">
                        {{ item.question }}
                    </span>
                    <ChevronDown
                        :size="17"
                        class="shrink-0 text-slate-400 transition"
                        :class="{ 'rotate-180': openIndex === index }"
                    />
                </button>

                <p
                    v-if="openIndex === index"
                    class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600"
                >
                    {{ item.answer }}
                </p>
            </article>
        </div>

        <p v-else class="text-sm text-slate-400">
            Pertanyaan FAQ belum ditambahkan.
        </p>
    </section>
</template>
