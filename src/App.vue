<script setup lang="ts">
import HeaderView from './components/HeaderView.vue'
import FooterView from './components/FooterView.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <HeaderView />
    <div class="flex-1">
      <RouterView />
    </div>
    <FooterView />
  </div>
</template>
