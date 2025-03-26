export type Command = {
  input: string
  name: string
  shortcut?: string
}

export type ComboDoc = {
  name: string
  inputs: string
  memo: string
  youtubeUrl?: string
  youtubeStart?: string
  damage?: number
  hits?: number
}

export type Combo = ComboDoc & {
  id: string
}
