<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Service & Perawatan</h1>
        <p class="mt-1 text-sm text-gray-500">
          Catat jadwal service, perbaikan, dan riwayat perawatan armada.
        </p>
      </div>

      <button @click="openForm()"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00264d]">
        <Plus :size="17" />
        Catat Service
      </button>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="card in summary" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-5">
        <p class="text-sm text-gray-500">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-bold text-gray-800">
          {{ card.value }}
        </p>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-gray-100 bg-white p-5">
      <!-- Search & Filter -->
      <div class="mb-5 flex flex-col gap-3 sm:flex-row">
        <div class="relative flex-1">
          <Search :size="17" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="search" placeholder="Cari kendaraan, plat nomor, pekerjaan..."
            class="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-500" />
        </div>

        <select v-model="filterStatus"
          class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500">
          <option value="">Semua Status</option>
          <option value="scheduled">Terjadwal</option>
          <option value="in_progress">Dalam Pengerjaan</option>
          <option value="completed">Selesai</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
        <Loader2 :size="20" class="animate-spin" />
        Memuat data service...
      </div>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th class="whitespace-nowrap p-3">Tanggal</th>
                <th class="whitespace-nowrap p-3">Kendaraan</th>
                <th class="p-3">Pekerjaan</th>
                <th class="p-3">Bengkel</th>
                <th class="whitespace-nowrap p-3">Biaya</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in items" :key="item.id">
                <td class="whitespace-nowrap p-3">
                  {{ formatDate(item.service_date) }}
                </td>

                <td class="whitespace-nowrap p-3">
                  <div class="font-semibold text-gray-800">
                    {{ item.truck?.code || '-' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ item.truck?.plate_number || '-' }}
                  </div>
                </td>

                <td class="min-w-[180px] p-3">
                  {{ item.work_description }}
                </td>

                <td class="p-3">
                  {{ item.workshop || '-' }}
                </td>

                <td class="whitespace-nowrap p-3 font-medium">
                  Rp {{ formatNumber(item.cost) }}
                </td>

                <td class="p-3">
                  <span class="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="statusClass(item.status)">
                    {{ statusLabel(item.status) }}
                  </span>
                </td>

                <td class="whitespace-nowrap p-3 text-right">
                  <div class="flex justify-end gap-1">
                    <button @click="openForm(item)" title="Edit"
                      class="rounded-lg p-2 text-sky-700 transition hover:bg-sky-50">
                      <Pencil :size="17" />
                    </button>

                    <button @click="remove(item)" title="Hapus"
                      class="rounded-lg p-2 text-red-600 transition hover:bg-red-50">
                      <Trash2 :size="17" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!items.length">
                <td colspan="7" class="p-10 text-center text-gray-400">
                  Tidak ada data service.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="mt-5 flex flex-col justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
          <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>
              Menampilkan
              <strong class="text-gray-700">{{ pagination.from || 0 }}</strong>
              -
              <strong class="text-gray-700">{{ pagination.to || 0 }}</strong>
              dari
              <strong class="text-gray-700">{{ pagination.total }}</strong>
              data
            </span>

            <select v-model.number="perPage" class="rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none">
              <option :value="10">10 / halaman</option>
              <option :value="25">25 / halaman</option>
              <option :value="50">50 / halaman</option>
              <option :value="100">100 / halaman</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1"
              class="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft :size="17" />
            </button>

            <span class="px-2 text-sm text-gray-600">
              Halaman
              <strong class="text-gray-800">
                {{ pagination.current_page }}
              </strong>
              /
              {{ pagination.last_page }}
            </span>

            <button @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page >= pagination.last_page"
              class="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronRight :size="17" />
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      @click.self="closeForm">
      <div class="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-800">
            {{ form.id ? 'Edit Service' : 'Catat Service' }}
          </h2>

          <button type="button" @click="closeForm" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X :size="20" />
          </button>
        </div>

        <form @submit.prevent="save" class="mt-5 space-y-4">
          <!-- Truck -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Kendaraan <span class="text-red-500">*</span>
            </label>

            <select v-model="form.truck_id" required
              class="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-500">
              <option value="">Pilih kendaraan</option>
              <option v-for="truck in trucks" :key="truck.id" :value="truck.id">
                {{ truck.code }} - {{ truck.plate_number }}
                ({{ truck.brand }} {{ truck.model }})
              </option>
            </select>
          </div>

          <!-- Date -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Tanggal Service <span class="text-red-500">*</span>
            </label>
            <input v-model="form.service_date" type="date" required
              class="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-500" />
          </div>

          <!-- Work -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Jenis Pekerjaan <span class="text-red-500">*</span>
            </label>
            <input v-model="form.work_description" required maxlength="5000"
              class="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-500"
              placeholder="Contoh: Ganti oli mesin" />
          </div>

          <!-- Workshop -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Bengkel
            </label>
            <input v-model="form.workshop" maxlength="255"
              class="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-500"
              placeholder="Nama bengkel" />
          </div>

          <!-- Cost & Odometer -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">
                Biaya (Rp)
              </label>
              <input v-model.number="form.cost" type="number" min="0" step="0.01"
                class="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-500"
                placeholder="0" />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">
                Kilometer (KM)
              </label>
              <input v-model.number="form.odometer_km" type="number" min="0" step="0.01"
                class="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-500"
                placeholder="Odometer" />
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Status <span class="text-red-500">*</span>
            </label>
            <select v-model="form.status" required
              class="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-500">
              <option value="scheduled">Terjadwal</option>
              <option value="in_progress">Dalam Pengerjaan</option>
              <option value="completed">Selesai</option>
            </select>
          </div>

          <!-- Notes -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Catatan
            </label>
            <textarea v-model="form.notes" rows="3" maxlength="5000"
              class="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-sky-500"
              placeholder="Catatan tambahan..."></textarea>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button type="button" @click="closeForm" :disabled="saving"
              class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Batal
            </button>

            <button type="submit" :disabled="saving"
              class="inline-flex items-center gap-2 rounded-xl bg-[#003366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00264d] disabled:opacity-50">
              <Loader2 v-if="saving" :size="16" class="animate-spin" />
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-vue-next'

