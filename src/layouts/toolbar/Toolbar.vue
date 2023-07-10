<template>
    <div class="row shadow-2 rounded-borders items-center text-center bg-white absolute" id="wb-toolbar"
        style="height:40px" :style="{ left: leftPx, top: topPx, bottom: bottomPx, transform: transform }">
        <q-btn-group class="fit">
            <Choose />
            <Move />
            <Shape />
            <Pen />
            <Text />
            <Eraser />
            <Realia />
            <Media />
            <q-separator vertical inset />
            <StrokeFill />
            <Background />
            <UndoRedo />
            <q-separator vertical inset />
            <q-btn class="overflow-hidden q-pa-none q-pl-sm q-pr-sm" style="cursor:grab" @mousedown="dragBegin"
                @dragstart.prevent="() => { return false }">
                <img style="height:26px;width:5px" :src="iconDrag" />
            </q-btn>
        </q-btn-group>
    </div>
</template>

<script>
import StrokeFill from './StrokeFill'
import Media from './Media'
import Pen from './Pen'
import Eraser from './Eraser'
import Shape from './Shape'
import Text from './Text'
import Choose from './Choose'
import Realia from './Realia'
import Background from './Background'
import Move from './Move'

import UndoRedo from './UndoRedo'

export default {
    name: 'ToolBar',
    components: {
        StrokeFill,
        Media,
        Pen,
        Eraser,
        Shape,
        Text,
        Choose,
        Realia,
        UndoRedo,
        Background,
        Move
    },
    mounted() {
        const domTool = document.querySelector('#wb-toolbar')
        const domToolRect = domTool.getBoundingClientRect()

        const domCanvas = document.querySelector('.whiteboard-canvas-wrapper')
        const domCanvasRect = domCanvas.getBoundingClientRect()
        this.left = domToolRect.left
        this.top = domToolRect.top - domCanvasRect.top
        this.bottomPx = ''
        this.transform = ''

        document.addEventListener('mousemove', this.dragMove)
        document.addEventListener('mouseup', this.dragEnd)
    },
    data() {
        return {
            iconDrag: require('../../assets/icons/icon_drag.svg'),
            left: '',
            top: '',
            bottomPx: '15px',
            transform: 'translate(-50%,0)',
            isDragging: false,
            dragBeginPos: { x: 0, y: 0 },
            originPos: { x: 0, y: 0 }
        }
    },
    computed: {
        leftPx() {
            return this.left ? `${this.left}px` : '50%'
        },
        topPx() {
            return `${this.top}px`
        }
    },
    methods: {
        dragBegin(e) {
            this.isDragging = true

            this.dragBeginPos.x = e.clientX
            this.dragBeginPos.y = e.clientY

            this.originPos.x = this.left
            this.originPos.y = this.top
        },
        dragMove(e) {
            if (!this.isDragging) {
                return
            }

            const deltaX = e.clientX - this.dragBeginPos.x
            const deltaY = e.clientY - this.dragBeginPos.y

            this.left = this.originPos.x + deltaX
            this.top = this.originPos.y + deltaY
        },
        dragEnd(e) {
            this.isDragging = false
        }
    }
}
</script>
<style lang="scss" >
.is-tool-selected {
    border-bottom: solid 5px #14A028;
}
</style>
