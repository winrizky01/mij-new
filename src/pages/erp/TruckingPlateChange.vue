<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Riwayat Ganti Plat</h1>
        <p class="mt-1 text-sm text-gray-500">Kelola riwayat perubahan nomor polisi armada.</p>
      </div>
      <button @click="openForm()"
        class="rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900">
        + Tambah Riwayat
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="card in summary" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-5">
        <p class="text-sm text-gray-500">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-bold text-gray-800">{{ card.value }}</p>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-100 bg-white p-5">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row">
        <input v-model="search" placeholder="Cari nomor polisi atau kendaraan..."
          class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500" />
        <select v-model="filterReason" class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm">
          <option value="">Semua alasan</option>
          <option>Perpanjangan</option>
          <option>Perubahan nomor</option>
          <option>Penggantian plat rusak</option>
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
              <th class="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="p-3 font-medium text-gray-800">{{ item.vehicle }}</td>
              <td class="p-3 text-gray-500">{{ item.oldPlate }}</td>
              <td class="p-3 font-semibold text-gray-800">{{ item.newPlate }}</td>
              <td class="p-3">{{ item.date }}</td>
              <td class="p-3">{{ item.reason }}</td>
              <td class="p-3 text-right">
                <button @click="openForm(item)" class="font-medium text-sky-700 hover:underline">Edit</button>
                <button @click="remove(item.id)" class="ml-3 font-medium text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="6" class="p-8 text-center text-gray-400">Tidak ada data ditemukan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 class="text-lg font-bold text-gray-800">{{ form.id ? 'Edit Riwayat Plat' : 'Tambah Riwayat Plat' }}</h2>
        <form @submit.prevent="save" class="mt-5 space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium">Kendaraan</label>
            <input v-model="form.vehicle" required class="w-full rounded-xl border p-3 text-sm"
              placeholder="Contoh: Truk Hino 500" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-1 block text-sm font-medium">Plat Lama</label>
              <input v-model="form.oldPlate" required class="w-full rounded-xl border p-3 text-sm"
                placeholder="N 1234 AB" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium">Plat Baru</label>
              <input v-model="form.newPlate" required class="w-full rounded-xl border p-3 text-sm"
                placeholder="N 5678 CD" />
            </div>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">Tanggal Perubahan</label>
            <input v-model="form.date" type="date" required class="w-full rounded-xl border p-3 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">Alasan</label>
            <select v-model="form.reason" class="w-full rounded-xl border p-3 text-sm">
              <option>Perpanjangan</option>
              <option>Perubahan nomor</option>
              <option>Penggantian plat rusak</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showForm = false" class="rounded-xl border px-4 py-2 text-sm">Batal</button>
            <button class="rounded-xl bg-[#003366] px-4 py-2 text-sm font-semibold text-white">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- DEVELOPMENT -->
    <ErpDevelopmentModal v-model="showDevelopmentModal" title="Ganti plat masih dalam pengembangan"
      description="Data halaman ini masih berupa data dummy. Belum ada koneksi ke backend." />

  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ErpDevelopmentModal from '../../components/erp/finance/ErpDevelopmentModal.vue'

const items = ref([
  { id: 1, vehicle: 'Hino 500 - Armada 01', oldPlate: 'N 1234 AB', newPlate: 'N 5678 CD', date: '2026-10-12', reason: 'Perpanjangan' },
  { id: 2, vehicle: 'Mitsubishi Fuso - Armada 02', oldPlate: 'N 2345 BC', newPlate: 'N 3456 DE', date: '2026-09-20', reason: 'Penggantian plat rusak' },
  { id: 3, vehicle: 'Hino Dutro - Armada 03', oldPlate: 'N 9876 EF', newPlate: 'N 8765 FG', date: '2026-08-05', reason: 'Perubahan nomor' },
])

const search = ref('')
const filterReason = ref('')
const showForm = ref(false)
const form = reactive({ id: null, vehicle: '', oldPlate: '', newPlate: '', date: '', reason: 'Perpanjangan' })
const showDevelopmentModal = ref(true)

const filteredItems = computed(() => items.value.filter(item => {
  const keyword = search.value.toLowerCase()
  return `${item.vehicle} ${item.oldPlate} ${item.newPlate}`.toLowerCase().includes(keyword)
    && (!filterReason.value || item.reason === filterReason.value)
}))

const summary = computed(() => [
  { label: 'Total Riwayat', value: items.value.length },
  { label: 'Perubahan Bulan Ini', value: items.value.filter(i => i.date.startsWith('2026-11')).length },
  { label: 'Jenis Kendaraan', value: new Set(items.value.map(i => i.vehicle)).size },
])

function openForm(item = null) {
  Object.assign(form, item ? { ...item } : {
    id: null, vehicle: '', oldPlate: '', newPlate: '',
    date: new Date().toISOString().slice(0, 10), reason: 'Perpanjangan'
  })
  showForm.value = true
}

function save() {
  if (form.id) {
    const index = items.value.findIndex(i => i.id === form.id)
    if (index !== -1) items.value[index] = { ...form }
  } else {
    items.value.unshift({ ...form, id: Date.now() })
  }
  showForm.value = false
}

function remove(id) {
  if (confirm('Hapus riwayat perubahan plat ini?')) {
    items.value = items.value.filter(i => i.id !== id)
  }
}
</script>
