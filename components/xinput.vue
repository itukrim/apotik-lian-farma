<template>
  <div class="input-wrapper">
    <Icon :icon="props.icon" class="text-2xl text-gray-400 leading-none" />
    <input
      type='text'
      :value="modelValue"
      @input="updateValue"
      v-bind="$attrs"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
})
const emit = defineEmits(['update:modelValue'])

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
};
</script>

<style lang="postcss" scoped>
.input-wrapper {
  @apply border border-[#dddddd] rounded-full px-4 py-3 flex gap-3;
}

input {
  @apply text-xs flex-1;

  &:focus {
    @apply outline-none;
  }
}
</style>
