import { adjustCursor, canvas, canvasBrush, getCanvasFrontIndex, markObjectOwner } from '../canvas'
import { fabric } from 'fabric'
import { toolType } from 'src/helper/enum'

import { showOprBar, setOprBarPos, setOprBarOptions } from '../operationBar'
import { activeChoose } from './choose'

let isInit = false
let isActive = false

let isEditing = false
let editingObject = null

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
        canvas.on('mouse:down:before', options => {
            if (!isActive) {
                return
            }
            mouseDownBefore(options.e)
        })

        isInit = true
    }
}

export const uninitText = () => {
    isInit = false
}

export const inactiveText = () => {
    isActive = false

    canvas.getObjects().forEach(o => {
        if (o.isEditing) {
            o.exitEditing()
        }
    })

    if (!editingObject) {
        showOprBar(false)
        canvas.discardActiveObject()
    } else {
        canvas.setActiveObject(editingObject)
    }
    editingObject = null

    canvas.renderAll()
}

const mouseDown = e => {
    const pointer = canvas.getPointer(e, true)

    if (isEditing) {
        activeChoose()
        return
    }

    const pointerDraw = canvas.restorePointerVpt(pointer)

    const text = new fabric.Textbox('', {
        left: pointerDraw.x,
        top: pointerDraw.y,
        width: 50,
        fontSize: canvasBrush.strokeSize * 6,
        fill: canvasBrush.strokeColorCalc,
        textBackgroundColor: canvasBrush.fillColorCalc,
        // selectable: false,
        strokeUniform: true
    })

    // text.on('scaling', e => {
    //     text.width = text.scaleX * text.width
    //     text.height = text.scaleY * text.height
    //     text.scaleX = 1
    //     text.scaleY = 1
    // })

    canvas.insertAt(text, getCanvasFrontIndex())

    text.enterEditing()

    canvas.setActiveObject(text)

    markObjectOwner(text)

    setOprBarPos()
    setOprBarOptions()
    showOprBar(true)
}

const mouseDownBefore = e => {
    isEditing = false
    editingObject = null

    canvas.getObjects().map(o => o).forEach(object => {
        if (object.isEditing) {
            isEditing = true
            editingObject = object
            object.evented = false
            object.selectable = false
            removeEmptyTextbox(object)
        }
    })
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

export const removeEmptyTextbox = (object) => {
    if (object.type === 'textbox') {
        if (object.text === '') {
            if (editingObject === object) {
                editingObject = null
            }
            canvas.remove(object)
        }
    }
}
