<script setup>
import {
    computed,
    onMounted,
    ref,
} from 'vue'

import {
    Plus,
    Search,
    Eye,
    Pencil,
    CheckCircle2,
    XCircle,
    Check,
    RefreshCw,
    FileText,
    CreditCard,
    Printer,
} from 'lucide-vue-next'

import {
    erpApi,
    getApiError,
} from '@/services/api'

import SalesInvoiceModal from '../../components/erp/sales-invoices/SalesInvoiceModal.vue'
import PaymentModal from '../../components/erp/sales-invoices/PaymentModal.vue'

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const loading = ref(false)
const actionLoading = ref(false)

const invoices = ref([])

const search = ref('')
const statusFilter = ref('all')
const dateFilter = ref('')

const showModal = ref(false)
const showDetailModal = ref(false)
const showPaymentModal = ref(false)
const paymentInvoice = ref(null)

const selectedInvoice = ref(null)
const editingInvoice = ref(null)

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const filteredInvoices = computed(() => {
    const keyword = search.value
        .trim()
        .toLowerCase()

    return invoices.value.filter(invoice => {
        const number = String(
            invoice.invoice_number ?? ''
        ).toLowerCase()

        const customer = String(
            invoice.customer?.name ??
            invoice.customer_name ??
            ''
        ).toLowerCase()

        const customerCode = String(
            invoice.customer?.code ??
            invoice.customer_code ??
            ''
        ).toLowerCase()

        const series = String(
            invoice.invoice_series?.name ??
            invoice.invoiceSeries?.name ??
            invoice.invoice_series_name ??
            ''
        ).toLowerCase()

        const seriesCode = String(
            invoice.invoice_series?.code ??
            invoice.invoiceSeries?.code ??
            ''
        ).toLowerCase()

        const matchesSearch =
            !keyword ||
            number.includes(keyword) ||
            customer.includes(keyword) ||
            customerCode.includes(keyword) ||
            series.includes(keyword) ||
            seriesCode.includes(keyword)

        const matchesStatus =
            statusFilter.value === 'all' ||
            invoice.status === statusFilter.value

        const invoiceDate =
            invoice.invoice_date ?? ''

        const matchesDate =
            !dateFilter.value ||
            String(invoiceDate).startsWith(
                dateFilter.value
            )

        return (
            matchesSearch &&
            matchesStatus &&
            matchesDate
        )
    })
})

const stats = computed(() => {
    const data = invoices.value

    return [
        {
            label: 'Total Invoice',
            value: data.length,
            icon: FileText,
            iconClass:
                'bg-blue-50 text-blue-600',
        },

        {
            label: 'Draft',
            value: data.filter(
                item =>
                    item.status === 'draft'
            ).length,
            icon: Pencil,
            iconClass:
                'bg-slate-100 text-slate-600',
        },

        {
            label: 'Belum Lunas',
            value: data.filter(
                item =>
                    item.status === 'approved' ||
                    item.status === 'partial'
            ).length,
            icon: CreditCard,
            iconClass:
                'bg-amber-50 text-amber-600',
        },

        {
            label: 'Lunas',
            value: data.filter(
                item =>
                    item.status === 'paid'
            ).length,
            icon: Check,
            iconClass:
                'bg-emerald-50 text-emerald-600',
        },
    ]
})

const filteredTotal = computed(() => {
    return filteredInvoices.value.reduce(
        (sum, invoice) => {
            return (
                sum +
                Number(
                    invoice.total_amount ??
                    invoice.total ??
                    0
                )
            )
        },
        0
    )
})

/*
|--------------------------------------------------------------------------
| Load
|--------------------------------------------------------------------------
*/

