import { combineColorHexWithOpacity } from 'src/helper/util'
import { canvas, canvasBrush, getCanvasFrontIndex } from '../canvas'

let isInit = false
let isActive = false
let penType = 'pen'

export const initPen = (type) => {
    canvas.isDrawingMode = true
    isActive = true
    penType = type

    if (!isInit) {
        canvas.on('path:created', options => {
            if (isActive) {
                const path = options.path
                path.selectable = false
                path.evented = false
                path.strokeUniform = true

                path.moveTo(getCanvasFrontIndex())

                path.fill = canvasBrush.fillColorCalc
            }
        })

        isInit = true
    }

    setPenStroke()
}

export const uninitPen = () => {
    isInit = false
}

export const inactivePen = () => {
    canvas.isDrawingMode = false
    isActive = false
}

export const setPenStroke = () => {
    const strokeColor = penType === 'marker' ? combineColorHexWithOpacity(canvasBrush.strokeColor, 50)
        : combineColorHexWithOpacity(canvasBrush.strokeColor, canvasBrush.strokeOpacity)

    canvas.freeDrawingBrush.color = strokeColor
    canvas.freeDrawingBrush.width = penType === 'marker' ? canvasBrush.strokeSize * 2 : canvasBrush.strokeSize
    canvas.freeDrawingBrush.strokeDashArray = canvasBrush.strokeDash
}
