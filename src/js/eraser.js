import { adjustCursor, canvas, canvasBrush, getCanvasFrontIndex } from './canvas'
import { fabric } from 'fabric'
import { toolType } from 'src/helper/enum'

let isInit = false
let isActive = false

let isErasing = false

let drawingObject = null

export const initEraser = () => {
    isActive = true

    adjustCursor(toolType.ERASER)

    if (!isInit) {
        canvas.on('mouse:down', options => {
            if (!isActive) {
                return
            }
            mouseDown(options.e)
        })
        canvas.on('mouse:up', options => {
            if (!isActive) {
                return
            }
            mouseUp(options.e)
        })
        canvas.on('mouse:move', options => {
            if (!isActive) {
                return
            }
            mouseMove(options.e)
        })

        isInit = true
    }
}

export const unInitEraser = () => {
    isActive = false

    if (drawingObject) {
        canvas.remove(drawingObject)
        drawingObject = null
    }
}

const mouseDown = e => {
    if (e.which !== 1 && e.which !== 0) { //  touch 0
        return
    }

    isErasing = true

    const pointer = canvas.getPointer(e, true)
    const pointerDraw = canvas.restorePointerVpt(pointer)

    const radius = canvasBrush.size * 3
    const eraser = new fabric.Circle({
        left: pointerDraw.x - radius,
        top: pointerDraw.y - radius,
        stroke: 'gray',
        strokeWidth: 4,
        strokeDashArray: [5, 5],
        fill: 'transparent',
        evented: false,
        selectable: false,
        radius
    })

    canvas.insertAt(eraser, getCanvasFrontIndex())

    drawingObject = eraser
}

const mouseUp = e => {
    isErasing = false

    if (drawingObject) {
        canvas.remove(drawingObject)
        drawingObject = null
    }
}

const mouseMove = e => {
    if (!isErasing) {
        return
    }

    const pointer = canvas.getPointer(e, true)
    const pointerDraw = canvas.restorePointerVpt(pointer)

    const radius = canvasBrush.size * 3
    drawingObject.setRadius(radius)
    drawingObject.left = pointerDraw.x - radius
    drawingObject.top = pointerDraw.y - radius
    canvas.renderAll()

    canvas.getObjects().map(o => o).forEach(object => {
        if (!object.isRealia && object !== drawingObject) {
            if (drawingObject.intersectsWithObject(object, true, true)) {
                canvas.remove(object)
            }
        }
    })
}
