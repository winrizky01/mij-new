<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Riwayat Ganti Plat</h1>
        <p class="mt-1 text-sm text-gray-500">
          Riwayat perubahan nomor polisi armada.
        </p>
      </div>

      <button @click="openForm"
        class="rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900">
        + Ganti Plat
      </button>
    </div>

    <!-- SUMMARY -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="card in summary" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-5">
        <p class="text-sm text-gray-500">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-bold text-gray-800">
          {{ card.value }}
        </p>
      </div>
    </div>

    <!-- TABLE -->
    <div class="rounded-2xl border border-gray-100 bg-white p-5">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row">
        <input v-model="search" placeholder="Cari nomor polisi atau kendaraan..."
          class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500" />

        <select v-model="filterReason" class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm">
          <option value="">Semua alasan</option>
          <option value="Perpanjangan">Perpanjangan</option>
          <option value="Perubahan nomor">Perubahan nomor</option>
          <option value="Penggantian plat rusak">Penggantian plat rusak</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">Kendaraan</th>
              <th class="p-3">Plat Lama</th>
              <th class="p-3">Plat Baru</th>
              <th class="p-3">Tanggal</th>
              <th class="p-3">Alasan</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="5" class="p-8 text-center text-gray-400">
                Memuat riwayat pergantian plat...
              </td>
            </tr>

            <tr v-else-if="!filteredItems.length">
              <td colspan="5" class="p-8 text-center text-gray-400">
                Tidak ada data ditemukan.
              </td>
            </tr>

            <tr v-for="item in filteredItems" :key="item.id">
              <td class="p-3 font-medium text-gray-800">
                {{ item.vehicle }}
              </td>

              <td class="p-3 text-gray-500">
                {{ item.oldPlate }}
              </td>

              <td class="p-3 font-semibold text-gray-800">
                {{ item.newPlate }}
              </td>

              <td class="p-3">
                {{ formatDate(item.date) }}
              </td>

              <td class="p-3">
                {{ item.reason }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- FORM MODAL -->
    <div v-if="showForm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      @click.self="closeForm">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 class="text-lg font-bold text-gray-800">
          Perubahan Nomor Polisi
        </h2>

        <p class="mt-1 text-sm text-gray-500">
          Perubahan ini akan memperbarui plat aktif kendaraan dan mencatat
          riwayatnya.
        </p>

        <form @submit.prevent="save" class="mt-5 space-y-4">
          <!-- TRUCK -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Kendaraan
            </label>

            <select v-model="form.truckId" required :disabled="loadingTrucks || saving" @change="syncOldPlate"
              class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50">
              <option value="">Pilih Kendaraan</option>

              <option v-for="truck in trucks" :key="truck.id" :value="truck.id">
                {{ truck.code || 'Truck' }} -
                {{ truck.plate_number || 'Tanpa Plat' }}
                {{ truck.brand ? `(${truck.brand})` : '' }}
              </option>
            </select>

            <p v-if="loadingTrucks" class="mt-1 text-xs text-gray-400">
              Memuat daftar kendaraan...
            </p>

            <p v-else-if="!trucks.length" class="mt-1 text-xs text-red-500">
              Tidak ada kendaraan tersedia.
            </p>
          </div>

          <!-- OLD PLATE -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Plat Lama
            </label>

            <input v-model="form.oldPlate" readonly
              class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm"
              placeholder="Plat aktif kendaraan" />
          </div>

          <!-- NEW PLATE -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Plat Baru
            </label>

            <input v-model.trim="form.newPlate" required :disabled="saving"
              class="w-full rounded-xl border border-gray-200 p-3 text-sm uppercase" placeholder="N 5678 CD" />
          </div>

          <!-- DATE -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Tanggal Perubahan
            </label>

            <input v-model="form.date" type="date" required :disabled="saving"
              class="w-full rounded-xl border border-gray-200 p-3 text-sm" />
          </div>

          <!-- REASON -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Alasan
            </label>

            <select v-model="form.reason" :disabled="saving"
              class="w-full rounded-xl border border-gray-200 p-3 text-sm">
              <option value="Perpanjangan">Perpanjangan</option>
              <option value="Perubahan nomor">Perubahan nomor</option>
              <option value="Perubahan sifat">Perubahan sifat</option>
              <option value="Penggantian plat rusak">Penggantian plat rusak</option>
            </select>
          </div>

          <!-- NOTES -->
          <div>
            <label class="mb-1 block text-sm font-medium">
              Catatan
            </label>

            <textarea v-model="form.notes" rows="3" :disabled="saving"
              class="w-full rounded-xl border border-gray-200 p-3 text-sm" placeholder="Catatan tambahan (opsional)" />
          </div>

          <!-- ACTION -->
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="closeForm" :disabled="saving" class="rounded-xl border px-4 py-2 text-sm">
              Batal
            </button>

            <button type="submit" :disabled="saving || !trucks.length"
              class="rounded-xl bg-[#003366] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'

import api, { getApiError } from '../../services/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()

// STATE
const loading = ref(false)
const loadingTrucks = ref(false)
const saving = ref(false)

const items = ref([])
const trucks = ref([])

const search = ref('')
const filterReason = ref('')
const showForm = ref(false)

// FORM
const defaultForm = () => ({
  truckId: '',
  oldPlate: '',
  newPlate: '',
  date: new Date().toLocaleDateString('en-CA'),
  reason: 'Perpanjangan',
  notes: '',
})

const form = reactive(defaultForm())

// FILTER DATA
const filteredItems = computed(() => {
  const keyword = search.value.toLowerCase().trim()

  return items.value.filter(item => {
    const searchable = [
      item.vehicle,
      item.oldPlate,
      item.newPlate,
    ].join(' ').toLowerCase()

    return searchable.includes(keyword) &&
      (!filterReason.value || item.reason === filterReason.value)
  })
})

// SUMMARY
const summary = computed(() => {
  const currentMonth = new Date().toLocaleDateString('en-CA').slice(0, 7)

  return [
    {
      label: 'Total Riwayat',
      value: items.value.length,
    },
    {
      label: 'Perubahan Bulan Ini',
      value: items.value.filter(
        item => item.date?.slice(0, 7) === currentMonth
      ).length,
    },
    {
      label: 'Total Armada',
      value: new Set(items.value.map(item => item.truckId)).size,
    },
  ]
})

// FORMAT DATE
function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

// NORMALIZE RESPONSE
function extractRows(response) {
  const data = response?.data

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.data?.data)) return data.data.data

  return []
}

