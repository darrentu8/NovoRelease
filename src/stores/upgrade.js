import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'

export const useUpgradeStore = defineStore('upgrade', {
  state: () => ({
    loading: false,
    currentUpgrade: {},
    upgradeList: [],
    currentUpgradeList: []
  }),
  getters: {
    getLoading() {
      return this.loading
    },
    getToken() {
      return this.Token
    },
    getUpgradeList() {
      return this.upgradeList
    },
    getCurrentUpgrade() {
      return this.currentUpgrade
    },
    getCurrentUpgradeList() {
      return this.currentUpgradeList
    }
  },
  actions: {
    getUpgrade() {
      this.loading = true
      api.get('/webapi/upgradeNumber')
        .then((response) => {
          // console.log(response)
          this.upgradeList = response.data
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
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
    },
    editUpgrade(data) {
      this.loading = true
      return api.post('webapi/upgradeNumber/' + data.id, { version: data.version })
        .then((response) => {
          // console.log(response)
          this.getUpgrade()
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
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
    },
    createUpgrade(data) {
      this.loading = true
      return api.post('webapi/upgradeNumber', data)
        .then((response) => {
          this.loading = false
          this.getUpgrade()
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
        })
        .catch((error) => {
          this.loading = false
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
    },
    delUpgrade(id) {
      api.delete('webapi/upgradeNumber/' + id)
        .then((response) => {
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
          this.getUpgrade()
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
  }
})
