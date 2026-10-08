<script setup>
import {
    computed,
    onMounted,
    reactive,
    ref,
    watch,
} from 'vue'

import {
    Plus,
    Trash2,
    X,
    Save,
    RefreshCw,
} from 'lucide-vue-next'

import {
    erpApi,
    getApiError,
} from '@/services/api'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },

    invoice: {
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
const loadingMaster = ref(false)

const customers = ref([])
const units = ref([])
const invoiceSeries = ref([])

const form = reactive({
    invoice_series_id: '',
    customer_id: '',
    invoice_date: '',
    due_date: '',
    notes: '',
    items: [],
})

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const isEdit = computed(() => {
    return !!props.invoice
})

const modalTitle = computed(() => {
    return isEdit.value
        ? 'Edit Invoice'
        : 'Buat Invoice'
})

const subtotal = computed(() => {
    return form.items.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 0
        const price = Number(item.unit_price) || 0

        return sum + quantity * price
    }, 0)
})

const totalDiscount = computed(() => {
    return form.items.reduce((sum, item) => {
        return sum + (
            Number(item.discount_amount) || 0
        )
    }, 0)
})

const totalTax = computed(() => {
    return form.items.reduce((sum, item) => {
        return sum + (
            Number(item.tax_amount) || 0
        )
    }, 0)
})

const grandTotal = computed(() => {
    return (
        subtotal.value -
        totalDiscount.value +
        totalTax.value
    )
})

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function today() {
    return new Date()
        .toISOString()
        .slice(0, 10)
}

function plusDays(date, days) {
    const result = new Date(date)

    result.setDate(
        result.getDate() + days,
    )

    return result
        .toISOString()
        .slice(0, 10)
}

function createEmptyItem() {
    return {
        key: `${Date.now()}-${Math.random()}`,
        product_id: null,
        description: '',
        quantity: 1,
        unit_id: '',
        unit_price: 0,
        discount_amount: 0,
        tax_amount: 0,
        account_id: null,
        notes: '',
    }
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)
}

/*
|--------------------------------------------------------------------------
| Master Data
|--------------------------------------------------------------------------
*/

