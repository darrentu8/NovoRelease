import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'

export const useBspStore = defineStore('bsp', {
  state: () => ({
    percentCompleted: 0,
    loading: false,
    dialogLoading: false,
    dialogBtnLoading: false,
    currentBsp: {},
    currentBspCon: {},
    currentBspConFileList: [],
    bspList: [],
    currentBspList: []
  }),
  getters: {
    getLoading() {
      return this.loading
    },
    getDialogLoading() {
      return this.dialogLoading
    },
    getDialogBtnLoading() {
      return this.dialogBtnLoading
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
    },
    getCurrentBspConFileList() {
      return this.currentBspConFileList
    }
  },
  actions: {
    setPercentCompleted(val) {
      this.percentCompleted = val
    },
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
    getBspByID(id) {
      this.loading = true
      const ID = this.currentBsp.id ? this.currentBsp.id : id
      return api.get('webapi/bsp/' + ID)
        .then((response) => {
          // console.log(response)
          this.currentBsp = response.data
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
    getBspCon(id) {
      this.loading = true
      const ID = this.currentBsp.id ? this.currentBsp.id : id
      return api.get('webapi/bsp/' + ID + '/configuration')
        .then((response) => {
          // console.log(response)
          this.currentBspList = response.data
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
    getBspConFile(id) {
      this.dialogLoading = true
      const ID = this.currentBsp.id ? this.currentBsp.id : id
      return api.get('webapi/bsp/' + ID + '/file')
        .then((response) => {
          // console.log(response)
          this.currentBspConFileList = response.data
          this.dialogLoading = false
        })
        .catch((error) => {
          this.dialogLoading = false
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
    uploadBspConFile(id, data) {
      this.dialogLoading = true
      return api.postForm('webapi/bsp/' + id + '/file', data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setPercentCompleted(percentCompleted / 100)
          // console.log('percentCompleted / 100', percentCompleted / 100)
        }
      })
        .then((response) => {
          // console.log(response)
          this.currentBspConFileList = response.data
          this.dialogLoading = false
        })
        .catch((error) => {
          this.dialogLoading = false
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
      return api.post('/webapi/bsp/' + data.id, data)
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
    editBspCon(data) {
      this.loading = true
      return api.post('webapi/bsp/' + data.bspid + '/configuration/' + data.id, data)
        .then((response) => {
          console.log(response)
          this.getBspCon()
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
    createBspCon(data) {
      this.loading = true
      return api.post('webapi/bsp/' + this.currentBsp.id + '/configuration', data)
        .then((response) => {
          this.loading = false
          this.getBspCon()
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
    },
    delBspCon(data) {
      return api.delete('webapi/bsp/' + data.bspid + '/configuration/' + data.id)
        .then((response) => {
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
          this.getBspCon()
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
    },
    delBspConFile(data) {
      this.dialogBtnLoading = true
      console.log('data', data)
      return api.delete('webapi/bsp/' + data.bspid + '/file/' + data.id)
        .then((response) => {
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
          this.getBspConFile()
          this.dialogBtnLoading = false
        })
        .catch((error) => {
          this.dialogBtnLoading = false
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
