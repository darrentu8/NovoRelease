import { canvas, getCanvasFrontIndex, canvasBrush } from '../canvas'
import { fabric } from 'fabric'

import { isActice } from './realia'
import { getIntersectionAngle, getPointInLine, isClockwise, pointToPointDistance } from '../../helper/math'
import { canvasIndex } from 'src/helper/enum'

let isInit = false

let realiaObject = null
let isDrawing = false
let drawingObject = null
const moveFrom = { x: 0, y: 0 }

export const initProtractor = () => {
    if (realiaObject) {
        canvas.insertAt(realiaObject, canvasIndex.FRONT)
    } else {
        const protractorImg = require('../../assets/images/protractor.svg')
        fabric.loadSVGFromURL(protractorImg, (objects, options) => {
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

export const unInitProtractor = () => {
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
    const centerPoint = getCenterPoint(pointer)

    const distance = pointToPointDistance(pointer, centerPoint)
    const radius = getRadius()

    const delta = Math.abs(distance - radius)

    const intersectionAngle = getIntersectionAngle(centerPoint, getTopPoint(), pointer)

    if (delta < 30 && intersectionAngle.deg <= 90) {
        isDrawing = true

        const startPoint = getPointInLine(centerPoint, pointer, radius)

        moveFrom.x = startPoint.x
        moveFrom.y = startPoint.y
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
    const centerPoint = getCenterPoint(pointer)

    const intersectionAngle = getIntersectionAngle(centerPoint, getTopPoint(), pointer)

    if (intersectionAngle.deg > 90) {
        return
    }

    if (drawingObject) {
        canvas.remove(drawingObject)
        drawingObject = null
    }

    const radius = getRadius()

    const endPoint = getPointInLine(centerPoint, pointer, radius)

    const isDrawClockwise = isClockwise(centerPoint, moveFrom, endPoint)

    const moveFromDraw = canvas.restorePointerVpt(moveFrom)
    const moveToDraw = canvas.restorePointerVpt(endPoint)
    const radiusDraw = radius / canvas.getZoom()

    const path = new fabric.Path(`M ${moveFromDraw.x} ${moveFromDraw.y} A ${radiusDraw} ${radiusDraw} 0 0 ${isDrawClockwise ? '1' : '0'} ${moveToDraw.x} ${moveToDraw.y}`, {
        fill: 'transparent',
        stroke: canvasBrush.color,
        strokeWidth: canvasBrush.size,
        selectable: false,
        evented: false
    })

    drawingObject = path

    canvas.insertAt(path, getCanvasFrontIndex())
}

const getCenterPoint = e => {
    realiaObject.setCoords()

    const mt = realiaObject.oCoords.mt
    const mb = realiaObject.oCoords.mb
    const length = getRadius()

    const centerPoint = getPointInLine(mt, mb, length)

    return centerPoint
}

const getTopPoint = e => {
    realiaObject.setCoords()

    return realiaObject.oCoords.mt
}

const getRadius = () => {
    if (!realiaObject) {
        return
    }

    realiaObject.setCoords()

    return pointToPointDistance(realiaObject.oCoords.mb, realiaObject.oCoords.br)
}
