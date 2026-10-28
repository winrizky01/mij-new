<template>
    <section
        class="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
    >
        <div class="mx-auto max-w-7xl">
            <!-- Header -->
            <div
                v-if="title || eyebrow || description"
                class="mb-10"
                :class="
                    alignment === 'center'
                        ? 'text-center'
                        : alignment === 'right'
                            ? 'text-right'
                            : 'text-left'
                "
            >
                <p
                    v-if="eyebrow"
                    class="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600"
                >
                    {{ eyebrow }}
                </p>

                <h2
                    v-if="title"
                    class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
                >
                    {{ title }}
                </h2>

                <p
                    v-if="description"
                    class="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg"
                    :class="{
                        'mx-auto': alignment === 'center',
                        'ml-auto mr-0': alignment === 'right',
                        'ml-0 mr-auto': alignment === 'left',
                    }"
                >
                    {{ description }}
                </p>
            </div>

            <!-- Empty State -->
            <div
                v-if="galleryImages.length === 0"
                class="rounded-xl border-2 border-dashed border-gray-200 px-6 py-16 text-center"
            >
                <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                >
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                </svg>

                <p class="mt-4 font-medium text-gray-700">
                    Belum ada gambar galeri
                </p>
                <p class="mt-1 text-sm text-gray-500">
                    Tambahkan gambar melalui pengaturan blok di admin.
                </p>
            </div>

            <!-- Gallery Grid -->
            <div
                v-else
                class="grid gap-4 sm:gap-5"
                :class="gridClass"
            >
                <button
                    v-for="(image, index) in galleryImages"
                    :key="image.id ?? `${image.src}-${index}`"
                    type="button"
                    class="group relative block w-full overflow-hidden rounded-xl bg-gray-100 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50"
                    :class="[
                        imageHeightClass,
                        { 'sm:col-span-2 sm:row-span-2': isFeatured(index) },
                    ]"
                    :aria-label="`Lihat gambar ${image.title || index + 1}`"
                    @click="openImage(index)"
                >
                    <img
                        :src="image.src"
                        :alt="image.alt || image.title || `Galeri ${index + 1}`"
                        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    <!-- Hover Overlay -->
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-70 transition duration-300 group-hover:opacity-100"
                    />

                    <!-- Image Information -->
                    <div
                        v-if="image.title || image.description"
                        class="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5"
                    >
                        <h3
                            v-if="image.title"
                            class="text-base font-semibold sm:text-lg"
                        >
                            {{ image.title }}
                        </h3>

                        <p
                            v-if="image.description"
                            class="mt-1 line-clamp-2 text-sm text-white/80"
                        >
                            {{ image.description }}
                        </p>
                    </div>

                    <!-- Zoom Icon -->
                    <div
                        class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100"
                    >
                        <svg
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4M11 8v6M8 11h6" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>

        <!-- Lightbox Modal -->
        <Teleport to="body">
            <Transition name="gallery-modal">
                <div
                    v-if="selectedIndex !== null"
                    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Pratinjau gambar galeri"
                    @click.self="closeImage"
                    @keydown.esc="closeImage"
                    @keydown.left="previousImage"
                    @keydown.right="nextImage"
                >
                    <!-- Close -->
                    <button
                        type="button"
                        class="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Tutup galeri"
                        @click="closeImage"
                    >
                        <svg
                            class="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="m18 6-12 12M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Previous -->
                    <button
                        v-if="galleryImages.length > 1"
                        type="button"
                        class="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
                        aria-label="Gambar sebelumnya"
                        @click.stop="previousImage"
                    >
                        <svg
                            class="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>

                    <!-- Selected Image -->
                    <div
                        v-if="activeImage"
                        class="flex max-h-full max-w-6xl flex-col items-center"
                    >
                        <img
                            :key="activeImage.src"
                            :src="activeImage.src"
                            :alt="activeImage.alt || activeImage.title || 'Gambar galeri'"
                            class="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
                        />

                        <div
                            v-if="activeImage.title || activeImage.description"
                            class="mt-5 max-w-3xl text-center text-white"
                        >
                            <h3
                                v-if="activeImage.title"
                                class="text-lg font-semibold sm:text-xl"
                            >
                                {{ activeImage.title }}
                            </h3>

                            <p
                                v-if="activeImage.description"
                                class="mt-2 text-sm leading-6 text-white/75"
                            >
                                {{ activeImage.description }}
                            </p>
                        </div>

                        <p class="mt-3 text-xs text-white/50">
                            {{ selectedIndex + 1 }} / {{ galleryImages.length }}
                        </p>
                    </div>

                    <!-- Next -->
                    <button
                        v-if="galleryImages.length > 1"
                        type="button"
                        class="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
                        aria-label="Gambar berikutnya"
                        @click.stop="nextImage"
                    >
                        <svg
                            class="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </Transition>
        </Teleport>
    </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Galeri',
    },
    eyebrow: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    images: {
        type: Array,
        default: () => [],
    },
    items: {
        type: Array,
        default: () => [],
    },
    columns: {
        type: [Number, String],
        default: 3,
    },
    alignment: {
        type: String,
        default: 'left',
    },
    imageHeight: {
        type: String,
        default: 'medium',
    },
    featuredFirst: {
        type: Boolean,
        default: false,
    },
    limit: {
        type: Number,
        default: 0,
    },
})

