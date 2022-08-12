<template>
    <q-btn-dropdown menu-self="top middle" :menu-offset="[0, 20]">
        <template v-slot:label>
            <q-icon name="circle" style="font-size:12px;margin: 0 10px 0 0;" :style="{ color: brushColor }" />
            <svg class="icon" style="font-size:26px" aria-hidden="true">
                <use xlink:href="#icon-watercolor"></use>
            </svg>
        </template>
        <div class="q-pa-md" style="max-width:300px">
            <div class="text-subtitle1 q-pb-sm">Brush Color </div>
            <ColorPicker size="md" v-model:colors="brushColors" v-model:selectedColor="brushColor"
                @changeColor="changeColor" />
            <div class="text-subtitle1 q-pb-sm q-pt-sm">Brush Size </div>
            <SizePicker :min="2" :max="40" v-model:brushSize="brushSize" :brushColor="brushColor"
                @changeSize="changeSize" />
        </div>
    </q-btn-dropdown>
</template>

<script>
import ColorPicker from '../../components/ColorPicker'
import SizePicker from '../../components/SizePicker'
import { canvasBrush } from '../../js/canvas'
import { toolType } from '../../helper/enum'

import { setPenColor, setPenSize } from '../../js/pen'

export default {
    name: 'ToolBar-ColorSize',
    components: {
        ColorPicker,
        SizePicker
    },
    mounted() {
        this.$bus.on('changeBrushColor', this.changeBrushColor)
        this.$bus.on('changeBrushSize', this.changeBrushSize)
    },
    data() {
        return {
            brushColor: '#000000',
            brushColors: ['#000000', '#ffffff', '#f44336', '#2196f3', '#ffeb3b', '#795548', '#4caf50', '#aeaeae', '#456321'],
            brushSize: canvasBrush.size
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
        changeColor(color) {
            canvasBrush.color = color
            if (this.selectedTool === toolType.PEN) {
                setPenColor(color)
            }
        },
        changeSize(size) {
            canvasBrush.size = size
            if (this.selectedTool === toolType.PEN) {
                setPenSize(size)
            }
        },
        changeBrushColor(color) {
            this.brushColor = color
            this.changeColor(color)
        },
        changeBrushSize(size) {
            this.brushSize = size
            this.changeSize(size)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
