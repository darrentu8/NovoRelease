import { canvas, canvasBrush, getCanvasFrontIndex } from './canvas'

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

                path.moveTo(getCanvasFrontIndex())
            }
        })

        isInit = true
    }

    setPenColor(canvasBrush.color)
    setPenSize(canvasBrush.size)
}

export const unInitPen = () => {
    canvas.isDrawingMode = false
    isActive = false
}

export const setPenColor = color => {
    canvas.freeDrawingBrush.color = `${color}${penType === 'marker' ? '80' : 'ff'}`
}

export const setPenSize = size => {
    canvas.freeDrawingBrush.width = size
}
