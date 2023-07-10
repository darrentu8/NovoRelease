import { boot } from 'quasar/wrappers'
import axios from 'axios'
// import { Notify, Dialog } from 'quasar'
import { Notify } from 'quasar'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
  // baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  },
  timeout: 40000,
  withCredentials: false
})

export default boot(({ app, router, store }) => {
  // const i18n = createI18n({
  //     locale: store.getters['user/language'],
  //     fallbackLocale: 'zh-CN',
  //     messages,
  //     silentTranslationWarn: true,
  //     silentFallbackWarn: true
  // })
  // 請求攔截
  api.interceptors.request.use(request => {
    const UID = store.dispatch['auth/GetUID']
    request.headers.uid = UID
    return request
  }, error => {
    Notify.create({
      type: 'negative',
      message: error
    })
    return Promise.reject(error)
  })
  // 響應攔截
  // api.interceptors.response.use(response => {
  //   const { status, message } = response.data

  //   // 如果JWT的ExpiresAt已經過期，但是RefreshAt沒有過期，那麼後台會在headers裡插入Refresh-Token，這裡保存下來，形成更換token邏輯
  //   if (response.headers['refresh-uid'] && response.data.data.refresh) {
  //     store.auth.setUID(response.headers['refresh-uid'])
  //     // store.dispatch('auth/GetUID', response.headers['refresh-uid'])
  //     Notify.create({
  //       type: 'positive',
  //       message: 'Refresh UID Success'
  //     })
  //     return api(response.config)
  //   }
  //   if (status === 200) {
  //     return response.data
  //   } else {
  //     switch (status) {
  //       case 0:
  //         if (response.data && response.data.reload) {
  //           Dialog.create({
  //             title: 'Authentication Failed',
  //             message: message || 'Please Relogin',
  //             persistent: true,
  //             ok: {
  //               push: true,
  //               color: 'negative',
  //               label: 'Relogin'
  //             }
  //           }).onOk(() => {
  //             store.dispatch('auth/Logout')
  //           })
  //         } else {
  //           Notify.create({
  //             type: 'negative',
  //             message: message || 'Operation Failed'
  //           })
  //           return response.data
  //         }
  //         break
  //       default:
  //         return response.data
  //     }
  //   }
  // }, error => {
  //   // 500
  //   if (error + '' === 'Error: Internal Server Error') {
  //     Notify.create({
  //       type: 'negative',
  //       message: 'Request Error  ' + error.response.request.responseURL
  //     })
  //   }
  //   if (error + '' === 'Error: Request failed with status code 500') {
  //     Dialog.create({
  //       title: 'Error',
  //       message: 'Data Exception Please Relogin',
  //       persistent: true,
  //       ok: {
  //         push: true,
  //         color: 'negative',
  //         label: 'Logout'
  //       }
  //     }).onOk(() => {
  //       store.dispatch('auth/Logout')
  //     })
  //   }
  //   // 超時
  //   if (error + '' === 'Error: timeout of 40000ms exceeded') {
  //     Notify.create({
  //       type: 'negative',
  //       message: 'Operation Timeout'
  //     })
  //   }
  //   // 網絡錯誤情況，比如後台沒有對應的接口
  //   if (error + '' === 'Error: Network Error') {
  //     // router.push({ name: 'login' })
  //   } else if (error.response && error.response.status === 404) {
  //     console.log('請求地址不存在 [' + error.response.request.responseURL + ']')
  //     Notify.create({
  //       type: 'negative',
  //       message: 'Request Address NotFound  ' + error.response.request.responseURL
  //     })
  //   }
  //   return Promise.reject(error)
  // })
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
