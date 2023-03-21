import { canvas, getCanvasFrontIndex, canvasBrush, markObjectOwner } from '../canvas'
import { fabric } from 'fabric'

import {
    getAngleToAxisX, getIntersectionAngle, getPointInLine,
    isClockwise, pointRotateByPoint, pointToPointDistance
} from 'src/helper/math'

let isInit = false
let isActive = false

let capObject = null
let leftArmObject = null
let rightArmObject = null

const leftArmOriginPos = { x: 0, y: 0, angle: 0 }
const rightArmOriginPos = { x: 0, y: 0, angle: 0 }
const capOriginPos = { x: 0, y: 0, angle: 0 }
let stabPos = { x: 0, y: 0 }
let jointPos = { x: 0, y: 0 }
let nilPos = { x: 0, y: 0 }

let isDragging = false
const dragFrom = { x: 0, y: 0 }

let isRotating = false
let isRotatingClockwise = false
let isRotatingBig = false
const rotateFrom = { x: 0, y: 0 }

let drawRadius = 0
let drawingObject = null
let drawingFinishedObject = null

let circleCenterObject = null

let isStretching = false
let lastStretchAngle = 10
const stretchFrom = { x: 0, y: 0 }

export let isFlip = false

const leftArmImg = require('../../assets/images/leftarm_A.png')
const rightArmImg = require('../../assets/images/rightarm_A.png')
const capImg = require('../../assets/images/cap_A.png')

export const initCompass = () => {
    isActive = true

    if (capObject) {
        canvas.add(leftArmObject)
        canvas.add(rightArmObject)
        canvas.add(capObject)
    } else {
        const p1 = new Promise((resolve, reject) => {
            fabric.Image.fromURL(leftArmImg, img => {
                leftArmObject = img
                leftArmObject.hasControls = false

                leftArmObject.perPixelTargetFind = true

                leftArmObject.on('mousedown', option => {
                    dragBegin(option.e)
                })
                leftArmObject.on('moving', option => {
                    dragMoving(option.e)
                })
                leftArmObject.on('mouseup', option => {
                    dragEnd(option.e)
                })

                leftArmObject.flipX = isFlip

                resolve(img)
            })
        })

        const p2 = new Promise((resolve, reject) => {
            fabric.Image.fromURL(rightArmImg, img => {
                rightArmObject = img

                rightArmObject.perPixelTargetFind = true

                rightArmObject.lockMovementX = true
                rightArmObject.lockMovementY = true
                rightArmObject.hasControls = false
                rightArmObject.hoverCursor = 'e-resize'

                rightArmObject.on('mousedown', option => {
                    if (!isActive) {
                        return
                    }
                    stretchBegin(option.e)
                })

                rightArmObject.flipX = isFlip

                resolve(img)
            })
        })

        const p3 = new Promise((resolve, reject) => {
            fabric.Image.fromURL(capImg, img => {
                capObject = img

                capObject.perPixelTargetFind = true

                capObject.lockMovementX = true
                capObject.lockMovementY = true
                capObject.hasControls = false
                capObject.hoverCursor = 'pointer'

                capObject.on('mousedown', option => {
                    if (!isActive) {
                        return
                    }
                    rotateBegin(option.e)
                })

                capObject.flipX = isFlip

                resolve(img)
            })
        })

        Promise.all([p1, p2, p3]).then(objects => {
            objects.forEach(object => {
                object.hasBorders = false
                object.isRealia = true
                object.excludeFromExport = true

                canvas.add(object)
            })
            makeCompass()
        })

        if (!isInit) {
            canvas.on('mouse:move', option => {
                if (!isActive) {
                    return
                }
                rotateMoving(option.e)
                stretchMoving(option.e)
            })
            canvas.on('mouse:up', option => {
                if (!isActive) {
                    return
                }
                rotateEnd(option.e)
                stretchEnd(option.e)
            })

            isInit = true
        }
    }
}

export const uninitCompass = () => {
    isInit = false
}

export const inactiveCompass = () => {
    isActive = false

    if (capObject) {
        canvas.remove(capObject)
    }
    if (leftArmObject) {
        canvas.remove(leftArmObject)
    }
    if (rightArmObject) {
        canvas.remove(rightArmObject)
    }
}

