<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Hubungi Kami' },
  eyebrow: { type: String, default: '' },
  description: { type: String, default: 'Kami siap membantu kebutuhan Anda.' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  whatsappUrl: { type: String, default: '' },
  mapsUrl: { type: String, default: '' },
  backgroundColor: { type: String, default: '#ffffff' },
})

const emailUrl = computed(() =>
  props.email ? `mailto:${props.email}` : ''
)

const phoneUrl = computed(() =>
  props.phone ? `tel:${props.phone.replace(/[^\d+]/g, '')}` : ''
)
</script>

<template>
  <section
    class="px-6 py-16 sm:px-10 lg:px-20"
    :style="{ backgroundColor }"
  >
    <div class="mx-auto max-w-7xl">
      <header class="mb-10 max-w-3xl">
        <p
          v-if="eyebrow"
          class="mb-2 text-sm font-semibold uppercase tracking-widest text-sky-600"
        >
          {{ eyebrow }}
        </p>

        <h2 class="text-3xl font-bold text-gray-900">
          {{ title }}
        </h2>

        <p class="mt-4 leading-relaxed text-gray-600">
          {{ description }}
        </p>
      </header>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-if="address"
          class="rounded-2xl border border-gray-200 p-6"
        >
          <h3 class="font-semibold text-gray-900">Alamat</h3>
          <p class="mt-3 whitespace-pre-line leading-relaxed text-gray-600">
            {{ address }}
          </p>

          <a
            v-if="mapsUrl"
            :href="mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex font-semibold text-sky-700"
          >
            Lihat peta →
          </a>
        </div>

        <div
          v-if="email"
          class="rounded-2xl border border-gray-200 p-6"
        >
          <h3 class="font-semibold text-gray-900">Email</h3>
          <a
            :href="emailUrl"
            class="mt-3 block break-words text-sky-700 hover:underline"
          >
            {{ email }}
          </a>
        </div>

        <div
          v-if="phone || whatsappUrl"
          class="rounded-2xl border border-gray-200 p-6"
        >
          <h3 class="font-semibold text-gray-900">Telepon & WhatsApp</h3>

          <a
            v-if="phone"
            :href="phoneUrl"
            class="mt-3 block text-sky-700 hover:underline"
          >
            {{ phone }}
          </a>

          <a
            v-if="whatsappUrl"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
