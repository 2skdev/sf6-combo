import attackJson from '@/assets/command/json/attack.json'
import commonJson from '@/assets/command/json/common.json'
import moveJson from '@/assets/command/json/move.json'

export type Key = {
  key: string
  name: string
}

export type Combo = {
  name: string
  keys: string[]
  memo: string
  damage?: number
  hits?: number
}

export const attackList = attackJson
export const commonList = commonJson
export const moveList = moveJson