import api from '../../services/api'

// =====================================================
// STATE
// =====================================================

const items = ref([])
const trucks = ref([])

const loading = ref(false)
const saving = ref(false)
const showForm = ref(false)

const search = ref('')
const filterStatus = ref('')
const perPage = ref(25)

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 25,
  total: 0,
  from: 0,
  to: 0,
})

const summaryData = ref({
  total: 0,
  scheduled: 0,
  in_progress: 0,
  completed: 0,
  total_cost: 0,
})

const form = reactive({
  id: null,
  truck_id: '',
  service_date: '',
  work_description: '',
  workshop: '',
  cost: 0,
  odometer_km: null,
  status: 'scheduled',
  notes: '',
})

// =====================================================
// SUMMARY
// =====================================================

const summary = computed(() => [
  {
    label: 'Total Pekerjaan',
    value: summaryData.value.total,
  },
  {
    label: 'Terjadwal / Berjalan',
    value:
      summaryData.value.scheduled +
      summaryData.value.in_progress,
  },
  {
    label: 'Total Biaya',
    value:
      'Rp ' +
      formatNumber(summaryData.value.total_cost),
  },
])

// =====================================================
// HELPERS
// =====================================================

function formatNumber(value) {
  return Number(value || 0).toLocaleString('id-ID')
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(`${value}T00:00:00`)

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function statusLabel(status) {
  const labels = {
    scheduled: 'Terjadwal',
    in_progress: 'Dalam Pengerjaan',
    completed: 'Selesai',
  }

  return labels[status] || status
}

function statusClass(status) {
  return {
    scheduled: 'bg-amber-100 text-amber-700',
    in_progress: 'bg-sky-100 text-sky-700',
    completed: 'bg-emerald-100 text-emerald-700',
  }[status] || 'bg-gray-100 text-gray-600'
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.meta?.message ||
      error?.response?.data?.message ||
      error?.response?.data?.errors
      ? fallback
      : fallback
  )
}

// =====================================================
// LOAD TRUCKS
// =====================================================

async function fetchTrucks() {
  try {
    const response = await api.get('/erp/trucks')

    const result = response.data?.data

    trucks.value = Array.isArray(result)
      ? result
      : result?.data || []
  } catch (error) {
    console.error('Gagal memuat kendaraan:', error)
    alert(
      error?.response?.data?.message ||
      'Gagal memuat master kendaraan.'
    )
  }
}

// =====================================================
// LOAD SUMMARY
// =====================================================

async function fetchSummary() {
  try {
    const response = await api.get(
      '/erp/truck-maintenances/summary'
    )

    summaryData.value = {
      ...summaryData.value,
      ...response.data,
    }
  } catch (error) {
    console.error('Gagal memuat summary:', error)
  }
}