async function loadInvoices() {
    loading.value = true

    try {
        const params = {}

        if (search.value.trim()) {
            params.search =
                search.value.trim()
        }

        if (
            statusFilter.value !== 'all'
        ) {
            params.status =
                statusFilter.value
        }

        if (dateFilter.value) {
            params.month =
                dateFilter.value
        }

        const response =
            await erpApi.sales.invoices.list(
                params
            )

        invoices.value =
            response.data?.data ?? []
    } catch (error) {
        alert(getApiError(error))
    } finally {
        loading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

function openCreateModal() {
    editingInvoice.value = null
    showModal.value = true
}

function openEditModal(invoice) {
    if (
        invoice.status !== 'draft'
    ) {
        return
    }

    editingInvoice.value = invoice
    showModal.value = true
}

function closeModal() {
    showModal.value = false
    editingInvoice.value = null
}

function handleSaved() {
    closeModal()
    loadInvoices()
}

function openPaymentModal(invoice) {
    if (
        ![
            'approved',
            'partial',
        ].includes(invoice.status)
    ) {
        return
    }

    paymentInvoice.value = invoice
    showPaymentModal.value = true
}

function closePaymentModal() {
    showPaymentModal.value = false
    paymentInvoice.value = null
}

/*
|--------------------------------------------------------------------------
| Detail
|--------------------------------------------------------------------------
*/

async function openDetail(invoice) {
    try {
        const response =
            await erpApi.sales.invoices.show(
                invoice.id
            )

        selectedInvoice.value =
            response.data?.data ??
            response.data

        showDetailModal.value = true
    } catch (error) {
        alert(getApiError(error))
    }
}

function closeDetail() {
    showDetailModal.value = false
    selectedInvoice.value = null
}

/*
|--------------------------------------------------------------------------
| Approve
|--------------------------------------------------------------------------
*/

async function approveInvoice(invoice) {
    if (
        !confirm(
            `Approve invoice ${invoice.invoice_number}?`
        )
    ) {
        return
    }

    actionLoading.value = true

    try {
        await erpApi.sales.invoices.approve(
            invoice.id
        )

        await loadInvoices()

        if (
            selectedInvoice.value?.id ===
            invoice.id
        ) {
            await openDetail(invoice)
        }

        alert(
            'Invoice berhasil di-approve.'
        )
    } catch (error) {
        alert(getApiError(error))
    } finally {
        actionLoading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Paid
|--------------------------------------------------------------------------
|
| Sementara menggunakan endpoint complete()
| sebagai transisi menjadi paid.
|
| Nanti ketika modul pembayaran sudah ada,
| endpoint ini sebaiknya diganti menjadi
| payment / mark-paid berdasarkan pembayaran aktual.
|--------------------------------------------------------------------------
*/
async function handlePayment(payload) {
    if (!paymentInvoice.value) {
        return
    }

    actionLoading.value = true

    try {
        const invoiceId =
            paymentInvoice.value.id

        await erpApi.sales.invoices.payment(
            invoiceId,
            payload
        )

        closePaymentModal()

        await loadInvoices()

        if (
            selectedInvoice.value?.id ===
            invoiceId
        ) {
            await openDetail({
                id: invoiceId,
            })
        }

        alert(
            'Pembayaran berhasil dicatat.'
        )
    } catch (error) {
        alert(
            getApiError(error)
        )
    } finally {
        actionLoading.value = false
    }
}

function markPaid(invoice) {
    openPaymentModal(invoice)
}

/*
|--------------------------------------------------------------------------
| Cancel
|--------------------------------------------------------------------------
*/

async function cancelInvoice(invoice) {
    if (
        !confirm(
            `Batalkan invoice ${invoice.invoice_number}?`
        )
    ) {
        return
    }

    actionLoading.value = true

    try {
        await erpApi.sales.invoices.cancel(
            invoice.id
        )

        await loadInvoices()

        if (
            selectedInvoice.value?.id ===
            invoice.id
        ) {
            await openDetail(invoice)
        }

        alert(
            'Invoice berhasil dibatalkan.'
        )
    } catch (error) {
        alert(getApiError(error))
    } finally {
        actionLoading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatCurrency(value) {
    return new Intl.NumberFormat(
        'id-ID',
        {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }
    ).format(Number(value) || 0)
}

function formatDate(value) {
    if (!value) {
        return '-'
    }

    return new Intl.DateTimeFormat(
        'id-ID',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }
    ).format(new Date(value))
}

function statusLabel(status) {
    const labels = {
        draft: 'Draft',
        approved: 'Approved',
        partial: 'Sebagian',
        paid: 'Lunas',
        cancelled: 'Dibatalkan',
    }

    return (
        labels[status] ??
        status ??
        '-'
    )
}

function statusClass(status) {
    const classes = {
        draft:
            'bg-slate-100 text-slate-600',

        approved:
            'bg-blue-50 text-blue-700',

        partial:
            'bg-amber-50 text-amber-700',

        paid:
            'bg-emerald-50 text-emerald-700',

        cancelled:
            'bg-red-50 text-red-700',
    }

    return (
        classes[status] ??
        'bg-slate-100 text-slate-600'
    )
}

function customerName(invoice) {
    return (
        invoice.customer?.name ??
        invoice.customer_name ??
        '-'
    )
}

function customerCode(invoice) {
    return (
        invoice.customer?.code ??
        invoice.customer_code ??
        '-'
    )
}

function seriesName(invoice) {
    return (
        invoice.invoice_series?.name ??
        invoice.invoiceSeries?.name ??
        invoice.invoice_series_name ??
        '-'
    )
}

function seriesCode(invoice) {
    return (
        invoice.invoice_series?.code ??
        invoice.invoiceSeries?.code ??
        invoice.invoice_series_code ??
        '-'
    )
}

function invoiceTotal(invoice) {
    return Number(
        invoice.total_amount ??
        invoice.total ??
        0
    )
}

function paidAmount(invoice) {
    return Number(
        invoice.paid_amount ?? 0
    )
}

function remainingAmount(invoice) {
    return Math.max(
        invoiceTotal(invoice) -
        paidAmount(invoice),
        0
    )
}

function itemDescription(item) {
    return (
        item.description ??
        item.product?.name ??
        '-'
    )
}

function itemTotal(item) {
    return (
        Number(item.subtotal ?? 0) +
        Number(item.tax_amount ?? 0)
    )
}

const printInvoice = async (invoice) => {
    try {
        const response = await erpApi.sales.invoices.pdf(
            invoice.id
        )

        const blob = new Blob(
            [response.data],
            {
                type: 'application/pdf',
            }
        )

        const url = window.URL.createObjectURL(blob)

        window.open(url, '_blank')

        setTimeout(() => {
            window.URL.revokeObjectURL(url)
        }, 60000)

    } catch (error) {
        console.error(error)

        alert(
            getApiError(error) ||
            'PDF invoice gagal dibuka.'
        )
    }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
    loadInvoices()
})
</script>

<template>
    <div class="space-y-6">

        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1
                    class="text-2xl font-bold text-[#172033]"
                >
                    Invoice Penjualan
                </h1>

                <p
                    class="mt-1 text-sm text-[#667085]"
                >
                    Kelola invoice penjualan dan
                    tagihan customer.
                </p>
            </div>

            <div class="flex gap-2">
                <button
                    type="button"
                    @click="loadInvoices"
                    :disabled="loading"
                    class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#667085] transition hover:border-[#14a2d8] hover:text-[#14a2d8] disabled:opacity-50"
                >
                    <RefreshCw
                        :size="16"
                        :class="{
                            'animate-spin':
                                loading,
                        }"
                    />

                    Refresh
                </button>

                <button
                    type="button"
                    @click="openCreateModal"
                    class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00284f]"
                >
                    <Plus :size="18" />

                    Buat Invoice
                </button>
            </div>
        </div>

        <!-- Stats -->
        <div
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
            <div
                v-for="stat in stats"
                :key="stat.label"
                class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div
                    class="flex items-start justify-between"
                >
                    <div>
                        <p
                            class="text-sm text-[#667085]"
                        >
                            {{ stat.label }}
                        </p>

                        <p
                            class="mt-2 text-2xl font-bold text-[#172033]"
                        >
                            {{ stat.value }}
                        </p>
                    </div>

                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl"
                        :class="stat.iconClass"
                    >
                        <component
                            :is="stat.icon"
                            :size="19"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

            <!-- Toolbar -->
            <div
                class="border-b border-slate-200 p-4"
            >
                <div
                    class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
                >
                    <div
                        class="relative w-full lg:max-w-md"
                    >
                        <Search
                            :size="17"
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            v-model="search"
                            type="text"
                            placeholder="Cari invoice, customer, atau jenis..."
                            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm outline-none transition focus:border-[#14a2d8] focus:bg-white focus:ring-2 focus:ring-[#14a2d8]/10"
                        />
                    </div>

                    <div
                        class="flex flex-col gap-3 sm:flex-row"
                    >
                        <select
                            v-model="statusFilter"
                            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#172033] outline-none focus:border-[#14a2d8]"
                        >
                            <option value="all">
                                Semua Status
                            </option>

                            <option value="draft">
                                Draft
                            </option>

                            <option value="approved">
                                Approved
                            </option>

                            <option value="partial">
                                Sebagian
                            </option>

                            <option value="paid">
                                Lunas
                            </option>

                            <option value="cancelled">
                                Dibatalkan
                            </option>
                        </select>

                        <input
                            v-model="dateFilter"
                            type="month"
                            class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#172033] outline-none focus:border-[#14a2d8]"
                        />
                    </div>
                </div>
            </div>

            <!-- Loading -->
            <div
                v-if="loading"
                class="flex items-center justify-center px-5 py-16"
            >
                <RefreshCw
                    :size="22"
                    class="animate-spin text-[#14a2d8]"
                />

                <span
                    class="ml-3 text-sm text-[#667085]"
                >
                    Memuat invoice...
                </span>
            </div>

            <!-- Table -->
            <div
                v-else
                class="overflow-x-auto"
            >
                <table
                    class="min-w-[1100px] w-full text-sm"
                >
                    <thead>
                        <tr
                            class="border-b border-slate-200 bg-slate-50"
                        >
                            <th
                                class="px-5 py-3 text-left font-semibold text-[#667085]"
                            >
                                No. Invoice
                            </th>

                            <th
                                class="px-5 py-3 text-left font-semibold text-[#667085]"
                            >
                                Jenis
                            </th>

                            <th
                                class="px-5 py-3 text-left font-semibold text-[#667085]"
                            >
                                Customer
                            </th>

                            <th
                                class="px-5 py-3 text-left font-semibold text-[#667085]"
                            >
                                Tanggal
                            </th>

                            <th
                                class="px-5 py-3 text-left font-semibold text-[#667085]"
                            >
                                Jatuh Tempo
                            </th>

                            <th
                                class="px-5 py-3 text-right font-semibold text-[#667085]"
                            >
                                Total
                            </th>

                            <th
                                class="px-5 py-3 text-center font-semibold text-[#667085]"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-3 text-center font-semibold text-[#667085]"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody
                        class="divide-y divide-slate-100"
                    >
                        <tr
                            v-for="invoice in filteredInvoices"
                            :key="invoice.id"
                            class="transition hover:bg-slate-50"
                        >
                            <!-- Number -->
                            <td
                                class="whitespace-nowrap px-5 py-4"
                            >
                                <button
                                    type="button"
                                    @click="openDetail(invoice)"
                                    class="font-semibold text-[#003366] hover:text-[#14a2d8]"
                                >
                                    {{
                                        invoice.invoice_number
                                    }}
                                </button>
                            </td>

                            <!-- Series -->
                            <td
                                class="px-5 py-4"
                            >
                                <span
                                    class="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                                >
                                    {{
                                        seriesCode(invoice)
                                    }}
                                </span>

                                <p
                                    class="mt-1 text-xs text-[#667085]"
                                >
                                    {{
                                        seriesName(invoice)
                                    }}
                                </p>
                            </td>

                            <!-- Customer -->
                            <td
                                class="px-5 py-4"
                            >
                                <p
                                    class="font-medium text-[#172033]"
                                >
                                    {{
                                        customerName(
                                            invoice
                                        )
                                    }}
                                </p>

                                <p
                                    class="mt-0.5 text-xs text-[#667085]"
                                >
                                    {{
                                        customerCode(
                                            invoice
                                        )
                                    }}
                                </p>
                            </td>

                            <!-- Date -->
                            <td
                                class="whitespace-nowrap px-5 py-4 text-[#667085]"
                            >
                                {{
                                    formatDate(
                                        invoice.invoice_date
                                    )
                                }}
                            </td>

                            <!-- Due -->
                            <td
                                class="whitespace-nowrap px-5 py-4 text-[#667085]"
                            >
                                {{
                                    formatDate(
                                        invoice.due_date
                                    )
                                }}
                            </td>

                            <!-- Total -->
                            <td
                                class="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#172033]"
                            >
                                {{
                                    formatCurrency(
                                        invoiceTotal(
                                            invoice
                                        )
                                    )
                                }}

                                <p
                                    v-if="
                                        invoice.status ===
                                        'partial'
                                    "
                                    class="mt-1 text-xs font-normal text-amber-600"
                                >
                                    Sisa:
                                    {{
                                        formatCurrency(
                                            remainingAmount(
                                                invoice
                                            )
                                        )
                                    }}
                                </p>
                            </td>

                            <!-- Status -->
                            <td
                                class="px-5 py-4 text-center"
                            >
                                <span
                                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                    :class="
                                        statusClass(
                                            invoice.status
                                        )
                                    "
                                >
                                    {{
                                        statusLabel(
                                            invoice.status
                                        )
                                    }}
                                </span>
                            </td>

                            <!-- Actions -->
                            <td
                                class="px-5 py-4"
                            >
                                <div
                                    class="flex items-center justify-center gap-1.5"
                                >
                                    <!-- Print PDF -->
                                    <button
                                        v-if="
                                            invoice.status === 'approved' ||
                                            invoice.status === 'partial' ||
                                            invoice.status === 'paid'
                                        "
                                        type="button"
                                        title="Print PDF"
                                        @click="printInvoice(invoice)"
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#003366]"
                                    >
                                        <Printer :size="16" />
                                    </button>
    
                                    <!-- Detail -->
                                    <button
                                        type="button"
                                        title="Detail"
                                        @click="
                                            openDetail(
                                                invoice
                                            )
                                        "
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#003366]"
                                    >
                                        <Eye
                                            :size="16"
                                        />
                                    </button>

                                    <!-- Edit -->
                                    <button
                                        v-if="
                                            invoice.status ===
                                            'draft'
                                        "
                                        type="button"
                                        title="Edit"
                                        @click="
                                            openEditModal(
                                                invoice
                                            )
                                        "
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <Pencil
                                            :size="16"
                                        />
                                    </button>

                                    <!-- Approve -->
                                    <button
                                        v-if="
                                            invoice.status ===
                                            'draft'
                                        "
                                        type="button"
                                        title="Approve"
                                        @click="
                                            approveInvoice(
                                                invoice
                                            )
                                        "
                                        :disabled="
                                            actionLoading
                                        "
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50"
                                    >
                                        <CheckCircle2
                                            :size="16"
                                        />
                                    </button>

                                    <!-- Mark Paid -->
                                    <button
                                        v-if="
                                            invoice.status ===
                                            'approved'
                                        "
                                        type="button"
                                        title="Tandai Lunas"
                                        @click="
                                            markPaid(
                                                invoice
                                            )
                                        "
                                        :disabled="
                                            actionLoading
                                        "
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                                    >
                                        <Check
                                            :size="16"
                                        />
                                    </button>

                                    <!-- Cancel -->
                                    <button
                                        v-if="
                                            invoice.status ===
                                                'draft' ||
                                            invoice.status ===
                                                'approved' ||
                                            invoice.status ===
                                                'partial'
                                        "
                                        type="button"
                                        title="Cancel"
                                        @click="
                                            cancelInvoice(
                                                invoice
                                            )
                                        "
                                        :disabled="
                                            actionLoading
                                        "
                                        class="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                    >
                                        <XCircle
                                            :size="16"
                                        />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr
                            v-if="
                                filteredInvoices.length ===
                                0
                            "
                        >
                            <td
                                colspan="8"
                                class="px-5 py-16 text-center"
                            >
                                <FileText
                                    :size="34"
                                    class="mx-auto text-slate-300"
                                />

                                <p
                                    class="mt-3 font-medium text-[#172033]"
                                >
                                    Invoice tidak
                                    ditemukan
                                </p>

                                <p
                                    class="mt-1 text-sm text-[#667085]"
                                >
                                    Coba ubah
                                    pencarian atau
                                    filter.
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer -->
            <div
                class="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <p
                    class="text-sm text-[#667085]"
                >
                    Menampilkan
                    <span
                        class="font-semibold text-[#172033]"
                    >
                        {{
                            filteredInvoices.length
                        }}
                    </span>
                    invoice
                </p>

                <p
                    class="text-sm text-[#667085]"
                >
                    Total:
                    <span
                        class="font-bold text-[#172033]"
                    >
                        {{
                            formatCurrency(
                                filteredTotal
                            )
                        }}
                    </span>
                </p>
            </div>
        </div>

        <!-- Create / Edit -->
        <SalesInvoiceModal
            :show="showModal"
            :invoice="editingInvoice"
            @close="closeModal"
            @saved="handleSaved"
        />

        <PaymentModal
            :show="showPaymentModal"
            :invoice="paymentInvoice"
            @close="closePaymentModal"
            @saved="handlePayment"
        />

        <!-- Detail Modal -->
        <div
            v-if="showDetailModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            @click.self="closeDetail"
        >
            <div
                class="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <!-- Header -->
                <div
                    class="flex items-center justify-between border-b border-slate-200 px-6 py-4"
                >
                    <div>
                        <h2
                            class="text-lg font-bold text-[#172033]"
                        >
                            Detail Invoice
                        </h2>

                        <div
                            class="mt-1 flex flex-wrap items-center gap-2"
                        >
                            <p
                                class="text-sm text-[#667085]"
                            >
                                {{
                                    selectedInvoice?.invoice_number
                                }}
                            </p>

                            <span
                                v-if="
                                    selectedInvoice
                                "
                                class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                :class="
                                    statusClass(
                                        selectedInvoice.status
                                    )
                                "
                            >
                                {{
                                    statusLabel(
                                        selectedInvoice.status
                                    )
                                }}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="closeDetail"
                        class="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                    >
                        <XCircle
                            :size="20"
                        />
                    </button>
                </div>

                <!-- Body -->
                <div
                    v-if="selectedInvoice"
                    class="max-h-[calc(90vh-80px)] overflow-y-auto p-6"
                >
                    <!-- Header info -->
                    <div
                        class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
                    >
                        <div>
                            <p
                                class="text-xs text-[#667085]"
                            >
                                No. Invoice
                            </p>

                            <p
                                class="mt-1 font-semibold text-[#172033]"
                            >
                                {{
                                    selectedInvoice.invoice_number
                                }}
                            </p>
                        </div>

                        <div>
                            <p
                                class="text-xs text-[#667085]"
                            >
                                Jenis Invoice
                            </p>

                            <p
                                class="mt-1 font-semibold text-[#172033]"
                            >
                                {{
                                    seriesCode(
                                        selectedInvoice
                                    )
                                }}
                            </p>

                            <p
                                class="text-xs text-[#667085]"
                            >
                                {{
                                    seriesName(
                                        selectedInvoice
                                    )
                                }}
                            </p>
                        </div>

                        <div>
                            <p
                                class="text-xs text-[#667085]"
                            >
                                Customer
                            </p>

                            <p
                                class="mt-1 font-semibold text-[#172033]"
                            >
                                {{
                                    customerName(
                                        selectedInvoice
                                    )
                                }}
                            </p>
                        </div>

                        <div>
                            <p
                                class="text-xs text-[#667085]"
                            >
                                Tanggal
                            </p>

                            <p
                                class="mt-1 font-medium text-[#172033]"
                            >
                                {{
                                    formatDate(
                                        selectedInvoice.invoice_date
                                    )
                                }}
                            </p>
                        </div>

                        <div>
                            <p
                                class="text-xs text-[#667085]"
                            >
                                Jatuh Tempo
                            </p>

                            <p
                                class="mt-1 font-medium text-[#172033]"
                            >
                                {{
                                    formatDate(
                                        selectedInvoice.due_date
                                    )
                                }}
                            </p>
                        </div>
                    </div>

                    <!-- Items -->
                    <div
                        class="mt-6 overflow-hidden rounded-xl border border-slate-200"
                    >
                        <div
                            class="overflow-x-auto"
                        >
                            <table
                                class="min-w-full text-sm"
                            >
                                <thead
                                    class="bg-slate-50"
                                >
                                    <tr>
                                        <th
                                            class="px-4 py-3 text-left font-semibold text-[#667085]"
                                        >
                                            Item
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right font-semibold text-[#667085]"
                                        >
                                            Qty
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right font-semibold text-[#667085]"
                                        >
                                            Harga
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right font-semibold text-[#667085]"
                                        >
                                            Diskon
                                        </th>

                                        <th
                                            class="px-4 py-3 text-right font-semibold text-[#667085]"
                                        >
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody
                                    class="divide-y divide-slate-100"
                                >
                                    <tr
                                        v-for="item in selectedInvoice.items ?? []"
                                        :key="item.id"
                                    >
                                        <td
                                            class="px-4 py-3"
                                        >
                                            <p
                                                class="font-medium text-[#172033]"
                                            >
                                                {{
                                                    itemDescription(
                                                        item
                                                    )
                                                }}
                                            </p>

                                            <p
                                                v-if="
                                                    item.notes
                                                "
                                                class="mt-0.5 text-xs text-[#667085]"
                                            >
                                                {{
                                                    item.notes
                                                }}
                                            </p>
                                        </td>

                                        <td
                                            class="px-4 py-3 text-right"
                                        >
                                            {{
                                                item.quantity
                                            }}

                                            {{
                                                item.unit?.code ??
                                                ''
                                            }}
                                        </td>

                                        <td
                                            class="px-4 py-3 text-right"
                                        >
                                            {{
                                                formatCurrency(
                                                    item.unit_price
                                                )
                                            }}
                                        </td>

                                        <td
                                            class="px-4 py-3 text-right"
                                        >
                                            {{
                                                formatCurrency(
                                                    item.discount_amount
                                                )
                                            }}
                                        </td>

                                        <td
                                            class="px-4 py-3 text-right font-semibold"
                                        >
                                            {{
                                                formatCurrency(
                                                    itemTotal(
                                                        item
                                                    )
                                                )
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Payment Summary -->
                    <div
                        class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2"
                    >
                        <!-- Notes -->
                        <div
                            v-if="
                                selectedInvoice.notes
                            "
                            class="rounded-xl bg-slate-50 p-4"
                        >
                            <p
                                class="text-xs font-semibold text-[#667085]"
                            >
                                Catatan
                            </p>

                            <p
                                class="mt-1 whitespace-pre-line text-sm text-[#172033]"
                            >
                                {{
                                    selectedInvoice.notes
                                }}
                            </p>
                        </div>

                        <div
                            v-else
                        ></div>

                        <!-- Summary -->
                        <div
                            class="w-full space-y-3"
                        >
                            <div
                                class="flex justify-between text-sm"
                            >
                                <span
                                    class="text-[#667085]"
                                >
                                    Subtotal
                                </span>

                                <span
                                    class="font-medium"
                                >
                                    {{
                                        formatCurrency(
                                            selectedInvoice.subtotal
                                        )
                                    }}
                                </span>
                            </div>

                            <div
                                class="flex justify-between text-sm"
                            >
                                <span
                                    class="text-[#667085]"
                                >
                                    Diskon
                                </span>

                                <span
                                    class="font-medium"
                                >
                                    {{
                                        formatCurrency(
                                            selectedInvoice.discount_amount
                                        )
                                    }}
                                </span>
                            </div>

                            <div
                                class="flex justify-between text-sm"
                            >
                                <span
                                    class="text-[#667085]"
                                >
                                    Pajak
                                </span>

                                <span
                                    class="font-medium"
                                >
                                    {{
                                        formatCurrency(
                                            selectedInvoice.tax_amount
                                        )
                                    }}
                                </span>
                            </div>

                            <div
                                class="border-t border-slate-200 pt-3"
                            >
                                <div
                                    class="flex justify-between"
                                >
                                    <span
                                        class="font-semibold text-[#172033]"
                                    >
                                        Total
                                    </span>

                                    <span
                                        class="text-lg font-bold text-[#003366]"
                                    >
                                        {{
                                            formatCurrency(
                                                selectedInvoice.total_amount
                                            )
                                        }}
                                    </span>
                                </div>
                            </div>

                            <!-- Payment -->
                            <div
                                v-if="
                                    selectedInvoice.status ===
                                        'partial' ||
                                    selectedInvoice.status ===
                                        'paid'
                                "
                                class="border-t border-slate-200 pt-3"
                            >
                                <div
                                    class="flex justify-between text-sm"
                                >
                                    <span
                                        class="text-[#667085]"
                                    >
                                        Sudah Dibayar
                                    </span>

                                    <span
                                        class="font-semibold text-emerald-600"
                                    >
                                        {{
                                            formatCurrency(
                                                paidAmount(
                                                    selectedInvoice
                                                )
                                            )
                                        }}
                                    </span>
                                </div>

                                <div
                                    class="mt-2 flex justify-between text-sm"
                                >
                                    <span
                                        class="text-[#667085]"
                                    >
                                        Sisa Tagihan
                                    </span>

                                    <span
                                        class="font-semibold"
                                        :class="
                                            remainingAmount(
                                                selectedInvoice
                                            ) > 0
                                                ? 'text-amber-600'
                                                : 'text-emerald-600'
                                        "
                                    >
                                        {{
                                            formatCurrency(
                                                remainingAmount(
                                                    selectedInvoice
                                                )
                                            )
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div
                        class="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-5"
                    >
                        <!-- Edit -->
                        <button
                            v-if="
                                selectedInvoice.status ===
                                'draft'
                            "
                            type="button"
                            @click="
                                openEditModal(
                                    selectedInvoice
                                );
                                closeDetail()
                            "
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#667085] hover:bg-slate-50"
                        >
                            <Pencil
                                :size="16"
                            />

                            Edit
                        </button>

                        <!-- Approve -->
                        <button
                            v-if="
                                selectedInvoice.status ===
                                'draft'
                            "
                            type="button"
                            @click="
                                approveInvoice(
                                    selectedInvoice
                                )
                            "
                            class="inline-flex items-center gap-2 rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00284f]"
                        >
                            <CheckCircle2
                                :size="16"
                            />

                            Approve
                        </button>

                        <!-- Payment -->
                        <button
                            v-if="
                                selectedInvoice.status === 'approved' ||
                                selectedInvoice.status === 'partial'
                            "
                            type="button"
                            @click="
                                markPaid(
                                    selectedInvoice
                                )
                            "
                            class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            <CreditCard :size="16" />

                            Catat Pembayaran
                        </button>

                        <!-- Cancel -->
                        <button
                            v-if="
                                selectedInvoice.status ===
                                    'draft' ||
                                selectedInvoice.status ===
                                    'approved' ||
                                selectedInvoice.status ===
                                    'partial'
                            "
                            type="button"
                            @click="
                                cancelInvoice(
                                    selectedInvoice
                                )
                            "
                            class="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                            <XCircle
                                :size="16"
                            />

                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>