import api from '@/services/api'

function extractRows(response) {
    const data = response?.data?.data

    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data

    return []
}

function extractItem(response) {
    return response?.data?.data ?? null
}

export const websiteContentService = {
    async getPages() {
        const response = await api.get('/website/pages')
        return extractRows(response)
    },

    async getSections(params = {}) {
        const response = await api.get('/website/sections', { params })
        return extractRows(response)
    },

    async createSection(payload) {
        const response = await api.post('/website/sections', payload)
        return extractItem(response)
    },

    async updateSection(id, payload) {
        const response = await api.put(`/website/sections/${id}`, payload)
        return extractItem(response)
    },

    async deleteSection(id) {
        return api.delete(`/website/sections/${id}`)
    },

    async reorderSections(pageId, sections) {
        return api.put('/website/sections/reorder', {
            page_id: pageId,
            sections: sections.map((section, index) => ({
                id: section.id,
                sort_order: index,
            })),
        })
    },

    async uploadImage(file) {
        const formData = new FormData()
        formData.append('image', file)

        const response = await api.post(
            '/website/media/upload',
            formData
        )

        return extractItem(response)
    },
}