<template>
    <div class="min-h-[calc(100vh-2rem)] -m-4 bg-slate-50 lg:-m-6">
        <BuilderToolbar
            :page-title="activePage?.title ?? 'Memuat halaman...'"
            :preview-mode="previewMode"
            :is-preview-mode="isPreviewMode"
            :is-saving="isSaving"
            :save-message="saveMessage"
            @back="router.push('/admin/pages')"
            @save="saveDraft"
            @toggle-preview="isPreviewMode = !isPreviewMode"
            @change-preview-mode="previewMode = $event"
        />

        <div class="flex items-center justify-end gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
            <span
                v-if="isPublishing"
                class="text-xs text-slate-500"
            >
                Sedang memublikasikan halaman...
            </span>

            <button
                type="button"
                @click="publishPage"
                :disabled="
                    !activePage ||
                    loadingContent ||
                    loadingPages ||
                    isSaving ||
                    isPublishing
                "
                class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span v-if="isPublishing">Publishing...</span>
                <span v-else>Publish Halaman</span>
            </button>
        </div>

        <div
            class="grid min-h-[calc(100vh-6.5rem)] grid-cols-1"
            :class="isPreviewMode
                ? 'xl:grid-cols-1'
                : 'xl:grid-cols-[260px_minmax(0,1fr)_320px]'"
        >
            <!-- LEFT PANEL -->
            <aside
                v-if="!isPreviewMode"
                class="border-b border-slate-200 bg-white xl:border-b-0 xl:border-r"
            >
                <!-- Page picker -->
                <div class="border-b border-slate-100 p-4">
                    <p class="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Halaman website
                    </p>

                    <label class="block">
                        <span class="sr-only">Pilih halaman</span>
                        <select
                            v-model.number="activePageId"
                            class="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        >
                            <option
                                v-for="page in pages"
                                :key="page.id"
                                :value="page.id"
                            >
                                {{ page.title }} — {{ page.slug }}
                            </option>
                        </select>
                    </label>

                    <div class="mt-3 flex items-center justify-between gap-2">
                        <span class="truncate text-xs text-slate-500">
                            {{ activePage?.slug ?? '-' }}
                        </span>

                        <!-- <span
                            class="shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold"
                            :class="activePage.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'"
                        >
                            {{ activePage?.status === 'published' ? 'Published' : 'Draft' }}
                        </span> -->
                    </div>
                </div>

                <!-- Block palette -->
                <div class="border-b border-slate-100 p-3">
                    <BlockPalette @add-block="handleAddBlock" />
                </div>

                <!-- Block layers -->
                <div class="p-3">
                    <LayersPanel
                        :sections="blocks"
                        :selected-section-id="selectedBlockId"
                        @select="selectBlock"
                        @toggle="toggleBlock"
                        @move="moveBlock"
                        @delete="deleteBlock"
                    />
                </div>
            </aside>

            <!-- CENTER: PREVIEW -->
            <main class="min-w-0 p-4 lg:p-6">
                <div class="mx-auto max-w-[1400px]">
                    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div class="flex items-center gap-2 text-xs text-slate-500">
                                <span>Halaman</span>
                                <span>/</span>
                                <span class="font-medium text-slate-700">
                                    <!-- {{ activePage.title }} -->
                                </span>
                            </div>

                            <h2 class="mt-1 text-lg font-semibold text-slate-900">
                                Pratinjau halaman
                            </h2>

                            <p class="mt-1 text-xs text-slate-500">
                                Pilih blok untuk mengedit konten dan pengaturannya.
                            </p>
                        </div>

                        <div class="flex items-center gap-2">
                            <span
                                v-if="isDirty"
                                class="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700"
                            >
                                Belum disimpan
                            </span>

                            <button
                                type="button"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                @click="isPreviewMode = !isPreviewMode"
                            >
                                {{ isPreviewMode ? 'Kembali ke Editor' : 'Pratinjau Penuh' }}
                            </button>
                        </div>
                    </div>

                    <PreviewCanvas
                        v-if="activePage && !loadingContent"
                        :page="activePage"
                        :sections="blocks"
                        :selected-section-id="selectedBlockId"
                        :preview-mode="previewMode"
                        :is-preview-mode="isPreviewMode"
                        @select="selectBlock"
                        @add-block="handleCanvasAddBlock"
                    />

                    <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                        <span>
                            Pratinjau rancangan — bukan tampilan live website.
                        </span>
                        <span>
                            {{ blockCount }} blok · {{ enabledCount }} aktif
                        </span>
                    </div>
                </div>
            </main>

            <!-- RIGHT: BLOCK INSPECTOR -->
            <aside
                v-if="!isPreviewMode"
                class="border-t border-slate-200 bg-white xl:border-l xl:border-t-0"
            >
                <div class="border-b border-slate-200 p-4">
                    <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Editor blok
                    </p>
                    <h2 class="mt-1 text-sm font-semibold text-slate-900">
                        {{ selectedBlock?.name || 'Belum ada blok dipilih' }}
                    </h2>
                </div>

                <BlockInspector
                    v-if="selectedBlock"
                    :section="selectedBlock"
                    @update-section="handleUpdateBlock"
                    @delete="deleteSelectedBlock"
                    @close="builder.selectBlock(null)"
                />

                <div v-else class="p-6 text-center">
                    <Layers3 class="mx-auto h-8 w-8 text-slate-300" />
                    <p class="mt-2 text-sm font-semibold text-slate-700">
                        Pilih blok
                    </p>
                    <p class="mt-1 text-xs leading-5 text-slate-500">
                        Pilih blok di panel kiri atau klik blok pada pratinjau.
                    </p>
                </div>
            </aside>
        </div>

        <!-- Draft status -->
        <div
            v-if="saveMessage"
            class="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-amber-200 bg-white p-4 shadow-lg"
            role="status"
        >
            <p class="text-sm font-semibold text-slate-800">
                {{ saveMessage }}
            </p>
        </div>

        <!-- Pemilih blok -->
        <div
            v-if="isBlockPickerOpen"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
            @click.self="isBlockPickerOpen = false"
        >
            <section
                class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <header class="flex items-center justify-between border-b border-slate-200 p-4">
                    <div>
                        <h2 class="text-sm font-bold text-slate-900">
                            Pilih blok
                        </h2>
                        <p class="mt-1 text-xs text-slate-500">
                            {{
                                pendingInsertTarget
                                    ? 'Blok akan ditambahkan ke Container atau kolom yang dipilih.'
                                    : 'Blok akan ditambahkan ke halaman.'
                            }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-100"
                        @click="isBlockPickerOpen = false; pendingInsertTarget = null"
                    >
                        Tutup
                    </button>
                </header>

                <div class="min-h-0 flex-1 overflow-y-auto p-3">
                    <BlockPalette @add-block="handleAddBlock" />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layers3 } from 'lucide-vue-next'

