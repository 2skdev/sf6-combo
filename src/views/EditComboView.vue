<script setup lang="ts">
import CommandComponent from '@/components/CommandComponent.vue'
import ToastComponent from '@/components/ToastComponent.vue'
import { attackList, commonList, moveList, useCombo } from '@/composables/useCombo'
import type { Combo, Command } from '@/types/combo'
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
const textPreview = ref<boolean>(false)
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
const insertInput = (command: Command) => {
  if (combo.value.inputs.slice(-1) !== ' ') {
    combo.value.inputs += ' '
  }

  combo.value.inputs += command.input

  combo.value.inputs = combo.value.inputs.replace(/\s+/g, ' ').trim()
}

const deleteLastInput = () => {
  const index = combo.value.inputs.trimEnd().lastIndexOf(' ')
  if (index !== -1) {
    combo.value.inputs = combo.value.inputs.slice(0, index + 1)
  } else {
    combo.value.inputs = ''
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (
    document.activeElement?.tagName === 'INPUT' ||
    document.activeElement?.tagName === 'TEXTAREA'
  ) {
    return
  }

  const command = commands.find((item) => item.shortcut === e.key)
  if (command) {
    insertInput(command)
  }

  if (e.key === 'Backspace') {
    deleteLastInput()
  }
}

const handleUpsertCombo = async () => {
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
        <input type="checkbox" v-model="textPreview" class="toggle toggle-xs" />
        <span class="label-text text-xs">テキスト</span>
      </label>

      <label class="flex cursor-pointer gap-2">
        <input type="checkbox" v-model="shortcut" class="toggle toggle-xs" />
        <span class="label-text text-xs">ショートカット表示</span>
      </label>
    </div>

    <div v-if="textPreview">
      <input v-model="combo.inputs" placeholder="コンボを入力" class="input input-borderd w-full" />
    </div>
    <div v-else class="input input-borderd w-full">
      <div v-if="combo.inputs.length > 0">
        <CommandComponent
          v-for="(input, index) in combo.inputs.trim().split(' ')"
          :key="index"
          :input="input"
          class="m-px"
        />
      </div>
    </div>

    <div class="flex flex-row space-x-4 justify-center mt-4">
      <div class="grid grid-cols-3 grid-rows-4 gap-4">
        <div v-for="move in moveList" :key="move.input" class="flex flex-col space-y-1">
          <button @click="insertInput(move)" class="btn btn-square">
            <CommandComponent :input="move.input" />
          </button>
          <kbd v-if="shortcut && move.shortcut" class="kbd kbd-sm opacity-60">{{
            move.shortcut
          }}</kbd>
        </div>
      </div>

      <div class="grid grid-cols-4 grid-rows-4 gap-4">
        <div v-for="attack in attackList" :key="attack.input" class="flex flex-col space-y-1">
          <button @click="insertInput(attack)" class="btn btn-square">
            <CommandComponent :input="attack.input" />
          </button>
          <kbd v-if="shortcut && attack.shortcut" class="kbd kbd-sm opacity-60">{{
            attack.shortcut
          }}</kbd>
        </div>
      </div>

      <div class="grid grid-cols-3 grid-rows-4 gap-4">
        <div v-for="common in commonList" :key="common.input" class="flex flex-col space-y-1">
          <button @click="insertInput(common)" class="btn btn-square">
            <CommandComponent :input="common.input" />
          </button>
          <kbd v-if="shortcut && common.shortcut" class="kbd kbd-sm opacity-60">{{
            common.shortcut
          }}</kbd>
        </div>

        <div class="flex flex-col space-y-1">
          <button @click="deleteLastInput" class="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5 fill-current">
              <path
                d="m13.654 12.708l2.246 2.246q.14.14.344.15t.364-.15t.16-.354t-.16-.354L14.362 12l2.246-2.246q.14-.14.15-.344t-.15-.364t-.354-.16t-.354.16l-2.246 2.246l-2.246-2.246q-.14-.14-.344-.15q-.205-.01-.364.15q-.16.16-.16.354t.16.354L12.946 12L10.7 14.246q-.14.14-.15.345q-.01.203.15.363t.354.16t.354-.16zM9.173 19q-.379 0-.727-.164q-.348-.165-.565-.463l-4.135-5.385q-.342-.447-.342-.988t.342-.988l4.135-5.385q.217-.298.565-.462T9.173 5h10.212q.67 0 1.143.472q.472.472.472 1.144v10.769q0 .67-.472 1.143q-.472.472-1.143.472z"
              />
            </svg>
          </button>
          <kbd v-if="shortcut" class="kbd kbd-sm opacity-60">&larr;</kbd>
        </div>

        <div class="flex flex-col space-y-1">
          <button @click="combo.inputs = ''" class="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5 fill-current">
              <path
                d="M7.616 20q-.667 0-1.141-.475T6 18.386V6h-.5q-.213 0-.356-.144T5 5.499t.144-.356T5.5 5H9q0-.31.23-.54t.54-.23h4.46q.31 0 .54.23T15 5h3.5q.213 0 .356.144t.144.357t-.144.356T18.5 6H18v12.385q0 .666-.475 1.14t-1.14.475zm2.692-3q.213 0 .357-.144t.143-.356v-8q0-.213-.144-.356T10.307 8t-.356.144t-.143.356v8q0 .213.144.356q.144.144.356.144m3.385 0q.213 0 .356-.144t.143-.356v-8q0-.213-.144-.356Q13.904 8 13.692 8q-.213 0-.357.144t-.143.356v8q0 .213.144.356t.357.144"
              />
            </svg>
          </button>
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
