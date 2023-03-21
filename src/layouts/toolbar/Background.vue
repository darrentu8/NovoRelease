<template>
    <q-btn class="overflow-hidden" style="width:50px">
        <img style="height:26px;width:26px" :src="iconBackground" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none" @before-show="showMenu">
            <div class="q-pa-md" style="max-width:400px">
                <div class="text-body1 q-pb-xs q-pt-xs text-bold">Background </div>
                <ColorPicker size="sm" :noOpacity="true" v-model:colors="colors" v-model:selectedColor="selectedColor"
                    @changeColor="changeColor" :opacity="100" />
                <div class="q-pt-sm">Image</div>
                <div class="row q-gutter-xs">
                    <q-btn flat :ripple="false" class="q-pa-xs" @click="clearPattern">
                        <q-img class="rounded-borders" style="height: 60px; width: 80px;background:#efefef" />
                    </q-btn>
                    <q-btn v-for="( pattern, index ) in backgroundImages" :key="index" flat :ripple="false"
                        class="q-pa-xs" @click="changePattern(pattern.filepath, false)">
                        <q-img class="rounded-borders" fit="contain" :src="pattern.thumbnail"
                            style="height: 60px; width: 80px;background:#efefef" />
                    </q-btn>
                    <q-btn flat :ripple="false" class="q-pa-xs row">
                        <q-img class="rounded-borders" style="height: 60px; width: 80px;background:#efefef" />
                        <!-- <div class="row flex rounded-borders" style="height: 60px; width: 80px;background:#efefef">
                            <q-icon name="add" style="margin:auto" />
                        </div> -->
                        <q-icon class="absolute" name="add" style="margin:auto" />
                        <q-menu :offset="[100, 20]">
                            <q-uploader color="primary" @uploaded="backgroundUploaded"
                                label="Image File (for <30MB size)" accept="image/*" field-name="media"
                                :url="`webapi/project/${pid}/media`" style="max-width:300px;height:300px"
                                :max-file-size="1024 * 1024 * 30" auto-upload hide-upload-btn />
                        </q-menu>
                    </q-btn>
                </div>
            </div>
        </q-menu>
    </q-btn>
</template>

<script>

import ColorPicker from '../../components/ColorPicker'
import { setBackgroundPattern, clearBackgroundPattern, setBackgroundColor, canvas } from '../../js/canvas'

import { colors } from 'quasar'
import { isColorHexEqual } from 'src/helper/util'

const { luminosity } = colors

import { getBackgroundImages } from '../../api/whiteboard'

export default {
    name: 'Toolbar-Background',
    components: {
        ColorPicker
    },
    created() {
        getBackgroundImages().then(data => {
            this.backgroundImages = data
        })
    },
    data() {
        return {
            iconBackground: require('../../assets/icons/icon_background.svg'),
            selectedColor: '#F1F1F1',
            colors: ['#F1F1F1', '#B8BAC1', '#B0BFC1', '#CACABF', '#5E746C', '#273F2A', '#5F5F5F', '#303030']
        }
    },
    computed: {
        pid() {
            return this.$store.state.common.pid
        }
    },
    methods: {
        showMenu() {
            this.setPickerColor()
        },
        setPickerColor() {
            const backgroundColor = canvas.backgroundColor || '#F1F1F1'

            this.selectedColor = backgroundColor

            const index = this.colors.findIndex(o => isColorHexEqual(o, backgroundColor))
            if (index < 0) {
                this.colors[this.colors.length - 1] = this.selectedColor
            }
        },
        changeColor(color) {
            this.selectedColor = color
            setBackgroundColor(color)
        },
        getLuminosity(color) {
            return luminosity(color)
        },
        clearPattern() {
            clearBackgroundPattern()
        },
        changePattern(patternSrc, isRepeat) {
            setBackgroundPattern(patternSrc, isRepeat)
        },
        backgroundUploaded(info) {
            const respondData = JSON.parse(info.xhr.response)
            setBackgroundPattern(respondData.url, false)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
