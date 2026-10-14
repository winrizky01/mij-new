<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  ShieldCheck,
  Users,
  KeyRound,
  Search,
  Save,
  LockKeyhole,
  CheckCircle2,
  AlertTriangle,
  UserRoundCog,
} from 'lucide-vue-next'
import { erpApi } from '@/services/api'
import { getApiError } from '@/services/api'

const activeTab = ref('users')
const search = ref('')
const selectedRole = ref('erp_super_admin')
const notice = ref('')
const noticeType = ref('info')
const loading = ref(false)
const saving = ref(false)

const users = ref([])
const roles = ref([])
const permissions = ref([])

// Perubahan role user yang belum disimpan.
const pendingUserRoles = reactive({})

// Metadata tampilan; data role sebenarnya tetap dari API.
const roleMeta = {
  admin: {
    label: 'Admin',
    description: 'Role admin yang sudah ada',
  },
  erp_super_admin: {
    label: 'Super Admin ERP',
    description: 'Akses administratif ERP',
  },
  erp_auditor: {
    label: 'ERP Auditor',
    description: 'Melihat data dan audit log',
  },
  central_approver: {
    label: 'Central Approver',
    description: 'Approval lintas modul',
  },
  sales_staff: {
    label: 'Sales Staff',
    description: 'Operasional sales',
  },
  sales_manager: {
    label: 'Sales Manager',
    description: 'Pengelolaan sales',
  },
  purchasing_staff: {
    label: 'Purchasing Staff',
    description: 'Operasional pembelian',
  },
  purchasing_manager: {
    label: 'Purchasing Manager',
    description: 'Pengelolaan pembelian',
  },
  stock_staff: {
    label: 'Stock Staff',
    description: 'Operasional gudang',
  },
  stock_manager: {
    label: 'Stock Manager',
    description: 'Pengelolaan stok',
  },
  shipment_staff: {
    label: 'Shipment Staff',
    description: 'Operasional pengiriman',
  },
  shipment_manager: {
    label: 'Shipment Manager',
    description: 'Pengelolaan pengiriman',
  },
  accounting_staff: {
    label: 'Accounting Staff',
    description: 'Operasional keuangan',
  },
  accounting_manager: {
    label: 'Accounting Manager',
    description: 'Pengelolaan keuangan',
  },
}

const groupDefinitions = [
  {
    label: 'Dashboard & Master Data',
    prefixes: ['dashboard.', 'master-data.'],
  },
  { label: 'Quotation', prefixes: ['quotations.'] },
  { label: 'Purchase Request', prefixes: ['purchase-requests.'] },
  { label: 'Purchase Order', prefixes: ['purchase-orders.'] },
  {
    label: 'Gudang & Stok',
    prefixes: [
      'goods-receipts.',
      'stock-issues.',
      'stock-adjustments.',
      'stock-movements.',
      'stock-mutations.',
      'stocks.',
    ],
  },
  { label: 'Shipment', prefixes: ['shipments.'] },
  {
    label: 'Invoice & Pembayaran',
    prefixes: ['sales-invoices.', 'payments.'],
  },
  {
    label: 'Akuntansi & Administrasi',
    prefixes: [
      'accounting.',
      'users.',
      'roles.',
      'permissions.',
      'approval-policies.',
      'audit-logs.',
    ],
  },
]

const filteredUsers = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) return users.value

  return users.value.filter(user =>
    user.name.toLowerCase().includes(keyword) ||
    user.roles.some(role => role.toLowerCase().includes(keyword)) ||
    String(user.id).includes(keyword)
  )
})

const selectedRoleData = computed(() =>
  roles.value.find(role => role.name === selectedRole.value)
)

const selectedPermissions = computed(() =>
  selectedRoleData.value?.permissions ?? []
)

