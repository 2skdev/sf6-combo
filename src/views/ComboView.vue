<script setup lang="ts">
import CommandComponent from '@/components/CommandComponent.vue'
import { useCharacter } from '@/composables/useCharacter'
import { useCombo } from '@/composables/useCombo'
import type { Character } from '@/types/character'
import type { Combo } from '@/types/combo'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { getCharacterById } = useCharacter()
const { getComboList, deleteCombo } = useCombo()

const userId = Array.isArray(route.params.userId) ? route.params.userId[0] : route.params.userId
const characterId = Array.isArray(route.params.characterId)
  ? route.params.characterId[0]
  : route.params.characterId

const character = ref<Character | null>(null)
const comboList = ref<Combo[]>([])

onMounted(async () => {
  character.value = await getCharacterById(characterId)
  comboList.value = (await getComboList(userId, characterId)) ?? []
})

const handleDeleteCombo = async (combo: Combo) => {
  const ret = confirm(`${combo.name}を削除しますか？`)
  if (ret) {
    deleteCombo(userId, characterId, combo.id)
    comboList.value = (await getComboList(userId, characterId)) ?? []
  }
}
</script>

<template>
  <div v-if="character">
    <div class="flex items-center">
      <img :src="character.base64" class="w-16 mask mask-squircle bg-base-200" />
      <div class="ml-4 text-xl font-bold">{{ character.name }}</div>
      <RouterLink :to="`/${userId}/${characterId}/new`" class="ml-auto btn btn-primary"
        >コンボを追加</RouterLink
      >
    </div>

    <ul class="list mt-4">
      <li class="list-row px-0" v-for="combo in comboList" :key="combo.id">
        <div>
          <div class="font-bold">{{ combo.name }}</div>
          <p class="list-col-wrap mt-2">
            <CommandComponent
              v-for="(input, index) in combo.inputs.trim().split(' ')"
              :key="index"
              :input="input"
              class="m-px"
            />
          </p>
          <div class="opacity-60">{{ combo.memo }}</div>
        </div>

        <button
          class="btn btn-square btn-ghost ml-auto"
          popovertarget="popover-command-list"
          style="anchor-name: --anchor-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6 fill-current">
            <path
              d="M6.462 13q-.413 0-.707-.294T5.462 12t.293-.706t.707-.294t.706.294t.293.706t-.293.706T6.46 13M12 13q-.413 0-.706-.294T11 12t.294-.706T12 11t.706.294T13 12t-.294.706T12 13m5.539 0q-.413 0-.707-.294T16.538 12t.294-.706t.706-.294t.707.294t.293.706t-.293.706t-.707.294"
            />
          </svg>
        </button>
        <ul
          class="dropdown dropdown-end menu w-48 mt-2 rounded-box bg-base-200 shadow-sm"
          popover
          id="popover-command-list"
          style="position-anchor: --anchor-1"
        >
          <li>
            <RouterLink :to="`/${userId}/${characterId}/${combo.id}`">編集</RouterLink>
            <button @click="handleDeleteCombo(combo)" class="text-error">削除</button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
