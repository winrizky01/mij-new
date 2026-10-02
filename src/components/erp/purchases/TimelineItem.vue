<template>
    <div class="relative flex gap-3">
        <div
            v-if="!last"
            class="absolute left-[7px] top-5 h-full w-px bg-gray-200"
        ></div>

        <div
            class="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2"
            :class="
                active
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 bg-white'
            "
        ></div>

        <div class="pb-3">
            <p
                class="text-sm font-semibold"
                :class="
                    active
                        ? 'text-gray-900'
                        : 'text-gray-400'
                "
            >
                {{ label }}
            </p>

            <p class="mt-1 text-xs text-gray-400">
                {{ date }}
            </p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    active: Boolean,
    date: String,
    last: Boolean,
})
</script>