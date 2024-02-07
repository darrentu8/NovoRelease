import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'
import { useCommonStore } from 'src/stores/common'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.DEV ? 'https://download.staging.launchnovo.com/' : 'https://download.staging.launchnovo.com/',
  // baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  },
  // timeout: 4000,
  withCredentials: false
})
export default boot(({ app, urlPath, store, redirect }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  const commonStore = useCommonStore(store)
  api.interceptors.request.use(config => {
    config.headers.authorization = commonStore.GetToken()
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  api.interceptors.response.use(response => {
    const { status } = response
    if (status === 200) {
      return response.data
    } else {
      switch (status) {
        default:
          return response.data
      }
    }
  }, error => {
    if (error.response) {
      // const { status } = error.response
      Notify.create({
        position: 'top',
        type: 'negative',
        message: error.response.data.description
      })

      // if (status === 401 || status === 403) {
      //   if (urlPath !== '/') {
      //     redirect({ path: '/' })
      //   }
      // }
      // if (error + '' === 'Error: Request failed with status code 500') {
      //   Notify.create({
      //     title: 'Error',
      //     message: 'Data Exception Please Relogin',
      //     persistent: true,
      //     ok: {
      //       push: true,
      //       color: 'negative',
      //       label: 'Logout'
      //     }
      //   }).onOk(() => {
      //     commonStore.Logout()
      //   })
      // }
      // 超時
      // if (error + '' === 'Error: timeout of 40000ms exceeded') {
      //   Notify.create({
      //     type: 'negative',
      //     message: 'Operation Timeout'
      //   })
      // }
      // 網絡錯誤情況，比如後台沒有對應的接口
      if (error + '' === 'Error: Network Error') {
        // router.push({ name: 'login' })
      } else if (error.response && error.response.status === 404) {
        console.log('請求地址不存在 [' + error.response.request.responseURL + ']')
        Notify.create({
          type: 'negative',
          message: 'Request Address NotFound  ' + error.response.request.responseURL
        })
      }
    }
    return Promise.reject(error)
  })

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
