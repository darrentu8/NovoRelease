<template>
    <vue-draggable-resizable v-if="isShow" :draggable="false" :resizable="false" :active="true" :x="videoRect.x"
        :y="videoRect.y" :w="videoRect.w" :h="videoRect.h" :parent="true" @activated="onActivated" @dragging="onDrag"
        @resizing="onResize">
        <q-media-player dense autoplay class="fit" type="video" :source="source" />
        <!-- http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4 -->
    </vue-draggable-resizable>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable.vue'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import { canvas } from 'src/js/canvas'
import { setOprBarPos } from 'src/js/operationBar'

export default {
    name: 'Player-Video',
    components: {
        VueDraggableResizable
    },
    mounted() {
        this.$bus.on('initVideoRect', this.initVideoRect)
        this.$bus.on('setVideoRectByCanvasRect', this.setVideoRectByCanvasRect)
        this.$bus.on('setCanvasRectByVideoRect', this.setCanvasRectByVideoRect)
    },
    beforeUnmount() {
        this.$bus.off('initVideoRect', this.initVideoRect)
        this.$bus.off('setVideoRectByCanvasRect', this.setVideoRectByCanvasRect)
        this.$bus.off('setCanvasRectByVideoRect', this.setCanvasRectByVideoRect)
    },
    data() {
        return {
            videoObject: null,
            videoRect: { x: 0, y: 0, w: 0, h: 0 }
        }
    },
    computed: {
        isShow() {
            return this.$store.state.common.isShowPlayerVideo
        },
        source() {
            return this.$store.state.common.playingVdieoSource
        }
    },
    methods: {
        initVideoRect() {
            const selectedObject = canvas.getActiveObject()

            if (!selectedObject.isVideo) {
                return
            }

            this.videoObject = selectedObject
            this.setVideoRectByCanvasRect()
        },
        uninitVideoRect() {

        },
        setVideoRectByCanvasRect() {
            const selectedObjectRect = this.videoObject.getBoundingRect(true.true)

            this.videoRect.x = selectedObjectRect.left
            this.videoRect.y = selectedObjectRect.top
            this.videoRect.w = selectedObjectRect.width
            this.videoRect.h = selectedObjectRect.height
        },
        setCanvasRectByVideoRect() {

        },
        onActivated() {
            if (!this.videoObject) {
                return
            }
            canvas.setActiveObject(this.videoObject)
        },
        onDrag(x, y) {
            if (!this.videoObject) {
                return
            }
            const pointVpt = canvas.restorePointerVpt({ x, y })
            this.videoObject.setOptions({ left: pointVpt.x, top: pointVpt.y })
            setOprBarPos()

            canvas.renderAll()
        },
        onResize(x, y, width, height) {
            if (!this.videoObject) {
                return
            }
            const pointVptTL = canvas.restorePointerVpt({ x, y })
            // const pointVptRB = canvas.restorePointerVpt({ x: x + width, y: y + height })
            this.videoObject.setOptions({
                left: pointVptTL.x,
                top: pointVptTL.y,
                width,
                height
            })
            setOprBarPos()

            canvas.renderAll()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
