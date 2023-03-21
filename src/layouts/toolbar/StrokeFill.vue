<template>
    <q-btn style="width:50px">
        <q-avatar class="shadow-2" size="22px" :style="{ 'background-color': strokeColor }" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none" @show="showMenu">
            <div class="q-pa-xs q-pl-md q-pr-md" style="max-width:300px">
                <div class="row">
                    <div class="col">
                        <div class="text-body1 q-pb-xs q-pt-xs text-bold">Stroke </div>
                        <div id="strokefill-stroke">
                            <ColorPicker size="sm" v-model:colors="strokeColors" v-model:selectedColor="strokeColor"
                                v-model:opacity="strokeOpacity" @changeColor="changeStrokeColor"
                                @changeOpacity="changeStrokeOpacity" />
                            <SizePicker :min="2" :max="40" v-model:size="strokeSize" :color="strokeColor"
                                @changeSize="changeStrokeSize" />
                            <StrokeType v-model:strokeType="strokeType" @changeType="changeStrokeType"
                                :color="strokeColor" />
                        </div>
                    </div>
                    <q-separator v-show="false" class="q-ma-md" vertical inset />
                    <div class="col" v-show="false">
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
</template>

<script>
import ColorPicker from '../../components/ColorPicker'
import SizePicker from '../../components/SizePicker'
import StrokeType from '../../components/StrokeType'

import { canvasBrush } from '../../js/canvas'
import { strokeType, toolType } from '../../helper/enum'
import { combineColorHexWithOpacity } from '../../helper/util'

import { setPenStroke } from '../../js/toolbar/pen'

export default {
    name: 'ToolBar-StrokeFill',
    components: {
        ColorPicker,
        SizePicker,
        StrokeType
    },
    mounted() {

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
        selectedTool() {
            return this.$store.state.common.selectedTool
        }
    },
    watch: {

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
        changeStrokeColor(color) {
            this.strokeColor = color
            canvasBrush.strokeColor = color

            const strokeColorCalc = combineColorHexWithOpacity(this.strokeColor, this.strokeOpacity)
            canvasBrush.strokeColorCalc = strokeColorCalc

            this.setStrokeSliderColor()

            if (this.selectedTool === toolType.PEN) {
                setPenStroke()
            }
        },
        changeStrokeOpacity(val) {
            this.strokeOpacity = val
            canvasBrush.strokeOpacity = val

            const strokeColorCalc = combineColorHexWithOpacity(this.strokeColor, this.strokeOpacity)
            canvasBrush.strokeColorCalc = strokeColorCalc

            if (this.selectedTool === toolType.PEN) {
                setPenStroke()
            }
        },
        changeStrokeSize(size) {
            this.strokeSize = size
            canvasBrush.strokeSize = size

            if (canvasBrush.strokeType === strokeType.SOLID) {
                canvasBrush.strokeDash = []
            } else if (canvasBrush.strokeType === strokeType.DASH) {
                canvasBrush.strokeDash = [canvasBrush.strokeSize * 2]
            } else if (canvasBrush.strokeType === strokeType.DASH_LONG) {
                canvasBrush.strokeDash = [canvasBrush.strokeSize * 5]
            }

            if (this.selectedTool === toolType.PEN) {
                setPenStroke()
            }
        },
        changeStrokeType(type) {
            this.strokeType = type
            canvasBrush.strokeType = type

            if (canvasBrush.strokeType === strokeType.SOLID) {
                canvasBrush.strokeDash = []
            } else if (canvasBrush.strokeType === strokeType.DASH) {
                canvasBrush.strokeDash = [canvasBrush.strokeSize * 2]
            } else if (canvasBrush.strokeType === strokeType.DASH_LONG) {
                canvasBrush.strokeDash = [canvasBrush.strokeSize * 5]
            }

            if (this.selectedTool === toolType.PEN) {
                setPenStroke()
            }
        },
        changeFillColor(color) {
            this.fillColor = color
            canvasBrush.fillColor = color

            const fillColorCalc = combineColorHexWithOpacity(this.fillColor, this.fillOpacity)
            canvasBrush.fillColorCalc = fillColorCalc

            this.setFillSliderColor()
        },
        changeFillOpacity(val) {
            this.fillOpacity = val
            canvasBrush.fillOpacity = val

            const fillColorCalc = combineColorHexWithOpacity(this.fillColor, this.fillOpacity)
            canvasBrush.fillColorCalc = fillColorCalc
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
