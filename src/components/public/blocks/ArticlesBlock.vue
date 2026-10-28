<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Artikel Terbaru' },
  eyebrow: { type: String, default: '' },
  description: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  limit: { type: Number, default: 3 },
  source: { type: String, default: 'latest_articles' },
})

const visibleArticles = computed(() =>
  props.items.slice(0, Math.max(1, props.limit))
)

function articleUrl(article) {
  if (article.url) return article.url
  if (article.slug) return `/artikel/${encodeURIComponent(article.slug)}`
  return '/artikel'
}
</script>

<template>
  <section class="bg-gray-50 px-6 py-16 sm:px-10 lg:px-20">
    <div class="mx-auto max-w-7xl">
      <header class="mb-10 text-center">
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
          class="mx-auto mt-4 max-w-2xl text-gray-600"
        >
          {{ description }}
        </p>
      </header>

      <div
        v-if="visibleArticles.length"
        class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="(article, index) in visibleArticles"
          :key="article.id ?? article.slug ?? index"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg"
        >
          <a
            :href="articleUrl(article)"
            class="block"
          >
            <img
              v-if="article.imageUrl || article.image_url || article.thumbnail"
              :src="article.imageUrl || article.image_url || article.thumbnail"
              :alt="article.title || 'Artikel'"
              class="aspect-video w-full object-cover"
              loading="lazy"
            />

            <div class="p-6">
              <p
                v-if="article.published_at"
                class="mb-3 text-sm text-gray-500"
              >
                {{ article.published_at }}
              </p>

              <h3 class="text-lg font-semibold text-gray-900">
                {{ article.title }}
              </h3>

              <p
                v-if="article.excerpt || article.description"
                class="mt-3 line-clamp-3 leading-relaxed text-gray-600"
              >
                {{ article.excerpt || article.description }}
              </p>

              <span class="mt-5 inline-flex font-semibold text-sky-700">
                Baca selengkapnya →
              </span>
            </div>
          </a>
        </article>
      </div>

      <p
        v-else
        class="text-center text-gray-500"
      >
        Belum ada artikel untuk ditampilkan.
      </p>
    </div>
  </section>
</template>