import BuilderToolbar from '../../components/admin/WebsiteEditor/website-builder/BuilderToolbar.vue'
import BlockPalette from '../../components/admin/WebsiteEditor/website-builder/BlockPalette.vue'
import LayersPanel from '../../components/admin/WebsiteEditor/website-builder/LayersPanel.vue'
import PreviewCanvas from '../../components/admin/WebsiteEditor/website-builder/PreviewCanvas.vue'
import BlockInspector from '../../components/admin/WebsiteEditor/website-builder/BlockInspector.vue'

import {
    BLOCK_REGISTRY,
    createBlock,
} from '../../components/admin/WebsiteEditor/config/blockRegistry'

import { useWebsiteBuilder } from '../../components/admin/WebsiteEditor/composables/useWebsiteBuilder'
import { adminApi, getApiError } from '@/services/api'

const route = useRoute()
const router = useRouter()

// --------------------------------------------------
// STATE
// --------------------------------------------------

const pages = ref([])
const activePageId = ref(null)
let autoSaveTimer = null

const AUTO_SAVE_DELAY = 1000
const loadingPages = ref(false)
const loadingContent = ref(false)
const isSaving = ref(false)
const isPublishing = ref(false)

const pageError = ref('')
const saveMessage = ref('')

const previewMode = ref('desktop')
const isPreviewMode = ref(false)

