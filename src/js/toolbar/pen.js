// import { fabric } from 'fabric'
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

// const MarkerBrush = fabric.util.createClass(fabric.PencilBrush, {
//     color: '#000000',
//     opacity: 1,
//     width: 30,

//     _baseWidth: 10,
//     _lastPoint: null,
//     _lineWidth: 3,
//     _point: null,
//     _size: 0,

//     initialize: function (canvas, opt) {
//         opt = opt || {}

//         this.canvas = canvas
//         this.width = opt.width || canvas.freeDrawingBrush.width
//         this.color = opt.color || canvas.freeDrawingBrush.color
//         this.opacity = opt.opacity || canvas.contextTop.globalAlpha
//         this._point = new fabric.Point()

//         this.canvas.contextTop.lineJoin = 'round'
//         this.canvas.contextTop.lineCap = 'round'
//     },

//     changeColor: function (color) {
//         this.color = color
//     },

//     changeOpacity: function (value) {
//         this.opacity = value
//     },

//     _render: function (pointer) {
//         let lineWidthDiff, i, len

//         const ctx = this.canvas.contextTop

//         ctx.beginPath()

//         for (i = 0, len = (this._size / this._lineWidth) / 2; i < len; i++) {
//             lineWidthDiff = (this._lineWidth - 1) * i

//             ctx.globalAlpha = 0.8 * this.opacity
//             ctx.moveTo(this._lastPoint.x + lineWidthDiff, this._lastPoint.y + lineWidthDiff)
//             ctx.lineTo(pointer.x + lineWidthDiff, pointer.y + lineWidthDiff)
//             ctx.stroke()
//         }

//         this._lastPoint = new fabric.Point(pointer.x, pointer.y)

//         ctx.restore()
//     },

//     onMouseDown: function (pointer) {
//         this._lastPoint = pointer
//         this.canvas.contextTop.strokeStyle = this.color
//         this.canvas.contextTop.lineWidth = this._lineWidth
//         this._size = this.width + this._baseWidth
//     },

//     onMouseMove: function (pointer) {
//         if (this.canvas._isCurrentlyDrawing) {
//             this._render(pointer)
//         }
//     },

//     onMouseUp: function (options) {
//         this.canvas.contextTop.globalAlpha = this.opacity
//     }
// })
