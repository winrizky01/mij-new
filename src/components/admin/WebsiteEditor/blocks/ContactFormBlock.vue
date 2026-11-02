<script setup>
import { ref, computed } from 'vue'
import { Send, CheckCircle2, LoaderCircle } from 'lucide-vue-next'
import api from '@/services/api'

const props = defineProps({
    block: {
        type: Object,
        default: () => ({}),
    },
    isPreviewMode: {
        type: Boolean,
        default: false,
    },
})

const name = ref('')
const email = ref('')
const phone = ref('')
const message = ref('')

const loading = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

const buttonText = computed(() =>
    props.block.buttonText ||
    props.block.submitText ||
    'Kirim Pesan'
)

const description = computed(() =>
    props.block.description ||
    'Kirim pesan kepada tim kami melalui formulir berikut.'
)

async function handleSubmit() {
    if (props.isPreviewMode) {
        submitted.value = true
        return
    }

    loading.value = true
    errorMessage.value = ''

    try {
        await api.post('/website/inquiries', {
            name: name.value,
            email: email.value,
            phone: phone.value,
            message: message.value,
            page_url: window.location.href,
        })

        submitted.value = true

        name.value = ''
        email.value = ''
        phone.value = ''
        message.value = ''

    } catch (error) {
        errorMessage.value =
            error.response?.data?.message ||
            'Pesan gagal dikirim. Silakan coba kembali.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <section class="mx-auto w-full max-w-2xl">
        <h2 class="text-2xl font-bold text-slate-900">
            {{ block.title || 'Hubungi Kami' }}
        </h2>

        <p class="mt-2 text-sm leading-6 text-slate-600">
            {{ description }}
        </p>

        <div
            v-if="submitted"
            class="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5"
        >
            <div class="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 :size="22" />

                <p class="font-semibold">
                    {{ isPreviewMode
                        ? 'Simulasi berhasil!'
                        : 'Pesan berhasil dikirim!'
                    }}
                </p>
            </div>

            <p class="mt-2 text-sm text-emerald-700">
                {{ isPreviewMode
                    ? 'Ini hanya simulasi preview. Pesan belum dikirim ke server.'
                    : 'Terima kasih telah menghubungi kami. Tim kami akan segera menghubungi Anda.'
                }}
            </p>

            <button
                v-if="isPreviewMode"
                type="button"
                class="mt-3 text-sm font-semibold text-emerald-700 underline"
                @click="submitted = false"
            >
                Coba lagi
            </button>
        </div>

        <form
            v-else
            class="mt-6 space-y-4"
            @submit.prevent="handleSubmit"
        >
            <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Nama
                </label>

                <input
                    v-model="name"
                    type="text"
                    required
                    maxlength="150"
                    autocomplete="name"
                    placeholder="Nama lengkap"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
            </div>

            <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                </label>

                <input
                    v-model="email"
                    type="email"
                    required
                    maxlength="150"
                    autocomplete="email"
                    placeholder="nama@email.com"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
            </div>

            <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Nomor Telepon
                </label>

                <input
                    v-model="phone"
                    type="tel"
                    maxlength="30"
                    autocomplete="tel"
                    placeholder="08xxxxxxxxxx"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
            </div>

            <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Pesan
                </label>

                <textarea
                    v-model="message"
                    required
                    maxlength="5000"
                    rows="4"
                    placeholder="Tuliskan pesan Anda"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                ></textarea>
            </div>

            <p
                v-if="errorMessage"
                class="text-sm text-red-600"
            >
                {{ errorMessage }}
            </p>

            <button
                type="submit"
                :disabled="loading"
                class="inline-flex items-center gap-2 rounded-lg bg-[#14a2d8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <LoaderCircle
                    v-if="loading"
                    :size="15"
                    class="animate-spin"
                />

                <Send v-else :size="15" />

                {{ loading ? 'Mengirim...' : buttonText }}
            </button>
        </form>
    </section>
</template>