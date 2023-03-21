import { Notify } from 'quasar'
import { postAction, getAction, deleteAction } from 'src/api/manage'

export function getProject({ state, commit, rootGetters }) {
  const UID = {
    uid: rootGetters['auth/getUID']
  }
  commit('setLoading', true)
  getAction('webapi/project', UID)
    .then((response) => {
      // // console.log(response)
      commit('setProject', response)
      commit('setSortProjectParams', 'Last modified')
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
export function getShareProject({ state, commit, rootGetters }) {
  const UID = {
    uid: rootGetters['auth/getUID']
  }
  commit('setLoading', true)
  getAction('webapi/project/sharing', UID)
    .then((response) => {
      // // console.log(response)
      commit('setShareProject', response)
      commit('setSortProjectParams', 'Last modified')
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
export function createProject({ state, commit }, data) {
  postAction('webapi/project', data)
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
export function editFile({ state, commit, dispatch, rootGetters }, data) {
  const pid = data.pid
  const editData = {
    name: data.name,
    uid: rootGetters['auth/getUID']
  }
  postAction('webapi/project/' + pid + '/name', editData)
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      dispatch('getProject')
      dispatch('getShareProject')
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
export function getShareList({ state, commit, rootGetters }, data) {
  const PID = state.currentProject.pid ? state.currentProject.pid : data
  getAction('webapi/project/' + PID + '/sharing' + '?uid=' + rootGetters['auth/getUID'])
    .then((response) => {
      // console.log(response)
      commit('setShareList', response)
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
export function getProjectShareList({ state, commit, rootGetters }, PID) {
  getAction('webapi/project/' + PID + '/sharing' + '?uid=' + rootGetters['auth/getUID'])
    .then((response) => {
      // console.log(response)
      commit('setShareList', response)
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
export function shareProject({ state, commit, dispatch }, data) {
  const PID = data.pid ? data.pid : state.currentProject.pid
  postAction('webapi/project/' + PID + '/sharing' + '?pid=' + PID, data)
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      // dasgboard專案列表
      if (!data.pid) {
        dispatch('getProject')
      }
      dispatch('getShareList', data.pid)
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
export function shareProjectList({ state, commit, dispatch }, data) {
  const PID = data.pid ? data.pid : state.currentProject.pid
  postAction('webapi/project/' + PID + '/access', data)
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      // dasgboard專案列表
      if (!data.pid) {
        dispatch('getProject')
      }
      dispatch('getShareList', data.pid)
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
export function cloneproject({ state, commit, dispatch, rootGetters }, data) {
  const vid = data.vid
  const cloneData = {
    name: data.name,
    user_id: data.user_id.value,
    approve: Number(data.approve),
    uid: rootGetters['auth/getUID']
  }
  postAction('webapi/project/' + vid + '/clone', cloneData)
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      dispatch('getProject')
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
export function delProject({ state, commit, dispatch, rootGetters }, pid) {
  const UID = rootGetters['auth/getUID']
  deleteAction('webapi/project/' + pid + '?uid=' + UID)
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
      dispatch('getProject')
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
