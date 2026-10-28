import { createRouter, createWebHistory } from 'vue-router'
import { publicApi } from '../services/api'

import PublicLayout from '../layouts/PublicLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import ErpLayout from '../layouts/ErpLayout.vue'

// =====================================
// PUBLIC WEBSITE
// =====================================
import DynamicPage from '../pages/public/DynamicPage.vue'
import Home from '../pages/public/Home.vue'
import Login from '../pages/Login.vue'
import SelectSystem from '../pages/SelectSystem.vue'

// =====================================
// ADMIN WEBSITE
// =====================================

import AdminDashboard from '../pages/admin/Dashboard.vue'
import AdminInquiries from '../pages/admin/Inquiries.vue'
import AdminServices from '../pages/admin/Services.vue'
import AdminArticles from '../pages/admin/Articles.vue'
import AdminMedia from '../pages/admin/Media.vue'
import AdminUsers from '../pages/admin/Users.vue'
import AdminSettings from '../pages/admin/Settings.vue'
import AdminWebsiteContent from '../pages/admin/WebsiteContent.vue'
import AdminWebsitePages from '../pages/admin/WebsitePages.vue'
import AdminWebsiteTraffic from '../pages/admin/Traffics.vue'

// =====================================
// ERP
// =====================================

import ErpDashboard from '../pages/erp/Dashboard.vue'
import ErpProducts from '../pages/erp/Products.vue'
import ErpGeneral from '../pages/erp/General.vue'
import ErpPurchases from '../pages/erp/Purchases.vue'
import ErpTrucks from '../pages/erp/Trucks.vue'
import ErpTariffs from '../pages/erp/Tariffs.vue'
import ErpProvinces from '../pages/erp/Provinces.vue'
import ErpShipments from '../pages/erp/Shipments.vue'
import ErpEmployees from '../pages/erp/Employees.vue'
import ErpPartners from '../pages/erp/Partners.vue'
import ErpStocks from '../pages/erp/Stock.vue'
import ErpStockIssues from '../pages/erp/StockIssues.vue'
import ErpStockMovement from '../pages/erp/StockMovements.vue'
import ErpInvoices from '../pages/erp/Invoices.vue'
import ErpQuotations from '../pages/erp/Quotations.vue'
import ErpUnits from '../pages/erp/Units.vue'
import ErpCashBank from '../pages/erp/CashBank.vue'
import ErpReceivables from '../pages/erp/Receivables.vue'
import ErpPayables from '../pages/erp/Payables.vue'
import ErpReportShipment from '../pages/erp/reports/ShipmentReport.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        // =====================================
        // PUBLIC
        // =====================================
        {
            path: '/',
            component: PublicLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: DynamicPage,
                    props: { slug: 'home' },
                },
                {
                    path: ':slug',
                    name: 'public-dynamic-page',
                    component: DynamicPage,
                },
            ],
        },

        // =====================================
        // AUTH
        // =====================================
        {
            path: '/login',
            name: 'login',
            component: Login,
        },

        {
            path: '/select-system',
            name: 'select-system',
            component: SelectSystem,
        },

        // =====================================
        // WEBSITE ADMIN
        // =====================================
        {
            path: '/admin',

            component: AdminLayout,

            meta: {
                requiresAuth: true,
                system: 'admin',
            },

            children: [
                {
                    path: '',
                    redirect: '/admin/dashboard',
                },

                {
                    path: 'dashboard',
                    name: 'admin.dashboard',
                    component: AdminDashboard,
                },

                {
                    path: 'inquiries',
                    name: 'admin.inquiries',
                    component: AdminInquiries,
                },

                {
                    path: 'contents',
                    name: 'admin.contents',
                    component: AdminWebsiteContent,
                },

                {
                    path: 'pages',
                    name: 'admin.pages',
                    component: AdminWebsitePages,
                },

                {
                    path: 'website-editor',
                    name: 'admin.website-editor',
                    component: () => import('../pages/admin/WebsiteEditor.vue'),
                },

                {
                    path: 'services',
                    name: 'admin.services',
                    component: AdminServices,
                },

                {
                    path: 'articles',
                    name: 'admin.articles',
                    component: AdminArticles,
                },

                {
                    path: 'media',
                    name: 'admin.media',
                    component: AdminMedia,
                },

                {
                    path: 'users',
                    name: 'admin.users',
                    component: AdminUsers,
                },

                {
                    path: 'settings',
                    name: 'admin.settings',
                    component: AdminSettings,
                },

                {
                    path: 'traffic',
                    name: 'admin.traffic',
                    component: AdminWebsiteTraffic,
                }
            ],
        },

        // =====================================
        // ERP
        // =====================================
        {
            path: '/erp',

            component: ErpLayout,

            meta: {
                requiresAuth: true,
                system: 'erp',
            },

            children: [
                {
                    path: '',
                    redirect: '/erp/dashboard',
                },

                {
                    path: 'dashboard',
                    name: 'erp.dashboard',
                    component: ErpDashboard,
                },

                {
                    path: 'products',
                    name: 'erp.products',
                    component: ErpProducts,
                },

                {
                    path: 'purchases',
                    name: 'erp.purchases',
                    component: ErpPurchases,
                },

                {
                    path: 'general',
                    name: 'erp.general',
                    component: ErpGeneral,
                },

                {
                    path: 'units',
                    name: 'erp.units',
                    component: ErpUnits,
                },

                {
                    path: 'trucks',
                    name: 'erp.trucks',
                    component: ErpTrucks,
                },

                {
                    path: 'tariffs',
                    name: 'erp.tariffs',
                    component: ErpTariffs,
                },

                {
                    path: 'provinces',
                    name: 'erp.provinces',
                    component: ErpProvinces,
                },

                {
                    path: 'shipments',
                    name: 'erp.shipments',
                    component: ErpShipments,
                },

                {
                    path: 'employees',
                    name: 'erp.employees',
                    component: ErpEmployees,
                },

                {
                    path: 'partners',
                    name: 'erp.partners',
                    component: ErpPartners,
                },

                {
                    path: 'stocks',
                    name: 'erp.stocks',
                    component: ErpStocks,
                },

                {
                    path: 'stock-issues',
                    name: 'erp.stock-issues',
                    component: ErpStockIssues,
                },

                {
                    path: 'stock-mutations',
                    name: 'erp.stock-mutations',
                    component: ErpStockMovement,
                },

                {
                    path: 'invoices',
                    name: 'erp.invoices',
                    component: ErpInvoices,
                },

                {
                    path: 'quotations',
                    name: 'erp.quotations',
                    component: ErpQuotations,
                },

                {
                    path: '/erp/cash-bank',
                    name: 'erp.cash-bank',
                    component: ErpCashBank,
                },

                {
                    path: '/erp/receivables',
                    name: 'erp.receivables',
                    component: ErpReceivables,
                },

                {
                    path: '/erp/payables',
                    name: 'erp.payables',
                    component: ErpPayables,
                },
                
                {
                    path: '/erp/reports/shipments',
                    name: 'erp.reports.shipments',
                    component: ErpReportShipment,
                },
                
                {
                path: 'access-management',
                name: 'erp.access-management',
                component: () => import('@/pages/erp/AccessManagement.vue'),
                meta: {
                    requiresAuth: true,
                    system: 'erp',
                    superAdminOnly: true,
                },
                },

            ],
        },
    ],
})

