<template>
    <div
        v-if="show && employee"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <!-- HEADER -->
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div class="flex items-center gap-3">
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-full bg-[#0052cc]/10 font-bold text-[#0052cc]"
                    >
                        {{ getInitials(employee.name) }}
                    </div>

                    <div>
                        <h2 class="font-bold text-[#003366]">
                            {{ employee.name }}
                        </h2>

                        <p class="text-xs text-gray-500">
                            {{ employee.code }}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    @click="close"
                >
                    ✕
                </button>
            </div>

            <!-- BODY -->
            <div class="overflow-y-auto p-5">
                <!-- BADGES -->
                <div class="mb-6 flex flex-wrap gap-2">
                    <span
                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                        :class="typeClasses(employee.type)"
                    >
                        {{ typeLabel(employee.type) }}
                    </span>

                    <span
                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                        :class="statusClasses(employee.status)"
                    >
                        {{ statusLabel(employee.status) }}
                    </span>
                </div>

                <!-- IDENTITAS -->
                <section>
                    <h3 class="mb-4 text-sm font-bold text-gray-900">
                        Identitas Karyawan
                    </h3>

                    <div class="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Kode Karyawan"
                            :value="employee.code"
                        />

                        <DetailItem
                            label="NIK"
                            :value="employee.nik"
                        />

                        <DetailItem
                            label="Nama Lengkap"
                            :value="employee.name"
                        />

                        <DetailItem
                            label="No. HP"
                            :value="employee.phone || '-'"
                        />

                        <DetailItem
                            label="Email"
                            :value="employee.email || '-'"
                        />
                    </div>

                    <div class="mt-5">
                        <div class="text-xs font-semibold text-gray-400">
                            Alamat
                        </div>

                        <div class="mt-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                            {{ employee.address || '-' }}
                        </div>
                    </div>
                </section>

                <!-- KEPEGAWAIAN -->
                <section class="mt-7">
                    <h3 class="mb-4 text-sm font-bold text-gray-900">
                        Informasi Kepegawaian
                    </h3>

                    <div class="grid gap-5 sm:grid-cols-2">
                        <DetailItem
                            label="Jabatan"
                            :value="employee.position"
                        />

                        <DetailItem
                            label="Departemen"
                            :value="employee.department"
                        />

                        <DetailItem
                            label="Tipe Karyawan"
                            :value="typeLabel(employee.type)"
                        />

                        <DetailItem
                            label="Status"
                            :value="statusLabel(employee.status)"
                        />

                        <DetailItem
                            label="Tanggal Masuk"
                            :value="formatDate(employee.joinDate)"
                        />

                        <DetailItem
                            label="Tanggal Keluar"
                            :value="employee.endDate ? formatDate(employee.endDate) : '-'"
                        />
                    </div>
                </section>

                <!-- CATATAN -->
                <section class="mt-7">
                    <h3 class="mb-3 text-sm font-bold text-gray-900">
                        Catatan
                    </h3>

                    <div class="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                        {{ employee.notes || '-' }}
                    </div>
                </section>

                <!-- FOOTER -->
                <div class="mt-7 flex justify-end gap-3 border-t border-gray-200 pt-4">
                    <button
                        type="button"
                        class="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        @click="close"
                    >
                        Tutup
                    </button>

                    <button
                        type="button"
                        class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e]"
                        @click="edit"
                    >
                        Edit Karyawan
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    employee: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'close',
    'edit',
])

function close() {
    emit('close')
}

function edit() {
    emit('edit', props.employee)
}

function getInitials(name) {
    if (!name) return '?'

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
}

function formatDate(date) {
    if (!date) return '-'

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}

function typeLabel(type) {
    return {
        tetap: 'Tetap',
        trial: 'Trial',
        magang: 'Magang',
    }[type] || type
}

function typeClasses(type) {
    return {
        tetap: 'bg-blue-50 text-blue-700',
        trial: 'bg-amber-50 text-amber-700',
        magang: 'bg-purple-50 text-purple-700',
    }[type] || 'bg-gray-100 text-gray-600'
}

function statusLabel(status) {
    return {
        aktif: 'Aktif',
        resign: 'Resign',
        pensiun: 'Pensiun',
    }[status] || status
}

function statusClasses(status) {
    return {
        aktif: 'bg-green-50 text-green-700',
        resign: 'bg-red-50 text-red-700',
        pensiun: 'bg-gray-100 text-gray-600',
    }[status] || 'bg-gray-100 text-gray-600'
}

const DetailItem = {
    props: {
        label: String,
        value: String,
    },

    template: `
        <div>
            <div class="text-xs font-semibold text-gray-400">
                {{ label }}
            </div>

            <div class="mt-1 text-sm font-medium text-gray-800">
                {{ value }}
            </div>
        </div>
    `,
}
</script>