
import store from '../store'
import { mitt } from 'src/boot/bus'
import { canvas, setPageDataAndRender } from './canvas'
import { Notify } from 'quasar'
import { restorePointerVptInvert } from 'src/helper/util'

export let webSocket = null

export const initWebSocket = (ws) => {
    webSocket = ws

    webSocket.onmessage = e => {
        const messageData = JSON.parse(e.data)
        if (messageData.command === 'CONTENT_PAGE_UPDATE') {
            const pageId = messageData.page_id
            const pageData = JSON.parse(messageData.data)
            setPageDataAndRender(pageData, pageId)
        } else if (messageData.command === 'CONTENT_PAGE_LIST') {
            const pages = JSON.parse(messageData.data)
            store.commit('common/SET_PAGES', pages)
        } else if (messageData.command === 'PROJECT_DATA') {
            const projectData = JSON.parse(messageData.data)
            store.commit('common/SET_PROJECT_DATA', projectData)
        } else if (messageData.command === 'USER_LIST') {
            const userList = JSON.parse(messageData.data)
            store.commit('user/setUserList', userList)
        } else if (messageData.command === 'USER_MOUSE_POSITION') {
            const absolutePointer = JSON.parse(messageData.data)
            const data = {
                canvasPointer: restorePointerVptInvert(absolutePointer, canvas.viewportTransform),
                userData: messageData.user_data,
                pageId: messageData.page_id,
                pid: messageData.pid
            }
            store.commit('common/UPDATE_USER_MOUSE', data)
        }
    }

    webSocket.onclose = e => {
        console.log('WebSocket已關閉')

        mitt.emit('toDashboard')

        Notify.create({
            timeout: 5000,
            message: 'Disconnected to backend',
            position: 'bottom',
            type: 'negative'
        })
    }
}
