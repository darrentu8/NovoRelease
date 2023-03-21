import { canvas, getCanvasFrontIndex, markObjectOwner } from '../canvas'
import { fabric } from 'fabric'

export const addImage = (uuid, src) => {
    const img = new Image()
    img.src = src
    img.crossOrigin = 'anonymous'
    img.onload = () => {
        const imgObject = new fabric.Image(img, {
            uuidSrc: uuid,
            crossOrigin: 'anonymous',
            mediaSrc: src
        })

        canvas.insertAt(imgObject, getCanvasFrontIndex())
        canvas.viewportCenterObject(imgObject)
        canvas.setActiveObject(imgObject)

        imgObject.setControlVisible('mt', false)

        markObjectOwner(imgObject)
    }

    // imgObject.setSrc('https://test.novoconnect.cloud/webapi/project/Anaw8Om7c5PJlARBzxAoq04a/media/page.png', () => {
    //     canvas.renderAll()
    // })

    // fabric.Image.fromURL(src, img => {
    //     img.left = 100
    //     img.top = 100
    //     img.uuidSrc = uuid

    //     canvas.insertAt(img, getCanvasFrontIndex())

    //     canvas.setActiveObject(img)
    // })
}

export const addVideo = (videoData, thumbnailData) => {
    const img = new Image()
    img.src = thumbnailData.url
    img.crossOrigin = 'anonymous'
    img.onload = () => {
        const imgObject = new fabric.Image(img, {
            isVideo: true,
            uuidSrc: videoData.uuid,
            mediaSrc: videoData.url,
            crossOrigin: 'anonymous',
            padding: 5
        })

        canvas.insertAt(imgObject, getCanvasFrontIndex())
        canvas.viewportCenterObject(imgObject)
        canvas.setActiveObject(imgObject)

        imgObject.setControlVisible('mtr', false)

        markObjectOwner(imgObject)
    }
}

export const addAudio = (audioData) => {
    const img = new Image()
    img.src = require('../../assets/icons/icon_audio.svg')
    img.crossOrigin = 'anonymous'
    img.onload = () => {
        const imgObject = new fabric.Image(img, {
            isAudio: true,
            uuidSrc: audioData.uuid,
            mediaSrc: audioData.url,
            crossOrigin: 'anonymous',
            scaleX: 5,
            scaleY: 5
        })

        canvas.insertAt(imgObject, getCanvasFrontIndex())
        canvas.viewportCenterObject(imgObject)
        canvas.setActiveObject(imgObject)

        imgObject.setControlVisible('mtr', false)

        markObjectOwner(imgObject)
    }
}

export const addUrl = (url) => {
    const img = new Image()
    img.src = require('../../assets/icons/icon_link.svg')
    img.crossOrigin = 'anonymous'
    img.onload = () => {
        const imgObject = new fabric.Image(img, {
            isUrl: true,
            mediaSrc: url,
            crossOrigin: 'anonymous',
            padding: 5,
            scaleX: 5,
            scaleY: 5
        })

        canvas.insertAt(imgObject, getCanvasFrontIndex())
        canvas.viewportCenterObject(imgObject)
        canvas.setActiveObject(imgObject)

        imgObject.setControlVisible('mtr', false)

        markObjectOwner(imgObject)
    }
}

export const addDoc = (url, uuid, type) => {
    const img = new Image()
    if (type === 'ppt') {
        img.src = require('../../assets/icons/ppt.svg')
    } else if (type === 'doc') {
        img.src = require('../../assets/icons/doc.svg')
    } else if (type === 'xls') {
        img.src = require('../../assets/icons/xls.svg')
    } else if (type === 'pdf') {
        img.src = require('../../assets/icons/pdf.svg')
    }
    img.crossOrigin = 'anonymous'
    img.onload = () => {
        const imgObject = new fabric.Image(img, {
            isDoc: true,
            mediaSrc: url,
            uuidSrc: uuid,
            crossOrigin: 'anonymous',
            padding: 5
        })

        canvas.insertAt(imgObject, getCanvasFrontIndex())
        canvas.viewportCenterObject(imgObject)
        canvas.setActiveObject(imgObject)

        imgObject.setControlVisible('mtr', false)

        markObjectOwner(imgObject)
    }
}
