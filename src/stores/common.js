import { defineStore } from 'pinia'
import packageInfo from '../../package.json'
import { Notify, Cookies, LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'

export const useCommonStore = defineStore('common', {
  state: () => ({
    htmlVersion: packageInfo.version,
    role: undefined,
    token: undefined,
    loginStatus: false,
    userData: {},
    language: undefined,
    loading: false
  }),
  getters: {
    getLoading() {
      return this.loading
    },
    getLoginStatus() {
      const Token = Cookies.get('token')
      if (Token) {
        return true
      } else {
        return this.loginStatus
      }
    },
    getToken() {
      return this.token || Cookies.get('token')
    },
    getUserData() {
      return this.userData
    }
  },
  actions: {
    GetToken() {
      if (LocalStorage.getItem('token')) {
        return LocalStorage.getItem('token')
      } else if (Cookies.get('token')) {
        return Cookies.get('token')
      } else {
        return this.token
      }
    },
    LoginAndSetToken(loginData) {
      return api.post('webapi/auth', loginData)
        .then((response) => {
          Cookies.remove('token')
          console.log(response)
          this.loginStatus = true
          this.token = response.token
          this.userData = response
          Cookies.set('token', response.token, { expires: 1 })
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: 'Login Success'
          // })
        })
        .catch((error) => {
          console.log(error)
          const { description } = error.response.data
          Notify.create({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            // caption: code,
            message: description
          })
        })
    },
    async Logout() {
      this.loginStatus = false
      this.token = undefined
      this.userData = {}
      await Cookies.remove('token')
      return true
      // Notify.create({
      //   color: 'red-5',
      //   textColor: 'white',
      //   icon: 'warning',
      //   message: 'Data Exception Please Relogin'
      // })
    }
  }
})
