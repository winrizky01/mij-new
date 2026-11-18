<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Biaya Operasional</h1>
        <p class="mt-1 text-sm text-gray-500">Monitoring pengeluaran dan biaya operasional armada.</p>
      </div>
      <button @click="openForm()" class="rounded-xl bg-[#003366] px-4 py-2.5 text-sm font-semibold text-white">+ Tambah
        Biaya</button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="card in summary" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-5">
        <p class="text-sm text-gray-500">{{ card.label }}</p>
        <p class="mt-2 text-2xl font-bold text-gray-800">{{ card.value }}</p>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-100 bg-white p-5">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row">
        <input v-model="search" placeholder="Cari kendaraan atau keterangan..."
          class="w-full rounded-xl border px-4 py-2.5 text-sm" />
        <select v-model="filterCategory" class="rounded-xl border px-4 py-2.5 text-sm">
          <option value="">Semua kategori</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">Tanggal</th>
              <th class="p-3">Kendaraan</th>
              <th class="p-3">Kategori</th>
              <th class="p-3">Keterangan</th>
              <th class="p-3">Nominal</th>
              <th class="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredItems" :key="item.id">
              <td class="p-3">{{ item.date }}</td>
              <td class="p-3 font-medium">{{ item.vehicle }}</td>
              <td class="p-3">{{ item.category }}</td>
              <td class="p-3">{{ item.description }}</td>
              <td class="p-3 font-semibold">Rp {{ Number(item.amount).toLocaleString('id-ID') }}</td>
              <td class="p-3 text-right whitespace-nowrap">
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
        <h2 class="text-lg font-bold">{{ form.id ? 'Edit Biaya' : 'Tambah Biaya Operasional' }}</h2>
        <form @submit.prevent="save" class="mt-5 space-y-4">
          <div><label class="mb-1 block text-sm font-medium">Tanggal</label><input v-model="form.date" type="date"
              required class="w-full rounded-xl border p-3 text-sm" /></div>
          <div><label class="mb-1 block text-sm font-medium">Kendaraan</label><input v-model="form.vehicle" required
              class="w-full rounded-xl border p-3 text-sm" placeholder="Nama kendaraan" /></div>
          <div><label class="mb-1 block text-sm font-medium">Kategori Biaya</label><select v-model="form.category"
              class="w-full rounded-xl border p-3 text-sm">
              <option v-for="category in categories" :key="category">{{ category }}</option>
            </select></div>
          <div><label class="mb-1 block text-sm font-medium">Keterangan</label><input v-model="form.description"
              required class="w-full rounded-xl border p-3 text-sm" placeholder="Keterangan pengeluaran" /></div>
          <div><label class="mb-1 block text-sm font-medium">Nominal (Rp)</label><input v-model.number="form.amount"
              type="number" min="0" required class="w-full rounded-xl border p-3 text-sm" /></div>
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

const categories = ['BBM', 'Tol & Parkir', 'Service', 'Pajak & KIR', 'Ban & Suku Cadang', 'Lainnya']
const items = ref([
  { id: 1, date: '2026-11-17', vehicle: 'Hino 500 - Armada 01', category: 'BBM', description: 'Solar perjalanan Probolinggo', amount: 850000 },
  { id: 2, date: '2026-11-16', vehicle: 'Mitsubishi Fuso - Armada 02', category: 'Tol & Parkir', description: 'Biaya tol dan parkir', amount: 325000 },
  { id: 3, date: '2026-11-15', vehicle: 'Hino Dutro - Armada 03', category: 'Service', description: 'Penggantian filter oli', amount: 450000 },
])
const search = ref('')
const filterCategory = ref('')
const showForm = ref(false)
const form = reactive({ id: null, date: '', vehicle: '', category: 'BBM', description: '', amount: 0 })
const filteredItems = computed(() => items.value.filter(i =>
  `${i.vehicle} ${i.description}`.toLowerCase().includes(search.value.toLowerCase())
  && (!filterCategory.value || i.category === filterCategory.value)
))
const summary = computed(() => [
  { label: 'Total Pengeluaran', value: 'Rp ' + items.value.reduce((sum, i) => sum + Number(i.amount || 0), 0).toLocaleString('id-ID') },
  { label: 'Transaksi Bulan Ini', value: items.value.filter(i => i.date.startsWith('2026-11')).length },
  { label: 'Jenis Biaya', value: new Set(items.value.map(i => i.category)).size },
])
function openForm(item = null) {
  Object.assign(form, item ? { ...item } : {
    id: null, date: new Date().toISOString().slice(0, 10),
    vehicle: '', category: 'BBM', description: '', amount: 0
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
  if (confirm('Hapus biaya ini?')) items.value = items.value.filter(i => i.id !== id)
}
</script>
