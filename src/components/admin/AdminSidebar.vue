<template>
    <aside
        class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col
               border-r border-slate-800 bg-[#071A36] text-white
               transition-transform duration-300 ease-in-out
               lg:static lg:z-auto lg:translate-x-0"
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
        <!-- BRAND -->
        <div
            class="flex h-[72px] shrink-0 items-center gap-3
                   border-b border-white/10 px-5"
        >
            <div
                class="grid h-10 w-10 shrink-0 place-items-center
                       rounded-xl bg-blue-600 text-xl font-extrabold
                       shadow-lg shadow-blue-950/30"
            >
                M
            </div>

            <div class="min-w-0 flex-1">
                <h1 class="truncate text-sm font-bold tracking-wide">
                    MANUNGGAL
                </h1>
                <p
                    class="mt-0.5 truncate text-[10px] font-medium
                           tracking-[0.16em] text-blue-300"
                >
                    JASA INVESTINDO
                </p>
            </div>

            <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400
                       transition hover:bg-white/10 hover:text-white
                       lg:hidden"
                aria-label="Tutup sidebar"
                @click="closeMobile"
            >
                <X :size="19" />
            </button>
        </div>

        <!-- NAVIGATION -->
        <nav class="flex-1 space-y-7 overflow-y-auto px-3 py-6">
            <!-- MENU UTAMA -->
            <div>
                <p
                    class="mb-2 px-3 text-[10px] font-bold
                           uppercase tracking-[0.16em] text-slate-500"
                >
                    Menu Utama
                </p>

                <RouterLink
                    to="/admin/dashboard"
                    :class="linkClass('/admin/dashboard')"
                    @click="closeMobile"
                >
                    <LayoutDashboard :size="19" />
                    <span class="flex-1">Dashboard</span>
                </RouterLink>
            </div>

            <!-- PENGELOLAAN WEBSITE -->
            <div>
                <p
                    class="mb-2 px-3 text-[10px] font-bold
                           uppercase tracking-[0.16em] text-slate-500"
                >
                    Pengelolaan Website
                </p>

                <RouterLink
                    to="/admin/pages"
                    :class="linkClass('/admin/pages')"
                    @click="closeMobile"
                >
                    <FileStack :size="19" />
                    <span class="flex-1">Halaman Website</span>
                </RouterLink>

                <RouterLink
                    to="/admin/website-editor"
                    :class="linkClass('/admin/website-editor')"
                    @click="closeMobile"
                >
                    <PanelsTopLeft :size="19" />
                    <span class="flex-1">Editor Website</span>
                </RouterLink>

                <RouterLink
                    to="/admin/navigation"
                    :class="linkClass('/admin/navigation')"
                    @click="closeMobile"
                >
                    <ListTree :size="19" />
                    <span class="flex-1">Menu Navigasi</span>
                </RouterLink>

                <RouterLink
                    to="/admin/services"
                    :class="linkClass('/admin/services')"
                    @click="closeMobile"
                >
                    <BriefcaseBusiness :size="19" />
                    <span class="flex-1">Layanan</span>
                </RouterLink>

                <RouterLink
                    to="/admin/articles"
                    :class="linkClass('/admin/articles')"
                    @click="closeMobile"
                >
                    <FileText :size="19" />
                    <span class="flex-1">Artikel</span>
                </RouterLink>

                <RouterLink
                    to="/admin/media"
                    :class="linkClass('/admin/media')"
                    @click="closeMobile"
                >
                    <Images :size="19" />
                    <span class="flex-1">Media</span>
                </RouterLink>

                <RouterLink
                    to="/admin/inquiries"
                    :class="linkClass('/admin/inquiries')"
                    @click="closeMobile"
                >
                    <Inbox :size="19" />
                    <span class="flex-1">Pesan &amp; Kontak</span>

                    <span
                        v-if="unreadMessages > 0"
                        class="min-w-5 rounded-full bg-rose-500 px-1.5
                               py-0.5 text-center text-[10px]
                               font-bold text-white"
                    >
                        {{ unreadMessages > 99 ? '99+' : unreadMessages }}
                    </span>
                </RouterLink>
            </div>

            <!-- ANALITIK -->
            <div>
                <p
                    class="mb-2 px-3 text-[10px] font-bold
                           uppercase tracking-[0.16em] text-slate-500"
                >
                    Analitik
                </p>

                <RouterLink
                    to="/admin/traffic"
                    :class="linkClass('/admin/traffic')"
                    @click="closeMobile"
                >
                    <ChartNoAxesCombined :size="19" />
                    <span class="flex-1">Trafik Website</span>
                </RouterLink>
            </div>

            <!-- MANAJEMEN -->
            <div>
                <p
                    class="mb-2 px-3 text-[10px] font-bold
                           uppercase tracking-[0.16em] text-slate-500"
                >
                    Manajemen
                </p>

                <RouterLink
                    to="/admin/users"
                    :class="linkClass('/admin/users')"
                    @click="closeMobile"
                >
                    <Users :size="19" />
                    <span class="flex-1">Pengguna</span>
                </RouterLink>
            </div>

            <!-- SISTEM -->
            <div>
                <p
                    class="mb-2 px-3 text-[10px] font-bold
                           uppercase tracking-[0.16em] text-slate-500"
                >
                    Sistem
                </p>

                <RouterLink
                    to="/admin/settings"
                    :class="linkClass('/admin/settings')"
                    @click="closeMobile"
                >
                    <Settings :size="19" />
                    <span class="flex-1">Pengaturan</span>
                </RouterLink>
            </div>
        </nav>

        <!-- ADMIN PROFILE -->
        <div class="shrink-0 border-t border-white/10 p-3">
            <div
                class="flex items-center gap-3 rounded-xl border
                       border-white/5 bg-white/[0.04] p-3"
            >
                <div
                    class="grid h-10 w-10 shrink-0 place-items-center
                           rounded-full bg-blue-600/20 text-sm
                           font-bold text-blue-300 ring-1
                           ring-blue-400/20"
                >
                    {{ adminInitials }}
                </div>

                <div class="min-w-0 flex-1">
                    <p class="truncate text-xs font-semibold text-white">
                        {{ adminName }}
                    </p>
                    <p class="mt-1 truncate text-[10px] text-slate-400">
                        {{ adminEmail }}
                    </p>
                </div>

                <span
                    class="h-2 w-2 shrink-0 rounded-full bg-emerald-400"
                    title="Sesi aktif"
                ></span>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
    X,
    LayoutDashboard,
    Inbox,
    FileStack,
    PanelsTopLeft,
    ListTree,
    BriefcaseBusiness,
    FileText,
    Images,
    Users,
    ChartNoAxesCombined,
    Settings,
} from 'lucide-vue-next'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    unreadMessages: {
        type: Number,
        default: 0,
    },
    user: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits(['close'])
const route = useRoute()

const adminName = computed(() =>
    props.user?.name || 'Admin MJI'
)

const adminEmail = computed(() =>
    props.user?.email || 'Administrator'
)

const adminInitials = computed(() => {
    const words = adminName.value.trim().split(/\s+/)

    return words
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase() || 'AD'
})

function closeMobile() {
    emit('close')
}

function linkClass(path) {
    const active = path === '/admin/dashboard'
        ? route.path === path
        : route.path === path || route.path.startsWith(`${path}/`)

    return [
        'group mb-1 flex min-h-11 w-full items-center gap-3',
        'rounded-lg px-3 py-2.5 text-[13px] font-medium',
        'transition-all duration-200',
        active
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/30'
            : 'text-slate-300 hover:bg-white/[0.07] hover:text-white',
    ]
}
</script>
