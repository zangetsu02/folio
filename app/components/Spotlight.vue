<script setup lang="ts">
defineProps<{
  className?: string
  fill?: string
}>()
</script>

<template>
  <svg
    class="animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 3787 2842"
    fill="none"
  >
    <g filter="url(#filter)">
      <ellipse
        cx="1924.71"
        cy="273.501"
        rx="1924.71"
        ry="273.501"
        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        :fill="fill || 'white'"
        fill-opacity="0.1"
      />
    </g>
    <defs>
      <filter
        id="filter"
        x="0.860352"
        y="0.838989"
        width="3785.16"
        height="2840.26"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="180"
          result="effect1_foregroundBlur_1065_8"
        />
      </filter>
    </defs>
  </svg>
</template>

<style scoped>
.animate-spotlight {
    animation: spotlight 2s .3s forwards
}

@keyframes spotlight{
    0% {
        opacity:0;
        transform:translate(-72%,-62%)scale(.5)
    }
    to {
        opacity:1;
        transform:translate(-50%,-40%)scale(1)
    }
}
</style>
