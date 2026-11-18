<template>
  <div class="min-h-full bg-slate-50 p-4 sm:p-6">
    <!-- =========================================================
         HEADER
    ========================================================== -->
    <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14a2d8]/10 text-[#14a2d8]">
            <SlidersHorizontal class="h-6 w-6" />
          </div>

          <div>
            <h1 class="text-xl font-bold text-slate-800">Penyesuaian Stok</h1>

            <p class="text-sm text-slate-500">
              Kelola riwayat stock opname dan koreksi selisih stok gudang.
            </p>
          </div>
        </div>
      </div>

      <button type="button" @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14a2d8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#118fc0]">
        <Plus class="h-4 w-4" />
        Buat Penyesuaian
      </button>
    </div>

    <!-- =========================================================
         ERROR
    ========================================================== -->
    <div v-if="error"
      class="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{{ error }}</span>

      <button type="button" @click="loadAdjustments" class="font-semibold hover:underline">
        Coba lagi
      </button>
    </div>

    <!-- =========================================================
         SUMMARY
    ========================================================== -->
    <div class="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <!-- Total -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-slate-500">Total Dokumen</p>

            <p class="mt-2 text-2xl font-bold text-slate-800">
              {{ totalDocuments }}
            </p>
          </div>

          <div class="rounded-xl bg-slate-100 p-2.5 text-slate-600">
            <FileText class="h-5 w-5" />
          </div>
        </div>
      </div>

      <!-- Draft -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-slate-500">Draft</p>

            <p class="mt-2 text-2xl font-bold text-amber-600">
              {{ draftDocuments }}
            </p>
          </div>

          <div class="rounded-xl bg-amber-50 p-2.5 text-amber-600">
            <Clock class="h-5 w-5" />
          </div>
        </div>
      </div>

      <!-- Disetujui -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-slate-500">Disetujui</p>

            <p class="mt-2 text-2xl font-bold text-emerald-600">
              {{ approvedDocuments }}
            </p>
          </div>

          <div class="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
            <CheckCircle2 class="h-5 w-5" />
          </div>
        </div>
      </div>

      <!-- Dibatalkan -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-medium text-slate-500">Dibatalkan</p>

            <p class="mt-2 text-2xl font-bold text-red-600">
              {{ cancelledDocuments }}
            </p>
          </div>

          <div class="rounded-xl bg-red-50 p-2.5 text-red-600">
            <XCircle class="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>

    <!-- =========================================================
         FILTER
    ========================================================== -->
    <div class="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-3 lg:flex-row">
        <!-- Search -->
        <div class="relative flex-1">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input v-model="filters.search" @input="handleSearch" type="text"
            placeholder="Cari nomor dokumen, alasan, catatan..."
            class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10" />
        </div>

        <!-- Warehouse -->
        <select v-model="filters.warehouse_id" @change="handleFilterChange"
          class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10">
          <option value="">Semua Gudang</option>

          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
            {{ warehouse.name }}
          </option>
        </select>

        <!-- Status -->
        <select v-model="filters.status" @change="handleFilterChange"
          class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#14a2d8] focus:ring-2 focus:ring-[#14a2d8]/10">
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="approved">Disetujui</option>
          <option value="cancelled">Dibatalkan</option>
        </select>

        <!-- Reset -->
        <button type="button" @click="resetFilters"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <RefreshCw class="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>

    <!-- =========================================================
         TABLE
    ========================================================== -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <!-- Loading -->
      <div v-if="loading" class="flex min-h-[300px] flex-col items-center justify-center gap-3 text-slate-500">
        <RefreshCw class="h-6 w-6 animate-spin text-[#14a2d8]" />

        <span class="text-sm">Memuat data penyesuaian stok...</span>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredAdjustments.length === 0"
        class="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <div class="rounded-2xl bg-slate-100 p-4 text-slate-400">
          <SlidersHorizontal class="h-8 w-8" />
        </div>

        <h3 class="mt-4 text-sm font-semibold text-slate-700">
          Belum ada data penyesuaian stok
        </h3>

        <p class="mt-1 max-w-sm text-sm text-slate-500">
          Buat penyesuaian baru untuk mencatat hasil stock opname atau ubah filter pencarian.
        </p>
      </div>

      <!-- Desktop Table -->
      <div v-else class="hidden overflow-x-auto lg:block">
        <table class="min-w-full">
          <thead class="border-b border-slate-200 bg-slate-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                No. Dokumen
              </th>

              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tanggal
              </th>

              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Gudang
              </th>

              <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Alasan
              </th>

              <th class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Jumlah Item
              </th>

              <th class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th class="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="adj in filteredAdjustments" :key="adj.id" class="transition hover:bg-slate-50/70">
              <!-- No Dokumen -->
              <td class="px-5 py-4">
                <span class="font-mono text-sm font-semibold text-slate-800">
                  {{ adj.code || adj.adjustment_number || `ADJ-${adj.id}` }}
                </span>
              </td>

              <!-- Tanggal -->
              <td class="px-5 py-4">
                <span class="text-sm text-slate-700">
                  {{ formatDate(adj.adjustment_date) }}
                </span>
              </td>

              <!-- Gudang -->
              <td class="px-5 py-4">
                <span class="text-sm font-medium text-slate-700">
                  {{ adj.warehouse?.name || "-" }}
                </span>
              </td>

              <!-- Alasan -->
              <td class="px-5 py-4">
                <p class="max-w-xs truncate text-sm text-slate-700">
                  {{ adj.reason || "-" }}
                </p>

                <p v-if="adj.notes" class="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                  {{ adj.notes }}
                </p>
              </td>

              <!-- Jumlah Item -->
              <td class="px-5 py-4 text-center">
                <span
                  class="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {{ adj.items_count ?? adj.items?.length ?? 0 }} item
                </span>
              </td>

              <!-- Status -->
              <td class="px-5 py-4 text-center">
                <span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
                  :class="getStatusClass(adj.status)">
                  <component :is="getStatusIcon(adj.status)" class="h-3.5 w-3.5" />
                  {{ getStatusLabel(adj.status) }}
                </span>
              </td>

              <!-- Action -->
              <td class="px-5 py-4 text-center">
                <button type="button" @click="openDetail(adj)"
                  class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#14a2d8] transition hover:bg-[#14a2d8]/10">
                  <Eye class="h-4 w-4" />
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- =====================================================
           MOBILE CARDS
      ====================================================== -->
      <div v-if="!loading && filteredAdjustments.length" class="divide-y divide-slate-100 lg:hidden">
        <div v-for="adj in filteredAdjustments" :key="`mobile-${adj.id}`" class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate font-mono text-sm font-bold text-slate-800">
                {{ adj.code || adj.adjustment_number || `ADJ-${adj.id}` }}
              </p>

              <p class="mt-0.5 text-xs text-slate-400">
                {{ formatDate(adj.adjustment_date) }}
              </p>
            </div>

            <span
              class="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold"
              :class="getStatusClass(adj.status)">
              <component :is="getStatusIcon(adj.status)" class="h-3 w-3" />
              {{ getStatusLabel(adj.status) }}
            </span>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-slate-50 p-3">
              <p class="text-[11px] font-medium text-slate-400">Gudang</p>

              <p class="mt-1 truncate text-sm font-medium text-slate-700">
                {{ adj.warehouse?.name || "-" }}
              </p>
            </div>

            <div class="rounded-xl bg-slate-50 p-3">
              <p class="text-[11px] font-medium text-slate-400">Jumlah Item</p>

              <p class="mt-1 text-sm font-semibold text-slate-700">
                {{ adj.items_count ?? adj.items?.length ?? 0 }} item
              </p>
            </div>

            <div class="col-span-2 rounded-xl bg-slate-50 p-3">
              <p class="text-[11px] font-medium text-slate-400">Alasan</p>

              <p class="mt-1 text-sm font-medium text-slate-700">
                {{ adj.reason || "-" }}
              </p>
            </div>
          </div>

          <button type="button" @click="openDetail(adj)"
            class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-[#14a2d8] transition hover:bg-[#14a2d8]/5">
            <Eye class="h-4 w-4" />
            Lihat Detail
          </button>
        </div>
      </div>
    </div>

    <!-- =========================================================
         DETAIL MODAL
    ========================================================== -->
    <Teleport to="body">
      <div v-if="showDetailModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        @click.self="closeDetail">
        <div class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <!-- Modal Header -->
          <div class="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <div class="flex items-center gap-2.5">
                <h2 class="font-mono text-lg font-bold text-slate-800">
                  {{
                    selectedAdjustment?.code ||
                    selectedAdjustment?.adjustment_number ||
                    `ADJ-${selectedAdjustment?.id}`
                  }}
                </h2>

                <span v-if="selectedAdjustment"
                  class="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  :class="getStatusClass(selectedAdjustment.status)">
                  {{ getStatusLabel(selectedAdjustment.status) }}
                </span>
              </div>

              <p class="mt-1 text-xs text-slate-500">
                Detail dokumen penyesuaian stok fisik.
              </p>
            </div>

            <button type="button" @click="closeDetail"
              class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="overflow-y-auto p-5 sm:p-6">
            <!-- Info Grid -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div class="rounded-xl bg-slate-50 p-3.5">
                <p class="text-xs text-slate-400">Tanggal</p>
                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ formatDate(selectedAdjustment?.adjustment_date) }}
                </p>
              </div>

              <div class="rounded-xl bg-slate-50 p-3.5">
                <p class="text-xs text-slate-400">Gudang</p>
                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ selectedAdjustment?.warehouse?.name || "-" }}
                </p>
              </div>

              <div class="rounded-xl bg-slate-50 p-3.5">
                <p class="text-xs text-slate-400">Alasan</p>
                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ selectedAdjustment?.reason || "-" }}
                </p>
              </div>
            </div>

            <div v-if="selectedAdjustment?.notes" class="mt-3 rounded-xl bg-slate-50 p-3.5">
              <p class="text-xs text-slate-400">Catatan</p>
              <p class="mt-1 text-sm text-slate-700">
                {{ selectedAdjustment.notes }}
              </p>
            </div>

            <!-- Items Table -->
            <div class="mt-5">
              <h3 class="mb-2.5 text-sm font-bold text-slate-800">
                Daftar Barang ({{ selectedAdjustment?.items?.length || 0 }})
              </h3>

              <div class="overflow-x-auto rounded-2xl border border-slate-200">
                <table class="min-w-full">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Barang
                      </th>

                      <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                        Stok Sistem
                      </th>

                      <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                        Stok Fisik
                      </th>

                      <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                        Selisih
                      </th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="(item, idx) in selectedAdjustment?.items || []" :key="item.id || idx">
                      <td class="px-4 py-3">
                        <p class="text-sm font-semibold text-slate-800">
                          {{ item.product?.name || item.name || "-" }}
                        </p>

                        <p class="font-mono text-xs text-slate-400">
                          {{ item.product?.code || item.code || "" }}
                        </p>
                      </td>

                      <td class="px-4 py-3 text-right text-sm text-slate-600">
                        {{ Number(item.system_quantity || 0) }}
                        <span class="text-xs text-slate-400">
                          {{ getItemUnit(item) }}
                        </span>
                      </td>

                      <td class="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                        {{ Number(item.physical_quantity || 0) }}
                        <span class="text-xs font-normal text-slate-400">
                          {{ getItemUnit(item) }}
                        </span>
                      </td>

                      <td class="px-4 py-3 text-right text-sm font-bold">
                        <span :class="{
                          'text-emerald-600': getDiff(item) > 0,
                          'text-red-600': getDiff(item) < 0,
                          'text-slate-400': getDiff(item) === 0,
                        }">
                          {{ getDiff(item) > 0 ? "+" : "" }}{{ getDiff(item) }}
                        </span>
                        <span class="ml-1 text-xs font-normal text-slate-400">
                          {{ getItemUnit(item) }}
                        </span>
                      </td>
                    </tr>

                    <tr v-if="!selectedAdjustment?.items?.length">
                      <td colspan="4" class="px-4 py-8 text-center text-sm text-slate-400">
                        Tidak ada detail barang.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
            <!-- Workflow Actions jika masih Draft -->
            <div v-if="selectedAdjustment?.status === 'draft'" class="flex items-center gap-2">
              <button type="button" @click="handleApprove(selectedAdjustment)" :disabled="actionLoading"
                class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                <Check class="h-4 w-4" />
                Setujui & Posting Stok
              </button>

              <button type="button" @click="handleCancel(selectedAdjustment)" :disabled="actionLoading"
                class="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60">
                <Trash2 class="h-4 w-4" />
                Batalkan
              </button>
            </div>
            <div v-else></div>

            <button type="button" @click="closeDetail"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- =========================================================
         CREATE ADJUSTMENT MODAL
    ========================================================== -->
    <StockAdjustmentModal :show="showCreateModal" @close="showCreateModal = false" @saved="handleAdjustmentSaved" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Check,
  Trash2,
} from "lucide-vue-next";

