import { Notify } from 'quasar'
import { postAction, getAction, deleteAction } from 'src/api/manage'

export function getProduct({ state, commit, rootGetters }) {
  const BID = {
    bid: rootGetters['auth/getBID']
  }
  commit('setLoading', true)
  getAction('webapi/product', BID)
    .then((response) => {
      console.log(response)
      commit('setProduct', response.data.data)
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
export function editProduct({ state, commit, dispatch, rootGetters }, data) {
  commit('setLoading', true)
  postAction('webapi/activeProduct/' + state.currentProduct.id + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      console.log(response)
      dispatch('getProduct')
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
export function createProduct({ state, commit, dispatch, rootGetters }, data) {
  postAction('webapi/activeProduct' + '?bid=' + rootGetters['auth/getBID'], data)
    .then((response) => {
      dispatch('getProduct')
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
export function delProduct({ state, commit, dispatch, rootGetters }, id) {
  deleteAction('webapi/activeProduct/' + id + '?bid=' + rootGetters['auth/getBID'])
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      dispatch('getProduct')
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
