<template>
    <!-- Contact -->
      <section id="contact" class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Hubungi Kami</h2>
          <div class="mt-5 h-1 w-14 rounded-full bg-[#0052cc]"></div>
          <p class="mt-5 max-w-2xl leading-7 text-gray-600">Kirim pesan kepada kami. Tim kami akan menindaklanjuti
            permintaan Anda.</p>
        </div>
        <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 class="text-xl font-semibold">Informasi Kontak</h3>
            <div class="mt-8 space-y-7">
              <div>
                <h4 class="font-semibold">📍 Lokasi</h4>
                <p class="mt-2 text-sm leading-7 text-gray-600">Jl. Merdeka No. 123, Surabaya, Jawa Timur 60123,
                  Indonesia</p>
              </div>
              <div>
                <h4 class="font-semibold">📞 Telepon</h4>
                <p class="mt-2 space-y-1 text-sm leading-7">
                  <a class="block text-[#0052cc] hover:underline" href="tel:+62311234567">(+62-31) 1234 5678</a>
                  <a class="block text-[#0052cc] hover:underline" href="tel:+6281234567890">(+62-812) 3456 7890</a>
                </p>
              </div>
              <div>
                <h4 class="font-semibold">✉️ Email</h4>
                <p class="mt-2 space-y-1 text-sm leading-7">
                  <a class="block text-[#0052cc] hover:underline"
                    href="mailto:info@manunggal.com">info@manunggal.com</a>
                  <a class="block text-[#0052cc] hover:underline"
                    href="mailto:support@manunggal.com">support@manunggal.com</a>
                </p>
              </div>
            </div>
          </div>

          <form class="rounded-xl border border-gray-200 bg-gray-50 p-6 sm:p-8" @submit.prevent="submitForm">
            <div class="space-y-5">
              <div>
                <label for="name" class="mb-2 block text-sm font-medium">Nama Lengkap</label>
                <input id="name" v-model="form.name" required type="text" autocomplete="name" placeholder="Nama Anda"
                  class="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-4 focus:ring-blue-100" />
              </div>
              <div>
                <label for="email" class="mb-2 block text-sm font-medium">Email</label>
                <input id="email" v-model="form.email" required type="email" autocomplete="email"
                  placeholder="email@contoh.com"
                  class="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-4 focus:ring-blue-100" />
              </div>
              <div>
                <label for="message" class="mb-2 block text-sm font-medium">Pesan</label>
                <textarea id="message" v-model="form.message" required rows="4"
                  placeholder="Ceritakan kebutuhan Anda..."
                  class="w-full resize-y rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-4 focus:ring-blue-100"></textarea>
              </div>
              <button type="submit"
                class="w-full rounded-md bg-[#0052cc] px-5 py-3.5 font-semibold text-white transition hover:bg-[#003d99]">
                Kirim Pesan
              </button>
              <p v-if="submitted" role="status" class="rounded-md bg-green-50 p-3 text-sm text-green-800">
                Terima kasih! Pesan berhasil divalidasi di halaman ini. Hubungkan formulir ke backend/email untuk
                mengirim pesan sungguhan.
              </p>
            </div>
          </form>
        </div>
      </section>
</template>
<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const submitted = ref(false)

const submitForm = () => {
  // Simulate form submission
  submitted.value = true
  form.value = { name: '', email: '', message: '' }
}
</script>
