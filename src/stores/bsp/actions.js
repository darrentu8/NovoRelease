import { Notify } from 'quasar'
import { postAction, postBlobAction, getAction, deleteAction } from 'src/api/manage'

export function getBsp({ state, commit, rootGetters }) {
  const BID = {
    bid: rootGetters['auth/getBID']
  }
  commit('setLoading', true)
  getAction('webapi/rmcBspense', BID)
    .then((response) => {
      console.log(response)
      commit('setBsp', response.data.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      commit('setLoading', false)
      const { description } = error.response.data
      // console.log(error.response.data)
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        // caption: code,
        message: description
      })
    })
}
export function editBsp({ state, commit, dispatch, rootGetters }, data) {
  commit('setLoading', true)
  postAction('webapi/rmcBspense/' + state.currentBsp.id + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      console.log(response)
      dispatch('getBsp')
      commit('setLoading', false)
    })
    .catch((error) => {
      commit('setLoading', false)
      const { description } = error.response.data
      // console.log(error.response.data)
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        // caption: code,
        message: description
      })
    })
}
export function createBsp({ state, commit, dispatch, rootGetters }, data) {
  postAction('webapi/rmcBspense' + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      dispatch('getBsp')
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
    })
    .catch((error) => {
      const { description } = error.response.data
      // console.log(error.response.data)
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        // caption: code,
        message: description
      })
    })
}
export function exportBsp({ state, commit, dispatch, rootGetters }, data) {
  postBlobAction('webapi/rmcBspense/export' + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      // console.log(response)
      const blob = new Blob([response.data], { type: 'appBspation/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const contentDisposition = response.headers['content-disposition']
      // console.log('contentDisposition = ', contentDisposition)
      let fileName = 'unknown'
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
        if (fileNameMatch.length === 2) { fileName = fileNameMatch[1] }
      }
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = fileName
      a.click()
    })
    .catch((error) => {
      console.log(error)
    })
}
export function delBsp({ state, commit, dispatch, rootGetters }, id) {
  deleteAction('webapi/rmcBspense/' + id + '?bid=' + rootGetters['auth/getBID'])
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      dispatch('getBsp')
    })
    .catch((error) => {
      const { description } = error.response.data
      // console.log(error.response.data)
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        // caption: code,
        message: description
      })
    })
}
