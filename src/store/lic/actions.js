import { Notify } from 'quasar'
import { postAction, postBlobAction, getAction, deleteAction } from 'src/api/manage'

export function getLic({ state, commit, rootGetters }) {
  const BID = {
    bid: rootGetters['auth/getBID']
  }
  commit('setLoading', true)
  getAction('webapi/rmcLicense', BID)
    .then((response) => {
      console.log(response)
      commit('setLic', response.data.data)
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
export function editLic({ state, commit, dispatch, rootGetters }, data) {
  commit('setLoading', true)
  postAction('webapi/rmcLicense/' + state.currentLic.id + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      console.log(response)
      dispatch('getLic')
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
export function createLic({ state, commit, dispatch, rootGetters }, data) {
  postAction('webapi/rmcLicense' + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      dispatch('getLic')
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
export function exportLic({ state, commit, dispatch, rootGetters }, data) {
  postBlobAction('webapi/rmcLicense/export' + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      // console.log(response)
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
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
export function delLic({ state, commit, dispatch, rootGetters }, id) {
  deleteAction('webapi/rmcLicense/' + id + '?bid=' + rootGetters['auth/getBID'])
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      dispatch('getLic')
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
