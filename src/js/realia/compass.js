import { canvas, getCanvasFrontIndex, canvasBrush } from '../canvas'
import { fabric } from 'fabric'

import {
    getAngleToAxisX, getIntersectionAngle, getPointInLine,
    isClockwise, pointRotateByPoint, pointToPointDistance
} from 'src/helper/math'

import { isActice } from './realia'

let isInit = false

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

let isStretching = false
const stretchFrom = { x: 0, y: 0 }

export const initCompass = () => {
    if (capObject) {
        canvas.add(leftArmObject)
        canvas.add(rightArmObject)
        canvas.add(capObject)
    } else {
        const p1 = new Promise((resolve, reject) => {
            const leftArmImg = require('../../assets/images/leftarm.png')
            fabric.Image.fromURL(leftArmImg, img => {
                leftArmObject = img

                leftArmObject.on('mousedown', option => {
                    dragBegin(option.e)
                })
                leftArmObject.on('moving', option => {
                    dragMoving(option.e)
                })
                leftArmObject.on('mouseup', option => {
                    dragEnd(option.e)
                })

                resolve(img)
            })
        })

        const p2 = new Promise((resolve, reject) => {
            const rightArmImg = require('../../assets/images/rightarm.png')
            fabric.Image.fromURL(rightArmImg, img => {
                rightArmObject = img

                rightArmObject.lockMovementX = true
                rightArmObject.lockMovementY = true

                rightArmObject.on('mousedown', option => {
                    if (!isActice) {
                        return
                    }
                    stretchBegin(option.e)
                })

                resolve(img)
            })
        })

        const p3 = new Promise((resolve, reject) => {
            const capImg = require('../../assets/images/cap.png')
            fabric.Image.fromURL(capImg, img => {
                capObject = img

                capObject.lockMovementX = true
                capObject.lockMovementY = true

                capObject.on('mousedown', option => {
                    if (!isActice) {
                        return
                    }
                    rotateBegin(option.e)
                })

                resolve(img)
            })

            // const capImg = require('../../assets/quasar-logo-vertical.svg')
            // fabric.loadSVGFromURL(capImg, (objects, options) => {
            //     const img = fabric.util.groupSVGElements(objects, options)
            //     capObject = img

            //     capObject.lockMovementX = true
            //     capObject.lockMovementY = true

            //     capObject.on('mousedown', option => {
            //         rotateBegin(option.e)
            //     })

            //     resolve(img)
            // })
        })

        Promise.all([p1, p2, p3]).then(objects => {
            objects.forEach(object => {
                object.hasBorders = false
                object.hasControls = false

                object.isCompass = true
                object.isRealia = true

                canvas.add(object)
            })
            makeCompass()
        })

        if (!isInit) {
            canvas.on('mouse:move', option => {
                if (!isActice) {
                    return
                }
                rotateMoving(option.e)
                stretchMoving(option.e)
            })
            canvas.on('mouse:up', option => {
                if (!isActice) {
                    return
                }
                rotateEnd(option.e)
                stretchEnd(option.e)
            })

            isInit = true
        }
    }
}

export const unInitCompass = () => {
    if (capObject) {
        canvas.remove(capObject)
        capObject = null
    }
    if (leftArmObject) {
        canvas.remove(leftArmObject)
        leftArmObject = null
    }
    if (rightArmObject) {
        canvas.remove(rightArmObject)
        rightArmObject = null
    }
}

const makeCompass = () => {
    leftArmObject.left = 400
    leftArmObject.top = 300

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
    const radius = canvasBrush.size
    const centerPoint = canvas.restorePointerVpt(stabPos)
    const circleCenter = new fabric.Circle({
        left: centerPoint.x - radius / Math.sqrt(2),
        top: centerPoint.y - radius / Math.sqrt(2),
        fill: canvasBrush.color,
        evented: false,
        selectable: false,
        radius
    })

    canvas.insertAt(circleCenter, getCanvasFrontIndex())

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
        left: stabPosDraw.x - drawRadius,
        top: stabPosDraw.y - drawRadius,
        stroke: canvasBrush.color,
        strokeWidth: canvasBrush.size,
        fill: 'transparent',
        evented: false,
        selectable: false,
        radius: drawRadius,
        endAngle: intersectionAngle.deg
    })

    if ((isRotatingClockwise && !isRotatingBig) || (!isRotatingClockwise && isRotatingBig)) {
        circle.rotate(deltaAngleToAxisX.deg * (isDeltaAngleToAxisXClockWise ? -1 : 1))
    } else {
        circle.endAngle = 360 - intersectionAngle.deg
        circle.rotate(deltaAngleToAxisX.deg * (isDeltaAngleToAxisXClockWise ? -1 : 1) - circle.endAngle)
    }

    drawingObject = circle

    canvas.insertAt(circle, getCanvasFrontIndex())
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
        left: stabPosDraw.x - drawRadius,
        top: stabPosDraw.y - drawRadius,
        stroke: canvasBrush.color,
        strokeWidth: canvasBrush.size,
        fill: 'transparent',
        evented: false,
        selectable: false,
        radius: drawRadius
    })

    canvas.insertAt(circle, getCanvasFrontIndex())

    drawingFinishedObject = circle
}

const rotateEnd = e => {
    if (!isRotating) {
        return
    }

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

    // 修改以joint点转动引起的变化
    const intersectionJointAngle = getIntersectionAngle(jointPos, stretchFrom, pointer)

    const isStretchClockwise = isClockwise(jointPos, stretchFrom, pointer)

    const pointStretchdLeft = pointRotateByPoint(canvas.restorePointerVpt(stabPos), leftArmOriginPos, -intersectionJointAngle.rad / 2 * (isStretchClockwise ? 1 : -1))
    leftArmObject.left = pointStretchdLeft.x
    leftArmObject.top = pointStretchdLeft.y
    leftArmObject.angle = leftArmOriginPos.angle - intersectionJointAngle.deg / 2 * (isStretchClockwise ? 1 : -1)

    rightArmObject.angle = rightArmOriginPos.angle + intersectionJointAngle.deg / 2 * (isStretchClockwise ? 1 : -1)

    capObject.angle = capOriginPos.angle

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

    return getPointInLine(leftArmObject.oCoords.br, leftArmObject.oCoords.bl, 9 * canvas.getZoom())
}

const getJointPos = () => {
    leftArmObject.setCoords()

    return getPointInLine(leftArmObject.oCoords.tr, leftArmObject.oCoords.tl, 5 * canvas.getZoom())
}

const getLeftArmJointPos = () => {
    leftArmObject.setCoords()

    return getPointInLine(leftArmObject.oCoords.tr, leftArmObject.oCoords.tl, 5 * canvas.getZoom())
}

const getRightArmJointPos = () => {
    rightArmObject.setCoords()

    return getPointInLine(rightArmObject.oCoords.tl, rightArmObject.oCoords.tr, 1 * canvas.getZoom())
}

const getCapJointPos = () => {
    capObject.setCoords()

    return getPointInLine(capObject.oCoords.mb, capObject.oCoords.mt, 30 * canvas.getZoom())
}

const getNibPos = () => {
    rightArmObject.setCoords()

    return getPointInLine(rightArmObject.oCoords.bl, rightArmObject.oCoords.br, 5 * canvas.getZoom())
}
