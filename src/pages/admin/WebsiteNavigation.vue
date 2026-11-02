<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
    Menu,
    Plus,
    Pencil,
    Trash2,
    Save,
    X,
    ChevronUp,
    ChevronDown,
    ExternalLink,
    FileText,
    Folder,
    Link as LinkIcon,
    LoaderCircle,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
} from 'lucide-vue-next'

import { adminApi, getApiError } from '@/services/api'

const menus = ref([])
const pages = ref([])
const selectedMenuId = ref(null)
const selectedMenu = ref(null)
const items = ref([])

const loading = ref(false)
const saving = ref(false)
const savingOrder = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const showMenuModal = ref(false)
const showItemModal = ref(false)
const editingMenuId = ref(null)
const editingItemId = ref(null)

const menuForm = ref({
    name: '',
    location: 'header',
    is_active: true,
})

const itemForm = ref({
    label: '',
    type: 'page',
    parent_id: null,
    page_id: null,
    url: '',
    target: '_self',
    icon: '',
    is_active: true,
})

const isEditingMenu = computed(() => !!editingMenuId.value)
const isEditingItem = computed(() => !!editingItemId.value)

const availableParents = computed(() => {
    if (!editingItemId.value) {
        return items.value.filter(item => item.type === 'dropdown')
    }

    return items.value.filter(item =>
        item.type === 'dropdown' &&
        Number(item.id) !== Number(editingItemId.value)
    )
})

const rootItems = computed(() => {
    return items.value.filter(item => !item.parent_id)
})

function childrenOf(parentId) {
    return items.value.filter(
        item => Number(item.parent_id) === Number(parentId)
    )
}

function getItemTypeLabel(type) {
    return {
        page: 'Halaman',
        url: 'URL',
        dropdown: 'Dropdown',
    }[type] || type
}

function getPageTitle(pageId) {
    const page = pages.value.find(
        item => Number(item.id) === Number(pageId)
    )

    return page?.title || page?.name || 'Halaman tidak ditemukan'
}

function clearMessages() {
    errorMessage.value = ''
    successMessage.value = ''
}

function showError(error, fallback = 'Terjadi kesalahan.') {
    errorMessage.value = getApiError(error) || fallback
}

async function loadMenus() {
    loading.value = true
    clearMessages()

    try {
        const response = await adminApi.website.navigation.list()

        console.log('Navigation response:', response)

        // Mendukung dua format:
        // Axios response: response.data.data
        // Direct response: response.data
        const result = response?.data?.data
            ?? response?.data
            ?? []

        menus.value = Array.isArray(result) ? result : []

        if (selectedMenuId.value) {
            const exists = menus.value.some(
                menu => Number(menu.id) === Number(selectedMenuId.value)
            )

            if (!exists) {
                selectedMenuId.value = null
                selectedMenu.value = null
                items.value = []
            }
        }

        if (!selectedMenuId.value && menus.value.length) {
            selectedMenuId.value = menus.value[0].id
        }

        if (selectedMenuId.value) {
            await loadMenuDetail(selectedMenuId.value)
        }
    } catch (error) {
        console.error('Load navigation error:', error)
        showError(error, 'Gagal memuat daftar menu.')
    } finally {
        loading.value = false
    }
}

async function loadPages() {
    try {
        const response = await adminApi.website.pages.list({
            limit: 1000,
        })

        const result = response?.data?.data
            ?? response?.data
            ?? []

        pages.value = Array.isArray(result)
            ? result
            : result?.data || []
    } catch (error) {
        console.error('Gagal memuat halaman website:', error)
    }
}

async function loadMenuDetail(menuId) {
    if (!menuId) return

    try {
        const response = await adminApi.website.navigation.show(menuId)

        const menu = response?.data?.data
            ?? response?.data
            ?? null

        selectedMenu.value = menu

        items.value = (menu?.items || []).map(item => ({
            ...item,
            parent_id: item.parent_id || null,
        }))
    } catch (error) {
        console.error('Load menu detail error:', error)
        showError(error, 'Gagal memuat detail menu.')
    }
}

async function selectMenu(menuId) {
    selectedMenuId.value = menuId
    await loadMenuDetail(menuId)
}

