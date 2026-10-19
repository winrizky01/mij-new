<script setup>
import { computed } from 'vue'
import {
    Settings2,
    Type,
    Palette,
    AlignLeft,
    Trash2,
    X,
} from 'lucide-vue-next'

const props = defineProps({
    section: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits([
    'update-section',
    'delete',
    'close',
])

const isDynamic = computed(() =>
    ['services', 'articles', 'statistics', 'contact_info'].includes(
        props.section?.type,
    )
)

const isInteractive = computed(() =>
    ['faq', 'tabs', 'contact_form', 'whatsapp', 'map_video'].includes(
        props.section?.type,
    )
)

const isColumns = computed(() => props.section?.type === 'columns')

const columnCount = computed(() =>
    Math.max(1, Math.min(6, Number(props.section?.columns) || 2))
)

const backgroundOptions = [
    { value: 'white', label: 'Putih', color: '#ffffff' },
    { value: 'light', label: 'Abu-abu muda', color: '#f3f7fa' },
    { value: 'brand', label: 'Biru MJI', color: '#14a2d8' },
    { value: 'dark', label: 'Gelap', color: '#0f172a' },
]

function update(field, value) {
    if (!props.section) return

    emit('update-section', {
        id: props.section.id,
        patch: { [field]: value },
    })
}

function updateNumber(field, value) {
    update(field, Number(value))
}
</script>

<template>
    <aside class="flex h-full min-h-0 flex-col bg-white">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div class="flex items-center gap-2">
                <Settings2 :size="18" class="text-slate-500" />
                <div>
                    <h2 class="text-sm font-bold text-slate-900">
                        Pengaturan Blok
                    </h2>
                    <p class="mt-0.5 text-[10px] text-slate-500">
                        Atur konten dan tampilan
                    </p>
                </div>
            </div>

            <button
                type="button"
                class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                title="Tutup panel"
                aria-label="Tutup panel"
                @click="emit('close')"
            >
                <X :size="17" />
            </button>
        </div>

        <div
            v-if="!section"
            class="flex flex-1 flex-col items-center justify-center px-6 text-center"
        >
            <Settings2 :size="30" class="text-slate-300" />
            <p class="mt-3 text-sm font-semibold text-slate-700">
                Belum ada blok dipilih
            </p>
            <p class="mt-1 text-xs leading-5 text-slate-500">
                Pilih blok pada preview atau struktur halaman untuk mengubah pengaturannya.
            </p>
        </div>

        <template v-else>
            <div class="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
                <!-- Identitas blok -->
                <section class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Type :size="15" class="text-sky-600" />
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Identitas
                        </h3>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Nama blok
                        </label>
                        <input
                            :value="section.name"
                            type="text"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="Nama blok"
                            @input="update('name', $event.target.value)"
                        />
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Tipe blok
                        </label>
                        <div class="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                            {{ section.type }}
                        </div>
                    </div>

                    <label class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-3">
                        <span>
                            <span class="block text-xs font-semibold text-slate-700">
                                Tampilkan blok
                            </span>
                            <span class="mt-1 block text-[10px] text-slate-500">
                                Nonaktifkan untuk menyembunyikan blok.
                            </span>
                        </span>

                        <input
                            type="checkbox"
                            :checked="section.enabled !== false"
                            class="size-4 accent-[#14a2d8]"
                            @change="update('enabled', $event.target.checked)"
                        />
                    </label>
                </section>

                <div class="border-t border-slate-100" />

                <!-- Konten -->
                <section class="space-y-3">
                    <div class="flex items-center gap-2">
                        <AlignLeft :size="15" class="text-sky-600" />
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Konten
                        </h3>
                    </div>

                    <div
                        v-if="['hero', 'services', 'articles', 'statistics', 'contact_info', 'faq', 'tabs', 'contact_form', 'whatsapp', 'map_video', 'heading', 'rich_text'].includes(section.type)"
                    >
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Eyebrow / Label kecil
                        </label>
                        <input
                            :value="section.eyebrow || ''"
                            type="text"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="Contoh: TENTANG MJI"
                            @input="update('eyebrow', $event.target.value)"
                        />
                    </div>

                    <div
                        v-if="!['spacer_divider', 'image', 'gallery'].includes(section.type)"
                    >
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Judul
                        </label>
                        <textarea
                            :value="section.title || ''"
                            rows="3"
                            class="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="Masukkan judul blok"
                            @input="update('title', $event.target.value)"
                        />
                    </div>

                    <div
                        v-if="!['spacer_divider', 'image', 'gallery', 'button'].includes(section.type)"
                    >
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Deskripsi
                        </label>
                        <textarea
                            :value="section.description || ''"
                            rows="4"
                            class="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm leading-5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="Masukkan deskripsi atau konten"
                            @input="update('description', $event.target.value)"
                        />
                    </div>

                    <template
                        v-if="['hero', 'button', 'whatsapp'].includes(section.type)"
                    >
                        <div>
                            <label class="mb-1.5 block text-xs font-medium text-slate-600">
                                Teks tombol
                            </label>
                            <input
                                :value="section.buttonText || ''"
                                type="text"
                                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                placeholder="Contoh: Hubungi Kami"
                                @input="update('buttonText', $event.target.value)"
                            />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-xs font-medium text-slate-600">
                                URL tujuan
                            </label>
                            <input
                                :value="section.buttonUrl || ''"
                                type="text"
                                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                placeholder="/kontak"
                                @input="update('buttonUrl', $event.target.value)"
                            />
                        </div>
                    </template>

                    <div v-if="['image', 'hero'].includes(section.type)">
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            URL gambar sementara
                        </label>
                        <input
                            :value="section.imageUrl || ''"
                            type="url"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            placeholder="https://..."
                            @input="update('imageUrl', $event.target.value)"
                        />
                        <p class="mt-1 text-[10px] leading-4 text-slate-400">
                            Nantinya diganti dengan pemilih gambar dari Media Library.
                        </p>
                    </div>

                    <div v-if="section.type === 'spacer_divider'">
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Tinggi jarak (px)
                        </label>
                        <input
                            :value="section.height ?? 32"
                            type="number"
                            min="0"
                            max="400"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                            @input="updateNumber('height', $event.target.value)"
                        />
                    </div>

                    <div v-if="isDynamic">
                        <div class="rounded-lg border border-sky-100 bg-sky-50 p-3">
                            <p class="text-xs font-semibold text-sky-900">
                                Sumber data dinamis
                            </p>
                            <p class="mt-1 text-[11px] leading-5 text-sky-800">
                                Pemilihan sumber data, filter, dan jumlah item akan dikonfigurasi melalui registry yang diizinkan developer.
                            </p>
                        </div>
                    </div>

                    <div v-if="isInteractive">
                        <div class="rounded-lg border border-violet-100 bg-violet-50 p-3">
                            <p class="text-xs font-semibold text-violet-900">
                                Pengaturan interaksi
                            </p>
                            <p class="mt-1 text-[11px] leading-5 text-violet-800">
                                Pengaturan khusus seperti daftar FAQ, isi tab, nomor WhatsApp, formulir, atau sumber peta/video akan ditambahkan pada konfigurasi blok.
                            </p>
                        </div>
                    </div>
                </section>

                <div class="border-t border-slate-100" />

                <!-- Pengaturan Columns -->
                <section v-if="isColumns" class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Settings2 :size="15" class="text-sky-600" />
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Struktur Kolom
                        </h3>
                    </div>

                    <div>
                        <label class="mb-2 block text-xs font-medium text-slate-600">
                            Jumlah kolom
                        </label>

                        <div class="grid grid-cols-5 gap-2">
                            <button
                                v-for="count in [2, 3, 4, 5, 6]"
                                :key="count"
                                type="button"
                                :class="[
                                    'rounded-lg border px-2 py-3 text-sm font-semibold transition',
                                    columnCount === count
                                        ? 'border-sky-400 bg-sky-50 text-sky-700'
                                        : 'border-slate-200 text-slate-600 hover:border-sky-300',
                                ]"
                                @click="update('columns', count)"
                            >
                                {{ count }}
                            </button>
                        </div>

                        <p class="mt-2 text-[11px] text-slate-500">
                            Pilih jumlah kolom. Isi tiap kolom melalui tombol tambah pada preview.
                        </p>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Jarak antar kolom (px)
                        </label>

                        <input
                            :value="section.gap ?? 16"
                            type="number"
                            min="0"
                            max="100"
                            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
                            @input="updateNumber('gap', $event.target.value)"
                        />
                    </div>
                </section>

                <!-- Tampilan -->
                <section class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Palette :size="15" class="text-sky-600" />
                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Tampilan
                        </h3>
                    </div>

                    <div>
                        <label class="mb-2 block text-xs font-medium text-slate-600">
                            Latar belakang
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                            <button
                                v-for="option in backgroundOptions"
                                :key="option.value"
                                type="button"
                                :class="[
                                    'flex items-center gap-2 rounded-lg border p-2 text-left transition',
                                    (section.background || 'white') === option.value
                                        ? 'border-sky-400 bg-sky-50'
                                        : 'border-slate-200 hover:border-slate-300',
                                ]"
                                @click="update('background', option.value)"
                            >
                                <span
                                    class="size-5 shrink-0 rounded border border-black/10"
                                    :style="{ backgroundColor: option.color }"
                                />
                                <span class="text-[11px] font-medium text-slate-700">
                                    {{ option.label }}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-medium text-slate-600">
                            Perataan konten
                        </label>
                        <div class="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
                            <button
                                v-for="alignment in [
                                    { value: 'left', label: 'Kiri' },
                                    { value: 'center', label: 'Tengah' },
                                    { value: 'right', label: 'Kanan' },
                                ]"
                                :key="alignment.value"
                                type="button"
                                :class="[
                                    'rounded-md px-2 py-2 text-xs transition',
                                    (section.alignment || 'left') === alignment.value
                                        ? 'bg-white font-semibold text-sky-700 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800',
                                ]"
                                @click="update('alignment', alignment.value)"
                            >
                                {{ alignment.label }}
                            </button>
                        </div>
                    </div>
                </section>

                <div class="border-t border-slate-200 p-4">
                    <button
                        type="button"
                        class="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                        @click="emit('delete', section.id)"
                    >
                        <Trash2 :size="14" />
                        Hapus Blok
                    </button>
                </div>
            </div>
        </template>
    </aside>
</template>