const activePage = computed(() =>
    pages.value.find(
        page => String(page.id) === String(activePageId.value)
    ) ?? null
)

// Builder selalu diinisialisasi dengan array kosong.
// Tidak bergantung pada data API atau ID halaman saat startup.
const builder = useWebsiteBuilder([])

const isBlockPickerOpen = ref(false)
const pendingInsertTarget = ref(null)

const {
    blocks,
    selectedBlockId,
    selectedBlock,
    blockCount,
    enabledBlocks,
    isDirty,
} = builder

const enabledCount = computed(() => enabledBlocks.value.length)

let messageTimer = null
let contentRequestId = 0
let loadedPageId = null
let disposed = false

// --------------------------------------------------
// NORMALISASI RESPONS API
// Mendukung respons helper API dan Laravel paginator/resource.
// --------------------------------------------------

function unwrapResponse(response) {
    let result = response?.data ?? response

    if (
        result?.data &&
        !Array.isArray(result.data) &&
        typeof result.data === 'object'
    ) {
        result = result.data
    }

    return result
}

function getPageList(response) {
    const result = unwrapResponse(response)

    if (Array.isArray(result)) {
        return result
    }

    return Array.isArray(result?.data)
        ? result.data
        : []
}

// --------------------------------------------------
// NORMALISASI BLOK EDITOR
// --------------------------------------------------

function normalizeDraftBlocks(rawBlocks) {
    if (!Array.isArray(rawBlocks)) {
        return []
    }

    return rawBlocks.flatMap(item => {
        if (
            !item ||
            typeof item !== 'object' ||
            !BLOCK_REGISTRY[item.type]
        ) {
            console.warn(
                'Blok draft dilewati karena tipenya tidak dikenal:',
                item?.type
            )
            return []
        }

        try {
            return [createBlock(item.type, item)]
        } catch (error) {
            console.warn('Blok draft tidak valid:', error)
            return []
        }
    })
}

function normalizePublicSections(sections) {
    if (!Array.isArray(sections)) {
        return []
    }

    return sections.flatMap(section => {
        if (
            !section ||
            typeof section !== 'object' ||
            !BLOCK_REGISTRY[section.type]
        ) {
            console.warn(
                'Section publik dilewati karena tipenya tidak dikenal:',
                section?.type
            )
            return []
        }

        const settings = (
            section.settings &&
            typeof section.settings === 'object' &&
            !Array.isArray(section.settings)
        )
            ? section.settings
            : {}

        const overrides = {
            ...settings,

            // ID database dipakai sebagai ID awal blok.
            // createBlock akan mempertahankan ID ini.
            id: String(section.id),

            name:
                settings.name ??
                section.name ??
                section.title ??
                BLOCK_REGISTRY[section.type].defaults.name,

            title:
                settings.title ??
                section.title ??
                BLOCK_REGISTRY[section.type].defaults.title ??
                '',

            description:
                settings.description ??
                section.subtitle ??
                '',

            content:
                settings.content ??
                section.content ??
                '',

            imageUrl:
                settings.imageUrl ??
                section.image ??
                '',

            buttonText:
                settings.buttonText ??
                section.button_text ??
                '',

            url:
                settings.url ??
                section.button_url ??
                '',

            enabled:
                section.is_active == null
                    ? (settings.enabled ?? true)
                    : Boolean(section.is_active),
        }

        try {
            return [createBlock(section.type, overrides)]
        } catch (error) {
            console.warn('Section publik tidak dapat dikonversi:', error)
            return []
        }
    })
}


