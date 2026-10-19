
<script setup>
import { computed } from 'vue'
import {
    Image as ImageIcon,
    Map,
    Video,
    Plus,
} from 'lucide-vue-next'

const props = defineProps({
    block: { type: Object, required: true },
    selectedBlockId: { type: [String, Number], default: null },
    isPreviewMode: { type: Boolean, default: false },
    depth: { type: Number, default: 0 },
})

const emit = defineEmits(['select', 'add-child'])

const isSelected = computed(() =>
    !props.isPreviewMode &&
    props.selectedBlockId === props.block.id
)

const isLayout = computed(() =>
    ['container', 'columns'].includes(props.block.type)
)

const columnCount = computed(() =>
    Math.max(1, Math.min(6, Number(props.block.columns) || 2))
)

const children = computed(() =>
    (props.block.children ?? []).filter(
        child => child.enabled !== false
    )
)

function columnChildren(index) {
    return children.value.filter(
        child => Number(child.columnIndex ?? 0) === index
    )
}

const gridStyle = computed(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columnCount.value}, minmax(0, 1fr))`,
    gap: `${Math.max(0, Number(props.block.gap) || 0)}px`,
}))

const sectionStyle = computed(() => {
    const block = props.block
    const backgrounds = {
        white: '#ffffff',
        light: '#f3f7fa',
        brand: '#14a2d8',
        dark: '#0f172a',
    }

    return {
        backgroundColor:
            block.backgroundColor ||
            backgrounds[block.background] ||
            '#ffffff',
        textAlign: block.alignment || 'left',
        color: ['brand', 'dark'].includes(block.background)
            ? '#ffffff'
            : '#1e293b',
        paddingTop: `${Math.max(0, Number(block.paddingTop ?? 24))}px`,
        paddingBottom: `${Math.max(0, Number(block.paddingBottom ?? 24))}px`,
    }
})

function label(block) {
    return block.name || block.label || block.type || 'Blok'
}

function selectBlock(event) {
    // Klik kontrol di dalam blok tidak perlu memilih parent.
    if (event.target.closest('[data-block-action]')) return

    emit('select', props.block)
}

function addChild(columnIndex = 0) {
    emit('add-child', {
        parentId: props.block.id,
        columnIndex,
    })
}
</script>

<template>
    <section
        :class="[
            'group relative min-w-0 border-2 px-4 py-6 transition',
            isSelected
                ? 'border-[#14a2d8]'
                : 'border-transparent',
            !isPreviewMode && 'cursor-pointer hover:border-sky-200',
        ]"
        :style="isLayout ? sectionStyle : {}"
        @click.stop="selectBlock"
    >
        <div
            v-if="isSelected"
            class="absolute left-1 top-1 z-10 rounded bg-[#14a2d8] px-2 py-1 text-[9px] font-semibold text-white"
        >
            {{ label(block) }}
        </div>

        <!-- Container -->
        <template v-if="block.type === 'container'">
            <h3
                v-if="block.title"
                class="mb-3 text-xl font-bold"
            >
                {{ block.title }}
            </h3>

            <p
                v-if="block.description"
                class="mb-4 text-sm opacity-80"
            >
                {{ block.description }}
            </p>

            <div
                :class="[
                    'mx-auto w-full',
                    block.maxWidth === 'sm' ? 'max-w-screen-sm' :
                    block.maxWidth === 'md' ? 'max-w-screen-md' :
                    block.maxWidth === 'lg' ? 'max-w-screen-lg' :
                    block.maxWidth === 'full' ? 'max-w-none' :
                    'max-w-screen-xl',
                ]"
            >
                <PreviewBlock
                    v-for="child in children"
                    :key="child.id"
                    :block="child"
                    :selected-block-id="selectedBlockId"
                    :is-preview-mode="isPreviewMode"
                    :depth="depth + 1"
                    @select="emit('select', $event)"
                    @add-child="emit('add-child', $event)"
                />

                <button
                    v-if="!isPreviewMode && children.length === 0"
                    type="button"
                    data-block-action
                    class="w-full rounded-lg border border-dashed border-slate-300 px-3 py-5 text-xs text-slate-500 hover:border-sky-400 hover:text-sky-700"
                    @click.stop="addChild(0)"
                >
                    <Plus :size="14" class="mr-1 inline" />
                    Tambahkan blok ke Container
                </button>
            </div>
        </template>

        <!-- Columns -->
        <template v-else-if="block.type === 'columns'">
            <div :style="gridStyle">
                <div
                    v-for="index in columnCount"
                    :key="index"
                    class="min-w-0 rounded-lg"
                    :class="!isPreviewMode ? 'border border-dashed border-slate-200 p-2' : ''"
                >
                    <PreviewBlock
                        v-for="child in columnChildren(index - 1)"
                        :key="child.id"
                        :block="child"
                        :selected-block-id="selectedBlockId"
                        :is-preview-mode="isPreviewMode"
                        :depth="depth + 1"
                        @select="emit('select', $event)"
                        @add-child="emit('add-child', $event)"
                    />

                    <button
                        v-if="!isPreviewMode && columnChildren(index - 1).length === 0"
                        type="button"
                        data-block-action
                        class="flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-lg text-xs text-slate-400 hover:bg-sky-50 hover:text-sky-700"
                        @click.stop="addChild(index - 1)"
                    >
                        <Plus :size="18" />
                        Tambahkan blok
                        <span class="text-[10px]">
                            Kolom {{ index }}
                        </span>
                    </button>
                </div>
            </div>
        </template>

        <!-- Heading -->
        <template v-else-if="block.type === 'heading'">
            <component
                :is="`h${Math.min(6, Math.max(1, Number(block.level) || 2))}`"
                class="font-bold"
                :class="{
                    'text-3xl': Number(block.level) <= 2,
                    'text-2xl': Number(block.level) === 3,
                    'text-xl': Number(block.level) >= 4,
                }"
            >
                {{ block.title || 'Judul baru' }}
            </component>
        </template>

        <!-- Rich Text -->
        <template v-else-if="block.type === 'rich_text'">
            <h3 v-if="block.title" class="text-xl font-bold">
                {{ block.title }}
            </h3>
            <p class="mt-2 whitespace-pre-line text-sm leading-6 opacity-80">
                {{ block.content || block.description || 'Tulis konten teks di inspector.' }}
            </p>
        </template>

        <!-- Image -->
        <template v-else-if="block.type === 'image'">
            <img
                v-if="block.imageUrl"
                :src="block.imageUrl"
                :alt="block.alt || ''"
                :style="{
                    maxHeight: `${Number(block.maxHeight) || 480}px`,
                    objectFit: block.objectFit || 'cover',
                }"
                class="mx-auto w-full rounded-lg"
            />
            <div
                v-else
                class="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400"
            >
                <ImageIcon :size="18" class="mr-2" />
                Pilih gambar
            </div>
            <p v-if="block.caption" class="mt-2 text-center text-xs opacity-70">
                {{ block.caption }}
            </p>
        </template>

        <!-- Gallery -->
        <template v-else-if="block.type === 'gallery'">
            <h3 v-if="block.title" class="mb-3 text-xl font-bold">
                {{ block.title }}
            </h3>
            <div
                class="grid gap-2"
                :style="{
                    gridTemplateColumns: `repeat(${Math.max(1, Math.min(6, Number(block.columns) || 3))}, minmax(0, 1fr))`,
                }"
            >
                <img
                    v-for="(item, index) in (block.images || [])"
                    :key="index"
                    :src="typeof item === 'string' ? item : item.url"
                    :alt="typeof item === 'string' ? '' : item.alt || ''"
                    class="aspect-square w-full rounded-lg object-cover"
                />
                <div
                    v-if="!block.images?.length"
                    class="col-span-full flex min-h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400"
                >
                    Galeri gambar
                </div>
            </div>
        </template>

        <!-- Button -->
        <template v-else-if="block.type === 'button'">
            <span class="inline-flex rounded-lg bg-[#14a2d8] px-4 py-2.5 text-xs font-semibold text-white">
                {{ block.buttonText || 'Selengkapnya' }}
            </span>
        </template>

        <!-- Spacer / Divider -->
        <template v-else-if="block.type === 'spacer_divider'">
            <div
                v-if="block.variant === 'divider'"
                class="border-t border-slate-300"
                :style="{
                    marginTop: `${Number(block.marginTop) || 0}px`,
                    marginBottom: `${Number(block.marginBottom) || 0}px`,
                }"
            />
            <div
                v-else
                :style="{ height: `${Math.max(0, Number(block.height) || 40)}px` }"
            />
        </template>

        <!-- Services / Articles -->
        <template v-else-if="['services', 'articles'].includes(block.type)">
            <h3 class="text-xl font-bold">
                {{ block.title || (block.type === 'services' ? 'Layanan Kami' : 'Artikel Terbaru') }}
            </h3>
            <p v-if="block.description" class="mt-2 text-sm opacity-70">
                {{ block.description }}
            </p>
            <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div
                    v-for="n in 3"
                    :key="n"
                    class="rounded-lg border border-slate-200 p-3"
                >
                    <div class="h-16 rounded bg-slate-100" />
                    <div class="mt-3 h-2 w-3/4 rounded bg-slate-200" />
                    <div class="mt-2 h-2 rounded bg-slate-100" />
                </div>
            </div>
            <p class="mt-3 text-[10px] opacity-60">
                Preview contoh — belum terhubung ke backend.
            </p>
        </template>

        <!-- Statistics -->
        <template v-else-if="block.type === 'statistics'">
            <h3 v-if="block.title" class="text-xl font-bold">
                {{ block.title }}
            </h3>
            <div class="mt-4 grid grid-cols-3 gap-3">
                <div v-for="n in 3" :key="n">
                    <p class="text-2xl font-bold text-[#14a2d8]">
                        {{ n === 1 ? '10+' : n === 2 ? '50+' : '100+' }}
                    </p>
                    <p class="mt-1 text-xs opacity-70">Contoh statistik</p>
                </div>
            </div>
        </template>

        <!-- Contact Info -->
        <template v-else-if="block.type === 'contact_info'">
            <h3 class="text-xl font-bold">
                {{ block.title || 'Informasi Kontak' }}
            </h3>
            <p class="mt-2 whitespace-pre-line text-sm opacity-80">
                {{ block.description || [block.address, block.phone, block.email, block.hours].filter(Boolean).join('\n') || 'Alamat dan informasi kontak.' }}
            </p>
        </template>

        <!-- FAQ -->
        <template v-else-if="block.type === 'faq'">
            <h3 class="text-xl font-bold">
                {{ block.title || 'Pertanyaan Umum' }}
            </h3>
            <div class="mt-3 space-y-2">
                <div
                    v-for="(item, index) in (block.items || [])"
                    :key="index"
                    class="rounded-lg border border-slate-200 p-3 text-sm"
                >
                    {{ item.question || item.title || `Pertanyaan ${index + 1}` }}
                </div>
                <p v-if="!block.items?.length" class="text-xs opacity-60">
                    Tambahkan pertanyaan melalui inspector.
                </p>
            </div>
        </template>

        <!-- Tabs -->
        <template v-else-if="block.type === 'tabs'">
            <h3 class="text-xl font-bold">
                {{ block.title || 'Informasi Kami' }}
            </h3>
            <div class="mt-3 flex flex-wrap gap-2">
                <span
                    v-for="(item, index) in (block.items || [])"
                    :key="index"
                    class="rounded border border-slate-200 px-3 py-2 text-xs"
                >
                    {{ item.title || item.label || `Tab ${index + 1}` }}
                </span>
                <span v-if="!block.items?.length" class="text-xs opacity-60">
                    Tambahkan tab melalui inspector.
                </span>
            </div>
        </template>

        <!-- Contact Form -->
        <template v-else-if="block.type === 'contact_form'">
            <h3 class="text-xl font-bold">
                {{ block.title || 'Hubungi Kami' }}
            </h3>
            <p v-if="block.description" class="mt-2 text-sm opacity-70">
                {{ block.description }}
            </p>
            <div class="mt-4 space-y-3">
                <div class="h-9 rounded-lg border border-slate-200" />
                <div class="h-9 rounded-lg border border-slate-200" />
                <div class="h-20 rounded-lg border border-slate-200" />
                <span class="inline-flex rounded-lg bg-[#14a2d8] px-4 py-2 text-xs font-semibold text-white">
                    {{ block.submitText || 'Kirim Pesan' }}
                </span>
            </div>
        </template>

        <!-- WhatsApp -->
        <template v-else-if="block.type === 'whatsapp'">
            <h3 class="text-xl font-bold">
                {{ block.title || 'Butuh Bantuan?' }}
            </h3>
            <p class="mt-2 text-sm opacity-70">{{ block.description }}</p>
            <span class="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">
                {{ block.buttonText || 'Chat WhatsApp' }}
            </span>
        </template>

        <!-- Map / Video -->
        <template v-else-if="block.type === 'map_video'">
            <h3 v-if="block.title" class="text-xl font-bold">
                {{ block.title }}
            </h3>
            <div class="mt-3 flex min-h-28 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                <Map v-if="block.mediaType === 'map'" :size="18" class="mr-2" />
                <Video v-else :size="18" class="mr-2" />
                {{ block.mediaType === 'map' ? 'Area peta' : 'Area video' }}
            </div>
        </template>

        <!-- Unknown block -->
        <template v-else>
            <div class="rounded-lg border border-dashed border-slate-300 p-4">
                <p class="text-sm font-semibold">{{ label(block) }}</p>
                <p class="mt-1 text-xs opacity-70">
                    Preview untuk tipe blok ini belum tersedia.
                </p>
            </div>
        </template>
    </section>
</template>
