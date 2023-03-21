import { toolType } from 'src/helper/enum'
import { adjustCursor } from '../canvas'

// import store from '../../store'

export let isActive = false

export const initRealia = () => {
    isActive = true

    adjustCursor(toolType.REALIA)
}

export const inactiveRealia = () => {
    isActive = false
}
