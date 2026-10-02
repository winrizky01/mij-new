<template>
    <div class="space-y-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Kelola Layanan
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola layanan yang ditampilkan pada website MJI.
                </p>
            </div>

            <button
                type="button"
                @click="openForm()"
                class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
                + Tambah Layanan
            </button>
        </div>

        <!-- Search & Filter -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="flex flex-col gap-3 sm:flex-row">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari layanan..."
                    class="h-10 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="statusFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
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
        </div>

        <!-- Service Cards -->
        <div
            v-if="filteredServices.length"
            class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
            <div
                v-for="service in filteredServices"
                :key="service.id"
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-100 hover:shadow-md"
            >
                <!-- Top -->
                <div class="flex items-start justify-between gap-4">
                    <div
                        class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-2xl"
                    >
                        {{ service.icon }}
                    </div>

                    <span
                        class="rounded-full px-3 py-1 text-xs font-medium"
                        :class="
                            service.active
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                        "
                    >
                        {{
                            service.active
                                ? 'Aktif'
                                : 'Nonaktif'
                        }}
                    </span>
                </div>

                <!-- Content -->
                <h2
                    class="mt-5 font-semibold text-gray-900"
                >
                    {{ service.name }}
                </h2>

                <p
                    class="mt-2 min-h-[48px] text-sm leading-6 text-gray-500"
                >
                    {{ service.description }}
                </p>

                <!-- Meta -->
                <div
                    class="mt-4 flex items-center justify-between text-xs text-gray-400"
                >
                    <span>
                        Urutan {{ service.order }}
                    </span>

                    <span>
                        {{ service.slug }}
                    </span>
                </div>

                <!-- Actions -->
                <div
                    class="mt-5 flex gap-2 border-t border-gray-100 pt-4"
                >
                    <button
                        type="button"
                        @click="openForm(service)"
                        class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        @click="toggleService(service)"
                        class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        {{
                            service.active
                                ? 'Nonaktifkan'
                                : 'Aktifkan'
                        }}
                    </button>

                    <button
                        type="button"
                        @click="deleteService(service.id)"
                        class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty -->
        <div
            v-else
            class="rounded-2xl border border-gray-100 bg-white px-5 py-14 text-center shadow-sm"
        >
            <div class="text-4xl">
                🛠️
            </div>

            <p
                class="mt-4 text-sm font-semibold text-gray-900"
            >
                Layanan tidak ditemukan
            </p>

            <p
                class="mt-1 text-xs text-gray-500"
            >
                Coba ubah pencarian atau filter status.
            </p>
        </div>

        <!-- Form -->
        <div
            v-if="showForm"
            class="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6"
        >
            <div
                class="mb-6 flex items-start justify-between gap-4"
            >
                <div>
                    <h2
                        class="text-lg font-bold text-gray-900"
                    >
                        {{
                            editingService
                                ? 'Edit Layanan'
                                : 'Tambah Layanan'
                        }}
                    </h2>

                    <p
                        class="mt-1 text-sm text-gray-500"
                    >
                        Atur informasi layanan yang akan tampil
                        pada website.
                    </p>
                </div>

                <button
                    type="button"
                    @click="closeForm"
                    class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                >
                    ✕
                </button>
            </div>

            <div class="grid gap-5 lg:grid-cols-2">
                <!-- Name -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Nama Layanan
                    </label>

                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="Contoh: Trucking"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />
                </div>

                <!-- Icon -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Icon
                    </label>

                    <input
                        v-model="form.icon"
                        type="text"
                        maxlength="4"
                        placeholder="🚚"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />

                    <p class="text-xs text-gray-400">
                        Untuk sementara gunakan emoji. Nanti bisa
                        diganti dengan Media Library / icon system.
                    </p>
                </div>

                <!-- Slug -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Slug
                    </label>

                    <input
                        v-model="form.slug"
                        type="text"
                        placeholder="trucking"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />

                    <p class="text-xs text-gray-400">
                        Jika dikosongkan, slug akan dibuat otomatis.
                    </p>
                </div>

                <!-- Order -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Urutan
                    </label>

                    <input
                        v-model.number="form.order"
                        type="number"
                        min="1"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />
                </div>

                <!-- Description -->
                <div class="lg:col-span-2">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Deskripsi
                    </label>

                    <textarea
                        v-model="form.description"
                        rows="4"
                        placeholder="Deskripsi singkat layanan..."
                        class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    ></textarea>
                </div>

                <!-- Active -->
                <div
                    class="lg:col-span-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
                >
                    <div>
                        <p
                            class="text-sm font-semibold text-gray-900"
                        >
                            Status Layanan
                        </p>

                        <p
                            class="mt-1 text-xs text-gray-500"
                        >
                            Layanan nonaktif tidak akan ditampilkan
                            pada website.
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="form.active = !form.active"
                        class="relative h-6 w-11 rounded-full transition"
                        :class="
                            form.active
                                ? 'bg-[#0052cc]'
                                : 'bg-gray-300'
                        "
                    >
                        <span
                            class="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition"
                            :class="
                                form.active
                                    ? 'left-6'
                                    : 'left-1'
                            "
                        />
                    </button>
                </div>
            </div>

            <!-- Form Actions -->
            <div
                class="mt-6 flex flex-col-reverse gap-2 border-t border-blue-100 pt-5 sm:flex-row sm:justify-end"
            >
                <button
                    type="button"
                    @click="closeForm"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Batal
                </button>

                <button
                    type="button"
                    @click="saveService"
                    class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
                >
                    {{
                        editingService
                            ? 'Simpan Perubahan'
                            : 'Tambah Layanan'
                    }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const search = ref('')
const statusFilter = ref('all')

const showForm = ref(false)
const editingService = ref(null)

const services = ref([
    {
        id: 1,
        name: 'Trucking',
        slug: 'trucking',
        icon: '🚚',
        description:
            'Layanan transportasi dan pengiriman barang untuk kebutuhan bisnis.',
        active: true,
        order: 1,
    },
    {
        id: 2,
        name: 'Software House',
        slug: 'software-house',
        icon: '💻',
        description:
            'Pengembangan website, aplikasi mobile, dan sistem bisnis.',
        active: true,
        order: 2,
    },
    {
        id: 3,
        name: 'Panggil Tukang',
        slug: 'panggil-tukang',
        icon: '🛠️',
        description:
            'Platform layanan tukang untuk berbagai kebutuhan rumah dan bisnis.',
        active: true,
        order: 3,
    },
    {
        id: 4,
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        icon: '📈',
        description:
            'Strategi digital marketing, konten, dan pengelolaan media sosial.',
        active: true,
        order: 4,
    },
])

const form = reactive({
    id: null,
    name: '',
    slug: '',
    icon: '',
    description: '',
    order: 1,
    active: true,
})

const filteredServices = computed(() => {
    const keyword = search.value
        .toLowerCase()
        .trim()

    return services.value
        .filter((service) => {
            const matchesSearch =
                !keyword ||
                service.name
                    .toLowerCase()
                    .includes(keyword) ||
                service.description
                    .toLowerCase()
                    .includes(keyword)

            const matchesStatus =
                statusFilter.value === 'all' ||
                (
                    statusFilter.value === 'active' &&
                    service.active
                ) ||
                (
                    statusFilter.value === 'inactive' &&
                    !service.active
                )

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => a.order - b.order)
})

function resetForm() {
    form.id = null
    form.name = ''
    form.slug = ''
    form.icon = ''
    form.description = ''
    form.order = services.value.length + 1
    form.active = true
}

function openForm(service = null) {
    resetForm()

    if (service) {
        editingService.value = service

        Object.assign(form, {
            id: service.id,
            name: service.name,
            slug: service.slug,
            icon: service.icon,
            description: service.description,
            order: service.order,
            active: service.active,
        })
    } else {
        editingService.value = null
    }

    showForm.value = true
}

function closeForm() {
    showForm.value = false
    editingService.value = null
    resetForm()
}

function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

function saveService() {
    if (!form.name.trim()) {
        alert('Nama layanan wajib diisi.')
        return
    }

    if (!form.description.trim()) {
        alert('Deskripsi layanan wajib diisi.')
        return
    }

    if (!form.slug.trim()) {
        form.slug = generateSlug(form.name)
    }

    if (!form.icon.trim()) {
        form.icon = '🛠️'
    }

    if (!form.order || form.order < 1) {
        form.order = services.value.length + 1
    }

    if (editingService.value) {
        Object.assign(
            editingService.value,
            JSON.parse(JSON.stringify(form))
        )
    } else {
        services.value.push({
            ...JSON.parse(JSON.stringify(form)),
            id: Date.now(),
        })
    }

    normalizeOrder()
    closeForm()
}

function toggleService(service) {
    service.active = !service.active
}

function deleteService(id) {
    const service = services.value.find(
        (item) => item.id === id
    )

    if (!service) return

    const confirmed = confirm(
        `Hapus layanan "${service.name}"?`
    )

    if (!confirmed) return

    services.value = services.value.filter(
        (item) => item.id !== id
    )

    normalizeOrder()
}

function normalizeOrder() {
    services.value
        .sort((a, b) => a.order - b.order)
        .forEach((service, index) => {
            service.order = index + 1
        })
}
</script>