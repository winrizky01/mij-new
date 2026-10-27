<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Artikel Website</h1>
        <p class="mt-1 text-sm text-gray-500">
          Kelola artikel, kategori, dan konten website.
        </p>
      </div>

      <button
        type="button"
        class="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        @click="openCreateModal"
      >
        + Tambah Artikel
      </button>
    </div>

    <!-- Feedback -->
    <div
      v-if="successMessage"
      class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
    >
      {{ successMessage }}
    </div>

    <div
      v-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <!-- Filters -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          v-model="searchInput"
          type="search"
          placeholder="Cari judul artikel..."
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 md:col-span-2"
        />

        <select
          v-model="filters.category_id"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          @change="applyFilters"
        >
          <option value="">Semua kategori</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="String(category.id)"
          >
            {{ category.name }}
          </option>
        </select>

        <select
          v-model="filters.status"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          @change="applyFilters"
        >
          <option value="">Semua status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>

    <!-- Article table -->
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[850px] text-left text-sm">
          <thead class="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th class="px-5 py-4">Artikel</th>
              <th class="px-5 py-4">Kategori</th>
              <th class="px-5 py-4">Status</th>
              <th class="px-5 py-4">Tanggal</th>
              <th class="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading">
              <td colspan="5" class="px-5 py-12 text-center text-gray-500">
                Memuat artikel...
              </td>
            </tr>

            <tr v-else-if="articles.length === 0">
              <td colspan="5" class="px-5 py-12 text-center text-gray-500">
                Belum ada artikel yang sesuai.
              </td>
            </tr>

            <template v-else>
              <tr
                v-for="article in articles"
                :key="article.id"
                class="hover:bg-gray-50"
              >
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="article.featured_image_url"
                      :src="article.featured_image_url"
                      :alt="article.title"
                      class="h-14 w-20 rounded-lg border border-gray-200 object-cover"
                    />

                    <div
                      v-else
                      class="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400"
                    >
                      <span class="text-xs">No image</span>
                    </div>

                    <div class="min-w-0">
                      <p class="font-semibold text-gray-900">
                        {{ article.title }}
                      </p>
                      <p class="mt-1 max-w-md truncate text-xs text-gray-500">
                        {{ article.slug }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-4 text-gray-600">
                  {{ article.category_name || 'Tanpa kategori' }}
                </td>

                <td class="px-5 py-4">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="statusClass(article.status)"
                  >
                    {{ statusLabel(article.status) }}
                  </span>
                </td>

                <td class="px-5 py-4 text-gray-500">
                  {{ formatDate(article.updated_at || article.created_at) }}
                </td>

                <td class="px-5 py-4">
                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      @click="openEditModal(article)"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      @click="openDeleteModal(article)"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-gray-500">
          Menampilkan {{ articles.length }} artikel dari {{ pagination.total }}
          data
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="loading || pagination.current_page <= 1"
            @click="changePage(pagination.current_page - 1)"
          >
            Sebelumnya
          </button>

          <span class="px-2 text-sm text-gray-600">
            {{ pagination.current_page }} / {{ pagination.last_page }}
          </span>

          <button
            type="button"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="loading || pagination.current_page >= pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>

    <!-- ARTICLE CREATE / EDIT MODAL -->
    <div
      v-if="showArticleModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      @click.self="closeArticleModal"
      @keydown.esc="closeArticleModal"
    >
      <div
        class="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
      >
        <!-- Modal header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-7">
          <div>
            <h2 id="article-modal-title" class="text-xl font-bold text-gray-900">
              {{ editingArticle ? 'Edit Artikel' : 'Tambah Artikel' }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              Kelola informasi dan isi artikel di sini.
            </p>
          </div>

          <button
            type="button"
            class="rounded-lg p-2 text-xl text-gray-500 hover:bg-gray-100"
            aria-label="Tutup modal"
            @click="closeArticleModal"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="saveArticle">
          <div class="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
            <div
              v-if="formError"
              class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {{ formError }}
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <!-- Main article fields -->
              <div class="space-y-5 lg:col-span-2">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">
                    Judul artikel <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.title"
                    required
                    maxlength="255"
                    type="text"
                    placeholder="Masukkan judul artikel"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    @input="handleTitleInput"
                  />
                  <p v-if="errors.title" class="mt-1 text-xs text-red-600">
                    {{ errors.title }}
                  </p>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">
                    Slug / URL
                  </label>
                  <input
                    v-model="form.slug"
                    type="text"
                    placeholder="judul-artikel"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    @input="slugTouched = true"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    URL artikel: /artikel/{{ form.slug || 'judul-artikel' }}
                  </p>
                  <p v-if="errors.slug" class="mt-1 text-xs text-red-600">
                    {{ errors.slug }}
                  </p>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">
                    Ringkasan artikel
                  </label>
                  <textarea
                    v-model="form.excerpt"
                    rows="3"
                    placeholder="Ringkasan singkat untuk halaman daftar artikel..."
                    class="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <p v-if="errors.excerpt" class="mt-1 text-xs text-red-600">
                    {{ errors.excerpt }}
                  </p>
                </div>

                <!-- Rich text editor -->
                <div>
                  <div class="mb-2 flex items-center justify-between gap-3">
                    <label class="block text-sm font-semibold text-gray-800">
                      Isi artikel <span class="text-red-500">*</span>
                    </label>
                    <span class="text-xs text-gray-400">Rich text editor</span>
                  </div>

                  <!-- Toolbar -->
                  <div class="rounded-t-xl border border-gray-300 bg-gray-50 p-2">
                    <div class="flex flex-wrap items-center gap-1">
                      <select
                        aria-label="Format paragraf"
                        class="h-9 max-w-36 rounded-md border border-gray-300 bg-white px-2 text-sm"
                        :value="activeBlock"
                        @change="setBlock($event.target.value)"
                      >
                        <option value="paragraph">Paragraf</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="blockquote">Kutipan</option>
                      </select>

                      <select
                        aria-label="Jenis font"
                        class="h-9 max-w-36 rounded-md border border-gray-300 bg-white px-2 text-sm"
                        @change="setFontFamily($event.target.value)"
                      >
                        <option value="">Font default</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Verdana">Verdana</option>
                        <option value="'Times New Roman'">Times New Roman</option>
                      </select>

                      <select
                        aria-label="Ukuran font"
                        class="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
                        @change="setFontSize($event.target.value)"
                      >
                        <option value="">Ukuran</option>
                        <option value="12px">12</option>
                        <option value="14px">14</option>
                        <option value="16px">16</option>
                        <option value="18px">18</option>
                        <option value="24px">24</option>
                        <option value="32px">32</option>
                      </select>

                      <div class="mx-1 hidden h-7 border-l border-gray-300 sm:block" />

                      <button
                        type="button"
                        title="Tebal"
                        class="toolbar-button"
                        :class="{ 'toolbar-active': isActive('bold') }"
                        @click="runEditorCommand('toggleBold')"
                      >
                        <strong>B</strong>
                      </button>

                      <button
                        type="button"
                        title="Miring"
                        class="toolbar-button italic"
                        :class="{ 'toolbar-active': isActive('italic') }"
                        @click="runEditorCommand('toggleItalic')"
                      >
                        I
                      </button>

                      <button
                        type="button"
                        title="Garis bawah"
                        class="toolbar-button underline"
                        :class="{ 'toolbar-active': isActive('underline') }"
                        @click="runEditorCommand('toggleUnderline')"
                      >
                        U
                      </button>

                      <button
                        type="button"
                        title="Coret"
                        class="toolbar-button line-through"
                        :class="{ 'toolbar-active': isActive('strike') }"
                        @click="runEditorCommand('toggleStrike')"
                      >
                        S
                      </button>

                      <button
                        type="button"
                        title="Huruf kapital"
                        class="toolbar-button"
                        @click="uppercaseSelection"
                      >
                        AA
                      </button>

                      <button
                        type="button"
                        title="Hapus format"
                        class="toolbar-button"
                        @click="clearFormatting"
                      >
                        Tx
                      </button>

                      <label
                        title="Warna teks"
                        class="flex h-9 cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-2 text-xs hover:bg-gray-100"
                      >
                        <span class="font-medium">Warna</span>
                        <input
                          type="color"
                          class="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                          @input="setTextColor($event.target.value)"
                        />
                      </label>

                      <div class="mx-1 hidden h-7 border-l border-gray-300 sm:block" />

                      <button
                        type="button"
                        title="Rata kiri"
                        class="toolbar-button"
                        :class="{ 'toolbar-active': isTextAlign('left') }"
                        @click="setTextAlign('left')"
                      >
                        ≡
                      </button>

                      <button
                        type="button"
                        title="Rata tengah"
                        class="toolbar-button"
                        :class="{ 'toolbar-active': isTextAlign('center') }"
                        @click="setTextAlign('center')"
                      >
                        ≡
                      </button>

                      <button
                        type="button"
                        title="Rata kanan"
                        class="toolbar-button"
                        :class="{ 'toolbar-active': isTextAlign('right') }"
                        @click="setTextAlign('right')"
                      >
                        ≡
                      </button>

                      <button
                        type="button"
                        title="Rata kiri-kanan"
                        class="toolbar-button"
                        :class="{ 'toolbar-active': isTextAlign('justify') }"
                        @click="setTextAlign('justify')"
                      >
                        ☰
                      </button>

                      <button
                        type="button"
                        title="Daftar bullet"
                        class="toolbar-button"
                        :class="{ 'toolbar-active': isActive('bulletList') }"
                        @click="runEditorCommand('toggleBulletList')"
                      >
                        •≡
                      </button>

                      <button
                        type="button"
                        title="Daftar bernomor"
                        class="toolbar-button"
                        :class="{ 'toolbar-active': isActive('orderedList') }"
                        @click="runEditorCommand('toggleOrderedList')"
                      >
                        1.
                      </button>

                      <button
                        type="button"
                        title="Tambah tautan"
                        class="toolbar-button"
                        @click="promptLink"
                      >
                        Link
                      </button>

                      <button
                        type="button"
                        title="Masukkan gambar dari Media Library"
                        class="toolbar-button"
                        @click="openEditorMedia"
                      >
                        Gambar
                      </button>

                      <button
                        type="button"
                        title="Garis pemisah"
                        class="toolbar-button"
                        @click="runEditorCommand('setHorizontalRule')"
                      >
                        —
                      </button>
                    </div>
                  </div>

                  <div
                    class="article-editor rounded-b-xl border-x border-b border-gray-300"
                    :class="{ 'border-red-400': errors.content }"
                  >
                    <EditorContent
                      v-if="editor"
                      :editor="editor"
                    />
                    <div
                      v-else
                      class="min-h-64 p-4 text-sm text-gray-400"
                    >
                      Menyiapkan editor...
                    </div>
                  </div>

                  <p v-if="errors.content" class="mt-1 text-xs text-red-600">
                    {{ errors.content }}
                  </p>
                </div>
              </div>

              <!-- Sidebar fields -->
              <div class="space-y-5">
                <div class="rounded-xl border border-gray-200 p-4">
                  <h3 class="mb-3 font-semibold text-gray-800">
                    Publikasi
                  </h3>

                  <label class="mb-1.5 block text-sm font-medium text-gray-700">
                    Status artikel
                  </label>
                  <select
                    v-model="form.status"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-sky-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <p v-if="errors.status" class="mt-1 text-xs text-red-600">
                    {{ errors.status }}
                  </p>
                </div>

                <div class="rounded-xl border border-gray-200 p-4">
                  <div class="mb-3 flex items-center justify-between gap-2">
                    <h3 class="font-semibold text-gray-800">Kategori</h3>
                    <button
                      type="button"
                      class="text-xs font-semibold text-sky-600 hover:text-sky-800"
                      @click="openCategoryModal"
                    >
                      + Kategori
                    </button>
                  </div>

                  <select
                    v-model="form.category_id"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-sky-500"
                  >
                    <option value="">Tanpa kategori</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="String(category.id)"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                  <p v-if="errors.category_id" class="mt-1 text-xs text-red-600">
                    {{ errors.category_id }}
                  </p>
                </div>

                <div class="rounded-xl border border-gray-200 p-4">
                  <div class="mb-3 flex items-center justify-between gap-2">
                    <h3 class="font-semibold text-gray-800">Gambar utama</h3>
                    <button
                      type="button"
                      class="text-xs font-semibold text-sky-600 hover:text-sky-800"
                      @click="openFeaturedMedia"
                    >
                      Pilih media
                    </button>
                  </div>

                  <div
                    v-if="form.featured_image_url"
                    class="relative overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      :src="form.featured_image_url"
                      alt="Preview gambar utama"
                      class="aspect-video w-full object-cover"
                    />
                    <button
                      type="button"
                      class="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
                      @click="removeFeaturedImage"
                    >
                      Hapus gambar
                    </button>
                  </div>

                  <button
                    v-else
                    type="button"
                    class="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-sky-400 hover:bg-sky-50"
                    @click="openFeaturedMedia"
                  >
                    <span class="text-2xl">＋</span>
                    Pilih gambar utama
                  </button>

                  <p class="mt-2 text-xs text-gray-500">
                    Gunakan Media Library untuk memilih gambar.
                  </p>
                  <p
                    v-if="errors.featured_image"
                    class="mt-1 text-xs text-red-600"
                  >
                    {{ errors.featured_image }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="flex flex-col-reverse justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:px-7">
            <p class="text-xs text-gray-500">
              {{ editingArticle ? 'Perubahan belum tersimpan.' : 'Artikel belum disimpan.' }}
            </p>

            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                :disabled="saving"
                @click="closeArticleModal"
              >
                Batal
              </button>

              <button
                type="submit"
                class="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="saving"
              >
                {{ saving ? 'Menyimpan...' : editingArticle ? 'Simpan Perubahan' : 'Simpan Artikel' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- CATEGORY MODAL -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeCategoryModal"
      @keydown.esc="closeCategoryModal"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
      >
        <div class="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="category-modal-title" class="text-xl font-bold text-gray-900">
              Tambah Kategori
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              Kategori baru dapat langsung digunakan pada artikel.
            </p>
          </div>

          <button
            type="button"
            class="rounded-lg p-2 text-xl text-gray-500 hover:bg-gray-100"
            @click="closeCategoryModal"
          >
            &times;
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="saveCategory">
          <div
            v-if="categoryError"
            class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {{ categoryError }}
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Nama kategori <span class="text-red-500">*</span>
            </label>
            <input
              v-model="categoryForm.name"
              required
              maxlength="255"
              type="text"
              placeholder="Contoh: Tips dan Informasi"
              class="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              @input="handleCategoryNameInput"
            />
            <p v-if="categoryErrors.name" class="mt-1 text-xs text-red-600">
              {{ categoryErrors.name }}
            </p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Slug kategori
            </label>
            <input
              v-model="categoryForm.slug"
              type="text"
              placeholder="tips-dan-informasi"
              class="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              @input="categorySlugTouched = true"
            />
            <p v-if="categoryErrors.slug" class="mt-1 text-xs text-red-600">
              {{ categoryErrors.slug }}
            </p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea
              v-model="categoryForm.description"
              rows="3"
              placeholder="Deskripsi kategori (opsional)"
              class="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              :disabled="savingCategory"
              @click="closeCategoryModal"
            >
              Batal
            </button>

            <button
              type="submit"
              class="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
              :disabled="savingCategory"
            >
              {{ savingCategory ? 'Menyimpan...' : 'Simpan Kategori' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeDeleteModal"
      @keydown.esc="closeDeleteModal"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <span class="text-xl">!</span>
        </div>

        <h2 id="delete-modal-title" class="text-xl font-bold text-gray-900">
          Hapus artikel?
        </h2>

        <p class="mt-2 text-sm leading-6 text-gray-600">
          Artikel
          <strong>{{ articleToDelete?.title }}</strong>
          akan dihapus. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div
          v-if="deleteError"
          class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ deleteError }}
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            :disabled="deleting"
            @click="closeDeleteModal"
          >
            Batal
          </button>

          <button
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            :disabled="deleting"
            @click="deleteArticle"
          >
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Existing reusable Media Library modal -->
    <MediaLibraryModal
      v-model="showMediaLibrary"
      @select="handleMediaSelected"
    />
  </div>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'

import api from '@/services/api'
import MediaLibraryModal from '@/components/admin/MediaLibraryModal.vue'

import { EditorContent, useEditor } from '@tiptap/vue-3'
import {StarterKit} from '@tiptap/starter-kit'
import {Underline} from '@tiptap/extension-underline'
import {TextAlign} from '@tiptap/extension-text-align'
import {TextStyle} from '@tiptap/extension-text-style'
import {Color} from '@tiptap/extension-color'
import {FontFamily} from '@tiptap/extension-font-family'
import {Image} from '@tiptap/extension-image'
import {Link} from '@tiptap/extension-link'
import { Extension } from '@tiptap/core'

/*
|--------------------------------------------------------------------------
| Font size extension
|--------------------------------------------------------------------------
*/

const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,

            parseHTML: (element) => element.style.fontSize || null,

            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {}

              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
})

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const articles = ref([])
const categories = ref([])

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const savingCategory = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const formError = ref('')
const categoryError = ref('')
const deleteError = ref('')

const showArticleModal = ref(false)
const showCategoryModal = ref(false)
const showDeleteModal = ref(false)
const showMediaLibrary = ref(false)

const editingArticle = ref(null)
const articleToDelete = ref(null)

const mediaTarget = ref('featured')

const searchInput = ref('')
const filters = reactive({
  search: '',
  category_id: '',
  status: '',
})

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})

const form = reactive({
  title: '',
  slug: '',
  category_id: '',
  excerpt: '',
  content: '',
  featured_image: '',
  featured_image_url: '',
  status: 'draft',
})

const errors = reactive({})
const slugTouched = ref(false)

const categoryForm = reactive({
  name: '',
  slug: '',
  description: '',
})

const categoryErrors = reactive({})
const categorySlugTouched = ref(false)

let searchTimer = null
let articlesRequestId = 0

/*
|--------------------------------------------------------------------------
| Editor
|--------------------------------------------------------------------------
*/

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    FontFamily,
    FontSize,
    Image.configure({
      inline: false,
      allowBase64: false,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      protocols: ['http', 'https', 'mailto', 'tel'],
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
  ],
  editorProps: {
    attributes: {
      class: 'article-prose',
      spellcheck: 'true',
    },
  },
  onUpdate: ({ editor: currentEditor }) => {
    form.content = currentEditor.getHTML()
  },
})

