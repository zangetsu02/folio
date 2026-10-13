import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  // Lo scroll morbido intercetta la rotella: e' nella stessa famiglia di
  // effetti che danno fastidio a chi e' sensibile al movimento, quindi chi ha
  // chiesto meno animazioni resta sullo scroll nativo del browser.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  const lenis = new Lenis({
    duration: 0.9,
    // smussata in uscita: parte subito, si posa senza rimbalzare
    easing: t => 1 - (1 - t) ** 3,
    // il touch mantiene lo scroll nativo: su mobile intercettarlo peggiora
    // sempre, e il sistema operativo lo fa gia' meglio
    smoothWheel: true,
    syncTouch: false,
  })

  let frame = 0
  function raf(time: number) {
    lenis.raf(time)
    frame = requestAnimationFrame(raf)
  }
  frame = requestAnimationFrame(raf)

  // Il router non scrolla da solo quando Lenis possiede lo scroll.
  const router = useRouter()
  router.afterEach(() => {
    lenis.scrollTo(0, { immediate: true })
  })

  return {
    provide: { lenis },
    hooks: {
      'app:unmounted': () => {
        cancelAnimationFrame(frame)
        lenis.destroy()
      },
    },
  }
})