const permissionGroups = computed(() => {
  const groups = groupDefinitions.map(group => ({
    label: group.label,
    items: permissions.value
      .map(permission => permission.name)
      .filter(name => group.prefixes.some(prefix => name.startsWith(prefix))),
  }))

  const knownPermissions = groups.flatMap(group => group.items)
  const otherPermissions = permissions.value
    .map(permission => permission.name)
    .filter(name => !knownPermissions.includes(name))

  if (otherPermissions.length) {
    groups.push({
      label: 'Permission Lainnya',
      items: otherPermissions,
    })
  }

  return groups.filter(group => group.items.length > 0)
})

function showNotice(message, type = 'info') {
  notice.value = message
  noticeType.value = type
}

function normalizeUser(user) {
  return {
    ...user,
    name: user.name || user.employee?.name || `User ${user.id}`,
    roles: (user.roles ?? []).map(role =>
      typeof role === 'string' ? role : role.name
    ),
  }
}

function normalizeRole(role) {
  const rolePermissionIds = role.permission_ids ?? []
  const rolePermissionNames = (role.permissions ?? []).map(permission =>
    typeof permission === 'string' ? permission : permission.name
  )

  return {
    ...role,
    label: roleMeta[role.name]?.label ?? role.name,
    description: roleMeta[role.name]?.description ?? role.name,
    permission_ids: rolePermissionIds,
    permissions: rolePermissionNames,
  }
}

async function loadData() {
  loading.value = true
  showNotice('Memuat data Manajemen Akses...')

  try {
    const [userResponse, roleResponse, permissionResponse] =
      await Promise.all([
        erpApi.accessManagement.users(),
        erpApi.accessManagement.roles(),
        erpApi.accessManagement.permissions(),
      ])

    users.value = (userResponse.data ?? []).map(normalizeUser)
    roles.value = (roleResponse.data ?? []).map(normalizeRole)
    permissions.value = permissionResponse.data ?? []

    // Pastikan role terpilih tersedia di database.
    if (!roles.value.some(role => role.name === selectedRole.value)) {
      selectedRole.value = roles.value[0]?.name ?? ''
    }

    Object.keys(pendingUserRoles).forEach(id => {
      delete pendingUserRoles[id]
    })

    showNotice('Data berhasil dimuat dari database.', 'success')
  } catch (error) {
    const apiError = getApiError(error)
    showNotice(apiError.message, 'error')
  } finally {
    loading.value = false
  }
}

function hasPermission(permissionName) {
  return selectedPermissions.value.includes(permissionName)
}

function togglePermission(permissionName, checked) {
  const role = selectedRoleData.value

  if (!role || ['admin', 'erp_super_admin'].includes(role.name)) return

  const current = new Set(role.permissions)

  if (checked) {
    current.add(permissionName)
  } else {
    current.delete(permissionName)
  }

  role.permissions = [...current]
}

function getPendingRoleNames(user) {
  return pendingUserRoles[user.id] ?? [...user.roles]
}

function changeUserRole(user, roleName, checked) {
  // Jangan menghapus role admin Kang Ikik dari halaman ini.
  if (user.id === 1 && roleName === 'admin' && !checked) {
    showNotice('Role admin Kang Ikik tetap dipertahankan.', 'error')
    return
  }

  const current = new Set(getPendingRoleNames(user))

  if (checked) {
    current.add(roleName)
  } else {
    current.delete(roleName)
  }

  pendingUserRoles[user.id] = [...current]
}

function userHasRole(user, roleName) {
  return getPendingRoleNames(user).includes(roleName)
}

async function saveUserRoles(user) {
  const roleNames = getPendingRoleNames(user)
  const roleIds = roles.value
    .filter(role => roleNames.includes(role.name))
    .map(role => role.id)

  saving.value = true

  try {
    await erpApi.accessManagement.updateUserRoles(user.id, roleIds)

    // Muat ulang agar role mengikuti kondisi sebenarnya di server.
    const response = await erpApi.accessManagement.users()
    users.value = (response.data ?? []).map(normalizeUser)
    delete pendingUserRoles[user.id]

    showNotice(`Role untuk ${user.name} berhasil disimpan.`, 'success')
  } catch (error) {
    showNotice(getApiError(error).message, 'error')
  } finally {
    saving.value = false
  }
}

