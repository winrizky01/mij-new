
<script setup>
import { computed } from 'vue'

const props = defineProps({
    section: {
        type: Object,
        required: true,
    },
})

const settings = computed(() => {
    const value = props.section.settings

    if (!value) return {}
    if (typeof value === 'object' && !Array.isArray(value)) return value

    try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? parsed
            : {}
    } catch {
        return {}
    }
})

const type = computed(() => props.section.type || 'custom')

const imageUrl = computed(() => {
    const path = props.section.image

    if (!path) return ''
    if (/^https?:\/\//i.test(path)) return path

    const base = String(
        import.meta.env.VITE_API_BASE_URL
        || import.meta.env.VITE_API_URL
        || ''
    ).replace(/\/api\/?$/, '').replace(/\/$/, '')

    return `${base}${path.startsWith('/') ? '' : '/'}${path}`
})

const stats = computed(() => {
    const value = settings.value.stats
    return Array.isArray(value) ? value : []
})

const services = computed(() => {
    const value = settings.value.items
    return Array.isArray(value) ? value : []
})

const contactItems = computed(() => [
    { label: 'Alamat', value: settings.value.address },
    { label: 'Telepon', value: settings.value.phone },
    { label: 'Email', value: settings.value.email },
    { label: 'WhatsApp', value: settings.value.whatsapp },
].filter(item => item.value))
</script>

<template>
    <section
        v-if="section.is_active"
        :id="section.type"
        class="website-section"
        :data-section-type="type"
    >
        <!-- HERO: satu record = satu banner -->
        <div
            v-if="type === 'hero'"
            class="relative isolate flex min-h-[420px] items-center overflow-hidden bg-slate-900"
        >
            <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="section.title || 'Banner'"
                class="absolute inset-0 -z-20 h-full w-full object-cover"
            />

            <div class="absolute inset-0 -z-10 bg-slate-950/60" />

            <div class="mx-auto w-full max-w-7xl px-6 py-20 text-white md:px-10">
                <p v-if="section.subtitle" class="mb-3 font-semibold">
                    {{ section.subtitle }}
                </p>

                <h1 class="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                    {{ section.title }}
                </h1>

                <p
                    v-if="section.content"
                    class="mt-5 max-w-2xl text-base leading-7 text-white/85 md:text-lg"
                >
                    {{ section.content }}
                </p>

                <a
                    v-if="section.button_text && section.button_url"
                    :href="section.button_url"
                    class="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    {{ section.button_text }}
                </a>
            </div>
        </div>

        <!-- ABOUT -->
        <div
            v-else-if="type === 'about'"
            class="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24"
        >
            <div>
                <p v-if="section.subtitle" class="font-semibold text-blue-600">
                    {{ section.subtitle }}
                </p>

                <h2 class="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                    {{ section.title }}
                </h2>

                <p class="mt-5 whitespace-pre-line leading-8 text-slate-600">
                    {{ section.content }}
                </p>

                <div v-if="settings.vision" class="mt-6">
                    <h3 class="font-semibold text-slate-900">Visi</h3>
                    <p class="mt-2 whitespace-pre-line text-slate-600">
                        {{ settings.vision }}
                    </p>
                </div>

                <div v-if="settings.mission" class="mt-5">
                    <h3 class="font-semibold text-slate-900">Misi</h3>
                    <p class="mt-2 whitespace-pre-line text-slate-600">
                        {{ settings.mission }}
                    </p>
                </div>
            </div>

            <div class="space-y-5">
                <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    :alt="section.title || 'Tentang kami'"
                    class="w-full rounded-2xl object-cover"
                />

                <div v-if="stats.length" class="grid grid-cols-2 gap-4">
                    <div
                        v-for="(stat, index) in stats"
                        :key="`${stat.label}-${index}`"
                        class="rounded-xl border border-slate-200 p-4"
                    >
                        <div class="text-2xl font-bold text-blue-600">
                            {{ stat.value }}
                        </div>
                        <div class="mt-1 text-sm text-slate-500">
                            {{ stat.label }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CONTACT -->
        <div
            v-else-if="type === 'contact'"
            class="bg-slate-50 px-6 py-16 md:px-10 md:py-24"
        >
            <div class="mx-auto max-w-5xl">
                <div class="text-center">
                    <p v-if="section.subtitle" class="font-semibold text-blue-600">
                        {{ section.subtitle }}
                    </p>
                    <h2 class="mt-2 text-3xl font-bold text-slate-900">
                        {{ section.title || 'Hubungi Kami' }}
                    </h2>
                    <p v-if="section.content" class="mx-auto mt-4 max-w-2xl text-slate-600">
                        {{ section.content }}
                    </p>
                </div>

                <div class="mt-10 grid gap-4 sm:grid-cols-2">
                    <div
                        v-for="item in contactItems"
                        :key="item.label"
                        class="rounded-xl border border-slate-200 bg-white p-5"
                    >
                        <div class="text-sm font-semibold text-slate-500">
                            {{ item.label }}
                        </div>
                        <div class="mt-2 break-words font-medium text-slate-900">
                            {{ item.value }}
                        </div>
                    </div>
                </div>

                <div class="mt-8 flex flex-wrap justify-center gap-3">
                    <a
                        v-if="settings.whatsapp"
                        :href="`https://wa.me/${String(settings.whatsapp).replace(/\D/g, '')}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
                    >
                        Hubungi via WhatsApp
                    </a>
                    <a
                        v-if="settings.instagram"
                        :href="settings.instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                    >
                        Instagram
                    </a>
                    <a
                        v-if="settings.facebook"
                        :href="settings.facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700"
                    >
                        Facebook
                    </a>
                </div>
            </div>
        </div>

        <!-- GENERIC: layanan, features, testimonials, FAQ, dan tipe baru -->
        <div v-else class="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
            <div class="mx-auto max-w-3xl text-center">
                <p v-if="section.subtitle" class="font-semibold text-blue-600">
                    {{ section.subtitle }}
                </p>

                <h2 class="mt-2 text-3xl font-bold text-slate-900">
                    {{ section.title }}
                </h2>

                <p v-if="section.content" class="mt-4 whitespace-pre-line leading-7 text-slate-600">
                    {{ section.content }}
                </p>
            </div>

            <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="section.title || type"
                class="mx-auto mt-8 max-h-[440px] w-full rounded-2xl object-cover"
            />

            <div
                v-if="services.length"
                class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
                <article
                    v-for="(item, index) in services"
                    :key="item.id || `${item.title}-${index}`"
                    class="rounded-2xl border border-slate-200 bg-white p-6"
                >
                    <img
                        v-if="item.image"
                        :src="item.image"
                        :alt="item.title || ''"
                        class="mb-4 h-44 w-full rounded-xl object-cover"
                    />
                    <h3 class="text-lg font-semibold text-slate-900">
                        {{ item.title }}
                    </h3>
                    <p class="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {{ item.description || item.content }}
                    </p>
                </article>
            </div>

            <div v-if="section.button_text && section.button_url" class="mt-8 text-center">
                <a
                    :href="section.button_url"
                    class="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    {{ section.button_text }}
                </a>
            </div>
        </div>
    </section>
</template>
