import { Notify } from 'quasar'
import { postAction, getAction, deleteAction } from 'src/api/manage'

// 取得使用者清單
export function getUserList({ state, commit, rootGetters }, data) {
  getAction('webapi/project/' + data + '/users' + '?uid=' + rootGetters['auth/getUID'])
    .then((response) => {
      // console.log(response)
      commit('setUserList', response)
    })
    .catch((error) => {
      const { description } = error.response.data
      //     console.log(error.response.data)
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        // caption: code,
        message: description
      })
    })
}
export async function uploadPic({ state, commit }, data) {
  return await postAction('webapi/user/profile/picture', data)
    .then((response) => {
      // console.log(response)
      return response
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
      return error
    })
}
export function getProfile({ state, commit, rootGetters }) {
  const UID = {
    uid: rootGetters['auth/getUID']
  }
  return getAction('webapi/user/profile', UID)
    .then((response) => {
      // console.log(response)
      commit('auth/setUserData', response, { root: true })
      commit('auth/setID', response.id, { root: true })
      return response
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
export function delPic({ state, commit, rootGetters }) {
  deleteAction('webapi/user/profile/picture' + '?uid=' + rootGetters['auth/getUID'])
    .then((response) => {
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
export function saveProfile({ state, commit }, data) {
  postAction('webapi/user/profile', data)
    .then((response) => {
      // console.log(response)
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
export function changePassword({ state, commit }, data) {
  postAction('webapi/user/password', data)
    .then((response) => {
      // console.log(response)
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
export function createUser({ state, commit, rootGetters }, data) {
  postAction('webapi/user/' + rootGetters['auth/getUID'], data)
    .then((response) => {
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
