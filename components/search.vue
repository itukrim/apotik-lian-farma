<template>
  <div class="input-wrapper">
    <input
      type="text"
      :value="modelValue"
      @input="updateValue"
      :placeholder="props.label"
    />
    <button class="relative py-3 px-6 hover:bg-gray-100 rounded-r-full transition-all" @click="modelValue && clearInput()">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <IconSearch v-if="!modelValue" />
        <Icon v-else icon="close" class="font-xl text-[#A1A1A1] text-xl" />
      </div>
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ""
  },
  iconL: {
    type: String,
    default: ""
  },
  iconR: {
    type: String,
    default: ""
  }
})
const emit = defineEmits(['update:modelValue'])

const updateValue = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
};

const clearInput = () => {
  emit('update:modelValue', '');
}
</script>

<style lang="postcss" scoped>

.input-wrapper {
  @apply bg-white flex text-sm rounded-full border border-[#DDDDDD];

  input {
    @apply w-full font-light py-3 px-[22px] rounded-full outline-none;
  }
}
</style>
