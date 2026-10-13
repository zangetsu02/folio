<script setup lang="ts">
// Sigillo a spine, nel linguaggio del cyber sigilism: linee affusolate che si
// chiudono a punta, ramificazione simmetrica che si irradia, nero pieno.
//
// Una sola spina ruotata attorno al centro invece di otto path disegnati a
// mano: la simmetria e' esatta per costruzione e la forma resta modificabile
// in un punto solo.
withDefaults(defineProps<{ size?: number }>(), { size: 56 })

// angolo in gradi, lunghezza relativa
const thorns: [number, number][] = [
  [0, 1],
  [34, 0.72],
  [-34, 0.72],
  [72, 0.52],
  [-72, 0.52],
  [116, 0.34],
  [-116, 0.34],
  [180, 0.44],
]
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="-32 -32 64 64"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="currentColor">
      <g
        v-for="([angle, len], i) in thorns"
        :key="i"
        :transform="`rotate(${angle}) scale(${len < 0.5 ? 0.85 : 1} ${len})`"
      >
        <!-- larga alla base, curva, chiusa a punta -->
        <path d="M0 0 C3.6 -5.5 6.2 -13 2.2 -29 C1.4 -14 -1.2 -6 0 0 Z" />
      </g>

      <!-- uncini bassi, in controverso: spezzano la simmetria radiale -->
      <path d="M0 2 C5 3.4 9.6 6 13.4 11.6 C8.6 7 4 4.2 0 2 Z" />
      <path d="M0 2 C-5 3.4 -9.6 6 -13.4 11.6 C-8.6 7 -4 4.2 0 2 Z" />

      <!-- seme: lo spazio negativo intorno e' parte della forma -->
      <circle cx="0" cy="0" r="2.1" />
      <circle cx="0" cy="0" r="5.4" fill="none" stroke="currentColor" stroke-width="0.7" />
    </g>
  </svg>
</template>