function restoreImageSliderFromPublicSections(draftBlocks, sections) {
    const slider = draftBlocks.find(
        block => block.type === 'image_slider'
    )

    if (!slider) return draftBlocks

    const currentImages = Array.isArray(slider.images)
        ? slider.images
        : []

    // Jangan menimpa gambar yang sudah tersimpan di draft.
    const hasExistingImages = currentImages.some(image => {
        if (typeof image === 'string') {
            return image.trim() !== ''
        }

        return Boolean(image?.imageUrl || image?.url)
    })

    if (hasExistingImages) return draftBlocks

    const heroSections = (sections ?? [])
        .filter(section =>
            section.type === 'hero' &&
            section.is_active &&
            section.image
        )
        .sort((a, b) => a.sort_order - b.sort_order)

    if (!heroSections.length) return draftBlocks

    slider.images = heroSections.map(section => ({
        imageUrl: section.image,
        alt: section.title ?? '',
        title: section.title ?? '',
        description: section.content ?? '',
        buttonText: section.settings?.buttonText ?? '',
        buttonUrl: section.settings?.buttonUrl ?? '',
        newTab: false,
    }))

    console.info(
        '[WebsiteEditor] Gambar slider dipulihkan:',
        slider.images.length
    )

    return draftBlocks
}


// --------------------------------------------------
// MUAT ISI SATU HALAMAN
// Draft yang ada selalu didahulukan daripada konten publik.
// --------------------------------------------------

async function loadPageContent(pageId) {
    if (!pageId) {
        builder.replaceBlocks([])
        builder.markSaved()
        loadedPageId = null
        return
    }

    const requestId = ++contentRequestId

    loadingContent.value = true
    pageError.value = ''

    try {
        
        const response = await adminApi.website.pages.show(pageId)

        // Buka wrapper respons API secara bertahap.
        let result = response

        for (let i = 0; i < 3; i++) {
            if (
                result &&
                typeof result === 'object' &&
                !Array.isArray(result) &&
                result.data &&
                typeof result.data === 'object'
            ) {
                result = result.data
            } else {
                break
            }
        }

        if (result?.success === false) {
            throw new Error(
                result.message || 'API gagal memuat isi halaman.'
            )
        }

        // Ambil detail halaman dari respons.
        const detail = result?.data ?? result

        console.log('[WebsiteEditor] Respons detail:', response)
        console.log('[WebsiteEditor] Detail halaman:', detail)
        console.log('[WebsiteEditor] Draft:', detail?.draft)

        if (
            !detail ||
            typeof detail !== 'object' ||
            !Array.isArray(detail.sections)
        ) {
            console.error(
                '[WebsiteEditor] Format detail tidak sesuai:',
                detail
            )

            throw new Error('Respons detail halaman tidak sesuai.')
        }

        const draftContent = detail.draft?.content ?? null

        let blocks = []

        if (draftContent !== null && draftContent !== undefined) {
            let parsedContent = draftContent

            // Jika kolom JSON dikembalikan sebagai string, parse terlebih dahulu.
            if (typeof parsedContent === 'string') {
                try {
                    parsedContent = JSON.parse(parsedContent)
                } catch {
                    throw new Error(
                        'Format JSON draft tidak valid.'
                    )
                }
            }

            const draftBlocks = Array.isArray(parsedContent)
                ? parsedContent
                : parsedContent?.blocks

            if (!Array.isArray(draftBlocks)) {
                throw new Error(
                    'Draft ditemukan, tetapi format bloknya tidak valid.'
                )
            }

            blocks = normalizeDraftBlocks(draftBlocks)

            blocks = restoreImageSliderFromPublicSections(
                blocks,
                detail.sections
            )

        } else {
            // Belum ada draft, jadi gunakan konten publik sebagai awal editor.
            blocks = normalizePublicSections(detail.sections)

            console.log(
                '[WebsiteEditor] Draft tidak ditemukan; memakai konten publik.'
            )
        }

        if (disposed || requestId !== contentRequestId) return

        builder.replaceBlocks(blocks)
        builder.selectBlock(null)

        activePageId.value = pageId
        loadedPageId = String(pageId)

    } catch (error) {
        if (disposed || requestId !== contentRequestId) {
            return
        }

        console.error('Gagal memuat isi halaman:', error)
        pageError.value =
            getApiError(error)?.message ||
            error.message ||
            'Gagal memuat isi halaman.'

        // Jangan menampilkan konten halaman sebelumnya sebagai
        // seolah-olah itu konten halaman yang sedang dipilih.
        builder.replaceBlocks([])
        builder.markSaved()
        loadedPageId = null
    } finally {
        if (!disposed && requestId === contentRequestId) {
            loadingContent.value = false
        }
    }
}

