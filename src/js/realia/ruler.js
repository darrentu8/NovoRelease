import { canvas, getCanvasFrontIndex, canvasBrush, markObjectOwner } from '../canvas'
import { fabric } from 'fabric'

import { getFootPointInfo } from '../../helper/math'

let realiaObject = null

let isInit = false
let isActive = false

let isDrawing = false
let isDrawingTop = false
let isDrawingBottom = false
let drawingObject = null
const moveFrom = { x: 0, y: 0 }

let isControlOpr = false

// const rulerImg = require('../../assets/images/ruler_A.svg')
const rulerImg = require('../../assets/images/ruler.png')

export const initRuler = () => {
    isActive = true

    if (realiaObject) {
        canvas.add(realiaObject)
    } else {
        // fabric.loadSVGFromURL(rulerImg, (objects, options) => {
        //     const rulerObject = fabric.util.groupSVGElements(objects, options)

        //     rulerObject.left = 70
        //     rulerObject.top = 70

        //     rulerObject.hasBorders = false
        //     rulerObject.perPixelTargetFind = true

        //     rulerObject.isRealia = true
        //     rulerObject.excludeFromExport = true

        //     rulerObject.forEachControl(control => {
        //         control.mouseDownHandler = () => {
        //             isControlOpr = true
        //         }
        //         control.mouseUpHandler = () => {
        //             isControlOpr = false
        //         }
        //     })

        //     rulerObject.setControlVisible('mt', false)
        //     rulerObject.setControlVisible('mb', false)
        //     rulerObject.setControlVisible('ml', false)
        //     rulerObject.setControlVisible('mr', false)

        //     canvas.add(rulerObject)

        //     realiaObject = rulerObject
        // })

        fabric.Image.fromURL(rulerImg, rulerObject => {
            rulerObject.hasBorders = false
            rulerObject.perPixelTargetFind = true
            rulerObject.lockScalingFlip = true
            rulerObject.scaleX = 0.5
            rulerObject.scaleY = 0.5

            rulerObject.isRealia = true
            rulerObject.excludeFromExport = true

            rulerObject.forEachControl(control => {
                control.mouseDownHandler = () => {
                    isControlOpr = true
                }
                control.mouseUpHandler = () => {
                    isControlOpr = false
                }
            })

            rulerObject.setControlVisible('mt', false)
            rulerObject.setControlVisible('mb', false)
            rulerObject.setControlVisible('ml', false)
            rulerObject.setControlVisible('mr', false)

            canvas.add(rulerObject)
            canvas.viewportCenterObject(rulerObject)

            realiaObject = rulerObject
        })
    }

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

export const uninitRuler = () => {
    isInit = false
}

export const inactiveRuler = () => {
    isActive = false

    if (realiaObject) {
        canvas.remove(realiaObject)
    }
}

const mouseDown = e => {
    if (!realiaObject) {
        return
    }

    const pointer = canvas.getPointer(e, true)

    const footPointInfoTop = getRulerTopFootPointInfo(pointer)
    const footPointInfoBottom = getRulerBottomFootPointInfo(pointer)

    if (footPointInfoTop && footPointInfoTop.distance < 70 && footPointInfoTop.isSameDir) {
        [moveFrom.x, moveFrom.y] = [footPointInfoTop.footPoint.x, footPointInfoTop.footPoint.y]
        isDrawing = true
        isDrawingTop = true
    } else if (footPointInfoBottom && footPointInfoBottom.distance < 70 && footPointInfoBottom.isSameDir) {
        [moveFrom.x, moveFrom.y] = [footPointInfoBottom.footPoint.x, footPointInfoBottom.footPoint.y]
        isDrawing = true
        isDrawingBottom = true
    }
}

const mouseUp = e => {
    if (!realiaObject) {
        return
    }
    isDrawing = false

    isDrawingTop = false
    isDrawingBottom = false

    if (drawingObject) {
        drawingObject = null
    }
}

const mouseMove = e => {
    const pointer = canvas.getPointer(e, true)

    const footPointInfoTop = getRulerTopFootPointInfo(pointer)
    const footPointInfoBottom = getRulerBottomFootPointInfo(pointer)

    if (footPointInfoTop && footPointInfoTop.distance < 70 && footPointInfoTop.isSameDir) {
        canvas.defaultCursor = 'crosshair'
    } else if (footPointInfoBottom && footPointInfoBottom.distance < 70 && footPointInfoBottom.isSameDir) {
        canvas.defaultCursor = 'crosshair'
    } else {
        canvas.defaultCursor = 'auto'
    }

    if (!realiaObject || !isDrawing || isControlOpr) {
        return
    }

    let footPointInfo = null
    if (isDrawingTop) {
        footPointInfo = getRulerTopFootPointInfo(pointer)
    } else if (isDrawingBottom) {
        footPointInfo = getRulerBottomFootPointInfo(pointer)
    }

    if (!footPointInfo) {
        return
    }

    if (drawingObject) {
        canvas.remove(drawingObject)
        drawingObject = null
    }

    const moveFromDraw = canvas.restorePointerVpt(moveFrom)
    const moveToDraw = canvas.restorePointerVpt(footPointInfo.footPoint)

    const line = new fabric.Path(`M ${moveFromDraw.x} ${moveFromDraw.y} L ${moveToDraw.x} ${moveToDraw.y}`, {
        stroke: canvasBrush.strokeColorCalc,
        strokeWidth: canvasBrush.strokeSize,
        strokeDashArray: canvasBrush.strokeDash,
        selectable: false,
        evented: false,
        strokeUniform: true
    })

    drawingObject = line

    canvas.insertAt(line, getCanvasFrontIndex())

    markObjectOwner(line)
}

const getRulerTopFootPointInfo = (pointer) => {
    realiaObject.setCoords()

    const pointerLineL = realiaObject.oCoords.tl
    const pointerLineR = realiaObject.oCoords.tr

    const pointDirFrom = realiaObject.oCoords.mt
    const pointDirTo = realiaObject.oCoords.mb

    return getFootPointInfo(pointer, pointerLineL, pointerLineR, pointDirFrom, pointDirTo, canvasBrush.strokeSize / 2)
}

const getRulerBottomFootPointInfo = (pointer) => {
    realiaObject.setCoords()

    const pointerLineL = realiaObject.oCoords.bl
    const pointerLineR = realiaObject.oCoords.br

    const pointDirFrom = realiaObject.oCoords.mb
    const pointDirTo = realiaObject.oCoords.mt

    return getFootPointInfo(pointer, pointerLineL, pointerLineR, pointDirFrom, pointDirTo, canvasBrush.strokeSize / 2)
}
