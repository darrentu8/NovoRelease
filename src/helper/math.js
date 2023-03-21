import { Vector2, Vector3, MathUtils } from 'three'

// 求垂足点
export const getFootPoint = (x0, y0, x1, y1, x2, y2) => {
    const k = -((x1 - x0) * (x2 - x1) + (y1 - y0) * (y2 - y1)) / ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    const xf = k * (x2 - x1) + x1
    const yf = k * (y2 - y1) + y1
    if (k < 0 || k > 1) {
        return false
    }

    return { x: xf, y: yf }
}

// 求向量方向长度的点
export const getPointInLine = (originPoint, currentPoint, length) => {
    const vectorOriginToCurrent = new Vector2(currentPoint.x - originPoint.x, currentPoint.y - originPoint.y).normalize()

    return {
        x: originPoint.x + length * vectorOriginToCurrent.x,
        y: originPoint.y + length * vectorOriginToCurrent.y
    }
}

// 求两个同一起始点的向量相对x轴的delta夹角
export const getDeltaAngle = (originPoint, vectorPoint1, vectorPoint2) => {
    const vectorFrom = new Vector2(vectorPoint1.x - originPoint.x, vectorPoint1.y - originPoint.y)
    const vectorTo = new Vector2(vectorPoint2.x - originPoint.x, vectorPoint2.y - originPoint.y)

    const angleFrom = vectorFrom.angle()
    const angleTo = vectorTo.angle()

    const angleRad = angleTo - angleFrom

    const angleDeg = MathUtils.radToDeg(angleRad)

    return {
        rad: angleRad,
        deg: angleDeg
    }
}

// 求两个同一起始点的向量夹角(0-180)
export const getIntersectionAngle = (originPoint, vectorPoint1, vectorPoint2) => {
    const vectorFrom = new Vector3(vectorPoint1.x - originPoint.x, vectorPoint1.y - originPoint.y, 0)
    const vectorTo = new Vector3(vectorPoint2.x - originPoint.x, vectorPoint2.y - originPoint.y, 0)

    const angleRad = vectorFrom.angleTo(vectorTo)

    const angleDeg = MathUtils.radToDeg(angleRad)

    return {
        rad: angleRad,
        deg: angleDeg
    }
}

// 计算向量相对X轴的角度
export const getAngleToAxisX = (vecotrPointFrom, vectorPointTo) => {
    const vector = new Vector3(vectorPointTo.x - vecotrPointFrom.x, vectorPointTo.y - vecotrPointFrom.y, 0)

    const vectorAxisX = new Vector3(1, 0, 0)

    const angleRad = vector.angleTo(vectorAxisX)

    const angleDeg = MathUtils.radToDeg(angleRad)

    return {
        rad: angleRad,
        deg: angleDeg
    }
}

// 点以某个点为中心旋转
export const pointRotateByPoint = (anchorPoint, transformPoint, angleRad) => {
    const transformPointVector = new Vector2(transformPoint.x, transformPoint.y)
    const anchorPointVector = new Vector2(anchorPoint.x, anchorPoint.y)

    return transformPointVector.rotateAround(anchorPointVector, angleRad)
}

// 计算两个点之间的距离
export const pointToPointDistance = (point1, point2) => {
    const point1Vector = new Vector2(point1.x, point1.y)
    const point2Vector = new Vector2(point2.x, point2.y)

    return point1Vector.distanceTo(point2Vector)
}

// 判断两个向量的夹角方向是否是顺时针
export const isClockwise = (originPoint, vectorPoint1, vectorPoint2) => {
    const vectorFrom = new Vector3(vectorPoint1.x - originPoint.x, vectorPoint1.y - originPoint.y, 0)
    const vectorTo = new Vector3(vectorPoint2.x - originPoint.x, vectorPoint2.y - originPoint.y, 0)

    const cross = vectorFrom.cross(vectorTo)

    return cross.z > 0
}

// 判断两个向量是否方向相同（允许弧度0.1的误差）
export const isVectorEqual = (vector1PointFrom, vector1PointTo, vector2PointFrom, vector2PointTo, delta = 0.1) => {
    const vector1 = new Vector3(vector1PointTo.x - vector1PointFrom.x, vector1PointTo.y - vector1PointFrom.y, 0)
    const vector2 = new Vector3(vector2PointTo.x - vector2PointFrom.x, vector2PointTo.y - vector2PointFrom.y, 0)

    return vector1.angleTo(vector2) < delta
}

// 判断向量所属象限
export const getQuadrant = (originPoint, vectorPoint) => {
    const vector = new Vector2(vectorPoint.x - originPoint.x, vectorPoint.y - originPoint.y).normalize()
    if (vector.x > 0 && vector.y > 0) {
        return 1
    } else if (vector.x < 0 && vector.y > 0) {
        return 2
    } else if (vector.x < 0 && vector.y < 0) {
        return 3
    } else if (vector.x > 0 && vector.y < 0) {
        return 4
    }
}

// 获取垂足位置相关信息
export const getFootPointInfo = (pointer, pointerLineL, pointerLineR, pointDirFrom, pointDirTo, offset) => {
    const footPoint = getFootPoint(pointer.x, pointer.y, pointerLineL.x, pointerLineL.y, pointerLineR.x, pointerLineR.y)

    if (!footPoint) {
        return false
    }

    if (pointer.x === footPoint.x && pointer.y === footPoint.y) {
        return
    }

    const isSameDir = isVectorEqual(pointer, footPoint, pointDirFrom, pointDirTo, 0.5)

    const length = pointToPointDistance(pointer, footPoint)

    const fpOffset = getPointInLine(pointer, footPoint, length + (isSameDir ? -offset : offset))

    return {
        footPoint: fpOffset,
        distance: length,
        isSameDir
    }
}
