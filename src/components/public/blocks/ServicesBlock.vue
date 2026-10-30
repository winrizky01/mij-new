<template>
  <section class="mx-auto max-w-7xl px-5">
    <div class="mx-auto max-w-7xl">

      <div>
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
          class="mt-4 leading-relaxed text-gray-600"
        >
          {{ description || content }}
        </p>

      </div>

      <div
        v-if="visibleItems.length"
        class="mx-auto mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        :class="gridClass"
      >
        <article
          v-for="(item, index) in visibleItems"
          :key="item.id ?? item.slug ?? index"
          class="group rounded-xl border border-gray-200 bg-gray-50 p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-[#0052cc] hover:bg-white hover:shadow-xl hover:shadow-blue-900/10"
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
            class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700"
          >
            <component
              v-if="resolveIcon(item.icon)"
              :is="resolveIcon(item.icon)"
              :size="46"
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

<script setup>
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  title       : { type: String, default: 'Layanan Kami' },
  eyebrow     : { type: String, default: '' },
  description : { type: String, default: '' },
  content     : { type: String, default: '' },
  items       : { type: Array, default: () => [] },
  limit       : { type: Number, default: 6 },
  columns     : { type: Number, default: 3 },
  showDescription : { type: Boolean, default: true },
  showIcon        : { type: Boolean, default: true },
  showLink        : { type: Boolean, default: true },
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
    truck: LucideIcons.Truck,
  }

  return icons[name?.toLowerCase()] ?? null
}

</script>
