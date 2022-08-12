import { boot } from 'quasar/wrappers'
import Mitt from 'mitt'

const mitt = new Mitt()

export default boot(({ app }) => {
    // Set Bus instance on Vue
    app.config.globalProperties.$bus = mitt
})

export { mitt }
