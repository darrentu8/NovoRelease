import { fabric } from 'fabric'
import { toolType } from 'src/helper/enum'
import { adjustCursor, canvas } from '../canvas'

import store from '../../store'
import { mitt } from 'src/boot/bus'

let isDrag = false
let isActive = false
const beginPos = { x: 0, y: 0 }

export const initCanvasMove = () => {
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
}

export const activeMove = () => {
    store.commit('common/SET_SELECTED_TOOL', toolType.MOVE)

    isActive = true
    adjustCursor(toolType.MOVE)
}

export const inactiveMove = () => {
    isActive = false
}

const dragBeginCanvas = e => {
    if (e.which === 3) {
        isDrag = true
    } else if (e.which === 1 && isActive) {
        isDrag = true
    } else if (e.which === 0 && isActive) {
        isDrag = true

        beginPos.x = e.touches[0].clientX
        beginPos.y = e.touches[0].clientY
    }
}

const draggingCanvas = e => {
    if (!isDrag) {
        return
    }

    const delta = new fabric.Point(
        e.touches ? (e.touches[0].clientX - beginPos.x) : e.movementX,
        e.touches ? (e.touches[0].clientY - beginPos.y) : e.movementY
    )
    canvas.relativePan(delta)

    if (e.touches) {
        beginPos.x = e.touches[0].clientX
        beginPos.y = e.touches[0].clientY
    }

    mitt.emit('dealDraggableRects')
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

    mitt.emit('dealDraggableRects')
}
