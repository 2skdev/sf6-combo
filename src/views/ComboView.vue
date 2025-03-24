<script setup lang="ts">
import { useCharacter } from '@/composables/useCharacter';
import { attackList, commonList, moveList } from '@/composables/useCombo';
import type { Character } from '@/types/character';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

type Tabs = 'text' | 'image'

const route = useRoute()
const { getCharacterById } = useCharacter()

const tab = ref<Tabs>('text')

const character = ref<Character | null>(null)
const combo = ref<string>('')

onMounted(async () => {
  character.value = await getCharacterById(Array.isArray(route.params.characterId) ? route.params.characterId[0] : route.params.characterId) ?? null
})

const getCommandImgPath = (key: string) => {
  return new URL(`/src/assets/command/${key}.png`, import.meta.url).href;
}
</script>

<template>
  <div v-if="character">
    <div class="font-bold mb-4">{{ character.name }}</div>
    <img :src="character.base64" class="w-48 mask mask-squircle bg-base-200" />

    <div class="font-bold mt-8 mb-4">コンボ</div>

    <div role="tablist" class="tabs tabs-border mb-4">
      <a role="tab" @click="tab = 'text'" class="tab" :class="{ 'tab-active': tab === 'text' }">テキスト</a>
      <a role="tab" @click="tab = 'image'" class="tab" :class="{ 'tab-active': tab === 'image' }">画像</a>
    </div>

    <div v-if="tab === 'text'">
      <input v-model="combo" placeholder="コンボを入力" class="input input-borderd w-full" />
    </div>
    <div v-else class="input input-borderd w-full">
      <div v-if="combo.length > 0" class="h-full flex items-center space-x-1">
        <img v-for="key in combo?.trim().split(' ')" :key="key" :src="getCommandImgPath(key)"
          class="h-5 aspect-square object-contain pointer-events-none select-none" />
      </div>
    </div>

    <div class="flex flex-row space-x-4 justify-center">
      <div class="grid grid-cols-3 gap-4">
        <button v-for="move in moveList" :key="move.key" @click="combo += `${move.key} `" class="btn btn-square">
          <img :src="getCommandImgPath(move.key)" class="object-contain p-2 pointer-events-none select-none" />
        </button>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <button v-for="attack in attackList" :key="attack.key" @click="combo += `${attack.key} `"
          class="btn btn-square">
          <img :src="getCommandImgPath(attack.key)" class="object-contain p-2 pointer-events-none select-none" />
        </button>
      </div>


      <div class="grid grid-cols-3 gap-4">
        <button v-for="common in commonList" :key="common.key" @click="combo += `${common.key} `"
          class="btn btn-square">
          <img :src="getCommandImgPath(common.key)" class="object-contain p-2 pointer-events-none select-none" />
        </button>
      </div>
    </div>
  </div>
</template>
