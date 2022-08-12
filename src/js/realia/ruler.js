import { canvas, getCanvasFrontIndex, canvasBrush } from '../canvas'
import { fabric } from 'fabric'

import { isActice } from './realia'
import { getFootPoint, getPointInLine, pointToPointDistance } from '../../helper/math'
import { canvasIndex } from 'src/helper/enum'

let realiaObject = null

let isInit = false

let isDrawing = false
let drawingObject = null
const moveFrom = { x: 0, y: 0 }

export const initRuler = () => {
    if (realiaObject) {
        canvas.insertAt(realiaObject, canvasIndex.FRONT)
    } else {
        const rulerImg = require('../../assets/images/ruler.svg')
        fabric.loadSVGFromURL(rulerImg, (objects, options) => {
            const img = fabric.util.groupSVGElements(objects, options)

            img.left = 300
            img.top = 500
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

export const unInitRuler = () => {
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
    const footPoint = getRulerFootPoint(pointer)

    if (!footPoint) {
        return
    }

    const distance = pointToPointDistance(pointer, footPoint)

    if (distance < 30) {
        [moveFrom.x, moveFrom.y] = [footPoint.x, footPoint.y]
        isDrawing = true
    }
}

const mouseUp = e => {
    if (!realiaObject) {
        return
    }
    isDrawing = false

    if (drawingObject) {
        drawingObject = null
    }
}

const mouseMove = e => {
    if (!realiaObject || !isDrawing) {
        return
    }

    const pointer = canvas.getPointer(e, true)
    const footPoint = getRulerFootPoint(pointer)

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

const getRulerFootPoint = (pointer) => {
    realiaObject.setCoords()

    const p1 = new fabric.Point(pointer.x, pointer.y)
    const p2 = realiaObject.oCoords.tl
    const p3 = realiaObject.oCoords.tr

    const footPoint = getFootPoint(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)

    if (!footPoint) {
        return false
    }

    const length = pointToPointDistance(p1, footPoint)

    const fpOffset = getPointInLine(p1, footPoint, length)

    return new fabric.Point(fpOffset.x, fpOffset.y)
}
