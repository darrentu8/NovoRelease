import { canvas, getCanvasFrontIndex, canvasBrush, markObjectOwner } from '../canvas'
import { fabric } from 'fabric'

import { getIntersectionAngle, getPointInLine, isClockwise, pointRotateByPoint, pointToPointDistance } from '../../helper/math'
import { getTextWidth } from 'src/helper/util'
import { MathUtils } from 'three'

let isInit = false
let isActive = false

let realiaObject = null
let isDrawing = false
let drawingObject = null
const moveFrom = { x: 0, y: 0 }

let isDragingLeft = false
let leftHandleAngle = 90
let rightHandleAngle = 180
let isDragingRight = false
const dragingFrom = { x: 0, y: 0 }

let centerObject = null
let leftLineObject = null
let leftHandleObject = null
let rightLineObject = null
let rightHandleObject = null
let markTextObject = null

let isControlOpr = false

// const protractorImg = require('../../assets/images/protractor.svg')
const protractorImg = require('../../assets/images/protractor.png')

export const initProtractor = () => {
    isActive = true

    if (realiaObject) {
        canvas.add(realiaObject)

        centerObject = null
        leftHandleObject = null
        rightHandleObject = null
        generateMarker(leftHandleAngle, rightHandleAngle)
    } else {
        // fabric.loadSVGFromURL(protractorImg, (objects, options) => {
        //     const protractorObject = fabric.util.groupSVGElements(objects, options)

        //     protractorObject.left = 100
        //     protractorObject.top = 100

        //     protractorObject.hasBorders = false
        //     protractorObject.perPixelTargetFind = true

        //     protractorObject.isRealia = true
        //     protractorObject.excludeFromExport = true

        //     protractorObject.on('moving', option => {
        //         generateMarker(leftHandleAngle, rightHandleAngle)
        //     })
        //     protractorObject.on('rotating', option => {
        //         generateMarker(leftHandleAngle, rightHandleAngle)
        //     })
        //     protractorObject.on('scaling', option => {
        //         generateMarker(leftHandleAngle, rightHandleAngle)
        //     })
        //     protractorObject.on('modified', option => {
        //         leftHandleObject.setCoords()
        //         rightHandleObject.setCoords()
        //     })

        //     protractorObject.forEachControl(control => {
        //         control.mouseDownHandler = () => {
        //             isControlOpr = true
        //         }
        //         control.mouseUpHandler = () => {
        //             isControlOpr = false
        //         }
        //     })

        //     protractorObject.setControlVisible('mt', false)
        //     protractorObject.setControlVisible('mb', false)
        //     protractorObject.setControlVisible('ml', false)
        //     protractorObject.setControlVisible('mr', false)

        //     canvas.add(protractorObject)

        //     realiaObject = protractorObject

        //     generateMarker(leftHandleAngle, rightHandleAngle)
        // })

        fabric.Image.fromURL(protractorImg, protractorObject => {
            protractorObject.hasBorders = false
            protractorObject.perPixelTargetFind = true
            protractorObject.lockScalingFlip = true
            protractorObject.scaleX = 0.5
            protractorObject.scaleY = 0.5

            protractorObject.isRealia = true
            protractorObject.excludeFromExport = true

            protractorObject.on('moving', option => {
                generateMarker(leftHandleAngle, rightHandleAngle)
            })
            protractorObject.on('rotating', option => {
                generateMarker(leftHandleAngle, rightHandleAngle)
            })
            protractorObject.on('scaling', option => {
                generateMarker(leftHandleAngle, rightHandleAngle)
            })
            protractorObject.on('modified', option => {
                leftHandleObject.setCoords()
                rightHandleObject.setCoords()
            })

            protractorObject.forEachControl(control => {
                control.mouseDownHandler = () => {
                    isControlOpr = true
                }
                control.mouseUpHandler = () => {
                    isControlOpr = false
                }
            })

            protractorObject.setControlVisible('mt', false)
            protractorObject.setControlVisible('mb', false)
            protractorObject.setControlVisible('ml', false)
            protractorObject.setControlVisible('mr', false)

            canvas.add(protractorObject)
            canvas.viewportCenterObject(protractorObject)

            realiaObject = protractorObject

            generateMarker(leftHandleAngle, rightHandleAngle)
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

            dragLeftHandleEnd(options.e)
            dragRightHandleEnd(options.e)
        })
        canvas.on('mouse:move', options => {
            if (!isActive) {
                return
            }
            mouseMove(options.e)

            dragLeftHandleMove(options.e)
            dragRightHandleMove(options.e)
        })

        isInit = true
    }
}

export const uninitProtractor = () => {
    isInit = false
}

