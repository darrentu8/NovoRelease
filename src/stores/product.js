import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { useCommonStore } from 'src/stores/common'

const commonStore = useCommonStore()

export const useProductStore = defineStore('product', {
  state: () => ({
    loading: false,
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
    ],
    currentProduct: {
      id: 1,
      productid: 1,
      version: 'v1.0.0',
      filename: 'DS110_DS210_DS310_1.0.0.9999.apk',
      md5: '6f8de3b7719e9ec3d9c5b107dcc92b9c',
      filesize: 81414,
      description: 'Build 9999',
      parameters: 'DS110,DS220,DS310',
      state: 1
    },
    currentRelease: {
      id: 1,
      productid: 1,
      version: 'v1.0.0',
      filename: 'DS110_DS210_DS310_1.0.0.9999.apk',
      md5: '6f8de3b7719e9ec3d9c5b107dcc92b9c',
      filesize: 81414,
      description: 'Build 9999',
      parameters: 'DS110,DS220,DS310',
      state: 1
    },
    productList: [
      { id: 11, appid: 13, name: 'NovoDS(PC)', cdn: 1 },
      { id: 12, appid: 14, name: 'NovoRDM', cdn: 0 }
    ]
  }),
  getters: {
    getLoading() {
      return this.loading
    },
    getBID() {
      return this.bid
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
    getProduct() {
      const BID = {
        bid: commonStore.getBID
      }
      this.loading = true
      api.get('webapi/product', BID)
        .then((response) => {
          console.log(response)
          this.productList = response.data.data
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
      api.post('webapi/activeProduct/' + this.currentProduct.id + '?bid=' + commonStore.getBID, data)
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
      api.post('webapi/activeProduct/' + this.currentProduct.id + '?bid=' + commonStore.getBID, data)
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
    createProduct(data) {
      api.post('webapi/activeProduct' + '?bid=' + commonStore.getBID, data)
        .then((response) => {
          this.getProduct()
          // console.log(response)
          // Notify.create({
          //   color: 'primary',
          //   textColor: 'white',
          //   icon: 'check',
          //   message: response.description
          // })
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
    delProduct(id) {
      api.delete('webapi/activeProduct/' + id + '?bid=' + commonStore.getBID)
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
    }
  }
})
