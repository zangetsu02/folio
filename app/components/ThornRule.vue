<script setup lang="ts">
// Divisore: un filo sottile, spesso al centro e affilato fino a sparire alle
// due estremita'. Niente ornamento in mezzo -- la spina c'era e faceva rumore:
// a quella scala non si leggeva come una spina, solo come un segno sporco.
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
    <!-- un filo solo, continuo: si affila verso le estremita', spazio negativo
         e non un bordo. Prima erano due tratti con una spina a chiudere il
         buco in mezzo; tolta la spina, il buco non deve restare. -->
    <path
      d="M0 7.5 L200 6.6 L400 7.5 L200 7.5 Z"
      fill="currentColor"
    />
  </svg>
</template>
