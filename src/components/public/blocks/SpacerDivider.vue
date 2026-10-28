
<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'spacer' },
  height: { type: [Number, String], default: 40 },
  marginTop: { type: [Number, String], default: 16 },
  marginBottom: { type: [Number, String], default: 16 },
  color: { type: String, default: '#e5e7eb' },
  thickness: { type: [Number, String], default: 1 },
  width: { type: String, default: 'full' },
})

function cssSize(value) {
  return typeof value === 'number'
    ? `${value}px`
    : value
}

const spacerStyle = computed(() => ({
  height: cssSize(props.height),
  marginTop: cssSize(props.marginTop),
  marginBottom: cssSize(props.marginBottom),
}))

const dividerWidth = computed(() => ({
  full: 'w-full',
  wide: 'w-3/4',
  medium: 'w-1/2',
  short: 'w-1/4',
}[props.width] || 'w-full'))
</script>

<template>
  <div
    v-if="variant === 'spacer'"
    aria-hidden="true"
    :style="spacerStyle"
  />

  <div
    v-else-if="variant === 'divider'"
    class="flex justify-center px-6"
    :style="{
      marginTop: cssSize(marginTop),
      marginBottom: cssSize(marginBottom),
    }"
  >
    <hr
      :class="dividerWidth"
      :style="{
        border: 'none',
        height: cssSize(thickness),
        backgroundColor: color,
      }"
    />
  </div>
</template>
