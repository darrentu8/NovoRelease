import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { useCommonStore } from 'src/stores/common'

const commonStore = useCommonStore()

export const useProductStore = defineStore('product', {
  state: () => ({
    percentCompleted: 0,
    loading: false,
    currentProduct: {},
    currentRelease: {},
    productList: [
      { id: 11, appid: 13, name: 'NovoDS(PC)', cdn: 1 },
      { id: 12, appid: 14, name: 'NovoRDM', cdn: 0 }
    ],
    currentProductList: [
      {
        id: 1,
        productid: 1,
        version: 'v1.0.0',
        filename: 'DS110_DS210_DS310_1.0.0.9999.apk',
        md5: '6f8de3b7719e9ec3d9c5b107dcc92b9c',
        filesize: 81414,
        description: 'Build 9999',
        parameters: 'DS110,DS220,DS310',
        state: 1
      }
    ]
  }),
  getters: {
    getLoading() {
      return this.loading
    },
    getFileUploading() {
      return this.percentCompleted
    },
    getToken() {
      return this.Token
    },
    getProductList() {
      return this.productList
    },
    getCurrentProduct() {
      return this.currentProduct
    },
    getCurrentProductList() {
      return this.currentProductList
    }
  },
  actions: {
    setPercentCompleted(val) {
      this.percentCompleted = val
    },
    getProduct() {
      this.loading = true
      return api.get('webapi/product')
        .then((response) => {
          // console.log(response)
          this.productList = response.data
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
    getProductByID(id) {
      this.loading = true
      const ID = this.currentProduct.id ? this.currentProduct.id : id
      return api.get('webapi/product/' + ID)
        .then((response) => {
          // console.log(response)
          this.currentProduct = response.data
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
    getProductDetail(id) {
      this.loading = true
      const ID = this.currentProduct.id ? this.currentProduct.id : id
      return api.get('webapi/product/' + ID + '/release')
        .then((response) => {
          // console.log(response)
          this.currentProductList = response.data
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
    editProduct(data) {
      this.loading = true
      return api.post('webapi/activeProduct/' + this.currentProduct.id + '?Token=' + commonStore.getToken, data)
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
    editRelease(data) {
      this.loading = true
      return api.post('webapi/product/' + data.productid + '/release/' + data.id, data)
        .then((response) => {
          console.log(response)
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
    createProduct(data) {
      this.loading = true
      return api.post('webapi/product', data)
        .then((response) => {
          this.loading = false
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
    createProductRelease(data) {
      this.loading = true
      return api.postForm('webapi/product/' + this.currentProduct.id + '/release', data, {
        onUploadProgress: (progressEvent) => {
          this.percentCompleted = (Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100)
          // console.log('setPercentCompleted', this.percentCompleted)
        }
      })
        .then((response) => {
          this.loading = false
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
    delProduct(data) {
      return api.delete('webapi/product/' + data.productid + '/release/' + data.id)
        .then((response) => {
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
          this.getProduct()
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
    delRelease(data) {
      return api.delete('webapi/product/' + data.productid + '/release/' + data.id)
        .then((response) => {
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
          return true
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
