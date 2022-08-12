<template>
  <q-page class="flex flex-center" :style-fn="stylePage">
    <div class="fit whiteboard-canvas-wrapper flex relative-position">
      <canvas id="whiteboard-canvas" width="300" height="300"></canvas>
      <q-resize-observer @resize="onResize" />

      <ToolBar />
      <OperationBar />
      <ResizeBar />
      <Clipboard />

    </div>
  </q-page>
</template>

<script>
import ToolBar from '../layouts/toolbar/Toolbar'
import OperationBar from '../layouts/OperationBar'
import ResizeBar from '../layouts/ResizeBar'
import Clipboard from '../layouts/Clipboard'
import { initCanvas, canvas } from '../js/canvas'
import { initPen } from '../js/pen'

import { dom } from 'quasar'

export default {
  name: 'IndexPage',
  components: {
    ToolBar,
    OperationBar,
    ResizeBar,
    Clipboard
  },
  mounted() {
    initCanvas('whiteboard-canvas')

    // default
    initPen()

    this.onResize()
  },
  data() {
    return {

    }
  },
  methods: {
    stylePage(offset, height) {
      return { height: `${height - offset}px` }
    },
    onResize() {
      const { height, width } = dom
      const heightCanvas = height(document.querySelector('.whiteboard-canvas-wrapper'))
      const widthCanvas = width(document.querySelector('.whiteboard-canvas-wrapper'))

      canvas.setWidth(widthCanvas)
      canvas.setHeight(heightCanvas)
    },
    ctrlC() {
      alert(1)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
