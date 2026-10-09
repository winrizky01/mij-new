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
                <!-- ERROR -->
                <div
                    v-if="errorMessage"
                    class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {{ errorMessage }}
                </div>

                <!-- CORRECTION NOTICE -->
                <div
                    v-if="mode === 'correction'"
                    class="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4"
                >
                    <p class="font-semibold text-amber-800">
                        Koreksi Admin
                    </p>

                    <p class="mt-1 text-sm text-amber-700">
                        Koreksi hanya mengubah transaksi ini.
                        Master tarif tidak akan berubah.
                    </p>
                </div>

                <!-- INFORMASI -->
                <section class="space-y-4">
                    <SectionTitle
                        title="Informasi Pengiriman"
                        description="Data dasar perjalanan."
                    />

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <!-- NOMOR -->
                        <Field label="Nomor Pengiriman">
                            <input
                                v-model="form.shipment_number"
                                readonly
                                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600"
                            />
                        </Field>

                        <!-- NOMOR SURAT JALAN -->
                        <Field label="Nomor Surat Jalan">
                            <input
                                v-model="form.delivery_order_number"
                                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600"
                            />
                        </Field>

                        <!-- TANGGAL -->
                        <Field label="Tanggal Surat Jalan">
                            <input
                                v-model="form.shipment_date"
                                type="date"
                                :disabled="mode === 'correction'"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            />
                        </Field>

                        <!-- TRUCK -->
                        <Field label="Truk">
                            <select
                                v-model="form.truck_id"
                                @change="handleTruckChange"
                                :disabled="
                                    mode === 'correction' ||
                                    loadingMasters
                                "
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
                                    {{ truck.plate_number }}
                                    -
                                    {{ truck.name || truck.code }}
                                </option>
                            </select>
                        </Field>

                        <!-- DRIVER -->
                        <Field label="Driver">
                            <select
                                v-model="form.driver_id"
                                :disabled="
                                    mode === 'correction' ||
                                    loadingMasters
                                "
                                required
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
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

                        <!-- STATUS -->
                        <Field label="Status">
                            <select
                                v-model="form.status"
                                :disabled="mode === 'correction'"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            >
                                <option
                                    v-for="item in statusOptions"
                                    :key="item.value"
                                    :value="item.value"
                                >
                                    {{ item.label }}
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
                        <!-- COMPANY -->
                        <Field label="Nama Perusahaan Tujuan">
                            <input
                                v-model="form.destination_company"
                                :disabled="mode === 'correction'"
                                required
                                placeholder="Contoh: PT ABC Manufacturing"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            />
                        </Field>

                        <!-- PROVINCE -->
                        <Field label="Provinsi">
                            <select
                                v-model="form.destination_province_id"
                                @change="handleProvinceChange"
                                :disabled="
                                    mode === 'correction' ||
                                    loadingProvinces
                                "
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

                        <!-- CITY -->
                        <Field label="Kabupaten / Kota">
                            <select
                                v-model="form.destination_city_id"
                                @change="handleCityChange"
                                :disabled="
                                    mode === 'correction' ||
                                    !form.destination_province_id ||
                                    loadingCities
                                "
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

                        <!-- ADDRESS -->
                        <Field label="Alamat">
                            <textarea
                                v-model="form.destination_address"
                                :disabled="mode === 'correction'"
                                rows="2"
                                placeholder="Alamat lengkap tujuan"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                            ></textarea>
                        </Field>
                    </div>
                </section>

                <!-- TARIF -->
                <section class="mt-8 space-y-4">
                    <SectionTitle
                        title="Tarif Pengiriman"
                        description="Tarif mengikuti kota tujuan dan armada yang dipilih."
                    />

                    <!-- LOADING -->
                    <div
                        v-if="tariffLoading"
                        class="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700"
                    >
                        Mencari tarif yang sesuai...
                    </div>

                    <!-- MULTIPLE -->
                    <div
                        v-else-if="tariffCandidates.length > 1"
                        class="rounded-xl border border-amber-200 bg-amber-50 p-4"
                    >
                        <p class="font-semibold text-amber-800">
                            Ditemukan beberapa tarif
                        </p>

                        <p class="mt-1 text-sm text-amber-700">
                            Pilih tarif yang akan digunakan untuk
                            pengiriman ini.
                        </p>

                        <select
                            v-model="form.tariff_id"
                            @change="handleTariffChange"
                            :disabled="mode === 'correction'"
                            class="mt-3 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500 disabled:bg-gray-50"
                        >
                            <option :value="null">
                                Pilih tarif
                            </option>

                            <option
                                v-for="tariff in tariffCandidates"
                                :key="tariff.id"
                                :value="tariff.id"
                            >
                                {{ tariffLabel(tariff) }}
                            </option>
                        </select>
                    </div>

                    <!-- NO TARIF -->
                    <div
                        v-else-if="
                            tariffCandidates.length === 0 &&
                            canFindTariff
                        "
                        class="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600"
                    >
                        Tidak ditemukan tarif aktif yang sesuai
                        dengan kota dan truk yang dipilih.
                    </div>

                    <!-- TARIF -->
                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <!-- VENDOR -->
                        <div
                            class="rounded-2xl border border-blue-100 bg-blue-50/50 p-5"
                        >
                            <div
                                class="mb-4 flex items-center justify-between"
                            >
                                <div>
                                    <p
                                        class="font-semibold text-[#003366]"
                                    >
                                        Biaya Sewa
                                    </p>

                                    <p
                                        class="mt-1 text-xs text-gray-500"
                                    >
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
                                    :value="form.vendor_rate"
                                />

                                <MoneyRow
                                    label="Tambahan"
                                    :value="form.vendor_additional"
                                />

                                <MoneyRow
                                    label="Koreksi"
                                    :value="form.vendor_correction"
                                />

                                <div
                                    class="border-t border-blue-100 pt-3"
                                >
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
                                    <p
                                        class="font-semibold text-[#003366]"
                                    >
                                        Uang Saku Driver
                                    </p>

                                    <p
                                        class="mt-1 text-xs text-gray-500"
                                    >
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
                                    :value="form.driver_rate"
                                />

                                <MoneyRow
                                    label="Tambahan"
                                    :value="form.driver_additional"
                                />

                                <MoneyRow
                                    label="Koreksi"
                                    :value="form.driver_correction"
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

                    <!-- SELECTED MASTER -->
                    <div
                        v-if="selectedTariff"
                        class="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                        <div
                            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p
                                    class="text-xs text-gray-500"
                                >
                                    Tarif Master yang digunakan
                                </p>

                                <p
                                    class="mt-1 font-semibold text-gray-800"
                                >
                                    {{ tariffLabel(selectedTariff) }}
                                </p>
                            </div>

                            <span
                                class="text-xs text-gray-500"
                            >
                                {{ selectedTariff.city || '' }}
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

                    <div
                        class="grid grid-cols-1 gap-4 lg:grid-cols-2"
                    >
                        <div
                            class="rounded-2xl border border-amber-200 bg-amber-50 p-5"
                        >
                            <p
                                class="mb-4 font-semibold text-amber-800"
                            >
                                Koreksi Vendor
                            </p>

                            <Field label="Koreksi Tarif Vendor">
                                <input
                                    v-model.number="
                                        form.vendor_correction
                                    "
                                    type="number"
                                    class="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                                />
                            </Field>
                        </div>

                        <div
                            class="rounded-2xl border border-amber-200 bg-amber-50 p-5"
                        >
                            <p
                                class="mb-4 font-semibold text-amber-800"
                            >
                                Koreksi Driver
                            </p>

                            <Field label="Koreksi Tarif Driver">
                                <input
                                    v-model.number="
                                        form.driver_correction
                                    "
                                    type="number"
                                    class="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                                />
                            </Field>
                        </div>
                    </div>

                    <Field label="Alasan Koreksi">
                        <textarea
                            v-model="form.correction_note"
                            rows="3"
                            required
                            placeholder="Alasan koreksi..."
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

                    <div
                        class="rounded-2xl border border-gray-200 p-5"
                    >
                        <label
                            class="flex cursor-pointer items-center gap-3"
                        >
                            <input
                                v-model="form.has_balen"
                                type="checkbox"
                                :disabled="mode === 'correction'"
                                class="h-4 w-4 rounded border-gray-300 text-[#0052cc] focus:ring-[#0052cc]"
                            />

                            <span
                                class="font-medium text-gray-800"
                            >
                                Pengiriman membawa balen
                            </span>
                        </label>

                        <div
                            v-if="form.has_balen"
                            class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                            <Field label="Keterangan Balen">
                                <textarea
                                    v-model="form.balen_description"
                                    :disabled="mode === 'correction'"
                                    rows="3"
                                    placeholder="Contoh: Balen dari customer"
                                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                                ></textarea>
                            </Field>

                            <div class="space-y-4">
                                <Field
                                    label="Tagihan Balen ke Vendor"
                                >
                                    <input
                                        v-model.number="
                                            form.balen_vendor_charge
                                        "
                                        :disabled="
                                            mode === 'correction'
                                        "
                                        type="number"
                                        min="0"
                                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                                    />
                                </Field>

                                <Field
                                    label="Pembayaran Balen ke Driver"
                                >
                                    <input
                                        v-model.number="
                                            form.balen_driver_payment
                                        "
                                        :disabled="
                                            mode === 'correction'
                                        "
                                        type="number"
                                        min="0"
                                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] disabled:bg-gray-50"
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- TOTAL -->
                <section class="mt-8">
                    <div
                        class="rounded-2xl bg-[#003366] p-5 text-white"
                    >
                        <div
                            class="grid grid-cols-1 gap-5 md:grid-cols-3"
                        >
                            <div>
                                <p
                                    class="text-xs text-blue-100"
                                >
                                    Total Tagihan Vendor
                                </p>

                                <p
                                    class="mt-2 text-2xl font-bold"
                                >
                                    {{
                                        formatCurrency(
                                            vendorTotal
                                        )
                                    }}
                                </p>
                            </div>

                            <div>
                                <p
                                    class="text-xs text-blue-100"
                                >
                                    Total Bayar Driver
                                </p>

                                <p
                                    class="mt-2 text-2xl font-bold"
                                >
                                    {{
                                        formatCurrency(
                                            driverTotal
                                        )
                                    }}
                                </p>
                            </div>

                            <div>
                                <p
                                    class="text-xs text-blue-100"
                                >
                                    Selisih Operasional
                                </p>

                                <p
                                    class="mt-2 text-2xl font-bold"
                                >
                                    {{
                                        formatCurrency(
                                            vendorTotal -
                                                driverTotal
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
                    :disabled="saving"
                    class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                    @click="save"
                >
                    {{
                        saving
                            ? 'Menyimpan...'
                            : mode === 'correction'
                              ? 'Simpan Koreksi'
                              : 'Simpan Pengiriman'
                    }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    computed,
    reactive,
    ref,
    watch,
} from 'vue'

import Field from './Field.vue'
import SectionTitle from './SectionTitle.vue'
import MoneyRow from './MoneyRow.vue'

import {
    erpApi,
    getApiError,
} from '../../../services/api'

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
})

const emit = defineEmits([
    'close',
    'saved',
])

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const saving = ref(false)
const errorMessage = ref('')

const loadingMasters = ref(false)
const loadingProvinces = ref(false)
const loadingCities = ref(false)
const tariffLoading = ref(false)

const trucks = ref([])
const employees = ref([])
const provinces = ref([])
const cities = ref([])

const tariffCandidates = ref([])

/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

const statusOptions = [
    {
        value: 'draft',
        label: 'Draft',
    },
    // {
    //     value: 'scheduled',
    //     label: 'Dijadwalkan',
    // },
    // {
    //     value: 'departed',
    //     label: 'Berangkat',
    // },
    {
        value: 'on_route',
        label: 'Dalam Perjalanan',
    },
    {
        value: 'arrived',
        label: 'Sampai Tujuan',
    },
    {
        value: 'completed',
        label: 'Selesai',
    },
]

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = reactive(createEmptyForm())

function createEmptyForm() {
    return {
        id: null,

        shipment_number: '',
        delivery_order_number: '',
        shipment_date: '',
        status: 'draft',

        truck_id: null,
        driver_id: null,
        tariff_id: null,

        destination_province_id: null,
        destination_province: '',

        destination_city_id: null,
        destination_city: '',

        destination_company: '',
        destination_address: '',

        vendor_rate: 0,
        vendor_additional: 0,
        vendor_correction: 0,

        driver_rate: 0,
        driver_additional: 0,
        driver_correction: 0,

        has_balen: false,
        balen_description: '',
        balen_vendor_charge: 0,
        balen_driver_payment: 0,

        has_correction: false,
        correction_note: '',

        notes: '',
    }
}

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

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
        return 'Perbaiki transaksi tanpa mengubah master tarif.'
    }

    if (props.mode === 'edit') {
        return 'Perbarui data pengiriman.'
    }

    return 'Input perjalanan dan perhitungan pengiriman.'
})

