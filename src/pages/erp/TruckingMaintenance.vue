<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Service & Perawatan</h1>
        <p class="mt-1 text-sm text-gray-500">Catat jadwal service, perbaikan, dan riwayat perawatan armada.</p>
      </div>
      <button @click="openForm()" class="rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white">+ Catat
        Service</button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="card in summary" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-5">
        <p class="text-sm text-gray-500">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-bold text-gray-800">{{ card.value }}</p>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-100 bg-white p-5">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row">
        <input v-model="search" placeholder="Cari kendaraan atau jenis pekerjaan..."
          class="w-full rounded-xl border px-4 py-2.5 text-sm" />
        <select v-model="filterStatus" class="rounded-xl border px-4 py-2.5 text-sm">
          <option value="">Semua status</option>
          <option>Terjadwal</option>
          <option>Dalam Pengerjaan</option>
          <option>Selesai</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">Tanggal</th>
              <th class="p-3">Kendaraan</th>
              <th class="p-3">Pekerjaan</th>
              <th class="p-3">Bengkel</th>
              <th class="p-3">Biaya</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="p-3">{{ item.date }}</td>
              <td class="p-3 font-medium">{{ item.vehicle }}</td>
              <td class="p-3">{{ item.work }}</td>
              <td class="p-3">{{ item.workshop || '-' }}</td>
              <td class="p-3">Rp {{ Number(item.cost).toLocaleString('id-ID') }}</td>
              <td class="p-3">
                <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusClass(item.status)">{{
                  item.status }}</span>
              </td>
              <td class="p-3 text-right whitespace-nowrap">
                <button @click="openForm(item)" class="text-sky-700 hover:underline">Edit</button>
                <button @click="remove(item.id)" class="ml-3 text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
            <tr v-if="!filteredItems.length">
              <td colspan="7" class="p-8 text-center text-gray-400">Tidak ada data.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6">
        <h2 class="text-lg font-bold">{{ form.id ? 'Edit Service' : 'Catat Service' }}</h2>
        <form @submit.prevent="save" class="mt-5 space-y-4">
          <div><label class="mb-1 block text-sm font-medium">Kendaraan</label><input v-model="form.vehicle" required
              class="w-full rounded-xl border p-3 text-sm" placeholder="Nama kendaraan" /></div>
          <div><label class="mb-1 block text-sm font-medium">Tanggal</label><input v-model="form.date" type="date"
              required class="w-full rounded-xl border p-3 text-sm" /></div>
          <div><label class="mb-1 block text-sm font-medium">Jenis Pekerjaan</label><input v-model="form.work" required
              class="w-full rounded-xl border p-3 text-sm" placeholder="Contoh: Ganti oli mesin" /></div>
          <div><label class="mb-1 block text-sm font-medium">Bengkel</label><input v-model="form.workshop"
              class="w-full rounded-xl border p-3 text-sm" placeholder="Nama bengkel" /></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="mb-1 block text-sm font-medium">Biaya (Rp)</label><input v-model.number="form.cost"
                type="number" min="0" class="w-full rounded-xl border p-3 text-sm" /></div>
            <div><label class="mb-1 block text-sm font-medium">Status</label><select v-model="form.status"
                class="w-full rounded-xl border p-3 text-sm">
                <option>Terjadwal</option>
                <option>Dalam Pengerjaan</option>
                <option>Selesai</option>
              </select></div>
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showForm = false" class="rounded-xl border px-4 py-2 text-sm">Batal</button>
            <button class="rounded-xl bg-[#003366] px-4 py-2 text-sm font-semibold text-white">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- DEVELOPMENT -->
  <ErpDevelopmentModal v-model="showDevelopmentModal" title="Ganti plat masih dalam pengembangan"
    description="Data halaman ini masih berupa data dummy. Belum ada koneksi ke backend." />

</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ErpDevelopmentModal from '../../components/erp/finance/ErpDevelopmentModal.vue'
const showDevelopmentModal = ref(true)

const items = ref([
  { id: 1, date: '2026-11-10', vehicle: 'Hino 500 - Armada 01', work: 'Ganti oli mesin', workshop: 'Bengkel Jaya Motor', cost: 1250000, status: 'Selesai' },
  { id: 2, date: '2026-11-20', vehicle: 'Mitsubishi Fuso - Armada 02', work: 'Service rem', workshop: 'Bengkel Sentosa', cost: 2500000, status: 'Terjadwal' },
  { id: 3, date: '2026-11-15', vehicle: 'Hino Dutro - Armada 03', work: 'Ganti ban depan', workshop: 'Bengkel Jaya Motor', cost: 3200000, status: 'Dalam Pengerjaan' },
])
const search = ref('')
const filterStatus = ref('')
const showForm = ref(false)
const form = reactive({ id: null, date: '', vehicle: '', work: '', workshop: '', cost: 0, status: 'Terjadwal' })
const filteredItems = computed(() => items.value.filter(i =>
  `${i.vehicle} ${i.work} ${i.workshop}`.toLowerCase().includes(search.value.toLowerCase())
  && (!filterStatus.value || i.status === filterStatus.value)
))
const summary = computed(() => [
  { label: 'Total Pekerjaan', value: items.value.length },
  { label: 'Terjadwal / Berjalan', value: items.value.filter(i => i.status !== 'Selesai').length },
  { label: 'Total Biaya', value: 'Rp ' + items.value.reduce((sum, i) => sum + Number(i.cost || 0), 0).toLocaleString('id-ID') },
])
function statusClass(status) {
  return status === 'Selesai' ? 'bg-emerald-100 text-emerald-700'
    : status === 'Dalam Pengerjaan' ? 'bg-sky-100 text-sky-700'
      : 'bg-amber-100 text-amber-700'
}
function openForm(item = null) {
  Object.assign(form, item ? { ...item } : {
    id: null, date: new Date().toISOString().slice(0, 10), vehicle: '',
    work: '', workshop: '', cost: 0, status: 'Terjadwal'
  })
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
  if (confirm('Hapus catatan service ini?')) items.value = items.value.filter(i => i.id !== id)
}
</script>
