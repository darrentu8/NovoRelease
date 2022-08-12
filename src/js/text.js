import { adjustCursor, canvas, canvasBrush, getCanvasFrontIndex } from './canvas'
import { fabric } from 'fabric'
import { toolType } from 'src/helper/enum'

import { showOprBar, setOprBarPos, setOprBarOptions } from './operationBar'

let isInit = false
let isActive = false

export const initText = () => {
    isActive = true

    adjustCursor(toolType.TEXT)

    if (!isInit) {
        canvas.on('mouse:down', options => {
            if (!isActive) {
                return
            }
            mouseDown(options.e)
        })

        isInit = true
    }
}

export const unInitText = () => {
    isActive = false

    canvas.getObjects().forEach(o => {
        if (o.isEditing) {
            o.exitEditing()
        }
    })

    showOprBar(false)

    canvas.discardActiveObject()

    canvas.renderAll()
}

const mouseDown = e => {
    const pointer = canvas.getPointer(e, true)

    let isEditing = false

    canvas.getObjects().map(o => o).forEach(object => {
        if (object.type === 'textbox') {
            if (object.text === '') {
                canvas.remove(object)
            }
        }
        if (object.isEditing) {
            isEditing = true
        }
    })

    if (isEditing) {
        return
    }

    const pointerDraw = canvas.restorePointerVpt(pointer)

    const text = new fabric.Textbox('', {
        left: pointerDraw.x,
        top: pointerDraw.y,
        width: 50,
        fontSize: canvasBrush.size * 6,
        fill: canvasBrush.color,
        selectable: false
    })

    canvas.insertAt(text, getCanvasFrontIndex())

    text.enterEditing()

    canvas.setActiveObject(text)

    setOprBarPos()
    setOprBarOptions()
    showOprBar(true)
}

export const setActiveTextAlign = align => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject || activeObject.type !== 'textbox') {
        return
    }

    activeObject.setOptions({ textAlign: align })

    canvas.renderAll()
}

export const setActiveTextStyle = (styleName, val) => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject || activeObject.type !== 'textbox') {
        return
    }

    const options = {}
    if (val) {
        options[styleName] = val
    }

    const selectedText = activeObject.getSelectedText()

    if (selectedText === '') {
        activeObject.setOptions(options)
    } else {
        activeObject.setSelectionStyles(options)

        if (styleName === 'subscript') {
            activeObject.setSubscript()
        } else if (styleName === 'superscript') {
            activeObject.setSuperscript()
        }
    }

    canvas.renderAll()
}

export const clearActiveTextStyle = () => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject || activeObject.type !== 'textbox') {
        return
    }

    const options = {
        fontWeight: 'normal',
        fontStyle: 'normal',
        underline: undefined,
        overline: undefined,
        linethrough: undefined
    }

    const selectedText = activeObject.getSelectedText()

    if (selectedText === '') {
        activeObject.setOptions(options)
    } else {
        activeObject.setSelectionStyles(options)
        activeObject.setSelectionStyles({
            fontSize: undefined,
            deltaY: undefined
        })
    }

    canvas.renderAll()
}