const makeCompass = () => {
    canvas.viewportCenterObject(leftArmObject)

    autoJoin()
}

const autoJoin = () => {
    const jointPoint = canvas.restorePointerVpt(getJointPos())

    const leftArmJoint = canvas.restorePointerVpt(getLeftArmJointPos())
    const deltaLeftArm = { x: jointPoint.x - leftArmJoint.x, y: jointPoint.y - leftArmJoint.y }
    leftArmObject.left += deltaLeftArm.x
    leftArmObject.top += deltaLeftArm.y

    const rightArmJoint = canvas.restorePointerVpt(getRightArmJointPos())
    const deltaRightArm = { x: jointPoint.x - rightArmJoint.x, y: jointPoint.y - rightArmJoint.y }
    rightArmObject.left += deltaRightArm.x
    rightArmObject.top += deltaRightArm.y

    const capJoint = canvas.restorePointerVpt(getCapJointPos())
    const deltaCap = { x: jointPoint.x - capJoint.x, y: jointPoint.y - capJoint.y }
    capObject.left += deltaCap.x
    capObject.top += deltaCap.y

    setAllCoords()
}

const dragBegin = (e) => {
    isDragging = true

    const pointer = canvas.getPointer(e, true)

    dragFrom.x = pointer.x
    dragFrom.y = pointer.y

    setOriginPos()
}

const dragMoving = e => {
    if (!isDragging) {
        return
    }

    autoJoin()
}

const dragEnd = e => {
    setAllCoords()

    isDragging = false
}

const rotateBegin = e => {
    isRotating = true

    const pointer = canvas.getPointer(e, true)

    rotateFrom.x = pointer.x
    rotateFrom.y = pointer.y

    setOriginPos()

    drawBegin()
}

const drawBegin = e => {
    const radius = canvasBrush.strokeSize
    const centerPoint = canvas.restorePointerVpt(stabPos)
    circleCenterObject = new fabric.Circle({
        left: centerPoint.x,
        top: centerPoint.y,
        originX: 'center',
        originY: 'center',
        fill: canvasBrush.strokeColorCalc,
        evented: false,
        selectable: false,
        radius
    })

    canvas.insertAt(circleCenterObject, getCanvasFrontIndex())

    markObjectOwner(circleCenterObject)

    drawRadius = pointToPointDistance(centerPoint, canvas.restorePointerVpt(nilPos))
}

const rotateMoving = e => {
    if (!isRotating) {
        return
    }

    const pointer = canvas.getPointer(e, true)

    const intersectionAngle = getIntersectionAngle(stabPos, rotateFrom, pointer)

    const isRotatingClockwiseCurrent = isClockwise(stabPos, rotateFrom, pointer)
    if (isRotatingClockwiseCurrent !== isRotatingClockwise) {
        if (intersectionAngle.deg > 120) {
            isRotatingBig = !isRotatingBig
        } else {
            if (isRotatingBig) {
                drwaFininshedCircle()
            }
        }
    }

    isRotatingClockwise = isRotatingClockwiseCurrent

    if (!isRotatingClockwiseCurrent) {
        intersectionAngle.rad = Math.PI * 2 - intersectionAngle.rad
        intersectionAngle.deg = 360 - intersectionAngle.deg
    }

    rotateObjectsByAngle(canvas.restorePointerVpt(stabPos), intersectionAngle, capOriginPos, leftArmOriginPos, rightArmOriginPos)

    if (!drawingFinishedObject) {
        drawMoving(intersectionAngle, isRotatingClockwise, isRotatingBig)
    }

    canvas.renderAll()
}

