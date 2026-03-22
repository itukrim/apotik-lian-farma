<template>
  <div class="fixed top-0 p-12 pb-20 md:pb-8 left-0 bg-black bg-opacity-30 w-screen h-screen overflow-auto flex items-start justify-center z-50">
    <div class="bg-white rounded-xl w-full md:w-2/6 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold">{{ props.title }}</h2>
        <button class="flex items-center justify-center bg-gray-50 text-[#A1A1A1] rounded-full w-6 h-6 hover:bg-gray-100 transition-all" @click="emitClickcloseModal()">
          <Icon icon="close" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['closeModal']);

const emitClickcloseModal = () => {
  emit('closeModal')
}
</script>

<style lang="postcss" scoped>
</style>
