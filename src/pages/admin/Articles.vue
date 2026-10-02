<template>
    <div class="space-y-6">
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Artikel
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Kelola artikel dan konten berita website.
                </p>
            </div>

            <button
                type="button"
                @click="openForm()"
                class="rounded-xl bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
            >
                + Tambah Artikel
            </button>
        </div>

        <!-- Search & Filter -->
        <div
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
            <div class="flex flex-col gap-3 md:flex-row">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Cari artikel..."
                    class="h-10 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <select
                    v-model="statusFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                    <option value="all">Semua Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                </select>

                <select
                    v-model="categoryFilter"
                    class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                    <option value="all">Semua Kategori</option>
                    <option
                        v-for="category in categories"
                        :key="category"
                        :value="category"
                    >
                        {{ category }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Table -->
        <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="overflow-x-auto">
                <table class="w-full min-w-[900px] text-left">
                    <thead
                        class="border-b border-gray-100 bg-gray-50"
                    >
                        <tr>
                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Artikel
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Kategori
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Status
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Penulis
                            </th>

                            <th
                                class="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                            >
                                Tanggal
                            </th>

                            <th
                                class="px-5 py-4 text-right text-xs font-semibold uppercase text-gray-500"
                            >
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">
                        <tr
                            v-for="article in filteredArticles"
                            :key="article.id"
                            class="hover:bg-gray-50"
                        >
                            <td class="px-5 py-4">
                                <div class="flex items-start gap-3">
                                    <div
                                        class="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-gray-100"
                                    >
                                        <img
                                            v-if="article.image"
                                            :src="article.image"
                                            alt=""
                                            class="h-full w-full object-cover"
                                        />

                                        <span
                                            v-else
                                            class="text-lg"
                                        >
                                            📝
                                        </span>
                                    </div>

                                    <div class="min-w-0">
                                        <p
                                            class="font-medium text-gray-900"
                                        >
                                            {{ article.title }}
                                        </p>

                                        <p
                                            class="mt-1 text-xs text-gray-400"
                                        >
                                            /{{ article.slug }}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <td
                                class="px-5 py-4 text-sm text-gray-600"
                            >
                                {{ article.category }}
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="rounded-full px-3 py-1 text-xs font-medium"
                                    :class="
                                        article.status === 'Published'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    "
                                >
                                    {{ article.status }}
                                </span>
                            </td>

                            <td
                                class="px-5 py-4 text-sm text-gray-600"
                            >
                                {{ article.author }}
                            </td>

                            <td
                                class="px-5 py-4 text-sm text-gray-500"
                            >
                                {{ article.date }}
                            </td>

                            <td class="px-5 py-4">
                                <div
                                    class="flex justify-end gap-2"
                                >
                                    <button
                                        type="button"
                                        @click="openForm(article)"
                                        class="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        @click="deleteArticle(article.id)"
                                        class="rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr
                            v-if="filteredArticles.length === 0"
                        >
                            <td
                                colspan="6"
                                class="px-5 py-12 text-center"
                            >
                                <div class="text-3xl">
                                    📝
                                </div>

                                <p
                                    class="mt-3 text-sm font-semibold text-gray-900"
                                >
                                    Artikel tidak ditemukan
                                </p>

                                <p
                                    class="mt-1 text-xs text-gray-500"
                                >
                                    Coba ubah kata pencarian atau
                                    filter.
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Form -->
        <div
            v-if="showForm"
            class="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6"
        >
            <div
                class="mb-6 flex items-start justify-between gap-4"
            >
                <div>
                    <h2
                        class="text-lg font-bold text-gray-900"
                    >
                        {{
                            editingArticle
                                ? 'Edit Artikel'
                                : 'Tambah Artikel'
                        }}
                    </h2>

                    <p
                        class="mt-1 text-sm text-gray-500"
                    >
                        {{
                            editingArticle
                                ? 'Perbarui informasi artikel.'
                                : 'Buat artikel baru untuk website.'
                        }}
                    </p>
                </div>

                <button
                    type="button"
                    @click="closeForm"
                    class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                >
                    ✕
                </button>
            </div>

            <div class="grid gap-5 lg:grid-cols-2">
                <!-- Judul -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Judul Artikel
                    </label>

                    <input
                        v-model="form.title"
                        type="text"
                        placeholder="Mengenal Layanan Trucking MJI"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />
                </div>

                <!-- Slug -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Slug
                    </label>

                    <input
                        v-model="form.slug"
                        type="text"
                        placeholder="mengenal-layanan-trucking-mji"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    />

                    <p class="text-xs text-gray-400">
                        URL:
                        /artikel/{{ form.slug || 'slug-artikel' }}
                    </p>
                </div>

                <!-- Kategori -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Kategori
                    </label>

                    <select
                        v-model="form.category"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    >
                        <option value="">
                            Pilih kategori
                        </option>

                        <option
                            v-for="category in categories"
                            :key="category"
                            :value="category"
                        >
                            {{ category }}
                        </option>
                    </select>
                </div>

                <!-- Status -->
                <div class="space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        v-model="form.status"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    >
                        <option value="Draft">
                            Draft
                        </option>

                        <option value="Published">
                            Published
                        </option>
                    </select>
                </div>

                <!-- Ringkasan -->
                <div class="lg:col-span-2 space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Ringkasan
                    </label>

                    <textarea
                        v-model="form.excerpt"
                        rows="3"
                        placeholder="Ringkasan singkat artikel..."
                        class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    ></textarea>
                </div>

                <!-- Image -->
                <div class="lg:col-span-2">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Gambar Utama
                    </label>

                    <div
                        class="mt-1.5 flex flex-col gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-4 sm:flex-row"
                    >
                        <div
                            class="grid h-24 w-36 shrink-0 place-items-center overflow-hidden rounded-lg bg-gray-100"
                        >
                            <img
                                v-if="form.image"
                                :src="form.image"
                                alt=""
                                class="h-full w-full object-cover"
                            />

                            <span
                                v-else
                                class="text-2xl"
                            >
                                🖼️
                            </span>
                        </div>

                        <div class="min-w-0 flex-1">
                            <p
                                class="text-sm font-medium text-gray-700"
                            >
                                URL Gambar
                            </p>

                            <input
                                v-model="form.image"
                                type="text"
                                placeholder="https://..."
                                class="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                            />

                            <p
                                class="mt-2 text-xs text-gray-400"
                            >
                                Nanti bisa dihubungkan ke Media
                                Library.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="lg:col-span-2 space-y-1.5">
                    <label
                        class="block text-sm font-medium text-gray-700"
                    >
                        Isi Artikel
                    </label>

                    <textarea
                        v-model="form.content"
                        rows="12"
                        placeholder="Tulis isi artikel di sini..."
                        class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
                    ></textarea>

                    <p class="text-xs text-gray-400">
                        Editor rich text seperti TipTap/Quill bisa
                        dipasang nanti.
                    </p>
                </div>
            </div>

            <!-- Form Actions -->
            <div
                class="mt-6 flex flex-col-reverse gap-2 border-t border-blue-100 pt-5 sm:flex-row sm:justify-end"
            >
                <button
                    type="button"
                    @click="closeForm"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Batal
                </button>

                <button
                    type="button"
                    @click="saveArticle"
                    class="rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3]"
                >
                    {{
                        editingArticle
                            ? 'Simpan Perubahan'
                            : 'Tambah Artikel'
                    }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const search = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const showForm = ref(false)
const editingArticle = ref(null)

const categories = [
    'Logistik',
    'Teknologi',
    'Bisnis',
    'Digital Marketing',
    'Perusahaan',
]

const articles = ref([
    {
        id: 1,
        title: 'Mengenal Layanan Trucking MJI',
        slug: 'mengenal-layanan-trucking-mji',
        category: 'Logistik',
        excerpt:
            'Mengenal layanan trucking MJI untuk kebutuhan distribusi dan pengiriman barang.',
        content:
            'Manunggal Jasa Investindo menyediakan layanan trucking untuk mendukung kebutuhan distribusi bisnis.',
        image: '',
        status: 'Published',
        author: 'Admin',
        date: '02 Okt 2026',
    },
    {
        id: 2,
        title: 'Transformasi Digital untuk Bisnis',
        slug: 'transformasi-digital-untuk-bisnis',
        category: 'Teknologi',
        excerpt:
            'Bagaimana teknologi membantu bisnis berkembang dan bekerja lebih efisien.',
        content:
            'Transformasi digital menjadi bagian penting dalam perkembangan bisnis modern.',
        image: '',
        status: 'Published',
        author: 'Admin',
        date: '28 Sep 2026',
    },
    {
        id: 3,
        title: 'Tips Mengembangkan Bisnis di Era Digital',
        slug: 'tips-mengembangkan-bisnis',
        category: 'Bisnis',
        excerpt:
            'Beberapa hal yang perlu diperhatikan bisnis dalam menghadapi perkembangan digital.',
        content:
            'Bisnis perlu beradaptasi dengan perubahan teknologi dan perilaku konsumen.',
        image: '',
        status: 'Draft',
        author: 'Admin',
        date: '25 Sep 2026',
    },
])

const form = reactive({
    id: null,
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    image: '',
    status: 'Draft',
    author: 'Admin',
})

const filteredArticles = computed(() => {
    const keyword = search.value.toLowerCase().trim()

    return articles.value.filter((article) => {
        const matchesSearch =
            !keyword ||
            article.title.toLowerCase().includes(keyword) ||
            article.slug.toLowerCase().includes(keyword) ||
            article.category.toLowerCase().includes(keyword)

        const matchesStatus =
            statusFilter.value === 'all' ||
            article.status === statusFilter.value

        const matchesCategory =
            categoryFilter.value === 'all' ||
            article.category === categoryFilter.value

        return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
        )
    })
})

function resetForm() {
    form.id = null
    form.title = ''
    form.slug = ''
    form.category = ''
    form.excerpt = ''
    form.content = ''
    form.image = ''
    form.status = 'Draft'
    form.author = 'Admin'
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

function openForm(article = null) {
    resetForm()

    if (article) {
        editingArticle.value = article

        Object.assign(form, {
            id: article.id,
            title: article.title,
            slug: article.slug,
            category: article.category,
            excerpt: article.excerpt,
            content: article.content,
            image: article.image,
            status: article.status,
            author: article.author,
        })
    } else {
        editingArticle.value = null
    }

    showForm.value = true
}

function closeForm() {
    showForm.value = false
    editingArticle.value = null
    resetForm()
}

function saveArticle() {
    if (!form.title.trim()) {
        alert('Judul artikel wajib diisi.')
        return
    }

    if (!form.category) {
        alert('Kategori artikel wajib dipilih.')
        return
    }

    if (!form.slug.trim()) {
        form.slug = generateSlug(form.title)
    }

    if (editingArticle.value) {
        Object.assign(
            editingArticle.value,
            JSON.parse(JSON.stringify(form))
        )

        editingArticle.value.date = new Date().toLocaleDateString(
            'id-ID',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        )
    } else {
        articles.value.unshift({
            ...JSON.parse(JSON.stringify(form)),
            id: Date.now(),
            date: new Date().toLocaleDateString(
                'id-ID',
                {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }
            ),
        })
    }

    closeForm()
}

function deleteArticle(id) {
    const confirmed = confirm(
        'Apakah kamu yakin ingin menghapus artikel ini?'
    )

    if (!confirmed) return

    articles.value = articles.value.filter(
        (article) => article.id !== id
    )
}
</script>