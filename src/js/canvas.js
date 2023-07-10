import { fabric } from 'fabric'
import { debounce, throttle, is, extend, Notify } from 'quasar'

import store from '../store'
import { canvasIndex, canvasPropertiesToInclude, strokeType, toolType } from 'src/helper/enum'
import { mitt } from 'src/boot/bus'
import { showOprBar } from './operationBar'
import {
    setWhiteboardThumbnail
} from 'src/api/whiteboard'
import { webSocket } from './websocket'
import { isEditor } from 'src/helper/project'
import { removeEmptyTextbox } from './toolbar/text'

// import { capitalizeFirstLetter } from 'src/helper/string'

export let canvas = null

export const canvasBrush = {
    strokeColor: '#3A87FD',
    strokeColorCalc: '#3A87FDFF',
    strokeSize: 5,
    strokeType: strokeType.SOLID,
    strokeDash: [],
    strokeOpacity: 100,
    fillColor: '#3A87FD',
    fillColorCalc: '#3A87FD00',
    fillOpacity: 0
}

let canvasData = {}
const canvasHistorys = {}

let copyObject = null

let lastCanvasData = null

export const initCanvas = domId => {
    // canvas = new fabric.StaticCanvas(domId)
    canvas = new fabric.Canvas(domId, {
        selection: false,
        fireRightClick: true,
        stopContextMenu: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        backgroundColor: '#FEFFFE'
    })

    window.onbeforeunload = function () {
        setContent()
        leaveWhiteBoard()
    }

    canvas.on('after:render', debounce(options => {
        setContent()
        saveHistory()
    }, 200))

    canvas.on('object:modified', o => {
        removeEmptyTextbox(o.target)
        markObjectLastModifiedUser(o.target)
    })

    canvas.on('mouse:move', throttle(options => {
        // console.log(options.pointer, options.absolutePointer)
        // console.log(restorePointerVptInvert(options.absolutePointer, canvas.viewportTransform))
        // absolutePointer =  canvas.restorePointerVpt(options.pointer)
        // pointer = restorePointerVptInvert(absolutePointer,viewportTransform)
        if (!isEditor()) {
            return
        }

        if (store.state.user.userList.length <= 1) {
            return
        }

        if (webSocket && webSocket.readyState === 1) {
            const pid = store.state.common.pid
            const pageId = store.state.common.page
            webSocket.send(JSON.stringify({ command: 'USER_MOUSE_POSITION', pid, page_id: pageId, data: JSON.stringify(options.absolutePointer) }))
        }
    }, 75))

    window.addEventListener('keyup', e => {
        const activeObject = canvas.getActiveObject()

        if (activeObject && activeObject.isEditing) {
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
    fabric.Object.prototype.cornerColor = '#14A028'
    fabric.Object.prototype.cornerStrokeColor = '#FFFFFF'
    fabric.Object.prototype.cornerStyle = 'circle'
    fabric.Object.prototype.cornerSize = 15
    fabric.Object.prototype.borderColor = '#BBBBBB'

    const rotateSvg = require('../assets/icons/icon_canvas_rotate.svg')
    const icon = document.createElement('img')
    icon.src = rotateSvg

    fabric.Object.prototype.controls.mtr.render = (ctx, left, top, styleOverride, fabricObject) => {
        const size = 30
        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
        ctx.drawImage(icon, -size / 2, -size / 2, size, size)
        ctx.restore()
    }
    fabric.Object.prototype.controls.mtr.cursorStyle = 'pointer'
    // fabric.Object.prototype.controls.mtr.x = 0.5
    // fabric.Object.prototype.controls.mtr.y = 0
    // fabric.Object.prototype.controls.mtr.offsetX = 30
    // fabric.Object.prototype.controls.mtr.offsetY = 0
}

export const setContent = () => {
    const pageData = canvas.toJSON(canvasPropertiesToInclude)

    const pageId = store.state.common.page

    canvasData[pageId] = pageData

    const pid = store.state.common.pid
    const uid = store.getters['auth/getUID']

    if (!lastCanvasData) {
        lastCanvasData = extend(true, {}, canvasData)
        return
    }

    if (pid && uid && !is.deepEqual(canvasData, lastCanvasData)) {
        if (!isEditor()) {
            Notify.create({
                timeout: 2000,
                message: 'Since you are viewer,all operations will not be synchronized to cloud',
                position: 'top',
                type: 'negative'
            })
            return
        }

        if (webSocket && webSocket.readyState === 1) {
            webSocket.send(JSON.stringify({ command: 'CONTENT_PAGE_UPDATE', pid, page_id: pageId, data: JSON.stringify(pageData) }))
            lastCanvasData = extend(true, {}, canvasData)
            setThumbnail()
        }
    }
}

export const setPageList = () => {
    if (!isEditor()) {
        Notify.create({
            timeout: 2000,
            message: 'Since you are viewer,all operations will not be synchronized to cloud',
            position: 'top',
            type: 'negative'
        })
        return
    }

    const pages = store.state.common.pages
    const pid = store.state.common.pid
    if (webSocket && webSocket.readyState === 1) {
        webSocket.send(JSON.stringify({ command: 'CONTENT_PAGE_LIST', pid, data: JSON.stringify(pages) }))
    }
}

const saveHistory = () => {
    const data = canvas.toJSON(canvasPropertiesToInclude)

    const pageId = store.state.common.page

    if (!canvasHistorys[pageId]) {
        canvasHistorys[pageId] = {}
        canvasHistorys[pageId].datas = [data]
        canvasHistorys[pageId].index = 0
    } else {
        const isEqual = is.deepEqual(canvasHistorys[pageId].datas[canvasHistorys[pageId].index].objects, data.objects)
        if (!isEqual) {
            canvasHistorys[pageId].datas = canvasHistorys[pageId].datas.slice(0, canvasHistorys[pageId].index + 1)
            canvasHistorys[pageId].datas.push(data)
            canvasHistorys[pageId].index = canvasHistorys[pageId].datas.length - 1
        }
    }
}

export const getCanvasFrontIndex = () => {
    let isFound = false
    let frontIndex = canvasIndex.FRONT
    canvas.getObjects().forEach((object, index) => {
        if (object.isRealia && !isFound) {
            isFound = true
            frontIndex = index
        }
    })

    return frontIndex
}

export const setCanvasZoom = zoom => {
    canvas.zoomToPoint(canvas.getVpCenter(), zoom / 100)
    canvas.renderAll()
}

export const setCanvasRestoreViewport = zoom => {
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0]
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
    } else if (val === toolType.MOVE) {
        canvas.defaultCursor = 'grab'
    }
}

export const loadCanvas = (pageId) => {
    const data = canvasData[pageId] || {
        objects: [],
        backgroundColor: '#FEFFFE',
        version: '5.2.1'
    }

    showOprBar(false)
    renderCanvasData(data)
}

export const setCanvasDataAndRender = (data, id) => {
    if (is.deepEqual(canvasData, data)) {
        return
    }

    canvasData = data
    lastCanvasData = extend(true, {}, canvasData)

    for (const pid in canvasData) {
        const pages = store.state.common.pages
        const index = pages.findIndex(o => o.id === pid)
        if (index < 0) {
            delete canvasData[pid]
        }
    }

    renderCanvasData(canvasData[id])
}

export const setPageDataAndRender = (data, pageId) => {
    if (is.deepEqual(canvasData[pageId], data)) {
        return
    }

    canvasData[pageId] = data
    lastCanvasData = extend(true, {}, canvasData)

    if (store.state.common.page === pageId) {
        renderCanvasData(canvasData[pageId])
    }
}

const renderCanvasData = data => {
    canvas.loadFromJSON(data, canvas.renderAll.bind(canvas), function (o, object) {
        if (object.type === 'textbox' && !object.isLocked) { // 正在编辑的textbox
            object.lockMovementX = false
            object.lockMovementY = false
        }
    })
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
    delete canvasData[pageId]
}

export const setActiveObjectClose = () => {
    const activeObject = canvas.getActiveObject()

    if (!activeObject) {
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

    showOprBar(false)
}

export const setBackgroundColor = (color) => {
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas))
}