// =====================================================
// LOAD DATA
// =====================================================

async function fetchItems() {
  loading.value = true

  try {
    const response = await api.get(
      '/erp/truck-maintenances',
      {
        params: {
          page: pagination.current_page,
          per_page: perPage.value,
          search: search.value || undefined,
          status: filterStatus.value || undefined,
        },
      }
    )

    const result = response.data

    items.value = result.data || []

    pagination.current_page = result.current_page || 1
    pagination.last_page = result.last_page || 1
    pagination.per_page = result.per_page || perPage.value
    pagination.total = result.total || 0
    pagination.from = result.from || 0
    pagination.to = result.to || 0
  } catch (error) {
    console.error('Gagal memuat service:', error)

    alert(
      error?.response?.data?.message ||
      'Gagal memuat data service.'
    )
  } finally {
    loading.value = false
  }
}

// =====================================================
// SEARCH & FILTER
// =====================================================

let searchTimeout = null

watch([search, filterStatus], () => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    pagination.current_page = 1
    fetchItems()
  }, 400)
})

watch(perPage, () => {
  pagination.current_page = 1
  fetchItems()
})

// =====================================================
// PAGINATION
// =====================================================

function changePage(page) {
  if (
    page < 1 ||
    page > pagination.last_page ||
    loading.value
  ) {
    return
  }

  pagination.current_page = page
  fetchItems()
}

// =====================================================
// FORM
// =====================================================

function resetForm() {
  Object.assign(form, {
    id: null,
    truck_id: '',
    service_date: new Date().toLocaleDateString('en-CA'),
    work_description: '',
    workshop: '',
    cost: 0,
    odometer_km: null,
    status: 'scheduled',
    notes: '',
  })
}

function openForm(item = null) {
  if (item) {
    Object.assign(form, {
      id: item.id,
      truck_id: item.truck_id,
      service_date: item.service_date?.slice(0, 10),
      work_description: item.work_description,
      workshop: item.workshop || '',
      cost: Number(item.cost || 0),
      odometer_km: item.odometer_km
        ? Number(item.odometer_km)
        : null,
      status: item.status,
      notes: item.notes || '',
    })
  } else {
    resetForm()
  }

  showForm.value = true
}

function closeForm() {
  if (saving.value) return

  showForm.value = false
}

// =====================================================
// SAVE
// =====================================================

async function save() {
  if (saving.value) return

  saving.value = true

  const payload = {
    truck_id: form.truck_id,
    service_date: form.service_date,
    work_description: form.work_description,
    workshop: form.workshop || null,
    cost: form.cost || 0,
    odometer_km: form.odometer_km || null,
    status: form.status,
    notes: form.notes || null,
  }

  try {
    if (form.id) {
      await api.put(
        `/erp/truck-maintenances/${form.id}`,
        payload
      )
    } else {
      await api.post(
        '/erp/truck-maintenances',
        payload
      )
    }

    showForm.value = false

    await Promise.all([
      fetchItems(),
      fetchSummary(),
    ])

    alert(
      form.id
        ? 'Catatan service berhasil diperbarui.'
        : 'Catatan service berhasil dibuat.'
    )
  } catch (error) {
    console.error('Gagal menyimpan service:', error)

    const errors = error?.response?.data?.errors

    alert(
      error?.response?.data?.message ||
      (errors
        ? Object.values(errors).flat().join('\n')
        : 'Gagal menyimpan catatan service.')
    )
  } finally {
    saving.value = false
  }
}

// =====================================================
// DELETE
// =====================================================

async function remove(item) {
  const confirmed = confirm(
    `Hapus catatan service "${item.work_description}"?`
  )

  if (!confirmed) return

  try {
    await api.delete(
      `/erp/truck-maintenances/${item.id}`
    )

    // Jika halaman terakhir kosong setelah delete,
    // kembali ke halaman sebelumnya.
    if (items.value.length === 1 && pagination.current_page > 1) {
      pagination.current_page--
    }

    await Promise.all([
      fetchItems(),
      fetchSummary(),
    ])

    alert('Catatan service berhasil dihapus.')
  } catch (error) {
    console.error('Gagal menghapus service:', error)

    alert(
      error?.response?.data?.message ||
      'Gagal menghapus catatan service.'
    )
  }
}

// =====================================================
// INITIALIZATION
// =====================================================

onMounted(async () => {
  await Promise.all([
    fetchTrucks(),
    fetchItems(),
    fetchSummary(),
  ])
})
</script>
