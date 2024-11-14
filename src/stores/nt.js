import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'

export const useNtStore = defineStore('nt', {
  state: () => ({
    percentCompleted: 0,
    loading: false,
    dialogLoading: false,
    dialogBtnLoading: false,
    currentNt: {},
    currentNtConFileList: [],
    ntList: [],
    appList: []
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
    getFileUploading() {
      return this.percentCompleted
    },
    getToken() {
      return this.Token
    },
    getNtList() {
      return this.ntList
    },
    getAppList() {
      return this.appList
    },
    getCurrentNt() {
      return this.currentNt
    },
    getCurrentNtList() {
      return this.currentNtList
    },
    getCurrentNtConFileList() {
      return this.currentNtConFileList
    }
  },
  actions: {
    setPercentCompleted(val) {
      this.percentCompleted = val
    },
    getNt() {
      this.loading = true
      return api.get('webapi/ntapp/release')
        .then((response) => {
          // console.log(response)
          this.ntList = response.data
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
    getApp() {
      return api.get('webapi/ntapp')
        .then((response) => {
          // console.log(response)
          this.appList = response.data
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
    getNtByID(id) {
      if (!id) {
        return
      }
      return api.get('webapi/ntapp/release/' + id)
        .then((response) => {
          /* console.log(response) */
          this.currentNt = response.data
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
    uploadNtFile(data) {
      this.dialogLoading = true
      return api.postForm('webapi/ntapp', data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setPercentCompleted(percentCompleted / 100)
          // console.log('percentCompleted / 100', percentCompleted / 100)
        }
      })
        .then((response) => {
          // console.log(response)
          this.currentNtConFileList = response.data
          this.dialogLoading = false
        })
        .catch((error) => {
          this.setPercentCompleted(0)
          this.dialogLoading = false
          // const { description } = error.response.data
          console.log(error)
          // Notify.create({
          //   color: 'red-5',
          //   textColor: 'white',
          //   icon: 'warning',
          //   // caption: code,
          //   message: description
          // })
        })
    },
    editNt(id, data) {
      if (!id) {
        return
      }
      this.loading = true
      return api.post('/webapi/ntapp/release/' + id, data)
        .then((response) => {
          // console.log(response)
          this.getNt()
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
    createNt(data) {
      this.loading = true
      return api.post('webapi/ntapp/release', data)
        .then((response) => {
          this.loading = false
          this.getNt()
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
    delNt(id) {
      if (!id) {
        return
      }
      api.delete('webapi/ntapp/release/' + id)
        .then((response) => {
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
          this.getNt()
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
    delAppListFile(data) {
      this.dialogBtnLoading = true
      return api.delete('webapi/ntapp/' + data.id)
        .then((response) => {
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
          this.getApp()
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
