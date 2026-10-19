<script setup>
import {
    Layers3,
    Eye,
    EyeOff,
    ChevronUp,
    ChevronDown,
    Trash2,
    GripVertical,
} from 'lucide-vue-next'

defineProps({
    sections: {
        type: Array,
        default: () => [],
    },
    selectedSectionId: {
        type: [String, Number],
        default: null,
    },
})

const emit = defineEmits([
    'select',
    'toggle',
    'move',
    'delete',
])

function blockLabel(section) {
    return section.name || section.label || section.type || 'Blok'
}
</script>

<template>
    <aside class="flex h-full min-h-0 flex-col bg-white">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div>
                <h2 class="text-sm font-bold text-slate-900">
                    Struktur Halaman
                </h2>
                <p class="mt-1 text-xs text-slate-500">
                    {{ sections.length }} blok
                </p>
            </div>

            <Layers3 :size="18" class="text-slate-400" />
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto p-3">
            <div
                v-if="sections.length === 0"
                class="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center"
            >
                <Layers3 :size="25" class="mx-auto text-slate-300" />
                <p class="mt-3 text-sm font-medium text-slate-700">
                    Halaman masih kosong
                </p>
                <p class="mt-1 text-xs leading-5 text-slate-500">
                    Tambahkan blok dari panel komponen.
                </p>
            </div>

            <div v-else class="space-y-1.5">
                <div
                    v-for="(section, index) in sections"
                    :key="section.id"
                    :class="[
                        'group rounded-xl border transition',
                        selectedSectionId === section.id
                            ? 'border-sky-300 bg-sky-50'
                            : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
                        !section.enabled && 'opacity-60',
                    ]"
                >
                    <div class="flex min-w-0 items-center gap-1 p-1.5">
                        <!-- DRAG HANDLE -->
                        <span class="shrink-0 cursor-grab rounded p-1 text-slate-300">
                            <GripVertical :size="15" />
                        </span>

                        <!-- NAMA BLOK -->
                        <button
                            type="button"
                            class="min-w-0 flex-1 py-1 text-left"
                            @click="emit('select', section)"
                        >
                            <span class="block truncate text-xs font-semibold text-slate-800">
                                {{ blockLabel(section) }}
                            </span>
                            <span class="mt-0.5 block truncate text-[10px] text-slate-400">
                                {{ section.type }}
                            </span>
                        </button>

                        <!-- TOMBOL AKSI -->
                        <div class="flex shrink-0 items-center gap-0">
                            <button
                                type="button"
                                class="rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30"
                                title="Pindah ke atas"
                                :disabled="index === 0"
                                @click="emit('move', { id: section.id, direction: -1 })"
                            >
                                <ChevronUp :size="14" />
                            </button>

                            <button
                                type="button"
                                class="rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30"
                                title="Pindah ke bawah"
                                :disabled="index === sections.length - 1"
                                @click="emit('move', { id: section.id, direction: 1 })"
                            >
                                <ChevronDown :size="14" />
                            </button>

                            <button
                                type="button"
                                class="rounded-md p-1 text-slate-400 hover:bg-white hover:text-sky-700"
                                :title="section.enabled ? 'Sembunyikan blok' : 'Tampilkan blok'"
                                @click="emit('toggle', section.id)"
                            >
                                <Eye v-if="section.enabled" :size="14" />
                                <EyeOff v-else :size="14" />
                            </button>

                            <button
                                type="button"
                                class="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                title="Hapus blok"
                                @click="emit('delete', section.id)"
                            >
                                <Trash2 :size="14" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-slate-100 px-4 py-3">
            <p class="text-[10px] leading-4 text-slate-400">
                Pilih blok untuk mengedit pengaturan. Gunakan panah untuk mengubah urutan.
            </p>
        </div>
    </aside>
</template>
