import attackJson from '@/assets/command/json/attack.json'
import commonJson from '@/assets/command/json/common.json'
import moveJson from '@/assets/command/json/move.json'
import { db } from '@/firebase'
import type { Combo, ComboDoc, Command } from '@/types/combo'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  type FirestoreDataConverter,
} from 'firebase/firestore'
import { ref } from 'vue'

export const attackList: Command[] = attackJson
export const commonList: Command[] = commonJson
export const moveList: Command[] = moveJson

const comboConveter: FirestoreDataConverter<Combo> = {
  toFirestore(data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = data
    return rest
  },
  fromFirestore(snapshot): Combo {
    const data = snapshot.data() as ComboDoc
    return {
      id: snapshot.id,
      ...data,
    }
  },
}

export function useCombo() {
  const error = ref<string | null>()

  const getComboList = async (userId: string, characterId: string): Promise<Combo[] | null> => {
    error.value = null
    try {
      const ref = collection(db, 'combo', userId, characterId).withConverter(comboConveter)
      const snapshot = await getDocs(ref)
      return snapshot.docs.map((doc) => doc.data())
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
      return null
    }
  }

  const getComboById = async (
    userId: string,
    characterId: string,
    comboId: string,
  ): Promise<Combo | null> => {
    error.value = null
    try {
      const ref = doc(db, 'combo', userId, characterId, comboId).withConverter(comboConveter)
      return (await getDoc(ref)).data() ?? null
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
      return null
    }
  }

  const upsertCombo = async (userId: string, characterId: string, data: Combo) => {
    error.value = null
    try {
      if (data.id === 'new') {
        const ref = collection(db, 'combo', userId, characterId).withConverter(comboConveter)
        await addDoc(ref, data)
      } else {
        const ref = doc(db, 'combo', userId, characterId, data.id).withConverter(comboConveter)
        await setDoc(ref, data, { merge: true })
      }
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  const deleteCombo = async (userId: string, characterId: string, comboId: string) => {
    error.value = null
    try {
      const ref = doc(db, 'combo', userId, characterId, comboId).withConverter(comboConveter)
      await deleteDoc(ref)
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  return { error, getComboList, getComboById, upsertCombo, deleteCombo }
}
