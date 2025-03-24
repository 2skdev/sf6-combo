import { db } from '@/firebase'
import type { Character, CharacterDoc } from '@/types/character'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  type FirestoreDataConverter,
} from 'firebase/firestore'
import { onMounted, ref } from 'vue'

const characterConverter: FirestoreDataConverter<Character> = {
  toFirestore(data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = data
    return rest
  },
  fromFirestore(snapshot): Character {
    const data = snapshot.data() as CharacterDoc
    return {
      id: snapshot.id,
      ...data,
    }
  },
}

export function useCharacter() {
  const error = ref<string | null>()
  const characters = ref<Character[]>([])

  onMounted(async () => {
    error.value = null
    try {
      const ref = collection(db, 'character').withConverter(characterConverter)
      const snapshot = await getDocs(ref)
      characters.value = snapshot.docs.map((doc) => doc.data())
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  })

  const getCharacterById = async (id: string): Promise<Character | null> => {
    error.value = null
    try {
      const ref = doc(db, 'character', id).withConverter(characterConverter)
      return (await getDoc(ref)).data() ?? null
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
      return null
    }
  }

  const upsertCharacter = async (data: Character) => {
    error.value = null
    try {
      const ref = doc(db, 'character', data.id).withConverter(characterConverter)
      await setDoc(ref, data, { merge: true })
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  return { error, characters, getCharacterById, upsertCharacter }
}
