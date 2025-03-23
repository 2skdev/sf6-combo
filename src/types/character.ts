export type CharacterDoc = {
  name: string
  base64: string
}

export type Character = CharacterDoc & {
  id: string
}
