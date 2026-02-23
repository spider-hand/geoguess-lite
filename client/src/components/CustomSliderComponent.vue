<template>
  <div class="flex flex-col gap-2">
    <div>
      <label class="text-foreground font-[JetBrains_Mono] text-base font-medium">
        {{ label }}
      </label>
    </div>
    <div class="flex flex-col gap-1">
      <div>
        <Slider
          v-model="internalValue"
          :min="min"
          :max="max"
          :step="step"
          class="w-full"
          @update:model-value="handleUpdate"
        />
      </div>
      <div class="text-muted-foreground flex justify-between font-[JetBrains_Mono] text-sm">
        <span>{{ formatValue(min) }}</span>
        <span class="text-foreground font-medium">{{ displayValue }}</span>
        <span>{{ formatValue(max) }}</span>
      </div>
    </div>
    <p
      v-if="helpText"
      data-testid="help-text"
      class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-sm"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Slider } from '@/components/ui/slider'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue: number
    min: number
    max: number
    step: number
    unit?: string
    unlimitedValue?: number
    unlimitedText?: string
    helpText?: string
  }>(),
  {
    unit: '',
    unlimitedValue: undefined,
    unlimitedText: 'Unlimited',
    helpText: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const internalValue = ref([props.modelValue])

const displayValue = computed(() => {
  const value = props.modelValue
  if (props.unlimitedValue !== undefined && value === props.unlimitedValue) {
    return props.unlimitedText
  }
  return `${value}${props.unit}`
})

const formatValue = (value: number) => {
  return `${value}${props.unit}`
}

const handleUpdate = (value: number[] | undefined) => {
  const newValue = value?.[0] ?? props.min
  emit('update:modelValue', newValue)
}

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = [newValue]
  },
)
</script>