const activeBlock = computed(() => {
  if (!editor.value) return 'paragraph'

  if (editor.value.isActive('heading', { level: 1 })) return 'h1'
  if (editor.value.isActive('heading', { level: 2 })) return 'h2'
  if (editor.value.isActive('heading', { level: 3 })) return 'h3'
  if (editor.value.isActive('blockquote')) return 'blockquote'

  return 'paragraph'
})

function isActive(name) {
  return editor.value?.isActive(name) ?? false
}

function isTextAlign(alignment) {
  return editor.value?.isActive({ textAlign: alignment }) ?? false
}

function runEditorCommand(command) {
  if (!editor.value) return

  const chain = editor.value.chain().focus()

  if (command === 'toggleBold') chain.toggleBold().run()
  if (command === 'toggleItalic') chain.toggleItalic().run()
  if (command === 'toggleUnderline') chain.toggleUnderline().run()
  if (command === 'toggleStrike') chain.toggleStrike().run()
  if (command === 'toggleBulletList') chain.toggleBulletList().run()
  if (command === 'toggleOrderedList') chain.toggleOrderedList().run()
  if (command === 'setHorizontalRule') chain.setHorizontalRule().run()
}

function setBlock(value) {
  if (!editor.value) return

  const chain = editor.value.chain().focus()

  if (value === 'paragraph') chain.setParagraph().run()
  if (value === 'h1') chain.setHeading({ level: 1 }).run()
  if (value === 'h2') chain.setHeading({ level: 2 }).run()
  if (value === 'h3') chain.setHeading({ level: 3 }).run()
  if (value === 'blockquote') chain.toggleBlockquote().run()
}

