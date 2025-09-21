<script setup lang="ts">
import CardsView from '../components/CardsView.vue'
import NoPostit from '../components/NoPostIt.vue'
</script>

<template>
  <div class="p-6">
    <!-- Message de bienvenue -->
    <NoPostit />

    <!-- Grille de post-it -->
    <CardsView />
  </div>
</template>