import { erpApi, getApiError } from "@/services/api";
import StockAdjustmentModal from "../../components/erp/stock/StockAdjustmentModal.vue";

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const loading = ref(false);
const actionLoading = ref(false);
const error = ref("");

const adjustments = ref([]);
const warehouses = ref([]);

const showCreateModal = ref(false);
const showDetailModal = ref(false);
const selectedAdjustment = ref(null);

const filters = ref({
  search: "",
  warehouse_id: "",
  status: "",
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status) {
  const labels = {
    draft: "Draft",
    approved: "Disetujui",
    posted: "Disetujui",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  return labels[status] || status || "-";
}

function getStatusClass(status) {
  const classes = {
    draft: "bg-amber-50 text-amber-700 border-amber-100",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    posted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  return classes[status] || "bg-slate-50 text-slate-600 border-slate-100";
}

function getStatusIcon(status) {
  if (status === "cancelled") return XCircle;
  if (status === "draft") return Clock;
  return CheckCircle2;
}

function getDiff(item) {
  if (item.difference_quantity !== undefined && item.difference_quantity !== null) {
    return Number(item.difference_quantity);
  }
  return Number(item.physical_quantity || 0) - Number(item.system_quantity || 0);
}

function getItemUnit(item) {
  return (
    item?.product?.unit?.code ||
    item?.product?.unit?.name ||
    item?.unit?.code ||
    item?.unit?.name ||
    ""
  );
}

/*
|--------------------------------------------------------------------------
| Computed Summary & Filtering
|--------------------------------------------------------------------------
*/

const totalDocuments = computed(() => adjustments.value.length);

const draftDocuments = computed(
  () => adjustments.value.filter((a) => a.status === "draft").length
);

const approvedDocuments = computed(
  () =>
    adjustments.value.filter((a) =>
      ["approved", "posted", "completed"].includes(a.status)
    ).length
);

const cancelledDocuments = computed(
  () => adjustments.value.filter((a) => a.status === "cancelled").length
);

const filteredAdjustments = computed(() => {
  return adjustments.value.filter((adj) => {
    if (filters.value.status && adj.status !== filters.value.status) {
      return false;
    }

    if (
      filters.value.warehouse_id &&
      String(adj.warehouse_id ?? adj.warehouse?.id) !== String(filters.value.warehouse_id)
    ) {
      return false;
    }

    if (filters.value.search) {
      const q = filters.value.search.toLowerCase();
      const code = (adj.code || adj.adjustment_number || "").toLowerCase();
      const reason = (adj.reason || "").toLowerCase();
      const notes = (adj.notes || "").toLowerCase();

      if (!code.includes(q) && !reason.includes(q) && !notes.includes(q)) {
        return false;
      }
    }

    return true;
  });
});

/*
|--------------------------------------------------------------------------
| Load Data
|--------------------------------------------------------------------------
*/

async function loadWarehouses() {
  try {
    const response = await erpApi.master.warehouses.list({});
    const data = response?.data?.data ?? response?.data ?? [];
    warehouses.value = normalizeArray(data);
  } catch (err) {
    console.error("[Warehouses]", err);
  }
}

async function loadAdjustments() {
  loading.value = true;
  error.value = "";

  try {
    const params = {};

    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.warehouse_id) params.warehouse_id = filters.value.warehouse_id;
    if (filters.value.status) params.status = filters.value.status;

    const response = await erpApi.inventory.adjustments.list(params);
    const data = response?.data?.data ?? response?.data ?? [];

    adjustments.value = normalizeArray(data);
  } catch (err) {
    console.error("[Stock Adjustments]", err);
    error.value = getApiError(err, "Gagal mengambil data penyesuaian stok.");
    adjustments.value = [];
  } finally {
    loading.value = false;
  }
}

/*
|--------------------------------------------------------------------------
| Search / Filter
|--------------------------------------------------------------------------
*/

let searchTimer = null;

function handleSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadAdjustments();
  }, 350);
}

