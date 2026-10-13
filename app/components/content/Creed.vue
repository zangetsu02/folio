<template>
  <!-- Chiusura della home: non e' una sezione numerata perche' non e' un
       capitolo, e' il principio che tiene insieme gli altri. -->
  <p
    class="font-display mt-14 border-t border-(--ui-border) pt-8 text-xl italic leading-snug text-muted sm:text-2xl"
    data-animate
    style="--stagger: 4"
  >
    <slot mdc-unwrap="p" />
  </p>
</template>
