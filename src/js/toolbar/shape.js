import { adjustCursor, canvas, getCanvasFrontIndex, canvasBrush, markObjectOwner } from '../canvas'
import { fabric } from 'fabric'
import { shapeType, toolType } from '../../helper/enum'
import { pointToPointDistance } from 'src/helper/math'
import { activeChoose } from './choose'

let isInit = false
let isActive = false

let curShapeType = 1

let isDrawing = false
const moveFrom = { x: 0, y: 0 }
const moveTo = { x: 0, y: 0 }
let drawingObject = null

export const initShape = () => {
    isActive = true

    adjustCursor(toolType.SHAPE)

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

export const uninitShape = () => {
    isInit = false
}

export const inactiveShape = () => {
    isActive = false
}

export const setShapeType = type => {
    curShapeType = type
}

const mouseDown = e => {
    if (e.which !== 1 && e.which !== 0) { //  touch 0
        return
    }

    isDrawing = true

    const pointer = canvas.getPointer(e, true)

    moveFrom.x = pointer.x
    moveFrom.y = pointer.y
}

const mouseUp = e => {
    isDrawing = false

    activeChoose()

    canvas.setActiveObject(drawingObject)
    canvas.renderAll()

    if (drawingObject) {
        drawingObject = null
    }
}

const mouseMove = e => {
    if (!isDrawing) {
        return
    }

    const pointer = canvas.getPointer(e, true)

    moveTo.x = pointer.x
    moveTo.y = pointer.y

    drawShape()
}

const drawShape = () => {
    if (drawingObject) {
        canvas.remove(drawingObject)
    }

    const moveFromDraw = canvas.restorePointerVpt(moveFrom)
    const moveToDraw = canvas.restorePointerVpt(moveTo)

    switch (curShapeType) {
        case shapeType.LINE: drawingObject = drawLine(moveFromDraw, moveToDraw); break
        case shapeType.RECT: drawingObject = drawRect(moveFromDraw, moveToDraw); break
        case shapeType.CIRCLE: drawingObject = drawCircle(moveFromDraw, moveToDraw); break
        case shapeType.TRIANGLE: drawingObject = drawTriangle(moveFromDraw, moveToDraw); break
    }

    canvas.insertAt(drawingObject, getCanvasFrontIndex())

    markObjectOwner(drawingObject)
}

const drawLine = (moveFromDraw, moveToDraw) => {
    const line = new fabric.Line([moveFromDraw.x, moveFromDraw.y, moveToDraw.x, moveToDraw.y], {
        stroke: canvasBrush.strokeColorCalc,
        fill: canvasBrush.fillColorCalc,
        strokeWidth: canvasBrush.strokeSize,
        strokeDashArray: canvasBrush.strokeDash,
        evented: false,
        selectable: false,
        strokeUniform: true
    })

    return line
}

const drawRect = (moveFromDraw, moveToDraw) => {
    const rect = new fabric.Rect({
        left: moveToDraw.x - moveFromDraw.x > 0 ? moveFromDraw.x : moveToDraw.x,
        top: moveToDraw.y - moveFromDraw.y > 0 ? moveFromDraw.y : moveToDraw.y,
        width: Math.abs(moveToDraw.x - moveFromDraw.x),
        height: Math.abs(moveToDraw.y - moveFromDraw.y),
        stroke: canvasBrush.strokeColorCalc,
        fill: canvasBrush.fillColorCalc,
        strokeWidth: canvasBrush.strokeSize,
        strokeDashArray: canvasBrush.strokeDash,
        evented: false,
        selectable: false,
        strokeUniform: true
    })

    return rect
}

const drawCircle = (moveFromDraw, moveToDraw) => {
    const radius = pointToPointDistance(moveFromDraw, moveToDraw)
    const circle = new fabric.Circle({
        left: moveFromDraw.x,
        top: moveFromDraw.y,
        originX: 'center',
        originY: 'center',
        stroke: canvasBrush.strokeColorCalc,
        fill: canvasBrush.fillColorCalc,
        strokeWidth: canvasBrush.strokeSize,
        strokeDashArray: canvasBrush.strokeDash,
        evented: false,
        selectable: false,
        strokeUniform: true,
        radius
    })

    return circle
}

const drawTriangle = (moveFromDraw, moveToDraw) => {
    const deltaX = moveToDraw.x - moveFromDraw.x
    const points = [{
        x: moveFromDraw.x, y: moveFromDraw.y
    }, {
        x: moveToDraw.x, y: moveToDraw.y
    }, {
        x: moveFromDraw.x - deltaX, y: moveToDraw.y
    }]
    const triangle = new fabric.Polygon(points, {
        evented: false,
        selectable: false,
        stroke: canvasBrush.strokeColorCalc,
        fill: canvasBrush.fillColorCalc,
        strokeWidth: canvasBrush.strokeSize,
        strokeDashArray: canvasBrush.strokeDash,
        strokeUniform: true
    })

    return triangle
}
