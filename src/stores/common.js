import { defineStore } from 'pinia'
import packageInfo from '../../package.json'
import { Notify, Cookies, LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'

export const useCommonStore = defineStore('common', {
  state: () => ({
    htmlVersion: packageInfo.version,
    bid: undefined,
    loginStatus: false,
    userData: {},
    language: undefined,
    loading: false,
    userList: []
  }),
  getters: {
    getLoading() {
      return this.loading
    },
    getLoginStatus() {
      const BID = Cookies.get('bid')
      if (BID) {
        return true
      } else {
        return this.loginStatus
      }
    },
    getBID() {
      return this.bid || Cookies.get('bid')
    },
    getUserData() {
      return this.userData
    }
  },
  actions: {
    GetBID() {
      if (LocalStorage.getItem('bid')) {
        return LocalStorage.getItem('bid')
      } else if (Cookies.get('bid')) {
        return Cookies.get('bid')
      } else {
        return this.bid
      }
    },
    loginAndSetBid(loginData) {
      return api.post('webapi/auth', loginData)
        .then((response) => {
          Cookies.remove('bid')
          console.log(response)
          this.loginStatus = true
          this.bid = response.data.bid
          this.userData = response.data
          Cookies.set('bid', response.data.bid, { expires: 1 })
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
      this.bid = undefined
      this.userData = {}
      await Cookies.remove('bid')
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
