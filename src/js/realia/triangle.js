import { canvas, getCanvasFrontIndex, canvasBrush, markObjectOwner } from '../canvas'
import { fabric } from 'fabric'

import { getFootPointInfo } from '../../helper/math'

let realiaObject = null

let isInit = false
let isActive = false

let isDrawing = false
let isDrawingLeft = false
let isDrawingRight = false
let isDrawingBottom = false

let drawingObject = null
const moveFrom = { x: 0, y: 0 }

let isControlOpr = false

// const triangleImg = require('../../assets/images/triangle_A.svg')
const triangleImg = require('../../assets/images/triangle-board.png')

export const initTriangle = () => {
    isActive = true

    if (realiaObject) {
        canvas.add(realiaObject)
    } else {
        // fabric.loadSVGFromURL(triangleImg, (objects, options) => {
        //     const triangleObject = fabric.util.groupSVGElements(objects, options)

        //     triangleObject.left = 100
        //     triangleObject.top = 100

        //     triangleObject.hasBorders = false
        //     triangleObject.perPixelTargetFind = true

        //     triangleObject.isRealia = true
        //     triangleObject.excludeFromExport = true

        //     triangleObject.forEachControl(control => {
        //         control.mouseDownHandler = () => {
        //             isControlOpr = true
        //         }
        //         control.mouseUpHandler = () => {
        //             isControlOpr = false
        //         }
        //     })

        //     triangleObject.setControlVisible('mt', false)
        //     triangleObject.setControlVisible('mb', false)
        //     triangleObject.setControlVisible('ml', false)
        //     triangleObject.setControlVisible('mr', false)

        //     canvas.add(triangleObject)

        //     realiaObject = triangleObject
        // })

        fabric.Image.fromURL(triangleImg, triangleObject => {
            triangleObject.hasBorders = false
            triangleObject.perPixelTargetFind = true
            triangleObject.lockScalingFlip = true
            triangleObject.scaleX = 0.5
            triangleObject.scaleY = 0.5

            triangleObject.isRealia = true
            triangleObject.excludeFromExport = true

            triangleObject.forEachControl(control => {
                control.mouseDownHandler = () => {
                    isControlOpr = true
                }
                control.mouseUpHandler = () => {
                    isControlOpr = false
                }
            })

            triangleObject.setControlVisible('mt', false)
            triangleObject.setControlVisible('mb', false)
            triangleObject.setControlVisible('ml', false)
            triangleObject.setControlVisible('mr', false)

            canvas.add(triangleObject)
            canvas.viewportCenterObject(triangleObject)

            realiaObject = triangleObject
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

export const uninitTriangle = () => {
    isInit = false
}

export const inactiveTriangle = () => {
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

    const footPointLeftInfo = getTriangleFootPointLeftInfo(pointer)
    const footPointRightInfo = getTriangleFootPointRightInfo(pointer)
    const footPointBottomInfo = getTriangleFootPointBottomInfo(pointer)

    if (!footPointLeftInfo && !footPointRightInfo && !footPointBottomInfo) {
        return
    }

    if (footPointLeftInfo && footPointLeftInfo.distance < 100 && footPointLeftInfo.isSameDir) {
        moveFrom.x = footPointLeftInfo.footPoint.x
        moveFrom.y = footPointLeftInfo.footPoint.y
        isDrawing = true
        isDrawingLeft = true
    } else if (footPointRightInfo && footPointRightInfo.distance < 100 && footPointRightInfo.isSameDir) {
        moveFrom.x = footPointRightInfo.footPoint.x
        moveFrom.y = footPointRightInfo.footPoint.y
        isDrawing = true
        isDrawingRight = true
    } else if (footPointBottomInfo && footPointBottomInfo.distance < 100 && footPointBottomInfo.isSameDir) {
        moveFrom.x = footPointBottomInfo.footPoint.x
        moveFrom.y = footPointBottomInfo.footPoint.y
        isDrawing = true
        isDrawingBottom = true
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
    const pointer = canvas.getPointer(e, true)

    const footPointLeftInfo = getTriangleFootPointLeftInfo(pointer)
    const footPointRightInfo = getTriangleFootPointRightInfo(pointer)
    const footPointBottomInfo = getTriangleFootPointBottomInfo(pointer)

    if (!footPointLeftInfo && !footPointRightInfo && !footPointBottomInfo) {
        return
    }

    if (footPointLeftInfo && footPointLeftInfo.distance < 100 && footPointLeftInfo.isSameDir) {
        canvas.defaultCursor = 'crosshair'
    } else if (footPointRightInfo && footPointRightInfo.distance < 100 && footPointRightInfo.isSameDir) {
        canvas.defaultCursor = 'crosshair'
    } else if (footPointBottomInfo && footPointBottomInfo.distance < 100 && footPointBottomInfo.isSameDir) {
        canvas.defaultCursor = 'crosshair'
    } else {
        canvas.defaultCursor = 'auto'
    }

    if (!realiaObject || !isDrawing || isControlOpr) {
        return
    }

    let footPointInfo = null

    if (isDrawingLeft) {
        footPointInfo = getTriangleFootPointLeftInfo(pointer)
    } else if (isDrawingRight) {
        footPointInfo = getTriangleFootPointRightInfo(pointer)
    } else if (isDrawingBottom) {
        footPointInfo = getTriangleFootPointBottomInfo(pointer)
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

const getTriangleFootPointLeftInfo = (pointer) => {
    realiaObject.setCoords()

    const pointerLineL = realiaObject.oCoords.bl
    const pointerLineR = realiaObject.oCoords.mt

    const pointDirFrom = realiaObject.oCoords.tl
    const pointDirTo = realiaObject.oCoords.mb

    return getFootPointInfo(pointer, pointerLineL, pointerLineR, pointDirFrom, pointDirTo, canvasBrush.strokeSize / 2)
}

const getTriangleFootPointRightInfo = (pointer) => {
    realiaObject.setCoords()

    const pointerLineL = realiaObject.oCoords.mt
    const pointerLineR = realiaObject.oCoords.br

    const pointDirFrom = realiaObject.oCoords.tr
    const pointDirTo = realiaObject.oCoords.mb

    return getFootPointInfo(pointer, pointerLineL, pointerLineR, pointDirFrom, pointDirTo, canvasBrush.strokeSize / 2)
}

const getTriangleFootPointBottomInfo = (pointer) => {
    realiaObject.setCoords()

    const pointerLineL = realiaObject.oCoords.bl
    const pointerLineR = realiaObject.oCoords.br

    const pointDirFrom = realiaObject.oCoords.mb
    const pointDirTo = realiaObject.oCoords.mt

    return getFootPointInfo(pointer, pointerLineL, pointerLineR, pointDirFrom, pointDirTo, canvasBrush.strokeSize / 2)
}
