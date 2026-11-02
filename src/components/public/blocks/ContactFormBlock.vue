<script setup>
import { ref, computed } from 'vue'
import { Send, CheckCircle2, AlertCircle, LoaderCircle } from 'lucide-vue-next'
import api from '@/services/api'

const props = defineProps({
  title: {
    type: String,
    default: 'Hubungi Kami',
  },
  eyebrow: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: 'Kirim pesan kepada kami. Tim kami akan segera menghubungi Anda.',
  },
  submitText: {
    type: String,
    default: 'Kirim Pesan',
  },
  backgroundColor: {
    type: String,
    default: 'transparent',
  },
  isPreviewMode: {
    type: Boolean,
    default: false,
  },
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
})

const loading = ref(false)
const submitted = ref(false)
const errorMessage = ref('')
const validationErrors = ref({})

const buttonText = computed(() =>
  props.submitText || 'Kirim Pesan'
)

function resetForm() {
  form.value = {
    name: '',
    email: '',
    phone: '',
    message: '',
  }
}

async function handleSubmit() {
  errorMessage.value = ''
  validationErrors.value = {}
  submitted.value = false

  if (loading.value) return

  loading.value = true

  try {
    // Preview hanya simulasi, tidak mengirim data ke API.
    if (props.isPreviewMode) {
      submitted.value = true
      return
    }

    await api.post('/website/inquiries', {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || null,
      message: form.value.message,
      page_url: window.location.href,
    })

    submitted.value = true
    resetForm()
  } catch (error) {
    if (error.response?.status === 422) {
      validationErrors.value =
        error.response.data.errors || {}

      errorMessage.value =
        error.response.data.message ||
        'Periksa kembali data yang kamu masukkan.'
    } else {
      errorMessage.value =
        error.response?.data?.message ||
        'Pesan gagal dikirim. Silakan coba kembali.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section
    class="w-full rounded-xl border border-gray-200 bg-gray-50 p-6 sm:p-8"
    :style="{ backgroundColor }"
  >
    <div class="mx-auto w-full max-w-3xl">
      <!-- Success -->
      <div
        v-if="submitted"
        class="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
      >
        <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p class="font-semibold">
            {{ isPreviewMode ? 'Simulasi berhasil!' : 'Pesan berhasil dikirim!' }}
          </p>

          <p class="mt-1 text-sm">
            {{
              isPreviewMode
                ? 'Formulir ini hanya simulasi pada mode preview.'
                : 'Terima kasih telah menghubungi kami. Tim kami akan segera menindaklanjuti pesan Anda.'
            }}
          </p>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="errorMessage"
        class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
      >
        <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />

        <p class="text-sm">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Form -->
      <form
        class="space-y-5"
        @submit.prevent="handleSubmit"
      >
        <!-- Nama -->
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Nama Lengkap <span class="text-red-500">*</span>
          </label>

          <input
            v-model="form.name"
            type="text"
            required
            maxlength="150"
            placeholder="Masukkan nama lengkap"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            :disabled="loading"
          />

          <p
            v-if="validationErrors.name"
            class="mt-1 text-xs text-red-600"
          >
            {{ validationErrors.name[0] }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Email <span class="text-red-500">*</span>
          </label>

          <input
            v-model="form.email"
            type="email"
            required
            maxlength="150"
            placeholder="nama@email.com"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            :disabled="loading"
          />

          <p
            v-if="validationErrors.email"
            class="mt-1 text-xs text-red-600"
          >
            {{ validationErrors.email[0] }}
          </p>
        </div>

        <!-- Telepon -->
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Nomor Telepon
          </label>

          <input
            v-model="form.phone"
            type="tel"
            maxlength="30"
            placeholder="Contoh: 081234567890"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            :disabled="loading"
          />

          <p
            v-if="validationErrors.phone"
            class="mt-1 text-xs text-red-600"
          >
            {{ validationErrors.phone[0] }}
          </p>
        </div>

        <!-- Pesan -->
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700">
            Pesan <span class="text-red-500">*</span>
          </label>

          <textarea
            v-model="form.message"
            required
            maxlength="5000"
            rows="5"
            placeholder="Tuliskan kebutuhan atau pertanyaan Anda..."
            class="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            :disabled="loading"
          ></textarea>

          <p
            v-if="validationErrors.message"
            class="mt-1 text-xs text-red-600"
          >
            {{ validationErrors.message[0] }}
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <LoaderCircle
            v-if="loading"
            class="h-4 w-4 animate-spin"
          />

          <Send
            v-else
            class="h-4 w-4"
          />

          {{ loading ? 'Mengirim...' : buttonText }}
        </button>
      </form>
    </div>
  </section>
</template>