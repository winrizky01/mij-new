<template>
    <div class="space-y-6">
        <!-- HEADER -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-[#003366]">
                    Truk
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola armada kendaraan operasional MJI.
                </p>
            </div>

            <button
                type="button"
                :disabled="loading"
                class="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                @click="openCreate"
            >
                + Tambah Truk
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Total Truk
                </p>

                <p class="mt-2 text-2xl font-bold text-gray-900">
                    {{ trucks.length }}
                </p>
            </div>

            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Tersedia
                </p>

                <p class="mt-2 text-2xl font-bold text-emerald-600">
                    {{ availableCount }}
                </p>
            </div>

            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Digunakan
                </p>

                <p class="mt-2 text-2xl font-bold text-blue-600">
                    {{ inUseCount }}
                </p>
            </div>

            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Perlu Perhatian
                </p>

                <p class="mt-2 text-2xl font-bold text-amber-600">
                    {{ attentionCount }}
                </p>

                <p class="mt-1 text-xs text-gray-400">
                    Pajak / KIR ≤ 30 hari atau belum diisi
                </p>
            </div>
        </div>

        <!-- FILTER -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px]">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari kode, nomor polisi, merk, model, atau jenis..."
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="statusFilter"
                    class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc]"
                >
                    <option value="">
                        Semua Status
                    </option>

                    <option value="available">
                        Tersedia
                    </option>

                    <option value="in_use">
                        Digunakan
                    </option>

                    <option value="maintenance">
                        Maintenance
                    </option>

                    <option value="inactive">
                        Nonaktif
                    </option>
                </select>
            </div>
        </div>

        <!-- TABLE -->
        <div
            class="rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="w-full">
                <table class="w-full table-fixed text-sm">
                    <thead class="border-b border-gray-100 bg-gray-50">
                        <tr>
                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Kode
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Nomor Polisi
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Kendaraan
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Jenis
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Driver Default
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Kapasitas
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Pajak
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                KIR
                            </th>

                            <th class="px-5 py-4 text-left font-semibold text-gray-600">
                                Status
                            </th>

                            <th class="px-5 py-4 text-right font-semibold text-gray-600">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody
                        v-if="loading"
                        class="divide-y divide-gray-100"
                    >
                        <tr>
                            <td
                                colspan="10"
                                class="px-5 py-14 text-center text-sm text-gray-400"
                            >
                                Memuat data truk...
                            </td>
                        </tr>
                    </tbody>

                    <tbody
                        v-else
                        class="divide-y divide-gray-100"
                    >
                        <tr
                            v-for="truck in filteredTrucks"
                            :key="truck.id"
                            class="transition hover:bg-gray-50"
                        >
                            <!-- CODE -->
                            <td
                                class="px-5 py-4 font-semibold text-[#003366]"
                            >
                                {{ truck.code }}
                            </td>

                            <!-- PLATE -->
                            <td class="px-5 py-4">
                                <div class="font-bold text-gray-900">
                                    {{ truck.plate_number }}
                                </div>

                                <div
                                    v-if="truck.previous_plate_number"
                                    class="mt-0.5 text-xs text-gray-400"
                                >
                                    Sebelumnya:
                                    {{ truck.previous_plate_number }}
                                </div>
                            </td>

                            <!-- VEHICLE -->
                            <td class="px-5 py-4 text-gray-700">
                                <div class="font-medium">
                                    {{ vehicleName(truck) }}
                                </div>
                            </td>

                            <!-- TYPE -->
                            <td class="px-5 py-4 text-gray-600">
                                {{ truck.truck_type?.name || '-' }}
                            </td>

                            <!-- DRIVER -->
                            <td class="px-5 py-4">
                                <div
                                    class="font-medium text-gray-700"
                                >
                                    {{ truck.driver?.name || '-' }}
                                </div>
                            </td>

                            <!-- CAPACITY -->
                            <td class="px-5 py-4 text-gray-600">
                                {{ formatCapacity(truck) }}
                            </td>

                            <!-- TAX -->
                            <td class="px-5 py-4">
                                <div class="text-xs text-gray-500">
                                    {{ formatDate(truck.tax_expired_at) }}
                                </div>

                                <span
                                    class="mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                    :class="
                                        documentStatus(
                                            truck.tax_expired_at
                                        ).class
                                    "
                                >
                                    {{
                                        documentStatus(
                                            truck.tax_expired_at
                                        ).label
                                    }}
                                </span>
                            </td>

                            <!-- KIR -->
                            <td class="px-5 py-4">
                                <div class="text-xs text-gray-500">
                                    {{ formatDate(truck.kir_expired_at) }}
                                </div>

                                <span
                                    class="mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                    :class="
                                        documentStatus(
                                            truck.kir_expired_at
                                        ).class
                                    "
                                >
                                    {{
                                        documentStatus(
                                            truck.kir_expired_at
                                        ).label
                                    }}
                                </span>
                            </td>

                            <!-- STATUS -->
                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="statusClass(truck.status)"
                                >
                                    {{ statusLabel(truck.status) }}
                                </span>
                            </td>

                            <!-- ACTION -->
                            <td class="relative px-5 py-4">
                                <div class="flex justify-end">
                                    <button
                                        type="button"
                                        class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                                        @click.stop="toggleActionMenu(truck.id)"
                                    >
                                        <span class="text-xl leading-none">⋮</span>
                                    </button>

                                    <div
                                        v-if="openActionMenu === truck.id"
                                        class="absolute right-3 top-11 z-50 w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl"
                                        @click.stop
                                    >
                                        <button
                                            type="button"
                                            class="action-menu-item"
                                            @click="handleAction('edit', truck)"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            class="action-menu-item"
                                            @click="handleAction('plate', truck)"
                                        >
                                            Ganti Plat
                                        </button>

                                        <button
                                            type="button"
                                            class="action-menu-item"
                                            @click="handleAction('history', truck)"
                                        >
                                            Riwayat
                                        </button>

                                        <div
                                            v-if="truck.status !== 'in_use'"
                                            class="my-1 border-t border-gray-100"
                                        ></div>

                                        <button
                                            v-if="truck.status !== 'in_use'"
                                            type="button"
                                            class="action-menu-item"
                                            :class="
                                                truck.status === 'inactive'
                                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                                    : 'text-red-600 hover:bg-red-50'
                                            "
                                            @click="handleAction('status', truck)"
                                        >
                                            {{
                                                truck.status === 'inactive'
                                                    ? 'Aktifkan'
                                                    : 'Nonaktifkan'
                                            }}
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="filteredTrucks.length === 0">
                            <td
                                colspan="10"
                                class="px-5 py-14 text-center text-gray-400"

                            >
                                Tidak ada data truk.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- TRUCK FORM MODAL -->
        <!-- ========================================================= -->

        <div
            v-if="showModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            @click.self="closeModal"
        >
            <div
                class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl"
            >
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-6 py-4"
                >
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            {{ editingId ? 'Edit Truk' : 'Tambah Truk' }}
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            Data armada kendaraan operasional.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl leading-none text-gray-400 hover:text-gray-700"
                        @click="closeModal"
                    >
                        ×
                    </button>
                </div>

                <form
                    class="max-h-[75vh] space-y-4 overflow-y-auto p-6"
                    @submit.prevent="saveTruck"
                >
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="form-label">
                                Kode Truk
                            </label>

                            <input
                                v-model="form.code"
                                required
                                placeholder="TRK-001"
                                class="form-input"
                            />
                        </div>

                        <div>
                            <label class="form-label">
                                Nomor Polisi
                            </label>

                            <input
                                v-model="form.plate_number"
                                required
                                :disabled="!!editingId"
                                placeholder="L 8123 AB"
                                class="form-input uppercase disabled:bg-gray-50"
                            />

                            <p
                                v-if="editingId"
                                class="mt-1.5 text-xs text-gray-400"
                            >
                                Gunakan Ganti Plat untuk mengganti nomor polisi.
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="form-label">
                                Merk
                            </label>

                            <input
                                v-model="form.brand"
                                placeholder="Mitsubishi"
                                class="form-input"
                            />
                        </div>

                        <div>
                            <label class="form-label">
                                Model
                            </label>

                            <input
                                v-model="form.model"
                                placeholder="Canter FE 74"
                                class="form-input"
                            />
                        </div>
                    </div>

                    <div>
                        <div class="mb-1.5 flex items-center justify-between">
                            <label class="form-label mb-0">
                                Jenis Truk
                            </label>

                            <button
                                type="button"
                                class="text-xs font-semibold text-[#0052cc] hover:text-[#003f9e]"
                                @click="openCreateTruckType"
                            >
                                + Kelola Jenis
                            </button>
                        </div>

                        <select
                            v-model="form.truck_type_id"
                            required
                            class="form-input"
                        >
                            <option value="">
                                Pilih jenis truk
                            </option>

                            <option
                                v-for="type in truckTypes"
                                :key="type.id"
                                :value="type.id"
                            >
                                {{ type.code }} - {{ type.name }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="form-label">
                            Driver Default
                        </label>

                        <select
                            v-model="form.driver_id"
                            class="form-input"
                        >
                            <option value="">
                                Tidak ada driver default
                            </option>

                            <option
                                v-for="employee in employees"
                                :key="employee.id"
                                :value="employee.id"
                            >
                                {{ employee.name }}
                            </option>
                        </select>

                        <p class="mt-1.5 text-xs text-gray-400">
                            Driver ini akan otomatis dipilih saat truck digunakan pada pengiriman.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="form-label">
                                Kapasitas
                            </label>

                            <input
                                v-model="form.capacity"
                                type="number"
                                min="0"
                                step="0.001"
                                placeholder="5"
                                class="form-input"
                            />
                        </div>

                        <div>
                            <label class="form-label">
                                Satuan Kapasitas
                            </label>

                            <input
                                v-model="form.capacity_unit"
                                placeholder="Ton"
                                class="form-input"
                            />
                        </div>
                    </div>

                    <!-- DOCUMENT -->
                    <div class="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <p class="text-sm font-semibold text-gray-800">
                            Dokumen Kendaraan
                        </p>

                        <p class="mt-1 text-xs text-gray-500">
                            Data berlaku dokumen kendaraan saat ini.
                        </p>

                        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label class="form-label">
                                    Pajak Berlaku Sampai
                                </label>

                                <input
                                    v-model="form.tax_expired_at"
                                    type="date"
                                    class="form-input bg-white"
                                />
                            </div>

                            <div>
                                <label class="form-label">
                                    KIR Berlaku Sampai
                                </label>

                                <input
                                    v-model="form.kir_expired_at"
                                    type="date"
                                    class="form-input bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="form-label">
                            Status
                        </label>

                        <select
                            v-model="form.status"
                            class="form-input"
                        >
                            <option value="available">
                                Tersedia
                            </option>

                            <option value="in_use">
                                Digunakan
                            </option>

                            <option value="maintenance">
                                Maintenance
                            </option>

                            <option value="inactive">
                                Nonaktif
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="form-label">
                            Keterangan
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Keterangan tambahan..."
                            class="form-input resize-none"
                        ></textarea>
                    </div>

                    <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            class="btn-secondary"
                            @click="closeModal"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="saving"
                            class="btn-primary"
                        >
                            {{ saving ? 'Menyimpan...' : 'Simpan' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- CHANGE PLATE MODAL -->
        <!-- ========================================================= -->

        <div
            v-if="showPlateModal"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
            @click.self="closePlateModal"
        >
            <div
                class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            Ganti Plat Nomor
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ selectedTruck?.code }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl leading-none text-gray-400"
                        @click="closePlateModal"
                    >
                        ×
                    </button>
                </div>

                <form
                    class="space-y-4 p-6"
                    @submit.prevent="changePlate"
                >
                    <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p class="text-xs text-gray-500">
                            Plat Saat Ini
                        </p>

                        <p class="mt-1 text-xl font-bold tracking-wide text-gray-900">
                            {{ selectedTruck?.plate_number || '-' }}
                        </p>
                    </div>

                    <div>
                        <label class="form-label">
                            Plat Baru
                        </label>

                        <input
                            v-model="plateForm.new_plate_number"
                            required
                            placeholder="L 8123 AB"
                            class="form-input uppercase"
                        />
                    </div>

                    <div>
                        <label class="form-label">
                            Tanggal Perubahan
                        </label>

                        <input
                            v-model="plateForm.changed_at"
                            type="date"
                            required
                            class="form-input"
                        />
                    </div>

                    <div>
                        <label class="form-label">
                            Alasan
                        </label>

                        <input
                            v-model="plateForm.reason"
                            placeholder="Perubahan administrasi"
                            class="form-input"
                        />
                    </div>

                    <div>
                        <label class="form-label">
                            Catatan
                        </label>

                        <textarea
                            v-model="plateForm.notes"
                            rows="3"
                            class="form-input resize-none"
                        ></textarea>
                    </div>

                    <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            class="btn-secondary"
                            @click="closePlateModal"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="changingPlate"
                            class="btn-primary"
                        >
                            {{ changingPlate ? 'Menyimpan...' : 'Ganti Plat' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- HISTORY MODAL -->
        <!-- ========================================================= -->

        <div
            v-if="showHistoryModal"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
            @click.self="closeHistory"
        >
            <div
                class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
            >
                <!-- HEADER -->
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            Riwayat Truk
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ selectedTruck?.code }}
                            ·
                            {{ selectedTruck?.plate_number }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl leading-none text-gray-400"
                        @click="closeHistory"
                    >
                        ×
                    </button>
                </div>

                <!-- TABS -->
                <div class="border-b border-gray-100 px-6">
                    <div class="flex gap-6">
                        <button
                            type="button"
                            class="relative py-3 text-sm font-semibold"
                            :class="
                                historyTab === 'plate'
                                    ? 'text-[#0052cc]'
                                    : 'text-gray-400 hover:text-gray-600'
                            "
                            @click="
                                switchHistoryTab('plate')
                            "
                        >
                            Plat

                            <span
                                v-if="historyTab === 'plate'"
                                class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#0052cc]"
                            ></span>
                        </button>

                        <button
                            type="button"
                            class="relative py-3 text-sm font-semibold"
                            :class="
                                historyTab === 'kir'
                                    ? 'text-[#0052cc]'
                                    : 'text-gray-400 hover:text-gray-600'
                            "
                            @click="
                                switchHistoryTab('kir')
                            "
                        >
                            KIR

                            <span
                                v-if="historyTab === 'kir'"
                                class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#0052cc]"
                            ></span>
                        </button>
                    </div>
                </div>

                <!-- CONTENT -->
                <div class="max-h-[60vh] overflow-y-auto p-6">
                    <!-- PLATE -->
                    <template v-if="historyTab === 'plate'">
                        <div
                            v-if="loadingPlateHistory"
                            class="py-12 text-center text-sm text-gray-400"
                        >
                            Memuat riwayat plat...
                        </div>

                        <div
                            v-else-if="plateHistory.length === 0"
                            class="py-12 text-center"
                        >
                            <p class="text-sm font-medium text-gray-500">
                                Belum ada riwayat pergantian plat.
                            </p>
                        </div>

                        <div
                            v-else
                            class="space-y-3"
                        >
                            <div
                                v-for="history in plateHistory"
                                :key="history.id"
                                class="rounded-xl border border-gray-100 bg-gray-50 p-4"
                            >
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div class="flex items-center gap-2">
                                        <span class="font-semibold text-gray-700">
                                            {{ history.old_plate_number }}
                                        </span>

                                        <span class="text-gray-400">
                                            →
                                        </span>

                                        <span class="font-bold text-[#0052cc]">
                                            {{ history.new_plate_number }}
                                        </span>
                                    </div>

                                    <span class="text-xs text-gray-400">
                                        {{ formatDate(history.changed_at) }}
                                    </span>
                                </div>

                                <p
                                    v-if="history.reason"
                                    class="mt-2 text-xs text-gray-500"
                                >
                                    Alasan:
                                    {{ history.reason }}
                                </p>

                                <p
                                    v-if="history.notes"
                                    class="mt-1 text-xs text-gray-400"
                                >
                                    {{ history.notes }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- KIR -->
                    <template v-else>
                        <div class="mb-5 flex items-center justify-between">
                            <div>
                                <p class="text-sm font-semibold text-gray-800">
                                    Riwayat Pemeriksaan KIR
                                </p>

                                <p class="mt-1 text-xs text-gray-400">
                                    KIR aktif:
                                    <strong>
                                        {{
                                            formatDate(
                                                selectedTruck?.kir_expired_at
                                            )
                                        }}
                                    </strong>
                                </p>
                            </div>

                            <button
                                type="button"
                                class="rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-semibold text-white hover:bg-[#003f9e]"
                                @click="openUpdateKir"
                            >
                                + Perbarui KIR
                            </button>
                        </div>

                        <div
                            v-if="loadingKirHistory"
                            class="py-12 text-center text-sm text-gray-400"
                        >
                            Memuat riwayat KIR...
                        </div>

                        <div
                            v-else-if="kirHistory.length === 0"
                            class="py-12 text-center"
                        >
                            <p class="text-sm font-medium text-gray-500">
                                Belum ada riwayat KIR.
                            </p>

                            <p class="mt-1 text-xs text-gray-400">
                                Tambahkan riwayat saat kendaraan melakukan KIR.
                            </p>
                        </div>

                        <div
                            v-else
                            class="space-y-3"
                        >
                            <div
                                v-for="history in kirHistory"
                                :key="history.id"
                                class="rounded-xl border border-gray-100 bg-gray-50 p-4"
                            >
                                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                                :class="
                                                    history.result === 'LULUS'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-red-50 text-red-700'
                                                "
                                            >
                                                {{ history.result }}
                                            </span>

                                            <span class="text-xs text-gray-400">
                                                {{ formatDate(history.kir_date) }}
                                            </span>
                                        </div>

                                        <p class="mt-2 text-sm font-semibold text-gray-800">
                                            Berlaku sampai
                                            {{ formatDate(history.expired_at) }}
                                        </p>
                                    </div>
                                </div>

                                <p
                                    v-if="history.notes"
                                    class="mt-2 text-xs text-gray-500"
                                >
                                    {{ history.notes }}
                                </p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- UPDATE KIR MODAL -->
        <!-- ========================================================= -->

        <div
            v-if="showKirModal"
            class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
            @click.self="closeKirModal"
        >
            <div
                class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >
                <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 class="text-lg font-bold text-[#003366]">
                            Perbarui KIR
                        </h2>

                        <p class="mt-1 text-xs text-gray-500">
                            {{ selectedTruck?.code }}
                            ·
                            {{ selectedTruck?.plate_number }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl leading-none text-gray-400"
                        @click="closeKirModal"
                    >
                        ×
                    </button>
                </div>

                <form
                    class="space-y-4 p-6"
                    @submit.prevent="saveKir"
                >
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="form-label">
                                Tanggal KIR
                            </label>

                            <input
                                v-model="kirForm.kir_date"
                                type="date"
                                required
                                class="form-input"
                            />
                        </div>

                        <div>
                            <label class="form-label">
                                Berlaku Sampai
                            </label>

                            <input
                                v-model="kirForm.expired_at"
                                type="date"
                                required
                                class="form-input"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="form-label">
                            Hasil
                        </label>

                        <select
                            v-model="kirForm.result"
                            class="form-input"
                        >
                            <option value="LULUS">
                                LULUS
                            </option>

                            <option value="TIDAK_LULUS">
                                TIDAK LULUS
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="form-label">
                            Catatan
                        </label>

                        <textarea
                            v-model="kirForm.notes"
                            rows="3"
                            placeholder="Catatan pemeriksaan KIR..."
                            class="form-input resize-none"
                        ></textarea>
                    </div>

                    <div class="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
                        Menyimpan KIR akan memperbarui tanggal KIR aktif kendaraan
                        sekaligus membuat histori KIR baru.
                    </div>

                    <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            class="btn-secondary"
                            @click="closeKirModal"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="savingKir"
                            class="btn-primary"
                        >
                            {{ savingKir ? 'Menyimpan...' : 'Simpan KIR' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <TruckTypeModal
        v-model="showTruckTypeModal"
        :truck-type="editingTruckType"
        @saved="handleTruckTypeSaved"
    />
</template>

<script setup>
import {
    computed,
    onMounted,
    onUnmounted,
    reactive,
    ref,
} from 'vue'

import {
    erpApi,
    getApiError,
} from '@/services/api'

import TruckTypeModal from '../../components/erp/trucks/TruckTypeModal.vue'

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const search = ref('')
const statusFilter = ref('')
const openActionMenu = ref(null)

const showModal = ref(false)
const showPlateModal = ref(false)
const showHistoryModal = ref(false)
const showKirModal = ref(false)
const showTruckTypeModal = ref(false)
const editingTruckType = ref(null)

const editingId = ref(null)
const selectedTruck = ref(null)

const loading = ref(false)
const saving = ref(false)
const changingPlate = ref(false)
const loadingPlateHistory = ref(false)
const loadingKirHistory = ref(false)
const savingKir = ref(false)

const historyTab = ref('plate')

const trucks = ref([])
const truckTypes = ref([])
const employees = ref([])

const plateHistory = ref([])
const kirHistory = ref([])

const form = reactive({
    code: '',
    plate_number: '',
    truck_type_id: '',
    brand: '',
    driver_id: '',
    model: '',
    capacity: '',
    capacity_unit: '',
    tax_expired_at: '',
    kir_expired_at: '',
    status: 'available',
    notes: '',
})

const plateForm = reactive({
    new_plate_number: '',
    changed_at: '',
    reason: '',
    notes: '',
})

const kirForm = reactive({
    kir_date: '',
    expired_at: '',
    result: 'LULUS',
    notes: '',
})

/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const availableCount = computed(() =>
    trucks.value.filter(
        truck => truck.status === 'available'
    ).length
)

const inUseCount = computed(() =>
    trucks.value.filter(
        truck => truck.status === 'in_use'
    ).length
)

const attentionCount = computed(() =>
    trucks.value.filter(truck =>
        isDocumentAttention(
            truck.tax_expired_at
        ) ||
        isDocumentAttention(
            truck.kir_expired_at
        )
    ).length
)

const filteredTrucks = computed(() => {
    const keyword =
        search.value
            .toLowerCase()
            .trim()

    return trucks.value.filter(truck => {
        const typeName =
            truck.truck_type?.name
                ?.toLowerCase() || ''

        const matchesSearch =
            !keyword ||
            String(truck.code || '')
                .toLowerCase()
                .includes(keyword) ||
            String(truck.plate_number || '')
                .toLowerCase()
                .includes(keyword) ||
            String(truck.brand || '')
                .toLowerCase()
                .includes(keyword) ||
            String(truck.model || '')
                .toLowerCase()
                .includes(keyword) ||
            typeName.includes(keyword)

        const matchesStatus =
            !statusFilter.value ||
            truck.status === statusFilter.value

        return (
            matchesSearch &&
            matchesStatus
        )
    })
})

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function unwrapData(response) {
    return response?.data?.data ?? response
}

function formatDate(date) {
    if (!date) {
        return '-'
    }

    const parsed =
        new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsed.getTime())) {
        return '-'
    }

    return parsed.toLocaleDateString(
        'id-ID',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }
    )
}

function getDaysRemaining(date) {
    if (!date) {
        return null
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const expiry =
        new Date(`${date}T00:00:00`)

    if (Number.isNaN(expiry.getTime())) {
        return null
    }

    return Math.ceil(
        (
            expiry.getTime() -
            today.getTime()
        ) /
            (1000 * 60 * 60 * 24)
    )
}

function isDocumentAttention(date) {
    if (!date) {
        return true
    }

    const days =
        getDaysRemaining(date)

    return (
        days !== null &&
        days <= 30
    )
}

function documentStatus(date) {
    if (!date) {
        return {
            label: 'Belum diisi',
            class:
                'bg-gray-100 text-gray-500',
        }
    }

    const days =
        getDaysRemaining(date)

    if (days === null) {
        return {
            label: 'Tidak valid',
            class:
                'bg-gray-100 text-gray-500',
        }
    }

    if (days < 0) {
        return {
            label: 'Expired',
            class:
                'bg-red-50 text-red-700',
        }
    }

    if (days === 0) {
        return {
            label: 'Hari ini',
            class:
                'bg-red-50 text-red-700',
        }
    }

    if (days <= 30) {
        return {
            label: `${days} hari lagi`,
            class:
                'bg-amber-50 text-amber-700',
        }
    }

    return {
        label: 'Aman',
        class:
            'bg-emerald-50 text-emerald-700',
    }
}

function vehicleName(truck) {
    const parts = [
        truck.brand,
        truck.model,
    ].filter(Boolean)

    return parts.length
        ? parts.join(' ')
        : truck.truck_type?.name || '-'
}

function formatCapacity(truck) {
    if (
        truck.capacity === null ||
        truck.capacity === undefined ||
        truck.capacity === ''
    ) {
        return '-'
    }

    return `${truck.capacity} ${
        truck.capacity_unit || ''
    }`.trim()
}

function statusLabel(status) {
    const labels = {
        available: 'Tersedia',
        in_use: 'Digunakan',
        maintenance: 'Maintenance',
        inactive: 'Nonaktif',
    }

    return labels[status] || status || '-'
}

function statusClass(status) {
    const classes = {
        available:
            'bg-emerald-50 text-emerald-700',

        in_use:
            'bg-blue-50 text-blue-700',

        maintenance:
            'bg-amber-50 text-amber-700',

        inactive:
            'bg-gray-100 text-gray-500',
    }

    return (
        classes[status] ||
        'bg-gray-100 text-gray-500'
    )
}

function toggleActionMenu(id) {
    openActionMenu.value =
        openActionMenu.value === id
            ? null
            : id
}

function closeActionMenu() {
    openActionMenu.value = null
}

function handleAction(action, truck) {
    closeActionMenu()

    if (action === 'edit') {
        openEdit(truck)
        return
    }

    if (action === 'plate') {
        openChangePlate(truck)
        return
    }

    if (action === 'history') {
        openHistory(truck, 'plate')
        return
    }

    if (action === 'status') {
        toggleStatus(truck)
    }
}

function handleDocumentClick() {
    closeActionMenu()
}

onMounted(() => {
    document.addEventListener(
        'click',
        handleDocumentClick
    )

    loadTrucks()
    loadTruckTypes()
    loadEmployees()
})

onUnmounted(() => {
    document.removeEventListener(
        'click',
        handleDocumentClick
    )
})

function openCreateTruckType() {
    editingTruckType.value = null
    showTruckTypeModal.value = true
}

function openEditTruckType(type) {
    editingTruckType.value = type
    showTruckTypeModal.value = true
}

async function handleTruckTypeSaved() {
    showTruckTypeModal.value = false
    editingTruckType.value = null

    await loadTruckTypes()
}

/*
|--------------------------------------------------------------------------
| TRUCK FORM
|--------------------------------------------------------------------------
*/

function resetForm() {
    Object.assign(form, {
        code: '',
        plate_number: '',
        truck_type_id: '',
        driver_id: '',
        brand: '',
        model: '',
        capacity: '',
        capacity_unit: '',
        tax_expired_at: '',
        kir_expired_at: '',
        status: 'available',
        notes: '',
    })
}

function openCreate() {
    editingId.value = null

    resetForm()

    showModal.value = true
}

function openEdit(truck) {
    editingId.value = truck.id

    Object.assign(form, {
        code: truck.code || '',
        plate_number: truck.plate_number || '',
        truck_type_id:
            truck.truck_type_id || '',
        driver_id:
            truck.driver_id || '',
        brand: truck.brand || '',
        model: truck.model || '',
        capacity: truck.capacity ?? '',
        capacity_unit:
            truck.capacity_unit || '',
        tax_expired_at:
            truck.tax_expired_at || '',
        kir_expired_at:
            truck.kir_expired_at || '',
        status:
            truck.status || 'available',
        notes: truck.notes || '',
    })

    showModal.value = true
}

function closeModal() {
    showModal.value = false
}

/*
|--------------------------------------------------------------------------
| LOAD
|--------------------------------------------------------------------------
*/

async function loadTruckTypes() {
    try {
        const response =
            await erpApi.master.truckTypes.list({
                is_active: true,
            })

        const data = response.data

        truckTypes.value =
            Array.isArray(data)
                ? data
                : []
    } catch (error) {
        console.error(
            'Gagal memuat jenis truk:',
            error
        )

        truckTypes.value = []
    }
}

async function loadTrucks() {
    loading.value = true

    try {
        const response =
            await erpApi.master.trucks.list()

        const data =
            unwrapData(response)

        trucks.value =
            Array.isArray(data)
                ? data
                : []
    } catch (error) {
        console.error(
            'Gagal memuat truk:',
            error
        )

        trucks.value = []

        alert(
            getApiError(error)?.message ||
            'Gagal memuat data truk.'
        )
    } finally {
        loading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| SAVE
|--------------------------------------------------------------------------
*/

async function saveTruck() {
    if (!form.code.trim()) {
        alert('Kode truk wajib diisi.')
        return
    }

    if (!form.plate_number.trim()) {
        alert('Nomor polisi wajib diisi.')
        return
    }

    if (!form.truck_type_id) {
        alert('Jenis truk wajib dipilih.')
        return
    }

    saving.value = true

    try {
        const payload = {
            code: form.code.trim(),

            plate_number:
                form.plate_number
                    .trim()
                    .toUpperCase(),

            truck_type_id:
                form.truck_type_id
                    ? Number(form.truck_type_id)
                    : null,

            driver_id:
                form.driver_id
                    ? Number(form.driver_id)
                    : null,

            brand:
                form.brand.trim() || null,

            model:
                form.model.trim() || null,

            capacity:
                form.capacity !== ''
                    ? Number(form.capacity)
                    : null,

            capacity_unit:
                form.capacity_unit.trim() || null,

            tax_expired_at:
                form.tax_expired_at || null,

            kir_expired_at:
                form.kir_expired_at || null,

            status: form.status,

            notes:
                form.notes.trim() || null,
        }

        let response

        if (editingId.value) {
            response =
                await erpApi.master.trucks.update(
                    editingId.value,
                    payload
                )
        } else {
            response =
                await erpApi.master.trucks.create(
                    payload
                )
        }

        const savedTruck =
            unwrapData(response)

        if (editingId.value) {
            const index =
                trucks.value.findIndex(
                    item =>
                        item.id ===
                        editingId.value
                )

            if (index !== -1) {
                trucks.value[index] =
                    savedTruck
            }
        } else {
            trucks.value.unshift(
                savedTruck
            )
        }

        closeModal()
    } catch (error) {
        console.error(
            'Gagal menyimpan truk:',
            error
        )

        alert(
            getApiError(error)?.message ||
            'Gagal menyimpan data truk.'
        )
    } finally {
        saving.value = false
    }
}

/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

async function toggleStatus(truck) {
    if (truck.status === 'in_use') {
        alert(
            'Truk yang sedang digunakan tidak dapat dinonaktifkan.'
        )

        return
    }

    console.log(truck)


    const newStatus =
        truck.status === 'inactive'
            ? 'available'
            : 'inactive'

    try {
        const response =
            await erpApi.master.trucks.update(
                truck.id,
                {   
                    code  : truck.code,
                    plate_number: truck.plate_number,
                    status: newStatus,
                }
            )

        const updatedTruck = unwrapData(response)

        const index =
            trucks.value.findIndex(
                item =>
                    item.id === truck.id
            )

        if (index !== -1) {
            trucks.value[index] =
                updatedTruck
        }
    } catch (error) {
        alert(
            getApiError(error)?.message ||
            'Gagal mengubah status truk.'
        )
    }
}

/*
|--------------------------------------------------------------------------
| PLATE
|--------------------------------------------------------------------------
*/

function resetPlateForm() {
    Object.assign(plateForm, {
        new_plate_number: '',
        changed_at:
            new Date()
                .toISOString()
                .slice(0, 10),
        reason: '',
        notes: '',
    })
}

function openChangePlate(truck) {
    selectedTruck.value = truck

    resetPlateForm()

    showPlateModal.value = true
}

function closePlateModal() {
    if (changingPlate.value) {
        return
    }

    showPlateModal.value = false
}

async function changePlate() {
    if (!selectedTruck.value) {
        return
    }

    const newPlate =
        plateForm.new_plate_number
            .trim()
            .toUpperCase()

    if (!newPlate) {
        alert(
            'Plat nomor baru wajib diisi.'
        )

        return
    }

    changingPlate.value = true

    try {
        const response =
            await erpApi.master.trucks.changePlate(
                selectedTruck.value.id,
                {
                    new_plate_number:
                        newPlate,

                    changed_at:
                        plateForm.changed_at,

                    reason:
                        plateForm.reason.trim() ||
                        null,

                    notes:
                        plateForm.notes.trim() ||
                        null,
                }
            )

        const updatedTruck =
            unwrapData(response)

        updateTruckInList(updatedTruck)

        selectedTruck.value =
            updatedTruck

        showPlateModal.value = false
    } catch (error) {
        alert(
            getApiError(error)?.message ||
            'Gagal mengganti plat nomor.'
        )
    } finally {
        changingPlate.value = false
    }
}

/*
|--------------------------------------------------------------------------
| HISTORY
|--------------------------------------------------------------------------
*/

function updateTruckInList(truck) {
    const index =
        trucks.value.findIndex(
            item => item.id === truck.id
        )

    if (index !== -1) {
        trucks.value[index] = truck
    }
}

function resetHistory() {
    plateHistory.value = []
    kirHistory.value = []
}

async function openHistory(
    truck,
    tab = 'plate'
) {
    selectedTruck.value = truck
    historyTab.value = tab
    showHistoryModal.value = true

    resetHistory()

    if (tab === 'plate') {
        await loadPlateHistory(truck.id)
    } else {
        await loadKirHistory(truck.id)
    }
}

function closeHistory() {
    showHistoryModal.value = false
}

async function switchHistoryTab(tab) {
    historyTab.value = tab

    if (!selectedTruck.value) {
        return
    }

    if (tab === 'plate') {
        await loadPlateHistory(
            selectedTruck.value.id
        )
    } else {
        await loadKirHistory(
            selectedTruck.value.id
        )
    }
}

async function loadPlateHistory(id) {
    loadingPlateHistory.value = true

    try {
        const response =
            await erpApi.master.trucks.plateHistory(
                id
            )

        const data =
            unwrapData(response)

        plateHistory.value =
            Array.isArray(data)
                ? data
                : []
    } catch (error) {
        console.error(error)

        plateHistory.value = []

        alert(
            getApiError(error)?.message ||
            'Gagal memuat riwayat plat.'
        )
    } finally {
        loadingPlateHistory.value = false
    }
}

async function loadKirHistory(id) {
    loadingKirHistory.value = true

    try {
        const response =
            await erpApi.master.trucks.kirHistory(
                id
            )

        const data =
            unwrapData(response)

        kirHistory.value =
            Array.isArray(data)
                ? data
                : []
    } catch (error) {
        console.error(error)

        kirHistory.value = []

        alert(
            getApiError(error)?.message ||
            'Gagal memuat riwayat KIR.'
        )
    } finally {
        loadingKirHistory.value = false
    }
}

async function loadEmployees() {
    try {
        const response =
            await erpApi.master.employees.list({
                employment_type: 'LEPAS',
                is_active: true,
            })

        const data = response.data

        employees.value =
            Array.isArray(data)
                ? data
                : []
    } catch (error) {
        console.error(
            'Gagal memuat employee:',
            error
        )

        employees.value = []
    }
}

/*
|--------------------------------------------------------------------------
| KIR
|--------------------------------------------------------------------------
*/

function resetKirForm() {
    Object.assign(kirForm, {
        kir_date:
            new Date()
                .toISOString()
                .slice(0, 10),

        expired_at: '',

        result: 'LULUS',

        notes: '',
    })
}

function openUpdateKir() {
    resetKirForm()

    showKirModal.value = true
}

function closeKirModal() {
    if (savingKir.value) {
        return
    }

    showKirModal.value = false
}

async function saveKir() {
    if (!selectedTruck.value) {
        return
    }

    if (!kirForm.kir_date) {
        alert('Tanggal KIR wajib diisi.')
        return
    }

    if (!kirForm.expired_at) {
        alert(
            'Tanggal berlaku KIR wajib diisi.'
        )
        return
    }

    savingKir.value = true

    try {
        const response =
            await erpApi.master.trucks.updateKir(
                selectedTruck.value.id,
                {
                    kir_date:
                        kirForm.kir_date,

                    expired_at:
                        kirForm.expired_at,

                    result:
                        kirForm.result,

                    notes:
                        kirForm.notes.trim() ||
                        null,
                }
            )

        const updatedTruck =
            unwrapData(response)

        updateTruckInList(updatedTruck)

        selectedTruck.value =
            updatedTruck

        showKirModal.value = false

        await loadKirHistory(
            updatedTruck.id
        )
    } catch (error) {
        console.error(
            'Gagal menyimpan KIR:',
            error
        )

        alert(
            getApiError(error)?.message ||
            'Gagal menyimpan KIR.'
        )
    } finally {
        savingKir.value = false
    }
}

/*
|--------------------------------------------------------------------------
| INIT
|--------------------------------------------------------------------------
*/

onMounted(async () => {
    await Promise.all([
        loadTrucks(),
        loadTruckTypes(),
        loadEmployees(),
    ])
})
</script>

<style scoped>
.form-label {
    display: block;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.form-input {
    width: 100%;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    outline: none;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.form-input:focus {
    border-color: #0052cc;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.btn-primary {
    border-radius: 0.75rem;
    background-color: #0052cc;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #ffffff;
    transition: background-color 0.2s ease;
}

.btn-primary:hover {
    background-color: #003f9e;
}

.btn-primary:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.btn-secondary {
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    transition: background-color 0.2s ease;
}

.btn-secondary:hover {
    background-color: #f9fafb;
}

/* ACTION DROPDOWN */
.action-menu-item {
    display: flex;
    width: 100%;
    align-items: center;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    transition:
        background-color 0.15s ease,
        color 0.15s ease;
}

.action-menu-item:hover {
    background-color: #f9fafb;
}
</style>