<template>
  <q-page class="flex flex-center" :style-fn="stylePage">
    <div class="fit whiteboard-canvas-wrapper flex relative-position overflow-hidden">
      <canvas id="whiteboard-canvas" width="300" height="300"></canvas>
      <q-resize-observer @resize="onResize" />

      <ToolBar />
      <OperationBar />
      <LeftBar />
      <RightBar />
      <Clipboard />
      <UserMouse />
      <PlayerVideo />
      <PlayerAudio />
    </div>
  </q-page>
</template>

<script>
import ToolBar from '../layouts/toolbar/Toolbar'
import OperationBar from '../layouts/operationbar/OperationBar'
import LeftBar from '../layouts/leftbar/LeftBar'
import RightBar from '../layouts/RightBar'
import Clipboard from '../layouts/Clipboard'
import UserMouse from '../layouts/UserMouse'
import PlayerVideo from '../layouts/media/Video'
import PlayerAudio from '../layouts/media/Audio'
import { initCanvas, canvas, setCanvasDataAndRender, setContent, leaveWhiteBoard } from '../js/canvas'

import { dom } from 'quasar'
import { mapMutations } from 'vuex'

import { mixinWebsocket } from '../mixins/ws.js'
import { activeChoose, uninitChoose } from 'src/js/toolbar/choose'
import { uninitPen } from 'src/js/toolbar/pen'
import { uninitEraser } from 'src/js/toolbar/eraser'
import { uninitShape } from 'src/js/toolbar/shape'
import { uninitText } from 'src/js/toolbar/text'
import { uninitCompass } from 'src/js/realia/compass'
import { uninitProtractor } from 'src/js/realia/protractor'
import { uninitRuler } from 'src/js/realia/ruler'
import { uninitTriangle } from 'src/js/realia/triangle'
import { initCanvasMove } from 'src/js/toolbar/move'

import { getProjectorData } from '../api/whiteboard'

export default {
  name: 'IndexPage',
  mixins: [mixinWebsocket],
  components: {
    ToolBar,
    OperationBar,
    LeftBar,
    RightBar,
    Clipboard,
    UserMouse,
    PlayerVideo,
    PlayerAudio
  },
  created() {
    this.initWebsocket()

    const pid = this.$route.params.pid
    const uid = this.$store.getters['auth/getUID']
    if (pid && uid) {
      // clear
      this.SET_PAGES([])
      this.SET_PAGE_ID(null)

      getProjectorData(pid, uid).then(data => {
        const contentData = data.content ? JSON.parse(data.content) : ''
        if (!contentData || contentData.pages.length === 0) { // new projector
          this.$bus.emit('addNewPage')
        } else if (contentData.pages && contentData.pages.length > 0) {
          this.SET_PAGES(contentData.pages)
          this.SET_PAGE_ID(contentData.pages[0].id)
          setCanvasDataAndRender(contentData.canvasData, contentData.pages[0].id)
        }
        this.SET_PNAME(data.name)
        document.title = `${data.name} | Whiteboard`
        this.setUserList(JSON.parse(data.userlist))
        this.SET_PROJECT_DATA(data.projectData)
        this.SET_USER_ROLE(data.role)
      })

      this.SET_PID(pid)
    }
  },
  mounted() {
    initCanvas('whiteboard-canvas')
    initCanvasMove()

    activeChoose()

    this.onResize()
  },
  beforeUnmount() {
    setContent()
    leaveWhiteBoard()

    this.SET_PID(null)
    this.$bus.emit('clearUserMouses')

    uninitChoose()
    uninitPen()
    uninitEraser()
    uninitShape()
    uninitText()
    uninitRuler()
    uninitCompass()
    uninitProtractor()
    uninitTriangle()

    document.title = 'Whiteboard'
  },
  data() {
    return {

    }
  },
  destroy() {
    this.websocketclose()
  },
  computed: {

  },
  methods: {
    ...mapMutations('user', ['setUserList']),
    ...mapMutations('common', ['SET_PID', 'SET_PNAME', 'SET_PAGES', 'SET_PAGE_ID', 'SET_USERS', 'SET_PROJECT_DATA',
      'SET_USER_ROLE']),
    stylePage(offset, height) {
      return { height: `${height - offset}px` }
    },
    onResize() {
      if (canvas) {
        const { height, width } = dom
        const heightCanvas = height(document.querySelector('.whiteboard-canvas-wrapper'))
        const widthCanvas = width(document.querySelector('.whiteboard-canvas-wrapper'))

        canvas.setWidth(widthCanvas)
        canvas.setHeight(heightCanvas)
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
