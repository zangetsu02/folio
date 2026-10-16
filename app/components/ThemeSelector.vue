<script setup lang="ts">
const colorMode = useColorMode()

const nextTheme = computed(() => (colorMode.value === 'dark' ? 'light' : 'dark'))

function switchTheme() {
  colorMode.preference = nextTheme.value
}

function startViewTransition(event: MouseEvent) {
  if (!document.startViewTransition) {
    switchTheme()
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )

  const transition = document.startViewTransition(() => {
    switchTheme()
  })

  transition.ready.then(() => {
    const duration = 600
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'cubic-bezier(.76,.32,.29,.99)',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
}
</script>

<template>
  <!-- La parola e non il pallino: un cerchio nero non dice cosa fa, e il
       resto della fascia e' tipografia. L'etichetta dice l'azione, non lo
       stato, cosi' combacia con l'aria-label. -->
  <ClientOnly>
    <UButton
      class="p-0 font-mono text-xs text-muted hover:text-primary transition-colors"
      variant="link"
      :aria-label="`Switch to ${nextTheme} mode`"
      @click="startViewTransition"
    >
      {{ nextTheme }}
    </UButton>
    <template #fallback>
      <span class="font-mono text-xs text-muted">theme</span>
    </template>
  </ClientOnly>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  z-index: 9999;
}
::view-transition-old(root) {
  z-index: 1;
}
</style>
