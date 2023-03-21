import store from '../store'
import { canvas } from './canvas'
import { mitt } from 'src/boot/bus'

import { colors } from 'quasar'

const { hexToRgb, rgbToHex } = colors

export const showOprBar = isShow => {
    mitt.emit('setShowOprBar', isShow)
}

export const setOprBarPos = () => {
    const selectedObject = canvas.getActiveObject()

    if (!selectedObject) {
        return
    }

    mitt.emit('setOprBarPos', { x: selectedObject.oCoords.mt.x, y: selectedObject.oCoords.mt.y })
}

export const setOprBarOptions = () => {
    const selectedObject = canvas.getActiveObject()

    if (!selectedObject) {
        return
    }

    store.commit('common/SET_SELECTED_OBJECT', selectedObject)

    setOprBarColorSize()

    if (selectedObject.type === 'activeSelection') {
        mitt.emit('setOprBarIsSelection', true)
    } else {
        mitt.emit('setOprBarIsSelection', false)
    }
    if (selectedObject.isLocked) {
        mitt.emit('setOprBarIsLocked', true)
    } else {
        mitt.emit('setOprBarIsLocked', false)
    }

    const draggableRectObjects = store.state.common.draggableRectObjects
    if (draggableRectObjects.find(o => o.id === selectedObject.uuidSrc)) {
        mitt.emit('setOprBarIsShowDraggableRect', true)
    } else {
        mitt.emit('setOprBarIsShowDraggableRect', false)
    }
}

export const setOprBarColorSize = () => {
    const selectedObject = canvas.getActiveObject()

    if (!selectedObject) {
        return
    }

    if (selectedObject.isText) {
        setTextGroup(selectedObject)
    } else if (selectedObject.type === 'textbox') {
        setTextBox(selectedObject)
    } else if (selectedObject.type === 'activeSelection' || selectedObject.type === 'group') {
        setGroup(selectedObject)
    } else {
        setObject(selectedObject)
    }
}

const setTextGroup = (selectedObject) => {
    selectedObject.getObjects().forEach(o => {
        if (o.type === 'textbox') {
            setTextBox(o)
        } else {
            setTextRect(o)
        }
    })
}

const setTextBox = (selectedObject) => {
    // const selectedText = selectedObject.getSelectedText()
    if (!selectedObject.fill) {
        selectedObject.fill = '#00000000'
    }
    const strokeRGB = hexToRgb(selectedObject.fill)
    if (strokeRGB.a >= 0) {
        mitt.emit('setOprBarStrokeOpacity', strokeRGB.a)
    } else {
        mitt.emit('setOprBarStrokeOpacity', 100)
    }
    delete strokeRGB.a
    const strokeColorHex = rgbToHex(strokeRGB)
    mitt.emit('setOprBarStrokeColor', strokeColorHex)
    mitt.emit('setOprBarStrokeSize', Math.floor(selectedObject.fontSize / 6 * 10) / 10)

    mitt.emit('setOprBarTextAlign', selectedObject.textAlign)
}

const setTextRect = (selectedObject) => {
    if (!selectedObject.fill) {
        selectedObject.fill = '#00000000'
    }
    const fillRGB = hexToRgb(selectedObject.fill)
    if (fillRGB.a >= 0) {
        mitt.emit('setOprBarFillOpacity', fillRGB.a)
    } else {
        mitt.emit('setOprBarFillOpacity', 100)
    }
    delete fillRGB.a
    const fillColorHex = rgbToHex(fillRGB)
    mitt.emit('setOprBarFillColor', fillColorHex)
}

const setGroup = (selectedObject) => {
    const firstSelectedObject = selectedObject._objects[0]

    if (!firstSelectedObject.stroke) {
        firstSelectedObject.stroke = '#00000000'
    }
    const strokeRGB = hexToRgb(firstSelectedObject.stroke)
    if (strokeRGB.a >= 0) {
        mitt.emit('setOprBarStrokeOpacity', strokeRGB.a)
    } else {
        mitt.emit('setOprBarStrokeOpacity', 100)
    }
    delete strokeRGB.a
    const strokeColorHex = rgbToHex(strokeRGB)
    mitt.emit('setOprBarStrokeColor', strokeColorHex)
    mitt.emit('setOprBarStrokeSize', firstSelectedObject.strokeWidth)

    if (!firstSelectedObject.fill) {
        firstSelectedObject.fill = '#00000000'
    }
    const fillRGB = hexToRgb(firstSelectedObject.fill)
    if (fillRGB.a >= 0) {
        mitt.emit('setOprBarFillOpacity', fillRGB.a)
    } else {
        mitt.emit('setOprBarFillOpacity', 100)
    }
    delete fillRGB.a
    const fillColorHex = rgbToHex(fillRGB)
    mitt.emit('setOprBarFillColor', fillColorHex)
}

const setObject = (selectedObject) => {
    if (!selectedObject.stroke) {
        selectedObject.stroke = '#00000000'
    }
    const strokeRGB = hexToRgb(selectedObject.stroke)
    if (strokeRGB.a >= 0) {
        mitt.emit('setOprBarStrokeOpacity', strokeRGB.a)
    } else {
        mitt.emit('setOprBarStrokeOpacity', 100)
    }
    delete strokeRGB.a
    const strokeColorHex = rgbToHex(strokeRGB)
    mitt.emit('setOprBarStrokeColor', strokeColorHex)
    mitt.emit('setOprBarStrokeSize', selectedObject.strokeWidth)

    if (!selectedObject.fill) {
        selectedObject.fill = '#00000000'
    }
    const fillRGB = hexToRgb(selectedObject.fill)
    if (fillRGB.a >= 0) {
        mitt.emit('setOprBarFillOpacity', fillRGB.a)
    } else {
        mitt.emit('setOprBarFillOpacity', 100)
    }
    delete fillRGB.a
    const fillColorHex = rgbToHex(fillRGB)
    mitt.emit('setOprBarFillColor', fillColorHex)
}
