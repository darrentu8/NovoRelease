import { api } from 'src/boot/axios'

export function getProjectorData(pid, uid) {
    return api({
        url: `webapi/project/${pid}/open`,
        method: 'POST',
        params: {
            uid
        }
    })
}

export function setWhiteboardThumbnail(pid, uid, thumbnail, index) {
    return api.post(`webapi/project/${pid}/thumbnail`, {
        thumbnail,
        uid,
        index
    })
}

export function uploadMediaFile(pid, data) {
    return api({
        url: `webapi/project/${pid}/media`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function getBackgroundImages() {
    return api({
        url: 'webapi/resource/background',
        method: 'GET'
    })
}
