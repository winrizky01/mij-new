<script setup>
import PublicNavbar from '../components/public/PublicNavbar.vue'
import PublicFooter from '../components/public/PublicFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <PublicNavbar />

    <main>
      <router-view />
    </main>

    <PublicFooter />
  </div>
</template>