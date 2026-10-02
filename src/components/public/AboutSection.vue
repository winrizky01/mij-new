<template>
      <!-- About -->
      <section id="about" class="bg-gray-50">
        <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div>
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Tentang Kami</h2>
            <div class="mt-5 h-1 w-14 rounded-full bg-[#0052cc]"></div>
            <p class="mt-5 max-w-2xl leading-7 text-gray-600">Mitra strategis untuk kebutuhan bisnis dan transformasi
              digital Anda.</p>
          </div>
          <div class="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 class="text-2xl font-semibold">Mitra Terpercaya Anda</h3>
              <p class="mt-4 leading-8 text-gray-600">
                Manunggal Jasa Investindo berkomitmen untuk memberikan solusi bisnis yang sesuai dengan kebutuhan.
                Kami memahami tantangan perusahaan modern dan siap menjadi mitra strategis dalam pengembangan bisnis.
              </p>
              <h3 class="mt-9 text-xl font-semibold">Keunggulan Kami</h3>
              <ul class="mt-4 space-y-3">
                <li v-for="item in advantages" :key="item" class="flex gap-3 text-gray-600">
                  <span class="font-bold text-[#0052cc]">✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="space-y-5">
              <article class="rounded-lg border-l-4 border-[#0052cc] bg-[#f0f4ff] p-6 sm:p-8">
                <h4 class="font-semibold">Visi Kami</h4>
                <p class="mt-2 text-sm leading-7 text-gray-600">
                  Menjadi integrator bisnis terkemuka yang menyediakan solusi inovatif untuk pertumbuhan berkelanjutan
                  klien kami di Indonesia dan Asia Tenggara.
                </p>
              </article>
              <article class="rounded-lg border-l-4 border-[#0052cc] bg-[#f0f4ff] p-6 sm:p-8">
                <h4 class="font-semibold">Misi Kami</h4>
                <p class="mt-2 text-sm leading-7 text-gray-600">
                  Memberikan layanan berkualitas tinggi dengan integritas, profesionalisme, dan inovasi berkelanjutan
                  untuk kesuksesan bersama klien kami.
                </p>
              </article>
              <article class="rounded-lg border-l-4 border-[#0052cc] bg-[#f0f4ff] p-6 sm:p-8">
                <h4 class="font-semibold">Komitmen Kami</h4>
                <p class="mt-2 text-sm leading-7 text-gray-600">
                  Kepuasan pelanggan adalah prioritas. Kami berkomitmen memberikan nilai terbaik dalam setiap interaksi.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

</template>
<script setup>
const advantages = [
  'Pengalaman bertahun-tahun di industri',
  'Tim profesional dan berpengalaman',
  'Teknologi terkini dan inovasi',
  'Layanan terpadu dan terintegrasi',
  'Dukungan customer service 24/7',
]
</script>