const drawMoving = (intersectionAngle, isRotatingClockwise, isRotatingBig) => {
    if (drawingObject) {
        canvas.remove(drawingObject)
        drawingObject = null
    }

    const deltaAngleToAxisX = getAngleToAxisX(stabPos, nilPos)
    const isDeltaAngleToAxisXClockWise = isClockwise(stabPos, nilPos, { x: stabPos.x + 10, y: stabPos.y })

    const stabPosDraw = canvas.restorePointerVpt(stabPos)

    const circle = new fabric.Circle({
        left: stabPosDraw.x,
        top: stabPosDraw.y,
        originX: 'center',
        originY: 'center',
        stroke: canvasBrush.strokeColorCalc,
        strokeWidth: canvasBrush.strokeSize,
        strokeDashArray: canvasBrush.strokeDash,
        fill: 'transparent',
        evented: false,
        selectable: false,
        radius: drawRadius,
        endAngle: intersectionAngle.deg,
        strokeUniform: true
    })

    if ((isRotatingClockwise && !isRotatingBig) || (!isRotatingClockwise && isRotatingBig)) {
        circle.rotate(deltaAngleToAxisX.deg * (isDeltaAngleToAxisXClockWise ? -1 : 1))
    } else {
        circle.endAngle = 360 - intersectionAngle.deg
        circle.rotate(deltaAngleToAxisX.deg * (isDeltaAngleToAxisXClockWise ? -1 : 1) - circle.endAngle)
    }

    drawingObject = circle

    canvas.insertAt(circle, getCanvasFrontIndex())

    markObjectOwner(circle)
}

const drwaFininshedCircle = () => {
    if (drawingFinishedObject) {
        canvas.remove(drawingFinishedObject)
        drawingFinishedObject = null
    }
    if (drawingObject) {
        canvas.remove(drawingObject)
        drawingObject = null
    }

    const stabPosDraw = canvas.restorePointerVpt(stabPos)

    const circle = new fabric.Circle({
        left: stabPosDraw.x,
        top: stabPosDraw.y,
        originX: 'center',
        originY: 'center',
        stroke: canvasBrush.strokeColorCalc,
        strokeWidth: canvasBrush.strokeSize,
        strokeDashArray: canvasBrush.strokeDash,
        fill: 'transparent',
        evented: false,
        selectable: false,
        radius: drawRadius,
        strokeUniform: true
    })

    canvas.insertAt(circle, getCanvasFrontIndex())

    markObjectOwner(circle)

    drawingFinishedObject = circle
}

const rotateEnd = e => {
    if (!isRotating) {
        return
    }

    circleCenterObject = null // to do togroup
    drawingObject = null
    drawingFinishedObject = null

    setAllCoords()

    isRotatingClockwise = false
    isRotatingBig = false

    isRotating = false
}

const stretchBegin = e => {
    isStretching = true

    const pointer = canvas.getPointer(e, true)

    stretchFrom.x = pointer.x
    stretchFrom.y = pointer.y

    setOriginPos()
}

const stretchMoving = e => {
    if (!isStretching) {
        return
    }
    const pointer = canvas.getPointer(e, true)

    // 以joint点转动引起的变化
    const intersectionJointAngle = getIntersectionAngle(jointPos, stretchFrom, pointer)
    const isStretchClockwise = isClockwise(jointPos, stretchFrom, pointer)

    const currentStretchAngle = leftArmObject.angle - rightArmObject.angle
    if (Math.sign(currentStretchAngle) !== Math.sign(lastStretchAngle) && Math.sign(currentStretchAngle) !== 0 && Math.sign(lastStretchAngle) !== 0) {
        setCompassFlip(!isFlip)
    }
    lastStretchAngle = currentStretchAngle
    if (lastStretchAngle === 0) { // 防止边界的时候判断不准
        lastStretchAngle = 10
    }

    // 以stab点转动引起的变化
    const intersectionStabAngle = getIntersectionAngle(stabPos, stretchFrom, pointer)
    const isStabAngleClockwise = isClockwise(stabPos, stretchFrom, pointer)

    const pointStretchdLeft = pointRotateByPoint(canvas.restorePointerVpt(stabPos), leftArmOriginPos,
        (-intersectionJointAngle.rad / 2 * (isStretchClockwise ? 1 : -1)) + (intersectionStabAngle.rad * (isStabAngleClockwise ? 1 : -1)))
    leftArmObject.left = pointStretchdLeft.x
    leftArmObject.top = pointStretchdLeft.y
    leftArmObject.angle = leftArmOriginPos.angle - (intersectionJointAngle.deg / 2 * (isStretchClockwise ? 1 : -1)) + (intersectionStabAngle.deg * (isStabAngleClockwise ? 1 : -1))

    rightArmObject.angle = rightArmOriginPos.angle + (intersectionJointAngle.deg / 2 * (isStretchClockwise ? 1 : -1)) + (intersectionStabAngle.deg * (isStabAngleClockwise ? 1 : -1))

    capObject.angle = capOriginPos.angle + (intersectionStabAngle.deg * (isStabAngleClockwise ? 1 : -1))

    autoJoin()

    canvas.renderAll()
}