function setFontFamily(value) {
  if (!editor.value) return

  if (!value) {
    editor.value.chain().focus().unsetFontFamily().run()
    return
  }

  editor.value.chain().focus().setFontFamily(value).run()
}

function setFontSize(value) {
  if (!editor.value) return

  if (!value) {
    editor.value
      .chain()
      .focus()
      .setMark('textStyle', { fontSize: null })
      .removeEmptyTextStyle()
      .run()
    return
  }

  editor.value
    .chain()
    .focus()
    .setMark('textStyle', { fontSize: value })
    .run()
}

function setTextColor(value) {
  editor.value?.chain().focus().setColor(value).run()
}

function setTextAlign(alignment) {
  editor.value?.chain().focus().setTextAlign(alignment).run()
}

function uppercaseSelection() {
  if (!editor.value) return

  const { from, to, empty } = editor.value.state.selection

  if (empty) {
    formError.value = 'Pilih teks yang ingin diubah menjadi huruf kapital.'
    return
  }

  const selectedText = editor.value.state.doc.textBetween(from, to, ' ')

  if (!selectedText) return

  editor.value
    .chain()
    .focus()
    .insertContentAt({ from, to }, selectedText.toLocaleUpperCase('id-ID'))
    .run()
}

function clearFormatting() {
  if (!editor.value) return

  editor.value
    .chain()
    .focus()
    .unsetAllMarks()
    .clearNodes()
    .run()
}

