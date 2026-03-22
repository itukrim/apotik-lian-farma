<template>
  <div class="input-wrapper">
    <input
      :id="props.label"
      type='text'
      :value="modelValue"
      @input="updateValue"
      v-bind="$attrs"
    />
    <label :for='props.label' class='placeholder'>{{ props.label }}</label>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ""
  }
})
const emit = defineEmits(['update:modelValue'])

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
};
</script>

<style lang="postcss" scoped>
.input-wrapper {
  @apply relative flex items-center;
}

input {
  @apply border rounded-full px-5 py-2 text-sm w-full;
}

label {
  @apply text-sm;
}

.placeholder {
  @apply absolute left-4 bg-white text-gray-400 px-1 transition-all;
}

input:is(:focus, :valid) + .placeholder {
  @apply translate-y-[calc(-1*8px_-_12px)] text-sm text-black;
}

input:is(:focus) {
  @apply outline-black;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>