// =========================================
// AUTH GUARD
// =========================================

router.beforeEach((to) => {
    const storedUser = localStorage.getItem('mji_user')

    const user = storedUser
        ? JSON.parse(storedUser)
        : null

    // =====================================
    // Halaman membutuhkan login
    // =====================================

    if (to.meta.requiresAuth) {
        if (!user) {
            return '/login'
        }

        const requiredSystem = to.meta.system

        if (
            requiredSystem &&
            !user.access?.includes(requiredSystem)
        ) {
            return '/select-system'
        }
    }

    // =====================================
    // User sudah login
    // =====================================

    if (
        to.path === '/login' &&
        user
    ) {
        return '/select-system'
    }

    // =====================================
    // Select system harus login
    // =====================================

    if (
        to.path === '/select-system' &&
        !user
    ) {
        return '/login'
    }

    return true
})

/**
 * Website traffic tracking.
 * Hanya mencatat halaman publik, bukan halaman admin atau ERP.
 */

function getTrafficVisitorId() {
    const key = 'mji_traffic_visitor_id'

    try {
        let id = localStorage.getItem(key)

        if (!id) {
            id = globalThis.crypto?.randomUUID
                ? globalThis.crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`

            localStorage.setItem(key, id)
        }

        return id
    } catch {
        // Jangan menghambat navigasi jika storage tidak tersedia.
        return null
    }
}

function getTrafficDevice() {
    const ua = navigator.userAgent

    if (/ipad|tablet/i.test(ua)) return 'tablet'
    if (/mobile|android|iphone|ipod/i.test(ua)) return 'mobile'

    return 'desktop'
}

function getTrafficSource(to) {
    const params = new URLSearchParams(to.fullPath)
    const campaignSource = params.get('utm_source')

    if (campaignSource) {
        try {
            sessionStorage.setItem(
                'mji_traffic_source',
                campaignSource
            )
        } catch {
            // Abaikan jika sessionStorage tidak tersedia.
        }

        return campaignSource
    }

    try {
        const savedSource = sessionStorage.getItem(
            'mji_traffic_source'
        )

        if (savedSource) {
            return savedSource
        }

        if (document.referrer) {
            const referrer = new URL(document.referrer)

            if (referrer.hostname !== window.location.hostname) {
                sessionStorage.setItem(
                    'mji_traffic_source',
                    referrer.hostname
                )

                return referrer.hostname
            }
        }

        sessionStorage.setItem(
            'mji_traffic_source',
            'direct'
        )
    } catch {
        // Abaikan jika sessionStorage tidak tersedia.
    }

    return 'direct'
}

router.afterEach((to, from, failure) => {
    if (failure) return

    const excludedPaths = [
        '/admin',
        '/erp',
        '/login',
        '/select-system',
    ]

    if (excludedPaths.some((path) =>
        to.path === path || to.path.startsWith(`${path}/`)
    )) {
        return
    }

    const visitorId = getTrafficVisitorId()

    // Tetap bisa mencatat kunjungan jika ID anonim tidak tersedia.
    const payload = {
        page: to.path,
        source: getTrafficSource(to),
        device: getTrafficDevice(),
        visitor_id: visitorId,
        referrer: document.referrer || null,
    }

    publicApi.traffic.track(payload).catch((error) => {
        // Tracking tidak boleh merusak pengalaman pengunjung.
        console.warn('Website traffic tracking gagal:', error.message)
    })
})

export default router