<template>
    <vue-draggable-resizable v-for="object in draggableRectObjects" :key="object.id" :resizable="false" :x="object.rect.x"
        :y="object.rect.y" :w="object.rect.w" :h="object.rect.h" @activated="onActivated(object.id)"
        @dragging="(...args) => onDrag(...args, object.id)" @dragstop="dragEnd">
        <q-media-player v-if="object.type === 'video'" dense autoplay class="fit" type="video" :source="object.source" />
        <!-- http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4 -->
        <div v-if="object.type === 'doc'" class="fit column">
            <q-bar class="bg-brand-green" style="cursor: move;border-radius: 10px 10px 0px 0px;">
                <div />
                <q-space />
                <q-btn dense flat icon="open_in_new" @click="openDocInNew(object.source)" />
                <q-btn dense flat icon="crop_square" @click="maxDoc(object.source)" />
                <q-btn dense flat icon="close" @click="closeDoc(object.id)" />
            </q-bar>
            <q-video class="col bg-grey-3" :src="object.source" />
        </div>
    </vue-draggable-resizable>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable.vue'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import { canvas } from 'src/js/canvas'
import { setOprBarOptions, setOprBarPos } from 'src/js/operationBar'
import { mapMutations } from 'vuex'
import { extend, openURL } from 'quasar'

export default {
    name: 'Draggable-Rects',
    components: {
        VueDraggableResizable
    },
    mounted() {
        this.$bus.on('dealDraggableRects', this.dealDraggableRects)
    },
    beforeUnmount() {
        this.$bus.off('dealDraggableRects', this.dealDraggableRects)
    },
    data() {
        return {

        }
    },
    computed: {
        draggableRectObjects() {
            return this.$store.state.common.draggableRectObjects
        }
    },
    methods: {
        ...mapMutations('common', ['REMOVE_DRAGGABLE_OBJECT', 'SET_DRAGGABLE_RECT_OBJECT', 'SET_IS_SHOW_URL_VIEWER', 'SET_URL_VIEWER_SRC']),
        dealDraggableRects(object) {
            this.draggableRectObjects.map(o => o).forEach(object => {
                this.dealDraggableRect(object)
            })
        },
        dealDraggableRect(object) {
            const canvasObject = canvas.getObjects().find(o => o.uuidSrc === object.id)

            if (!canvasObject) {
                this.REMOVE_DRAGGABLE_OBJECT(object.id)
                return
            }

            const objectCopy = extend(true, {}, object)

            const selectedObjectRect = canvasObject.getBoundingRect(true.true)

            objectCopy.rect.x = selectedObjectRect.left + 5
            objectCopy.rect.y = selectedObjectRect.top + 5
            objectCopy.rect.w = selectedObjectRect.width - 10
            objectCopy.rect.h = selectedObjectRect.height - 10

            this.SET_DRAGGABLE_RECT_OBJECT(objectCopy)
        },
        onActivated(id) {
            const canvasObject = canvas.getObjects().find(o => o.uuidSrc === id)
            if (!canvasObject) {
                return
            }
            canvas.setActiveObject(canvasObject)
        },
        onDrag(x, y, id) {
            const canvasObject = canvas.getObjects().find(o => o.uuidSrc === id)
            if (!canvasObject) {
                return
            }
            const pointVpt = canvas.restorePointerVpt({ x, y })
            canvasObject.setOptions({ left: pointVpt.x, top: pointVpt.y })
            setOprBarPos()

            canvas.renderAll()
        },
        dragEnd() {
            this.dealDraggableRects()
        },
        openDocInNew(url) {
            openURL(url)
        },
        maxDoc(url) {
            this.SET_IS_SHOW_URL_VIEWER(true)
            this.SET_URL_VIEWER_SRC(url)
        },
        closeDoc(id) {
            this.REMOVE_DRAGGABLE_OBJECT(id)
            setOprBarOptions()
        }
    }
}
</script>
<style lang="scss" scoped></style>
