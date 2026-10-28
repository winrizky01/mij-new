export const BLOCK_CATEGORIES = [
    {
        key: "layout",
        label: "Layout & Konten",
    },
    {
        key: "dynamic",
        label: "Konten Dinamis",
    },
    {
        key: "interactive",
        label: "Interaktif",
    },
];

export const BLOCK_REGISTRY = {
    container: {
        type: "container",
        label: "Container / Section",
        category: "layout",
        description: "Pembungkus untuk mengelompokkan konten.",
        icon: "layout",
        defaults: {
            name: "Section Baru",
            title: "",
            description: "",
            enabled: true,
            backgroundColor: "#ffffff",
            alignment: "left",
            paddingTop: 48,
            paddingBottom: 48,
            maxWidth: "xl",
            children: [],
        },
    },

    columns: {
        type: "columns",
        label: "Columns",
        category: "layout",
        description: "Membagi konten menjadi beberapa kolom.",
        icon: "columns-3",
        defaults: {
            name: "Kolom Baru",
            enabled: true,
            columns: 2,
            gap: 24,
            children: [],
        },
    },

    heading: {
        type: "heading",
        label: "Heading",
        category: "layout",
        description: "Judul atau subjudul halaman.",
        icon: "heading",
        defaults: {
            name: "Judul",
            enabled: true,
            title: "Judul Baru",
            level: 2,
            alignment: "left",
        },
    },

    rich_text: {
        type: "rich_text",
        label: "Rich Text",
        category: "layout",
        description: "Konten teks dan deskripsi.",
        icon: "file-text",
        defaults: {
            name: "Konten Teks",
            enabled: true,
            title: "",
            content: "",
            alignment: "left",
        },
    },

    image: {
        type: "image",
        label: "Image",
        category: "layout",
        description: "Gambar dengan teks alternatif dan caption.",
        icon: "image",
        defaults: {
            name: "Gambar",
            enabled: true,
            imageUrl: "",
            alt: "",
            caption: "",
            maxHeight: 480,
            objectFit: "cover",
        },
    },

    image_slider: {
        type: "image_slider",
        label: "Image Slider / Carousel",
        category: "layout",
        description: "Slider gambar dengan teks, tombol, dan navigasi.",
        icon: "gallery-horizontal",
        defaults: {
            name: "Image Slider",
            enabled: true,

            title: "",
            description: "",

            // Ukuran dan tampilan slider
            height: 520,
            maxWidth: "full",
            objectFit: "cover",
            borderRadius: 0,

            // Pengaturan autoplay
            autoplay: true,
            autoplayInterval: 5000,

            // Navigasi
            showArrows: true,
            showDots: true,

            // Overlay dan posisi konten
            overlay: true,
            overlayColor: "#000000",
            overlayOpacity: 40,
            contentAlignment: "left",

            // Data setiap slide
            images: [
                {
                    imageUrl: "",
                    alt: "",
                    title: "",
                    description: "",
                    buttonText: "",
                    buttonUrl: "",
                    newTab: false,
                },
            ],
        },
    },

    gallery: {
        type: "gallery",
        label: "Gallery",
        category: "layout",
        description: "Galeri beberapa gambar.",
        icon: "images",
        defaults: {
            name: "Galeri",
            enabled: true,
            title: "Galeri",
            columns: 3,
            images: [],
        },
    },

    button: {
        type: "button",
        label: "Button / CTA",
        category: "layout",
        description: "Tombol ajakan atau tautan.",
        icon: "mouse-pointer-click",
        defaults: {
            name: "Tombol",
            enabled: true,
            buttonText: "Selengkapnya",
            url: "",
            variant: "primary",
            alignment: "left",
            newTab: false,
        },
    },

    spacer_divider: {
        type: "spacer_divider",
        label: "Spacer / Divider",
        category: "layout",
        description: "Pengatur jarak atau garis pemisah.",
        icon: "separator-horizontal",
        defaults: {
            name: "Pemisah",
            enabled: true,
            variant: "spacer",
            height: 40,
            marginTop: 16,
            marginBottom: 16,
        },
    },

    services: {
        type: "services",
        label: "Daftar Layanan",
        category: "dynamic",
        description: "Menampilkan layanan aktif dari database website MJI.",
        icon: "briefcase-business",
        defaults: {
            name: "Daftar Layanan",
            enabled: true,
            title: "Layanan Kami",
            eyebrow: "",
            description: "Kami menyediakan solusi bisnis komprehensif untuk mendukung pertumbuhan perusahaan Anda.",
            source: "website_services",
            limit: 6,
            columns: 3,
            showDescription: true,
            showIcon: true,
            showLink: true,
            items: [],
        },
    },

    articles: {
        type: "articles",
        label: "Artikel / Berita",
        category: "dynamic",
        description: "Menampilkan artikel dari sumber yang tersedia.",
        icon: "newspaper",
        defaults: {
            name: "Artikel",
            enabled: true,
            title: "Artikel Terbaru",
            eyebrow: "",
            description: "",
            source: "latest_articles",
            limit: 3,
            items: [],
        },
    },

    statistics: {
        type: "statistics",
        label: "Statistik",
        category: "dynamic",
        description: "Menampilkan angka dan ringkasan statistik.",
        icon: "chart-no-axes-combined",
        defaults: {
            name: "Statistik",
            enabled: true,
            title: "",
            source: "manual",
            items: [],
        },
    },

    contact_info: {
        type: "contact_info",
        label: "Contact Info",
        category: "dynamic",
        description: "Alamat dan informasi kontak.",
        icon: "contact",
        defaults: {
            name: "Informasi Kontak",
            enabled: true,
            title: "Hubungi Kami",
            description: "",
            address: "",
            phone: "",
            email: "",
            hours: "",
        },
    },

    faq: {
        type: "faq",
        label: "FAQ / Accordion",
        category: "interactive",
        description: "Pertanyaan dan jawaban yang bisa dibuka.",
        icon: "list-collapse",
        defaults: {
            name: "FAQ",
            enabled: true,
            title: "Pertanyaan Umum",
            items: [],
        },
    },

    tabs: {
        type: "tabs",
        label: "Tabs",
        category: "interactive",
        description: "Konten dalam beberapa tab.",
        icon: "panels-top-left",
        defaults: {
            name: "Tab Konten",
            enabled: true,
            title: "",
            items: [],
        },
    },

    contact_form: {
        type: "contact_form",
        label: "Contact Form",
        category: "interactive",
        description: "Formulir kontak.",
        icon: "clipboard-list",
        defaults: {
            name: "Formulir Kontak",
            enabled: true,
            title: "Hubungi Kami",
            description: "",
            submitText: "Kirim Pesan",
        },
    },

    whatsapp: {
        type: "whatsapp",
        label: "WhatsApp CTA",
        category: "interactive",
        description: "Tombol untuk menghubungi melalui WhatsApp.",
        icon: "message-circle",
        defaults: {
            name: "WhatsApp",
            enabled: true,
            title: "Butuh Bantuan?",
            description: "Hubungi kami melalui WhatsApp.",
            phone: "",
            message: "Halo, saya ingin bertanya.",
            buttonText: "Chat WhatsApp",
        },
    },

    map_video: {
        type: "map_video",
        label: "Map / Video",
        category: "interactive",
        description: "Lokasi peta atau video.",
        icon: "map",
        defaults: {
            name: "Peta / Video",
            enabled: true,
            title: "",
            description: "",
            mediaType: "map",
            url: "",
        },
    },
};

export const BLOCK_TYPES = Object.values(BLOCK_REGISTRY);

export function createBlock(type, overrides = {}) {
    const definition = BLOCK_REGISTRY[type];

    if (!definition) {
        throw new Error(`Tipe blok "${type}" tidak terdaftar.`);
    }

    return {
        ...structuredClone(definition.defaults),
        ...structuredClone(overrides),
        id: overrides.id ?? createBlockId(),
        type,
    };
}

function createBlockId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}