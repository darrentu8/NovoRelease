import { fabric } from 'fabric'
import { debounce, Notify } from 'quasar'

import store from '../store'
import { canvasIndex, toolType } from 'src/helper/enum'
import { mitt } from 'src/boot/bus'
import { showOprBar } from './operationBar'
// import { capitalizeFirstLetter } from 'src/helper/string'

export let canvas = null
export const canvasBrush = {
    color: '#000000',
    size: 10
}

let isDrag = false

const canvasData = {}
const canvasHistorys = {}

let copyObject = null

export const initCanvas = domId => {
    canvas = new fabric.Canvas(domId, {
        selection: false,
        fireRightClick: true,
        stopContextMenu: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true
    })

    canvas.on('mouse:down', options => {
        dragBeginCanvas(options.e)
    })

    canvas.on('mouse:move', options => {
        draggingCanvas(options.e)
    })

    canvas.on('mouse:up', options => {
        dragEndCanvas(options.e)
    })

    canvas.on('mouse:wheel', options => {
        zoomCanvas(options.e)
    })

    canvas.on('after:render', debounce(options => {
        const data = canvas.toJSON(['evented', 'selectable', '_controlsVisibility', 'isRealia', 'isCompass', 'isLocked',
            'hasBorders', 'hasControls', 'lockMovementX', 'lockMovementY', 'lockRotatio'])

        data.objects = data.objects.filter(o => !o.isRealia)

        data.objects.forEach(object => { // text 編輯的時候保存加載後無法移動
            if (object.type === 'textbox') {
                object.lockMovementX = false
                object.lockMovementY = false
            }
        })

        const pageId = store.state.common.page

        canvasData[pageId] = data

        if (!canvasHistorys[pageId]) {
            canvasHistorys[pageId] = {}
            canvasHistorys[pageId].datas = [data]
            canvasHistorys[pageId].index = 0
        } else {
            const isEqual = JSON.stringify(canvasHistorys[pageId].datas[canvasHistorys[pageId].index].objects) === JSON.stringify(data.objects)
            if (!isEqual) {
                canvasHistorys[pageId].datas = canvasHistorys[pageId].datas.slice(0, canvasHistorys[pageId].index + 1)
                canvasHistorys[pageId].datas.push(data)
                canvasHistorys[pageId].index = canvasHistorys[pageId].datas.length - 1
            }
        }
    }, 200))

    window.addEventListener('keyup', e => {
        const activeObject = canvas.getActiveObject()

        if (!activeObject) {
            return
        }

        if (activeObject.isEditing) {
            return
        }

        if (e.ctrlKey && e.key === 'c') {
            setActiveObjectCopy()
        } else if (e.ctrlKey && e.key === 'v') {
            setCopiedObjectPaste()
        } else if (e.ctrlKey && e.key === 'z') {
            setUndoCanvas()
        } else if (e.ctrlKey && e.key === 'y') {
            setRedoCanvas()
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            setActiveObjectClose()
        }
    })

    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = 'blue'

    fabric.Object.prototype.setControlVisible('mt', false)
    fabric.Object.prototype.setControlVisible('mb', false)
    fabric.Object.prototype.setControlVisible('ml', false)
    fabric.Object.prototype.setControlVisible('mr', false)
}

export const getCanvasFrontIndex = () => {
    let isFound = false
    let frontIndex = canvasIndex.FRONT
    canvas.getObjects().forEach((object, index) => {
        if (object.isRealia && !isFound) {
            isFound = true
            frontIndex = index - 1
        }
    })

    return frontIndex
}

const dragBeginCanvas = e => {
    if (e.which !== 3) {
        return
    }

    isDrag = true
}

const draggingCanvas = e => {
    if (!isDrag) {
        return
    }

    const delta = new fabric.Point(e.movementX, e.movementY)
    canvas.relativePan(delta)
}

const dragEndCanvas = e => {
    isDrag = false
}

const zoomCanvas = e => {
    const pointer = canvas.getPointer(e, true)

    let zoom = store.state.common.canvasZoom

    zoom += e.wheelDelta > 0 ? (zoom >= 100 ? 20 : 10) : (zoom > 1 ? -20 : -10)

    if (zoom < 50) {
        zoom = 50
    } else if (zoom > 200) {
        zoom = 200
    }

    canvas.zoomToPoint(pointer, zoom / 100)

    store.commit('common/SET_CANVAS_ZOOM', zoom)

    canvas.renderAll()
}

export const setCanvasZoom = zoom => {
    canvas.zoomToPoint(canvas.getVpCenter(), zoom / 100)

    canvas.renderAll()
}

export const adjustCursor = (val) => {
    if (val === toolType.PEN || val === toolType.SHAPE || val === toolType.REALIA) {
        canvas.defaultCursor = 'crosshair'
    } else if (val === toolType.CHOOSE) {
        canvas.defaultCursor = 'auto'
    } else if (val === toolType.ERASER) {
        canvas.defaultCursor = 'pointer'
    } else if (val === toolType.TEXT) {
        canvas.defaultCursor = 'text'
    }
}

export const loadCanvas = (pageId) => {
    const data = canvasData[pageId] || {
        objects: [],
        version: '5.2.1'
    }

    showOprBar(false)
    renderCanvasData(data)
}

const renderCanvasData = data => {
    // 这个方式可以忽略background,减少渲染时间,适用于本机
    // clearCanvas()

    // data.objects.forEach(o => {
    //     const typeName = capitalizeFirstLetter(o.type)
    //     fabric[typeName].fromObject(o, e => {
    //         canvas.insertAt(e, getCanvasFrontIndex())
    //     })
    // })

    // 这个方式会渲染background
    canvas.loadFromJSON(data)
}