export const inactiveProtractor = () => {
    isActive = false

    if (realiaObject) {
        canvas.remove(realiaObject)
        canvas.remove(centerObject)
        canvas.remove(leftLineObject)
        canvas.remove(rightLineObject)
        canvas.remove(leftHandleObject)
        canvas.remove(rightHandleObject)
        canvas.remove(markTextObject)
    }
}

const generateMarker = (fromAngle, toAngle) => {
    const centerPoint = canvas.restorePointerVpt(getCenterPoint())

    const blPoint = canvas.restorePointerVpt(getblPoint())

    const leftPoint = pointRotateByPoint(centerPoint, blPoint, MathUtils.degToRad(fromAngle))
    const rightPoint = pointRotateByPoint(centerPoint, blPoint, MathUtils.degToRad(toAngle))

    if (!centerObject) {
        const radius = 6
        centerObject = new fabric.Circle({
            left: centerPoint.x,
            top: centerPoint.y,
            originX: 'center',
            originY: 'center',
            evented: false,
            selectable: false,
            fill: '#14A028',
            radius,
            isRealia: true,
            excludeFromExport: true
        })
        canvas.add(centerObject)
    } else {
        centerObject.left = centerPoint.x
        centerObject.top = centerPoint.y
    }

    if (leftLineObject) {
        canvas.remove(leftLineObject)
        leftLineObject = null
    }
    leftLineObject = new fabric.Path(`M ${centerPoint.x} ${centerPoint.y} L ${leftPoint.x} ${leftPoint.y}`, {
        stroke: '#14A028',
        strokeWidth: 3,
        selectable: false,
        evented: false,
        isRealia: true,
        excludeFromExport: true
    })
    canvas.add(leftLineObject)

    if (rightLineObject) {
        canvas.remove(rightLineObject)
        rightLineObject = null
    }
    rightLineObject = new fabric.Path(`M ${centerPoint.x} ${centerPoint.y} L ${rightPoint.x} ${rightPoint.y}`, {
        stroke: '#14A028',
        strokeWidth: 3,
        selectable: false,
        evented: false,
        isRealia: true,
        excludeFromExport: true
    })
    canvas.add(rightLineObject)

    const radius = 10
    const leftPointOffset = getPointInLine(leftPoint, centerPoint, -radius)
    if (leftHandleObject) {
        leftHandleObject.left = leftPointOffset.x
        leftHandleObject.top = leftPointOffset.y
    } else {
        leftHandleObject = new fabric.Circle({
            left: leftPointOffset.x,
            top: leftPointOffset.y,
            originX: 'center',
            originY: 'center',
            fill: '#14A028',
            stroke: 'transparent',
            strokeWidth: 2,
            hasBorders: false,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: 'pointer',
            moveCursor: 'pointer',
            radius,
            isRealia: true,
            excludeFromExport: true
        })

        leftHandleObject.on('mousedown', option => {
            if (!isActive) {
                return
            }
            dragLeftHandleBegin(option.e)
        })

        canvas.add(leftHandleObject)
    }

    const rightPointOffset = getPointInLine(rightPoint, centerPoint, -radius)
    if (rightHandleObject) {
        rightHandleObject.left = rightPointOffset.x
        rightHandleObject.top = rightPointOffset.y
    } else {
        rightHandleObject = new fabric.Circle({
            left: rightPointOffset.x,
            top: rightPointOffset.y,
            originX: 'center',
            originY: 'center',
            fill: '#14A028',
            stroke: 'transparent',
            strokeWidth: 2,
            hasBorders: false,
            hasControls: false,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: 'pointer',
            moveCursor: 'pointer',
            radius,
            isRealia: true,
            excludeFromExport: true
        })

        rightHandleObject.on('mousedown', option => {
            if (!isActive) {
                return
            }
            dragRightHandleBegin(option.e)
        })

        canvas.add(rightHandleObject)
    }

    if (markTextObject) {
        canvas.remove(markTextObject)
        markTextObject = null
    }
    const angle = (toAngle - fromAngle).toFixed(1)
    const textAngle = `${angle}°`
    const textWidth = getTextWidth(textAngle, '20px arial')
    const mb = canvas.restorePointerVpt(realiaObject.oCoords.mb)
    markTextObject = new fabric.Text(textAngle, {
        left: mb.x - textWidth / 2,
        top: mb.y,
        fill: '#5F5F5F',
        fontSize: 20,
        selectable: false,
        evented: false,
        isRealia: true,
        excludeFromExport: true
    })
    canvas.add(markTextObject)
}

