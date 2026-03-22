<template>
  <div class="toast">
    <div class="toast-wrapper">
      <div class="toast-container">
        <Icon :icon="type === 'success' ? 'check' : 'error'" class="p-4 font-bold rounded-l-lg text-white" :class="type === 'success' ? 'bg-[#3D8A7A]' : 'bg-red-500'" />
        <div class="p-4">
          <p class="font-medium text-sm mb-1" :class="props.type === 'success' ? 'text-[#3D8A7A]' : 'text-red-500'">{{ props.label }}</p>
          <span class="text-[10px] block text-gray-500 font-light">{{ props.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'success'
  }
})
</script>

<style lang="postcss" scoped>
.toast {
  @apply fixed top-0 right-0 translate-x-full z-50;

  &-wrapper {
    @apply p-4;
  }

  &-container {
    @apply bg-white shadow-lg rounded-lg w-80 flex;
  }
  animation: toast 4s 0s ease forwards;
}
</style>