async function loadMasterData() {
    loadingMaster.value = true

    try {
        const [
            customerResponse,
            unitResponse,
            seriesResponse,
        ] = await Promise.all([
            erpApi.master.partners.list({
                is_active: true,
            }),

            erpApi.master.units.list({
                is_active: true,
            }),

            erpApi.master.general.list({
                group       : 'invoice_series',
                is_active   : true,
            }),
        ])

        customers.value =
            customerResponse?.data ??
            []

        units.value =
            unitResponse.data?.data ??
            []

        invoiceSeries.value =
            seriesResponse?.data ??
            []
    } catch (error) {
        console.error(
            'Failed to load invoice master data:',
            error,
        )

        alert(
            getApiError(
                error,
                'Gagal memuat master data invoice.',
            ),
        )
    } finally {
        loadingMaster.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

function resetForm() {
    form.invoice_series_id = ''

    form.customer_id = ''

    form.invoice_date = today()

    form.due_date = plusDays(
        form.invoice_date,
        30,
    )

    form.notes = ''

    form.items = [
        createEmptyItem(),
    ]
}

function fillForm(invoice) {
    form.invoice_series_id =
        invoice.invoice_series_id ??
        invoice.invoice_series?.id ??
        ''

    form.customer_id =
        invoice.customer_id ??
        invoice.customer?.id ??
        ''

    form.invoice_date =
        invoice.invoice_date ??
        today()

    form.due_date =
        invoice.due_date ??
        plusDays(
            form.invoice_date,
            30,
        )

    form.notes =
        invoice.notes ?? ''

    form.items =
        (invoice.items ?? []).map(item => ({
            key: `${item.id}-${Math.random()}`,

            product_id:
                item.product_id ?? null,

            description:
                item.description ??
                item.product?.name ??
                '',

            quantity:
                Number(item.quantity) || 1,

            unit_id:
                item.unit_id ??
                item.unit?.id ??
                '',

            unit_price:
                Number(item.unit_price) || 0,

            discount_amount:
                Number(item.discount_amount) || 0,

            tax_amount:
                Number(item.tax_amount) || 0,

            account_id:
                item.account_id ?? null,

            notes:
                item.notes ?? '',
        }))

    if (!form.items.length) {
        form.items = [
            createEmptyItem(),
        ]
    }
}

function addItem() {
    form.items.push(
        createEmptyItem(),
    )
}

function removeItem(index) {
    if (form.items.length <= 1) {
        return
    }

    form.items.splice(index, 1)
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validateForm() {
    if (!form.invoice_series_id) {
        alert('Seri Invoice wajib dipilih.')
        return false
    }

    if (!form.customer_id) {
        alert('Customer wajib dipilih.')
        return false
    }

    if (!form.invoice_date) {
        alert('Tanggal invoice wajib diisi.')
        return false
    }

    if (!form.items.length) {
        alert('Minimal satu item invoice.')
        return false
    }

    for (let i = 0; i < form.items.length; i++) {
        const item = form.items[i]

        if (!String(item.description).trim()) {
            alert(
                `Deskripsi item ke-${i + 1} wajib diisi.`,
            )

            return false
        }

        if (
            Number(item.quantity) <= 0
        ) {
            alert(
                `Qty item ke-${i + 1} harus lebih dari 0.`,
            )

            return false
        }

        if (
            Number(item.unit_price) < 0
        ) {
            alert(
                `Harga item ke-${i + 1} tidak boleh negatif.`,
            )

            return false
        }

        if (
            Number(item.discount_amount) < 0
        ) {
            alert(
                `Diskon item ke-${i + 1} tidak boleh negatif.`,
            )

            return false
        }

        if (
            Number(item.tax_amount) < 0
        ) {
            alert(
                `Pajak item ke-${i + 1} tidak boleh negatif.`,
            )

            return false
        }
    }

    return true
}

/*
|--------------------------------------------------------------------------
| Save
|--------------------------------------------------------------------------
*/

async function save() {
    if (!validateForm()) {
        return
    }

    saving.value = true

    try {
        const payload = {
            invoice_series_id:
                Number(form.invoice_series_id),

            customer_id:
                Number(form.customer_id),

            invoice_date:
                form.invoice_date,

            due_date:
                form.due_date || null,

            notes:
                form.notes || null,

            items: form.items.map(item => ({
                product_id:
                    item.product_id || null,

                description:
                    String(
                        item.description,
                    ).trim(),

                quantity:
                    Number(item.quantity),

                unit_id:
                    item.unit_id
                        ? Number(item.unit_id)
                        : null,

                unit_price:
                    Number(item.unit_price) || 0,

                discount_amount:
                    Number(
                        item.discount_amount,
                    ) || 0,

                tax_amount:
                    Number(
                        item.tax_amount,
                    ) || 0,

                account_id:
                    item.account_id || null,

                notes:
                    item.notes || null,
            })),
        }

        if (isEdit.value) {
            await erpApi.sales.invoices.update(
                props.invoice.id,
                payload,
            )
        } else {
            await erpApi.sales.invoices.store(
                payload,
            )
        }

        emit('saved')
    } catch (error) {
        alert(getApiError(error))
    } finally {
        saving.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle / Watch
|--------------------------------------------------------------------------
*/

watch(
    () => props.show,
    async visible => {
        if (!visible) {
            return
        }

        if (
            !customers.value.length ||
            !units.value.length ||
            !invoiceSeries.value.length
        ) {
            await loadMasterData()
        }

        if (props.invoice) {
            fillForm(
                props.invoice,
            )
        } else {
            resetForm()
        }
    },
)

onMounted(() => {
    loadMasterData()
})
</script>

<template>
    <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        @click.self="emit('close')"
    >
        <div
            class="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >

            <!-- Header -->
            <div
                class="flex items-center justify-between border-b border-slate-200 px-6 py-4"
            >
                <div>
                    <h2 class="text-lg font-bold text-[#172033]">
                        {{ modalTitle }}
                    </h2>

                    <p class="mt-1 text-sm text-[#667085]">
                        Masukkan informasi invoice dan item penjualan.
                    </p>
                </div>

                <button
                    type="button"
                    @click="emit('close')"
                    class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                    <X :size="20" />
                </button>
            </div>

            <!-- Body -->
            <div
                class="min-h-0 flex-1 overflow-y-auto p-6"
            >

                <!-- Header Invoice -->
                <div
                    class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >

                    <!-- Seri Invoice -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-[#172033]"
                        >
                            Seri Invoice
                            <span class="text-red-500">*</span>
                        </label>

                        <select
                            v-if="!isEdit"
                            v-model="form.invoice_series_id"
                            :disabled="loadingMaster"
                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                        >
                            <option value="">
                                Pilih Seri Invoice
                            </option>

                            <option
                                v-for="series in invoiceSeries"
                                :key="series.id"
                                :value="series.id"
                            >
                                {{ series.name }}
                            </option>
                        </select>

                        <!-- Edit: readonly -->
                        <div
                            v-else
                            class="flex h-[42px] items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm text-[#667085]"
                        >
                            <template
                                v-if="props.invoice?.invoice_series"
                            >
                                {{
                                    props.invoice.invoice_series.code
                                }}
                                -
                                {{
                                    props.invoice.invoice_series.name
                                }}
                            </template>

                            <template v-else>
                                Seri invoice tersimpan
                            </template>
                        </div>
                    </div>

                    <!-- Customer -->
                    <div class="lg:col-span-2">
                        <label
                            class="mb-1.5 block text-sm font-medium text-[#172033]"
                        >
                            Customer
                            <span class="text-red-500">*</span>
                        </label>

                        <select
                            v-model="form.customer_id"
                            :disabled="loadingMaster"
                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                        >
                            <option value="">
                                Pilih Customer
                            </option>

                            <option
                                v-for="customer in customers"
                                :key="customer.id"
                                :value="customer.id"
                            >
                                {{ customer.code }}
                                -
                                {{ customer.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Invoice Number -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-[#172033]"
                        >
                            No. Invoice
                        </label>

                        <div
                            class="flex h-[42px] items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm text-[#667085]"
                        >
                            {{
                                invoice?.invoice_number ??
                                'Otomatis saat disimpan'
                            }}
                        </div>
                    </div>

                    <!-- Date -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-[#172033]"
                        >
                            Tanggal Invoice
                        </label>

                        <input
                            v-model="form.invoice_date"
                            type="date"
                            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                        />
                    </div>

                    <!-- Due Date -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-[#172033]"
                        >
                            Jatuh Tempo
                        </label>

                        <input
                            v-model="form.due_date"
                            type="date"
                            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                        />
                    </div>
                </div>

                <!-- Items -->
                <div class="mt-7">

                    <div
                        class="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h3 class="font-semibold text-[#172033]">
                                Item Invoice
                            </h3>

                            <p class="mt-1 text-xs text-[#667085]">
                                Nama produk / jasa diinput manual.
                            </p>
                        </div>

                        <button
                            type="button"
                            @click="addItem"
                            class="inline-flex items-center justify-center gap-2 rounded-lg border border-[#14a2d8] px-3 py-2 text-xs font-semibold text-[#14a2d8] hover:bg-[#14a2d8]/5"
                        >
                            <Plus :size="15" />
                            Tambah Item
                        </button>
                    </div>

                    <div
                        class="overflow-x-auto rounded-xl border border-slate-200"
                    >
                        <table class="min-w-[1050px] w-full text-sm">
                            <thead>
                                <tr class="bg-slate-50">
                                    <th class="px-3 py-3 text-left font-semibold text-[#667085]">
                                        Produk / Jasa
                                    </th>

                                    <th class="w-24 px-3 py-3 text-right font-semibold text-[#667085]">
                                        Qty
                                    </th>

                                    <th class="w-36 px-3 py-3 text-left font-semibold text-[#667085]">
                                        Satuan
                                    </th>

                                    <th class="w-40 px-3 py-3 text-right font-semibold text-[#667085]">
                                        Harga
                                    </th>

                                    <th class="w-36 px-3 py-3 text-right font-semibold text-[#667085]">
                                        Diskon
                                    </th>

                                    <th class="w-36 px-3 py-3 text-right font-semibold text-[#667085]">
                                        Pajak
                                    </th>

                                    <th class="w-12 px-3 py-3"></th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">
                                <tr
                                    v-for="item in form.items"
                                    :key="item.key"
                                >
                                    <!-- Description -->
                                    <td class="p-2">
                                        <input
                                            v-model="item.description"
                                            type="text"
                                            placeholder="Nama produk / jasa"
                                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#14a2d8]"
                                        />
                                    </td>

                                    <!-- Qty -->
                                    <td class="p-2">
                                        <input
                                            v-model.number="item.quantity"
                                            type="number"
                                            min="0.001"
                                            step="0.001"
                                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-[#14a2d8]"
                                        />
                                    </td>

                                    <!-- Unit -->
                                    <td class="p-2">
                                        <select
                                            v-model="item.unit_id"
                                            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#14a2d8]"
                                        >
                                            <option value="">
                                                Pilih Satuan
                                            </option>

                                            <option
                                                v-for="unit in units"
                                                :key="unit.id"
                                                :value="unit.id"
                                            >
                                                {{ unit.code }}
                                                -
                                                {{ unit.name }}
                                            </option>
                                        </select>
                                    </td>

                                    <!-- Price -->
                                    <td class="p-2">
                                        <input
                                            v-model.number="item.unit_price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-[#14a2d8]"
                                        />
                                    </td>

                                    <!-- Discount -->
                                    <td class="p-2">
                                        <input
                                            v-model.number="item.discount_amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-[#14a2d8]"
                                        />
                                    </td>

                                    <!-- Tax -->
                                    <td class="p-2">
                                        <input
                                            v-model.number="item.tax_amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-right text-sm outline-none focus:border-[#14a2d8]"
                                        />
                                    </td>

                                    <!-- Remove -->
                                    <td class="p-2 text-center">
                                        <button
                                            type="button"
                                            @click="removeItem(
                                                form.items.indexOf(item)
                                            )"
                                            :disabled="
                                                form.items.length === 1
                                            "
                                            class="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            <Trash2 :size="16" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Summary -->
                <div class="mt-6 flex justify-end">
                    <div class="w-full max-w-sm space-y-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-[#667085]">
                                Subtotal
                            </span>

                            <span class="font-medium text-[#172033]">
                                {{ formatCurrency(subtotal) }}
                            </span>
                        </div>

                        <div class="flex justify-between text-sm">
                            <span class="text-[#667085]">
                                Diskon
                            </span>

                            <span class="font-medium text-[#172033]">
                                {{ formatCurrency(totalDiscount) }}
                            </span>
                        </div>

                        <div class="flex justify-between text-sm">
                            <span class="text-[#667085]">
                                Pajak
                            </span>

                            <span class="font-medium text-[#172033]">
                                {{ formatCurrency(totalTax) }}
                            </span>
                        </div>

                        <div class="border-t border-slate-200 pt-3">
                            <div class="flex justify-between">
                                <span class="font-semibold text-[#172033]">
                                    Total
                                </span>

                                <span class="text-lg font-bold text-[#003366]">
                                    {{ formatCurrency(grandTotal) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div class="mt-6">
                    <label
                        class="mb-1.5 block text-sm font-medium text-[#172033]"
                    >
                        Catatan
                    </label>

                    <textarea
                        v-model="form.notes"
                        rows="3"
                        placeholder="Catatan invoice..."
                        class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10"
                    ></textarea>
                </div>
            </div>

            <!-- Footer -->
            <div
                class="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="text-sm text-[#667085]">
                    Total invoice:
                    <span class="font-bold text-[#003366]">
                        {{ formatCurrency(grandTotal) }}
                    </span>
                </div>

                <div class="flex justify-end gap-3">
                    <button
                        type="button"
                        @click="emit('close')"
                        class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] hover:bg-slate-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        @click="save"
                        :disabled="
                            saving ||
                            loadingMaster
                        "
                        class="inline-flex items-center gap-2 rounded-xl bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00284f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            v-if="saving"
                            :size="16"
                            class="animate-spin"
                        />

                        <Save
                            v-else
                            :size="16"
                        />

                        {{
                            saving
                                ? 'Menyimpan...'
                                : 'Simpan Draft'
                        }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>