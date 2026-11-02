<template>
    <div class="space-y-6 pb-10">
        <!-- Page Header -->
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <div class="flex items-center gap-2">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0052cc]">
                        <Settings2 :size="21" />
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold tracking-tight text-gray-900">
                            Website Settings
                        </h1>
                        <p class="text-sm text-gray-500">
                            Kelola identitas, tampilan, dan konfigurasi website MJI.
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <span
                    v-if="hasChanges"
                    class="flex items-center gap-1.5 text-xs font-medium text-amber-600"
                >
                    <span class="h-2 w-2 rounded-full bg-amber-500"></span>
                    Ada perubahan belum disimpan
                </span>

                <button
                    type="button"
                    :disabled="loading || saving || !hasChanges"
                    class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0047b3] disabled:cursor-not-allowed disabled:opacity-50"
                    @click="saveSettings"
                >
                    <LoaderCircle
                        v-if="saving"
                        :size="17"
                        class="animate-spin"
                    />
                    <Save v-else :size="17" />

                    {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
            </div>
        </div>

        <!-- Notification -->
        <Transition name="fade">
            <div
                v-if="errorMessage"
                class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
                <AlertCircle :size="19" class="mt-0.5 shrink-0" />
                <div class="flex-1">{{ errorMessage }}</div>
                <button @click="errorMessage = ''">
                    <X :size="17" />
                </button>
            </div>
        </Transition>

        <Transition name="fade">
            <div
                v-if="successMessage"
                class="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
                <CheckCircle2 :size="19" />
                {{ successMessage }}
            </div>
        </Transition>

        <!-- Main Layout -->
        <div class="grid gap-6 lg:grid-cols-[245px_minmax(0,1fr)]">
            <!-- Navigation -->
            <aside class="h-fit rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                <div class="px-3 pb-3 pt-2">
                    <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Configuration
                    </p>
                </div>

                <nav class="flex gap-1 overflow-x-auto lg:flex-col">
                    <button
                        v-for="item in navigation"
                        :key="item.key"
                        type="button"
                        class="group flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:w-full"
                        :class="activeTab === item.key
                            ? 'bg-blue-50 text-[#0052cc]'
                            : 'text-gray-600 hover:bg-gray-50'"
                        @click="activeTab = item.key"
                    >
                        <component
                            :is="item.icon"
                            :size="18"
                            class="shrink-0"
                            :class="activeTab === item.key
                                ? 'text-[#0052cc]'
                                : 'text-gray-400 group-hover:text-gray-600'"
                        />

                        <span class="whitespace-nowrap text-sm font-medium">
                            {{ item.label }}
                        </span>

                        <ChevronRight
                            v-if="activeTab === item.key"
                            :size="15"
                            class="ml-auto hidden lg:block"
                        />
                    </button>
                </nav>

                <div class="mt-4 hidden rounded-xl bg-gray-50 p-3 lg:block">
                    <div class="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <ShieldCheck :size="16" class="text-green-600" />
                        Website Configuration
                    </div>
                    <p class="mt-1.5 text-[11px] leading-relaxed text-gray-500">
                        Perubahan akan disimpan sebagai konfigurasi global website.
                    </p>
                </div>
            </aside>

            <!-- Content -->
            <main class="min-w-0">
                <div
                    v-if="loading"
                    class="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-100 bg-white"
                >
                    <div class="text-center">
                        <LoaderCircle
                            :size="30"
                            class="mx-auto animate-spin text-[#0052cc]"
                        />
                        <p class="mt-3 text-sm text-gray-500">
                            Memuat konfigurasi website...
                        </p>
                    </div>
                </div>

                <template v-else>
                    <!-- GENERAL -->
                    <section v-if="activeTab === 'general'" class="space-y-5">
                        <SectionHeader
                            title="Informasi Umum"
                            description="Identitas utama perusahaan yang digunakan di seluruh halaman website."
                            icon="globe"
                        />

                        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <CardHeader
                                title="Identitas Perusahaan"
                                description="Informasi dasar mengenai perusahaan."
                            />

                            <div class="grid gap-5 p-5 md:grid-cols-2">
                                <FormField
                                    label="Nama Perusahaan"
                                    required
                                    class="md:col-span-2"
                                >
                                    <input
                                        v-model="settings.general.company_name"
                                        class="form-input"
                                        placeholder="PT Manunggal Jasa Investindo"
                                    />
                                </FormField>

                                <FormField label="Nama Singkat / Brand">
                                    <input
                                        v-model="settings.general.brand_name"
                                        class="form-input"
                                        placeholder="MJI"
                                    />
                                </FormField>

                                <FormField label="Website URL">
                                    <input
                                        v-model="settings.general.website_url"
                                        type="url"
                                        class="form-input"
                                        placeholder="https://www.example.com"
                                    />
                                </FormField>

                                <FormField
                                    label="Tagline"
                                    class="md:col-span-2"
                                >
                                    <input
                                        v-model="settings.general.tagline"
                                        class="form-input"
                                        placeholder="Solusi bisnis terpercaya"
                                    />
                                </FormField>

                                <FormField
                                    label="Deskripsi Perusahaan"
                                    description="Deskripsi singkat yang dapat digunakan pada halaman utama dan footer."
                                    class="md:col-span-2"
                                >
                                    <textarea
                                        v-model="settings.general.description"
                                        rows="5"
                                        class="form-input resize-y"
                                        placeholder="Tuliskan deskripsi perusahaan..."
                                    ></textarea>
                                </FormField>

                                <FormField label="Tahun Berdiri">
                                    <input
                                        v-model="settings.general.established_year"
                                        type="number"
                                        min="1900"
                                        class="form-input"
                                        placeholder="2010"
                                    />
                                </FormField>
                            </div>
                        </div>
                    </section>

                    <!-- BRANDING -->
                    <section v-else-if="activeTab === 'branding'" class="space-y-5">
                        <SectionHeader
                            title="Branding & Appearance"
                            description="Atur logo, favicon, dan identitas visual website."
                            icon="palette"
                        />

                        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <CardHeader
                                title="Logo & Website Assets"
                                description="Pilih gambar dari Media Library yang sudah tersedia."
                            />

                            <div class="grid gap-5 p-5 sm:grid-cols-2">
                                <div
                                    v-for="item in brandingFields"
                                    :key="item.key"
                                    class="min-w-0"
                                >
                                    <div class="mb-2 flex items-center justify-between gap-2">
                                        <label class="text-sm font-semibold text-gray-700">
                                            {{ item.label }}
                                        </label>
                                        <span class="text-[10px] text-gray-400">
                                            {{ item.hint }}
                                        </span>
                                    </div>

                                    <div
                                        class="group relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-blue-400"
                                    >
                                        <img
                                            v-if="settings.branding[item.key]?.url"
                                            :src="settings.branding[item.key].url"
                                            :alt="settings.branding[item.key].alt || item.label"
                                            class="max-h-full max-w-full object-contain"
                                        />

                                        <div v-else class="text-center">
                                            <ImagePlus
                                                :size="28"
                                                class="mx-auto text-gray-300"
                                            />
                                            <p class="mt-2 text-xs text-gray-400">
                                                Belum ada gambar
                                            </p>
                                        </div>

                                        <div class="absolute inset-x-0 bottom-0 flex translate-y-full justify-center gap-2 bg-white/95 p-2 transition group-hover:translate-y-0">
                                            <button
                                                type="button"
                                                class="rounded-lg bg-[#0052cc] px-3 py-1.5 text-xs font-semibold text-white"
                                                @click="openMediaLibrary(item.key)"
                                            >
                                                Pilih gambar
                                            </button>

                                            <button
                                                v-if="settings.branding[item.key]"
                                                type="button"
                                                class="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600"
                                                @click="settings.branding[item.key] = null"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>

                                    <p class="mt-2 text-[11px] text-gray-400">
                                        {{ item.description }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <CardHeader
                                title="Brand Colors"
                                description="Atur warna utama dan warna pendukung website."
                            />

                            <div class="grid gap-5 p-5 sm:grid-cols-2">
                                <ColorField
                                    v-model="settings.branding.primary_color"
                                    label="Primary Color"
                                />

                                <ColorField
                                    v-model="settings.branding.secondary_color"
                                    label="Secondary Color"
                                />

                                <ColorField
                                    v-model="settings.branding.accent_color"
                                    label="Accent Color"
                                />

                                <ColorField
                                    v-model="settings.branding.text_color"
                                    label="Text Color"
                                />
                            </div>

                            <div class="border-t border-gray-100 p-5">
                                <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Color Preview
                                </p>

                                <div class="flex flex-wrap gap-3">
                                    <div
                                        v-for="color in [
                                            { label: 'Primary', value: settings.branding.primary_color },
                                            { label: 'Secondary', value: settings.branding.secondary_color },
                                            { label: 'Accent', value: settings.branding.accent_color },
                                            { label: 'Text', value: settings.branding.text_color },
                                        ]"
                                        :key="color.label"
                                        class="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2"
                                    >
                                        <span
                                            class="h-6 w-6 rounded-md border border-black/10"
                                            :style="{ backgroundColor: color.value }"
                                        ></span>
                                        <span class="text-xs font-medium text-gray-600">
                                            {{ color.label }}
                                        </span>
                                        <span class="font-mono text-[10px] text-gray-400">
                                            {{ color.value }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- CONTACT -->
                    <section v-else-if="activeTab === 'contact'" class="space-y-5">
                        <SectionHeader
                            title="Contact Information"
                            description="Kelola informasi komunikasi dan lokasi kantor perusahaan."
                            icon="contact"
                        />

                        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <CardHeader
                                title="Kontak Utama"
                                description="Informasi komunikasi utama perusahaan."
                            />

                            <div class="grid gap-5 p-5 md:grid-cols-2">
                                <FormField label="Email Utama">
                                    <input
                                        v-model="settings.contact.email"
                                        type="email"
                                        class="form-input"
                                        placeholder="info@company.com"
                                    />
                                </FormField>

                                <FormField label="Nomor Telepon">
                                    <input
                                        v-model="settings.contact.phone"
                                        class="form-input"
                                        placeholder="+62..."
                                    />
                                </FormField>

                                <FormField label="WhatsApp">
                                    <input
                                        v-model="settings.contact.whatsapp"
                                        class="form-input"
                                        placeholder="628123456789"
                                    />
                                </FormField>

                                <FormField label="Email Alternatif">
                                    <input
                                        v-model="settings.contact.alternative_email"
                                        type="email"
                                        class="form-input"
                                        placeholder="sales@company.com"
                                    />
                                </FormField>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <div>
                                    <h3 class="font-semibold text-gray-900">
                                        Lokasi & Alamat Kantor
                                    </h3>
                                    <p class="mt-1 text-xs text-gray-500">
                                        Tambahkan lebih dari satu kantor atau cabang.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    class="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                                    @click="addAddress"
                                >
                                    <Plus :size="15" />
                                    Tambah Alamat
                                </button>
                            </div>

                            <div class="space-y-4 p-5">
                                <div
                                    v-for="(address, index) in settings.contact.addresses"
                                    :key="address._id"
                                    class="rounded-xl border border-gray-200 p-4"
                                >
                                    <div class="mb-4 flex items-center justify-between">
                                        <div class="flex items-center gap-2">
                                            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <MapPin :size="16" />
                                            </div>
                                            <span class="text-sm font-semibold text-gray-800">
                                                Alamat #{{ index + 1 }}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            class="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                            @click="removeAddress(index)"
                                        >
                                            <Trash2 :size="16" />
                                        </button>
                                    </div>

                                    <div class="grid gap-4 md:grid-cols-2">
                                        <FormField label="Nama Lokasi">
                                            <input
                                                v-model="address.label"
                                                class="form-input"
                                                placeholder="Kantor Pusat"
                                            />
                                        </FormField>

                                        <FormField label="Kota">
                                            <input
                                                v-model="address.city"
                                                class="form-input"
                                                placeholder="Surabaya"
                                            />
                                        </FormField>

                                        <FormField
                                            label="Alamat Lengkap"
                                            class="md:col-span-2"
                                        >
                                            <textarea
                                                v-model="address.address"
                                                rows="3"
                                                class="form-input resize-y"
                                                placeholder="Alamat lengkap kantor..."
                                            ></textarea>
                                        </FormField>

                                        <FormField label="Telepon">
                                            <input
                                                v-model="address.phone"
                                                class="form-input"
                                                placeholder="+62..."
                                            />
                                        </FormField>

                                        <FormField label="Email">
                                            <input
                                                v-model="address.email"
                                                class="form-input"
                                                placeholder="office@company.com"
                                            />
                                        </FormField>

                                        <label class="flex items-center gap-2 text-xs text-gray-600 md:col-span-2">
                                            <input
                                                v-model="address.is_active"
                                                type="checkbox"
                                                class="rounded border-gray-300 text-blue-600"
                                            />
                                            Tampilkan alamat ini pada website
                                        </label>
                                    </div>
                                </div>

                                <div
                                    v-if="!settings.contact.addresses.length"
                                    class="rounded-xl border border-dashed border-gray-300 py-10 text-center"
                                >
                                    <MapPin :size="28" class="mx-auto text-gray-300" />
                                    <p class="mt-2 text-sm font-medium text-gray-600">
                                        Belum ada alamat kantor
                                    </p>
                                    <p class="mt-1 text-xs text-gray-400">
                                        Klik Tambah Alamat untuk menambahkan lokasi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- SOCIAL -->
                    <section v-else-if="activeTab === 'social'" class="space-y-5">
                        <SectionHeader
                            title="Social Media"
                            description="Kelola tautan akun media sosial resmi perusahaan."
                            icon="share"
                        />

                        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <div>
                                    <h3 class="font-semibold text-gray-900">
                                        Social Media Accounts
                                    </h3>
                                    <p class="mt-1 text-xs text-gray-500">
                                        Tambahkan platform media sosial sesuai kebutuhan.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    class="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                                    @click="addSocial"
                                >
                                    <Plus :size="15" />
                                    Tambah Akun
                                </button>
                            </div>

                            <div class="space-y-3 p-5">
                                <div
                                    v-for="(item, index) in settings.social.items"
                                    :key="item._id"
                                    class="rounded-xl border border-gray-200 p-4"
                                >
                                    <div class="flex items-start justify-between gap-3">
                                        <div class="flex flex-1 items-center gap-3">
                                            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                                                <Share2 :size="18" />
                                            </div>

                                            <div class="grid flex-1 gap-3 sm:grid-cols-2">
                                                <FormField label="Platform">
                                                    <select
                                                        v-model="item.platform"
                                                        class="form-input"
                                                    >
                                                        <option value="instagram">Instagram</option>
                                                        <option value="facebook">Facebook</option>
                                                        <option value="linkedin">LinkedIn</option>
                                                        <option value="youtube">YouTube</option>
                                                        <option value="tiktok">TikTok</option>
                                                        <option value="x">X / Twitter</option>
                                                        <option value="whatsapp">WhatsApp</option>
                                                        <option value="other">Lainnya</option>
                                                    </select>
                                                </FormField>

                                                <FormField label="Label">
                                                    <input
                                                        v-model="item.label"
                                                        class="form-input"
                                                        placeholder="Instagram MJI"
                                                    />
                                                </FormField>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            class="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                            @click="removeSocial(index)"
                                        >
                                            <Trash2 :size="16" />
                                        </button>
                                    </div>

                                    <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            label="URL / Username"
                                            class="sm:col-span-2"
                                        >
                                            <input
                                                v-model="item.url"
                                                class="form-input"
                                                placeholder="https://..."
                                            />
                                        </FormField>

                                        <label class="flex items-center gap-2 text-xs text-gray-600">
                                            <input
                                                v-model="item.is_active"
                                                type="checkbox"
                                                class="rounded border-gray-300 text-blue-600"
                                            />
                                            Aktif pada website
                                        </label>
                                    </div>
                                </div>

                                <div
                                    v-if="!settings.social.items.length"
                                    class="rounded-xl border border-dashed border-gray-300 py-10 text-center"
                                >
                                    <Share2 :size="28" class="mx-auto text-gray-300" />
                                    <p class="mt-2 text-sm font-medium text-gray-600">
                                        Belum ada akun media sosial
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- SEO -->
                    <section v-else-if="activeTab === 'seo'" class="space-y-5">
                        <SectionHeader
                            title="SEO Settings"
                            description="Atur informasi default yang digunakan mesin pencari dan media sosial."
                            icon="search"
                        />

                        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <CardHeader
                                title="Search Engine Optimization"
                                description="Metadata default untuk halaman website."
                            />

                            <div class="space-y-5 p-5">
                                <FormField
                                    label="Default Meta Title"
                                    description="Disarankan sekitar 50–60 karakter."
                                >
                                    <input
                                        v-model="settings.seo.meta_title"
                                        maxlength="70"
                                        class="form-input"
                                        placeholder="Manunggal Jasa Investindo"
                                    />
                                    <div class="mt-1 text-right text-[11px] text-gray-400">
                                        {{ settings.seo.meta_title.length }}/70
                                    </div>
                                </FormField>

                                <FormField
                                    label="Meta Description"
                                    description="Deskripsi singkat untuk hasil pencarian Google."
                                >
                                    <textarea
                                        v-model="settings.seo.meta_description"
                                        maxlength="320"
                                        rows="4"
                                        class="form-input resize-y"
                                        placeholder="Deskripsi website..."
                                    ></textarea>
                                    <div class="mt-1 text-right text-[11px] text-gray-400">
                                        {{ settings.seo.meta_description.length }}/320
                                    </div>
                                </FormField>

                                <FormField
                                    label="Meta Keywords"
                                    description="Pisahkan setiap kata kunci dengan koma."
                                >
                                    <textarea
                                        v-model="settings.seo.meta_keywords"
                                        rows="3"
                                        class="form-input resize-y"
                                        placeholder="logistik, teknologi, bisnis..."
                                    ></textarea>
                                </FormField>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <CardHeader
                                title="Social Sharing / Open Graph"
                                description="Informasi saat halaman website dibagikan ke media sosial."
                            />

                            <div class="space-y-5 p-5">
                                <FormField label="Open Graph Title">
                                    <input
                                        v-model="settings.seo.og_title"
                                        class="form-input"
                                        placeholder="Judul ketika dibagikan"
                                    />
                                </FormField>

                                <FormField label="Open Graph Description">
                                    <textarea
                                        v-model="settings.seo.og_description"
                                        rows="3"
                                        class="form-input resize-y"
                                        placeholder="Deskripsi ketika dibagikan..."
                                    ></textarea>
                                </FormField>

                                <div>
                                    <label class="mb-2 block text-sm font-medium text-gray-700">
                                        Open Graph Image
                                    </label>

                                    <div class="flex flex-col gap-4 rounded-xl border border-dashed border-gray-300 p-4 sm:flex-row sm:items-center">
                                        <div class="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:w-48">
                                            <img
                                                v-if="settings.seo.og_image?.url"
                                                :src="settings.seo.og_image.url"
                                                alt="Open Graph"
                                                class="h-full w-full object-contain"
                                            />
                                            <ImagePlus
                                                v-else
                                                :size="28"
                                                class="text-gray-300"
                                            />
                                        </div>

                                        <div class="space-y-2">
                                            <p class="text-sm font-semibold text-gray-800">
                                                Gambar Preview Sharing
                                            </p>
                                            <p class="text-xs text-gray-500">
                                                Gunakan gambar landscape, idealnya 1200 × 630 px.
                                            </p>
                                            <button
                                                type="button"
                                                class="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                                                @click="openMediaLibrary('seo_og_image')"
                                            >
                                                Pilih dari Media Library
                                            </button>
                                            <button
                                                v-if="settings.seo.og_image"
                                                type="button"
                                                class="ml-2 text-xs text-red-600 hover:underline"
                                                @click="settings.seo.og_image = null"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </template>
            </main>
        </div>

        <!-- Bottom Save -->
        <div class="flex flex-col-reverse items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
            <p class="text-xs text-gray-400">
                <ShieldCheck :size="14" class="mr-1 inline text-green-600" />
                Perubahan konfigurasi tersimpan di database website.
            </p>

            <button
                type="button"
                :disabled="loading || saving || !hasChanges"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0047b3] disabled:opacity-50 sm:w-auto"
                @click="saveSettings"
            >
                <LoaderCircle
                    v-if="saving"
                    :size="17"
                    class="animate-spin"
                />
                <Save v-else :size="17" />
                {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
        </div>

        <!-- Media Library -->
        <MediaLibrary
            v-model="mediaModalOpen"
            @select="handleMediaSelected"
        />
    </div>
</template>

<script setup>
import {
    computed,
    defineComponent,
    h,
    onMounted,
    reactive,
    ref,
    watch,
} from 'vue'

import {
    Settings2,
    Globe,
    Palette,
    Contact,
    Share2,
    Search,
    ChevronRight,
    Save,
    LoaderCircle,
    AlertCircle,
    CheckCircle2,
    X,
    ShieldCheck,
    ImagePlus,
    Plus,
    Trash2,
    MapPin,
} from 'lucide-vue-next'

import { adminApi, getApiError } from '@/services/api'
import MediaLibrary from '../../components/admin/MediaLibraryModal.vue'

/*
|--------------------------------------------------------------------------
| Small Local Components
|--------------------------------------------------------------------------
*/

const SectionHeader = defineComponent({
    props: {
        title: String,
        description: String,
    },
    setup(props, { slots }) {
        return () => h('div', { class: 'mb-2' }, [
            h('h2', {
                class: 'text-xl font-bold text-gray-900',
            }, props.title),
            h('p', {
                class: 'mt-1 text-sm text-gray-500',
            }, props.description),
            slots.default?.(),
        ])
    },
})

const CardHeader = defineComponent({
    props: {
        title: String,
        description: String,
    },
    setup(props) {
        return () => h('div', {
            class: 'border-b border-gray-100 px-5 py-4',
        }, [
            h('h3', {
                class: 'font-semibold text-gray-900',
            }, props.title),
            h('p', {
                class: 'mt-1 text-xs text-gray-500',
            }, props.description),
        ])
    },
})

const FormField = defineComponent({
    props: {
        label: String,
        description: String,
        required: Boolean,
    },
    setup(props, { slots, attrs }) {
        return () => h('div', {
            ...attrs,
            class: ['min-w-0', attrs.class],
        }, [
            h('label', {
                class: 'block text-sm font-medium text-gray-700',
            }, [
                props.label,
                props.required
                    ? h('span', { class: 'ml-1 text-red-500' }, '*')
                    : null,
            ]),
            slots.default?.(),
            props.description
                ? h('p', {
                    class: 'mt-1.5 text-[11px] text-gray-400',
                }, props.description)
                : null,
        ])
    },
})

const ColorField = defineComponent({
    props: {
        modelValue: String,
        label: String,
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        return () => h('div', {}, [
            h('label', {
                class: 'mb-2 block text-sm font-medium text-gray-700',
            }, props.label),
            h('div', {
                class: 'flex items-center gap-3 rounded-xl border border-gray-200 p-2',
            }, [
                h('input', {
                    type: 'color',
                    value: props.modelValue,
                    class: 'h-9 w-10 cursor-pointer rounded border-0 bg-transparent',
                    onInput: (event) => emit(
                        'update:modelValue',
                        event.target.value
                    ),
                }),
                h('input', {
                    value: props.modelValue,
                    class: 'w-full border-0 bg-transparent font-mono text-sm outline-none',
                    onInput: (event) => emit(
                        'update:modelValue',
                        event.target.value
                    ),
                }),
            ]),
        ])
    },
})

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const loading = ref(false)
const saving = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const activeTab = ref('general')

const mediaModalOpen = ref(false)
const activeMediaField = ref(null)

let successTimer = null

const navigation = [
    { key: 'general', label: 'General Information', icon: Globe },
    { key: 'branding', label: 'Branding & Logo', icon: Palette },
    { key: 'contact', label: 'Contact Information', icon: Contact },
    { key: 'social', label: 'Social Media', icon: Share2 },
    { key: 'seo', label: 'SEO Settings', icon: Search },
]

const brandingFields = [
    {
        key: 'logo',
        label: 'Logo Utama',
        hint: 'Header',
        description: 'Logo utama untuk header website.',
    },
    {
        key: 'logo_dark',
        label: 'Logo Alternatif',
        hint: 'Dark Background',
        description: 'Gunakan untuk area dengan latar gelap.',
    },
    {
        key: 'favicon',
        label: 'Favicon',
        hint: 'Browser',
        description: 'Ikon kecil yang tampil pada tab browser.',
    },
]

const defaults = {
    general: {
        company_name: 'Manunggal Jasa Investindo',
        brand_name: 'MJI',
        website_url: '',
        tagline: '',
        description: 'Solusi bisnis terpadu untuk kebutuhan logistik, teknologi, dan layanan digital.',
        established_year: '',
    },

    branding: {
        logo: null,
        logo_dark: null,
        favicon: null,
        primary_color: '#0052cc',
        secondary_color: '#14a2d8',
        accent_color: '#14a2d8',
        text_color: '#1f2937',
    },

    contact: {
        email: 'info@manunggal.com',
        phone: '',
        whatsapp: '',
        alternative_email: '',
        addresses: [],
    },

    social: {
        items: [],
    },

    seo: {
        meta_title: 'Manunggal Jasa Investindo',
        meta_description: '',
        meta_keywords: '',
        og_title: '',
        og_description: '',
        og_image: null,
    },
}

const settings = reactive(structuredClone(defaults))

const initialSnapshot = ref('')

const hasChanges = computed(() => {
    return JSON.stringify(settings) !== initialSnapshot.value
})

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function makeId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeMedia(media) {
    if (!media) return null

    return {
        id: media.id ?? null,
        url: media.url ?? '',
        file_name: media.file_name ?? '',
        alt: media.alt ?? '',
    }
}

function parseValue(value, fallback) {
    let parsed = value

    if (typeof value === 'string') {
        try {
            parsed = JSON.parse(value)
        } catch {
            return structuredClone(fallback)
        }
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return structuredClone(fallback)
    }

    return {
        ...structuredClone(fallback),
        ...parsed,
    }
}

function normalizeSettings() {
    settings.branding.logo = normalizeMedia(settings.branding.logo)
    settings.branding.logo_dark = normalizeMedia(settings.branding.logo_dark)
    settings.branding.favicon = normalizeMedia(settings.branding.favicon)
    settings.seo.og_image = normalizeMedia(settings.seo.og_image)

    settings.contact.addresses = (settings.contact.addresses || []).map(
        (item) => ({
            _id: makeId(),
            label: '',
            city: '',
            address: '',
            phone: '',
            email: '',
            is_active: true,
            ...item,
        })
    )

    settings.social.items = (settings.social.items || []).map(
        (item) => ({
            _id: makeId(),
            platform: 'instagram',
            label: '',
            url: '',
            is_active: true,
            ...item,
        })
    )
}

function getSettingsPayload() {
    return {
        settings: Object.entries(settings).map(([key, value]) => ({
            key,
            type: 'json',
            group: 'website',
            is_active: true,
            value: JSON.parse(JSON.stringify(value, (property, item) => {
                if (property === '_id') return undefined
                return item
            })),
        })),
    }
}

/*
|--------------------------------------------------------------------------
| Load Settings
|--------------------------------------------------------------------------
*/

async function loadSettings() {
    loading.value = true
    errorMessage.value = ''

    try {
        const response = await adminApi.website.settings.list({
            group: 'website',
        })

        const records = response.data || []

        Object.keys(defaults).forEach((key) => {
            settings[key] = structuredClone(defaults[key])
        })

        records.forEach((item) => {
            if (!Object.prototype.hasOwnProperty.call(defaults, item.key)) {
                return
            }

            settings[item.key] = parseValue(
                item.value,
                defaults[item.key]
            )
        })

        normalizeSettings()

        initialSnapshot.value = JSON.stringify(settings)
    } catch (error) {
        errorMessage.value = getApiError(error).message
    } finally {
        loading.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Save Settings
|--------------------------------------------------------------------------
*/

async function saveSettings() {
    if (saving.value || loading.value || !hasChanges.value) return

    saving.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
        const payload = getSettingsPayload()

        await adminApi.website.settings.update(payload)

        initialSnapshot.value = JSON.stringify(settings)

        successMessage.value = 'Pengaturan website berhasil disimpan.'

        window.clearTimeout(successTimer)

        successTimer = window.setTimeout(() => {
            successMessage.value = ''
        }, 5000)
    } catch (error) {
        errorMessage.value = getApiError(error).message
    } finally {
        saving.value = false
    }
}

/*
|--------------------------------------------------------------------------
| Dynamic Addresses
|--------------------------------------------------------------------------
*/

function addAddress() {
    settings.contact.addresses.push({
        _id: makeId(),
        label: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        is_active: true,
    })
}

function removeAddress(index) {
    settings.contact.addresses.splice(index, 1)
}

/*
|--------------------------------------------------------------------------
| Dynamic Social Media
|--------------------------------------------------------------------------
*/

function addSocial() {
    settings.social.items.push({
        _id: makeId(),
        platform: 'instagram',
        label: '',
        url: '',
        is_active: true,
    })
}

function removeSocial(index) {
    settings.social.items.splice(index, 1)
}

/*
|--------------------------------------------------------------------------
| Media Library
|--------------------------------------------------------------------------
*/

function openMediaLibrary(field) {
    activeMediaField.value = field
    mediaModalOpen.value = true
}

function handleMediaSelected(media) {
    const selectedMedia = normalizeMedia(media)

    if (!selectedMedia) return

    if (activeMediaField.value === 'seo_og_image') {
        settings.seo.og_image = selectedMedia
    } else if (
        Object.prototype.hasOwnProperty.call(
            settings.branding,
            activeMediaField.value
        )
    ) {
        settings.branding[activeMediaField.value] = selectedMedia
    }

    activeMediaField.value = null
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(loadSettings)

watch(activeTab, () => {
    errorMessage.value = ''
})

</script>

<style scoped>
.form-input {
    display: block;
    margin-top: 0.5rem;
    width: 100%;
    min-width: 0;
    border: 1px solid rgb(229 231 235);
    border-radius: 0.75rem;
    background-color: white;
    padding: 0.7rem 0.9rem;
    font-size: 0.875rem;
    line-height: 1.4rem;
    color: rgb(31 41 55);
    outline: none;
    transition: border-color 150ms ease, box-shadow 150ms ease;
}

.form-input:focus {
    border-color: rgb(59 130 246);
    box-shadow: 0 0 0 3px rgb(219 234 254 / 70%);
}

.form-input::placeholder {
    color: rgb(156 163 175);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 180ms ease, transform 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}
</style>