function handleFilterChange() {
  loadAdjustments();
}

function resetFilters() {
  filters.value = {
    search: "",
    warehouse_id: "",
    status: "",
  };

  loadAdjustments();
}

/*
|--------------------------------------------------------------------------
| Create Adjustment
|--------------------------------------------------------------------------
*/

function openCreateModal() {
  showCreateModal.value = true;
}

async function handleAdjustmentSaved(payload) {
  if (actionLoading.value) return;

  actionLoading.value = true;
  error.value = "";

  try {
    await erpApi.inventory.adjustments.create(payload);
    showCreateModal.value = false;
    await loadAdjustments();
  } catch (err) {
    console.error("[Create Adjustment]", err);
    error.value = getApiError(err, "Gagal menyimpan penyesuaian stok.");
  } finally {
    actionLoading.value = false;
  }
}

/*
|--------------------------------------------------------------------------
| Detail & Workflow Actions
|--------------------------------------------------------------------------
*/

async function openDetail(adj) {
  try {
    const response = await erpApi.inventory.adjustments.show(adj.id);
    selectedAdjustment.value = response?.data?.data ?? response?.data ?? adj;
    showDetailModal.value = true;
  } catch (err) {
    console.error("[Adjustment Detail]", err);
    selectedAdjustment.value = adj;
    showDetailModal.value = true;
  }
}

