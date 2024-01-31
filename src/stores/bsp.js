import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'

export const useBspStore = defineStore('bsp', {
  state: () => ({
    loading: false,
    currentBsp: {},
    bspList: [],
    currentBspList: []
  }),
  getters: {
    getLoading() {
      return this.loading
    },
    getToken() {
      return this.Token
    },
    getBspList() {
      return this.bspList
    },
    getCurrentBsp() {
      return this.currentBsp
    },
    getCurrentBspList() {
      return this.currentBspList
    }
  },
  actions: {
    getBsp() {
      this.loading = true
      return api.get('webapi/bsp')
        .then((response) => {
          console.log(response)
          this.bspList = response.data
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
    editBsp(data) {
      this.loading = true
      api.post('/webapi/activeProduct/' + this.currentProduct.id, data)
        .then((response) => {
          console.log(response)
          this.getProduct()
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
    createBsp(data) {
      this.loading = true
      return api.post('webapi/bsp', data)
        .then((response) => {
          this.loading = false
          this.getBsp()
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
    delBsp(id) {
      api.delete('webapi/bsp/' + id)
        .then((response) => {
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
          this.getBsp()
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
