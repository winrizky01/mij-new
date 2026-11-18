<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Pajak & KIR</h1>
        <p class="mt-1 text-sm text-gray-500">Monitoring dokumen dan masa berlaku legalitas armada.</p>
      </div>
      <button @click="openForm()" class="rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white">+ Tambah
        Dokumen</button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="card in summary" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-5">
        <p class="text-sm text-gray-500">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-bold text-gray-800">{{ card.value }}</p>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-100 bg-white p-5">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row">
        <input v-model="search" placeholder="Cari kendaraan atau nomor plat..."
          class="w-full rounded-xl border px-4 py-2.5 text-sm" />
        <select v-model="filterType" class="rounded-xl border px-4 py-2.5 text-sm">
          <option value="">Semua dokumen</option>
          <option value="Pajak">Pajak / STNK</option>
          <option value="KIR">KIR</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">Kendaraan</th>
              <th class="p-3">Nomor Plat</th>
              <th class="p-3">Jenis Dokumen</th>
              <th class="p-3">Tanggal Dokumen</th>
              <th class="p-3">Berlaku Sampai</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="p-3 font-medium">{{ item.vehicle }}</td>
              <td class="p-3">{{ item.plate }}</td>
              <td class="p-3">{{ item.type }}</td>
              <td class="p-3">{{ item.expiry }}</td>
              <td class="p-3">
                <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass(item.expiry)">
                  {{ statusLabel(item.expiry) }}
                </span>
              </td>
              <td class="p-3 text-right">
                <button @click="openForm(item)" class="text-sky-700 hover:underline">Edit</button>
                <button @click="remove(item.id)" class="ml-3 text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="6" class="p-8 text-center text-gray-400">Tidak ada data.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6">
        <h2 class="text-lg font-bold">{{ form.id ? 'Edit Dokumen' : 'Tambah Dokumen' }}</h2>
        <form @submit.prevent="save" class="mt-5 space-y-4">
          <div><label class="mb-1 block text-sm font-medium">Kendaraan</label><input v-model="form.vehicle" required
              class="w-full rounded-xl border p-3 text-sm" placeholder="Nama kendaraan" /></div>
          <div><label class="mb-1 block text-sm font-medium">Nomor Plat</label><input v-model="form.plate" required
              class="w-full rounded-xl border p-3 text-sm" placeholder="N 1234 AB" /></div>
          <div><label class="mb-1 block text-sm font-medium">Jenis Dokumen</label><select v-model="form.type"
              class="w-full rounded-xl border p-3 text-sm">
              <option>Pajak</option>
              <option>KIR</option>
            </select></div>
          <div><label class="mb-1 block text-sm font-medium">Berlaku Sampai</label><input v-model="form.expiry"
              type="date" required class="w-full rounded-xl border p-3 text-sm" /></div>
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
const showDevelopmentModal = ref(true)

const items = ref([
  { id: 1, vehicle: 'Hino 500 - Armada 01', plate: 'N 5678 CD', type: 'Pajak', expiry: '2026-12-20' },
  { id: 2, vehicle: 'Mitsubishi Fuso - Armada 02', plate: 'N 3456 DE', type: 'KIR', expiry: '2026-11-25' },
  { id: 3, vehicle: 'Hino Dutro - Armada 03', plate: 'N 8765 FG', type: 'Pajak', expiry: '2026-10-10' },
  { id: 4, vehicle: 'Hino 500 - Armada 01', plate: 'N 5678 CD', type: 'KIR', expiry: '2027-01-15' },
])
const search = ref('')
const filterType = ref('')
const showForm = ref(false)
const form = reactive({ id: null, vehicle: '', plate: '', type: 'Pajak', expiry: '' })

function daysLeft(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(`${date}T00:00:00`) - today) / 86400000)
}
function statusLabel(date) {
  const days = daysLeft(date)
  if (days < 0) return 'Kedaluwarsa'
  if (days <= 30) return 'Segera Habis'
  return 'Aktif'
}
function statusClass(date) {
  const days = daysLeft(date)
  if (days < 0) return 'bg-red-100 text-red-700'
  if (days <= 30) return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}
const filteredItems = computed(() => items.value.filter(i =>
  `${i.vehicle} ${i.plate}`.toLowerCase().includes(search.value.toLowerCase())
  && (!filterType.value || i.type === filterType.value)
))
const summary = computed(() => [
  { label: 'Total Dokumen', value: items.value.length },
  { label: 'Segera Habis', value: items.value.filter(i => daysLeft(i.expiry) >= 0 && daysLeft(i.expiry) <= 30).length },
  { label: 'Kedaluwarsa', value: items.value.filter(i => daysLeft(i.expiry) < 0).length },
])
function openForm(item = null) {
  Object.assign(form, item ? { ...item } : { id: null, vehicle: '', plate: '', type: 'Pajak', expiry: '' })
  showForm.value = true
}
function save() {
  if (form.id) {
    const index = items.value.findIndex(i => i.id === form.id)
    if (index !== -1) items.value[index] = { ...form }
  } else items.value.unshift({ ...form, id: Date.now() })
  showForm.value = false
}
function remove(id) {
  if (confirm('Hapus dokumen ini?')) items.value = items.value.filter(i => i.id !== id)
}
</script>
