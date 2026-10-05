import axios from 'axios'

/*
|--------------------------------------------------------------------------
| API CONFIG
|--------------------------------------------------------------------------
|
| Development:
|   VITE_API_URL=http://127.0.0.1:8000/api
|
| Production:
|   VITE_API_URL=https://api.mji.co.id/api
|
*/

const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8000/api'

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 30_000,
})

/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/

const TOKEN_KEY = 'mji_token'
const USER_KEY = 'mji_user'

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token)
    }
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export function getUser() {
    try {
        const user = localStorage.getItem(USER_KEY)

        return user ? JSON.parse(user) : null
    } catch {
        return null
    }
}

export function setUser(user) {
    if (user) {
        localStorage.setItem(
            USER_KEY,
            JSON.stringify(user)
        )
    }
}

export function removeUser() {
    localStorage.removeItem(USER_KEY)
}

export function clearAuth() {
    removeToken()
    removeUser()
}

/*
|--------------------------------------------------------------------------
| AUTH HEADER
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
    (config) => {
        const token = getToken()

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
|
| 401 = token invalid / expired
|
*/

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            clearAuth()

            /*
             * Jangan langsung redirect menggunakan window.location
             * di sini. Router Vue akan menangani redirect.
             *
             * Event ini bisa digunakan oleh App.vue / auth store
             * kalau nanti kita ingin membuat global auth handler.
             */

            window.dispatchEvent(
                new CustomEvent('mji:unauthorized')
            )
        }

        return Promise.reject(error)
    }
)

/*
|--------------------------------------------------------------------------
| NORMALIZE ERROR
|--------------------------------------------------------------------------
*/

export function getApiError(error) {
    const response = error?.response
    console.log('API ERROR', error)

    if (!response) {
        return {
            status: 0,
            message:
                'Tidak dapat terhubung ke server.',
            errors: {},
        }
    }

    return {
        status: response.status,
        message:
            response.data?.message ||
            'Terjadi kesalahan pada server.',
        errors:
            response.data?.errors || {},
        data: response.data,
    }
}

/*
|--------------------------------------------------------------------------
| GENERIC HTTP METHODS
|--------------------------------------------------------------------------
|
| Bisa dipakai untuk endpoint apa pun.
|
*/

export async function get(
    url,
    params = {},
    config = {}
) {
    const response = await api.get(url, {
        params,
        ...config,
    })

    return response.data
}

export async function post(
    url,
    data = {},
    config = {}
) {
    const response = await api.post(
        url,
        data,
        config
    )

    return response.data
}

export async function put(
    url,
    data = {},
    config = {}
) {
    const response = await api.put(
        url,
        data,
        config
    )

    return response.data
}

export async function patch(
    url,
    data = {},
    config = {}
) {
    const response = await api.patch(
        url,
        data,
        config
    )

    return response.data
}

export async function destroy(
    url,
    config = {}
) {
    const response = await api.delete(
        url,
        config
    )

    return response.data
}

/*
|--------------------------------------------------------------------------
| FILE UPLOAD
|--------------------------------------------------------------------------
*/

export async function upload(
    url,
    formData,
    config = {}
) {
    const response = await api.post(
        url,
        formData,
        {
            ...config,
            headers: {
                ...config.headers,
                'Content-Type':
                    'multipart/form-data',
            },
        }
    )

    return response.data
}

/*
|--------------------------------------------------------------------------
| DOWNLOAD
|--------------------------------------------------------------------------
*/

export async function download(
    url,
    params = {},
    config = {}
) {
    const response = await api.get(url, {
        params,
        responseType: 'blob',
        ...config,
    })

    return response
}

/*
|--------------------------------------------------------------------------
| AUTH API
|--------------------------------------------------------------------------
*/

export const authApi = {
    async login(email, password) {
        const data = await post(
            '/auth/login',
            {
                email,
                password,
            }
        )

        if (data.token) {
            setToken(data.token)
        }

        if (data.user) {
            setUser(data.user)
        }

        return data
    },

    async me() {
        const data = await get('/auth/me')

        if (data.user) {
            setUser(data.user)
        }

        return data
    },

    async logout() {
        try {
            return await post('/auth/logout')
        } finally {
            clearAuth()
        }
    },

    isAuthenticated() {
        return !!getToken()
    },

    getCurrentUser() {
        return getUser()
    },

    getToken() {
        return getToken()
    },
}

/*
|--------------------------------------------------------------------------
| PUBLIC WEBSITE API
|--------------------------------------------------------------------------
*/

