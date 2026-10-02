<template>
    <Teleport to="body">
        <div
            v-if="show && partner"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            @click.self="close"
        >
            <div
                class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
                    <div class="flex min-w-0 items-center gap-4">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-[#0052cc]">
                            {{ getInitial(partner.name) }}
                        </div>

                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                                <h2 class="truncate text-lg font-semibold text-[#003366]">
                                    {{ partner.name }}
                                </h2>

                                <span
                                    class="rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="typeBadgeClass(partner.type)"
                                >
                                    {{ typeLabel(partner.type) }}
                                </span>
                            </div>

                            <p class="mt-1 text-sm text-gray-400">
                                {{ partner.code }}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        @click="close"
                    >
                        <svg
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="overflow-y-auto px-6 py-5">
                    <!-- Status -->
                    <div class="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <p class="text-sm font-medium text-gray-700">
                                    Status Partner
                                </p>

                                <p class="mt-1 text-xs text-gray-400">
                                    Status menentukan apakah partner dapat digunakan dalam transaksi.
                                </p>
                            </div>

                            <span
                                class="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
                                :class="
                                    partner.active
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-gray-200 text-gray-500'
                                "
                            >
                                {{ partner.active ? 'Aktif' : 'Nonaktif' }}
                            </span>
                        </div>
                    </div>

                    <!-- Informasi Utama -->
                    <section>
                        <h3 class="mb-3 text-sm font-semibold text-[#003366]">
                            Informasi Partner
                        </h3>

                        <div class="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                            <DetailItem
                                label="Kode Partner"
                                :value="partner.code"
                            />

                            <DetailItem
                                label="Tipe Partner"
                                :value="typeLabel(partner.type)"
                            />

                            <DetailItem
                                label="NPWP"
                                :value="partner.taxNumber"
                            />

                            <DetailItem
                                label="Contact Person"
                                :value="partner.contactPerson"
                            />

                            <DetailItem
                                label="No. Telepon"
                                :value="partner.phone"
                            />

                            <DetailItem
                                label="Email"
                                :value="partner.email"
                            />
                        </div>
                    </section>

                    <!-- Alamat -->
                    <section class="mt-6">
                        <h3 class="mb-3 text-sm font-semibold text-[#003366]">
                            Alamat
                        </h3>

                        <div class="rounded-xl border border-gray-100 p-4">
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <DetailItem
                                    label="Provinsi"
                                    :value="partner.provinceName"
                                />

                                <DetailItem
                                    label="Kota / Kabupaten"
                                    :value="partner.cityName"
                                />
                            </div>

                            <div class="mt-4">
                                <DetailItem
                                    label="Alamat Lengkap"
                                    :value="partner.address"
                                />
                            </div>
                        </div>
                    </section>

                    <!-- Catatan -->
                    <section
                        v-if="partner.notes"
                        class="mt-6"
                    >
                        <h3 class="mb-3 text-sm font-semibold text-[#003366]">
                            Catatan
                        </h3>

                        <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <p class="whitespace-pre-line text-sm leading-6 text-gray-600">
                                {{ partner.notes }}
                            </p>
                        </div>
                    </section>
                </div>

                <!-- Footer -->
                <div class="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        @click="close"
                    >
                        Tutup
                    </button>

                    <button
                        type="button"
                        class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003f9e]"
                        @click="edit"
                    >
                        Edit Partner
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import DetailItem from './DetailItem.vue'

defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    partner: {
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
    emit('edit')
}

function getInitial(name) {
    if (!name) return '?'

    return name
        .trim()
        .split(' ')
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
}

function typeLabel(type) {
    const labels = {
        customer: 'Customer',
        supplier: 'Supplier',
        both: 'Customer + Supplier',
    }

    return labels[type] || '-'
}

function typeBadgeClass(type) {
    const classes = {
        customer: 'bg-green-50 text-green-700',
        supplier: 'bg-orange-50 text-orange-700',
        both: 'bg-purple-50 text-purple-700',
    }

    return classes[type] || 'bg-gray-100 text-gray-600'
}
</script>