const driverEmployees = computed(() => {
    return employees.value.filter(employee => {
        if (employee.is_driver === true) {
            return true
        }

        const position =
            employee.position?.name ||
            employee.position ||
            employee.job_title ||
            employee.position_name ||
            ''

        return String(position)
            .toLowerCase()
            .includes('driver')
    })
})

const selectedTariff = computed(() => {
    return (
        tariffCandidates.value.find(
            tariff =>
                Number(tariff.id) ===
                Number(form.tariff_id)
        ) || null
    )
})

const vendorSubtotal = computed(() => {
    return (
        Number(form.vendor_rate || 0) +
        Number(form.vendor_additional || 0) +
        Number(form.vendor_correction || 0)
    )
})

const driverSubtotal = computed(() => {
    return (
        Number(form.driver_rate || 0) +
        Number(form.driver_additional || 0) +
        Number(form.driver_correction || 0)
    )
})

const vendorTotal = computed(() => {
    return (
        vendorSubtotal.value +
        (
            form.has_balen
                ? Number(
                    form.balen_vendor_charge || 0
                )
                : 0
        )
    )
})

const driverTotal = computed(() => {
    return (
        driverSubtotal.value +
        (
            form.has_balen
                ? Number(
                    form.balen_driver_payment || 0
                )
                : 0
        )
    )
})

