<template>
    <!-- Services -->
    <section id="services" class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div>
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Layanan Kami</h2>
            <div class="mt-5 h-1 w-14 rounded-full bg-[#0052cc]"></div>
            <p class="mt-5 max-w-2xl leading-7 text-gray-600">Kami menyediakan solusi bisnis komprehensif untuk
                mendukung
                pertumbuhan perusahaan Anda.</p>
        </div>
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="service in services" :key="service.name"
                class="group rounded-xl border border-gray-200 bg-gray-50 p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-[#0052cc] hover:bg-white hover:shadow-xl hover:shadow-blue-900/10">
                <div class="mb-5 text-5xl" aria-hidden="true">{{ service.icon }}</div>
                <h3 class="text-lg font-semibold">{{ service.name }}</h3>
                <p class="mt-3 text-sm leading-7 text-gray-600">{{ service.description }}</p>
            </article>
        </div>
    </section>
</template>
<script setup>
const services = [
    {
        icon: '🚀',
        name: 'Digital Marketing',
        description: 'Strategi pemasaran digital yang efektif untuk meningkatkan visibilitas dan penjualan Anda.'
    },
    {
        icon: '💻',
        name: 'Web Development',
        description: 'Pengembangan website yang responsif dan ramah pengguna untuk bisnis Anda.'
    },
    {
        icon: '📱',
        name: 'Mobile App Development',
        description: 'Pengembangan aplikasi mobile yang inovatif dan user-friendly.'
    },
    {
        icon: '📊',
        name: 'Data Analytics',
        description: 'Analisis data untuk memberikan wawasan berharga dan mendukung pengambilan keputusan.'
    }
]
</script>