// --------------------------------------------------
// MUAT DAFTAR HALAMAN
// --------------------------------------------------

async function loadPages() {
    loadingPages.value = true
    pageError.value = ''

    try {
        const response = await adminApi.website.pages.list({
            per_page: 100,
        })

        if (disposed) return

        pages.value = getPageList(response)

        if (!pages.value.length) {
            activePageId.value = null
            loadedPageId = null

            // Batalkan request detail yang mungkin masih berjalan.
            contentRequestId++

            builder.replaceBlocks([])
            builder.markSaved()

            pageError.value = 'Belum ada halaman website di database.'
            return
        }

        const requestedId = String(route.query.page_id ?? '')

        const selectedPage = pages.value.find(
            page => String(page.id) === requestedId
        ) ?? pages.value[0]

        activePageId.value = selectedPage.id

        if (requestedId !== String(selectedPage.id)) {
            await router.replace({
                query: {
                    ...route.query,
                    page_id: String(selectedPage.id),
                },
            })
        }

        /*
         * Panggil langsung jika halaman yang dipilih sama dengan
         * halaman aktif saat ini. Jika berbeda, watcher di bawah
         * yang akan memuatnya.
         */
        if (String(loadedPageId) === String(selectedPage.id)) {
            await loadPageContent(selectedPage.id)
        }
    } catch (error) {
        console.error('Gagal memuat daftar halaman:', error)

        if (!disposed) {
            pageError.value =
                getApiError(error)?.message ||
                'Gagal memuat daftar halaman.'

            pages.value = []
            activePageId.value = null
            builder.replaceBlocks([])
            builder.markSaved()
        }
    } finally {
        if (!disposed) {
            loadingPages.value = false
        }
    }
}

// --------------------------------------------------
// PERPINDAHAN HALAMAN
// --------------------------------------------------

watch(activePageId, async (nextPageId, previousPageId) => {
    if (String(nextPageId ?? '') === String(previousPageId ?? '')) {
        return
    }

    // Jangan menyimpan snapshot ke halaman lain.
    // Setiap halaman dimuat ulang dari server sebagai sumber utama.
    if (!nextPageId) {
        contentRequestId++
        loadedPageId = null
        builder.replaceBlocks([])
        builder.markSaved()
        return
    }

    await loadPageContent(nextPageId)

    if (disposed) return

    const queryPageId = String(route.query.page_id ?? '')

    if (queryPageId !== String(nextPageId)) {
        await router.replace({
            query: {
                ...route.query,
                page_id: String(nextPageId),
            },
        })
    }
})

// Navigasi browser atau link lain yang mengganti query page_id.
watch(
    () => route.query.page_id,
    value => {
        if (!pages.value.length) return

        const requestedId = String(value ?? '')

        const page = pages.value.find(
            item => String(item.id) === requestedId
        )

        if (page && String(page.id) !== String(activePageId.value)) {
            activePageId.value = page.id
        }
    }
)

// --------------------------------------------------
// LIFECYCLE
// --------------------------------------------------

onMounted(() => {
    loadPages()
})

onBeforeUnmount(() => {
    disposed = true
    contentRequestId++

    if (messageTimer) {
        clearTimeout(messageTimer)
        messageTimer = null
    }

    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
        autoSaveTimer = null
    }
})

// --------------------------------------------------
// BLOK: TAMBAH, PILIH, UPDATE, PINDAH, HAPUS
// --------------------------------------------------

function syncSelectedBlock() {
    if (!builder.blocks.value.some(
        block => block.id === selectedBlockId.value
    )) {
        builder.selectBlock(
            builder.blocks.value[0]?.id ?? null
        )
    }
}

