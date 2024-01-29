import { boot } from 'quasar/wrappers'
import { QSpinnerGears, LoadingBar, Loading } from 'quasar'

LoadingBar.setDefaults({
  color: 'primary',
  size: '4px',
  position: 'top'
})

function startLoading() {
  Loading.show({
    spinner: QSpinnerGears,
    spinnerSize: 100,
    message: 'Loading...',
    boxClass: 'bg-grey-2 text-grey-9 brand-round',
    spinnerColor: 'primary'
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
    next()
    stopLoading()
  })
  router.afterEach(() => {
    stopLoading()
  })
})