async function saveChanges() {
  const role = selectedRoleData.value

  if (!role) {
    showNotice('Role tidak ditemukan.', 'error')
    return
  }

  if (['admin', 'erp_super_admin'].includes(role.name)) {
    showNotice('Permission role ini dikunci dari halaman ini.', 'error')
    return
  }

  saving.value = true

  try {
    const permissionIds = permissions.value
      .filter(permission => role.permissions.includes(permission.name))
      .map(permission => permission.id)

    await erpApi.accessManagement.updateRolePermissions(
      role.id,
      permissionIds
    )

    const response = await erpApi.accessManagement.roles()
    roles.value = (response.data ?? []).map(normalizeRole)

    showNotice(
      `Permission role ${role.name} berhasil disimpan.`,
      'success'
    )
  } catch (error) {
    showNotice(getApiError(error).message, 'error')
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="min-h-full space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div class="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <span>ERP</span>
          <span>/</span>
          <span>Pengaturan</span>
          <span>/</span>
          <span class="text-slate-700">Manajemen Akses</span>
        </div>

        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Manajemen Akses
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Kelola pengguna, role, dan hak akses modul ERP MJI.
        </p>
      </div>

      <div class="flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
        <ShieldCheck class="h-5 w-5 text-sky-600" />
        <div>
          <p class="text-sm font-semibold text-sky-900">Super Admin ERP</p>
          <p class="text-xs text-sky-700">Akses administratif</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-slate-200">
      <button
        type="button"
        class="inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition"
        :class="activeTab === 'users'
          ? 'border-sky-600 text-sky-700'
          : 'border-transparent text-slate-500 hover:text-slate-800'"
        @click="activeTab = 'users'; search = ''; notice = ''"
      >
        <Users class="h-4 w-4" />
        Manajemen User
      </button>

      <button
        type="button"
        class="inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition"
        :class="activeTab === 'roles'
          ? 'border-sky-600 text-sky-700'
          : 'border-transparent text-slate-500 hover:text-slate-800'"
        @click="activeTab = 'roles'; search = ''; notice = ''"
      >
        <KeyRound class="h-4 w-4" />
        Role & Permission
      </button>
    </div>

    <!-- Notification -->
    <div
    v-if="notice"
    class="flex items-start gap-2 rounded-lg border px-4 py-3 text-sm"
    :class="{
        'border-sky-100 bg-sky-50 text-sky-800': noticeType === 'info',
        'border-emerald-100 bg-emerald-50 text-emerald-800': noticeType === 'success',
        'border-red-100 bg-red-50 text-red-800': noticeType === 'error',
    }"
    >
    <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
    {{ notice }}
    </div>

    <!-- Users -->
    <section
      v-if="activeTab === 'users'"
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div class="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-semibold text-slate-900">Daftar Pengguna</h2>
          <p class="mt-1 text-sm text-slate-500">
            Kelola role yang diberikan kepada setiap akun.
          </p>
        </div>

        <label class="relative block w-full sm:max-w-xs">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            v-model="search"
            type="search"
            placeholder="Cari nama, ID, atau role..."
            class="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-4 font-semibold">Pengguna</th>
              <th class="px-5 py-4 font-semibold">Role saat ini</th>
              <th class="px-5 py-4 font-semibold">Status</th>
              <th class="px-5 py-4 font-semibold">Atur role</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/70">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 font-semibold text-sky-700">
                    {{ user.name.split(' ').map(part => part[0]).slice(0, 2).join('') }}
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ user.name }}</p>
                    <p class="text-xs text-slate-500">User ID: {{ user.id }}</p>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4">
                <div v-if="user.roles.length" class="flex flex-wrap gap-1.5">
                  <span
                    v-for="role in user.roles"
                    :key="role"
                    class="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                  >
                    {{ role }}
                  </span>
                </div>
                <span v-else class="text-slate-400">Belum ada role</span>
              </td>

              <td class="px-5 py-4">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 class="h-3.5 w-3.5" />
                  Aktif
                </span>
              </td>

              <td class="px-5 py-4">
                <details class="group relative">
                  <summary class="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <UserRoundCog class="h-4 w-4" />
                    Atur role
                  </summary>

                  <div class="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                    <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Pilih role
                    </p>

                    <label
                      v-for="role in roles"
                      :key="role.name"
                      class="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-2 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        class="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        :checked="userHasRole(user, role.name)"
                        @change="changeUserRole(user, role.name, $event.target.checked)"
                      />
                      <span>
                        <span class="block text-xs font-semibold text-slate-800">
                          {{ role.label }}
                        </span>
                        <span class="block text-[11px] text-slate-500">
                          {{ role.name }}
                        </span>
                      </span>
                    </label>
                    <div class="mt-3 border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            :disabled="saving"
                            class="w-full rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                            @click="saveUserRoles(user)"
                        >
                            {{ saving ? 'Menyimpan...' : 'Simpan role user' }}
                        </button>
                    </div>
                  </div>
                </details>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="px-5 py-12 text-center text-sm text-slate-500">
                Pengguna tidak ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Roles & permissions -->
    <section v-else class="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
      <aside class="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 p-4">
          <h2 class="font-semibold text-slate-900">Daftar Role</h2>
          <p class="mt-1 text-xs text-slate-500">Pilih role untuk melihat hak aksesnya.</p>
        </div>

        <div class="space-y-1 p-2">
          <button
            v-for="role in roles"
            :key="role.name"
            type="button"
            class="w-full rounded-xl p-3 text-left transition"
            :class="selectedRole === role.name
              ? 'bg-sky-50 ring-1 ring-sky-100'
              : 'hover:bg-slate-50'"
            @click="selectedRole = role.name; notice = ''"
          >
            <span class="block text-sm font-semibold"
              :class="selectedRole === role.name ? 'text-sky-800' : 'text-slate-800'">
              {{ role.label }}
            </span>
            <span class="mt-1 block text-xs text-slate-500">{{ role.name }}</span>
          </button>
        </div>
      </aside>

      <div class="min-w-0 space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div class="mb-2 flex items-center gap-2">
                <LockKeyhole class="h-5 w-5 text-sky-600" />
                <h2 class="text-lg font-bold text-slate-900">
                  {{ selectedRoleData?.label }}
                </h2>
              </div>
              <p class="text-sm text-slate-500">{{ selectedRoleData?.description }}</p>
              <p class="mt-2 text-xs text-slate-400">{{ selectedRole }}</p>
            </div>

            <button
                type="button"
                :disabled="saving || loading || ['admin', 'erp_super_admin'].includes(selectedRole)"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                @click="saveChanges"
                >
                <Save class="h-4 w-4" />
                {{ saving ? 'Menyimpan...' : 'Simpan perubahan' }}
            </button>
          </div>

          <div
            v-if="selectedRole === 'erp_super_admin'"
            class="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
          >
            Role Super Admin memiliki seluruh permission. Pengubahan hak akses
            Super Admin dikunci dari halaman ini.
          </div>

          <div class="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span class="text-sm text-slate-600">Total permission aktif</span>
            <span class="rounded-lg bg-white px-3 py-1 font-bold text-slate-900 ring-1 ring-slate-200">
              {{ selectedPermissions.length }}
            </span>
          </div>
        </div>

        <div
          v-for="group in permissionGroups"
          :key="group.label"
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="border-b border-slate-100 bg-slate-50 px-5 py-3.5">
            <h3 class="text-sm font-bold text-slate-800">{{ group.label }}</h3>
          </div>

          <div class="grid gap-2 p-4 sm:grid-cols-2">
            <label
              v-for="permission in group.items"
              :key="permission"
              class="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5 transition"
              :class="hasPermission(permission) ? 'bg-sky-50/50' : 'hover:bg-slate-50'"
            >
              <input
                type="checkbox"
                class="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                :checked="hasPermission(permission)"
                :disabled="['admin', 'erp_super_admin'].includes(selectedRole)"
                @change="togglePermission(permission, $event.target.checked)"
              />
              <span class="break-all text-xs font-medium text-slate-700">
                {{ permission }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
