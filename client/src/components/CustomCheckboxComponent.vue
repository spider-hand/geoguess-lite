<template>
  <div class="flex items-center gap-2">
    <Checkbox
      :id="id"
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="(val) => handleUpdate(val as boolean)"
    />
    <label
      :for="id"
      class="text-foreground font-[JetBrains_Mono] text-base font-medium"
      :class="disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'

defineProps<{
  id: string
  label: string
  modelValue: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [checked: boolean]
}>()

const handleUpdate = (checked: boolean) => {
  emit('update:modelValue', checked)
}
</script>