function handleCanvasAddBlock(payload) {
    // Klik tombol tambah di dalam Container/Columns.
    if (payload?.parentId != null) {
        pendingInsertTarget.value = {
            parentId: payload.parentId,
            columnIndex: Number(payload.columnIndex ?? 0),
        }

        isBlockPickerOpen.value = true
        return
    }

    // Klik tombol tambah umum di bawah canvas.
    pendingInsertTarget.value = null
    isBlockPickerOpen.value = true
}

function handleAddBlock(payload) {
    // Palette mengirim { type, label }.
    const type = typeof payload === 'string'
        ? payload
        : payload?.type

    if (!type) return
    if (!activePage.value || loadingContent.value) return

    try {
        const target = isBlockPickerOpen.value
            ? pendingInsertTarget.value
            : null

        const block = target
            ? builder.addChildBlock(
                target.parentId,
                type,
                { columnIndex: target.columnIndex }
            )
            : builder.addBlock(type)

        if (!block) {
            showMessage(
                'Target Container atau Columns tidak ditemukan.'
            )
            return
        }

        isBlockPickerOpen.value = false
        pendingInsertTarget.value = null

        saveMessage.value = ''
        selectBlock(block.id)
    } catch (error) {
        console.error('Gagal menambahkan blok:', error)
        showMessage(error.message || 'Gagal menambahkan blok.')
    }
}

function selectBlock(value) {
    const id = typeof value === 'object'
        ? value?.id
        : value

    builder.selectBlock(id ?? null)
}

function handleUpdateBlock(payload) {
    if (!payload?.id || !payload?.patch) return
    if (loadingContent.value || !activePage.value) return

    const patch = { ...payload.patch }

    // Kompatibilitas dengan inspector yang memakai buttonUrl.
    if (
        Object.prototype.hasOwnProperty.call(patch, 'buttonUrl') &&
        !Object.prototype.hasOwnProperty.call(patch, 'url')
    ) {
        patch.url = patch.buttonUrl
    }

    builder.updateBlock(payload.id, patch)
    saveMessage.value = ''
}

function toggleBlock(value) {
    const id = typeof value === 'object'
        ? value?.id
        : value

    if (!id || loadingContent.value || !activePage.value) return

    builder.toggleBlock(id)
    saveMessage.value = ''
}

function moveBlock(payload, directionArg) {
    const id = typeof payload === 'object'
        ? payload?.id
        : payload

    const direction = typeof payload === 'object'
        ? payload?.direction
        : directionArg

    if (
        !id ||
        !Number.isFinite(Number(direction)) ||
        loadingContent.value ||
        !activePage.value
    ) {
        return
    }

    builder.moveBlock(id, Number(direction))
    saveMessage.value = ''
}

function deleteBlock(value) {
    const id = typeof value === 'object'
        ? value?.id
        : value

    if (!id || loadingContent.value || !activePage.value) return

    builder.deleteBlock(id)
    syncSelectedBlock()
    saveMessage.value = ''
}

function deleteSelectedBlock() {
    if (!selectedBlock.value) return
    deleteBlock(selectedBlock.value.id)
}

// --------------------------------------------------
// PESAN
// --------------------------------------------------

function showMessage(message) {
    saveMessage.value = message

    if (messageTimer) {
        clearTimeout(messageTimer)
    }

    messageTimer = setTimeout(() => {
        saveMessage.value = ''
        messageTimer = null
    }, 4500)
}

function scheduleAutoSave() {
    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
        autoSaveTimer = null
    }

    if (
        disposed ||
        loadingContent.value ||
        loadingPages.value ||
        isSaving.value ||
        !activePageId.value ||
        !activePage.value
    ) {
        return
    }

    autoSaveTimer = setTimeout(() => {
        autoSaveTimer = null
        saveDraft({ silent: true })
    }, AUTO_SAVE_DELAY)
}

