<script setup lang="ts">
const route = useRoute()
const toast = useToast()

async function copyArticleLinkToClipboard() {
  const link = `${window.location.origin}${route.path}`
  try {
    await navigator.clipboard.writeText(link)
    toast.add({ title: 'Article link copied to clipboard', color: 'success' })
  }
  catch (error) {
    toast.add({ title: 'Failed to copy link to clipboard', color: 'error' })
  }
}
</script>

<template>
  <div>
    <span
      class="mt-4 cursor-pointer select-none text-muted hover:text-highlighted"
      @click="copyArticleLinkToClipboard()"
    >
      Copy article link
    </span>
  </div>
</template>