// LOAD TRUCKS
async function loadTrucks() {
  loadingTrucks.value = true

  try {
    const response = await api.get('/erp/trucks', {
      params: {
        per_page: 1000,
      },
    })

    trucks.value = extractRows(response)

  } catch (error) {
    console.error('Gagal mengambil daftar kendaraan:', error)

    toast.error(
      getApiError(error).message || 'Gagal memuat daftar kendaraan.'
    )
  } finally {
    loadingTrucks.value = false
  }
}

// LOAD HISTORIES
async function loadPlateHistories() {
  loading.value = true

  try {
    const response = await api.get('/erp/trucks/plate-histories')

    items.value = extractRows(response).map(item => ({
      id: item.id,
      truckId: item.truck_id,

      vehicle: [
        item.truck?.code,
        item.truck?.brand,
        item.truck?.model,
      ].filter(Boolean).join(' - ') || item.truck?.plate_number || '-',

      oldPlate: item.old_plate_number || '-',
      newPlate: item.new_plate_number || '-',
      date: item.changed_at,
      reason: item.reason || '-',
      notes: item.notes || '',
    }))

  } catch (error) {
    console.error('Gagal mengambil riwayat pergantian plat:', error)

    toast.error(
      getApiError(error).message || 'Gagal mengambil riwayat pergantian plat.'
    )
  } finally {
    loading.value = false
  }
}

// SYNC OLD PLATE
function syncOldPlate() {
  const truck = trucks.value.find(
    item => String(item.id) === String(form.truckId)
  )

  form.oldPlate = truck?.plate_number || ''
}

// OPEN FORM
async function openForm() {
  Object.assign(form, defaultForm())

  showForm.value = true

  if (!trucks.value.length) {
    await loadTrucks()
  }
}

// CLOSE FORM
function closeForm() {
  if (saving.value) return

  showForm.value = false
}

// SAVE CHANGE PLATE
async function save() {
  if (!form.truckId) {
    toast.error('Silakan pilih kendaraan.')
    return
  }

  if (!form.newPlate.trim()) {
    toast.error('Nomor plat baru wajib diisi.')
    return
  }

  if (
    form.oldPlate.trim().toUpperCase() ===
    form.newPlate.trim().toUpperCase()
  ) {
    toast.error('Plat baru tidak boleh sama dengan plat lama.')
    return
  }

  saving.value = true

  try {
    await api.post(
      `/erp/trucks/${form.truckId}/change-plate`,
      {
        new_plate_number: form.newPlate.trim().toUpperCase(),
        changed_at: form.date,
        reason: form.reason,
        notes: form.notes,
      }
    )

    toast.success('Pergantian plat berhasil disimpan.')

    showForm.value = false

    await Promise.all([
      loadPlateHistories(),
      loadTrucks(),
    ])

  } catch (error) {
    console.error('Gagal mengubah plat kendaraan:', error)

    toast.error(
      getApiError(error).message || 'Gagal menyimpan perubahan plat.'
    )
  } finally {
    saving.value = false
  }
}

// INITIALIZATION
onMounted(() => {
  loadPlateHistories()
})
</script>