// --------------------------------------------------
// SIMPAN DRAFT KE DATABASE
// Tidak menyentuh website_sections atau konten publik.
// --------------------------------------------------
async function saveDraft({ silent = false } = {}) {
    const pageId = activePageId.value

    if (
        !pageId ||
        !activePage.value ||
        loadingContent.value ||
        loadingPages.value ||
        isSaving.value
    ) {
        return false
    }

    if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
        autoSaveTimer = null
    }

    isSaving.value = true

    if (!silent) {
        pageError.value = ''
        saveMessage.value = ''
    }

    const savingPageId = String(pageId)
    const payload = builder.getBlocksPayload()
    const savedSnapshot = JSON.stringify(payload)

    console.log(
        '[DEBUG] Image Slider Payload:',
        JSON.stringify(
            payload.filter((block) => block.type === 'image_slider'),
            null,
            2
        )
    );

    try {
        await adminApi.website.pages.saveDraft(pageId, payload)

        if (disposed) return false

        const unchanged =
            JSON.stringify(builder.getBlocksPayload()) === savedSnapshot

        const samePage =
            String(activePageId.value) === savingPageId

        if (samePage && unchanged) {
            builder.markSaved()

            if (!silent) {
                showMessage('Draft berhasil disimpan ke database.')
            }

            return true
        }

        if (!silent) {
            showMessage(
                'Ada perubahan baru. Simpan kembali sebelum publish.'
            )
        }

        return false
    } catch (error) {
        console.error('Gagal menyimpan draft:', error)

        if (!disposed) {
            pageError.value =
                getApiError(error)?.message ||
                'Draft gagal disimpan.'

            if (!silent) {
                showMessage('Draft gagal disimpan.')
            }
        }

        return false
    } finally {
        isSaving.value = false

        if (
            !disposed &&
            String(activePageId.value) === savingPageId &&
            JSON.stringify(builder.getBlocksPayload()) !== savedSnapshot
        ) {
            scheduleAutoSave()
        }
    }
}

async function publishPage() {
    const pageId = activePageId.value

    if (
        !pageId ||
        !activePage.value ||
        loadingContent.value ||
        loadingPages.value ||
        isSaving.value ||
        isPublishing.value
    ) {
        return
    }

    const confirmed = window.confirm(
        `Publish halaman "${activePage.value.title}"? Perubahan akan tampil di website publik.`
    )

    if (!confirmed) return

    isPublishing.value = true
    pageError.value = ''
    saveMessage.value = ''

    try {
        // Pastikan tidak ada timer autosave yang tertunda.
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer)
            autoSaveTimer = null
        }

        // Simpan draft terlebih dahulu.
        const saved = await saveDraft({ silent: true })

        if (!saved) {
            throw new Error(
                'Draft belum berhasil disimpan. Periksa perubahan lalu coba lagi.'
            )
        }

        // Jangan publish jika halaman aktif berubah.
        if (String(activePageId.value) !== String(pageId)) {
            throw new Error('Halaman aktif berubah. Silakan coba kembali.')
        }

        // Publish draft melalui backend Laravel.
        const response = await adminApi.website.pages.publish(pageId)

        const result = response?.data?.data ?? response?.data

        if (response?.data?.success === false) {
            throw new Error(
                response.data.message || 'Publish gagal.'
            )
        }

        // Muat ulang konten setelah publish berhasil.
        await loadPageContent(pageId)

        if (pageError.value) {
            throw new Error(
                'Publish berhasil, tetapi editor gagal memuat ulang data.'
            )
        }

        showMessage(
            result?.message || 'Halaman berhasil dipublikasikan.'
        )
    } catch (error) {
        console.error('Gagal publish halaman:', error)

        pageError.value =
            getApiError(error)?.message ||
            error?.response?.data?.message ||
            error?.message ||
            'Gagal memublikasikan halaman.'
    } finally {
        isPublishing.value = false
    }
}

watch(
    blocks,
    () => {
        if (loadingContent.value || loadingPages.value) return

        saveMessage.value = ''
        scheduleAutoSave()
    },
    {
        deep: true,
        flush: 'sync',
    }
)
</script>