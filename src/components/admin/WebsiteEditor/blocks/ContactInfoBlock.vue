<script setup>
import { MapPin, Phone, Mail, Clock } from 'lucide-vue-next'

defineProps({
    block: { type: Object, default: () => ({}) },
})
</script>

<template>
    <section>
        <h2 class="text-2xl font-bold text-slate-900">
            {{ block.title || 'Informasi Kontak' }}
        </h2>
        <p v-if="block.description" class="mt-2 text-sm text-slate-600">
            {{ block.description }}
        </p>

        <div class="mt-5 space-y-4">
            <div v-if="block.address" class="flex gap-3">
                <MapPin class="mt-0.5 shrink-0 text-[#14a2d8]" :size="18" />
                <p class="text-sm leading-6 text-slate-600">
                    {{ block.address }}
                </p>
            </div>

            <div v-if="block.phone" class="flex gap-3">
                <Phone class="mt-0.5 shrink-0 text-[#14a2d8]" :size="18" />
                <a :href="`tel:${block.phone}`" class="text-sm text-slate-600">
                    {{ block.phone }}
                </a>
            </div>

            <div v-if="block.email" class="flex gap-3">
                <Mail class="mt-0.5 shrink-0 text-[#14a2d8]" :size="18" />
                <a :href="`mailto:${block.email}`" class="break-all text-sm text-slate-600">
                    {{ block.email }}
                </a>
            </div>

            <div v-if="block.hours" class="flex gap-3">
                <Clock class="mt-0.5 shrink-0 text-[#14a2d8]" :size="18" />
                <p class="text-sm text-slate-600">
                    {{ block.hours }}
                </p>
            </div>

            <p
                v-if="!block.address && !block.phone && !block.email && !block.hours"
                class="text-sm text-slate-400"
            >
                Informasi kontak belum dikonfigurasi.
            </p>
        </div>
    </section>
</template>
