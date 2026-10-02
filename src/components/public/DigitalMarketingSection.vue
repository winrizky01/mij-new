<template>
          <!-- Digital Marketing -->
      <section class="bg-gray-50">
        <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div>
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Digital Marketing &amp; Social Media</h2>
            <div class="mt-5 h-1 w-14 rounded-full bg-[#0052cc]"></div>
            <p class="mt-5 max-w-2xl leading-7 text-gray-600">Bangun kehadiran digital yang konsisten dan terukur.</p>
          </div>
          <div class="mt-12 grid gap-5 md:grid-cols-3">
            <article v-for="service in digitalServices" :key="service.name"
              class="rounded-xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">
              <div class="text-4xl" aria-hidden="true">{{ service.icon }}</div>
              <h3 class="mt-5 text-lg font-semibold">{{ service.name }}</h3>
              <p class="mt-3 text-sm leading-7 text-gray-600">{{ service.description }}</p>
            </article>
          </div>
        </div>
      </section>

</template>
<script setup>
const digitalServices = [
  {
    icon: '📊',
    name: 'SEO Optimization',
    description: 'Meningkatkan visibilitas website di mesin pencari dengan strategi SEO yang efektif.'
  },
  {
    icon: '📧',
    name: 'Email Marketing',
    description: 'Mengirimkan kampanye email yang relevan dan menarik untuk meningkatkan engagement pelanggan.'
  },
  {
    icon: '📱',
    name: 'Social Media Management',
    description: 'Mengelola kehadiran digital di platform sosial media untuk membangun komunitas dan meningkatkan brand awareness.'
  }
]
</script>