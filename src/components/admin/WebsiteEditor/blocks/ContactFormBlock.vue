<script setup>
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'

defineProps({
    block: { type: Object, default: () => ({}) },
})

const name = ref('')
const email = ref('')
const message = ref('')
const submitted = ref(false)

function handleSubmit() {
    submitted.value = true
}
</script>

<template>
    <section class="mx-auto w-full max-w-2xl">
        <h2 class="text-2xl font-bold text-slate-900">
            {{ block.title || 'Hubungi Kami' }}
        </h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">
            {{ block.description || 'Kirim pesan kepada tim kami melalui formulir berikut.' }}
        </p>

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
            <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Nama
                </label>
                <input
                    v-model="name"
                    required
                    autocomplete="name"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    placeholder="Nama lengkap"
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
                    autocomplete="email"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    placeholder="nama@email.com"
                />
            </div>

            <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                    Pesan
                </label>
                <textarea
                    v-model="message"
                    required
                    rows="4"
                    class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    placeholder="Tuliskan pesan Anda"
                />
            </div>

            <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-lg bg-[#14a2d8] px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
            >
                <Send :size="15" />
                {{ block.buttonText || 'Kirim Pesan' }}
            </button>

            <p v-if="submitted" class="text-xs text-amber-700">
                Preview saja: pesan belum dikirim ke server.
            </p>
        </form>
    </section>
</template>
