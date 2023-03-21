import { mapMutations } from 'vuex'
import store from '../store'
import { initWebSocket } from 'src/js/websocket'
export const mixinWebsocket = {
  data() {
    return {
      ws: null
    }
  },
  methods: {
    ...mapMutations(['setWsNotify']),
    initWebsocket() {
      const wsStatus = store.getters['auth/getWSStatus']
      const UID = store.getters['auth/getUID']
      if (!wsStatus) {
        if (UID) {
          const URL = process.env.API_URL.replace('https://', 'wss://').replace('http://', 'ws://')
          if (UID) {
            console.log('login')
            // console.log('UID', UID)
            this.ws = new WebSocket(URL + `/websocket/user/${UID}`)
            this.ws.onopen = this.websocketonopen
            this.ws.error = this.websocketonerror
            this.ws.onmessage = this.websocketonmessage
            this.ws.onclose = this.websocketclose
            initWebSocket(this.ws)
          }
        } else {
          console.log('wsStatus', wsStatus)
        }
      } else {
        console.log('wsStatus', wsStatus)
      }
    },
    websocketonopen() {
      const wsStatus = store.getters['auth/getWSStatus']
      if (!wsStatus) {
        store.commit('auth/setWSStatus', true)
      }
      console.log('WebSocket連線成功')
    },
    websocketonerror(e) {
      const wsStatus = store.getters['auth/getWSStatus']
      if (wsStatus) {
        store.commit('auth/setWSStatus', false)
      }
      console.error('WebSocket連線失敗', e)
    },
    websocketonmessage(e) {

    },
    websocketsend(data) {
      // 前端丟資料
      console.log('send data', data)
    },
    websocketclose() {

    }
  }
}