export const publicApi = {
    company() {
        return get('/public/website/company')
    },

    services(params = {}) {
        return get(
            '/public/website/services',
            params
        )
    },

    articles(params = {}) {
        return get(
            '/public/website/articles',
            params
        )
    },

    article(slug) {
        return get(
            `/public/website/articles/${slug}`
        )
    },

    sendInquiry(data) {
        return post(
            '/public/website/inquiries',
            data
        )
    },
}

/*
|--------------------------------------------------------------------------
| ADMIN API
|--------------------------------------------------------------------------
*/

export const adminApi = {
    dashboard() {
        return get('/admin/dashboard')
    },

    website: {
        content(params = {}) {
            return get(
                '/admin/website/content',
                params
            )
        },

        services: {
            list(params = {}) {
                return get(
                    '/admin/website/services',
                    params
                )
            },

            show(id) {
                return get(
                    `/admin/website/services/${id}`
                )
            },

            create(data) {
                return post(
                    '/admin/website/services',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/admin/website/services/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/admin/website/services/${id}`
                )
            },
        },

        articles: {
            list(params = {}) {
                return get(
                    '/admin/website/articles',
                    params
                )
            },

            show(id) {
                return get(
                    `/admin/website/articles/${id}`
                )
            },

            create(data) {
                return post(
                    '/admin/website/articles',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/admin/website/articles/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/admin/website/articles/${id}`
                )
            },
        },

        media: {
            list(params = {}) {
                return get(
                    '/admin/website/media',
                    params
                )
            },

            upload(formData) {
                return upload(
                    '/admin/website/media',
                    formData
                )
            },

            delete(id) {
                return destroy(
                    `/admin/website/media/${id}`
                )
            },
        },

        inquiries: {
            list(params = {}) {
                return get(
                    '/admin/website/inquiries',
                    params
                )
            },

            show(id) {
                return get(
                    `/admin/website/inquiries/${id}`
                )
            },

            update(id, data) {
                return put(
                    `/admin/website/inquiries/${id}`,
                    data
                )
            },
        },

        settings: {
            list(params = {}) {
                return get(
                    '/admin/website/settings',
                    params
                )
            },

            update(data) {
                return put(
                    '/admin/website/settings',
                    data
                )
            },
        },

        users: {
            list(params = {}) {
                return get(
                    '/admin/users',
                    params
                )
            },

            show(id) {
                return get(
                    `/admin/users/${id}`
                )
            },

            create(data) {
                return post(
                    '/admin/users',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/admin/users/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/admin/users/${id}`
                )
            },
        },
    },
}

/*
|--------------------------------------------------------------------------
| ERP API
|--------------------------------------------------------------------------
*/

export const erpApi = {
    dashboard() {
        return get('/erp/dashboard')
    },

    master: {
        products: {
            list(params = {}) {
                return api.get('/erp/products', { params })
            },

            get(id) {
                return api.get(`/erp/products/${id}`)
            },

            create(data) {
                return api.post('/erp/products', data)
            },

            update(id, data) {
                return api.put(`/erp/products/${id}`, data)
            },

            remove(id) {
                return api.delete(`/erp/products/${id}`)
            },
        },

        partners: {
            list(params = {}) {
                return get(
                    '/erp/master/partners',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/master/partners/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/master/partners',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/master/partners/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/erp/master/partners/${id}`
                )
            },
        },

        employees: {
            list(params = {}) {
                return get(
                    '/erp/employees',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/employees/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/employees',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/employees/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/erp/employees/${id}`
                )
            },
        },

        general: {
            list(params = {}) {
                return get(
                    '/erp/generals',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/generals/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/generals',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/generals/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/erp/generals/${id}`
                )
            },
        },

        departments: {
            list(params = {}) {
                return api.get('/erp/departments', { params })
            },

            get(id) {
                return api.get(`/erp/departments/${id}`)
            },

            create(data) {
                return api.post('/erp/departments', data)
            },

            update(id, data) {
                return api.put(`/erp/departments/${id}`, data)
            },

            remove(id) {
                return api.delete(`/erp/departments/${id}`)
            },
        },

        truckTypes: {
            list(params = {}) {
                return get('/erp/truck-types', params)
            },

            show(id) {
                return get(`/erp/truck-types/${id}`)
            },

            create(data) {
                return post('/erp/truck-types', data)
            },

            update(id, data) {
                return put(`/erp/truck-types/${id}`, data)
            },

            delete(id) {
                return destroy(`/erp/truck-types/${id}`)
            },   
        },

        trucks: {
            list(params = {}) {
                return get('/erp/trucks', params)
            },

            show(id) {
                return get(`/erp/trucks/${id}`)
            },

            create(data) {
                return post('/erp/trucks', data)
            },

            update(id, data) {
                return put(`/erp/trucks/${id}`, data)
            },

            delete(id) {
                return destroy(`/erp/trucks/${id}`)
            },

            plateHistory(id) {
                return api.get(
                    `/erp/trucks/${id}/plate-history`
                )
            },

            changePlate(id, data) {
                return api.post(
                    `/erp/trucks/${id}/change-plate`,
                    data
                )
            },
        },

        shippingTariffs: {
            list(params = {}) {
                return get('/erp/shipping-tariffs', params)
            },

            show(id) {
                return get(`/erp/shipping-tariffs/${id}`)
            },

            create(data) {
                return post('/erp/shipping-tariffs', data)
            },

            update(id, data) {
                return put(`/erp/shipping-tariffs/${id}`, data)
            },

            delete(id) {
                return destroy(`/erp/shipping-tariffs/${id}`)
            }
        },

        provinces: {
            list(params = {}) {
                return get('/erp/provinces', params)
            },

            show(id) {
                return get(`/erp/provinces/${id}`)
            },

            create(data) {
                return post('/erp/provinces', data)
            },

            update(id, data) {
                return put(`/erp/provinces/${id}`, data)
            },
            
            delete(id) {
                return destroy(`/erp/provinces/${id}`)
            }
        },

        cities: {
            list(params = {}) {
                return get('/erp/cities', params)
            },

            show(id) {
                return get(`/erp/cities/${id}`)
            },

            create(data) {
                return post('/erp/cities', data)
            },

            update(id, data) {
                return put(`/erp/cities/${id}`, data)
            },

            delete(id) {
                return destroy(`/erp/cities/${id}`)
            }
        },

    },

    sales: {
        invoices: {
            list(params = {}) {
                return get(
                    '/erp/sales/invoices',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/sales/invoices/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/sales/invoices',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/sales/invoices/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/erp/sales/invoices/${id}`
                )
            },
        },
    },

    purchases: {
        requests: {
            list(params = {}) {
                return get(
                    '/erp/purchases/requests',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/purchases/requests/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/purchases/requests',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/purchases/requests/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/erp/purchases/requests/${id}`
                )
            },
        },

        orders: {
            list(params = {}) {
                return get(
                    '/erp/purchases/orders',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/purchases/orders/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/purchases/orders',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/purchases/orders/${id}`,
                    data
                )
            },

            delete(id) {
                return destroy(
                    `/erp/purchases/orders/${id}`
                )
            },
        },

        receipts: {
            list(params = {}) {
                return get(
                    '/erp/purchases/receipts',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/purchases/receipts/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/purchases/receipts',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/purchases/receipts/${id}`,
                    data
                )
            },
        },
    },

    shipments: {
        list(params = {}) {
            return get(
                '/erp/shipments',
                params
            )
        },

        show(id) {
            return get(
                `/erp/shipments/${id}`
            )
        },

        create(data) {
            return post(
                '/erp/shipments',
                data
            )
        },

        update(id, data) {
            return put(
                `/erp/shipments/${id}`,
                data
            )
        },

        delete(id) {
            return destroy(
                `/erp/shipments/${id}`
            )
        },
    },

    inventory: {
        stocks: {
            list(params = {}) {
                return get(
                    '/erp/inventory/stocks',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/inventory/stocks/${id}`
                )
            },
        },

        adjustments: {
            list(params = {}) {
                return get(
                    '/erp/inventory/adjustments',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/inventory/adjustments/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/inventory/adjustments',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/inventory/adjustments/${id}`,
                    data
                )
            },
        },

        issues: {
            list(params = {}) {
                return get(
                    '/erp/inventory/issues',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/inventory/issues/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/inventory/issues',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/inventory/issues/${id}`,
                    data
                )
            },
        },

        mutations: {
            list(params = {}) {
                return get(
                    '/erp/inventory/mutations',
                    params
                )
            },

            show(id) {
                return get(
                    `/erp/inventory/mutations/${id}`
                )
            },

            create(data) {
                return post(
                    '/erp/inventory/mutations',
                    data
                )
            },

            update(id, data) {
                return put(
                    `/erp/inventory/mutations/${id}`,
                    data
                )
            },
        },
    },

    finance: {
        // Disiapkan untuk tahap accounting berikutnya.
    },

    reports: {
        sales(params = {}) {
            return get(
                '/erp/reports/sales',
                params
            )
        },

        purchases(params = {}) {
            return get(
                '/erp/reports/purchases',
                params
            )
        },

        inventory(params = {}) {
            return get(
                '/erp/reports/inventory',
                params
            )
        },

        finance(params = {}) {
            return get(
                '/erp/reports/finance',
                params
            )
        },
    },
}

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default api
