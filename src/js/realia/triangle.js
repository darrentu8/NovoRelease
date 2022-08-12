import { canvas, getCanvasFrontIndex, canvasBrush } from '../canvas'
import { fabric } from 'fabric'

import { isActice } from './realia'
import { getFootPoint, getPointInLine, pointToPointDistance } from '../../helper/math'
import { canvasIndex } from 'src/helper/enum'

let realiaObject = null

let isInit = false

let isDrawing = false
let isDrawingLeft = false
let isDrawingRight = false
let isDrawingBottom = false

let drawingObject = null
const moveFrom = { x: 0, y: 0 }

export const initTriangle = () => {
    if (realiaObject) {
        canvas.insertAt(realiaObject, canvasIndex.FRONT)
    } else {
        const triangleImg = require('../../assets/images/Triangle-board.svg')
        fabric.loadSVGFromURL(triangleImg, (objects, options) => {
            const img = fabric.util.groupSVGElements(objects, options)

            img.left = 300
            img.top = 200
            img.selectable = false
            img.evented = false

            img.isRealia = true

            canvas.insertAt(img, canvasIndex.FRONT)

            realiaObject = img
        })
    }

    if (!isInit) {
        canvas.on('mouse:down', options => {
            if (!isActice) {
                return
            }
            mouseDown(options.e)
        })
        canvas.on('mouse:up', options => {
            if (!isActice) {
                return
            }
            mouseUp(options.e)
        })
        canvas.on('mouse:move', options => {
            if (!isActice) {
                return
            }
            mouseMove(options.e)
        })

        isInit = true
    }
}

export const unInitTriangle = () => {
    if (realiaObject) {
        canvas.remove(realiaObject)
        realiaObject = null
    }
}

const mouseDown = e => {
    if (!realiaObject) {
        return
    }

    const pointer = canvas.getPointer(e, true)

    const footPointLeft = getTriangleFootPointLeft(pointer)
    const footPointRight = getTriangleFootPointRight(pointer)
    const footPointBottom = getTriangleFootPointBottom(pointer)

    let distanceLeft, distanceRight, distanceBottom

    if (!footPointLeft && !footPointRight && !footPointBottom) {
        return
    }

    if (footPointLeft) {
        distanceLeft = pointToPointDistance(pointer, footPointLeft)
    }
    if (footPointRight) {
        distanceRight = pointToPointDistance(pointer, footPointRight)
    }
    if (footPointBottom) {
        distanceBottom = pointToPointDistance(pointer, footPointBottom)
    }

    const distance = Math.min(distanceLeft || 100, distanceRight || 100, distanceBottom || 100)

    if (distance < 30) {
        if (distance === distanceLeft) {
            moveFrom.x = footPointLeft.x
            moveFrom.y = footPointLeft.y
            isDrawingLeft = true
        } else if (distance === distanceRight) {
            moveFrom.x = footPointRight.x
            moveFrom.y = footPointRight.y
            isDrawingRight = true
        } else if (distance === distanceBottom) {
            moveFrom.x = footPointBottom.x
            moveFrom.y = footPointBottom.y
            isDrawingBottom = true
        }

        isDrawing = true
    }
}

const mouseUp = e => {
    if (!realiaObject) {
        return
    }

    isDrawing = false
    isDrawingLeft = false
    isDrawingRight = false
    isDrawingBottom = false

    if (drawingObject) {
        drawingObject = null
    }
}

const mouseMove = e => {
    if (!realiaObject || !isDrawing) {
        return
    }

    const pointer = canvas.getPointer(e, true)

    let footPoint
    if (isDrawingLeft) {
        footPoint = getTriangleFootPointLeft(pointer)
    } else if (isDrawingRight) {
        footPoint = getTriangleFootPointRight(pointer)
    } else if (isDrawingBottom) {
        footPoint = getTriangleFootPointBottom(pointer)
    }

    if (!footPoint) {
        return
    }

    if (drawingObject) {
        canvas.remove(drawingObject)
        drawingObject = null
    }

    const moveFromDraw = canvas.restorePointerVpt(moveFrom)
    const moveToDraw = canvas.restorePointerVpt(footPoint)

    const line = new fabric.Path(`M ${moveFromDraw.x} ${moveFromDraw.y} L ${moveToDraw.x} ${moveToDraw.y}`, {
        stroke: canvasBrush.color,
        strokeWidth: canvasBrush.size,
        selectable: false,
        evented: false
    })

    drawingObject = line

    canvas.insertAt(line, getCanvasFrontIndex())
}

const getTriangleFootPointLeft = (pointer) => {
    realiaObject.setCoords()

    const p1 = pointer
    const p2 = realiaObject.oCoords.mt
    const p3 = realiaObject.oCoords.bl

    const footPoint = getFootPoint(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)

    if (!footPoint) {
        return false
    }

    const length = pointToPointDistance(p1, footPoint)

    const fpOffset = getPointInLine(p1, footPoint, length)

    return new fabric.Point(fpOffset.x, fpOffset.y)
}

const getTriangleFootPointRight = (pointer) => {
    realiaObject.setCoords()

    const p1 = pointer
    const p2 = realiaObject.oCoords.mt
    const p3 = realiaObject.oCoords.br

    const footPoint = getFootPoint(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)

    if (!footPoint) {
        return false
    }

    const length = pointToPointDistance(p1, footPoint)

    const fpOffset = getPointInLine(p1, footPoint, length)

    return new fabric.Point(fpOffset.x, fpOffset.y)
}

const getTriangleFootPointBottom = (pointer) => {
    realiaObject.setCoords()

    const p1 = pointer
    const p2 = realiaObject.oCoords.bl
    const p3 = realiaObject.oCoords.br

    const footPoint = getFootPoint(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)

    if (!footPoint) {
        return false
    }

    const length = pointToPointDistance(p1, footPoint)

    const fpOffset = getPointInLine(p1, footPoint, length)

    return new fabric.Point(fpOffset.x, fpOffset.y)
}
