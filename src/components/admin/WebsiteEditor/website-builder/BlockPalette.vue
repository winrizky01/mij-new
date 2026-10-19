
<script setup>
import { computed, ref } from 'vue'
import {
    Search,
    Plus,
    LayoutTemplate,
    Columns3,
    Type,
    AlignLeft,
    Image,
    Images,
    MousePointer2,
    MoveVertical,
    BriefcaseBusiness,
    Newspaper,
    ChartNoAxesColumn,
    ContactRound,
    MessageCircle,
    CircleHelp,
    PanelsTopLeft,
    ClipboardList,
    Map,
    Video,
    ChevronDown,
    ChevronRight,
} from 'lucide-vue-next'

const props = defineProps({
    target: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits(['add-block'])

const search = ref('')
const activeCategory = ref('Semua')
const collapsedCategories = ref([])

const categories = [
    {
        name: 'Layout & Konten',
        blocks: [
            { type: 'container', label: 'Container / Section', description: 'Wadah konten', icon: LayoutTemplate },
            { type: 'columns', label: 'Columns', description: 'Layout beberapa kolom', icon: Columns3 },
            { type: 'heading', label: 'Heading', description: 'Judul dan subjudul', icon: Type },
            { type: 'rich_text', label: 'Rich Text', description: 'Teks berformat', icon: AlignLeft },
            { type: 'image', label: 'Image', description: 'Gambar tunggal', icon: Image },
            { type: 'gallery', label: 'Gallery', description: 'Galeri gambar', icon: Images },
            { type: 'button', label: 'Button / CTA', description: 'Tombol tindakan', icon: MousePointer2 },
            { type: 'spacer_divider', label: 'Spacer / Divider', description: 'Jarak atau garis', icon: MoveVertical },
        ],
    },
    {
        name: 'Konten Dinamis',
        blocks: [
            { type: 'services', label: 'Daftar Layanan', description: 'Data layanan website', icon: BriefcaseBusiness },
            { type: 'articles', label: 'Artikel / Berita', description: 'Daftar artikel', icon: Newspaper },
            { type: 'statistics', label: 'Statistik', description: 'Angka pencapaian', icon: ChartNoAxesColumn },
            { type: 'contact_info', label: 'Contact Info', description: 'Informasi perusahaan', icon: ContactRound },
        ],
    },
    {
        name: 'Interaktif',
        blocks: [
            { type: 'faq', label: 'FAQ / Accordion', description: 'Pertanyaan dan jawaban', icon: CircleHelp },
            { type: 'tabs', label: 'Tabs', description: 'Konten bertab', icon: PanelsTopLeft },
            { type: 'contact_form', label: 'Contact Form', description: 'Formulir pengunjung', icon: ClipboardList },
            { type: 'whatsapp', label: 'WhatsApp CTA', description: 'Hubungi via WhatsApp', icon: MessageCircle },
            { type: 'map_video', label: 'Map / Video', description: 'Peta atau video', icon: Map },
        ],
    },
]

const categoryOptions = computed(() => [
    'Semua',
    ...categories.map(category => category.name),
])

const filteredCategories = computed(() => {
    const keyword = search.value.trim().toLowerCase()

    return categories
        .filter(category =>
            activeCategory.value === 'Semua'
            || category.name === activeCategory.value
        )
        .map(category => ({
            ...category,
            blocks: category.blocks.filter(block =>
                !keyword
                || block.label.toLowerCase().includes(keyword)
                || block.description.toLowerCase().includes(keyword)
            ),
        }))
        .filter(category => category.blocks.length > 0)
})

function toggleCategory(name) {
    collapsedCategories.value = collapsedCategories.value.includes(name)
        ? collapsedCategories.value.filter(item => item !== name)
        : [...collapsedCategories.value, name]
}

function addBlock(block) {
    emit('add-block', {
        type: block.type,
        label: block.label,
        ...(props.target ?? {}),
    })
}
</script>

<template>
    <aside class="flex h-full min-h-0 flex-col bg-white">
        <div class="border-b border-slate-200 p-4">
            <h2 class="text-sm font-bold text-slate-900">
                Tambah Blok
            </h2>
            <p class="mt-1 text-xs leading-5 text-slate-500">
                Pilih elemen untuk ditambahkan ke halaman.
            </p>

            <div class="relative mt-4">
                <Search
                    :size="16"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    v-model="search"
                    type="search"
                    placeholder="Cari blok..."
                    class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
            </div>

            <div class="mt-3 flex gap-1.5 overflow-x-auto pb-1">
                <button
                    v-for="category in categoryOptions"
                    :key="category"
                    type="button"
                    :class="[
                        'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition',
                        activeCategory === category
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                    ]"
                    @click="activeCategory = category"
                >
                    {{ category }}
                </button>
            </div>
        </div>

        <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
            <section
                v-for="category in filteredCategories"
                :key="category.name"
            >
                <button
                    type="button"
                    class="mb-2 flex w-full items-center gap-2 px-1 py-1 text-left"
                    @click="toggleCategory(category.name)"
                >
                    <component
                        :is="collapsedCategories.includes(category.name) ? ChevronRight : ChevronDown"
                        :size="14"
                        class="text-slate-400"
                    />
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {{ category.name }}
                    </span>
                    <span class="ml-auto text-[10px] text-slate-400">
                        {{ category.blocks.length }}
                    </span>
                </button>

                <div
                    v-if="!collapsedCategories.includes(category.name)"
                    class="grid grid-cols-2 gap-2"
                >
                    <button
                        v-for="block in category.blocks"
                        :key="block.type"
                        type="button"
                        class="group relative flex min-h-[98px] flex-col items-start rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-sky-300 hover:bg-sky-50/50"
                        :title="`Tambah ${block.label}`"
                        @click="addBlock(block)"
                    >
                        <span class="mb-3 flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-sky-100 group-hover:text-sky-700">
                            <component :is="block.icon" :size="18" />
                        </span>

                        <span class="text-xs font-semibold leading-4 text-slate-800">
                            {{ block.label }}
                        </span>
                        <span class="mt-1 text-[10px] leading-4 text-slate-500">
                            {{ block.description }}
                        </span>

                        <Plus
                            :size="14"
                            class="absolute right-2 top-2 text-slate-300 transition group-hover:text-sky-600"
                        />
                    </button>
                </div>
            </section>

            <div
                v-if="filteredCategories.length === 0"
                class="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center"
            >
                <Search :size="22" class="mx-auto text-slate-300" />
                <p class="mt-2 text-sm font-medium text-slate-600">
                    Blok tidak ditemukan
                </p>
                <p class="mt-1 text-xs text-slate-400">
                    Coba kata kunci lain.
                </p>
            </div>
        </div>
    </aside>
</template>
