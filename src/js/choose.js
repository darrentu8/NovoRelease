import { toolType } from 'src/helper/enum'
import { adjustCursor, canvas } from './canvas'
import { setOprBarOptions, setOprBarPos, showOprBar } from './operationBar'

let isInit = false
let isActive = false

export const initChoose = () => {
    adjustCursor(toolType.CHOOSE)
    isActive = true

    enableSelection(true)

    if (!isInit) {
        canvas.on('selection:created', options => {
            if (!isActive) {
                return
            }

            showOprBar(true)
            setOprBarPos()
            setOprBarOptions()
        })

        canvas.on('selection:updated', options => {
            if (!isActive) {
                return
            }

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
}

export const unInitChoose = () => {
    isActive = false

    enableSelection(false)

    showOprBar(false)

    canvas.renderAll()
}

const enableSelection = (isEnable) => {
    canvas.discardActiveObject()

    canvas.getObjects().forEach(object => {
        if (object.isCompass) {
            return
        }
        object.selectable = isEnable
        object.evented = isEnable
    })

    canvas.selection = isEnable
}
