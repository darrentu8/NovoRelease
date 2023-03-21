import { createStore } from 'vuex'

import common from './common'
import auth from './auth'
import permission from './permission'
import project from './project'
import user from './user'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const Store = createStore({
  modules: {
    common,
    auth,
    permission,
    project,
    user
  },
  state: {
    wsNotify: {}
  },
  mutations: {
    // 當接收到最新的後端送來的websocket資訊，直接存到state中的wsNotify
    setWsNotify(state, param) {
      state.wsNotify = param
    }
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: process.env.DEBUGGING
})

export default Store
