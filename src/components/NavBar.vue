<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, watch,} from "vue";
import { useRoute} from "vue-router";

const open = ref(false)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
<nav class="app-container nav-bar" arial_label="Hauptnavigation">
  <h1 class="nav-title">Kleiderspende</h1>

  <!-- Desktop-Navigation -->
  <ul class="nav-items only-desktop">
    <li><RouterLink to="/"              class="btn-link" exact-active-class="link-active">Start</RouterLink></li>
    <li><RouterLink to="/registrierung" class="btn-link" active-class="link-active">Registrierung</RouterLink></li>
  </ul>

  <!-- Burger (nur Mobile/Tablet) -->
  <button
      class="burger only-mobile"
      type="button"
      aria-label="Menü öffnen"
      :aria-expanded="open ? 'true' : 'false'"
      aria-controls="mobile-drawer"
      @click="toggle"
  >
    <span class="sr-only">Menü</span>
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
    </svg>
  </button>

  <!-- Drawer -->
<div
  id="mobile-drawer"
  class="drawer"
  :class="{ 'is-open': open}"
  role="dialog"
  arial-modal="true"
  arial-label="Mobile Navigation"
  ></div>

  <!-- Backdrop -->
  <div class="drawer-backdrop" @click="close"></div>

  <!-- Panel -->
  <div class="drawer-panel">
    <button class="drawer-close" type="button" arial-label="Menü schließen" @click="close">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
      </svg>
    </button>

    <h2 class="text-lg font-semibold">Menü</h2>
    <ul class="drawer-nav-items">
      <li><RouterLink to="/"              class="btn-link" exact-active-class="link-active"   @click="close">Start</RouterLink></li>
      <li><RouterLink to="/registrierung" class="btn-link" active-class="link-active"         @click="close">Registrierung</RouterLink></li>
    </ul>
  </div>

</nav>
</template>

<style scoped>

</style>