function openCreateMenu() {
    editingMenuId.value = null

    menuForm.value = {
        name: '',
        location: 'header',
        is_active: true,
    }

    clearMessages()
    showMenuModal.value = true
}

function openEditMenu(menu) {
    editingMenuId.value = menu.id

    menuForm.value = {
        name: menu.name,
        location: menu.location,
        is_active: menu.is_active,
    }

    clearMessages()
    showMenuModal.value = true
}

async function saveMenu() {
    if (!menuForm.value.name.trim()) {
        errorMessage.value = 'Nama menu wajib diisi.'
        return
    }

    saving.value = true
    clearMessages()

    try {
        let response

        if (isEditingMenu.value) {
            response = await adminApi.website.navigation.update(
                editingMenuId.value,
                menuForm.value
            )
        } else {
            response = await adminApi.website.navigation.create(
                menuForm.value
            )
        }

        const savedMenu = response.data?.data

        showMenuModal.value = false
        successMessage.value = isEditingMenu.value
            ? 'Menu berhasil diperbarui.'
            : 'Menu berhasil dibuat.'

        await loadMenus()

        if (savedMenu?.id) {
            await selectMenu(savedMenu.id)
        }
    } catch (error) {
        showError(error, 'Gagal menyimpan menu.')
    } finally {
        saving.value = false
    }
}

async function deleteMenu(menu) {
    const confirmed = window.confirm(
        `Hapus menu "${menu.name}" beserta seluruh item di dalamnya?`
    )

    if (!confirmed) return

    clearMessages()

    try {
        await adminApi.website.navigation.delete(menu.id)

        successMessage.value = 'Menu berhasil dihapus.'
        selectedMenuId.value = null
        selectedMenu.value = null
        items.value = []

        await loadMenus()
    } catch (error) {
        showError(error, 'Gagal menghapus menu.')
    }
}

function openCreateItem(parentId = null) {
    editingItemId.value = null

    itemForm.value = {
        label: '',
        type: 'page',
        parent_id: parentId,
        page_id: null,
        url: '',
        target: '_self',
        icon: '',
        is_active: true,
    }

    clearMessages()
    showItemModal.value = true
}

function openEditItem(item) {
    editingItemId.value = item.id

    itemForm.value = {
        label: item.label || '',
        type: item.type || 'page',
        parent_id: item.parent_id || null,
        page_id: item.page_id || null,
        url: item.url || '',
        target: item.target || '_self',
        icon: item.icon || '',
        is_active: item.is_active,
    }

    clearMessages()
    showItemModal.value = true
}

async function saveItem() {
    clearMessages()

    if (!selectedMenuId.value) {
        errorMessage.value = 'Pilih menu terlebih dahulu.'
        return
    }

    if (!itemForm.value.label.trim()) {
        errorMessage.value = 'Label menu wajib diisi.'
        return
    }

    if (itemForm.value.type === 'page' && !itemForm.value.page_id) {
        errorMessage.value = 'Silakan pilih halaman.'
        return
    }

    if (itemForm.value.type === 'url' && !itemForm.value.url.trim()) {
        errorMessage.value = 'URL wajib diisi.'
        return
    }

    if (itemForm.value.type === 'dropdown' && itemForm.value.parent_id) {
        errorMessage.value = 'Dropdown tidak boleh menjadi submenu.'
        return
    }

    const payload = {
        ...itemForm.value,
        parent_id: itemForm.value.parent_id || null,
        page_id: itemForm.value.type === 'page'
            ? itemForm.value.page_id
            : null,
        url: itemForm.value.type === 'url'
            ? itemForm.value.url
            : null,
        target: itemForm.value.target || '_self',
    }

    saving.value = true

    try {
        if (isEditingItem.value) {
            await adminApi.website.navigation.updateItem(
                selectedMenuId.value,
                editingItemId.value,
                payload
            )

            successMessage.value = 'Item menu berhasil diperbarui.'
        } else {
            await adminApi.website.navigation.createItem(
                selectedMenuId.value,
                payload
            )

            successMessage.value = 'Item menu berhasil ditambahkan.'
        }

        showItemModal.value = false
        await loadMenuDetail(selectedMenuId.value)
    } catch (error) {
        showError(error, 'Gagal menyimpan item menu.')
    } finally {
        saving.value = false
    }
}

