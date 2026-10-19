<script setup>
import { computed } from 'vue'
import { CalendarDays, Newspaper } from 'lucide-vue-next'

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
                {{ block.title || 'Artikel Terbaru' }}
            </h2>
            <p v-if="block.description" class="mt-2 text-sm text-slate-600">
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
                class="overflow-hidden rounded-xl border border-slate-200"
            >
                <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title || ''"
                    loading="lazy"
                    class="aspect-[16/9] w-full object-cover"
                />
                <div
                    v-else
                    class="flex aspect-[16/9] items-center justify-center bg-slate-100 text-slate-400"
                >
                    <Newspaper :size="30" />
                </div>

                <div class="p-4">
                    <p
                        v-if="item.published_at"
                        class="flex items-center gap-2 text-xs text-slate-400"
                    >
                        <CalendarDays :size="13" />
                        {{ item.published_at }}
                    </p>
                    <h3 class="mt-2 font-semibold leading-6 text-slate-900">
                        {{ item.title }}
                    </h3>
                    <p class="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                        {{ item.excerpt || item.description }}
                    </p>
                    <a
                        v-if="item.url"
                        :href="item.url"
                        class="mt-3 inline-block text-sm font-semibold text-[#14a2d8]"
                    >
                        Baca selengkapnya
                    </a>
                </div>
            </article>
        </div>

        <div
            v-else
            class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400"
        >
            Artikel akan tampil setelah sumber data dikonfigurasi.
        </div>
    </section>
</template>
