<template>
  <div class="flex items-center gap-2">
    <Checkbox :id="id" :model-value="modelValue" @update:model-value="(val) => handleUpdate(val as boolean)" />
    <label :for="id" class="text-foreground cursor-pointer font-[JetBrains_Mono] text-base font-medium">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'

defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  'update:modelValue': [checked: boolean]
}>()

const handleUpdate = (checked: boolean) => {
  emit('update:modelValue', checked)
}
</script>