async function deleteItem(item) {
    const confirmed = window.confirm(
        `Hapus item "${item.label}"?`
    )

    if (!confirmed) return

    clearMessages()

    try {
        await adminApi.website.navigation.deleteItem(
            selectedMenuId.value,
            item.id
        )

        successMessage.value = 'Item menu berhasil dihapus.'
        await loadMenuDetail(selectedMenuId.value)
    } catch (error) {
        showError(error, 'Gagal menghapus item menu.')
    }
}

function flattenItems(list, parentId = null, result = []) {
    const currentItems = list
        .filter(item => Number(item.parent_id || 0) === Number(parentId || 0))
        .sort((a, b) => a.sort_order - b.sort_order)

    for (const item of currentItems) {
        result.push({
            id: item.id,
            parent_id: item.parent_id || null,
            sort_order: result.length,
        })

        flattenItems(list, item.id, result)
    }

    return result
}

async function saveOrder() {
    if (!selectedMenuId.value) return

    savingOrder.value = true
    clearMessages()

    try {
        const orderedItems = flattenItems(items.value)

        await adminApi.website.navigation.reorder(
            selectedMenuId.value,
            orderedItems
        )

        successMessage.value = 'Urutan menu berhasil disimpan.'
        await loadMenuDetail(selectedMenuId.value)
    } catch (error) {
        showError(error, 'Gagal menyimpan urutan menu.')
    } finally {
        savingOrder.value = false
    }
}

function moveItem(item, direction, parentId = null) {
    const siblings = items.value
        .filter(row => Number(row.parent_id || 0) === Number(parentId || 0))
        .sort((a, b) => a.sort_order - b.sort_order)

    const index = siblings.findIndex(
        row => Number(row.id) === Number(item.id)
    )

    const nextIndex = index + direction

    if (index < 0 || nextIndex < 0 || nextIndex >= siblings.length) {
        return
    }

    const current = siblings[index]
    siblings[index] = siblings[nextIndex]
    siblings[nextIndex] = current

    siblings.forEach((row, i) => {
        const target = items.value.find(
            item => Number(item.id) === Number(row.id)
        )

        if (target) target.sort_order = i
    })

    items.value = [...items.value]
}

function closeItemModal() {
    showItemModal.value = false
}

watch(
    () => itemForm.value.type,
    type => {
        if (type === 'dropdown') {
            itemForm.value.page_id = null
            itemForm.value.url = ''
            itemForm.value.parent_id = null
        }

        if (type === 'page') {
            itemForm.value.url = ''
        }

        if (type === 'url') {
            itemForm.value.page_id = null
        }
    }
)

