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
                class="inline-flex items-center justify-center rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="loading"
                @click="openCreate"
            >
                + Tambah Truk
            </button>
        </div>

        <!-- SUMMARY -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <!-- TOTAL -->
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

            <!-- AVAILABLE -->
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

            <!-- IN USE -->
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

            <!-- ATTENTION -->
            <div
                class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
                <p class="text-sm text-gray-500">
                    Perlu Perhatian
                </p>

                <p class="mt-2 text-2xl font-bold text-amber-600">
                    {{ attentionCount }}
                </p>
            </div>
        </div>

        <!-- FILTER -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div
                class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px]"
            >
                <div class="relative">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Cari kode, nomor polisi, merk, model, atau jenis..."
                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                    />
                </div>

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
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="overflow-x-auto">
                <table class="min-w-[1100px] w-full text-sm">
                    <thead
                        class="border-b border-gray-100 bg-gray-50"
                    >
                        <tr>
                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Kode
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Nomor Polisi
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Kendaraan
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Jenis
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Kapasitas
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Pajak
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                KIR
                            </th>

                            <th
                                class="px-5 py-4 text-left font-semibold text-gray-600"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-4 text-right font-semibold text-gray-600"
                            >
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
                                colspan="9"
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
                                <div
                                    class="font-bold text-gray-900"
                                >
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

                                <div
                                    v-if="
                                        truck.brand ||
                                        truck.model
                                    "
                                    class="mt-0.5 text-xs text-gray-400"
                                >
                                    {{ truck.brand }}
                                    {{ truck.model }}
                                </div>
                            </td>

                            <!-- TYPE -->
                            <td class="px-5 py-4 text-gray-600">
                                {{
                                    truck.truck_type?.name ||
                                    '-'
                                }}
                            </td>

                            <!-- CAPACITY -->
                            <td class="px-5 py-4 text-gray-600">
                                {{ formatCapacity(truck) }}
                            </td>

                            <!-- TAX -->
                            <td class="px-5 py-4">
                                <div
                                    class="text-xs text-gray-500"
                                >
                                    {{
                                        formatDate(
                                            truck.tax_expired_at
                                        )
                                    }}
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
                                <div
                                    class="text-xs text-gray-500"
                                >
                                    {{
                                        formatDate(
                                            truck.kir_expired_at
                                        )
                                    }}
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
                                    :class="
                                        statusClass(
                                            truck.status
                                        )
                                    "
                                >
                                    {{
                                        statusLabel(
                                            truck.status
                                        )
                                    }}
                                </span>
                            </td>

                            <!-- ACTION -->
                            <td class="px-5 py-4">
                                <div
                                    class="flex justify-end gap-2"
                                >
                                    <button
                                        type="button"
                                        class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                        @click="
                                            openEdit(truck)
                                        "
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                        @click="
                                            openChangePlate(
                                                truck
                                            )
                                        "
                                    >
                                        Ganti Plat
                                    </button>

                                    <button
                                        type="button"
                                        class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                        @click="
                                            openPlateHistory(
                                                truck
                                            )
                                        "
                                    >
                                        Riwayat
                                    </button>

                                    <button
                                        v-if="
                                            truck.status !==
                                            'in_use'
                                        "
                                        type="button"
                                        class="rounded-lg px-3 py-1.5 text-xs font-semibold"
                                        :class="
                                            truck.status ===
                                            'inactive'
                                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                        "
                                        @click="
                                            toggleStatus(
                                                truck
                                            )
                                        "
                                    >
                                        {{
                                            truck.status ===
                                            'inactive'
                                                ? 'Aktifkan'
                                                : 'Nonaktifkan'
                                        }}
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr
                            v-if="
                                filteredTrucks.length === 0
                            "
                        >
                            <td
                                colspan="9"
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
                <!-- HEADER -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-6 py-4"
                >
                    <div>
                        <h2
                            class="text-lg font-bold text-[#003366]"
                        >
                            {{
                                editingId
                                    ? 'Edit Truk'
                                    : 'Tambah Truk'
                            }}
                        </h2>

                        <p
                            class="mt-1 text-xs text-gray-500"
                        >
                            Data armada kendaraan
                            operasional.
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

                <!-- FORM -->
                <form
                    class="max-h-[75vh] space-y-4 overflow-y-auto p-6"
                    @submit.prevent="saveTruck"
                >
                    <!-- CODE -->
                    <div
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Kode Truk
                            </label>

                            <input
                                v-model="form.code"
                                required
                                placeholder="TRK-001"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <!-- PLATE -->
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Nomor Polisi
                            </label>

                            <input
                                v-model="form.plate_number"
                                required
                                :disabled="!!editingId"
                                placeholder="L 8123 AB"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                            />

                            <p
                                v-if="editingId"
                                class="mt-1.5 text-xs text-gray-400"
                            >
                                Untuk mengganti plat,
                                gunakan tombol
                                <strong>Ganti Plat</strong>.
                            </p>
                        </div>
                    </div>

                    <!-- BRAND + MODEL -->
                    <div
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Merk
                            </label>

                            <input
                                v-model="form.brand"
                                placeholder="Mitsubishi"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Model
                            </label>

                            <input
                                v-model="form.model"
                                placeholder="Canter FE 74"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <!-- TYPE -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Jenis Truk
                        </label>

                        <select
                            v-model="form.truck_type_id"
                            required
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        >
                            <option value="">
                                Pilih jenis truk
                            </option>

                            <option
                                v-for="type in truckTypes"
                                :key="type.id"
                                :value="type.id"
                            >
                                {{ type.code }} -
                                {{ type.name }}
                            </option>
                        </select>

                        <p
                            v-if="
                                truckTypes.length === 0
                            "
                            class="mt-1.5 text-xs text-amber-600"
                        >
                            Belum ada master jenis
                            truk.
                        </p>
                    </div>

                    <!-- CAPACITY -->
                    <div
                        class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Kapasitas
                            </label>

                            <input
                                v-model="form.capacity"
                                type="number"
                                min="0"
                                step="0.001"
                                placeholder="5"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>

                        <div>
                            <label
                                class="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Satuan Kapasitas
                            </label>

                            <input
                                v-model="form.capacity_unit"
                                placeholder="Ton"
                                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                            />
                        </div>
                    </div>

                    <!-- DOCUMENTS -->
                    <div
                        class="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                        <div class="mb-3">
                            <p
                                class="text-sm font-semibold text-gray-800"
                            >
                                Dokumen Kendaraan
                            </p>

                            <p
                                class="mt-0.5 text-xs text-gray-500"
                            >
                                Masukkan tanggal berlaku
                                pajak dan KIR.
                            </p>
                        </div>

                        <div
                            class="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Pajak Berlaku Sampai
                                </label>

                                <input
                                    v-model="
                                        form.tax_expired_at
                                    "
                                    type="date"
                                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                />
                            </div>

                            <div>
                                <label
                                    class="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    KIR Berlaku Sampai
                                </label>

                                <input
                                    v-model="
                                        form.kir_expired_at
                                    "
                                    type="date"
                                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- STATUS -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>

                        <select
                            v-model="form.status"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
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

                    <!-- NOTES -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Keterangan
                        </label>

                        <textarea
                            v-model="form.notes"
                            rows="3"
                            placeholder="Keterangan tambahan..."
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        ></textarea>
                    </div>

                    <!-- ACTION -->
                    <div
                        class="flex justify-end gap-3 border-t border-gray-100 pt-4"
                    >
                        <button
                            type="button"
                            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            @click="closeModal"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="saving"
                            class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {{
                                saving
                                    ? 'Menyimpan...'
                                    : 'Simpan'
                            }}
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
                <!-- HEADER -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-6 py-4"
                >
                    <div>
                        <h2
                            class="text-lg font-bold text-[#003366]"
                        >
                            Ganti Plat Nomor
                        </h2>

                        <p
                            class="mt-1 text-xs text-gray-500"
                        >
                            {{ selectedTruck?.code }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl leading-none text-gray-400 hover:text-gray-700"
                        @click="closePlateModal"
                    >
                        ×
                    </button>
                </div>

                <form
                    class="space-y-4 p-6"
                    @submit.prevent="changePlate"
                >
                    <!-- CURRENT -->
                    <div
                        class="rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                        <p class="text-xs text-gray-500">
                            Plat Saat Ini
                        </p>

                        <p
                            class="mt-1 text-xl font-bold tracking-wide text-gray-900"
                        >
                            {{
                                selectedTruck?.plate_number ||
                                '-'
                            }}
                        </p>
                    </div>

                    <!-- NEW -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Plat Baru
                        </label>

                        <input
                            v-model="
                                plateForm.new_plate_number
                            "
                            required
                            placeholder="L 8123 AB"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <!-- DATE -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Tanggal Perubahan
                        </label>

                        <input
                            v-model="plateForm.changed_at"
                            type="date"
                            required
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        />
                    </div>

                    <!-- REASON -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Alasan
                        </label>

                        <input
                            v-model="plateForm.reason"
                            placeholder="Contoh: Perubahan administrasi"
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        />
                    </div>

                    <!-- NOTES -->
                    <div>
                        <label
                            class="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Catatan
                        </label>

                        <textarea
                            v-model="plateForm.notes"
                            rows="3"
                            placeholder="Catatan tambahan..."
                            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#0052cc]"
                        ></textarea>
                    </div>

                    <!-- ACTION -->
                    <div
                        class="flex justify-end gap-3 border-t border-gray-100 pt-4"
                    >
                        <button
                            type="button"
                            class="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            @click="closePlateModal"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            :disabled="changingPlate"
                            class="rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003f9e] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {{
                                changingPlate
                                    ? 'Menyimpan...'
                                    : 'Ganti Plat'
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ========================================================= -->
        <!-- PLATE HISTORY MODAL -->
        <!-- ========================================================= -->

        <div
            v-if="showHistoryModal"
            class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
            @click.self="
                showHistoryModal = false
            "
        >
            <div
                class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl"
            >
                <!-- HEADER -->
                <div
                    class="flex items-center justify-between border-b border-gray-100 px-6 py-4"
                >
                    <div>
                        <h2
                            class="text-lg font-bold text-[#003366]"
                        >
                            Riwayat Plat
                        </h2>

                        <p
                            class="mt-1 text-xs text-gray-500"
                        >
                            {{ selectedTruck?.code }}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="text-2xl leading-none text-gray-400 hover:text-gray-700"
                        @click="
                            showHistoryModal = false
                        "
                    >
                        ×
                    </button>
                </div>

                <!-- CONTENT -->
                <div
                    class="max-h-[60vh] overflow-y-auto p-6"
                >
                    <!-- LOADING -->
                    <div
                        v-if="loadingHistory"
                        class="py-12 text-center text-sm text-gray-400"
                    >
                        Memuat riwayat...
                    </div>

                    <!-- EMPTY -->
                    <div
                        v-else-if="
                            plateHistory.length === 0
                        "
                        class="py-12 text-center"
                    >
                        <p
                            class="text-sm font-medium text-gray-500"
                        >
                            Belum ada riwayat
                            pergantian plat.
                        </p>

                        <p
                            class="mt-1 text-xs text-gray-400"
                        >
                            Histori akan muncul setelah
                            plat kendaraan diganti.
                        </p>
                    </div>

                    <!-- HISTORY -->
                    <div
                        v-else
                        class="space-y-3"
                    >
                        <div
                            v-for="history in plateHistory"
                            :key="history.id"
                            class="rounded-xl border border-gray-100 bg-gray-50 p-4"
                        >
                            <div
                                class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div
                                    class="flex items-center gap-2"
                                >
                                    <span
                                        class="font-semibold text-gray-700"
                                    >
                                        {{
                                            history.old_plate_number
                                        }}
                                    </span>

                                    <span
                                        class="text-gray-400"
                                    >
                                        →
                                    </span>

                                    <span
                                        class="font-bold text-[#0052cc]"
                                    >
                                        {{
                                            history.new_plate_number
                                        }}
                                    </span>
                                </div>

                                <span
                                    class="text-xs text-gray-400"
                                >
                                    {{
                                        formatDate(
                                            history.changed_at
                                        )
                                    }}
                                </span>
                            </div>

                            <p
                                v-if="
                                    history.reason
                                "
                                class="mt-2 text-xs text-gray-500"
                            >
                                <span
                                    class="font-medium"
                                >
                                    Alasan:
                                </span>

                                {{
                                    history.reason
                                }}
                            </p>

                            <p
                                v-if="
                                    history.notes
                                "
                                class="mt-1 text-xs text-gray-400"
                            >
                                {{
                                    history.notes
                                }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    computed,
    onMounted,
    reactive,
    ref,
} from 'vue'

import {
    erpApi,
    getApiError,
} from '@/services/api'

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const search = ref('')
const statusFilter = ref('')

const showModal = ref(false)
const showPlateModal = ref(false)
const showHistoryModal = ref(false)

const editingId = ref(null)
const selectedTruck = ref(null)

const loading = ref(false)
const saving = ref(false)
const changingPlate = ref(false)
const loadingHistory = ref(false)

const trucks = ref([])
const truckTypes = ref([])
const plateHistory = ref([])

const form = reactive({
    code: '',
    plate_number: '',
    truck_type_id: '',
    brand: '',
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

/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const availableCount = computed(() =>
    trucks.value.filter(
        truck =>
            truck.status === 'available'
    ).length
)

const inUseCount = computed(() =>
    trucks.value.filter(
        truck =>
            truck.status === 'in_use'
    ).length
)

const attentionCount = computed(() => {
    return trucks.value.filter(truck => {
        const taxDays = getDaysRemaining(
            truck.tax_expired_at
        )

        const kirDays = getDaysRemaining(
            truck.kir_expired_at
        )

        return (
            (taxDays !== null && taxDays <= 30) ||
            (kirDays !== null && kirDays <= 30)
        )
    }).length
})

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
            String(
                truck.code || ''
            )
                .toLowerCase()
                .includes(keyword) ||
            String(
                truck.plate_number || ''
            )
                .toLowerCase()
                .includes(keyword) ||
            String(
                truck.brand || ''
            )
                .toLowerCase()
                .includes(keyword) ||
            String(
                truck.model || ''
            )
                .toLowerCase()
                .includes(keyword) ||
            typeName.includes(keyword)

        const matchesStatus =
            !statusFilter.value ||
            truck.status ===
                statusFilter.value

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
    return response?.data ?? response
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

    if (
        Number.isNaN(
            expiry.getTime()
        )
    ) {
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
        : truck.truck_type?.name ||
              '-'
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
        maintenance:
            'Maintenance',
        inactive: 'Nonaktif',
    }

    return (
        labels[status] ||
        status ||
        '-'
    )
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

/*
|--------------------------------------------------------------------------
| FORM
|--------------------------------------------------------------------------
*/

function resetForm() {
    Object.assign(form, {
        code: '',
        plate_number: '',
        truck_type_id: '',
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
        plate_number:
            truck.plate_number || '',
        truck_type_id:
            truck.truck_type_id || '',
        brand: truck.brand || '',
        model: truck.model || '',
        capacity:
            truck.capacity ?? '',
        capacity_unit:
            truck.capacity_unit || '',
        tax_expired_at:
            truck.tax_expired_at || '',
        kir_expired_at:
            truck.kir_expired_at || '',
        status:
            truck.status ||
            'available',
        notes: truck.notes || '',
    })

    showModal.value = true
}

function closeModal() {
    if (saving.value) {
        return
    }

    showModal.value = false
}

/*
|--------------------------------------------------------------------------
| LOAD MASTER
|--------------------------------------------------------------------------
*/

async function loadTruckTypes() {
    try {
        const response =
            await erpApi.master.truckTypes.list(
                {
                    is_active: true,
                }
            )

        const data =
            unwrapData(response)

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
| SAVE TRUCK
|--------------------------------------------------------------------------
*/

async function saveTruck() {
    if (!form.code.trim()) {
        alert('Kode truk wajib diisi.')
        return
    }

    if (!form.plate_number.trim()) {
        alert(
            'Nomor polisi wajib diisi.'
        )
        return
    }

    if (!form.truck_type_id) {
        alert(
            'Jenis truk wajib dipilih.'
        )
        return
    }

    saving.value = true

    try {
        const payload = {
            code:
                form.code.trim(),

            plate_number:
                form.plate_number
                    .trim()
                    .toUpperCase(),

            truck_type_id:
                form.truck_type_id
                    ? Number(
                          form.truck_type_id
                      )
                    : null,

            brand:
                form.brand.trim() ||
                null,

            model:
                form.model.trim() ||
                null,

            capacity:
                form.capacity !== ''
                    ? Number(
                          form.capacity
                      )
                    : null,

            capacity_unit:
                form.capacity_unit
                    .trim() ||
                null,

            tax_expired_at:
                form.tax_expired_at ||
                null,

            kir_expired_at:
                form.kir_expired_at ||
                null,

            status: form.status,

            notes:
                form.notes.trim() ||
                null,
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

        const apiError =
            getApiError(error)

        alert(
            apiError?.message ||
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
    if (
        truck.status === 'in_use'
    ) {
        alert(
            'Truk yang sedang digunakan tidak dapat dinonaktifkan.'
        )

        return
    }

    const newStatus =
        truck.status === 'inactive'
            ? 'available'
            : 'inactive'

    try {
        const response =
            await erpApi.master.trucks.update(
                truck.id,
                {
                    status:
                        newStatus,
                }
            )

        const updatedTruck =
            unwrapData(response)

        const index =
            trucks.value.findIndex(
                item =>
                    item.id ===
                    truck.id
            )

        if (index !== -1) {
            trucks.value[index] =
                updatedTruck
        }
    } catch (error) {
        console.error(
            'Gagal mengubah status truk:',
            error
        )

        const apiError =
            getApiError(error)

        alert(
            apiError?.message ||
                'Gagal mengubah status truk.'
        )
    }
}

/*
|--------------------------------------------------------------------------
| CHANGE PLATE
|--------------------------------------------------------------------------
*/

function resetPlateForm() {
    Object.assign(
        plateForm,
        {
            new_plate_number: '',
            changed_at:
                new Date()
                    .toISOString()
                    .slice(0, 10),
            reason: '',
            notes: '',
        }
    )
}

function openChangePlate(truck) {
    selectedTruck.value =
        truck

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

    if (
        newPlate ===
        String(
            selectedTruck.value
                .plate_number || ''
        ).toUpperCase()
    ) {
        alert(
            'Plat nomor baru sama dengan plat saat ini.'
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
                        plateForm.reason
                            .trim() ||
                        null,

                    notes:
                        plateForm.notes
                            .trim() ||
                        null,
                }
            )

        const updatedTruck =
            unwrapData(response)

        const index =
            trucks.value.findIndex(
                item =>
                    item.id ===
                    selectedTruck.value
                        .id
            )

        if (index !== -1) {
            trucks.value[index] =
                updatedTruck
        }

        selectedTruck.value =
            updatedTruck

        showPlateModal.value =
            false
    } catch (error) {
        console.error(
            'Gagal mengganti plat:',
            error
        )

        const apiError =
            getApiError(error)

        alert(
            apiError?.message ||
                'Gagal mengganti plat nomor.'
        )
    } finally {
        changingPlate.value = false
    }
}

/*
|--------------------------------------------------------------------------
| PLATE HISTORY
|--------------------------------------------------------------------------
*/

async function openPlateHistory(
    truck
) {
    selectedTruck.value =
        truck

    showHistoryModal.value = true
    loadingHistory.value = true
    plateHistory.value = []

    try {
        const response =
            await erpApi.master.trucks.plateHistory(
                truck.id
            )

        const data =
            unwrapData(response)

        plateHistory.value =
            Array.isArray(data)
                ? data
                : []
    } catch (error) {
        console.error(
            'Gagal memuat riwayat plat:',
            error
        )

        alert(
            getApiError(error)?.message ||
                'Gagal memuat riwayat plat.'
        )
    } finally {
        loadingHistory.value = false
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
    ])
})
</script>