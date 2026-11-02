
<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps({
    title: { type: String, default: '' },
    eyebrow: { type: String, default: '' },
    description: { type: String, default: '' },
    content: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imagePosition: { type: String, default: 'right' },
    alignment: { type: String, default: 'left' },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#1f2937' },
    paddingTop: { type: Number, default: 48 },
    paddingBottom: { type: Number, default: 48 },
})

const hasImage = computed(() => Boolean(props.imageUrl))

const isHtml = computed(() =>
    /<[a-z][\s\S]*>/i.test(props.content || '')
)

const safeContent = computed(() =>
    isHtml.value
        ? DOMPurify.sanitize(props.content)
        : ''
)

const layoutClass = computed(() =>
    props.imagePosition === 'left'
        ? 'md:flex-row-reverse'
        : 'md:flex-row'
)

const alignmentClass = computed(() => ({
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
}[props.alignment] || 'text-left'))
</script>

<template>
    <section
        :style="{
            backgroundColor,
            color: textColor,
            paddingTop: `${paddingTop}px`,
            paddingBottom: `${paddingBottom}px`,
        }"
    >
        <div
            class="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 sm:px-6 lg:px-8"
            :class="hasImage ? layoutClass : ''"
        >
            <div
                class="w-full"
                :class="hasImage ? 'md:w-1/2' : 'max-w-4xl'"
            >
                <p
                    v-if="eyebrow"
                    class="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-600"
                    :class="alignmentClass"
                >
                    {{ eyebrow }}
                </p>

                <h2
                    v-if="title"
                    class="text-2xl font-bold sm:text-3xl"
                    :class="alignmentClass"
                >
                    {{ title }}
                </h2>

                <p
                    v-if="description"
                    class="mt-4 text-lg leading-relaxed opacity-80"
                    :class="alignmentClass"
                >
                    {{ description }}
                </p>

                <div
                    v-if="content"
                    class="mt-5 leading-8"
                    :class="alignmentClass"
                >
                    <div
                        v-if="isHtml"
                        class="rich-content"
                        v-html="safeContent"
                    />

                    <p
                        v-else
                        class="whitespace-pre-line"
                    >
                        {{ content }}
                    </p>
                </div>
            </div>

            <div
                v-if="hasImage"
                class="w-full md:w-1/2"
            >
                <img
                    :src="imageUrl"
                    :alt="title || 'Ilustrasi'"
                    class="max-h-[520px] w-full rounded-2xl object-cover"
                    loading="lazy"
                />
            </div>
        </div>
    </section>
</template>

<style scoped>
.rich-content :deep(p) {
    margin-bottom: 0.75rem;
}

.rich-content :deep(h1) {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
}

.rich-content :deep(h2) {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
}

.rich-content :deep(h3) {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
}

.rich-content :deep(ul) {
    list-style: disc;
    padding-left: 1.5rem;
}

.rich-content :deep(ol) {
    list-style: decimal;
    padding-left: 1.5rem;
}

.rich-content :deep(blockquote) {
    border-left: 4px solid #14a2d8;
    padding-left: 1rem;
    margin: 1rem 0;
}

.rich-content :deep(a) {
    color: #14a2d8;
    text-decoration: underline;
}

.rich-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.75rem;
}
</style>