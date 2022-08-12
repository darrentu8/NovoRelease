<template>
    <q-btn-dropdown :menu-offset="[0, 20]" color="primary" icon="texture" flat>
        <div class="q-pa-md" style="max-width:450px">
            <div class="text-subtitle1 q-pa-sm">Background Color </div>
            <ColorPicker size="lg" v-model:colors="colors" v-model:selectedColor="selectedColor"
                @changeColor="changeColor" />
            <div class="text-subtitle1 q-pa-sm">Background Image </div>
            <div class="row q-gutter-xs">
                <q-btn v-for="(pattern, index) in backgroundImages" :key="index" :flat="curImage !== index"
                    :ripple="false" color="primary">
                    <q-img fit="contain" :src="pattern.src" style="height: 60px; width: 100px;background:#efefef"
                        @click="changePattern(pattern.srcBig, pattern.isRepeat, index)" />
                </q-btn>
            </div>
        </div>
    </q-btn-dropdown>
</template>

<script>
import ColorPicker from '../../components/ColorPicker'
import { setBackgroundPattern, setBackgroundColor } from '../../js/canvas'

import { colors } from 'quasar'

const { luminosity } = colors

export default {
    name: 'PanelBar-Background',
    components: {
        ColorPicker
    },
    data() {
        return {
            selectedColor: '#ffffff',
            colors: ['#ffffff', '#eeeff2', '#efe9ef', '#b8baca', '#13301a', '#161633', '#100b3f', '#060001', '#726d68', '#5c636d', '#b0bfc1'],
            curImage: -1,
            backgroundImages: [{
                srcBig: require('../../assets/background/BG01xxhdpi-01.png'),
                src: require('../../assets/background/B_1.png'),
                isRepeat: true
            }, {
                srcBig: require('../../assets/background/BG02xxhdpi.png'),
                src: require('../../assets/background/B_2.png'),
                isRepeat: true
            }, {
                srcBig: require('../../assets/background/BG03xxhdpi.png'),
                src: require('../../assets/background/B_3.png'),
                isRepeat: true
            }, {
                srcBig: require('../../assets/background/4.png'),
                src: require('../../assets/background/B_4.png'),
                isRepeat: true
            }, {
                srcBig: require('../../assets/background/5.png'),
                src: require('../../assets/background/B_5.png')
            }, {
                srcBig: require('../../assets/background/6.png'),
                src: require('../../assets/background/B_6.png')
            }, {
                srcBig: require('../../assets/background/7.png'),
                src: require('../../assets/background/B_7.png')
            }, {
                srcBig: require('../../assets/background/8.png'),
                src: require('../../assets/background/B_8.png')
            }, {
                srcBig: require('../../assets/background/9.png'),
                src: require('../../assets/background/B_9.png')
            }, {
                srcBig: require('../../assets/background/10.png'),
                src: require('../../assets/background/B_10.png')
            }, {
                srcBig: require('../../assets/background/11.png'),
                src: require('../../assets/background/B_11.png')
            }, {
                srcBig: require('../../assets/background/12.png'),
                src: require('../../assets/background/B_12.png')
            }, {
                srcBig: require('../../assets/background/13.png'),
                src: require('../../assets/background/B_13.png')
            }]
        }
    },
    methods: {
        changeColor(color) {
            this.selectedColor = color
            this.curImage = -1
            setBackgroundColor(color)
        },
        getLuminosity(color) {
            return luminosity(color)
        },
        changePattern(patternSrc, isRepeat, index) {
            this.selectedColor = 0
            this.curImage = index
            setBackgroundPattern(patternSrc, isRepeat)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
