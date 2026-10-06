<template>
    <div class="space-y-6">

        <!-- HEADER -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-xl font-bold text-gray-900 sm:text-2xl">
                    General Master Data
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola data referensi umum yang digunakan oleh sistem ERP.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0043a8] disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="loading"
                @click="openForm()"
            >
                <span class="text-lg leading-none">+</span>
                Tambah {{ activeMaster.label }}
            </button>
        </div>


        <!-- ERROR -->
        <div
            v-if="error"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
            {{ error }}
        </div>


        <!-- SUMMARY -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">

            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <p class="text-xs font-medium text-gray-500">
                    Total Data
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ currentItems.length }}
                </p>
            </div>


            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <p class="text-xs font-medium text-gray-500">
                    Aktif
                </p>

                <p class="mt-2 text-2xl font-bold text-green-600">
                    {{ activeCount }}
                </p>
            </div>


            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <p class="text-xs font-medium text-gray-500">
                    Nonaktif
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-500">
                    {{ inactiveCount }}
                </p>
            </div>


            <div class="rounded-xl border border-gray-200 bg-white p-4">
                <p class="text-xs font-medium text-gray-500">
                    Ditampilkan
                </p>

                <p class="mt-2 text-2xl font-bold text-[#0052cc]">
                    {{ filteredItems.length }}
                </p>
            </div>

        </div>


        <!-- MASTER TABS -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">

            <div class="overflow-x-auto border-b border-gray-200">
                <div class="flex min-w-max">

                    <button
                        v-for="master in masters"
                        :key="master.key"
                        type="button"
                        class="relative px-5 py-4 text-sm font-medium transition"
                        :class="
                            activeTab === master.key
                                ? 'text-[#0052cc]'
                                : 'text-gray-500 hover:text-gray-900'
                        "
                        @click="changeTab(master.key)"
                    >
                        <span class="mr-2">
                            {{ master.icon }}
                        </span>

                        {{ master.label }}

                        <span
                            class="ml-2 rounded-full px-2 py-0.5 text-[10px]"
                            :class="
                                activeTab === master.key
                                    ? 'bg-blue-50 text-[#0052cc]'
                                    : 'bg-gray-100 text-gray-500'
                            "
                        >
                            {{ master.count }}
                        </span>

                        <span
                            v-if="activeTab === master.key"
                            class="absolute inset-x-0 bottom-0 h-0.5 bg-[#0052cc]"
                        ></span>
                    </button>

                </div>
            </div>


            <!-- TOOLBAR -->
            <div
                class="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="relative w-full sm:max-w-sm">

                    <span
                        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                        🔍
                    </span>

                    <input
                        v-model="search"
                        type="text"
                        :placeholder="`Cari ${activeMaster.label.toLowerCase()}...`"
                        class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#0052cc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                </div>


                <select
                    v-model="statusFilter"
                    class="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#0052cc]"
                >
                    <option value="all">
                        Semua Status
                    </option>

                    <option value="active">
                        Aktif
                    </option>

                    <option value="inactive">
                        Nonaktif
                    </option>
                </select>

            </div>


            <!-- LOADING -->
            <div
                v-if="loading"
                class="flex items-center justify-center px-5 py-16"
            >
                <div class="flex items-center gap-3 text-sm text-gray-500">
                    <div
                        class="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#0052cc]"
                    ></div>

                    Memuat data...
                </div>
            </div>


            <!-- TABLE -->
            <div
                v-else
                class="overflow-x-auto"
            >
                <table class="w-full min-w-[700px] text-left">

                    <thead>
                        <tr class="border-b border-gray-100 bg-gray-50">

                            <th
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Kode
                            </th>

                            <th
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Nama
                            </th>

                            <th
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Keterangan
                            </th>

                            <th
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Urutan
                            </th>

                            <th
                                class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Aksi
                            </th>

                        </tr>
                    </thead>


                    <tbody class="divide-y divide-gray-100">

                        <tr
                            v-for="item in filteredItems"
                            :key="item.id"
                            class="transition hover:bg-gray-50"
                        >

                            <td class="px-5 py-4">

                                <span
                                    class="font-mono text-xs font-semibold text-gray-700"
                                >
                                    {{ item.code }}
                                </span>

                            </td>


                            <td class="px-5 py-4">

                                <p class="text-sm font-semibold text-gray-900">
                                    {{ item.name }}
                                </p>

                            </td>


                            <td class="px-5 py-4">

                                <p
                                    class="max-w-md truncate text-sm text-gray-500"
                                >
                                    {{ item.description || '-' }}
                                </p>

                            </td>


                            <td class="px-5 py-4">

                                <span
                                    class="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-700"
                                >
                                    {{ item.sort_order }}
                                </span>

                            </td>


                            <td class="px-5 py-4">

                                <span
                                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="
                                        item.is_active
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                    "
                                >

                                    <span
                                        class="h-1.5 w-1.5 rounded-full"
                                        :class="
                                            item.is_active
                                                ? 'bg-green-500'
                                                : 'bg-gray-400'
                                        "
                                    ></span>

                                    {{
                                        item.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'
                                    }}

                                </span>

                            </td>


                            <td class="px-5 py-4">

                                <div class="flex justify-end gap-1">

                                    <!-- EDIT -->
                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-[#0052cc] disabled:opacity-50"
                                        title="Edit"
                                        :disabled="saving"
                                        @click="openForm(item)"
                                    >
                                        ✏️
                                    </button>


                                    <!-- STATUS -->
                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-yellow-50 hover:text-yellow-600 disabled:opacity-50"
                                        :title="
                                            item.is_active
                                                ? 'Nonaktifkan'
                                                : 'Aktifkan'
                                        "
                                        :disabled="saving"
                                        @click="toggleStatus(item)"
                                    >
                                        {{
                                            item.is_active
                                                ? '⏸️'
                                                : '▶️'
                                        }}
                                    </button>


                                    <!-- DELETE -->
                                    <button
                                        type="button"
                                        class="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                        title="Hapus"
                                        :disabled="saving"
                                        @click="deleteItem(item)"
                                    >
                                        🗑️
                                    </button>

                                </div>

                            </td>

                        </tr>


                        <!-- EMPTY -->
                        <tr v-if="filteredItems.length === 0">

                            <td
                                colspan="6"
                                class="px-5 py-16 text-center"
                            >

                                <div class="text-4xl">
                                    📂
                                </div>

                                <p class="mt-3 text-sm font-semibold text-gray-700">
                                    Data tidak ditemukan
                                </p>

                                <p class="mt-1 text-xs text-gray-400">
                                    Coba ubah pencarian atau tambahkan data baru.
                                </p>

                            </td>

                        </tr>

                    </tbody>

                </table>
            </div>

        </div>


        <!-- FORM MODAL -->
        <div
            v-if="showForm"
            class="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
            @click.self="closeForm"
        >

            <div
                class="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
            >

                <!-- MODAL HEADER -->
                <div
                    class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4"
                >

                    <div>

                        <h2 class="text-base font-bold text-gray-900">
                            {{ editingItem ? 'Edit' : 'Tambah' }}
                            {{ activeMaster.label }}
                        </h2>

                        <p class="mt-0.5 text-xs text-gray-400">
                            Isi informasi data referensi.
                        </p>

                    </div>


                    <button
                        type="button"
                        class="grid h-9 w-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        @click="closeForm"
                    >
                        ✕
                    </button>

                </div>


                <!-- FORM -->
                <form
                    class="space-y-4 p-5"
                    @submit.prevent="saveItem"
                >

                    <!-- CODE -->
                    <div>

                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Kode
                            <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="form.code"
                            type="text"
                            placeholder="Contoh: AST-0001"
                            :disabled="saving"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                        />

                    </div>


                    <!-- NAME -->
                    <div>

                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Nama
                            <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="Nama data"
                            :disabled="saving"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                        />

                    </div>


                    <!-- DESCRIPTION -->
                    <div>

                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Keterangan
                        </label>

                        <textarea
                            v-model="form.description"
                            rows="3"
                            placeholder="Keterangan tambahan..."
                            :disabled="saving"
                            class="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                        ></textarea>

                    </div>


                    <!-- SORT ORDER -->
                    <div>

                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Urutan
                        </label>

                        <input
                            v-model.number="form.sort_order"
                            type="number"
                            min="0"
                            :disabled="saving"
                            class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                        />

                    </div>


                    <!-- ACTIVE -->
                    <label
                        class="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >

                        <div>

                            <p class="text-sm font-medium text-gray-800">
                                Status Aktif
                            </p>

                            <p class="text-xs text-gray-400">
                                Data dapat digunakan oleh modul ERP.
                            </p>

                        </div>

                        <input
                            v-model="form.is_active"
                            type="checkbox"
                            :disabled="saving"
                            class="h-4 w-4 rounded border-gray-300 text-[#0052cc] focus:ring-[#0052cc]"
                        />

                    </label>


                    <!-- ACTION -->
                    <div
                        class="flex justify-end gap-2 border-t border-gray-100 pt-4"
                    >

                        <button
                            type="button"
                            :disabled="saving"
                            class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                            @click="closeForm"
                        >
                            Batal
                        </button>


                        <button
                            type="submit"
                            :disabled="saving"
                            class="inline-flex items-center gap-2 rounded-lg bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0043a8] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <span
                                v-if="saving"
                                class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                            ></span>

                            {{
                                saving
                                    ? 'Menyimpan...'
                                    : editingItem
                                        ? 'Simpan Perubahan'
                                        : 'Simpan'
                            }}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    </div>
</template>


<script setup>
import {
    computed,
    onMounted,
    reactive,
    ref,
} from 'vue'

import {
    erpApi,
    getApiError,
} from '@/services/api'


/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const activeTab = ref('asset_status')

const search = ref('')

const statusFilter = ref('all')

const loading = ref(false)

const saving = ref(false)

const error = ref('')

const showForm = ref(false)

const editingItem = ref(null)

const items = ref([])


/*
|--------------------------------------------------------------------------
| GENERAL GROUPS
|--------------------------------------------------------------------------
|
| Ini hanya reference data umum.
| Master seperti product category, UOM, warehouse,
| department, dll tetap memakai tabel masing-masing.
|
*/

const masters = ref([
    {
        key: 'asset_status',
        label: 'Status Asset',
        icon: '💼',
        codePrefix: 'AST',
        count: 0,
    },

    {
        key: 'document_status',
        label: 'Status Dokumen',
        icon: '📄',
        codePrefix: 'DOC',
        count: 0,
    },

    {
        key: 'payment_status',
        label: 'Status Pembayaran',
        icon: '💳',
        codePrefix: 'PAY',
        count: 0,
    },

    {
        key: 'priority',
        label: 'Prioritas',
        icon: '⚡',
        codePrefix: 'PRI',
        count: 0,
    },

    {
        key: 'employee_status',
        label: 'Status Karyawan',
        icon: '👥',
        codePrefix: 'EMP',
        count: 0,
    },

])


/*
|--------------------------------------------------------------------------
| FORM
|--------------------------------------------------------------------------
*/

const form = reactive({
    id: null,
    group: '',
    code: '',
    name: '',
    description: '',
    sort_order: 0,
    is_active: true,
})


/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const activeMaster = computed(() => {
    return (
        masters.value.find(
            (master) =>
                master.key === activeTab.value
        ) ||
        masters.value[0]
    )
})


const currentItems = computed(() => {
    return items.value.filter(
        (item) =>
            item.group === activeTab.value
    )
})


const filteredItems = computed(() => {

    const keyword =
        search.value
            .trim()
            .toLowerCase()

    return currentItems.value.filter(
        (item) => {

            const matchesSearch =
                !keyword ||
                item.code
                    ?.toLowerCase()
                    .includes(keyword) ||
                item.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                item.description
                    ?.toLowerCase()
                    .includes(keyword)

            const matchesStatus =
                statusFilter.value === 'all' ||
                (
                    statusFilter.value === 'active' &&
                    item.is_active
                ) ||
                (
                    statusFilter.value === 'inactive' &&
                    !item.is_active
                )

            return (
                matchesSearch &&
                matchesStatus
            )
        }
    )
})


const activeCount = computed(() => {
    return currentItems.value.filter(
        (item) => item.is_active
    ).length
})


const inactiveCount = computed(() => {
    return currentItems.value.filter(
        (item) => !item.is_active
    ).length
})


/*
|--------------------------------------------------------------------------
| LOAD DATA
|--------------------------------------------------------------------------
*/

async function loadData() {

    loading.value = true

    error.value = ''

    try {

        const response =
            await erpApi.master.general.list({
                group: activeTab.value,
            })

        items.value =
            response.data || []

        updateMasterCount()

    } catch (err) {

        const apiError =
            getApiError(err)

        error.value =
            apiError.message ||
            'Gagal memuat data general.'

    } finally {

        loading.value = false

    }
}


/*
|--------------------------------------------------------------------------
| UPDATE TAB COUNTS
|--------------------------------------------------------------------------
*/

function updateMasterCount() {

    masters.value.forEach(
        (master) => {

            master.count =
                master.key === activeTab.value
                    ? items.value.length
                    : master.count

        }
    )
}


/*
|--------------------------------------------------------------------------
| TAB
|--------------------------------------------------------------------------
*/

async function changeTab(tab) {

    activeTab.value = tab

    search.value = ''

    statusFilter.value = 'all'

    closeForm()

    await loadData()
}


/*
|--------------------------------------------------------------------------
| FORM
|--------------------------------------------------------------------------
*/

function resetForm() {

    form.id = null

    form.group = activeTab.value

    form.code = ''

    form.name = ''

    form.description = ''

    form.sort_order = 0

    form.is_active = true
}


function openForm(item = null) {

    resetForm()

    if (item) {

        editingItem.value = item

        Object.assign(form, {
            id: item.id,
            group: item.group,
            code: item.code ?? '',
            name: item.name ?? '',
            description:
                item.description ?? '',
            sort_order:
                item.sort_order ?? 0,
            is_active:
                item.is_active ?? true,
        })

    } else {

        editingItem.value = null

    }

    showForm.value = true
}


function closeForm() {

    showForm.value = false

    editingItem.value = null

    resetForm()
}


/*
|--------------------------------------------------------------------------
| GENERATE CODE
|--------------------------------------------------------------------------
*/

function generateCode() {

    const prefix =
        activeMaster.value.codePrefix

    const numbers =
        currentItems.value
            .map((item) => {
                const match =
                    item.code?.match(
                        new RegExp(
                            `^${prefix}-(\\d+)$`
                        )
                    )

                return match
                    ? Number(match[1])
                    : 0
            })

    const next =
        Math.max(0, ...numbers) + 1

    return `${prefix}-${String(next).padStart(4, '0')}`
}


/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

async function saveItem() {

    error.value = ''

    if (!form.name.trim()) {

        error.value =
            'Nama wajib diisi.'

        return
    }

    if (!form.code.trim()) {
        form.code = generateCode()
    }

    saving.value = true

    try {

        const payload = {
            group: activeTab.value,

            code:
                form.code
                    .trim()
                    .toUpperCase(),

            name:
                form.name.trim(),

            description:
                form.description.trim() ||
                null,

            sort_order:
                Number(form.sort_order) || 0,

            is_active:
                Boolean(form.is_active),
        }


        if (editingItem.value) {

            const response =
                await erpApi.master.general.update(
                    form.id,
                    payload
                )

            const updated =
                response.data

            const index =
                items.value.findIndex(
                    (item) =>
                        item.id === form.id
                )

            if (index !== -1) {
                items.value[index] =
                    updated
            }

        } else {

            const response =
                await erpApi.master.general.create(
                    payload
                )

            items.value.push(
                response.data
            )
        }


        closeForm()

        updateMasterCount()

    } catch (err) {

        const apiError =
            getApiError(err)

        error.value =
            apiError.message ||
            'Gagal menyimpan data.'

    } finally {

        saving.value = false

    }
}


/*
|--------------------------------------------------------------------------
| TOGGLE STATUS
|--------------------------------------------------------------------------
*/

async function toggleStatus(item) {

    error.value = ''

    saving.value = true

    try {

        const response =
            await erpApi.master.generals.update(
                item.id,
                {
                    group: item.group,
                    code: item.code,
                    name: item.name,
                    description:
                        item.description,
                    sort_order:
                        item.sort_order,
                    is_active:
                        !item.is_active,
                }
            )

        const updated =
            response.data

        const index =
            items.value.findIndex(
                (data) =>
                    data.id === item.id
            )

        if (index !== -1) {
            items.value[index] =
                updated
        }

    } catch (err) {

        const apiError =
            getApiError(err)

        error.value =
            apiError.message ||
            'Gagal mengubah status.'

    } finally {

        saving.value = false

    }
}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

async function deleteItem(item) {

    const confirmed =
        confirm(
            `Hapus ${activeMaster.value.label.toLowerCase()} "${item.name}"?`
        )

    if (!confirmed) {
        return
    }

    error.value = ''

    saving.value = true

    try {

        await erpApi.master.generals.remove(
            item.id
        )

        const index =
            items.value.findIndex(
                (data) =>
                    data.id === item.id
            )

        if (index !== -1) {
            items.value.splice(index, 1)
        }

        updateMasterCount()

    } catch (err) {

        const apiError =
            getApiError(err)

        error.value =
            apiError.message ||
            'Gagal menghapus data.'

    } finally {

        saving.value = false

    }
}


/*
|--------------------------------------------------------------------------
| INITIAL LOAD
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadData()
})
</script>