function promptLink() {
  if (!editor.value) return

  const currentLink = editor.value.getAttributes('link').href || ''
  const url = window.prompt('Masukkan URL tautan:', currentLink)

  if (url === null) return

  if (!url.trim()) {
    editor.value.chain().focus().unsetLink().run()
    return
  }

  const trimmedUrl = url.trim()

  if (!/^(https?:\/\/|mailto:|tel:)/i.test(trimmedUrl)) {
    formError.value = 'Tautan harus menggunakan http://, https://, mailto:, atau tel:.'
    return
  }

  formError.value = ''

  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: trimmedUrl })
    .run()
}

/*
|--------------------------------------------------------------------------
| API response helpers
|--------------------------------------------------------------------------
*/

function extractCollection(response) {
  let data = response?.data

  // Axios response -> response body.
  // Some APIs wrap the body in another `data`.
  if (data && !Array.isArray(data) && data.data !== undefined) {
    data = data.data
  }

  const rows = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : []

  const meta = response?.data?.meta
    ?? response?.data?.data?.meta
    ?? response?.data

  return { rows, meta: meta || {} }
}

function normalizeCategory(item) {
  return {
    id: item.id,
    name: item.name ?? item.title ?? '',
    slug: item.slug ?? '',
    description: item.description ?? '',
  }
}

