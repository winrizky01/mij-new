<script setup>
import { computed } from 'vue'
import { BriefcaseBusiness, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const items = computed(() =>
    Array.isArray(props.block.items) ? props.block.items : []
)
</script>

<template>
    <section>
        <div class="mb-6">
            <p
                v-if="block.eyebrow"
                class="mb-2 text-xs font-bold uppercase tracking-widest text-[#14a2d8]"
            >
                {{ block.eyebrow }}
            </p>
            <h2 class="text-2xl font-bold text-slate-900">
                {{ block.title || 'Layanan Kami' }}
            </h2>
            <p
                v-if="block.description"
                class="mt-2 text-sm leading-6 text-slate-600"
            >
                {{ block.description }}
            </p>
        </div>

        <div
            v-if="items.length"
            class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
            <article
                v-for="(item, index) in items"
                :key="item.id ?? index"
                class="rounded-xl border border-slate-200 p-5 transition hover:border-sky-200 hover:shadow-sm"
            >
                <BriefcaseBusiness :size="24" class="text-[#14a2d8]" />
                <h3 class="mt-4 font-semibold text-slate-900">
                    {{ item.title || item.name }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                    {{ item.description || item.excerpt }}
                </p>
                <a
                    v-if="item.url"
                    :href="item.url"
                    class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#14a2d8]"
                >
                    Selengkapnya <ArrowRight :size="15" />
                </a>
            </article>
        </div>

        <div
            v-else
            class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400"
        >
            Data layanan akan tampil setelah sumber data dikonfigurasi.
        </div>
    </section>
</template>
