
import { ref } from 'vue'

const toast = ref({
    show: false,
    type: 'success',
    title: '',
    message: '',
})

let timeoutId = null

export function useToast() {
    function showToast(message, type = 'success', title = '') {
        clearTimeout(timeoutId)

        const titles = {
            success: 'Berhasil',
            error: 'Terjadi Kesalahan',
            warning: 'Perhatian',
            info: 'Informasi',
        }

        toast.value = {
            show: true,
            type,
            title: title || titles[type] || 'Informasi',
            message:
                typeof message === 'string'
                    ? message
                    : 'Terjadi kesalahan. Silakan coba lagi.',
        }

        timeoutId = setTimeout(() => {
            toast.value.show = false
        }, 4000)
    }

    function success(message) {
        showToast(message, 'success')
    }

    function error(message) {
        showToast(message, 'error')
    }

    function warning(message) {
        showToast(message, 'warning')
    }

    function info(message) {
        showToast(message, 'info')
    }

    function dismiss() {
        clearTimeout(timeoutId)
        toast.value.show = false
    }

    return {
        toast,
        showToast,
        success,
        error,
        warning,
        info,
        dismiss,
    }
}