export const clearCanvas = () => {
    canvas.getObjects().map(o => o).forEach(object => {
        if (!object.isRealia) {
            canvas.remove(object)
        }
    })
}

export const clearCanvasText = () => {
    canvas.getObjects().map(o => o).forEach(object => {
        if (object.type === 'textbox') {
            canvas.remove(object)
        }
    })
}

export const clearCanvasObject = () => {
    canvas.getObjects().map(o => o).forEach(object => {
        if (!object.isRealia && object.type !== 'textbox') {
            canvas.remove(object)
        }
    })
}

export const removeCanvas = (pageId) => {
    delete (canvasData.pageId)
}

export const setActiveObjectClose = () => {
    const activeObject = canvas.getActiveObject()

    if (!activeObject) {
        return
    }

    if (activeObject.isRealia) {
        return
    }

    if (activeObject.type === 'activeSelection') {
        activeObject.getObjects().forEach(o => {
            canvas.remove(o)
        })
        canvas.discardActiveObject()
    } else {
        canvas.remove(activeObject)
    }
}

export const setBackgroundColor = (color) => {
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas))
}

export const setBackgroundPattern = (patternSrc, isRepeat) => {
    canvas.setBackgroundColor({
        source: patternSrc,
        repeat: isRepeat ? 'repeat' : 'no-repeat'
    }, canvas.renderAll.bind(canvas))
}

export const setUndoCanvas = () => {
    const history = canvasHistorys[store.state.common.page]

    if (history.index === 0) {
        return
    }

    const data = history.datas[history.index - 1]

    renderCanvasData(data)

    history.index -= 1

    mitt.emit('reInitRealia')
}

export const setRedoCanvas = () => {
    const history = canvasHistorys[store.state.common.page]

    if (history.index === history.datas.length - 1) {
        return
    }

    const data = history.datas[history.index + 1]

    renderCanvasData(data)

    history.index += 1

    mitt.emit('reInitRealia')
}

export const setActiveObjectBringToFront = () => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
        return
    }

    if (activeObject.type === 'activeSelection') {
        activeObject.getObjects().forEach(o => {
            setObjectBringToFront(o)
        })
    } else {
        setObjectBringToFront(activeObject)
    }
}

const setObjectBringToFront = object => {
    object.moveTo(getCanvasFrontIndex())
}

export const setActiveObjectSendToBack = () => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
        return
    }

    activeObject.sendToBack()
}

export const setActiveObjectColor = color => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
        return
    }

    if (activeObject.type === 'activeSelection') {
        activeObject.getObjects().forEach(o => {
            setObjectColor(o, color)
        })
    } else {
        setObjectColor(activeObject, color)
    }
}

const setObjectColor = (object, color) => {
    if (object.type === 'textbox') {
        const selectedText = object.getSelectedText()
        if (selectedText === '') {
            object.setOptions({ fill: color })
        } else {
            object.setSelectionStyles({
                fill: color
            })
        }
    } else {
        object.setOptions({ stroke: color })
    }

    canvas.renderAll()
}

export const setActiveObjectSize = size => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
        return
    }

    if (activeObject.type === 'activeSelection') {
        activeObject.getObjects().forEach(o => {
            setObjectSize(o, size)
        })
    } else {
        setObjectSize(activeObject, size)
    }
}

const setObjectSize = (object, size) => {
    if (object.type === 'textbox') {
        const selectedText = object.getSelectedText()
        if (selectedText === '') {
            object.setOptions({ fontSize: size * 6 })
        } else {
            object.setSelectionStyles({
                fontSize: size * 6
            })
        }
    } else if (object.strokeWidth) {
        object.setOptions({ strokeWidth: size })
    }

    canvas.renderAll()
}

export const setActiveObjectCopy = () => {
    const activeObject = canvas.getActiveObject()

    if (!activeObject) {
        return
    }

    if (activeObject.isRealia) {
        return
    }

    copyObject = activeObject
    const image = copyObject.toDataURL()
    store.commit('common/SET_COPY_IMAGE', image)

    Notify.create({
        timeout: 2000,
        message: 'Object Copied',
        position: 'top',
        type: 'positive'
    })
}

export const setActiveObjectLock = (isLocked) => {
    const activeObject = canvas.getActiveObject()

    if (!activeObject) {
        return
    }

    activeObject.lockMovementX = isLocked
    activeObject.lockMovementY = isLocked
    activeObject.lockRotatio = isLocked
    activeObject.hasControls = !isLocked

    activeObject.isLocked = isLocked

    canvas.renderAll()
}

export const setCopiedObjectPaste = () => {
    if (!copyObject) {
        return
    }

    if (copyObject.type === 'activeSelection') {
        copyObject.clone(cloneObject => {
            cloneObject.getObjects().forEach(o => {
                o.clone(cloneO => {
                    cloneO.left += cloneObject.width / 2 + 100
                    cloneO.top += cloneObject.height / 2 + 50

                    canvas.insertAt(cloneO, getCanvasFrontIndex())
                })
            })
        })
    } else {
        copyObject.clone(o => {
            o.left = 100
            o.top = 50

            canvas.insertAt(o, getCanvasFrontIndex())
        })
    }

    Notify.create({
        timeout: 2000,
        message: 'Object Pasted',
        position: 'top',
        type: 'positive'
    })
}

export const setCopiedObjectClose = () => {
    if (!copyObject) {
        return
    }

    copyObject = null
    store.commit('common/SET_COPY_IMAGE', null)

    Notify.create({
        timeout: 2000,
        message: 'Copy Object Cleared',
        position: 'top',
        type: 'positive'
    })
}
