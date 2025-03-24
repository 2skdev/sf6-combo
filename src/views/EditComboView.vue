<script setup lang="ts">
import CommandComponent from '@/components/CommandComponent.vue'
import ToastComponent from '@/components/ToastComponent.vue'
import { attackList, commonList, moveList, useCombo } from '@/composables/useCombo'
import type { Combo } from '@/types/combo'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// composable
const router = useRouter()
const route = useRoute()
const { error, getComboById, upsertCombo } = useCombo()

// route
const userId = Array.isArray(route.params.userId) ? route.params.userId[0] : route.params.userId
const characterId = Array.isArray(route.params.characterId)
  ? route.params.characterId[0]
  : route.params.characterId
const comboId = Array.isArray(route.params.comboId) ? route.params.comboId[0] : route.params.comboId

// ref
const toastComponent = ref()
const preview = ref<boolean>(false)
const shortcut = ref<boolean>(false)
const combo = ref<Combo>({
  id: comboId,
  name: '',
  inputs: '',
  memo: '',
})

// var
const commands = [...attackList, ...commonList, ...moveList]

// func
const handleKeyDown = (e: KeyboardEvent) => {
  if (
    document.activeElement?.tagName === 'INPUT' ||
    document.activeElement?.tagName === 'TEXTAREA'
  ) {
    return
  }

  const command = commands.find((item) => item.shortcut === e.key)
  if (command) {
    combo.value.inputs += `${command.input} `
  }

  if (e.key === 'Backspace') {
    const index = combo.value.inputs.trimEnd().lastIndexOf(' ')
    if (index !== -1) {
      combo.value.inputs = combo.value.inputs.slice(0, index + 1)
    } else {
      combo.value.inputs = ''
    }
  }
}

const handleUpsertCombo = async () => {
  console.log(toastComponent)

  if (combo.value.name.length === 0) {
    toastComponent.value.showToast('コンボ名を入力してください', 'error')
    return
  }
  if (combo.value.inputs.length === 0) {
    toastComponent.value.showToast('コンボを入力してください', 'error')
    return
  }

  await upsertCombo(userId, characterId, combo.value)

  if (error.value) {
    toastComponent.value.showToast(error.value!, 'error')
  } else {
    router.push(`/${userId}/${characterId}`)
  }
}

onMounted(async () => {
  if (comboId !== 'new') {
    const ret = await getComboById(userId, characterId, comboId)
    if (ret) {
      combo.value = ret
    }
  }

  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="text-lg font-bold mb-4">
    {{ comboId === 'new' ? 'コンボを追加' : 'コンボを編集' }}
  </div>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">コンボ名</legend>
    <input type="text" v-model="combo.name" class="input w-full" />
  </fieldset>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">メモ</legend>
    <textarea
      type="text"
      v-model="combo.memo"
      class="input w-full h-24 resize-none overflow-y-scroll"
    ></textarea>
  </fieldset>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">コンボ</legend>

    <div class="flex space-x-4 my-2">
      <label class="flex cursor-pointer gap-2">
        <input type="checkbox" v-model="preview" class="toggle toggle-xs" />
        <span class="label-text text-xs">プレビュー</span>
      </label>

      <label class="flex cursor-pointer gap-2">
        <input type="checkbox" v-model="shortcut" class="toggle toggle-xs" />
        <span class="label-text text-xs">ショートカット表示</span>
      </label>
    </div>

    <div v-if="!preview">
      <input v-model="combo.inputs" placeholder="コンボを入力" class="input input-borderd w-full" />
    </div>
    <div v-else class="input input-borderd w-full">
      <div v-if="combo.inputs.length > 0" class="h-full flex items-center space-x-1">
        <CommandComponent
          v-for="(input, index) in combo?.inputs.trim().split(' ')"
          :key="index"
          :input="input"
        />
      </div>
    </div>

    <div class="flex flex-row space-x-4 justify-center mt-4">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="move in moveList" :key="move.input" class="flex flex-col space-y-1">
          <button @click="combo.inputs += `${move.input} `" class="btn btn-square">
            <CommandComponent :input="move.input" />
          </button>
          <kbd v-if="shortcut && move.shortcut" class="kbd kbd-sm opacity-60">{{
            move.shortcut
          }}</kbd>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div v-for="attack in attackList" :key="attack.input" class="flex flex-col space-y-1">
          <button @click="combo.inputs += `${attack.input} `" class="btn btn-square">
            <CommandComponent :input="attack.input" />
          </button>
          <kbd v-if="shortcut && attack.shortcut" class="kbd kbd-sm opacity-60">{{
            attack.shortcut
          }}</kbd>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div v-for="common in commonList" :key="common.input" class="flex flex-col space-y-1">
          <button @click="combo.inputs += `${common.input} `" class="btn btn-square">
            <CommandComponent :input="common.input" />
          </button>
          <kbd v-if="shortcut && common.shortcut" class="kbd kbd-sm opacity-60">{{
            common.shortcut
          }}</kbd>
        </div>
      </div>
    </div>
  </fieldset>

  <div class="divider"></div>

  <div class="space-x-4">
    <button @click="handleUpsertCombo" class="btn btn-primary">保存</button>
    <RouterLink :to="`/${userId}/${characterId}`" class="btn">キャンセル</RouterLink>
  </div>

  <ToastComponent ref="toastComponent" />
</template>
