import { Notify, Cookies, LocalStorage } from 'quasar'
import { postAction, getAction } from 'src/api/manage'

export function GetBID({ state, commit }) {
  if (LocalStorage.getItem('bid')) {
    return LocalStorage.getItem('bid')
  } else if (Cookies.get('bid')) {
    return Cookies.get('bid')
  } else {
    return state.bid
  }
}
export function loginAndSetBid({ state, commit }, loginData) {
  postAction('webapi/auth', loginData)
    .then((response) => {
      Cookies.remove('bid')
      console.log(response.data)
      commit('setLoginStatus', true)
      commit('setBID', response.data.bid)
      commit('setUserData', response.data)
      Cookies.set('bid', response.data.bid, { expires: 1 })
      // Notify.create({
      //   color: 'primary',
      //   textColor: 'white',
      //   icon: 'check',
      //   message: 'Login Success'
      // })
      this.$router.push({ path: '/service' })
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
  Cookies.remove('bid')
  commit('setLoginStatus', false)
  commit('setBID', undefined)
  commit('setUserData', {})
  this.$router.push({ path: '/' })
  // Notify.create({
  //   color: 'primary',
  //   textColor: 'white',
  //   icon: 'check',
  //   message: 'Logout Success'
  // })
}
export function RequestFailed({ state, commit }) {
  // state.$store.permission.ClearMenu()
  Cookies.remove('bid')
  commit('setLoginStatus', false)
  this.$router.push({ path: '/' })
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
