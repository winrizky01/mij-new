<script setup>
import {
    ArrowLeft,
    Eye,
    Monitor,
    Smartphone,
    Tablet,
    Save,
    Check,
    LoaderCircle,
} from 'lucide-vue-next'

defineProps({
    pageTitle: {
        type: String,
        default: 'Beranda',
    },
    previewMode: {
        type: String,
        default: 'desktop',
    },
    isPreviewMode: {
        type: Boolean,
        default: false,
    },
    isSaving: {
        type: Boolean,
        default: false,
    },
    saveMessage: {
        type: String,
        default: '',
    },
})

const emit = defineEmits([
    'back',
    'save',
    'toggle-preview',
    'change-preview-mode',
])
</script>

<template>
    <header
        class="sticky top-0 z-40 flex min-h-[68px] flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3"
    >
        <div class="flex items-center gap-3">
            <button
                type="button"
                title="Kembali"
                class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                @click="emit('back')"
            >
                <ArrowLeft :size="19" />
            </button>

            <div>
                <div class="flex flex-wrap items-center gap-2">
                    <h1 class="text-sm font-bold text-slate-900">
                        Website Builder
                    </h1>

                    <span
                        class="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Draft
                    </span>
                </div>

                <p class="mt-0.5 text-xs text-slate-500">
                    Mengedit: {{ pageTitle }}
                </p>
            </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <span
                v-if="saveMessage"
                class="hidden items-center gap-1 text-xs text-emerald-600 sm:flex"
            >
                <Check :size="14" />
                {{ saveMessage }}
            </span>

            <div class="flex items-center rounded-lg border border-slate-200 p-1">
                <button
                    v-for="mode in [
                        { value: 'desktop', label: 'Desktop', icon: Monitor },
                        { value: 'tablet', label: 'Tablet', icon: Tablet },
                        { value: 'mobile', label: 'Mobile', icon: Smartphone },
                    ]"
                    :key="mode.value"
                    type="button"
                    :title="mode.label"
                    :aria-label="mode.label"
                    :class="[
                        'rounded-md p-2 transition',
                        previewMode === mode.value
                            ? 'bg-sky-50 text-sky-700'
                            : 'text-slate-500 hover:bg-slate-50',
                    ]"
                    @click="emit('change-preview-mode', mode.value)"
                >
                    <component :is="mode.icon" :size="16" />
                </button>
            </div>

            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                @click="emit('toggle-preview')"
            >
                <Eye :size="16" />
                <span class="hidden sm:inline">
                    {{ isPreviewMode ? 'Edit Layout' : 'Preview' }}
                </span>
            </button>

            <button
                type="button"
                :disabled="isSaving"
                class="inline-flex items-center gap-2 rounded-lg bg-[#14a2d8] px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                @click="emit('save')"
            >
                <LoaderCircle
                    v-if="isSaving"
                    :size="16"
                    class="animate-spin"
                />
                <Save v-else :size="16" />

                {{ isSaving ? 'Menyimpan...' : 'Simpan Draft' }}
            </button>
        </div>
    </header>
</template>
