<template>
    <div class="space-y-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Pengguna
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola pengguna yang memiliki akses ke sistem MJI.
                </p>
            </div>

            <button
                type="button"
                @click="openForm()"
                class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
                + Tambah Pengguna
            </button>
        </div>

        <!-- Search -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="flex flex-col gap-3 md:flex-row">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari nama atau email..."
                    class="h-10 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="roleFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                    <option value="all">
                        Semua Role
                    </option>

                    <option
                        v-for="role in roles"
                        :key="role"
                        :value="role"
                    >
                        {{ role }}
                    </option>
                </select>

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

        <!-- Table -->
        <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-left">
                    <thead
                        class="border-b border-gray-100 bg-gray-50"
                    >
                        <tr>
                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Pengguna
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Role
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Akses Sistem
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="user in filteredUsers"
                            :key="user.id"
                            class="hover:bg-gray-50"
                        >
                            <!-- User -->
                            <td class="px-5 py-4">
                                <div
                                    class="flex items-center gap-3"
                                >
                                    <div
                                        class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-bold text-blue-700"
                                    >
                                        {{ user.initial }}
                                    </div>

                                    <div class="min-w-0">
                                        <p
                                            class="font-medium text-gray-900"
                                        >
                                            {{ user.name }}
                                        </p>

                                        <p
                                            class="mt-1 truncate text-xs text-gray-500"
                                        >
                                            {{ user.email }}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <!-- Role -->
                            <td
                                class="px-5 py-4 text-sm text-gray-700"
                            >
                                {{ user.role }}
                            </td>

                            <!-- Access -->
                            <td class="px-5 py-4">
                                <div
                                    class="flex flex-wrap gap-1.5"
                                >
                                    <span
                                        v-for="access in user.access"
                                        :key="access"
                                        class="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700"
                                    >
                                        {{ access }}
                                    </span>
                                </div>
                            </td>

                            <!-- Status -->
                            <td class="px-5 py-4">
                                <span
                                    class="rounded-full px-3 py-1 text-xs font-medium"
                                    :class="
                                        user.active
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                    "
                                >
                                    {{
                                        user.active
                                            ? 'Aktif'
                                            : 'Nonaktif'
                                    }}
                                </span>
                            </td>

                            <!-- Actions -->
                            <td class="px-5 py-4">
                                <div
                                    class="flex justify-end gap-2"
                                >
                                    <button
                                        type="button"
                                        @click="openForm(user)"
                                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        @click="toggleUser(user)"
                                        class="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                                    >
                                        {{
                                            user.active
                                                ? 'Nonaktifkan'
                                                : 'Aktifkan'
                                        }}
                                    </button>

                                    <button
                                        type="button"
                                        @click="deleteUser(user.id)"
                                        class="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Empty -->
                        <tr v-if="filteredUsers.length === 0">
                            <td
                                colspan="5"
                                class="px-5 py-12 text-center"
                            >
                                <div class="text-3xl">
                                    👥
                                </div>

                                <p
                                    class="mt-3 text-sm font-semibold text-gray-900"
                                >
                                    Pengguna tidak ditemukan
                                </p>

                                <p
                                    class="mt-1 text-xs text-gray-500"
                                >
                                    Coba ubah pencarian atau filter.
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
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
                            editingUser
                                ? 'Edit Pengguna'
                                : 'Tambah Pengguna'
                        }}
                    </h2>

                    <p
                        class="mt-1 text-sm text-gray-500"
                    >
                        Atur akun, role, dan akses sistem pengguna.
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
                <!-- Nama -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Nama
                    </label>

                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="Nama pengguna"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />
                </div>

                <!-- Email -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>

                    <input
                        v-model="form.email"
                        type="email"
                        placeholder="nama@manunggal.com"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />
                </div>

                <!-- Password -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        {{
                            editingUser
                                ? 'Password Baru'
                                : 'Password'
                        }}
                    </label>

                    <input
                        v-model="form.password"
                        type="password"
                        :placeholder="
                            editingUser
                                ? 'Kosongkan jika tidak diubah'
                                : 'Masukkan password'
                        "
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />
                </div>

                <!-- Role -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Role
                    </label>

                    <select
                        v-model="form.role"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    >
                        <option value="">
                            Pilih role
                        </option>

                        <option
                            v-for="role in roles"
                            :key="role"
                            :value="role"
                        >
                            {{ role }}
                        </option>
                    </select>
                </div>

                <!-- Access -->
                <div class="lg:col-span-2">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Akses Sistem
                    </label>

                    <div
                        class="mt-2 grid gap-3 sm:grid-cols-2"
                    >
                        <label
                            v-for="access in accessOptions"
                            :key="access.value"
                            class="flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 transition"
                            :class="
                                form.access.includes(access.value)
                                    ? 'border-blue-300 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            "
                        >
                            <input
                                v-model="form.access"
                                type="checkbox"
                                :value="access.value"
                                class="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0052cc] focus:ring-[#0052cc]"
                            />

                            <div>
                                <p
                                    class="text-sm font-semibold text-gray-900"
                                >
                                    {{ access.label }}
                                </p>

                                <p
                                    class="mt-1 text-xs text-gray-500"
                                >
                                    {{ access.description }}
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Status -->
                <div
                    class="lg:col-span-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
                >
                    <div>
                        <p
                            class="text-sm font-semibold text-gray-900"
                        >
                            Status Pengguna
                        </p>

                        <p
                            class="mt-1 text-xs text-gray-500"
                        >
                            Pengguna nonaktif tidak dapat login ke
                            sistem.
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

            <!-- Actions -->
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
                    @click="saveUser"
                    class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
                >
                    {{
                        editingUser
                            ? 'Simpan Perubahan'
                            : 'Tambah Pengguna'
                    }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const search = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')

const showForm = ref(false)
const editingUser = ref(null)

const roles = [
    'Administrator',
    'Website Admin',
    'Editor',
    'ERP Admin',
]

const accessOptions = [
    {
        value: 'Website',
        label: 'Website Admin',
        description:
            'Mengelola website, artikel, media, pesan, dan konten.',
    },
    {
        value: 'ERP',
        label: 'ERP',
        description:
            'Mengakses sistem ERP dan modul operasional perusahaan.',
    },
]

const users = ref([
    {
        id: 1,
        name: 'Administrator',
        email: 'admin@manunggal.com',
        initial: 'AD',
        role: 'Administrator',
        access: ['Website', 'ERP'],
        active: true,
    },
    {
        id: 2,
        name: 'Website Admin',
        email: 'website@manunggal.com',
        initial: 'WA',
        role: 'Website Admin',
        access: ['Website'],
        active: true,
    },
    {
        id: 3,
        name: 'Content Editor',
        email: 'editor@manunggal.com',
        initial: 'CE',
        role: 'Editor',
        access: ['Website'],
        active: true,
    },
])

const form = reactive({
    id: null,
    name: '',
    email: '',
    password: '',
    role: '',
    access: [],
    active: true,
})

const filteredUsers = computed(() => {
    const keyword = search.value
        .toLowerCase()
        .trim()

    return users.value.filter((user) => {
        const matchesSearch =
            !keyword ||
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword)

        const matchesRole =
            roleFilter.value === 'all' ||
            user.role === roleFilter.value

        const matchesStatus =
            statusFilter.value === 'all' ||
            (
                statusFilter.value === 'active' &&
                user.active
            ) ||
            (
                statusFilter.value === 'inactive' &&
                !user.active
            )

        return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
        )
    })
})

