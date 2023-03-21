import { adjustCursor, canvas, canvasBrush, getCanvasFrontIndex, markObjectOwner } from '../canvas'
import { fabric } from 'fabric'
import { toolType } from 'src/helper/enum'

import { showOprBar, setOprBarPos, setOprBarOptions } from '../operationBar'
import { activeChoose } from './choose'

let isInit = false
let isActive = false

let editingTextbox = null
let editingTextRect = null

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

export const uninitText = () => {
    isInit = false
}

export const inactiveText = () => {
    isActive = false

    canvas.renderAll()
}

const mouseDown = e => {
    const pointer = canvas.getPointer(e, true)

    const pointerDraw = canvas.restorePointerVpt(pointer)

    const textRect = new fabric.Rect({
        width: 200,
        height: 200,
        rx: 5,
        ry: 5,
        stroke: '#000000',
        fill: 'transparent',
        strokeUniform: true
    })

    const textBox = new fabric.Textbox('Text', {
        width: 200,
        height: 200,
        hasBorders: false,
        fontSize: canvasBrush.strokeSize * 6,
        fill: canvasBrush.strokeColorCalc,
        textBackgroundColor: canvasBrush.fillColorCalc,
        // selectable: false,
        strokeUniform: true
    })

    const textGroup = new fabric.Group([textRect, textBox], {
        left: pointerDraw.x,
        top: pointerDraw.y,
        strokeUniform: true,
        isText: true
    })

    canvas.insertAt(textGroup, getCanvasFrontIndex())

    canvas.setActiveObject(textGroup)

    markObjectOwner(textGroup)

    setOprBarPos()
    setOprBarOptions()
    showOprBar(true)

    activeChoose()

    enterEditing(textGroup)
}

export const enterEditing = textGroup => {
    if (!textGroup.isText) {
        return
    }

    textGroup.toActiveSelection()
    canvas.getActiveObject().getObjects().forEach(o => {
        if (o.type === 'textbox') {
            o.toEdit = true
        } else {
            o.toEdit = true
        }
    })
    canvas.discardActiveObject()

    canvas.getObjects().forEach(o => {
        if (o.toEdit) {
            if (o.type === 'textbox') {
                editingTextbox = o
            } else {
                editingTextRect = o
                editingTextRect.evented = false
                editingTextRect.strokeDashArray = [5, 5]
                editingTextRect.stroke = '#5f5f5f'
            }
        }
    })

    editingTextbox.fontSize = Math.floor(editingTextbox.fontSize * editingTextbox.scaleX * 10) / 10
    editingTextbox.scaleX = 1
    editingTextbox.scaleY = 1

    editingTextbox.on('deselected', () => {
        leaveEditing()
    })

    canvas.setActiveObject(editingTextbox)
    editingTextbox.enterEditing()
}

const leaveEditing = obj => {
    if (!editingTextRect) {
        return
    }

    editingTextRect.stroke = ''

    editingTextbox.width = editingTextRect.width
    editingTextbox.height = editingTextRect.height

    const textSel = new fabric.ActiveSelection([editingTextRect, editingTextbox], {
        canvas
    })

    const textGroup = textSel.toGroup()
    canvas.setActiveObject(textGroup)
    textGroup.setOptions({ isText: true, strokeUniform: true })

    markObjectOwner(textGroup)

    editingTextbox = null
    editingTextRect = null

    setOprBarPos()
    setOprBarOptions()

    canvas.renderAll()
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
