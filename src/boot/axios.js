import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Cookies, Notify } from 'quasar'
import { useCommonStore } from 'src/stores/common'

const commonStore = useCommonStore()

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
    'Cache-Control': 'no-cache',
    authorization: commonStore.getToken || ''
  },
  timeout: 40000,
  withCredentials: false
})
export default boot(({ app, urlPath, redirect }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  api.interceptors.request.use(request => {
    request.headers.token = Cookies.get('token')
    return request
  })

  api.interceptors.response.use(response => {
    const { status } = response
    if (status === 200) {
      return response.data
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