function normalizeArticle(item) {
  const category = item.category ?? item.article_category ?? null

  const imageUrl =
    item.featured_image_url
    ?? item.featuredImageUrl
    ?? item.image_url
    ?? item.featured_image?.url
    ?? item.featured_image?.full_url
    ?? item.featured_image?.file_url
    ?? item.featured_image
    ?? item.image
    ?? ''

  const imagePath =
    typeof item.featured_image === 'string'
      ? item.featured_image
      : item.featured_image?.file_path ?? ''

  return {
    ...item,
    title: item.title ?? '',
    slug: item.slug ?? '',
    category_id: item.category_id == null ? '' : String(item.category_id),
    category_name: category?.name ?? item.category_name ?? '',
    excerpt: item.excerpt ?? '',
    content: item.content ?? '',
    featured_image: imagePath || (
      typeof item.featured_image === 'string' ? item.featured_image : ''
    ),
    featured_image_url: typeof imageUrl === 'string' ? imageUrl : '',
    status: item.status ?? 'draft',
  }
}

function extractValidationErrors(error, target = errors) {
  Object.keys(target).forEach((key) => delete target[key])

  const validation = error?.response?.data?.errors

  if (validation && typeof validation === 'object') {
    Object.entries(validation).forEach(([key, messages]) => {
      target[key] = Array.isArray(messages) ? messages[0] : String(messages)
    })
  }
}

