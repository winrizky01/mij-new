<template>
          <!-- Panggil Tukang -->
      <section class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Panggil Tukang</h2>
          <div class="mt-5 h-1 w-14 rounded-full bg-[#0052cc]"></div>
          <p class="mt-5 max-w-2xl leading-7 text-gray-600">Aplikasi mobile kami untuk membantu pelanggan menemukan
            tenaga profesional.</p>
        </div>
        <div class="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div class="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-8 sm:p-12">
            <div class="text-5xl" aria-hidden="true">📱</div>
            <h3 class="mt-5 text-2xl font-semibold">Panggil Tukang</h3>
            <p class="mt-4 leading-8 text-gray-600">
              Platform aplikasi mobile untuk menemukan tukang profesional terverifikasi dengan rating dan ulasan.
            </p>
            <a href="#contact"
              class="mt-7 inline-flex rounded-md bg-[#0052cc] px-5 py-3 font-semibold text-white transition hover:bg-[#003d99]">
              Tanyakan Aplikasi
            </a>
          </div>
          <div>
            <h3 class="text-2xl font-semibold">Fitur Unggulan</h3>
            <ul class="mt-6 space-y-4">
              <li v-for="item in appFeatures" :key="item" class="flex gap-3 text-gray-600">
                <span class="font-bold text-[#0052cc]">✓</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

</template>
<script setup>
const appFeatures = [
  'Pencarian tukang berdasarkan lokasi',
  'Rating dan ulasan terverifikasi',
  'Booking online yang mudah',
  'Pembayaran aman dan nyaman',
  'Dukungan customer service 24/7',
]
</script>