function resetForm() {
    form.id = null
    form.name = ''
    form.email = ''
    form.password = ''
    form.role = ''
    form.access = []
    form.active = true
}

function openForm(user = null) {
    resetForm()

    if (user) {
        editingUser.value = user

        form.id = user.id
        form.name = user.name
        form.email = user.email
        form.role = user.role
        form.access = [...user.access]
        form.active = user.active
    } else {
        editingUser.value = null
    }

    showForm.value = true
}

function closeForm() {
    showForm.value = false
    editingUser.value = null
    resetForm()
}

function getInitial(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
}

function saveUser() {
    if (!form.name.trim()) {
        alert('Nama pengguna wajib diisi.')
        return
    }

    if (!form.email.trim()) {
        alert('Email pengguna wajib diisi.')
        return
    }

    if (!form.role) {
        alert('Role pengguna wajib dipilih.')
        return
    }

    if (!form.access.length) {
        alert('Pilih minimal satu akses sistem.')
        return
    }

    if (!editingUser.value && !form.password) {
        alert('Password wajib diisi untuk pengguna baru.')
        return
    }

    if (editingUser.value) {
        editingUser.value.name = form.name
        editingUser.value.email = form.email
        editingUser.value.role = form.role
        editingUser.value.access = [...form.access]
        editingUser.value.active = form.active
        editingUser.value.initial = getInitial(form.name)
    } else {
        users.value.push({
            id: Date.now(),
            name: form.name,
            email: form.email,
            initial: getInitial(form.name),
            role: form.role,
            access: [...form.access],
            active: form.active,
        })
    }

    closeForm()
}

function toggleUser(user) {
    user.active = !user.active
}

function deleteUser(id) {
    const user = users.value.find(
        (item) => item.id === id
    )

    if (!user) return

    if (user.role === 'Administrator') {
        alert(
            'Administrator utama tidak dapat dihapus pada versi ini.'
        )
        return
    }

    const confirmed = confirm(
        `Hapus pengguna "${user.name}"?`
    )

    if (!confirmed) return

    users.value = users.value.filter(
        (item) => item.id !== id
    )
}
</script>