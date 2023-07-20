import { boot } from 'quasar/wrappers'
import { LoadingBar, Loading } from 'quasar'
// import { Allowlist } from 'src/settings'
import useCommon from 'src/composables/useCommon'
import { i18n } from './i18n'

LoadingBar.setDefaults({
  color: 'primary',
  size: '4px',
  position: 'top'
})

function startLoading() {
  Loading.show({
    // spinner: QSpinnerGears,
    message: i18n.global.t('System') + ' ' + i18n.global.t('Loading')
  })
  LoadingBar.start()
}

function stopLoading() {
  Loading.hide()
  LoadingBar.stop()
}

export default boot(({ router, store }) => {
  router.beforeEach((to, from, next) => {
    startLoading()
    const token = store.getters['auth/getBID']
    const { AllowList } = useCommon()
    // console.log('token', token)
    if (token) {
      // console.log('AllowList.indexOf(to.path)', AllowList.indexOf(to.path))
      // 有TOKEN在白名單內
      if (AllowList.indexOf(to.path) !== -1) {
        // next({ path: '/' })
        next()
        stopLoading()
      } else {
        // if (!store['permission/userMenu'].length) {
        //   store['permission/GetUserMenu'].then(res => {
        //     // 在vue-router4中，addRoutes被废弃，改为了addRoute，循环调用
        //     // 动态添加鉴权路由表
        //     if (res) {
        //       res.forEach(item => {
        //         router.addRoute(item)
        //       })
        //       next({ ...to, replace: true })
        //     } else {
        //       store.dispatch('user/HandleLogout')
        //       next({ path: '/', replace: true })
        //     }
        //   })
        // } else {
        //   next()
        // }
        next()
        stopLoading()
      }
    } else {
      // console.log('AllowList.indexOf(to.path)', AllowList.indexOf(to.path))
      // 無TOKEN在白名單內
      if (AllowList.indexOf(to.path) !== -1) {
        next()
        stopLoading()
      } else {
        store.dispatch('auth/RequestFailed')
        next(`/?redirect=${to.fullPath}`)
        stopLoading()
      }
    }
  })
  router.afterEach(() => {
    stopLoading()
  })
})