function getErrorMessage(error, fallback) {
  const status = error?.response?.status
  const serverMessage = error?.response?.data?.message

  if (status === 401) return 'Sesi login berakhir. Silakan login kembali.'
  if (status === 403) return 'Kamu tidak memiliki izin untuk melakukan tindakan ini.'
  if (status === 404) return 'Data atau endpoint tidak ditemukan.'
  if (status === 422) return serverMessage || 'Periksa kembali data yang dimasukkan.'
  if (!error?.response) return 'Tidak dapat terhubung ke server API.'

  return serverMessage || fallback
}

/*
|--------------------------------------------------------------------------
| Load articles and categories
|--------------------------------------------------------------------------
*/

async function loadArticles() {
  const requestId = ++articlesRequestId
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get('/website/articles', {
      params: {
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: filters.search || undefined,
        category_id: filters.category_id || undefined,
        status: filters.status || undefined,
      },
    })

    // Ignore stale responses from earlier searches or page changes.
    if (requestId !== articlesRequestId) return

    const { rows, meta } = extractCollection(response)

    articles.value = rows.map(normalizeArticle)

    pagination.current_page = Number(
      meta.current_page ?? response?.data?.current_page ?? pagination.current_page,
    ) || 1

    pagination.last_page = Number(
      meta.last_page ?? response?.data?.last_page ?? 1,
    ) || 1

    pagination.per_page = Number(
      meta.per_page ?? response?.data?.per_page ?? pagination.per_page,
    ) || 10

    pagination.total = Number(
      meta.total ?? response?.data?.total ?? rows.length,
    ) || 0
  } catch (error) {
    if (requestId === articlesRequestId) {
      errorMessage.value = getErrorMessage(error, 'Gagal memuat artikel.')
    }
  } finally {
    if (requestId === articlesRequestId) {
      loading.value = false
    }
  }
}

async function loadCategories() {
  try {
    const response = await api.get('/website/article-categories')
    const { rows } = extractCollection(response)

    categories.value = rows.map(normalizeCategory)
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Gagal memuat kategori artikel.')
  }
}

async function loadInitialData() {
  await Promise.all([
    loadCategories(),
    loadArticles(),
  ])
}

/*
|--------------------------------------------------------------------------
| Search, filters, pagination
|--------------------------------------------------------------------------
*/

watch(searchInput, () => {
  clearTimeout(searchTimer)

  searchTimer = setTimeout(() => {
    filters.search = searchInput.value.trim()
    pagination.current_page = 1
    loadArticles()
  }, 350)
})

function applyFilters() {
  clearTimeout(searchTimer)
  filters.search = searchInput.value.trim()
  pagination.current_page = 1
  loadArticles()
}

