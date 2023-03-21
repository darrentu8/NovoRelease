<template>
    <q-btn v-show="isVideo && !isShowDraggableRect" style="width:50px" color="brand-grey" flat icon="play_arrow"
        @click="playVideo" />
    <q-btn v-show="isVideo && isShowDraggableRect" style="width:50px" color="brand-grey" flat icon="stop"
        @click="stopVideo" />
    <q-btn v-show="isDoc && !isShowDraggableRect" style="width:50px" color="brand-grey" flat icon="play_arrow"
        @click="viewDoc" />
    <q-btn v-show="isDoc && isShowDraggableRect" style="width:50px" color="brand-grey" flat icon="stop" @click="closeDoc" />
    <q-btn v-show="isAudio" style="width:50px" color="brand-grey" flat icon="play_arrow" @click="playAudio" />
    <q-btn v-show="isUrl" style="width:50px" color="brand-grey" flat icon="visibility" @click="viewUrl" />
    <q-separator v-show="isVideo || isAudio || isUrl" vertical inset />

    <UrlViewer v-model:isShow="isShowUrlViewer" :urlSrc="urlVierweSrc" />
</template>

<script>
import { mapMutations } from 'vuex'

import UrlViewer from '../media/UrlViewer'

export default {
    name: 'OperationBar-Media',
    components: {
        UrlViewer
    },
    mounted() {
        this.$bus.on('setOprBarIsShowDraggableRect', this.setOprBarIsShowDraggableRect)
    },
    beforeUnmount() {
        this.$bus.off('setOprBarIsShowDraggableRect', this.setOprBarIsShowDraggableRect)
    },
    data() {
        return {
            isShowDraggableRect: false,
            videoEle: null
        }
    },
    computed: {
        isVideo() {
            if (!this.$store.state.common.selectedObject) {
                return false
            }
            return this.$store.state.common.selectedObject.type === 'image' && this.$store.state.common.selectedObject.isVideo
        },
        isDoc() {
            if (!this.$store.state.common.selectedObject) {
                return false
            }
            return this.$store.state.common.selectedObject.type === 'image' && this.$store.state.common.selectedObject.isDoc
        },
        isAudio() {
            if (!this.$store.state.common.selectedObject) {
                return false
            }
            return this.$store.state.common.selectedObject.type === 'image' && this.$store.state.common.selectedObject.isAudio
        },
        isUrl() {
            if (!this.$store.state.common.selectedObject) {
                return false
            }
            return this.$store.state.common.selectedObject.type === 'image' && this.$store.state.common.selectedObject.isUrl
        },
        isShowUrlViewer: {
            get() {
                return this.$store.state.common.isShowUrlViewer
            },
            set(val) {
                this.SET_IS_SHOW_URL_VIEWER(val)
            }
        },
        urlVierweSrc: {
            get() {
                return this.$store.state.common.urlVierweSrc
            },
            set(val) {
                this.SET_URL_VIEWER_SRC(val)
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_IS_SHOW_PLAYER_AUDIO', 'SET_PLAYING_AUDIO_SOURCE',
            'ADD_DRAGGABLE_RECT_OBJECT', 'REMOVE_DRAGGABLE_OBJECT', 'SET_IS_SHOW_URL_VIEWER', 'SET_URL_VIEWER_SRC']),
        setOprBarIsShowDraggableRect(val) {
            this.isShowDraggableRect = val
        },
        playVideo() {
            const draggableRectObject = {
                type: 'video',
                id: this.$store.state.common.selectedObject.uuidSrc,
                source: this.$store.state.common.selectedObject.mediaSrc,
                rect: { x: 0, y: 0, w: 0, h: 0 }
            }
            this.ADD_DRAGGABLE_RECT_OBJECT(draggableRectObject)
            this.$bus.emit('dealDraggableRects')

            this.isShowDraggableRect = true
        },
        stopVideo() {
            this.REMOVE_DRAGGABLE_OBJECT(this.$store.state.common.selectedObject.uuidSrc)

            this.isShowDraggableRect = false
        },
        viewDoc() {
            const draggableRectObject = {
                type: 'doc',
                id: this.$store.state.common.selectedObject.uuidSrc,
                source: this.$store.state.common.selectedObject.mediaSrc,
                rect: { x: 0, y: 0, w: 0, h: 0 }
            }
            this.ADD_DRAGGABLE_RECT_OBJECT(draggableRectObject)
            this.$bus.emit('dealDraggableRects')

            this.isShowDraggableRect = true
        },
        closeDoc() {
            this.REMOVE_DRAGGABLE_OBJECT(this.$store.state.common.selectedObject.uuidSrc)

            this.isShowDraggableRect = false
        },
        playAudio() {
            const selectedObjectJson = this.$store.state.common.selectedObject

            this.SET_PLAYING_AUDIO_SOURCE(selectedObjectJson.mediaSrc)
            this.SET_IS_SHOW_PLAYER_AUDIO(true)
        },
        viewUrl() {
            const selectedObjectJson = this.$store.state.common.selectedObject

            this.isShowUrlViewer = true
            this.urlVierweSrc = selectedObjectJson.mediaSrc
        }
    }
}
</script>
<style lang="scss" scoped></style>