const selectedIndex = ref(null)

const galleryImages = computed(() => {
    const source = props.images.length
        ? props.images
        : props.items

    const normalized = source
        .map((item) => {
            if (typeof item === 'string') {
                return {
                    src: item,
                    alt: '',
                    title: '',
                    description: '',
                }
            }

            return {
                id: item.id,
                src:
                    item.imageUrl ||
                    item.image_url ||
                    item.url ||
                    item.src ||
                    item.path ||
                    '',
                alt: item.alt || '',
                title: item.title || item.name || '',
                description: item.description || '',
            }
        })
        .filter((item) => item.src)

    return props.limit > 0
        ? normalized.slice(0, props.limit)
        : normalized
})

const gridClass = computed(() => {
    const columns = Math.min(
        4,
        Math.max(1, Number(props.columns) || 3),
    )

    const classes = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }

    return classes[columns]
})

const imageHeightClass = computed(() => {
    const classes = {
        small: 'h-48 sm:h-56',
        medium: 'h-64 sm:h-72',
        large: 'h-72 sm:h-96',
    }

    return classes[props.imageHeight] || classes.medium
})

const activeImage = computed(() => {
    if (selectedIndex.value === null) return null

    return galleryImages.value[selectedIndex.value] ?? null
})

function isFeatured(index) {
    return props.featuredFirst && index === 0
}

function openImage(index) {
    selectedIndex.value = index
}

function closeImage() {
    selectedIndex.value = null
}

function previousImage() {
    const total = galleryImages.value.length

    if (total <= 1 || selectedIndex.value === null) return

    selectedIndex.value =
        (selectedIndex.value - 1 + total) % total
}

function nextImage() {
    const total = galleryImages.value.length

    if (total <= 1 || selectedIndex.value === null) return

    selectedIndex.value =
        (selectedIndex.value + 1) % total
}

function handleKeydown(event) {
    if (selectedIndex.value === null) return

    if (event.key === 'Escape') closeImage()
    if (event.key === 'ArrowLeft') previousImage()
    if (event.key === 'ArrowRight') nextImage()
}

watch(
    () => galleryImages.value.length,
    (length) => {
        if (selectedIndex.value !== null && selectedIndex.value >= length) {
            closeImage()
        }
    },
)

watch(selectedIndex, (index) => {
    document.body.style.overflow =
        index === null ? '' : 'hidden'
})

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.gallery-modal-enter-active,
.gallery-modal-leave-active {
    transition: opacity 0.25s ease;
}

.gallery-modal-enter-from,
.gallery-modal-leave-to {
    opacity: 0;
}
</style>