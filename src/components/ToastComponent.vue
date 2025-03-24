<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const alertType = ref<'success' | 'error'>('success')
const message = ref('')

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg
  visible.value = true
  alertType.value = type

  setTimeout(() => {
    visible.value = false
  }, 3000)
}

defineExpose({ showToast })
</script>

<template>
  <div v-if="visible" class="toast">
    <div class="alert" :class="`alert-${alertType}`">
      <span>{{ message }}</span>
    </div>
  </div>
</template>
