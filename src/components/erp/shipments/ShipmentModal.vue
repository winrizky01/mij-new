<template>
    <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
    >
        <div
            class="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        >
            <!-- HEADER -->
            <div
                class="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4"
            >
                <div>
                    <h2 class="text-lg font-bold text-[#003366]">
                        {{ modalTitle }}
                    </h2>

                    <p class="mt-1 text-xs text-gray-500">
                        {{ modalDescription }}
                    </p>
                </div>

                <button
                    type="button"
                    class="text-2xl leading-none text-gray-400 hover:text-gray-700"
                    @click="close"
                >
                    ×
                </button>
            </div>

            <!-- CONTENT -->
            <div class="min-h-0 flex-1 overflow-y-auto p-6">
                <!-- CORRECTION NOTICE -->
                <div
                    v-if="mode === 'correction'"
                    class="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4"
                >
                    <p class="font-semibold text-amber-800">
                        Koreksi Admin
                    </p>

                    <p class="mt-1 text-sm text-amber-700">
                        Koreksi hanya mengubah nilai transaksi ini.
                        Master tarif tidak akan berubah.
                    </p>
                </div>

                <!-- INFORMASI PENGIRIMAN -->
                <section class="space-y-4">
                    <SectionTitle
                        title="Informasi Pengiriman"
                        description="Data dasar perjalanan."
                    />

                    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <Field label="Nomor Pengiriman">
                            <input
                                v-model="form.shipmentNumber"
                                readonly
                                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600"
                            />
                        </Field>

                        <Field label="Tanggal Surat Jalan">
                            <input
                                v-model="form.date"
                                type="date"
                                :disabled="mode === 'correction'"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            />
                        </Field>

                        <Field label="Tanggal Berangkat">
                            <input
                                v-model="form.departureDate"
                                type="date"
                                :disabled="mode === 'correction'"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            />
                        </Field>

                        <Field label="Tanggal Sampai">
                            <input
                                v-model="form.arrivalDate"
                                type="date"
                                :disabled="mode === 'correction'"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            />
                        </Field>

                        <Field label="Truk">
                            <select
                                v-model="form.truckId"
                                :disabled="mode === 'correction'"
                                required
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            >
                                <option :value="null">
                                    Pilih truk
                                </option>

                                <option
                                    v-for="truck in trucks"
                                    :key="truck.id"
                                    :value="truck.id"
                                >
                                    {{ truck.plateNumber }} -
                                    {{ truck.name }}
                                </option>
                            </select>
                        </Field>
                        
                        <Field label="Driver">
                            <select
                                v-model="form.driverId"
                                :disabled="mode === 'correction'"
                                required
                                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-100"
                            >
                                <option :value="null">
                                    Pilih driver
                                </option>

                                <option
                                    v-for="employee in driverEmployees"
                                    :key="employee.id"
                                    :value="employee.id"
                                >
                                    {{ employee.name }}
                                </option>
                            </select>
                        </Field>

                        <Field label="Status">
                            <select
                                v-model="form.status"
                                :disabled="mode === 'correction'"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            >
                                <option value="draft">
                                    Dibuat
                                </option>

                                <option value="scheduled">
                                    Dijadwalkan
                                </option>

                                <option value="departed">
                                    Berangkat
                                </option>

                                <option value="on_route">
                                    Dalam Perjalanan
                                </option>

                                <option value="arrived">
                                    Sampai Tujuan
                                </option>

                                <option value="completed">
                                    Selesai
                                </option>
                            </select>
                        </Field>
                        
                    </div>
                </section>

                <!-- TUJUAN -->
                <section class="mt-8 space-y-4">
                    <SectionTitle
                        title="Tujuan"
                        description="Perusahaan tujuan dan wilayah pengiriman."
                    />

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Nama Perusahaan Tujuan">
                            <input
                                v-model="form.destination.companyName"
                                :disabled="mode === 'correction'"
                                required
                                placeholder="Contoh: PT ABC Manufacturing"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            />
                        </Field>

                        <Field label="Provinsi">
                            <select
                                v-model="form.destination.provinceId"
                                :disabled="mode === 'correction'"
                                required
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            >
                                <option :value="null">
                                    Pilih provinsi
                                </option>

                                <option
                                    v-for="province in provinces"
                                    :key="province.id"
                                    :value="province.id"
                                >
                                    {{ province.name }}
                                </option>
                            </select>
                        </Field>
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Kabupaten / Kota">
                            <select
                                v-model="form.destination.cityId"
                                :disabled="mode === 'correction'"
                                required
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            >
                                <option :value="null">
                                    Pilih kabupaten / kota
                                </option>

                                <option
                                    v-for="city in cities"
                                    :key="city.id"
                                    :value="city.id"
                                >
                                    {{ city.name }}
                                </option>
                            </select>
                        </Field>

                        <Field label="Alamat">
                            <input
                                v-model="form.destination.address"
                                :disabled="mode === 'correction'"
                                placeholder="Alamat lengkap tujuan"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            />
                        </Field>
                    </div>
                </section>

                <!-- TARIF -->
                <section class="mt-8 space-y-4">
                    <SectionTitle
                        title="Tarif Pengiriman"
                        description="Tarif diambil dari master berdasarkan tujuan dan jenis truk."
                    />

                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <!-- VENDOR -->
                        <div
                            class="rounded-2xl border border-blue-100 bg-blue-50/50 p-5"
                        >
                            <div
                                class="mb-4 flex items-center justify-between"
                            >
                                <div>
                                    <p class="font-semibold text-[#003366]">
                                        Tagihan Vendor
                                    </p>

                                    <p class="mt-1 text-xs text-gray-500">
                                        Nilai yang ditagihkan ke vendor.
                                    </p>
                                </div>

                                <span
                                    class="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700"
                                >
                                    Vendor
                                </span>
                            </div>

                            <div class="space-y-3">
                                <MoneyRow
                                    label="Tarif Dasar"
                                    :value="form.vendorRate"
                                />

                                <MoneyRow
                                    label="Tambahan"
                                    :value="form.vendorAdditional"
                                />

                                <div class="border-t border-blue-100 pt-3">
                                    <MoneyRow
                                        label="Total Sebelum Balen"
                                        :value="vendorSubtotal"
                                        strong
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- DRIVER -->
                        <div
                            class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5"
                        >
                            <div
                                class="mb-4 flex items-center justify-between"
                            >
                                <div>
                                    <p class="font-semibold text-[#003366]">
                                        Pembayaran Driver
                                    </p>

                                    <p class="mt-1 text-xs text-gray-500">
                                        Nilai yang dibayarkan kepada driver.
                                    </p>
                                </div>

                                <span
                                    class="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                                >
                                    Driver
                                </span>
                            </div>

                            <div class="space-y-3">
                                <MoneyRow
                                    label="Tarif Dasar"
                                    :value="form.driverRate"
                                />

                                <MoneyRow
                                    label="Tambahan"
                                    :value="form.driverAdditional"
                                />

                                <div
                                    class="border-t border-emerald-100 pt-3"
                                >
                                    <MoneyRow
                                        label="Total Sebelum Balen"
                                        :value="driverSubtotal"
                                        strong
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- MASTER TARIF TERPILIH -->
                    <div
                        v-if="selectedTariff"
                        class="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                        <div
                            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p class="text-xs text-gray-500">
                                    Tarif Master yang digunakan
                                </p>

                                <p class="mt-1 font-semibold text-gray-800">
                                    {{ selectedTariff.tariffType }}
                                    -
                                    {{ selectedTariff.truckType }}
                                </p>
                            </div>

                            <span class="text-xs text-gray-500">
                                {{ selectedTariff.city }}
                            </span>
                        </div>
                    </div>
                </section>

                <!-- KOREKSI -->
                <section
                    v-if="mode === 'correction'"
                    class="mt-8 space-y-4"
                >
                    <SectionTitle
                        title="Koreksi Admin"
                        description="Perubahan hanya berlaku untuk transaksi ini."
                    />

                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div
                            class="rounded-2xl border border-amber-200 bg-amber-50 p-5"
                        >
                            <p class="mb-4 font-semibold text-amber-800">
                                Koreksi Vendor
                            </p>

                            <Field label="Koreksi Tarif Vendor">
                                <input
                                    v-model.number="form.vendorCorrection"
                                    type="number"
                                    class="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                                />
                            </Field>

                            <p class="mt-2 text-xs text-amber-700">
                                Gunakan nilai positif untuk menambah,
                                negatif untuk mengurangi.
                            </p>
                        </div>

                        <div
                            class="rounded-2xl border border-amber-200 bg-amber-50 p-5"
                        >
                            <p class="mb-4 font-semibold text-amber-800">
                                Koreksi Driver
                            </p>

                            <Field label="Koreksi Tarif Driver">
                                <input
                                    v-model.number="form.driverCorrection"
                                    type="number"
                                    class="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                                />
                            </Field>

                            <p class="mt-2 text-xs text-amber-700">
                                Gunakan nilai positif untuk menambah,
                                negatif untuk mengurangi.
                            </p>
                        </div>
                    </div>

                    <Field label="Alasan Koreksi">
                        <textarea
                            v-model="form.correctionNote"
                            rows="3"
                            required
                            placeholder="Contoh: Ada tambahan biaya tol berdasarkan kondisi lapangan."
                            class="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                        ></textarea>
                    </Field>
                </section>

                <!-- BALEN -->
                <section class="mt-8 space-y-4">
                    <SectionTitle
                        title="Balen"
                        description="Jika truk membawa balen saat kembali."
                    />

                    <div class="rounded-2xl border border-gray-200 p-5">
                        <label class="flex cursor-pointer items-center gap-3">
                            <input
                                v-model="form.hasBalen"
                                type="checkbox"
                                class="h-4 w-4 rounded border-gray-300 text-[#0052cc] focus:ring-[#0052cc]"
                            />

                            <span class="font-medium text-gray-800">
                                Pengiriman membawa balen
                            </span>
                        </label>

                        <div
                            v-if="form.hasBalen"
                            class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                            <Field label="Keterangan Balen">
                                <textarea
                                    v-model="form.balen.description"
                                    rows="3"
                                    placeholder="Contoh: Balen dari PT ABC"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                ></textarea>
                            </Field>

                            <div class="space-y-4">
                                <Field label="Tagihan Balen ke Vendor">
                                    <input
                                        v-model.number="
                                            form.balen.vendorCharge
                                        "
                                        type="number"
                                        min="0"
                                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />
                                </Field>

                                <Field label="Pembayaran Balen ke Driver">
                                    <input
                                        v-model.number="
                                            form.balen.driverPayment
                                        "
                                        type="number"
                                        min="0"
                                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- TOTAL -->
                <section class="mt-8">
                    <div class="rounded-2xl bg-[#003366] p-5 text-white">
                        <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div>
                                <p class="text-xs text-blue-100">
                                    Total Tagihan Vendor
                                </p>

                                <p class="mt-2 text-2xl font-bold">
                                    {{ formatCurrency(vendorTotal) }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-blue-100">
                                    Total Bayar Driver
                                </p>

                                <p class="mt-2 text-2xl font-bold">
                                    {{ formatCurrency(driverTotal) }}
                                </p>
                            </div>

                            <div>
                                <p class="text-xs text-blue-100">
                                    Selisih Operasional
                                </p>

                                <p class="mt-2 text-2xl font-bold">
                                    {{
                                        formatCurrency(
                                            vendorTotal - driverTotal
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- NOTES -->
                <section class="mt-8">
                    <Field label="Catatan">
                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Catatan pengiriman..."
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        ></textarea>
                    </Field>
                </section>
            </div>

            <!-- FOOTER -->
            <div
                class="flex shrink-0 justify-end gap-3 border-t border-gray-100 px-6 py-4"
            >
                <button
                    type="button"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    @click="close"
                >
                    Batal
                </button>

                <button
                    type="button"
                    class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e]"
                    @click="save"
                >
                    {{
                        mode === 'correction'
                            ? 'Simpan Koreksi'
                            : 'Simpan Pengiriman'
                    }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import Field from './Field.vue'
import SectionTitle from './SectionTitle.vue'
import MoneyRow from './MoneyRow.vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    mode: {
        type: String,
        default: 'create',
    },

    shipment: {
        type: Object,
        default: null,
    },

    trucks: {
        type: Array,
        default: () => [],
    },

    employees: {
        type: Array,
        default: () => [],
    },

    vendors: {
        type: Array,
        default: () => [],
    },

    tariffs: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits([
    'close',
    'saved',
])

const provinces = [
    {
        id: 15,
        name: 'Jawa Timur',
    },
    {
        id: 12,
        name: 'Jawa Barat',
    },
    {
        id: 13,
        name: 'Jawa Tengah',
    },
]

const form = reactive({
    id: null,
    shipmentNumber: '',
    date: '',
    status: 'draft',

    vendorName: null,
    truckId: null,
    driverId: null,

    destination: {
        provinceId: null,
        cityId: null,
        province: '',
        city: '',
        companyName: '',
        address: '',
    },

    tariffId: null,

    vendorRate: 0,
    vendorAdditional: 0,
    vendorCorrection: 0,

    driverRate: 0,
    driverAdditional: 0,
    driverCorrection: 0,

    hasBalen: false,

    balen: {
        description: '',
        vendorCharge: 0,
        driverPayment: 0,
    },

    notes: '',

    hasCorrection: false,
    correctionNote: '',
    correctedBy: '',
})

const driverEmployees = computed(() => {
    return props.employees.filter(
        employee =>
            employee.position?.toLowerCase() === 'driver'
    )
})

const selectedTruck = computed(() => {
    return props.trucks.find(
        truck => truck.id === form.truckId
    )
})

const selectedTariff = computed(() => {
    return props.tariffs.find(
        tariff => tariff.id === form.tariffId
    )
})

const vendorSubtotal = computed(() => {
    return (
        Number(form.vendorRate || 0) +
        Number(form.vendorAdditional || 0) +
        Number(form.vendorCorrection || 0)
    )
})

const driverSubtotal = computed(() => {
    return (
        Number(form.driverRate || 0) +
        Number(form.driverAdditional || 0) +
        Number(form.driverCorrection || 0)
    )
})

const vendorTotal = computed(() => {
    return (
        vendorSubtotal.value +
        (form.hasBalen
            ? Number(form.balen.vendorCharge || 0)
            : 0)
    )
})

const driverTotal = computed(() => {
    return (
        driverSubtotal.value +
        (form.hasBalen
            ? Number(form.balen.driverPayment || 0)
            : 0)
    )
})

const modalTitle = computed(() => {
    if (props.mode === 'correction') {
        return 'Koreksi Pengiriman'
    }

    if (props.mode === 'edit') {
        return 'Edit Pengiriman'
    }

    return 'Tambah Pengiriman'
})

const modalDescription = computed(() => {
    if (props.mode === 'correction') {
        return 'Perbaiki nilai transaksi tanpa mengubah master tarif.'
    }

    if (props.mode === 'edit') {
        return 'Perbarui data pengiriman.'
    }

    return 'Input perjalanan dan perhitungan pengiriman.'
})

watch(
    () => props.show,
    value => {
        if (!value) return

        if (props.mode === 'create') {
            resetForm()
        } else {
            loadShipment()
        }
    }
)

watch(
    () => [
        form.destination.provinceId,
        form.destination.city,
        form.truckId,
    ],
    () => {
        if (props.mode === 'correction') return

        findTariff()
    }
)

function resetForm() {
    Object.assign(form, {
        id: null,

        shipmentNumber: generateShipmentNumber(),

        date: new Date()
            .toISOString()
            .slice(0, 10),

        status: 'draft',

        vendorName: null,
        truckId: null,
        driverId: null,

        destination: {
            provinceId: null,
            cityId: null,
            province: '',
            city: '',
            companyName: '',
            address: '',
        },

        tariffId: null,

        vendorRate: 0,
        vendorAdditional: 0,
        vendorCorrection: 0,

        driverRate: 0,
        driverAdditional: 0,
        driverCorrection: 0,

        hasBalen: false,

        balen: {
            description: '',
            vendorCharge: 0,
            driverPayment: 0,
        },

        notes: '',

        hasCorrection: false,
        correctionNote: '',
        correctedBy: '',
    })
}

function loadShipment() {
    const shipment = props.shipment

    if (!shipment) {
        resetForm()
        return
    }

    Object.assign(form, {
        id: shipment.id,

        shipmentNumber:
            shipment.shipmentNumber || '',

        date: shipment.date || '',

        status:
            shipment.status || 'draft',

        vendorName:
            shipment.vendorName || null,

        truckId:
            shipment.truckId ?? null,

        driverId:
            shipment.driverId ?? null,

        destination: {
            provinceId:
                shipment.destination?.provinceId ?? null,

            cityId:
                shipment.destination?.cityId ?? null,

            province:
                shipment.destination?.province || '',

            city:
                shipment.destination?.city || '',

            companyName:
                shipment.destination?.companyName || '',

            address:
                shipment.destination?.address || '',
        },

        tariffId:
            shipment.tariffId ?? null,

        vendorRate:
            Number(shipment.vendorRate || 0),

        vendorAdditional:
            Number(shipment.vendorAdditional || 0),

        vendorCorrection:
            Number(shipment.vendorCorrection || 0),

        driverRate:
            Number(shipment.driverRate || 0),

        driverAdditional:
            Number(shipment.driverAdditional || 0),

        driverCorrection:
            Number(shipment.driverCorrection || 0),

        hasBalen:
            Boolean(shipment.hasBalen),

        balen: {
            description:
                shipment.balen?.description || '',

            vendorCharge:
                Number(
                    shipment.balen?.vendorCharge || 0
                ),

            driverPayment:
                Number(
                    shipment.balen?.driverPayment || 0
                ),
        },

        notes:
            shipment.notes || '',

        hasCorrection:
            Boolean(shipment.hasCorrection),

        correctionNote:
            shipment.correctionNote || '',

        correctedBy:
            shipment.correctedBy || '',
    })
}

function findTariff() {
    if (!form.destination.city) {
        return
    }

    if (!selectedTruck.value) {
        return
    }

    const city = form.destination.city
        .trim()
        .toLowerCase()

    const truckType =
        selectedTruck.value.truckType

    /*
     * Penting:
     * Jangan hanya menggunakan city + truckType
     * kalau nanti ada beberapa tarif untuk kota
     * dan jenis truk yang sama.
     *
     * Untuk sementara kita hanya auto-pilih jika
     * hasilnya tepat SATU tarif.
     */

    const matches = props.tariffs.filter(item => {
        return (
            String(item.city || '')
                .trim()
                .toLowerCase() === city &&
            item.truckType === truckType &&
            item.status === 'active'
        )
    })

    if (matches.length !== 1) {
        form.tariffId = null
        return
    }

    const tariff = matches[0]

    form.tariffId = tariff.id

    form.vendorRate =
        Number(tariff.vendorRate || 0)

    form.vendorAdditional =
        Number(tariff.vendorAdditional || 0)

    form.driverRate =
        Number(tariff.driverRate || 0)

    form.driverAdditional =
        Number(tariff.driverAdditional || 0)

    form.destination.cityId =
        tariff.cityId ?? null

    form.destination.provinceId =
        tariff.provinceId ?? null

    form.destination.province =
        tariff.province || ''
}

function generateShipmentNumber() {
    return `SHP-2026-${String(Date.now()).slice(-4)}`
}

function getDriverName() {
    return (
        props.employees.find(
            employee =>
                employee.id === form.driverId
        )?.name || ''
    )
}

function close() {
    emit('close')
}

function save() {
    if (!form.vendorId) {
        alert('Vendor wajib dipilih.')
        return
    }

    if (!form.truckId) {
        alert('Truk wajib dipilih.')
        return
    }

    if (!form.driverId) {
        alert('Driver wajib dipilih.')
        return
    }

    if (!form.destination.companyName.trim()) {
        alert('Nama perusahaan tujuan wajib diisi.')
        return
    }

    if (!form.destination.provinceId) {
        alert('Provinsi wajib dipilih.')
        return
    }

    if (!form.destination.city.trim()) {
        alert('Kabupaten / Kota wajib diisi.')
        return
    }

    if (props.mode === 'correction') {
        if (!form.correctionNote.trim()) {
            alert('Alasan koreksi wajib diisi.')
            return
        }
    }

    const shipment = {
        id:
            form.id ||
            Date.now(),

        shipmentNumber:
            form.shipmentNumber,

        date:
            form.date,

        status:
            form.status,

        vendorName:
            form.vendorName,

        truckId:
            form.truckId,

        truckName:
            selectedTruck.value?.name || '',

        plateNumber:
            selectedTruck.value?.plateNumber || '',

        driverId:
            form.driverId,

        driverName:
            getDriverName(),

        destination: {
            ...form.destination,
        },

        tariffId:
            form.tariffId,

        vendorRate:
            Number(form.vendorRate || 0),

        vendorAdditional:
            Number(form.vendorAdditional || 0),

        vendorCorrection:
            Number(form.vendorCorrection || 0),

        driverRate:
            Number(form.driverRate || 0),

        driverAdditional:
            Number(form.driverAdditional || 0),

        driverCorrection:
            Number(form.driverCorrection || 0),

        hasBalen:
            Boolean(form.hasBalen),

        balen: {
            ...form.balen,

            vendorCharge:
                Number(
                    form.balen.vendorCharge || 0
                ),

            driverPayment:
                Number(
                    form.balen.driverPayment || 0
                ),
        },

        vendorTotal:
            vendorTotal.value,

        driverTotal:
            driverTotal.value,

        notes:
            form.notes,

        hasCorrection:
            props.mode === 'correction'
                ? true
                : Boolean(form.hasCorrection),

        correctionNote:
            props.mode === 'correction'
                ? form.correctionNote
                : form.correctionNote,

        correctedBy:
            props.mode === 'correction'
                ? 'Administrator'
                : form.correctedBy,
    }

    emit('saved', {
        mode: props.mode,
        shipment,
    })
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0)
}
</script>

<script>
    export default {
        components: {
            Field: {
                props: {
                    label: String,
                },

                template: `
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            {{ label }}
                        </label>

                        <slot />
                    </div>
                `,
            },

            SectionTitle: {
                props: {
                    title: String,
                    description: String,
                },

                template: `
                    <div>
                        <h3 class="text-base font-bold text-[#003366]">
                            {{ title }}
                        </h3>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ description }}
                        </p>
                    </div>
                `,
            },

            MoneyRow: {
                props: {
                    label: String,
                    value: Number,
                    strong: Boolean,
                },

                template: `
                    <div class="flex items-center justify-between gap-4">
                        <span
                            class="text-sm"
                            :class="
                                strong
                                    ? 'font-semibold text-gray-800'
                                    : 'text-gray-600'
                            "
                        >
                            {{ label }}
                        </span>

                        <span
                            class="text-sm"
                            :class="
                                strong
                                    ? 'font-bold text-gray-900'
                                    : 'font-medium text-gray-700'
                            "
                        >
                            {{ value }}
                        </span>
                    </div>
                `,
            },
        },
    }
</script>