<template>
  <span class="atom__icon">
    {{ props.icon }}
  </span>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
})
</script>

<style lang="postcss" scoped>
.atom__icon {
  @apply font-['MaterialIcon'];
}
</style>
