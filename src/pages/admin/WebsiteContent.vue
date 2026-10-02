<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">
                    Halaman Website
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola konten yang tampil pada halaman utama website.
                </p>
            </div>

            <button type="button" @click="saveContent"
                class="inline-flex items-center justify-center rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0047b3]">
                💾 Simpan Perubahan
            </button>
        </div>

        <!-- Tabs -->
        <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <div class="flex min-w-max border-b border-gray-200">
                <button v-for="tab in tabs" :key="tab.id" type="button" @click="activeTab = tab.id"
                    class="relative px-5 py-4 text-sm font-medium transition" :class="activeTab === tab.id
                        ? 'text-[#0052cc]'
                        : 'text-gray-500 hover:text-gray-900'
                        ">
                    <span class="mr-2">{{ tab.icon }}</span>
                    {{ tab.label }}

                    <span v-if="activeTab === tab.id" class="absolute inset-x-0 bottom-0 h-0.5 bg-[#0052cc]" />
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <!-- HERO -->
            <div v-if="activeTab === 'hero'" class="space-y-6">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <SectionHeader title="Hero / Banner"
                        description="Kelola banner yang tampil pada bagian paling atas website." />

                    <button type="button" @click="openHeroForm()"
                        class="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0047b3]">
                        + Tambah Banner
                    </button>
                </div>

                <!-- Hero List -->
                <div class="space-y-3">
                    <div v-for="(hero, index) in content.heroes" :key="hero.id"
                        class="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
                        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <!-- Info -->
                            <div class="flex min-w-0 items-start gap-4">
                                <!-- Order -->
                                <div
                                    class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-sm font-bold text-[#0052cc]">
                                    {{ index + 1 }}
                                </div>

                                <!-- Content -->
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <h3 class="truncate text-sm font-semibold text-gray-900">
                                            {{ hero.title }}
                                        </h3>

                                        <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold" :class="hero.active
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-gray-100 text-gray-500'
                                            ">
                                            {{ hero.active ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </div>

                                    <p class="mt-1 text-sm text-gray-500">
                                        {{ hero.subtitle }}
                                    </p>

                                    <p class="mt-2 line-clamp-2 text-xs leading-5 text-gray-400">
                                        {{ hero.description }}
                                    </p>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex shrink-0 items-center gap-2">
                                <button type="button" @click="moveHero(index, 'up')" :disabled="index === 0"
                                    class="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                                    title="Naik">
                                    ↑
                                </button>

                                <button type="button" @click="moveHero(index, 'down')"
                                    :disabled="index === content.heroes.length - 1"
                                    class="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                                    title="Turun">
                                    ↓
                                </button>

                                <button type="button" @click="toggleHero(hero)"
                                    class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                                    {{ hero.active ? 'Nonaktifkan' : 'Aktifkan' }}
                                </button>

                                <button type="button" @click="openHeroForm(hero)"
                                    class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0052cc] hover:bg-blue-100">
                                    Edit
                                </button>

                                <button type="button" @click="deleteHero(hero.id)"
                                    class="grid h-9 w-9 place-items-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50"
                                    title="Hapus">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Empty -->
                    <div v-if="content.heroes.length === 0"
                        class="rounded-xl border border-dashed border-gray-300 p-10 text-center">
                        <div class="text-3xl">🖥️</div>

                        <p class="mt-3 text-sm font-semibold text-gray-900">
                            Belum ada banner
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            Tambahkan banner pertama untuk website.
                        </p>

                        <button type="button" @click="openHeroForm()"
                            class="mt-4 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white">
                            + Tambah Banner
                        </button>
                    </div>
                </div>

                <!-- Hero Form -->
                <div v-if="showHeroForm" class="rounded-xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6">
                    <div class="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 class="text-base font-bold text-gray-900">
                                {{ editingHero ? 'Edit Banner' : 'Tambah Banner' }}
                            </h3>

                            <p class="mt-1 text-xs text-gray-500">
                                Isi informasi banner yang akan ditampilkan pada website.
                            </p>
                        </div>

                        <button type="button" @click="closeHeroForm"
                            class="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
                            ✕
                        </button>
                    </div>

                    <div class="grid gap-5 lg:grid-cols-2">
                        <FormInput v-model="heroForm.title" label="Judul" placeholder="Solusi Bisnis Terpadu" />

                        <FormInput v-model="heroForm.subtitle" label="Subtitle" placeholder="Untuk Kesuksesan Anda" />

                        <div class="lg:col-span-2">
                            <FormTextarea v-model="heroForm.description" label="Deskripsi"
                                placeholder="Masukkan deskripsi banner" :rows="4" />
                        </div>

                        <FormInput v-model="heroForm.buttonText" label="Text Tombol" placeholder="Pelajari Layanan" />

                        <FormInput v-model="heroForm.buttonLink" label="Link Tombol" placeholder="#services" />

                        <div class="lg:col-span-2">
                            <label class="block text-sm font-medium text-gray-700">
                                Gambar Banner
                            </label>

                            <div
                                class="mt-1.5 flex flex-col gap-3 rounded-lg border border-dashed border-gray-300 bg-white p-4 sm:flex-row sm:items-center">
                                <div
                                    class="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-gray-100">
                                    <img v-if="heroForm.image" :src="heroForm.image" alt=""
                                        class="h-full w-full object-cover" />

                                    <span v-else class="text-xl">
                                        🖼️
                                    </span>
                                </div>

                                <div class="min-w-0">
                                    <p class="text-sm font-medium text-gray-700">
                                        Gambar Hero
                                    </p>

                                    <p class="mt-1 text-xs text-gray-400">
                                        Untuk sementara gunakan URL gambar. Nanti bisa
                                        dipilih dari Media Library.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                            <div>
                                <p class="text-sm font-semibold text-gray-900">
                                    Banner Aktif
                                </p>

                                <p class="mt-1 text-xs text-gray-500">
                                    Tampilkan banner pada website.
                                </p>
                            </div>

                            <Toggle v-model="heroForm.active" />
                        </div>
                    </div>

                    <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button type="button" @click="closeHeroForm"
                            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>

                        <button type="button" @click="saveHero"
                            class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]">
                            {{ editingHero ? 'Simpan Perubahan' : 'Tambah Banner' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- TENTANG -->
            <div v-else-if="activeTab === 'about'" class="space-y-6">
                <SectionHeader title="Tentang Perusahaan"
                    description="Kelola informasi singkat mengenai Manunggal Jasa Investindo." />

                <div class="grid gap-6 lg:grid-cols-2">
                    <div class="space-y-5">
                        <FormInput v-model="content.about.title" label="Judul" />

                        <FormInput v-model="content.about.heading" label="Heading" />

                        <FormTextarea v-model="content.about.description" label="Deskripsi" :rows="6" />

                        <FormTextarea v-model="content.about.vision" label="Visi" :rows="3" />

                        <FormTextarea v-model="content.about.mission" label="Misi" :rows="3" />

                        <div>
                            <div class="mb-3">
                                <p class="text-sm font-semibold text-gray-900">
                                    Statistik Perusahaan
                                </p>
                                <p class="mt-1 text-xs text-gray-500">
                                    Informasi singkat yang ditampilkan pada section Tentang Kami.
                                </p>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-3">
                                <div
                                    v-for="(stat, index) in content.about.stats"
                                    :key="index"
                                    class="rounded-xl border border-gray-200 bg-gray-50 p-4"
                                >
                                    <FormInput
                                        v-model="stat.label"
                                        label="Label"
                                        :placeholder="
                                            index === 0
                                                ? 'Tahun Berdiri'
                                                : index === 1
                                                    ? 'Klien Terpercaya'
                                                    : 'Proyek Sukses'
                                        "
                                    />

                                    <div class="mt-3">
                                        <FormInput
                                            v-model="stat.value"
                                            label="Nilai"
                                            :placeholder="
                                                index === 0
                                                    ? '2020'
                                                    : index === 1
                                                        ? '500+'
                                                        : '1K+'
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-5">
                        <PreviewCard title="Informasi Perusahaan">
                            <div class="rounded-xl bg-gray-50 p-5">
                                <p class="text-sm font-semibold text-[#0052cc]">
                                    {{ content.about.title }}
                                </p>

                                <h3 class="mt-2 text-xl font-bold text-gray-900">
                                    {{ content.about.heading }}
                                </h3>

                                <p class="mt-3 text-sm leading-6 text-gray-600">
                                    {{ content.about.description }}
                                </p>

                                <div class="mt-5 grid grid-cols-3 gap-3">
                                    <div v-for="stat in content.about.stats" :key="stat.label"
                                        class="rounded-lg bg-white p-3 text-center shadow-sm">
                                        <p class="text-lg font-bold text-[#0052cc]">
                                            {{ stat.value }}
                                        </p>

                                        <p class="mt-1 text-[11px] text-gray-500">
                                            {{ stat.label }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </PreviewCard>

                        <div class="rounded-lg border border-dashed border-gray-300 p-5">
                            <p class="text-sm font-semibold text-gray-900">
                                Gambar Tentang Perusahaan
                            </p>

                            <p class="mt-1 text-xs text-gray-500">
                                Upload gambar melalui menu Media.
                            </p>

                            <button type="button"
                                class="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                🖼️ Pilih dari Media
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PANGGIL TUKANG -->
            <div v-else-if="activeTab === 'panggil-tukang'" class="space-y-6">
                <SectionHeader title="Panggil Tukang" description="Kelola konten promosi layanan Panggil Tukang." />

                <div class="grid gap-6 lg:grid-cols-2">
                    <div class="space-y-5">
                        <FormInput v-model="content.panggilTukang.title" label="Judul" />

                        <FormInput v-model="content.panggilTukang.subtitle" label="Subtitle" />

                        <FormTextarea v-model="content.panggilTukang.description" label="Deskripsi" :rows="5" />

                        <div class="grid gap-4 sm:grid-cols-2">
                            <FormInput v-model="content.panggilTukang.buttonText" label="Text Tombol" />

                            <FormInput v-model="content.panggilTukang.buttonLink" label="Link Tombol" />
                        </div>

                        <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                            <div>
                                <p class="text-sm font-semibold text-gray-900">
                                    Tampilkan Section
                                </p>

                                <p class="text-xs text-gray-500">
                                    Aktifkan section pada halaman utama.
                                </p>
                            </div>

                            <Toggle v-model="content.panggilTukang.active" />
                        </div>
                    </div>

                    <PreviewCard title="Preview">
                        <div class="rounded-xl bg-blue-50 p-6">
                            <span class="text-sm font-semibold text-[#0052cc]">
                                PANGGIL TUKANG
                            </span>

                            <h3 class="mt-2 text-2xl font-bold text-gray-900">
                                {{ content.panggilTukang.title }}
                            </h3>

                            <p class="mt-2 font-medium text-gray-700">
                                {{ content.panggilTukang.subtitle }}
                            </p>

                            <p class="mt-4 text-sm leading-6 text-gray-600">
                                {{ content.panggilTukang.description }}
                            </p>

                            <button type="button"
                                class="mt-5 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white">
                                {{ content.panggilTukang.buttonText }}
                            </button>
                        </div>
                    </PreviewCard>
                </div>
            </div>

            <!-- DIGITAL MARKETING -->
            <div v-else-if="activeTab === 'digital-marketing'" class="space-y-6">
                <SectionHeader title="Digital Marketing"
                    description="Kelola konten layanan digital marketing pada website." />

                <div class="grid gap-6 lg:grid-cols-2">
                    <div class="space-y-5">
                        <FormInput v-model="content.digitalMarketing.title" label="Judul" />

                        <FormInput v-model="content.digitalMarketing.subtitle" label="Subtitle" />

                        <FormTextarea v-model="content.digitalMarketing.description" label="Deskripsi" :rows="5" />

                        <FormInput v-model="content.digitalMarketing.buttonText" label="Text Tombol" />

                        <FormInput v-model="content.digitalMarketing.buttonLink" label="Link Tombol" />

                        <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                            <div>
                                <p class="text-sm font-semibold text-gray-900">
                                    Tampilkan Section
                                </p>

                                <p class="text-xs text-gray-500">
                                    Aktifkan section pada halaman utama.
                                </p>
                            </div>

                            <Toggle v-model="content.digitalMarketing.active" />
                        </div>
                    </div>

                    <PreviewCard title="Preview">
                        <div class="rounded-xl bg-gray-900 p-6 text-white">
                            <span class="text-sm font-semibold text-blue-300">
                                DIGITAL MARKETING
                            </span>

                            <h3 class="mt-2 text-2xl font-bold">
                                {{ content.digitalMarketing.title }}
                            </h3>

                            <p class="mt-2 text-blue-100">
                                {{ content.digitalMarketing.subtitle }}
                            </p>

                            <p class="mt-4 text-sm leading-6 text-gray-300">
                                {{ content.digitalMarketing.description }}
                            </p>

                            <button type="button"
                                class="mt-5 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white">
                                {{ content.digitalMarketing.buttonText }}
                            </button>
                        </div>
                    </PreviewCard>
                </div>
            </div>

            <!-- KONTAK -->
            <div v-else-if="activeTab === 'contact'" class="space-y-6">
                <SectionHeader title="Kontak & Informasi"
                    description="Informasi yang digunakan pada bagian kontak website." />

                <div class="grid gap-6 lg:grid-cols-2">
                    <div class="space-y-5">
                        <FormInput v-model="content.contact.title" label="Judul Section" />

                        <FormTextarea v-model="content.contact.description" label="Deskripsi" :rows="4" />

                        <FormInput v-model="content.contact.email" label="Email" type="email" />

                        <FormInput v-model="content.contact.phone" label="Nomor Telepon" />

                        <FormTextarea v-model="content.contact.address" label="Alamat" :rows="3" />
                    </div>

                    <div class="space-y-5">
                        <PreviewCard title="Preview Informasi Kontak">
                            <div class="space-y-4">
                                <div>
                                    <p class="text-xl font-bold text-gray-900">
                                        {{ content.contact.title }}
                                    </p>

                                    <p class="mt-2 text-sm leading-6 text-gray-500">
                                        {{ content.contact.description }}
                                    </p>
                                </div>

                                <div class="space-y-3">
                                    <ContactItem icon="📧" label="Email" :value="content.contact.email" />

                                    <ContactItem icon="📞" label="Telepon" :value="content.contact.phone" />

                                    <ContactItem icon="📍" label="Alamat" :value="content.contact.address" />
                                </div>
                            </div>
                        </PreviewCard>

                        <div class="rounded-xl border border-gray-200 p-5">
                            <p class="text-sm font-semibold text-gray-900">
                                Media Sosial
                            </p>

                            <div class="mt-4 space-y-4">
                                <FormInput v-model="content.contact.instagram" label="Instagram"
                                    placeholder="@manunggaljasa" />

                                <FormInput v-model="content.contact.facebook" label="Facebook"
                                    placeholder="Manunggal Jasa Investindo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom save -->
        <div
            class="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p class="text-sm font-semibold text-gray-900">
                    Perubahan belum terhubung ke server
                </p>

                <p class="mt-1 text-xs text-gray-500">
                    Saat ini data masih menggunakan mock data untuk kebutuhan
                    pengembangan UI.
                </p>
            </div>

            <button type="button" @click="saveContent"
                class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]">
                Simpan Perubahan
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, defineComponent, h } from 'vue'

const activeTab = ref('hero')
const showHeroForm = ref(false)
const editingHero = ref(null)

const heroForm = reactive({
    id: null,
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    active: true,
})


const tabs = [
    {
        id: 'hero',
        label: 'Hero',
        icon: '🖥️',
    },
    {
        id: 'about',
        label: 'Tentang',
        icon: '🏢',
    },
    {
        id: 'panggil-tukang',
        label: 'Panggil Tukang',
        icon: '🛠️',
    },
    {
        id: 'digital-marketing',
        label: 'Digital Marketing',
        icon: '📈',
    },
    {
        id: 'contact',
        label: 'Kontak',
        icon: '📞',
    },
]

const content = reactive({
    heroes: [
        {
            id: 1,
            title: 'Solusi Bisnis Terpadu',
            subtitle: 'Untuk Kesuksesan Anda',
            description:
                'Manunggal Jasa Investindo menghadirkan solusi bisnis di bidang logistik, teknologi, dan layanan digital.',
            image: '',
            buttonText: 'Pelajari Layanan',
            buttonLink: '#services',
            active: true,
            order: 1,
        },

        {
            id: 2,
            title: 'Transformasi Digital Berkelanjutan',
            subtitle: 'Digital & Technology',
            description:
                'Kami membantu bisnis berkembang melalui teknologi dan solusi digital yang tepat.',
            image: '',
            buttonText: 'Lihat Layanan',
            buttonLink: '#digital-marketing',
            active: true,
            order: 2,
        },

        {
            id: 3,
            title: 'Jaringan Layanan Terintegrasi',
            subtitle: 'Integrated Services',
            description:
                'Solusi logistik, teknologi, dan layanan digital dalam satu ekosistem bisnis.',
            image: '',
            buttonText: 'Hubungi Kami',
            buttonLink: '#contact',
            active: true,
            order: 3,
        },
    ],

    about: {
        title: 'Tentang Kami',
        heading: 'Partner Bisnis untuk Pertumbuhan Berkelanjutan',
        description:
            'Manunggal Jasa Investindo hadir untuk memberikan solusi bisnis terpadu melalui layanan profesional, teknologi, dan jaringan yang luas.',
        vision:
            'Menjadi perusahaan terpercaya dalam menyediakan solusi bisnis terpadu.',
        mission:
            'Memberikan layanan berkualitas dengan mengutamakan profesionalisme dan kepuasan pelanggan.',
        stats: [
            {
                label: 'Pengalaman',
                value: '10+',
            },
            {
                label: 'Klien',
                value: '500+',
            },
            {
                label: 'Proyek',
                value: '1K+',
            },
        ],
    },

    panggilTukang: {
        title: 'Butuh Tukang Terpercaya?',
        subtitle: 'Panggil Tukang, Beres!',
        description:
            'Temukan tukang profesional dan terpercaya untuk berbagai kebutuhan rumah maupun bisnis Anda.',
        buttonText: 'Kunjungi Panggil Tukang',
        buttonLink: '#panggil-tukang',
        active: true,
    },

    digitalMarketing: {
        title: 'Kembangkan Bisnis Anda Secara Digital',
        subtitle: 'Strategi Digital yang Terukur',
        description:
            'Kami membantu bisnis membangun kehadiran digital melalui content management, community management, serta analytics dan reporting.',
        buttonText: 'Pelajari Layanan',
        buttonLink: '#digital-marketing',
        active: true,
    },

    contact: {
        title: 'Hubungi Kami',
        description:
            'Diskusikan kebutuhan bisnis Anda bersama tim Manunggal Jasa Investindo.',
        email: 'info@manunggal.com',
        phone: '0812-0000-0000',
        address: 'Surabaya, Jawa Timur, Indonesia',
        instagram: '@manunggaljasa',
        facebook: 'Manunggal Jasa Investindo',
    },
})

function resetHeroForm() {
    heroForm.id = null
    heroForm.title = ''
    heroForm.subtitle = ''
    heroForm.description = ''
    heroForm.image = ''
    heroForm.buttonText = ''
    heroForm.buttonLink = ''
    heroForm.active = true
}

function openHeroForm(hero = null) {
    resetHeroForm()

    if (hero) {
        editingHero.value = hero

        heroForm.id = hero.id
        heroForm.title = hero.title
        heroForm.subtitle = hero.subtitle
        heroForm.description = hero.description
        heroForm.image = hero.image
        heroForm.buttonText = hero.buttonText
        heroForm.buttonLink = hero.buttonLink
        heroForm.active = hero.active
    } else {
        editingHero.value = null
    }

    showHeroForm.value = true
}

function closeHeroForm() {
    showHeroForm.value = false
    editingHero.value = null
    resetHeroForm()
}

function saveHero() {
    if (!heroForm.title.trim()) {
        alert('Judul banner wajib diisi.')
        return
    }

    if (editingHero.value) {
        Object.assign(
            editingHero.value,
            JSON.parse(JSON.stringify(heroForm))
        )
    } else {
        const newHero = {
            ...JSON.parse(JSON.stringify(heroForm)),
            id: Date.now(),
            order: content.heroes.length + 1,
        }

        content.heroes.push(newHero)
    }

    closeHeroForm()
}

function deleteHero(id) {
    const confirmed = confirm(
        'Apakah kamu yakin ingin menghapus banner ini?'
    )

    if (!confirmed) return

    const index = content.heroes.findIndex(
        (hero) => hero.id === id
    )

    if (index === -1) return

    content.heroes.splice(index, 1)

    updateHeroOrder()
}

function toggleHero(hero) {
    hero.active = !hero.active
}

function moveHero(index, direction) {
    const targetIndex =
        direction === 'up'
            ? index - 1
            : index + 1

    if (
        targetIndex < 0 ||
        targetIndex >= content.heroes.length
    ) {
        return
    }

    const current = content.heroes[index]

    content.heroes[index] =
        content.heroes[targetIndex]

    content.heroes[targetIndex] = current

    updateHeroOrder()
}

function updateHeroOrder() {
    content.heroes.forEach((hero, index) => {
        hero.order = index + 1
    })
}





function saveContent() {
    console.log('Website content:', JSON.parse(JSON.stringify(content)))

    alert('Perubahan berhasil disimpan (mock).')
}

/*
|--------------------------------------------------------------------------
| Reusable local components
|--------------------------------------------------------------------------
*/

const SectionHeader = defineComponent({
    props: {
        title: String,
        description: String,
    },

    setup(props) {
        return () =>
            h('div', [
                h(
                    'h2',
                    {
                        class: 'text-lg font-bold text-gray-900',
                    },
                    props.title
                ),

                h(
                    'p',
                    {
                        class: 'mt-1 text-sm text-gray-500',
                    },
                    props.description
                ),
            ])
    },
})

const PreviewCard = defineComponent({
    props: {
        title: String,
    },

    setup(props, { slots }) {
        return () =>
            h(
                'div',
                {
                    class: 'rounded-xl border border-gray-200 p-4 sm:p-5',
                },
                [
                    h(
                        'p',
                        {
                            class: 'mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400',
                        },
                        props.title
                    ),

                    slots.default?.(),
                ]
            )
    },
})

const FormInput = defineComponent({
    props: {
        modelValue: String,
        label: String,
        placeholder: String,
        type: {
            type: String,
            default: 'text',
        },
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        return () =>
            h('div', { class: 'space-y-1.5' }, [
                h(
                    'label',
                    {
                        class: 'block text-sm font-medium text-gray-700',
                    },
                    props.label
                ),

                h('input', {
                    type: props.type,
                    value: props.modelValue,
                    placeholder: props.placeholder,
                    class: 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10',
                    onInput: (event) =>
                        emit('update:modelValue', event.target.value),
                }),
            ])
    },
})

const FormTextarea = defineComponent({
    props: {
        modelValue: String,
        label: String,
        placeholder: String,
        rows: {
            type: Number,
            default: 4,
        },
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        return () =>
            h('div', { class: 'space-y-1.5' }, [
                h(
                    'label',
                    {
                        class: 'block text-sm font-medium text-gray-700',
                    },
                    props.label
                ),

                h(
                    'textarea',
                    {
                        rows: props.rows,
                        placeholder: props.placeholder,
                        class: 'w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10',
                        onInput: (event) =>
                            emit(
                                'update:modelValue',
                                event.target.value
                            ),
                    },
                    props.modelValue
                ),
            ])
    },
})

const Toggle = defineComponent({
    props: {
        modelValue: Boolean,
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        return () =>
            h(
                'button',
                {
                    type: 'button',
                    class: [
                        'relative h-6 w-11 rounded-full transition',
                        props.modelValue
                            ? 'bg-[#0052cc]'
                            : 'bg-gray-300',
                    ],

                    onClick: () =>
                        emit('update:modelValue', !props.modelValue),
                },
                [
                    h('span', {
                        class: [
                            'absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition',
                            props.modelValue
                                ? 'left-6'
                                : 'left-1',
                        ],
                    }),
                ]
            )
    },
})

const ContactItem = defineComponent({
    props: {
        icon: String,
        label: String,
        value: String,
    },

    setup(props) {
        return () =>
            h(
                'div',
                {
                    class: 'flex gap-3 rounded-lg border border-gray-200 p-3',
                },
                [
                    h(
                        'div',
                        {
                            class: 'grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50',
                        },
                        props.icon
                    ),

                    h('div', { class: 'min-w-0' }, [
                        h(
                            'p',
                            {
                                class: 'text-xs text-gray-400',
                            },
                            props.label
                        ),

                        h(
                            'p',
                            {
                                class: 'mt-0.5 break-words text-sm font-medium text-gray-800',
                            },
                            props.value
                        ),
                    ]),
                ]
            )
    },
})
</script>