<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
<div class="min-h-screen grid grid-rows-[auto_1fr_auto]">
  <header>
    <NavBar />
  </header>

  <main class="app-container py-6">
    <div class="app-grid">
      <section class="app-content">
        <RouterView />
      </section>
      <aside class="app-aside space-y-4">
        <div class="card">
          <h3 class="font-medium mb-2">Hinweise</h3>
          <ul class="list-disc pl-5 text-sm">
            <li>Keine sensiblen Daten im Formular, die nicht abgefragt werden.</li>
            <li>PLZ-Regel bei Abholung beachten.</li>
          </ul>
        </div>
        <div class="card">
          <h3 class="font-medium mb-2">Öffnungszeiten</h3>
          <p class="text-sm text-neutral-400">Mo. - Fr.: 10:00 Uhr - 16:00 Uhr</p>
          <p class="text-sm text-neutral-400">Samstag: 11:00 Uhr – 14:00 Uhr</p>
          <p class="text-sm text-neutral-400">Sonntag: Geschlossen</p>
        </div>
      </aside>
    </div>
  </main>

  <footer class="footer-bar">
    <div class="app-container py-4 flex flex-col gap-2 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">
      <span>© 2025 · Kleiderhilfe Bremervörde e. V. - Hilfe ohne Umwege</span>
      <nav class="flex flex-wrap gap-4">
        <RouterLink to="/impressum" class="btn-link">Impressum</RouterLink>
        <RouterLink to="/datenschutz" class="btn-link">Datenschutz</RouterLink>
      </nav>
    </div>
  </footer>
</div>
</template>

<style scoped>

</style>