function closeDetail() {
  showDetailModal.value = false;
  selectedAdjustment.value = null;
}

async function handleApprove(adj) {
  if (!adj || actionLoading.value) return;

  actionLoading.value = true;
  error.value = "";

  try {
    // Sesuaikan dengan nama method di services/api.js (approve / post / confirm)
    if (erpApi.inventory.adjustments.approve) {
      await erpApi.inventory.adjustments.approve(adj.id);
    } else if (erpApi.inventory.adjustments.post) {
      await erpApi.inventory.adjustments.post(adj.id);
    }

    closeDetail();
    await loadAdjustments();
  } catch (err) {
    console.error("[Approve Adjustment]", err);
    error.value = getApiError(err, "Gagal menyetujui penyesuaian stok.");
  } finally {
    actionLoading.value = false;
  }
}

async function handleCancel(adj) {
  if (!adj || actionLoading.value) return;

  actionLoading.value = true;
  error.value = "";

  try {
    // Sesuaikan dengan nama method di services/api.js (cancel / delete / remove)
    if (erpApi.inventory.adjustments.cancel) {
      await erpApi.inventory.adjustments.cancel(adj.id);
    } else if (erpApi.inventory.adjustments.delete) {
      await erpApi.inventory.adjustments.delete(adj.id);
    }

    closeDetail();
    await loadAdjustments();
  } catch (err) {
    console.error("[Cancel Adjustment]", err);
    error.value = getApiError(err, "Gagal membatalkan penyesuaian stok.");
  } finally {
    actionLoading.value = false;
  }
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadWarehouses();
  loadAdjustments();
});
</script>
