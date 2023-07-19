import { Notify } from 'quasar'
import { postAction, getAction, deleteAction } from 'src/api/manage'

export function getAnn({ state, commit, rootGetters }) {
  const BID = {
    bid: rootGetters['auth/getBID']
  }
  commit('setLoading', true)
  getAction('webapi/announcement', BID)
    .then((response) => {
      console.log(response)
      commit('setAnn', response.data.data)
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
export function editAnn({ state, commit, dispatch, rootGetters }, data) {
  commit('setLoading', true)
  postAction('webapi/announcement/' + state.currentDevice.id + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      console.log(response)
      dispatch('getAnn')
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
export function createAnn({ state, commit, dispatch, rootGetters }, data) {
  postAction('webapi/announcement' + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      dispatch('getAnn')
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
export function delAnn({ state, commit, dispatch, rootGetters }, id) {
  deleteAction('webapi/announcement/' + id + '?bid=' + rootGetters['auth/getBID'])
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      dispatch('getAnn')
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
