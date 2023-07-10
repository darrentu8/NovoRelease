import { toolType } from 'src/helper/enum'
import { adjustCursor, canvas } from '../canvas'
import { setOprBarOptions, setOprBarPos, showOprBar } from '../operationBar'

import store from '../../store'

let isInit = false
let isActive = false

export const initChoose = () => {
    canvas.on('selection:created', options => {
        if (!isActive) {
            return
        }

        // dealSelection()

        showOprBar(true)
        setOprBarPos()
        setOprBarOptions()
    })

    canvas.on('selection:updated', options => {
        if (!isActive) {
            return
        }

        // dealSelection()

        setOprBarPos()
        setOprBarOptions()
    })

    canvas.on('object:moving', options => {
        if (!isActive) {
            return
        }

        setOprBarPos()
    })

    canvas.on('object:modified', options => {
        if (!isActive) {
            return
        }

        setOprBarPos()
    })

    canvas.on('selection:cleared', options => {
        if (!isActive) {
            return
        }

        showOprBar(false)
    })

    isInit = true
}

export const activeChoose = () => {
    store.commit('common/SET_SELECTED_TOOL', toolType.CHOOSE)

    isActive = true
    adjustCursor(toolType.CHOOSE)

    enableSelection(true)

    if (!isInit) {
        initChoose()
    }
}

export const uninitChoose = () => {
    isInit = false
}

export const inactiveChoose = () => {
    isActive = false

    enableSelection(false)

    showOprBar(false)

    canvas.renderAll()
}

export const enableSelection = (isEnable) => {
    canvas.discardActiveObject()

    canvas.getObjects().forEach(object => {
        if (!object.isRealia && !object.isBackground) {
            object.selectable = isEnable
            object.evented = isEnable
        }
    })

    canvas.selection = isEnable
}

export const dealSelection = () => {
    const selectedObject = canvas.getActiveObject()
    if (selectedObject.type === 'activeSelection') {
        selectedObject.getObjects().forEach(o => {
            if (o.isLocked) {
                selectedObject.removeWithUpdate(o)
            }
        })
    }
}
