import { api } from 'src/boot/axios'
import { Notify } from 'quasar'

export function getAction(url, params) {
  return api({
    url,
    method: 'get',
    params
  })
}

export function postAction(url, params) {
  return api({
    url,
    method: 'post',
    data: params
  })
}

export function postBlobAction(url, params) {
  return api({
    url,
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}

export function putAction(url, params) {
  return api({
    url,
    method: 'put',
    data: params
  })
}

export function deleteAction(url, params) {
  return api({
    url,
    method: 'delete',
    data: params
  })
}

export function downFile(url, params) {
  return api({
    url,
    params,
    method: 'get',
    responseType: 'blob'
  })
}

export async function downloadAction(url, fileName, params) {
  const data = await downFile(url, params)
  if (!data || data.size === 0) {
    Notify.create({
      type: 'negative',
      message: '文件下载失败！'
    })
    return
  }
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(new Blob([data]), fileName)
  } else {
    const urlHref = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = urlHref
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // 下载完成移除元素
    window.URL.revokeObjectURL(urlHref) // 释放掉blob对象
  }
}
