<template>
    <header
        :class="[
            'sticky top-0 z-50 transition-all duration-300',
            isScrolled
                ? 'border-b border-gray-100 bg-white/90 py-3 shadow-lg shadow-gray-900/5 backdrop-blur-md'
                : 'border-b border-gray-100 bg-white py-4',
        ]"
    >
        <nav
            class="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8"
        >
            <!-- Logo -->
            <a
                href="#home"
                class="group flex items-center gap-3.5 text-xl font-bold tracking-tight"
            >
                <div
                    class="relative flex h-12 w-12 shrink-0 items-center justify-center"
                >
                    <img
                        src="/icon.png"
                        alt="Manunggal Jasa Investindo Logo"
                        class="h-full w-full object-contain drop-shadow-sm transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-[0_0_12px_rgba(0,82,204,0.4)]"
                    />

                    <div
                        class="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:left-full group-hover:opacity-100"
                    />
                </div>

                <div class="flex flex-col">
                    <span
                        class="text-xl font-bold leading-none text-[#003366] transition-colors duration-300 group-hover:text-[#0052cc]"
                    >
                        Manunggal
                    </span>

                    <span
                        class="mt-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 transition-colors duration-300 group-hover:text-[#fd2029]"
                    >
                        Jasa Investindo
                    </span>
                </div>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden items-center gap-1 md:flex lg:gap-2">
                <a
                    href="#home"
                    class="rounded-lg px-4 py-2 text-md font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50/60 hover:text-[#0052cc]"
                >
                    Beranda
                </a>

                <a
                    href="#about"
                    class="rounded-lg px-4 py-2 text-md font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50/60 hover:text-[#0052cc]"
                >
                    Tentang Kami
                </a>

                <!-- Services Dropdown -->
                <div
                    class="relative"
                    @mouseenter="servicesDropdownOpen = true"
                    @mouseleave="servicesDropdownOpen = false"
                >
                    <a
                        href="#services"
                        class="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-md font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50/60 hover:text-[#0052cc]"
                    >
                        <span>Layanan</span>

                        <svg
                            :class="[
                                'h-4 w-4 transition-transform duration-200',
                                servicesDropdownOpen
                                    ? 'rotate-180 text-[#0052cc]'
                                    : 'text-gray-400',
                            ]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </a>

                    <Transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="translate-y-2 opacity-0"
                        enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="translate-y-0 opacity-100"
                        leave-to-class="translate-y-2 opacity-0"
                    >
                        <div
                            v-if="servicesDropdownOpen"
                            class="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-2 lg:w-96"
                        >
                            <div
                                class="rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl shadow-blue-950/10 ring-1 ring-black/5"
                            >
                                <a
                                    v-for="service in services"
                                    :key="service.name"
                                    href="#services"
                                    class="group/item flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-blue-50/80"
                                >
                                    <div
                                        class="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gray-50 text-xl transition-transform duration-200 group-hover/item:scale-110 group-hover/item:bg-white group-hover/item:shadow-sm"
                                    >
                                        {{ service.icon }}
                                    </div>

                                    <div>
                                        <p
                                            class="text-sm font-semibold text-gray-900 transition-colors group-hover/item:text-[#0052cc]"
                                        >
                                            {{ service.name }}
                                        </p>

                                        <p
                                            class="mt-0.5 line-clamp-1 text-xs text-gray-500"
                                        >
                                            {{ service.description }}
                                        </p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </Transition>
                </div>

                <a
                    href="#contact"
                    class="rounded-lg px-4 py-2 text-md font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50/60 hover:text-[#0052cc]"
                >
                    Kontak
                </a>
            </div>

            <!-- CTA -->
            <div class="hidden items-center gap-3 md:flex">
                <a
                    href="#contact"
                    class="group inline-flex items-center justify-center overflow-hidden rounded-xl bg-[#0052cc] px-6 py-2.5 text-md font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:bg-[#003d99] hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
                >
                    <span>Hubungi Kami</span>

                    <svg
                        class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </a>
            </div>

            <!-- Mobile Toggle -->
            <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 transition-colors hover:bg-gray-100 active:scale-95 md:hidden"
                :aria-expanded="mobileMenuOpen"
                aria-label="Buka menu navigasi"
                @click="mobileMenuOpen = !mobileMenuOpen"
            >
                <svg
                    v-if="!mobileMenuOpen"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>

                <svg
                    v-else
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </nav>

        <!-- Mobile Menu -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="-translate-y-4 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-4 opacity-0"
        >
            <div
                v-if="mobileMenuOpen"
                class="border-t border-gray-100 bg-white/95 px-5 py-5 backdrop-blur-xl md:hidden"
            >
                <div class="mx-auto flex max-w-7xl flex-col gap-2">
                    <a
                        v-for="item in mobileMenu"
                        :key="item.label"
                        :href="item.href"
                        class="flex items-center rounded-xl px-4 py-3 text-base font-medium text-gray-800 transition hover:bg-blue-50 hover:text-[#0052cc]"
                        @click="mobileMenuOpen = false"
                    >
                        {{ item.label }}
                    </a>

                    <div class="mt-3 border-t border-gray-100 pt-3">
                        <a
                            href="#contact"
                            class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0052cc] py-3.5 text-center font-semibold text-white shadow-md shadow-blue-500/20 active:scale-95"
                            @click="mobileMenuOpen = false"
                        >
                            <span>Hubungi Kami</span>

                            <svg
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </Transition>
    </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const mobileMenuOpen = ref(false)
const servicesDropdownOpen = ref(false)
const isScrolled = ref(false)

const services = [
    {
        icon: '🚚',
        name: 'Trucking',
        description:
            'Layanan pengiriman dan logistik terpercaya ke seluruh nusantara dengan armada modern dan profesional.',
    },
    {
        icon: '💻',
        name: 'Software House',
        description:
            'Pengembangan software custom, web application, dan sistem informasi sesuai kebutuhan bisnis Anda.',
    },
    {
        icon: '🔧',
        name: 'Panggil Tukang',
        description:
            'Platform aplikasi mobile untuk menemukan tukang profesional terverifikasi dengan rating dan review terbaik.',
    },
    {
        icon: '📱',
        name: 'Digital Marketing',
        description:
            'Layanan manajemen media sosial, content creation, dan kampanye digital yang terukur dan efektif.',
    },
]

const mobileMenu = [
    {
        label: 'Beranda',
        href: '#home',
    },
    {
        label: 'Tentang Kami',
        href: '#about',
    },
    {
        label: 'Layanan',
        href: '#services',
    },
    {
        label: 'Kontak',
        href: '#contact',
    },
]

function handleScroll() {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>