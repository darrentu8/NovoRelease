import { defineStore } from 'pinia'
import packageInfo from '../../package.json'
import { Cookies, LocalStorage } from 'quasar'
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
      const Token = Cookies.get('NM_token')
      if (Token) {
        return true
      } else {
        return this.loginStatus
      }
    },
    getToken() {
      return this.token || Cookies.get('NM_token')
    },
    getUserData() {
      return this.userData
    }
  },
  actions: {
    GetToken() {
      if (LocalStorage.getItem('NM_token')) {
        return LocalStorage.getItem('NM_token')
      } else if (Cookies.get('NM_token')) {
        return Cookies.get('NM_token')
      } else {
        return this.token
      }
    },
    LoginAndSetToken(loginData) {
      return api.post('webapi/auth', loginData)
        .then((response) => {
          Cookies.remove('NM_token')
          // console.log(response)
          this.loginStatus = true
          this.token = response.token
          this.userData = response
          Cookies.set('NM_token', response.token, { expires: 1 })
        })
    },
    GetUser() {
      return api.get('webapi/user', {
        headers: {
          Authorization: this.token || Cookies.get('NM_token')
        }
      })
        .then((response) => {
          // console.log(response)
          this.loginStatus = true
          this.userData = response.data
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: 'Login Success'
          // })
        })
    },
    async Logout() {
      this.loginStatus = false
      this.token = undefined
      this.userData = {}
      await Cookies.remove('NM_token')
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
