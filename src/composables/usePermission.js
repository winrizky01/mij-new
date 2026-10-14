import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermission() {
    const auth = useAuthStore()

    const permissions = computed(() => {
        return auth.user?.permissions ?? []
    })

    function can(permission) {
        return permissions.value.includes(permission)
    }

    function canAny(permissionList) {
        return permissionList.some(permission => can(permission))
    }

    function canAll(permissionList) {
        return permissionList.every(permission => can(permission))
    }

    return { permissions, can, canAny, canAll }
}