<template>
    <!-- About -->
    <section id="about" class="bg-gray-50">
        <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
            <div>
                <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
                    {{ about.title || 'Tentang Kami' }}
                </h2>

                <div class="mt-5 h-1 w-14 rounded-full bg-[#0052cc]"></div>

                <p class="mt-5 max-w-2xl leading-7 text-gray-600">
                    {{ about.subtitle }}
                </p>
            </div>

            <div class="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                    <h3 class="text-2xl font-semibold">
                        {{ about.heading }}
                    </h3>

                    <p class="mt-4 leading-8 text-gray-600">
                        {{ about.description }}
                    </p>

                    <h3 class="mt-9 text-xl font-semibold">
                        Keunggulan Kami
                    </h3>

                    <ul class="mt-4 space-y-3">
                        <li
                            v-for="(item, index) in about.advantages"
                            :key="index"
                            class="flex gap-3 text-gray-600"
                        >
                            <span class="font-bold text-[#0052cc]">✓</span>
                            <span>{{ item }}</span>
                        </li>
                    </ul>
                </div>

                <div class="space-y-5">
                    <article
                        v-if="about.vision"
                        class="rounded-lg border-l-4 border-[#0052cc] bg-[#f0f4ff] p-6 sm:p-8"
                    >
                        <h4 class="font-semibold">Visi Kami</h4>
                        <p class="mt-2 text-sm leading-7 text-gray-600">
                            {{ about.vision }}
                        </p>
                    </article>

                    <article
                        v-if="about.mission"
                        class="rounded-lg border-l-4 border-[#0052cc] bg-[#f0f4ff] p-6 sm:p-8"
                    >
                        <h4 class="font-semibold">Misi Kami</h4>
                        <p class="mt-2 text-sm leading-7 text-gray-600">
                            {{ about.mission }}
                        </p>
                    </article>

                    <article
                        v-if="about.commitment"
                        class="rounded-lg border-l-4 border-[#0052cc] bg-[#f0f4ff] p-6 sm:p-8"
                    >
                        <h4 class="font-semibold">Komitmen Kami</h4>
                        <p class="mt-2 text-sm leading-7 text-gray-600">
                            {{ about.commitment }}
                        </p>
                    </article>
                </div>
            </div>

            <p v-if="loading" class="mt-6 text-sm text-gray-500">
                Memuat informasi perusahaan...
            </p>

            <p v-else-if="error" class="mt-6 text-sm text-red-600">
                {{ error }}
            </p>
        </div>
    </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '@/services/api'

const loading = ref(false)
const error = ref('')

const about = reactive({
    title: '',
    subtitle: '',
    heading: '',
    description: '',
    advantages: [],
    vision: '',
    mission: '',
    commitment: '',
})

async function loadAbout() {
    loading.value = true
    error.value = ''

    try {
        const response = await api.get('/website/home/sections')

        const result = response.data?.data
        const sections = Array.isArray(result)
            ? result
            : result?.data ?? []

        const section = sections.find(
            item => item.type === 'about'
        )

        if (!section) {
            error.value = 'Section Tentang Kami belum tersedia atau belum aktif.'
            return
        }

        const settings = section.settings ?? {}

        about.title = section.title ?? ''
        about.subtitle = section.subtitle ?? ''
        about.heading = settings.heading ?? ''
        about.description = section.content ?? ''
        about.advantages = Array.isArray(settings.advantages)
            ? settings.advantages
            : []
        about.vision = settings.vision ?? ''
        about.mission = settings.mission ?? ''
        about.commitment = settings.commitment ?? ''
    } catch (err) {
        console.error('Gagal mengambil data Tentang Kami:', err)

        error.value =
            err.response?.data?.message ??
            'Gagal mengambil data Tentang Kami dari server.'
    } finally {
        loading.value = false
    }
}

onMounted(loadAbout)
</script>