<script setup>
import { computed } from 'vue'

const props = defineProps({
    block: { type: Object, default: () => ({}) },
})

const buttonClass = computed(() => ({
    primary: 'bg-[#14a2d8] text-white hover:bg-sky-600',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    outline: 'border border-[#14a2d8] text-[#14a2d8] hover:bg-sky-50',
}[props.block.variant || 'primary']))
</script>

<template>
    <div :style="{ textAlign: block.alignment || 'left' }">
        <a
            :href="block.url || '#'"
            :target="block.newTab ? '_blank' : undefined"
            :rel="block.newTab ? 'noopener noreferrer' : undefined"
            :class="[
                'inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition',
                buttonClass,
            ]"
        >
            {{ block.buttonText || 'Selengkapnya' }}
        </a>
    </div>
</template>
