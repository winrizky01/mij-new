<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import WebsiteBlockRenderer from '@/components/public/WebsiteBlockRenderer.vue'

const route = useRoute()

const page = ref(null)
const sections = ref([])
const loading = ref(true)
const error = ref('')

const slug = computed(() => {
    const routeSlug = route.params.slug

    // Homepage menggunakan slug "home".
    if (!routeSlug) return 'home'

    return Array.isArray(routeSlug)
        ? routeSlug.join('/')
        : String(routeSlug)
})

let requestId = 0

watch(
    slug,
    async (currentSlug) => {
        const currentRequest = ++requestId

        loading.value = true
        error.value = ''
        page.value = null
        sections.value = []

        try {
            const response = await api.get(
                `/public/website/pages/${encodeURIComponent(currentSlug)}`
            )

            if (currentRequest !== requestId) return

            const result = response.data?.data
            if (!result?.page) {
                throw new Error('Data halaman tidak ditemukan.')
            }

            page.value = result.page

            sections.value = Array.isArray(result.sections)
                ? result.sections
                    .filter((section) => section.is_active)
                    .sort((a, b) => a.sort_order - b.sort_order)
                : []
        } catch (err) {
            if (currentRequest !== requestId) return

            if (err.response?.status === 404) {
                error.value = 'Halaman tidak ditemukan.'
            } else {
                error.value = 'Halaman gagal dimuat. Silakan coba kembali.'
            }

            console.error('Gagal memuat halaman publik:', err)
        } finally {
            if (currentRequest === requestId) {
                loading.value = false
            }
        }
    },
    { immediate: true }
)
</script>

<template>
    <div>
        <div
            v-if="loading"
            class="px-6 py-20 text-center text-gray-500"
        >
            Memuat halaman...
        </div>

        <div
            v-else-if="error"
            class="px-6 py-20 text-center"
        >
            <h1 class="text-2xl font-semibold text-gray-900">
                {{ error }}
            </h1>
        </div>

        <main v-else-if="page">
            <WebsiteBlockRenderer :blocks="sections" />
        </main>
    </div>
</template>