function changePage(page) {
  const nextPage = Number(page)

  if (
    !Number.isInteger(nextPage)
    || nextPage < 1
    || nextPage > pagination.last_page
    || nextPage === pagination.current_page
  ) {
    return
  }

  pagination.current_page = nextPage
  loadArticles()
}

/*
|--------------------------------------------------------------------------
| Slug helpers
|--------------------------------------------------------------------------
*/

function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function handleTitleInput() {
  if (!slugTouched.value) {
    form.slug = slugify(form.title)
  }
}

function handleCategoryNameInput() {
  if (!categorySlugTouched.value) {
    categoryForm.slug = slugify(categoryForm.name)
  }
}

/*
|--------------------------------------------------------------------------
| Article modal
|--------------------------------------------------------------------------
*/

function clearErrors(target) {
  Object.keys(target).forEach((key) => delete target[key])
}

function resetArticleForm() {
  Object.assign(form, {
    title: '',
    slug: '',
    category_id: '',
    excerpt: '',
    content: '',
    featured_image: '',
    featured_image_url: '',
    status: 'draft',
  })

  clearErrors(errors)
  slugTouched.value = false
  formError.value = ''

  editor.value?.commands.clearContent()
}

function openCreateModal() {
  editingArticle.value = null
  resetArticleForm()
  showArticleModal.value = true
}

function openEditModal(article) {
  editingArticle.value = article
  resetArticleForm()

  Object.assign(form, {
    title: article.title ?? '',
    slug: article.slug ?? '',
    category_id: article.category_id == null ? '' : String(article.category_id),
    excerpt: article.excerpt ?? '',
    content: article.content ?? '',
    featured_image: article.featured_image ?? '',
    featured_image_url: article.featured_image_url ?? '',
    status: article.status ?? 'draft',
  })

  slugTouched.value = Boolean(article.slug)

  showArticleModal.value = true

  editor.value?.commands.setContent(article.content || '', false)
}

function closeArticleModal() {
  if (saving.value) return

  showArticleModal.value = false
  editingArticle.value = null
  showMediaLibrary.value = false
  formError.value = ''
}

function handleMediaSelected(media) {
  if (!media) return

  const url =
    media.url
    ?? media.full_url
    ?? media.public_url
    ?? media.file_url
    ?? media.file_path
    ?? ''

  const path =
    media.file_path
    ?? media.path
    ?? media.url
    ?? ''

  if (mediaTarget.value === 'editor') {
    if (!url || !editor.value) return

    editor.value
      .chain()
      .focus()
      .setImage({
        src: url,
        alt: media.alt ?? media.title ?? media.file_name ?? '',
      })
      .run()

    return
  }

  form.featured_image = path
  form.featured_image_url = url
}

function openFeaturedMedia() {
  mediaTarget.value = 'featured'
  showMediaLibrary.value = true
}

function openEditorMedia() {
  mediaTarget.value = 'editor'
  showMediaLibrary.value = true
}

function removeFeaturedImage() {
  form.featured_image = ''
  form.featured_image_url = ''
}