export const clearBackgroundPattern = () => {
    // canvas.backgroundImage = null
    // canvas.renderAll()
    canvas.getObjects().forEach(o => {
        if (o.isBackground) {
            canvas.remove(o)
        }
    })
}

export const setBackgroundPattern = (patternSrc, isRepeat) => {
    // canvas.setBackgroundImage(patternSrc, canvas.renderAll.bind(canvas))
    clearBackgroundPattern()
    fabric.Image.fromURL(patternSrc, backgroundObject => {
        backgroundObject.evented = false
        backgroundObject.selectable = false
        backgroundObject.isBackground = true

        canvas.add(backgroundObject)
        canvas.centerObject(backgroundObject)

        backgroundObject.sendToBack()
    })
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

    const backgroundImage = canvas.getObjects().find(o => o.isBackground)

    if (backgroundImage) {
        activeObject.moveTo(1)
    } else {
        activeObject.moveTo(0)
    }
}

export const setActiveObjectStrokeColor = color => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
        return
    }

    if (activeObject.type === 'activeSelection' || activeObject.type === 'group') {
        activeObject.getObjects().forEach(o => {
            setObjectStrokeColor(o, color)
        })
    } else {
        setObjectStrokeColor(activeObject, color)
    }
}

const setObjectStrokeColor = (object, color) => {
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

export const setActiveObjectStrokeSize = size => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
        return
    }

    if (activeObject.type === 'activeSelection' || activeObject.type === 'group') {
        activeObject.getObjects().forEach(o => {
            setObjectStrokeSize(o, size)
        })
    } else {
        setObjectStrokeSize(activeObject, size)
    }
}

