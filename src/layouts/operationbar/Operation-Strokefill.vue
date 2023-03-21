<template>
    <q-btn v-show="isShow" style="width:50px">
        <q-avatar class="shadow-2" size="22px" :style="{ 'background-color': strokeColor }" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none" @show="showMenu">
            <div class="q-pa-xs q-pl-md q-pr-md" style="max-width:600px">
                <div class="row">
                    <div class="col">
                        <div class="text-body1 q-pb-xs q-pt-xs text-bold">Stroke </div>
                        <div id="strokefill-stroke">
                            <ColorPicker size="sm" v-model:colors="strokeColors" v-model:selectedColor="strokeColor"
                                v-model:opacity="strokeOpacity" @changeColor="changeStrokeColor"
                                @changeOpacity="changeStrokeOpacity" />
                            <SizePicker :min="2" :max="80" v-model:size="strokeSize" :color="strokeColor"
                                @changeSize="changeStrokeSize" />
                            <StrokeType v-model:strokeType="strokeType" @changeType="changeStrokeType"
                                :color="strokeColor" />
                        </div>
                    </div>
                    <q-separator class="q-ma-md" vertical inset />
                    <div class="col">
                        <div class="text-subtitle1 q-pb-sm q-pt-sm text-bold">Fill </div>
                        <div id="strokefill-fill">
                            <ColorPicker size="sm" v-model:colors="fillColors" v-model:selectedColor="fillColor"
                                v-model:opacity="fillOpacity" @changeColor="changeFillColor"
                                @changeOpacity="changeFillOpacity" />
                        </div>
                    </div>
                </div>
            </div>
        </q-menu>
    </q-btn>
    <q-separator v-show="isShow" vertical inset />
</template>

<script>
import { strokeType } from 'src/helper/enum'
import {
    canvasBrush, setActiveObjectStrokeColor, setActiveObjectStrokeSize,
    setActiveObjectStrokeType, setActiveObjectFillColor
} from 'src/js/canvas'
import { combineColorHexWithOpacity } from '../../helper/util'

import ColorPicker from '../../components/ColorPicker'
import SizePicker from '../../components/SizePicker'
import StrokeType from '../../components/StrokeType'

export default {
    name: 'Operation-Strokefill',
    props: ['strokeColorCalc', 'fillColorCalc'],
    components: {
        ColorPicker,
        SizePicker,
        StrokeType
    },
    mounted() {
        this.$bus.on('setOprBarStrokeColor', this.setOprBarStrokeColor)
        this.$bus.on('setOprBarStrokeOpacity', this.setOprBarStrokeOpacity)
        this.$bus.on('setOprBarStrokeSize', this.setOprBarStrokeSize)

        this.$bus.on('setOprBarFillColor', this.setOprBarFillColor)
        this.$bus.on('setOprBarFillOpacity', this.setOprBarFillOpacity)
    },
    beforeUnmount() {
        this.$bus.off('setOprBarStrokeColor', this.setOprBarStrokeColor)
        this.$bus.off('setOprBarStrokeOpacity', this.setOprBarStrokeOpacity)
        this.$bus.off('setOprBarStrokeSize', this.setOprBarStrokeSize)

        this.$bus.off('setOprBarFillColor', this.setOprBarFillColor)
        this.$bus.off('setOprBarFillOpacity', this.setOprBarFillOpacity)
    },
    data() {
        return {
            strokeColor: '#3A87FD',
            strokeColors: ['#3A87FD', '#B18CFE', '#44B94A', '#F88F2D', '#656170', '#D8C9FE', '#544775',
                '#FFAB01', '#FF8C82', '#EE719E', '#4D22B2', '#FF4015', '#FE6250'],
            strokeOpacity: canvasBrush.strokeOpacity,
            strokeSize: canvasBrush.strokeSize,
            strokeType: strokeType.SOLID,
            fillColor: '#3A87FD',
            fillOpacity: canvasBrush.fillOpacity,
            fillColors: ['#3A87FD', '#B18CFE', '#44B94A', '#F88F2D', '#656170', '#D8C9FE', '#544775',
                '#FFAB01', '#FF8C82', '#EE719E', '#4D22B2', '#FF4015', '#FE6250']
        }
    },
    computed: {
        isShow() {
            if (!this.$store.state.common.selectedObject) {
                return false
            }
            return this.$store.state.common.selectedObject.type !== 'image'
        }
    },
    methods: {
        showMenu() {
            this.setStrokeSliderColor()
            this.setFillSliderColor()
        },
        setStrokeSliderColor() {
            const thumbs = document.querySelectorAll('#strokefill-stroke .q-slider__thumb')
            thumbs.forEach(ele => {
                const styles = ele.getAttribute('style')
                ele.setAttribute('style', styles + `color:${this.strokeColor} !important;`)
            })

            const selections = document.querySelectorAll('#strokefill-stroke .q-slider__selection')
            selections.forEach(ele => {
                const styles = ele.getAttribute('style')
                ele.setAttribute('style', styles + `color:${this.strokeColor} !important;`)
            })
        },
        setFillSliderColor() {
            const thumbs = document.querySelectorAll('#strokefill-fill .q-slider__thumb')
            thumbs.forEach(ele => {
                const styles = ele.getAttribute('style')
                ele.setAttribute('style', styles + `color:${this.fillColor} !important;`)
            })
        },
        setOprBarStrokeColor(color) {
            this.strokeColor = color
        },
        setOprBarStrokeOpacity(opacity) {
            this.strokeOpacity = opacity
        },
        setOprBarStrokeSize(size) {
            this.strokeSize = size
        },
        setOprBarFillColor(color) {
            this.fillColor = color
        },
        setOprBarFillOpacity(opacity) {
            this.fillOpacity = opacity
        },
        changeStrokeColor(color) {
            this.strokeColor = color
            const strokeColorCalc = combineColorHexWithOpacity(this.strokeColor, this.strokeOpacity)
            setActiveObjectStrokeColor(strokeColorCalc)

            this.setStrokeSliderColor()
        },
        changeStrokeOpacity(opacity) {
            this.strokeOpacity = opacity
            const strokeColorCalc = combineColorHexWithOpacity(this.strokeColor, this.strokeOpacity)
            setActiveObjectStrokeColor(strokeColorCalc)
        },
        changeStrokeSize(size) {
            setActiveObjectStrokeSize(size)
        },
        changeStrokeType(type) {
            setActiveObjectStrokeType(type)
        },
        changeFillColor(color) {
            this.fillColor = color
            this.fillOpacity = 100
            const fillColorCalc = combineColorHexWithOpacity(this.fillColor, this.fillOpacity)
            setActiveObjectFillColor(fillColorCalc)

            this.setFillSliderColor()
        },
        changeFillOpacity(opacity) {
            this.fillOpacity = opacity
            const fillColorCalc = combineColorHexWithOpacity(this.fillColor, this.fillOpacity)
            setActiveObjectFillColor(fillColorCalc)
        }

    }
}
</script>
<style lang="scss" scoped>

</style>
