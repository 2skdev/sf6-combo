<script setup lang="ts">
import { useCharacter } from '@/composables/useCharacter';
import type { Character } from '@/types/character';
import { ref } from 'vue';

import Compressor from 'compressorjs';
import 'cropperjs/dist/cropper.css';
import VueCropper, { type VueCropperMethods } from 'vue-cropperjs';

type Tabs = 'update' | 'add'

const { error, characters, setCharacter } = useCharacter()
const selectedCharacter = ref<Character | null>()

const toast = ref<{ text: string; error: boolean } | null>()
const tab = ref<Tabs>('update')
const modalOpen = ref(false)
const tempImage = ref<string>('')
const cropper = ref<VueCropperMethods>()

const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject

    reader.readAsDataURL(blob)
  })
}

const uploadImage = async (e: Event) => {
  const element = e.target as HTMLInputElement
  const file = element.files?.[0]

  if (file) {
    tempImage.value = await blobToBase64(file)
    modalOpen.value = true
  }
}

const cropImage = () => {
  if (cropper.value) {
    cropper.value.getCroppedCanvas().toBlob(
      (blob) => {
        if (blob) {
          new Compressor(blob, {
            quality: 0.8,
            maxWidth: 512,
            maxHeight: 512,
            mimeType: 'image/png',
            success: async (blob: Blob) => {
              if (selectedCharacter.value) {
                selectedCharacter.value.base64 = await blobToBase64(blob)
                modalOpen.value = false
              }
            },
            error: (e) => {
              console.error(e)
            }
          })
        }
      }
    )

  }
}

const changeTab = (newTab: Tabs) => {
  if (newTab === 'update') {
    selectedCharacter.value = null
  }
  else if (newTab === 'add') {
    selectedCharacter.value = {
      id: '',
      name: '',
      base64: ''
    }
  }
  tab.value = newTab
}

const registerCharacter = async () => {
  if (selectedCharacter.value) {
    await setCharacter(selectedCharacter.value)

    toast.value = error.value
      ? {
        text: error.value!,
        error: true,
      }
      : {
        text: '更新されました',
        error: false,
      }
    setTimeout(() => {
      toast.value = null
    }, 3000)
  }
}
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div role="tablist" class="tabs tabs-border mb-4">
      <a role="tab" @click="changeTab('update')" class="tab" :class="{ 'tab-active': tab === 'update' }">編集</a>
      <a role="tab" @click="changeTab('add')" class="tab" :class="{ 'tab-active': tab === 'add' }">新規追加</a>
    </div>

    <div v-if="tab === 'update'">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">キャラクターを選択</legend>
        <select class="select w-96" v-model="selectedCharacter">
          <option disabled selected>キャラクターを選択</option>

          <option v-for="character in characters" :key="character.id" :value="character">
            {{ character.id }}
          </option>
        </select>
      </fieldset>
    </div>

    <div v-if="selectedCharacter">
      <div v-if="tab === 'add'">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">ID</legend>
          <input type="text" v-model="selectedCharacter.id" class="input w-96" />
        </fieldset>
      </div>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">名前</legend>
        <input type="text" v-model="selectedCharacter.name" class="input w-96" />
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">画像</legend>
        <img :src="selectedCharacter.base64" alt="" class="w-48" />
        <input type="file" accept="image/*" @change="uploadImage" class="file-input w-96" />
      </fieldset>

      <Teleport to="body" v-if="modalOpen">
        <div class="fixed z-50 inset-0 top-0 left-0 bg-black/25 flex items-center justify-center">
          <div class="flex flex-col items-center bg-base-100 p-8 rounded-box">
            <vue-cropper ref="cropper" :src="tempImage" :aspectRatio="1" class="size-[80dvw]" />
            <div class="w-full mt-4 flex items-center space-x-4">
              <button @click="cropImage" class="btn btn-primary">保存</button>
              <button @click="modalOpen = false" class="btn btn-ghost">キャンセル</button>
            </div>
          </div>
        </div>
      </Teleport>


      <div class="space-x-4 mt-4 border-t-1 border-base-200 pt-4">
        <button @click="registerCharacter" class="btn btn-primary">登録</button>
        <button v-if="tab === 'update'" class="btn btn-error">削除</button>
      </div>
    </div>
  </div>

  <div v-if="toast" class="toast">
    <div class="alert" :class="{ 'alert-error': toast.error, 'alert-success': !toast.error }">
      <span>{{ toast.text }}</span>
    </div>
  </div>
</template>