const setObjectStrokeSize = (object, size) => {
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

export const setActiveObjectStrokeType = type => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
        return
    }

    if (activeObject.type === 'activeSelection' || activeObject.type === 'group') {
        activeObject.getObjects().forEach(o => {
            setObjectStrokeType(o, type)
        })
    } else {
        setObjectStrokeType(activeObject, type)
    }
}

const setObjectStrokeType = (object, type) => {
    if (object.type === 'textbox') {
        return
    } else if (object.strokeWidth) {
        let strokeDashArray = []
        if (type === strokeType.SOLID) {
            strokeDashArray = []
        } else if (type === strokeType.DASH) {
            strokeDashArray = [object.strokeWidth * 2]
        } else if (type === strokeType.DASH_LONG) {
            strokeDashArray = [object.strokeWidth * 5]
        }

        object.setOptions({ strokeDashArray })
    }

    canvas.renderAll()
}

export const setActiveObjectFillColor = color => {
    const activeObject = canvas.getActiveObject()
    if (!activeObject) {
        return
    }

    if (activeObject.type === 'activeSelection' || activeObject.type === 'group') {
        activeObject.getObjects().forEach(o => {
            setObjectFillColor(o, color)
        })
    } else {
        setObjectFillColor(activeObject, color)
    }
}

const setObjectFillColor = (object, color) => {
    if (object.type === 'textbox') {
        const selectedText = object.getSelectedText()
        if (selectedText === '') {
            object.setOptions({ textBackgroundColor: color })
        } else {
            object.setSelectionStyles({
                textBackgroundColor: color
            })
        }
    } else {
        object.setOptions({ fill: color })
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

export const setActiveSelectionGroup = (isLocked) => {
    const activeObject = canvas.getActiveObject()

    if (!activeObject) {
        return
    }

    if (activeObject.type !== 'activeSelection') {
        return
    }

    const group = activeObject.toGroup()

    canvas.setActiveObject(group)

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
                    markObjectOwner(cloneO)
                }, canvasPropertiesToInclude)
            })
        }, canvasPropertiesToInclude)
    } else {
        copyObject.clone(o => {
            o.left = 100
            o.top = 50

            canvas.insertAt(o, getCanvasFrontIndex())
            markObjectOwner(o)
        }, canvasPropertiesToInclude)
    }
}

export const setCopiedObjectClose = () => {
    if (!copyObject) {
        return
    }

    copyObject = null
    store.commit('common/SET_COPY_IMAGE', null)
}

export const setThumbnail = () => {
    const pid = store.state.common.pid
    const uid = store.getters['auth/getUID']
    if (!pid || !uid) {
        return
    }
    const pageId = store.state.common.page
    if (!pageId) {
        return
    }
    const thumbnail = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.2
    }).split(';base64,')[1]
    setWhiteboardThumbnail(pid, uid, thumbnail, pageId)
}

export const leaveWhiteBoard = () => {
    const pid = store.state.common.pid
    const uid = store.getters['auth/getUID']
    if (!pid || !uid) {
        return
    }

    if (webSocket && webSocket.readyState === 1) {
        webSocket.send(JSON.stringify({ command: 'PROJECT_LEAVE', pid }))
    }
}

export const markObjectOwner = object => {
    const user = store.getters['auth/getUserData']

    if (!user) {
        return
    }

    object.ownerName = `${user.fname} ${user.lname}`
    object.lastModifiedUserName = `${user.fname} ${user.lname}`
    object.lastModifiedTime = new Date().toLocaleString()
}

export const markObjectLastModifiedUser = object => {
    const user = store.getters['auth/getUserData']

    if (!user) {
        return
    }

    object.lastModifiedUserName = `${user.fname} ${user.lname}`
    object.lastModifiedTime = new Date().toLocaleString()
}
