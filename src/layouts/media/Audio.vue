<template>
    <div class="absolute row" style="width: 600px;height: 50px;left: 50%;transform: translate(-50%, 0px);top: 10px;"
        v-show="isShow">
        <div class="col" style="margin:auto;height:40px">
            <q-media-player class="fit" type="audio" dense :muted="false" :autoplay="true" :source="source"
                radius="10px" cross-origin="anonymous" />
        </div>
        <div class="row" style="width:50px">
            <q-btn @click="closeAudio" style="margin:auto" color="black" size="12px" dense round icon="close" />
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'Player-Audio',
    data() {
        return {

        }
    },
    computed: {
        isShow() {
            return this.$store.state.common.isShowPlayerAudio
        },
        source() {
            return this.$store.state.common.playingAudioSource
        }
    },
    methods: {
        ...mapMutations('common', ['SET_IS_SHOW_PLAYER_AUDIO', 'SET_PLAYING_AUDIO_SOURCE']),
        closeAudio() {
            this.SET_IS_SHOW_PLAYER_AUDIO(false)
            this.SET_PLAYING_AUDIO_SOURCE('')
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
