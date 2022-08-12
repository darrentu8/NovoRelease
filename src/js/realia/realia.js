import { toolType } from 'src/helper/enum'
import { adjustCursor } from '../canvas'

export let isActice = false

export const initRealia = () => {
    isActice = true

    adjustCursor(toolType.REALIA)
}

export const unInitRealia = () => {
    isActice = false
}
