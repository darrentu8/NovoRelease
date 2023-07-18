import { Notify } from 'quasar'
import { postAction, getAction, deleteAction } from 'src/api/manage'

export function getService({ state, commit, rootGetters }) {
  const BID = {
    bid: rootGetters['auth/getBID']
  }
  commit('setLoading', true)
  getAction('webapi/activeService', BID)
    .then((response) => {
      console.log(response)
      commit('setService', response.data.data)
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
export function editService({ state, commit, dispatch, rootGetters }, data) {
  commit('setLoading', true)
  postAction('webapi/activeService/' + state.currentService.id + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      console.log(response)
      dispatch('getService')
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
export function createService({ state, commit, dispatch, rootGetters }, data) {
  postAction('webapi/activeService' + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      dispatch('getService')
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
export function delService({ state, commit, dispatch, rootGetters }, id) {
  deleteAction('webapi/activeService/' + id + '?bid=' + rootGetters['auth/getBID'])
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      dispatch('getService')
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
