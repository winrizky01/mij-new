<script setup>
import { computed } from 'vue'
import { MessageCircle } from 'lucide-vue-next'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const phone = computed(() =>
    String(props.block.phone || '').replace(/\D/g, '')
)

const whatsappUrl = computed(() => {
    if (!phone.value) return ''

    const params = new URLSearchParams()
    if (props.block.message) {
        params.set('text', props.block.message)
    }

    return `https://wa.me/${phone.value}${params.size ? `?${params}` : ''}`
})
</script>

<template>
    <section
        class="rounded-2xl bg-slate-50 px-6 py-8"
        :style="{ textAlign: block.alignment || 'center' }"
    >
        <h2 class="text-xl font-bold text-slate-900">
            {{ block.title || 'Butuh Informasi Lebih Lanjut?' }}
        </h2>

        <p
            v-if="block.description"
            class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600"
        >
            {{ block.description }}
        </p>

        <a
            v-if="whatsappUrl"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
            <MessageCircle :size="18" />
            {{ block.buttonText || 'Hubungi via WhatsApp' }}
        </a>

        <p v-else class="mt-4 text-xs text-slate-400">
            Nomor WhatsApp belum dikonfigurasi.
        </p>
    </section>
</template>
