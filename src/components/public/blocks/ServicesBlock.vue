<script setup>
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  title   : { type: String, default: 'Layanan Kami' },
  eyebrow : { type: String, default: '' },
  description: { type: String, default: '' },
  items   : { type: Array, default: () => [] },
  limit   : { type: Number, default: 6 },
  columns : { type: Number, default: 3 },
  showDescription: { type: Boolean, default: true },
  showIcon: { type: Boolean, default: true },
  showLink: { type: Boolean, default: true },
})

const gridClass = computed(() => ({
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}[Math.min(4, Math.max(1, props.columns))] || 'md:grid-cols-3'))

const visibleItems = computed(() =>
  props.items.slice(0, Math.max(1, props.limit))
)

function resolveIcon(name) {
  const icons = {
    rocket: LucideIcons.Rocket,
    monitor: LucideIcons.Monitor,
    smartphone: LucideIcons.Smartphone,
  }

  return icons[name?.toLowerCase()] ?? null
}

</script>

<template>
  <section class="bg-white px-6 py-16 sm:px-10 lg:px-20">
    <div class="mx-auto max-w-7xl">
      <div class="mx-auto mb-10 max-w-3xl text-center">
        <p
          v-if="eyebrow"
          class="mb-2 text-sm font-semibold uppercase tracking-widest text-sky-600"
        >
          {{ eyebrow }}
        </p>

        <h2 class="text-3xl font-bold text-gray-900">
          {{ title }}
        </h2>

        <p
          v-if="description"
          class="mt-4 leading-relaxed text-gray-600"
        >
          {{ description }}
        </p>
      </div>

      <div
        v-if="visibleItems.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2"
        :class="gridClass"
      >
        <article
          v-for="(item, index) in visibleItems"
          :key="item.id ?? item.slug ?? index"
          class="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <img
            v-if="item.imageUrl || item.image_url"
            :src="item.imageUrl || item.image_url"
            :alt="item.title || item.name || 'Layanan'"
            class="mb-5 aspect-video w-full rounded-xl object-cover"
            loading="lazy"
          />

          <div
            v-else-if="showIcon && item.icon"
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700"
          >
            <component
              v-if="resolveIcon(item.icon)"
              :is="resolveIcon(item.icon)"
              :size="24"
              :stroke-width="1.8"
            />

            <span v-else class="text-xs text-gray-500">
              {{ item.icon }}
            </span>
          </div>

          <h3 class="text-lg font-semibold text-gray-900">
            {{ item.title || item.name }}
          </h3>

          <p
            v-if="showDescription && (item.description || item.excerpt)"
            class="mt-3 leading-relaxed text-gray-600"
          >
            {{ item.description || item.excerpt }}
          </p>

          <a
            v-if="showLink && (item.url || item.link)"
            :href="item.url || item.link"
            class="mt-5 inline-flex font-semibold text-sky-700 hover:text-sky-900"
          >
            Selengkapnya →
          </a>
        </article>
      </div>

      <p
        v-else
        class="text-center text-gray-500"
      >
        Belum ada layanan untuk ditampilkan.
      </p>
    </div>
  </section>
</template>
