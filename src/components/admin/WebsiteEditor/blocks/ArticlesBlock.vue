<script setup>
import { computed, ref, watch } from 'vue'
import { CalendarDays, Newspaper } from 'lucide-vue-next'
import api from '@/services/api'

const props = defineProps({
    block: {
        type: Object,
        default: () => ({}),
    },
})

const items = ref([])
const loading = ref(false)
const error = ref('')
let requestId = 0

const limit = computed(() => {
    const value = Number(
        props.block.limit ??
        props.block.itemCount ??
        props.block.itemsPerPage ??
        6
    )

    return Math.max(1, Math.min(24, value || 6))
})

const selectedArticleIds = computed(() =>
    Array.isArray(props.block.article_ids)
        ? props.block.article_ids.map(String)
        : []
)

function normalizeArticles(response) {
    const body = response?.data ?? response
    const collection = body?.data ?? body

    if (Array.isArray(collection)) return collection
    if (Array.isArray(collection?.data)) return collection.data
    if (Array.isArray(collection?.articles)) return collection.articles

    return []
}

function normalizeArticle(item) {
    const slug = item.slug || item.permalink || ''

    return {
        id: item.id,
        title: item.title || item.name || 'Tanpa judul',
        image:
            item.image_url ||
            item.thumbnail_url ||
            item.image?.url ||
            item.featured_image_url ||
            (typeof item.image === 'string' ? item.image : '') ||
            '',
        published_at: item.published_at || item.publishedAt || '',
        excerpt: item.excerpt || item.summary || item.description || '',
        url:
            item.url ||
            item.public_url ||
            (slug ? `/artikel/${slug}` : ''),
    }
}

async function fetchArticles() {
    const currentRequest = ++requestId

    loading.value = true
    error.value = ''

    try {
        const params = {
            per_page: 100,
        }

        if (props.block.category_id) {
            params.category_id = props.block.category_id
        }

        const response = await api.get('/website/articles', { params })

        if (currentRequest !== requestId) return

        const allArticles = normalizeArticles(response.data)
        console.log('Block preview:', props.block)
        console.log('ID artikel terpilih:', selectedArticleIds.value)
        console.log('Artikel dari API:', allArticles.map(article => ({
            id: article.id,
            title: article.title,
        })))
        // Jika ada pilihan dari editor, prioritaskan artikel pilihan.
        if (selectedArticleIds.value.length > 0) {
            const articlesById = new Map(
                allArticles.map(article => [String(article.id), article])
            )

            items.value = selectedArticleIds.value
                .map(id => articlesById.get(id))
                .filter(Boolean)
                .map(normalizeArticle)
                .slice(0, limit.value)
        } else {
            // Jika belum ada pilihan, tampilkan artikel terbaru.
            items.value = allArticles
                .map(normalizeArticle)
                .slice(0, limit.value)
        }
    } catch (e) {
        if (currentRequest !== requestId) return

        items.value = []
        error.value =
            e.response?.data?.message ||
            'Artikel gagal dimuat. Periksa koneksi API.'
    } finally {
        if (currentRequest === requestId) {
            loading.value = false
        }
    }
}

watch(
    () => [
        props.block.id,
        props.block.limit,
        props.block.itemCount,
        props.block.itemsPerPage,
        props.block.category_id,
        JSON.stringify(props.block.article_ids ?? []),
    ],
    fetchArticles,
    { immediate: true },
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
        
        <div v-if="loading" class="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            Memuat artikel...
        </div>

        <div
            v-else-if="error"
            class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700"
        >
            {{ error }}
        </div>

        <div
            v-else-if="!items.length"
            class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400"
        >
            Belum ada artikel yang dapat ditampilkan.
        </div>

        <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article
                v-for="(item, index) in items"
                :key="item.id ?? index"
                class="overflow-hidden rounded-xl border border-slate-200"
            >
                <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title"
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
                        {{ item.excerpt }}
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

    </section>
</template>
