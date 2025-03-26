<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

defineExpose({ open, close })
</script>

<template>
  <Teleport to="body" v-if="visible">
    <div class="fixed z-50 inset-0 top-0 left-0 bg-black/25 flex items-center justify-center">
      <div class="flex flex-col items-center bg-base-100 p-8 rounded-box">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
