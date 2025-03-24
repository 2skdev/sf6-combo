<script setup lang="ts">
import { attackList, commonList, moveList } from '@/composables/useCombo'

const props = defineProps<{
  input: string
}>()

const command = [...attackList, ...commonList, ...moveList].find(
  (item) => item.input === props.input,
)

const getCommandImgPath = (input: string) => {
  return new URL(`/src/assets/command/image/${input}.png`, import.meta.url).href
}
</script>

<template>
  <div v-if="command" class="tooltip" :data-tip="command.name">
    <img
      :src="getCommandImgPath(command.input)"
      class="size-5 aspect-square object-contain pointer-events-none select-none"
    />
  </div>
</template>