const mouseDown = e => {
    if (!realiaObject) {
        return
    }

    const pointer = canvas.getPointer(e, true)
    const centerPoint = getCenterPoint(pointer)

    const distance = pointToPointDistance(pointer, centerPoint)
    const radius = getRadius() + canvasBrush.strokeSize / 2

    const delta = distance - radius

    const intersectionAngle = getIntersectionAngle(centerPoint, getTopPoint(), pointer)

    if (delta > 0 && delta < 30 && intersectionAngle.deg <= 90) {
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
    const pointer = canvas.getPointer(e, true)
    const centerPoint = getCenterPoint(pointer)

    const distance = pointToPointDistance(pointer, centerPoint)
    const radius = getRadius() + canvasBrush.strokeSize / 2

    const delta = distance - radius

    const intersectionAngle = getIntersectionAngle(centerPoint, getTopPoint(), pointer)

    if (delta > 0 && delta < 50 && intersectionAngle.deg <= 90) {
        canvas.defaultCursor = 'crosshair'
    } else {
        canvas.defaultCursor = 'auto'
    }

    if (!realiaObject || !isDrawing) {
        return
    }

    if (isDragingLeft || isDragingRight || isControlOpr) {
        return
    }

    if (intersectionAngle.deg > 90) {
        return
    }

    if (drawingObject) {
        canvas.remove(drawingObject)
        drawingObject = null
    }

    const endPoint = getPointInLine(centerPoint, pointer, radius)

    const isDrawClockwise = isClockwise(centerPoint, moveFrom, endPoint)

    const moveFromDraw = canvas.restorePointerVpt(moveFrom)
    const moveToDraw = canvas.restorePointerVpt(endPoint)
    const radiusDraw = radius / canvas.getZoom()

    const path = new fabric.Path(`M ${moveFromDraw.x} ${moveFromDraw.y} A ${radiusDraw} ${radiusDraw} 0 0 ${isDrawClockwise ? '1' : '0'} ${moveToDraw.x} ${moveToDraw.y}`, {
        fill: 'transparent',
        stroke: canvasBrush.strokeColorCalc,
        strokeWidth: canvasBrush.strokeSize,
        strokeDashArray: canvasBrush.strokeDash,
        selectable: false,
        evented: false,
        strokeUniform: true
    })

    drawingObject = path

    canvas.insertAt(path, getCanvasFrontIndex())

    markObjectOwner(path)
}

const dragLeftHandleBegin = e => {
    isDragingLeft = true

    const pointer = canvas.getPointer(e, true)

    dragingFrom.x = pointer.x
    dragingFrom.y = pointer.y
}

const dragLeftHandleMove = e => {
    if (!isDragingLeft) {
        return
    }
    const pointer = canvas.getPointer(e, true)

    const centerPoint = getCenterPoint()
    const blPoint = getblPoint()

    const intersectionAngle = getIntersectionAngle(centerPoint, blPoint, pointer)
    const isClockwiseAngle = isClockwise(centerPoint, blPoint, pointer)

    if (!isClockwiseAngle) {
        return
    } else {
        leftHandleAngle = intersectionAngle.deg

        if (leftHandleAngle > rightHandleAngle) {
            leftHandleAngle = rightHandleAngle
        }
    }

    generateMarker(leftHandleAngle, rightHandleAngle)
}

const dragLeftHandleEnd = e => {
    isDragingLeft = false
}

const dragRightHandleBegin = e => {
    isDragingRight = true

    const pointer = canvas.getPointer(e, true)

    dragingFrom.x = pointer.x
    dragingFrom.y = pointer.y
}

const dragRightHandleMove = e => {
    if (!isDragingRight) {
        return
    }
    const pointer = canvas.getPointer(e, true)

    const centerPoint = getCenterPoint()
    const blPoint = getblPoint()

    const intersectionAngle = getIntersectionAngle(centerPoint, blPoint, pointer)
    const isClockwiseAngle = isClockwise(centerPoint, blPoint, pointer)

    if (!isClockwiseAngle) {
        return
    } else {
        rightHandleAngle = intersectionAngle.deg

        if (rightHandleAngle < leftHandleAngle) {
            rightHandleAngle = leftHandleAngle
        }
    }

    generateMarker(leftHandleAngle, rightHandleAngle)
}

const dragRightHandleEnd = e => {
    isDragingRight = false
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

const getblPoint = e => {
    realiaObject.setCoords()

    const tl = realiaObject.oCoords.tl
    const bl = realiaObject.oCoords.bl
    const radius = getRadius()

    return getPointInLine(tl, bl, radius)
}

const getRadius = () => {
    if (!realiaObject) {
        return
    }

    realiaObject.setCoords()

    return pointToPointDistance(realiaObject.oCoords.mb, realiaObject.oCoords.br)
}
