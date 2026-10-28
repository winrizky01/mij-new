<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
    ArrowRight,
    BriefcaseBusiness,
    Truck,
    Code,
    ChartNoAxesCombined,
    Smartphone,
    Globe,
    Building2,
    Monitor,
    Database,
    Package,
    ShieldCheck,
    Headset,
    Lightbulb,
    Hammer,
    HardHat,
    Palette,
    Megaphone,
    ShoppingCart,
    Wallet,
    Handshake,
    Users,
    Wrench,
} from 'lucide-vue-next'
import { adminApi } from '@/services/api'

const props = defineProps({
    block: {
        type: Object,
        default: () => ({}),
    },
})

const services = ref([])
const loading = ref(false)
const loadError = ref('')

const iconMap = {
    BriefcaseBusiness,
    Truck,
    Code,
    ChartNoAxesCombined,
    Smartphone,
    Globe,
    Building2,
    Monitor,
    Database,
    Package,
    ShieldCheck,
    Headset,
    Lightbulb,
    Hammer,
    HardHat,
    Palette,
    Megaphone,
    ShoppingCart,
    Wallet,
    Handshake,
    Users,
    Wrench,
}

const visibleServices = computed(() => {
    let result = [...services.value]

    // Opsional: batasi jumlah kartu dari konfigurasi blok.
    const limit = Number(props.block.limit || 6)

    if (Number.isInteger(limit) && limit > 0) {
        result = result.slice(0, limit)
    }

    return result
})

function getIconComponent(name) {
    return iconMap[name] || BriefcaseBusiness
}

function normalizeResponse(response) {
    if (Array.isArray(response)) return response
    if (Array.isArray(response?.data)) return response.data
    if (Array.isArray(response?.data?.data)) return response.data.data
    return []
}

async function fetchServices() {
    loading.value = true
    loadError.value = ''

    try {
        const response = await adminApi.website.services.list({
            per_page: 100,
        })

        services.value = normalizeResponse(response)
            .filter(service => service.is_active === true ||
                service.is_active === 1 ||
                service.is_active === '1')
            .sort((a, b) =>
                Number(a.sort_order || 0) -
                Number(b.sort_order || 0)
            )
    } catch (error) {
        console.error('Gagal memuat layanan website:', error)
        loadError.value = 'Layanan belum dapat dimuat.'
        services.value = []
    } finally {
        loading.value = false
    }
}

function serviceUrl(service) {
    return service.url || `/layanan/${service.slug}`
}

onMounted(fetchServices)

// Muat ulang jika konfigurasi blok meminta data terbaru.
watch(
    () => props.block.refreshKey,
    fetchServices
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
            v-if="loading"
            class="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500"
        >
            Memuat layanan...
        </div>

        <div
            v-else-if="loadError"
            class="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-800"
        >
            {{ loadError }}
        </div>

        <div
            v-else-if="visibleServices.length"
            class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
            <article
                v-for="service in visibleServices"
                :key="service.id"
                class="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
            >
                <div
                    class="grid size-12 place-items-center rounded-xl bg-sky-50 text-[#14a2d8]"
                >
                    <component
                        :is="getIconComponent(service.icon)"
                        :size="25"
                        :stroke-width="1.8"
                    />
                </div>

                <h3 class="mt-4 font-semibold text-slate-900">
                    {{ service.name }}
                </h3>

                <p class="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {{
                        service.short_description ||
                        service.description ||
                        'Informasi layanan tersedia melalui tim kami.'
                    }}
                </p>

                <a
                    :href="serviceUrl(service)"
                    class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#14a2d8] hover:text-sky-700"
                >
                    Selengkapnya
                    <ArrowRight :size="15" />
                </a>
            </article>
        </div>

        <div
            v-else
            class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400"
        >
            Belum ada layanan aktif untuk ditampilkan.
        </div>
    </section>
</template>