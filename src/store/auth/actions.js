import { Notify, Cookies, LocalStorage } from 'quasar'
import { postAction, getAction } from 'src/api/manage'

export function GetUID({ state, commit }) {
  if (LocalStorage.getItem('uid')) {
    return LocalStorage.getItem('uid')
  } else if (Cookies.get('uid')) {
    return Cookies.get('uid')
  } else {
    return state.uid
  }
}
export function GetGID({ state, commit }) {
  if (LocalStorage.getItem('gid')) {
    return LocalStorage.getItem('gid')
  } else if (Cookies.get('gid')) {
    return Cookies.get('gid')
  } else {
    return state.gid
  }
}
export function loginAndSetUid({ state, commit }, loginData) {
  postAction('webapi/server/login', loginData)
    .then((response) => {
      Cookies.remove('uid')
      // // console.log(response)
      commit('setLoginStatus', true)
      commit('setID', response.id)
      commit('setUID', response.uid)
      commit('setEmail', response.email)
      commit('setUserData', response.userData)
      Cookies.set('uid', response.uid, { expires: 1 })
      // 移除訪客資料
      Cookies.remove('gid')
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: 'Login Success'
      // })
      this.$router.push({ path: '/list/all' })
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
export function loginAndGuestRoom({ state, commit }, joinData) {
  postAction('webapi/guest/room', joinData)
    .then((response) => {
      Cookies.remove('uid')
      // console.log(response)
      Cookies.set('gid', response.gid, { expires: 1 })
      if (response.wid) {
        this.$router.push({ path: '/whiteboard/' + response.wid })
        // Notify.create({
        //   color: 'primary',
        //   textColor: 'white',
        //   icon: 'check',
        //   message: 'Login Success'
        // })
      }
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
export function Logout({ state, commit }) {
  // state.$store.permission.ClearMenu()
  Cookies.remove('uid')
  Cookies.remove('gid')
  commit('setLoginStatus', false)
  commit('setWSStatus', false)
  commit('setID', undefined)
  commit('setUID', undefined)
  commit('setEmail', undefined)
  commit('setUserData', {
    id: null,
    fname: '',
    lname: '',
    thumbnail: '',
    language: '',
    user_id: null
  })
  this.$router.push({ path: '/login' })
  // Notify.create({
  //   color: 'primary',
  //   textColor: 'white',
  //   icon: 'check',
  //   message: 'Logout Success'
  // })
}
export function RequestFailed({ state, commit }) {
  // state.$store.permission.ClearMenu()
  Cookies.remove('uid')
  Cookies.remove('gid')
  commit('setLoginStatus', false)
  commit('setWSStatus', false)
  commit('setID', undefined)
  commit('setUID', undefined)
  commit('setEmail', undefined)
  commit('setUserData', undefined)
  this.$router.push({ path: '/login' })
  Notify.create({
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    message: 'Data Exception Please Relogin'
  })
}
export async function Reg({ state, commit }, data) {
  postAction('webapi/server/registration', data)
    .then((response) => {
      // console.log(response)
      this.$router.push({ name: 'activation' })
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
export async function Active({ commit }, data) {
  return await getAction('webapi/server/request', data)
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
export async function SendForgot({ commit }, data) {
  return await getAction('webapi/password/forgot', data)
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
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
export function ResetForgot({ commit }, data) {
  return postAction('webapi/password/forgot', data)
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
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
export function Resend({ commit }, data) {
  return postAction('webapi/activation/resend', data)
    .then((response) => {
      // console.log(response)
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: response.description
      // })
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

// export function ChangeRememberMe(state, type) {
//   state.rememberMe = type
// }
// export function ChangeLanguage(state, lang) {
//   state.language = lang
//   Cookies.set('language', lang)
// }
// export function GetLanguage(state) {
//   if (state.language) {
//     return state.language
//   } else if (Cookies.get('language')) {
//     return Cookies.get('language')
//   } else {
//     return 'en-US'
//   }
// }
