<template>
  <div class="brand">
    <span>Apotik</span>
    <span>Lian Farma</span>
  </div>
</template>

<style lang="postcss" scoped>
.brand {
  @apply font-bold text-2xl leading-[32px] p-6;

  span:first-of-type {
    @apply mr-2 block;
  }

  span:last-of-type {
    @apply text-lime-500;
  }
}
</style>