onMounted(async () => {
    await Promise.all([
        loadPages(),
        loadMenus(),
    ])
})
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div class="flex items-center gap-2">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <Menu :size="20" />
                    </div>

                    <div>
                        <h1 class="text-xl font-semibold text-gray-900">
                            Header & Navigation
                        </h1>
                        <p class="text-sm text-gray-500">
                            Kelola menu navigasi website dan dropdown.
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                @click="openCreateMenu"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
            >
                <Plus :size="17" />
                Buat Menu
            </button>
        </div>

        <!-- Alerts -->
        <div
            v-if="errorMessage"
            class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
            <AlertCircle :size="18" />
            {{ errorMessage }}
        </div>

        <div
            v-if="successMessage"
            class="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
            <CheckCircle2 :size="18" />
            {{ successMessage }}
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <!-- Menu List -->
            <aside class="lg:col-span-4">
                <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div class="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                        <div>
                            <h2 class="font-semibold text-gray-900">
                                Daftar Menu
                            </h2>
                            <p class="text-xs text-gray-500">
                                Header dan Footer
                            </p>
                        </div>

                        <button
                            type="button"
                            @click="loadMenus"
                            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            title="Muat ulang"
                        >
                            <RefreshCw :size="16" />
                        </button>
                    </div>

                    <div v-if="loading" class="flex justify-center py-10">
                        <LoaderCircle class="animate-spin text-sky-600" />
                    </div>

                    <div
                        v-else-if="!menus.length"
                        class="px-4 py-10 text-center"
                    >
                        <Menu class="mx-auto mb-3 text-gray-300" :size="32" />
                        <p class="text-sm font-medium text-gray-700">
                            Belum ada menu
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                            Buat menu Header atau Footer terlebih dahulu.
                        </p>
                    </div>

                    <div v-else class="divide-y divide-gray-100">
                        <button
                            v-for="menu in menus"
                            :key="menu.id"
                            type="button"
                            @click="selectMenu(menu.id)"
                            class="w-full px-4 py-4 text-left transition hover:bg-gray-50"
                            :class="selectedMenuId === menu.id ? 'bg-sky-50' : ''"
                        >
                            <div class="flex items-center justify-between gap-3">
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2">
                                        <span class="truncate text-sm font-semibold text-gray-900">
                                            {{ menu.name }}
                                        </span>

                                        <span
                                            v-if="!menu.is_active"
                                            class="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500"
                                        >
                                            Nonaktif
                                        </span>
                                    </div>

                                    <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                        <span class="capitalize">
                                            {{ menu.location }}
                                        </span>
                                        <span>·</span>
                                        <span>{{ menu.items_count || 0 }} item</span>
                                    </div>
                                </div>

                                <ChevronDown
                                    v-if="selectedMenuId === menu.id"
                                    class="rotate-[-90deg] text-sky-600"
                                    :size="17"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- Menu Editor -->
            <main class="lg:col-span-8">
                <div
                    v-if="!selectedMenu"
                    class="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center"
                >
                    <Folder class="mb-3 text-gray-300" :size="36" />
                    <h3 class="font-semibold text-gray-800">
                        Pilih menu
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Pilih menu dari daftar untuk mengelola item navigasi.
                    </p>
                </div>

                <div
                    v-else
                    class="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                    <!-- Editor Header -->
                    <div class="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div class="flex items-center gap-2">
                                <h2 class="text-lg font-semibold text-gray-900">
                                    {{ selectedMenu.name }}
                                </h2>

                                <span class="rounded-md bg-sky-50 px-2 py-1 text-xs font-medium capitalize text-sky-700">
                                    {{ selectedMenu.location }}
                                </span>
                            </div>

                            <p class="mt-1 text-xs text-gray-500">
                                Susun item navigasi dan submenu.
                            </p>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                @click="openEditMenu(selectedMenu)"
                                class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <Pencil :size="15" />
                                Edit Menu
                            </button>

                            <button
                                type="button"
                                @click="deleteMenu(selectedMenu)"
                                class="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <Trash2 :size="15" />
                                Hapus
                            </button>
                        </div>
                    </div>

                    <!-- Items -->
                    <div class="p-5">
                        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900">
                                    Struktur Navigasi
                                </h3>
                                <p class="text-xs text-gray-500">
                                    Gunakan tombol panah untuk mengatur urutan.
                                </p>
                            </div>

                            <button
                                type="button"
                                @click="openCreateItem()"
                                class="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
                            >
                                <Plus :size="16" />
                                Tambah Item
                            </button>
                        </div>

                        <div
                            v-if="!items.length"
                            class="rounded-lg border border-dashed border-gray-200 py-12 text-center"
                        >
                            <Menu class="mx-auto mb-2 text-gray-300" :size="30" />
                            <p class="text-sm font-medium text-gray-700">
                                Menu masih kosong
                            </p>
                            <p class="mt-1 text-xs text-gray-500">
                                Tambahkan halaman, URL, atau dropdown.
                            </p>
                        </div>

                        <div v-else class="space-y-3">
                            <div
                                v-for="(item, index) in rootItems"
                                :key="item.id"
                                class="rounded-lg border border-gray-200"
                            >
                                <!-- Root Item -->
                                <div class="flex items-center gap-3 p-3">
                                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                                        <Folder v-if="item.type === 'dropdown'" :size="17" />
                                        <FileText v-else-if="item.type === 'page'" :size="17" />
                                        <LinkIcon v-else :size="17" />
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span class="truncate text-sm font-medium text-gray-900">
                                                {{ item.label }}
                                            </span>

                                            <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                                                {{ getItemTypeLabel(item.type) }}
                                            </span>

                                            <span
                                                v-if="!item.is_active"
                                                class="rounded bg-red-50 px-2 py-0.5 text-[10px] text-red-600"
                                            >
                                                Nonaktif
                                            </span>
                                        </div>

                                        <p class="mt-1 truncate text-xs text-gray-500">
                                            <template v-if="item.type === 'page'">
                                                {{ getPageTitle(item.page_id) }}
                                            </template>
                                            <template v-else-if="item.type === 'url'">
                                                {{ item.url }}
                                            </template>
                                            <template v-else>
                                                Dropdown / submenu
                                            </template>
                                        </p>
                                    </div>

                                    <div class="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            @click="moveItem(item, -1)"
                                            :disabled="index === 0"
                                            class="rounded p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                                            title="Naik"
                                        >
                                            <ChevronUp :size="16" />
                                        </button>

                                        <button
                                            type="button"
                                            @click="moveItem(item, 1)"
                                            :disabled="index === rootItems.length - 1"
                                            class="rounded p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                                            title="Turun"
                                        >
                                            <ChevronDown :size="16" />
                                        </button>

                                        <button
                                            v-if="item.type === 'dropdown'"
                                            type="button"
                                            @click="openCreateItem(item.id)"
                                            class="rounded p-2 text-sky-600 hover:bg-sky-50"
                                            title="Tambah submenu"
                                        >
                                            <Plus :size="16" />
                                        </button>

                                        <button
                                            type="button"
                                            @click="openEditItem(item)"
                                            class="rounded p-2 text-gray-500 hover:bg-gray-100"
                                            title="Edit"
                                        >
                                            <Pencil :size="15" />
                                        </button>

                                        <button
                                            type="button"
                                            @click="deleteItem(item)"
                                            class="rounded p-2 text-red-500 hover:bg-red-50"
                                            title="Hapus"
                                        >
                                            <Trash2 :size="15" />
                                        </button>
                                    </div>
                                </div>

                                <!-- Children -->
                                <div
                                    v-if="childrenOf(item.id).length"
                                    class="space-y-2 border-t border-gray-100 bg-gray-50 p-3 pl-8"
                                >
                                    <div
                                        v-for="(child, childIndex) in childrenOf(item.id)"
                                        :key="child.id"
                                        class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
                                    >
                                        <div class="h-2 w-2 shrink-0 rounded-full bg-sky-500" />

                                        <div class="min-w-0 flex-1">
                                            <div class="flex flex-wrap items-center gap-2">
                                                <span class="truncate text-sm font-medium text-gray-800">
                                                    {{ child.label }}
                                                </span>

                                                <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                                                    {{ getItemTypeLabel(child.type) }}
                                                </span>
                                            </div>

                                            <p class="mt-1 truncate text-xs text-gray-500">
                                                <template v-if="child.type === 'page'">
                                                    {{ getPageTitle(child.page_id) }}
                                                </template>
                                                <template v-else>
                                                    {{ child.url }}
                                                </template>
                                            </p>
                                        </div>

                                        <div class="flex shrink-0 items-center gap-1">
                                            <button
                                                type="button"
                                                @click="moveItem(child, -1, item.id)"
                                                :disabled="childIndex === 0"
                                                class="rounded p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                                            >
                                                <ChevronUp :size="15" />
                                            </button>

                                            <button
                                                type="button"
                                                @click="moveItem(child, 1, item.id)"
                                                :disabled="childIndex === childrenOf(item.id).length - 1"
                                                class="rounded p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                                            >
                                                <ChevronDown :size="15" />
                                            </button>

                                            <button
                                                type="button"
                                                @click="openEditItem(child)"
                                                class="rounded p-2 text-gray-500 hover:bg-gray-100"
                                            >
                                                <Pencil :size="15" />
                                            </button>

                                            <button
                                                type="button"
                                                @click="deleteItem(child)"
                                                class="rounded p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 :size="15" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="items.length"
                            class="mt-5 flex justify-end border-t border-gray-100 pt-4"
                        >
                            <button
                                type="button"
                                @click="saveOrder"
                                :disabled="savingOrder"
                                class="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
                            >
                                <LoaderCircle
                                    v-if="savingOrder"
                                    class="animate-spin"
                                    :size="16"
                                />
                                <Save v-else :size="16" />
                                Simpan Urutan
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Menu Modal -->
        <div
            v-if="showMenuModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @click.self="showMenuModal = false"
        >
            <div class="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h3 class="font-semibold text-gray-900">
                        {{ isEditingMenu ? 'Edit Menu' : 'Buat Menu Baru' }}
                    </h3>

                    <button
                        type="button"
                        @click="showMenuModal = false"
                        class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                    >
                        <X :size="18" />
                    </button>
                </div>

                <form @submit.prevent="saveMenu" class="space-y-4 p-5">
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Nama Menu
                        </label>
                        <input
                            v-model="menuForm.name"
                            type="text"
                            placeholder="Contoh: Main Navigation"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Lokasi Menu
                        </label>
                        <select
                            v-model="menuForm.location"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        >
                            <option value="header">Header</option>
                            <option value="footer">Footer</option>
                        </select>
                    </div>

                    <label class="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            v-model="menuForm.is_active"
                            type="checkbox"
                            class="rounded border-gray-300 text-sky-600"
                        />
                        Aktifkan menu
                    </label>

                    <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            @click="showMenuModal = false"
                            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="saving"
                            class="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
                        >
                            <LoaderCircle v-if="saving" class="animate-spin" :size="16" />
                            <Save v-else :size="16" />
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Item Modal -->
        <div
            v-if="showItemModal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
            @click.self="closeItemModal"
        >
            <div class="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl">
                <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h3 class="font-semibold text-gray-900">
                        {{ isEditingItem ? 'Edit Item Menu' : 'Tambah Item Menu' }}
                    </h3>

                    <button
                        type="button"
                        @click="closeItemModal"
                        class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                    >
                        <X :size="18" />
                    </button>
                </div>

                <form @submit.prevent="saveItem" class="space-y-4 p-5">
                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Label Menu
                        </label>
                        <input
                            v-model="itemForm.label"
                            type="text"
                            placeholder="Contoh: Tentang Kami"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Jenis Item
                        </label>
                        <select
                            v-model="itemForm.type"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        >
                            <option value="page">Halaman Website</option>
                            <option value="url">URL / Custom Link</option>
                            <option value="dropdown">Dropdown</option>
                        </select>
                    </div>

                    <div v-if="itemForm.type === 'page'">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Pilih Halaman
                        </label>
                        <select
                            v-model="itemForm.page_id"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        >
                            <option :value="null">
                                -- Pilih Halaman --
                            </option>
                            <option
                                v-for="page in pages"
                                :key="page.id"
                                :value="page.id"
                            >
                                {{ page.title || page.name }} 
                                <template v-if="page.slug">
                                    ({{ page.slug }})
                                </template>
                            </option>
                        </select>
                    </div>

                    <div v-if="itemForm.type === 'url'">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            URL
                        </label>
                        <input
                            v-model="itemForm.url"
                            type="text"
                            placeholder="/contact atau https://example.com"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        />
                    </div>

                    <div v-if="itemForm.type !== 'dropdown'">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Target Link
                        </label>
                        <select
                            v-model="itemForm.target"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        >
                            <option value="_self">Tab yang sama</option>
                            <option value="_blank">Tab baru</option>
                        </select>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Icon (Opsional)
                        </label>
                        <input
                            v-model="itemForm.icon"
                            type="text"
                            placeholder="Contoh: house, users, phone"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        />
                        <p class="mt-1 text-xs text-gray-400">
                            Isi nama icon Lucide jika ingin menampilkan icon.
                        </p>
                    </div>

                    <div v-if="itemForm.type !== 'dropdown' && availableParents.length">
                        <label class="mb-1.5 block text-sm font-medium text-gray-700">
                            Induk Menu
                        </label>
                        <select
                            v-model="itemForm.parent_id"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                        >
                            <option :value="null">Menu Utama</option>
                            <option
                                v-for="parent in availableParents"
                                :key="parent.id"
                                :value="parent.id"
                            >
                                {{ parent.label }}
                            </option>
                        </select>
                    </div>

                    <label class="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            v-model="itemForm.is_active"
                            type="checkbox"
                            class="rounded border-gray-300 text-sky-600"
                        />
                        Aktifkan item menu
                    </label>

                    <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            @click="closeItemModal"
                            class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="saving"
                            class="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
                        >
                            <LoaderCircle v-if="saving" class="animate-spin" :size="16" />
                            <Save v-else :size="16" />
                            Simpan Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>