const stretchEnd = e => {
    if (!isStretching) {
        return
    }

    setAllCoords()

    isStretching = false
}

const setOriginPos = () => {
    leftArmOriginPos.x = leftArmObject.left
    leftArmOriginPos.y = leftArmObject.top
    leftArmOriginPos.angle = leftArmObject.angle

    rightArmOriginPos.x = rightArmObject.left
    rightArmOriginPos.y = rightArmObject.top
    rightArmOriginPos.angle = rightArmObject.angle

    capOriginPos.x = capObject.left
    capOriginPos.y = capObject.top
    capOriginPos.angle = capObject.angle

    stabPos = getStabPos()

    jointPos = getJointPos()

    nilPos = getNibPos()
}

const rotateObjectsByAngle = (anchorPos, deltaAngle, capPos, leftArmPos, rightArmPos) => {
    const pointLeftArm = pointRotateByPoint(anchorPos, leftArmPos, deltaAngle.rad)
    leftArmObject.left = pointLeftArm.x
    leftArmObject.top = pointLeftArm.y
    leftArmObject.angle = leftArmPos.angle + deltaAngle.deg

    rightArmObject.angle = rightArmPos.angle + deltaAngle.deg

    capObject.angle = capPos.angle + deltaAngle.deg

    autoJoin()
}

const setAllCoords = () => {
    leftArmObject.setCoords()
    rightArmObject.setCoords()
    capObject.setCoords()
}

const getStabPos = () => {
    leftArmObject.setCoords()

    if (isFlip) {
        return getPointInLine(leftArmObject.oCoords.bl, leftArmObject.oCoords.br, 9 * canvas.getZoom())
    } else {
        return getPointInLine(leftArmObject.oCoords.br, leftArmObject.oCoords.bl, 9 * canvas.getZoom())
    }
}

const getJointPos = () => {
    leftArmObject.setCoords()

    if (isFlip) {
        return getPointInLine(leftArmObject.oCoords.tl, leftArmObject.oCoords.tr, 5 * canvas.getZoom())
    } else {
        return getPointInLine(leftArmObject.oCoords.tr, leftArmObject.oCoords.tl, 5 * canvas.getZoom())
    }
}

const getLeftArmJointPos = () => {
    leftArmObject.setCoords()

    if (isFlip) {
        return getPointInLine(leftArmObject.oCoords.tl, leftArmObject.oCoords.tr, 5 * canvas.getZoom())
    } else {
        return getPointInLine(leftArmObject.oCoords.tr, leftArmObject.oCoords.tl, 5 * canvas.getZoom())
    }
}

const getRightArmJointPos = () => {
    rightArmObject.setCoords()

    if (isFlip) {
        return getPointInLine(rightArmObject.oCoords.tr, rightArmObject.oCoords.tl, 1 * canvas.getZoom())
    } else {
        return getPointInLine(rightArmObject.oCoords.tl, rightArmObject.oCoords.tr, 1 * canvas.getZoom())
    }
}

const getCapJointPos = () => {
    capObject.setCoords()

    return getPointInLine(capObject.oCoords.mb, capObject.oCoords.mt, 30 * canvas.getZoom())
}

const getNibPos = () => {
    rightArmObject.setCoords()

    if (isFlip) {
        return getPointInLine(rightArmObject.oCoords.br, rightArmObject.oCoords.bl, 10 * canvas.getZoom())
    } else {
        return getPointInLine(rightArmObject.oCoords.bl, rightArmObject.oCoords.br, 10 * canvas.getZoom())
    }
}

export const setCompassFlip = (flip) => {
    if (isFlip === flip) {
        return
    }
    isFlip = flip

    leftArmObject.flipX = flip
    rightArmObject.flipX = flip
    capObject.flipX = flip

    let tempAngle = 0
    tempAngle = leftArmObject.angle
    leftArmObject.angle = rightArmObject.angle
    rightArmObject.angle = tempAngle

    setAllCoords()

    autoJoin()

    canvas.renderAll()
}
