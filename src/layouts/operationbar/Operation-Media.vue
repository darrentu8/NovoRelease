<template>
    <q-btn v-show="isVideo && !isPlayVideo" style="width:50px" color="brand-grey" flat icon="play_arrow"
        @click="playVideo" />
    <q-btn v-show="isVideo && isPlayVideo" style="width:50px" color="brand-grey" flat icon="stop" @click="stopVideo" />
    <q-btn v-show="isAudio" style="width:50px" color="brand-grey" flat icon="play_arrow" @click="playAudio" />
    <q-btn v-show="isUrl" style="width:50px" color="brand-grey" flat icon="visibility" @click="viewUrl" />
    <q-separator v-show="isVideo || isAudio || isUrl" vertical inset />

    <UrlViewer v-model:isShow="isShowUrlViewer" :urlSrc="urlSrc" />
</template>

<script>
import { mapMutations } from 'vuex'

import UrlViewer from '../media/UrlViewer'

export default {
    name: 'OperationBar-Media',
    components: {
        UrlViewer
    },
    data() {
        return {
            isPlayVideo: false,
            videoEle: null,
            isShowUrlViewer: false,
            urlSrc: ''
        }
    },
    computed: {
        isVideo() {
            if (!this.$store.state.common.selectedObject) {
                return false
            }
            return this.$store.state.common.selectedObject.type === 'image' && this.$store.state.common.selectedObject.isVideo
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
        }
    },
    methods: {
        ...mapMutations('common', ['SET_IS_SHOW_PLAYER_VIDEO', 'SET_PLAYING_VIDEO_SOURCE', 'SET_IS_SHOW_PLAYER_AUDIO', 'SET_PLAYING_AUDIO_SOURCE']),
        playVideo() {
            const selectedObjectJson = this.$store.state.common.selectedObject

            this.$bus.emit('initVideoRect')
            this.SET_PLAYING_VIDEO_SOURCE(selectedObjectJson.mediaSrc)
            this.SET_IS_SHOW_PLAYER_VIDEO(true)

            this.isPlayVideo = true
        },
        stopVideo() {
            this.SET_PLAYING_VIDEO_SOURCE('')
            this.SET_IS_SHOW_PLAYER_VIDEO(false)

            this.isPlayVideo = false
        },
        playAudio() {
            const selectedObjectJson = this.$store.state.common.selectedObject

            this.SET_PLAYING_AUDIO_SOURCE(selectedObjectJson.mediaSrc)
            this.SET_IS_SHOW_PLAYER_AUDIO(true)
        },
        viewUrl() {
            const selectedObjectJson = this.$store.state.common.selectedObject

            this.isShowUrlViewer = true
            this.urlSrc = selectedObjectJson.mediaSrc
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
