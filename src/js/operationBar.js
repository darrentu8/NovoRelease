import store from '../store'
import { canvas } from './canvas'
import { mitt } from 'src/boot/bus'

export const showOprBar = isShow => {
    store.commit('common/SET_SHOW_OPR_BAR', isShow)
}

export const setOprBarPos = () => {
    const selectedObject = canvas.getActiveObject()

    if (!selectedObject) {
        return
    }

    store.commit('common/SET_OPR_BAR_POS', { x: selectedObject.oCoords.mt.x, y: selectedObject.oCoords.mt.y })
}

export const setOprBarOptions = () => {
    const selectedObject = canvas.getActiveObject()

    if (!selectedObject) {
        return
    }

    if (selectedObject.type === 'activeSelection') {
        selectedObject.getObjects().forEach(o => {
            if (o.isRealia || o.isLocked) {
                selectedObject.removeWithUpdate(o)
            }
        })

        mitt.emit('setOprBarIsSelection', true)
    } else {
        mitt.emit('setOprBarIsSelection', false)
    }

    if (selectedObject.isRealia) {
        mitt.emit('setOprBarIsRealia', true)
    } else {
        mitt.emit('setOprBarIsRealia', false)
    }

    if (selectedObject.type === 'textbox') {
        mitt.emit('setOprBarIsText', true)
    } else {
        mitt.emit('setOprBarIsText', false)
    }

    if (selectedObject.isLocked) {
        mitt.emit('setOprBarIsLocked', true)
    } else {
        mitt.emit('setOprBarIsLocked', false)
    }
}

export const setOprBarColorSize = () => {
    const selectedObject = canvas.getActiveObject()

    if (!selectedObject) {
        return
    }

    if (selectedObject.type === 'textbox') {
        const selectedText = selectedObject.getSelectedText()
        if (selectedText === '') {
            mitt.emit('setOprBarBrushSize', selectedObject.fontSize / 6)
            mitt.emit('setOprBarBrushColor', selectedObject.fill)
        } else {
            const styles = selectedObject.getSelectionStyles()
            let fontSize = selectedObject.fontSize / 6
            let color = selectedObject.fill
            styles.forEach(style => {
                if (style.fontSize) {
                    fontSize = style.fontSize / 6
                }
                if (style.fill) {
                    color = style.fill
                }
            })
            mitt.emit('setOprBarBrushSize', fontSize)
            mitt.emit('setOprBarBrushColor', color)
        }
    } else {
        mitt.emit('setOprBarBrushColor', selectedObject.stroke)
        mitt.emit('setOprBarBrushSize', selectedObject.strokeWidth)
    }
}
