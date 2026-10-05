import { createRouter, createWebHistory } from 'vue-router'

import PublicLayout from '../layouts/PublicLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import ErpLayout from '../layouts/ErpLayout.vue'

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
import ErpInventory from '../pages/erp/Stock.vue'
import ErpStockIssues from '../pages/erp/StockIssues.vue'
import ErpInvoices from '../pages/erp/SalesInvoices.vue'

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
                    component: Home,
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
                    path: 'website',
                    name: 'admin.website',
                    component: AdminWebsiteContent,
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
                    path: 'inventory',
                    name: 'erp.inventory',
                    component: ErpInventory,
                },

                {
                    path: 'stock-issues',
                    name: 'erp.stock-issues',
                    component: ErpStockIssues,
                },

                {
                    path: 'invoices',
                    name: 'erp.invoices',
                    component: ErpInvoices,
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

export default router