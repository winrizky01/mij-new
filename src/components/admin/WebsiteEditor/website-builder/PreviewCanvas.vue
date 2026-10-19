
<script setup>
import { computed } from 'vue'
import PreviewBlock from './PreviewBlock.vue'
import {
    Eye,
    Image as ImageIcon,
    MousePointer2,
    Plus,
    Building2,
    Map,
    Video,
} from 'lucide-vue-next'

const props = defineProps({
    page: {
        type: Object,
        default: () => ({
            title: 'Beranda',
            slug: '/',
        }),
    },
    sections: {
        type: Array,
        default: () => [],
    },
    selectedSectionId: {
        type: [String, Number],
        default: null,
    },
    previewMode: {
        type: String,
        default: 'desktop',
    },
    isPreviewMode: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['select', 'add-block'])

const canvasClass = computed(() => {
    if (props.previewMode === 'mobile') {
        return 'max-w-[390px]'
    }

    if (props.previewMode === 'tablet') {
        return 'max-w-[820px]'
    }

    return 'max-w-[1200px]'
})

const visibleSections = computed(() =>
    props.sections.filter(section => section.enabled !== false)
)

function isSelected(section) {
    return !props.isPreviewMode
        && props.selectedSectionId === section.id
}

function sectionStyle(section) {
    const backgrounds = {
        white: '#ffffff',
        light: '#f3f7fa',
        brand: '#14a2d8',
        dark: '#0f172a',
    }

    return {
        backgroundColor: backgrounds[section.background] || '#ffffff',
        textAlign: section.alignment || 'left',
        color: section.background === 'brand' || section.background === 'dark'
            ? '#ffffff'
            : '#1e293b',
    }
}

function sectionLabel(section) {
    return section.name || section.label || section.type || 'Blok'
}

function getColumnCount(section) {
    return Math.max(
        1,
        Math.min(6, Number(section.columns) || 2)
    );
}

function getColumnChildren(section, columnIndex) {
    return (section.children ?? []).filter(
        (child) =>
            child.enabled !== false &&
            Number(child.columnIndex ?? 0) === columnIndex
    );
}

function getGridStyle(section) {
    return {
        display: "grid",
        gridTemplateColumns: `repeat(${getColumnCount(section)}, minmax(0, 1fr))`,
        gap: `${Math.max(0, Number(section.gap) || 0)}px`,
    };
}
</script>

<template>
    <div class="flex h-full min-h-0 flex-col bg-slate-100">
        <div class="flex min-h-12 items-center justify-between border-b border-slate-200 bg-white px-4">
            <div class="flex min-w-0 items-center gap-2">
                <Eye :size="15" class="shrink-0 text-slate-400" />
                <span class="truncate text-xs font-medium text-slate-600">
                    Preview halaman
                </span>
                <span class="hidden rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-500 sm:inline">
                    {{ page.slug || '/' }}
                </span>
            </div>

            <span class="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {{ previewMode }}
            </span>
        </div>

        <div class="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
            <div
                :class="[
                    'mx-auto min-h-full overflow-hidden bg-white shadow-sm transition-all duration-200',
                    canvasClass,
                ]"
            >
                <!-- Simulasi header website -->
                <header class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-8">
                    <div class="flex items-center gap-2">
                        <div class="flex size-9 items-center justify-center rounded-lg bg-[#14a2d8] text-white">
                            <Building2 :size="19" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-900">
                                MANUNGGAL JAYA
                            </p>
                            <p class="text-[9px] tracking-wider text-slate-500">
                                INDONESIA
                            </p>
                        </div>
                    </div>

                    <nav class="hidden items-center gap-5 text-[10px] font-medium text-slate-500 md:flex">
                        <span>Beranda</span>
                        <span>Tentang Kami</span>
                        <span>Layanan</span>
                        <span>Artikel</span>
                        <span>Kontak</span>
                    </nav>

                    <div class="rounded-md bg-[#14a2d8] px-3 py-2 text-[10px] font-semibold text-white">
                        Hubungi Kami
                    </div>
                </header>

                <!-- Isi halaman -->
                <main>
                    <PreviewBlock
                        v-for="section in visibleSections"
                        :key="section.id"
                        :block="section"
                        :selected-block-id="selectedSectionId"
                        :is-preview-mode="isPreviewMode"
                        @select="emit('select', $event)"
                        @add-child="emit('add-block', $event)"
                    />
                    
                    <div
                        v-if="visibleSections.length === 0"
                        class="px-5 py-16 text-center"
                    >
                        <ImageIcon :size="30" class="mx-auto text-slate-300" />
                        <p class="mt-3 text-sm font-semibold text-slate-600">
                            Belum ada blok yang ditampilkan
                        </p>
                        <p class="mt-1 text-xs text-slate-400">
                            Tambahkan blok atau aktifkan blok yang sudah ada.
                        </p>
                    </div>

                    <button
                        v-if="!isPreviewMode"
                        type="button"
                        class="flex w-full items-center justify-center gap-2 border-2 border-dashed border-slate-200 px-4 py-5 text-xs font-medium text-slate-400 transition hover:border-sky-300 hover:text-sky-700"
                        @click="emit('add-block')"
                    >
                        <Plus :size="15" />
                        Tambahkan blok
                    </button>
                </main>

                <footer class="border-t border-slate-100 px-5 py-5 text-center text-[10px] text-slate-400">
                    © {{ new Date().getFullYear() }} Manunggal Jaya Indonesia
                </footer>
            </div>
        </div>
    </div>
</template>