async function saveArticle() {
  formError.value = ''
  successMessage.value = ''
  clearErrors(errors)

  if (!form.title.trim()) {
    errors.title = 'Judul artikel wajib diisi.'
    return
  }

  if (!form.slug.trim()) {
    errors.slug = 'Slug artikel wajib diisi.'
    return
  }

  const html = editor.value?.getHTML() ?? form.content
  const plainText = editor.value?.getText().trim() ?? ''

  if (!plainText) {
    errors.content = 'Isi artikel wajib diisi.'
    return
  }

  const payload = {
    title: form.title.trim(),
    slug: form.slug.trim(),
    category_id: form.category_id || null,
    excerpt: form.excerpt.trim(),
    content: html,
    featured_image: form.featured_image || null,
    status: form.status,
  }

  saving.value = true

  try {
    if (editingArticle.value?.id) {
      await api.put(
        `/website/articles/${editingArticle.value.id}`,
        payload,
      )
      successMessage.value = 'Artikel berhasil diperbarui.'
    } else {
      await api.post('/website/articles', payload)
      successMessage.value = 'Artikel berhasil ditambahkan.'
    }

    showArticleModal.value = false
    editingArticle.value = null

    await loadArticles()
  } catch (error) {
    extractValidationErrors(error)

    formError.value = getErrorMessage(error, 'Gagal menyimpan artikel.')
  } finally {
    saving.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Category modal
|--------------------------------------------------------------------------
*/

function openCategoryModal() {
  Object.assign(categoryForm, {
    name: '',
    slug: '',
    description: '',
  })

  clearErrors(categoryErrors)
  categoryError.value = ''
  categorySlugTouched.value = false
  showCategoryModal.value = true
}

function closeCategoryModal() {
  if (savingCategory.value) return

  showCategoryModal.value = false
  categoryError.value = ''
}

async function saveCategory() {
  categoryError.value = ''
  clearErrors(categoryErrors)

  if (!categoryForm.name.trim()) {
    categoryErrors.name = 'Nama kategori wajib diisi.'
    return
  }

  if (!categoryForm.slug.trim()) {
    categoryErrors.slug = 'Slug kategori wajib diisi.'
    return
  }

  savingCategory.value = true

  try {
    const response = await api.post('/website/article-categories', {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim(),
      description: categoryForm.description.trim() || null,
    })

    const body = response?.data?.data ?? response?.data
    const newCategory = normalizeCategory(body)

    // Refresh list to keep the dropdown synchronized with the server.
    await loadCategories()

    const matchingCategory = categories.value.find(
      (item) => String(item.id) === String(newCategory.id),
    )

    if (matchingCategory) {
      form.category_id = String(matchingCategory.id)
    } else if (newCategory.id != null) {
      categories.value.push(newCategory)
      form.category_id = String(newCategory.id)
    }

    showCategoryModal.value = false
    successMessage.value = 'Kategori berhasil ditambahkan.'
  } catch (error) {
    extractValidationErrors(error, categoryErrors)
    categoryError.value = getErrorMessage(error, 'Gagal menyimpan kategori.')
  } finally {
    savingCategory.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Delete modal
|--------------------------------------------------------------------------
*/

function openDeleteModal(article) {
  articleToDelete.value = article
  deleteError.value = ''
  showDeleteModal.value = true
}

function closeDeleteModal() {
  if (deleting.value) return

  showDeleteModal.value = false
  articleToDelete.value = null
  deleteError.value = ''
}

async function deleteArticle() {
  if (!articleToDelete.value?.id) return

  deleting.value = true
  deleteError.value = ''
  successMessage.value = ''

  try {
    await api.delete(`/website/articles/${articleToDelete.value.id}`)

    showDeleteModal.value = false
    articleToDelete.value = null

    successMessage.value = 'Artikel berhasil dihapus.'

    // If the last row on the page was deleted, go back one page.
    if (articles.value.length === 1 && pagination.current_page > 1) {
      pagination.current_page -= 1
    }

    await loadArticles()
  } catch (error) {
    deleteError.value = getErrorMessage(error, 'Gagal menghapus artikel.')
  } finally {
    deleting.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Presentation helpers
|--------------------------------------------------------------------------
*/

function statusLabel(status) {
  const labels = {
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived',
  }

  return labels[status] || status || 'Draft'
}

function statusClass(status) {
  const classes = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-gray-100 text-gray-600',
  }

  return classes[status] || 'bg-gray-100 text-gray-600'
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
  loadInitialData()
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  editor.value?.destroy()
})
</script>

<style>
.toolbar-button {
  display: inline-flex;
  min-width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 0 8px;
  font-size: 13px;
  color: #374151;
}

.toolbar-button:hover {
  background: #e5e7eb;
}

.toolbar-active {
  border-color: #bae6fd;
  background: #e0f2fe;
  color: #0369a1;
}

.article-editor .tiptap {
  min-height: 280px;
  padding: 16px;
  outline: none;
  color: #1f2937;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

.article-editor .tiptap > * + * {
  margin-top: 0.75em;
}

.article-editor .tiptap h1 {
  font-size: 2em;
  font-weight: 700;
  line-height: 1.25;
}

.article-editor .tiptap h2 {
  font-size: 1.5em;
  font-weight: 700;
  line-height: 1.35;
}

.article-editor .tiptap h3 {
  font-size: 1.25em;
  font-weight: 700;
  line-height: 1.4;
}

.article-editor .tiptap ul {
  list-style: disc;
  padding-left: 1.5rem;
}

.article-editor .tiptap ol {
  list-style: decimal;
  padding-left: 1.5rem;
}

.article-editor .tiptap blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  color: #6b7280;
}

.article-editor .tiptap a {
  color: #0284c7;
  text-decoration: underline;
}

.article-editor .tiptap img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.article-editor .tiptap p.is-editor-empty:first-child::before {
  float: left;
  height: 0;
  color: #9ca3af;
  content: 'Mulai tulis isi artikel di sini...';
  pointer-events: none;
}
</style>