const canFindTariff = computed(() => {
    return Boolean(
        form.destination_city_id &&
        form.truck_id
    )
})

/*
|--------------------------------------------------------------------------
| Modal watcher
|--------------------------------------------------------------------------
*/

watch(
    () => props.show,
    async visible => {
        if (!visible) {
            return
        }

        errorMessage.value = ''

        if (props.mode === 'create') {
            resetForm()

            await loadMasters()

            return
        }

        await loadMasters()

        await loadShipment()
    }
)

/*
|--------------------------------------------------------------------------
| Reset
|--------------------------------------------------------------------------
*/

function resetForm() {
    Object.assign(
        form,
        createEmptyForm()
    )

    form.shipment_number =
        generateShipmentNumber()

    form.shipment_date =
        new Date()
            .toISOString()
            .slice(0, 10)

    cities.value = []
    tariffCandidates.value = []
}

/*
|--------------------------------------------------------------------------
| Masters
|--------------------------------------------------------------------------
*/

async function loadMasters() {
    loadingMasters.value = true

    try {
        const [
            truckResponse,
            employeeResponse,
            provinceResponse,
        ] = await Promise.all([
            erpApi.master.trucks.list({
                is_active: true,
            }),

            erpApi.master.employees.list({
                is_active: true,
            }),

            erpApi.master.provinces.list({
                is_active: true,
            }),
        ])

        trucks.value =
            normalizeList(truckResponse)

        employees.value =
            normalizeList(employeeResponse)

        provinces.value =
            normalizeList(provinceResponse)
    } catch (error) {
        console.error(
            'Gagal memuat master shipment:',
            error
        )

        errorMessage.value =
            getApiError(
                error
            ) ||
            'Gagal memuat data master.'
    } finally {
        loadingMasters.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Province / City
|--------------------------------------------------------------------------
*/

async function handleProvinceChange() {
    form.destination_city_id = null
    form.destination_city = ''

    cities.value = []

    clearTariff()

    const province =
        provinces.value.find(
            item =>
                Number(item.id) ===
                Number(
                    form.destination_province_id
                )
        )

    form.destination_province =
        province?.name || ''

    if (!form.destination_province_id) {
        return
    }

    await loadCities(
        form.destination_province_id
    )
}

async function loadCities(provinceId) {
    loadingCities.value = true

    try {
        const response =
            await erpApi.master.cities.list({
                province_id: provinceId,
                is_active: true,
            })

        cities.value =
            normalizeList(response)
    } catch (error) {
        cities.value = []

        errorMessage.value =
            getApiError(error) ||
            'Gagal memuat kabupaten / kota.'
    } finally {
        loadingCities.value = false
    }
}

function handleCityChange() {
    const city =
        cities.value.find(
            item =>
                Number(item.id) ===
                Number(
                    form.destination_city_id
                )
        )

    form.destination_city =
        city?.name || ''

    findTariff()
}

/*
|--------------------------------------------------------------------------
| Truck
|--------------------------------------------------------------------------
*/

function handleTruckChange() {
    clearTariff()

    if (
        form.destination_city_id &&
        form.truck_id
    ) {
        findTariff()
    }
}

/*
|--------------------------------------------------------------------------
| Tariff
|--------------------------------------------------------------------------
*/

async function findTariff() {
    if (!canFindTariff.value) {
        clearTariff()
        return
    }

    tariffLoading.value = true
    errorMessage.value = ''

    try {
        const response =
            await erpApi.master.shippingTariffs.list({
                city_id: form.destination_city_id,
                truck_id: form.truck_id,
                is_active: true,
            })

        const details = normalizeTariffDetails(response)

        const candidates = details.filter(tariff => {
            const cityMatches =
                Number(tariff.city_id) ===
                Number(form.destination_city_id)

            // Tarif umum berlaku untuk semua truk.
            // Tarif khusus hanya berlaku untuk truk yang cocok.
            const truckMatches =
                tariff.truck_id == null ||
                Number(tariff.truck_id) ===
                    Number(form.truck_id)

            const detailActive =
                tariff.is_active === true ||
                tariff.is_active === 1 ||
                tariff.is_active === '1'

            const masterActive =
                tariff.master_status === 'active'

            return (
                cityMatches &&
                truckMatches &&
                detailActive &&
                masterActive
            )
        })

        tariffCandidates.value = candidates

        // Auto-select hanya jika benar-benar ada satu kandidat.
        if (candidates.length === 1) {
            applyTariff(candidates[0])
            return
        }

        // Nol atau beberapa kandidat: jangan memilih sembarangan.
        clearTariffValues()
    } catch (error) {
        tariffCandidates.value = []
        clearTariffValues()

        errorMessage.value =
            getApiError(error) ||
            'Gagal mencari tarif pengiriman.'
    } finally {
        tariffLoading.value = false
    }
}

function normalizeTariffDetails(response) {
    // Mendukung response Axios maupun data yang sudah diekstrak.
    const payload =
        response?.data?.data ??
        response?.data ??
        response

    const parents = Array.isArray(payload)
        ? payload
        : []

    return parents.flatMap(parent => {
        if (!Array.isArray(parent.details)) {
            return []
        }

        // Master nonaktif tidak boleh dipakai.
        if (parent.status !== 'active') {
            return []
        }

        return parent.details.map(detail => ({
            ...detail,

            // Identitas master tarif.
            shipping_tariff_id:
                detail.shipping_tariff_id ?? parent.id,

            code: parent.code || '',
            name: parent.name || '',
            master_status: parent.status,

            effective_date:
                parent.effective_date ?? null,

            expired_date:
                parent.expired_date ?? null,

            // Pastikan nilai uang berupa angka.
            vendor_rate:
                Number(detail.vendor_rate || 0),

            vendor_additional:
                Number(detail.vendor_additional || 0),

            driver_rate:
                Number(detail.driver_rate || 0),

            driver_additional:
                Number(detail.driver_additional || 0),

            truck: detail.truck || null,
        }))
    })
}

function handleTariffChange() {
    const tariff =
        tariffCandidates.value.find(
            item =>
                Number(item.id) ===
                Number(form.tariff_id)
        )

    if (!tariff) {
        clearTariffValues()

        return
    }

    applyTariff(tariff)
}

function applyTariff(tariff) {
    if (!tariff) {
        return
    }

    form.tariff_id =
        tariff.id

    form.vendor_rate =
        Number(
            tariff.vendor_rate || 0
        )

    form.vendor_additional =
        Number(
            tariff.vendor_additional || 0
        )

    form.driver_rate =
        Number(
            tariff.driver_rate || 0
        )

    form.driver_additional =
        Number(
            tariff.driver_additional || 0
        )

    if (tariff.province) {
        form.destination_province =
            tariff.province
    }

    if (tariff.city) {
        form.destination_city =
            tariff.city
    }
}

function clearTariff() {
    tariffCandidates.value = []

    clearTariffValues()
}

function clearTariffValues() {
    form.tariff_id = null

    form.vendor_rate = 0
    form.vendor_additional = 0

    form.driver_rate = 0
    form.driver_additional = 0
}

function tariffLabel(tariff) {
    const truck =
        tariff.truck?.plate_number ||
        (
            tariff.truck_id != null
                ? `Truk ID ${tariff.truck_id}`
                : 'Tarif umum'
        )

    return [
        tariff.code,
        tariff.name,
        tariff.tariff_type,
        truck,
        `Vendor ${formatCurrency(tariff.vendor_rate)}`,
        `Driver ${formatCurrency(tariff.driver_rate)}`,
    ]
        .filter(Boolean)
        .join(' · ')
}

/*
|--------------------------------------------------------------------------
| Load existing shipment
|--------------------------------------------------------------------------
*/

async function loadShipment() {
    const shipment = props.shipment
    console.log(shipment)
    if (!shipment) {
        resetForm()

        return
    }

    Object.assign(
        form,
        createEmptyForm()
    )

    form.id =
        shipment.id

    form.shipment_number =
        shipment.shipment_number || ''

    form.delivery_order_number = 
        shipment.delivery_order_number || ''

    form.shipment_date =
        normalizeDate(
            shipment.shipment_date
        )

    form.status =
        shipment.status || 'draft'

    form.truck_id =
        shipment.truck_id ?? null

    form.driver_id =
        shipment.driver_id ?? null

    form.tariff_id =
        shipment.tariff_id ?? null

    form.destination_province_id =
        shipment.destination_province_id ??
        null

    form.destination_province =
        shipment.destination_province ||
        ''

    form.destination_city_id =
        shipment.destination_city_id ??
        null

    form.destination_city =
        shipment.destination_city ||
        ''

    form.destination_company =
        shipment.destination_company ||
        ''

    form.destination_address =
        shipment.destination_address ||
        ''

    form.vendor_rate =
        Number(
            shipment.vendor_rate || 0
        )

    form.vendor_additional =
        Number(
            shipment.vendor_additional || 0
        )

    form.vendor_correction =
        Number(
            shipment.vendor_correction || 0
        )

    form.driver_rate =
        Number(
            shipment.driver_rate || 0
        )

    form.driver_additional =
        Number(
            shipment.driver_additional || 0
        )

    form.driver_correction =
        Number(
            shipment.driver_correction || 0
        )

    form.has_balen =
        Boolean(
            shipment.has_balen
        )

    form.balen_description =
        shipment.balen_description ||
        ''

    form.balen_vendor_charge =
        Number(
            shipment.balen_vendor_charge ||
            0
        )

    form.balen_driver_payment =
        Number(
            shipment.balen_driver_payment ||
            0
        )

    form.has_correction =
        Boolean(
            shipment.has_correction
        )

    form.correction_note =
        shipment.correction_note ||
        ''

    form.notes =
        shipment.notes ||
        ''

    /*
     * Load city tanpa mengubah form city.
     */
    if (
        form.destination_province_id
    ) {
        await loadCities(
            form.destination_province_id
        )
    }

    /*
     * Gunakan tarif yang tersimpan.
     */
    if (shipment.tariff) {
        const tariff =
            normalizeTariffDetail(
                shipment.tariff
            )

        tariffCandidates.value = [
            tariff,
        ]

        applyTariff(tariff)
    }
}

function normalizeTariffDetail(detail) {
    return {
        id:
            detail.id,

        shipping_tariff_id:
            detail.shipping_tariff_id,

        code:
            detail.shipping_tariff?.code ||
            detail.code ||
            '',

        name:
            detail.shipping_tariff?.name ||
            detail.name ||
            'Tarif',

        province_id:
            detail.province_id,

        province:
            detail.province ||
            '',

        city_id:
            detail.city_id,

        city:
            detail.city ||
            '',

        truck_id:
            detail.truck_id,

        tariff_type:
            detail.tariff_type ||
            'Tarif',

        truck_type_id:
            detail.truck_type_id,

        vendor_rate:
            Number(
                detail.vendor_rate || 0
            ),

        vendor_additional:
            Number(
                detail.vendor_additional || 0
            ),

        driver_rate:
            Number(
                detail.driver_rate || 0
            ),

        driver_additional:
            Number(
                detail.driver_additional || 0
            ),

        is_active:
            detail.is_active !== false,

        truck:
            detail.truck || null,
    }
}

/*
|--------------------------------------------------------------------------
| Save
|--------------------------------------------------------------------------
*/

async function save() {
    errorMessage.value = ''

    if (!validate()) {
        return
    }

    saving.value = true

    try {
        let response

        if (props.mode === 'create') {
            response =
                await erpApi.shipments.create(
                    buildPayload()
                )
        }

        else if (props.mode === 'edit') {
            response =
                await erpApi.shipments.update(
                    form.id,
                    buildPayload()
                )
        }

        else if (props.mode === 'correction') {
            response =
                await erpApi.shipments.correction(
                    form.id,
                    {
                        vendor_correction:
                            Number(
                                form.vendor_correction ||
                                0
                            ),

                        driver_correction:
                            Number(
                                form.driver_correction ||
                                0
                            ),

                        correction_note:
                            form.correction_note.trim(),
                    }
                )
        }

        const payload =
            response?.data ??
            response

        emit('saved', {
            mode: props.mode,
            shipment:
                payload?.data ??
                payload,
        })
    } catch (error) {
        console.error(
            'Gagal menyimpan shipment:',
            error
        )

        errorMessage.value =
            getApiError(error) ||
            'Gagal menyimpan pengiriman.'
    } finally {
        saving.value = false
    }
}

function buildPayload() {
    return {
        delivery_order_number:
            form.delivery_order_number.trim() ||
            null,

        shipment_number:
            form.shipment_number,

        shipment_date:
            form.shipment_date,

        truck_id:
            form.truck_id || null,

        driver_id:
            form.driver_id || null,

        tariff_id:
            form.tariff_id || null,

        destination_province_id:
            form.destination_province_id
                ? String(
                    form.destination_province_id
                )
                : null,

        destination_province:
            form.destination_province ||
            null,

        destination_city_id:
            form.destination_city_id
                ? String(
                    form.destination_city_id
                )
                : null,

        destination_city:
            form.destination_city ||
            null,

        destination_company:
            form.destination_company.trim() ||
            null,

        destination_address:
            form.destination_address.trim() ||
            null,

        status:
            form.status,

        vendor_rate:
            Number(
                form.vendor_rate || 0
            ),

        vendor_additional:
            Number(
                form.vendor_additional || 0
            ),

        vendor_correction:
            Number(
                form.vendor_correction || 0
            ),

        driver_rate:
            Number(
                form.driver_rate || 0
            ),

        driver_additional:
            Number(
                form.driver_additional || 0
            ),

        driver_correction:
            Number(
                form.driver_correction || 0
            ),

        has_balen:
            Boolean(
                form.has_balen
            ),

        balen_description:
            form.has_balen
                ? (
                    form.balen_description
                        .trim() || null
                )
                : null,

        balen_vendor_charge:
            form.has_balen
                ? Number(
                    form.balen_vendor_charge || 0
                )
                : 0,

        balen_driver_payment:
            form.has_balen
                ? Number(
                    form.balen_driver_payment || 0
                )
                : 0,

        notes:
            form.notes.trim() ||
            null,
    }
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validate() {
    if (!form.shipment_date) {
        errorMessage.value =
            'Tanggal surat jalan wajib diisi.'

        return false
    }

    if (!form.truck_id) {
        errorMessage.value =
            'Truk wajib dipilih.'

        return false
    }

    if (!form.driver_id) {
        errorMessage.value =
            'Driver wajib dipilih.'

        return false
    }

    if (!form.destination_company.trim()) {
        errorMessage.value =
            'Nama perusahaan tujuan wajib diisi.'

        return false
    }

    if (!form.destination_province_id) {
        errorMessage.value =
            'Provinsi wajib dipilih.'

        return false
    }

    if (!form.destination_city_id) {
        errorMessage.value =
            'Kabupaten / Kota wajib dipilih.'

        return false
    }

    if (
        props.mode !== 'correction' &&
        !form.tariff_id
    ) {
        errorMessage.value =
            'Tarif pengiriman wajib dipilih.'

        return false
    }

    if (
        props.mode === 'correction' &&
        !form.correction_note.trim()
    ) {
        errorMessage.value =
            'Alasan koreksi wajib diisi.'

        return false
    }

    return true
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizeList(response) {
    const payload =
        response?.data ??
        response

    if (Array.isArray(payload)) {
        return payload
    }

    if (
        Array.isArray(
            payload?.data
        )
    ) {
        return payload.data
    }

    return []
}

function normalizeDate(value) {
    if (!value) {
        return ''
    }

    return String(value)
        .slice(0, 10)
}

function generateShipmentNumber() {
    const date =
        new Date()

    const year =
        date.getFullYear()

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, '0')

    const day =
        String(
            date.getDate()
        ).padStart(2, '0')

    const random =
        String(
            Math.floor(
                Math.random() * 10000
            )
        ).padStart(4, '0')

    return `SHP-${year}${month}${day}-${random}`
}

function formatCurrency(value) {
    return new Intl.NumberFormat(
        'id-ID',
        {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }
    ).format(
        Number(value || 0)
    )
}

function close() {
    emit('close')
}
</script>