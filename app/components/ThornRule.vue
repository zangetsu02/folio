<script setup lang="ts">
// Divisore a spine: un filo sottile che da entrambi i lati si affila fino a
// sparire, con una spina al centro. Sostituisce la riga orizzontale piatta.
</script>

<template>
  <svg
    class="w-full"
    height="14"
    viewBox="0 0 400 14"
    preserveAspectRatio="none"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <!-- il filo si affila verso le estremita': spazio negativo, non un bordo -->
    <path
      d="M0 7.4 L186 6.6 L186 7.4 Z M400 7.4 L214 6.6 L214 7.4 Z"
      fill="currentColor"
    />
    <g transform="translate(200 7)" fill="currentColor">
      <path d="M0 0 C1.2 -1.6 2 -3.4 1.4 -6.4 C0.4 -3.4 -0.8 -1.6 0 0 Z" />
      <path d="M0 0 C1.2 1.6 2 3.4 1.4 6.4 C0.4 3.4 -0.8 1.6 0 0 Z" />
      <path d="M0 0 C-3.4 -0.8 -7 -1.4 -11.6 -0.6 C-7 0.2 -3.4 0.6 0 0 Z" />
      <path d="M0 0 C3.4 -0.8 7 -1.4 11.6 -0.6 C7 0.2 3.4 0.6 0 0 Z" />
    </g>
  </svg>
</template>
