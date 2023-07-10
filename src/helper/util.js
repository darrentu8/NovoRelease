import { colors } from 'quasar'
import { fabric } from 'fabric'

const { hexToRgb, rgbToHex } = colors

export const getTextWidth = (text, font) => {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
    const context = canvas.getContext('2d')
    context.font = font
    const metrics = context.measureText(text)
    return metrics.width
}

export const isColorHexEqual = (colorHex1, colorHex2) => {
    const colorText1 = JSON.stringify(hexToRgb(colorHex1))
    const colorText2 = JSON.stringify(hexToRgb(colorHex2))
    return colorText1 === colorText2
}

export const combineColorHexWithOpacity = (colorHex, opacity) => {
    const colorRGB = hexToRgb(colorHex)
    colorRGB.a = opacity
    return rgbToHex(colorRGB)
}

export const saveDataurlToImage = (dataurl, name, type = 'png') => {
    const byteCharacters = atob(
        dataurl.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
    )
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: undefined })
    const aLink = document.createElement('a')
    aLink.download = `${name}.${type}`
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
}

export const saveSvg = (svg, name) => {
    const downLink = document.createElement('a')
    downLink.download = `${name}.svg`
    const blob = new Blob([svg])
    downLink.href = URL.createObjectURL(blob)
    document.body.appendChild(downLink)
    downLink.click()
    document.body.removeChild(downLink)
}

const imageIoBase64 = (image) => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const base64 = canvas.toDataURL()
    return base64
}

export const getUrlBase64 = (url) => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
        image.onload = () => {
            resolve(imageIoBase64(image))
        }
    })
}

export const restorePointerVptInvert = (absolutePointer, viewportTransform) => {
    return fabric.util.transformPoint(
        absolutePointer,
        viewportTransform
    )
}
