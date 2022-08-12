<template>
    <q-btn-group id="opr_bar" v-show="isShow" outline style="position: absolute;transform:translate(-50%,-50%);"
        :style="{ left: `${posX}px`, top: `${posY}px` }">
        <q-btn-dropdown v-show="isText" menu-self="top right" :menu-offset="[0, 20]" icon="title" color="primary">
            <div class="q-pa-md" style="max-width:300px">
                <div class="text-subtitle1 q-pb-sm">Font Style </div>
                <div class="row q-gutter-sm">
                    <q-btn round :ripple="false" @click="changeTextStyle('fontWeight', 'bold')" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="format_bold" />
                    <q-btn round :ripple="false" @click="changeTextStyle('fontStyle', 'italic')" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="format_italic" />
                    <q-btn round :ripple="false" @click="changeTextStyle('underline', true)" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="format_underlined" />
                    <q-btn round :ripple="false" @click="changeTextStyle('overline', true)" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="format_overline" />
                    <q-btn round :ripple="false" @click="changeTextStyle('linethrough', true)" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="format_strikethrough" />
                    <q-btn round :ripple="false" @click="changeTextStyle('subscript')" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="subscript" />
                    <q-btn round :ripple="false" @click="changeTextStyle('superscript')" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="superscript" />
                    <q-btn round :ripple="false" @click="clearTextStyle()" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'red'" icon="format_clear" />
                </div>
                <div class="text-subtitle1 q-pb-sm q-pt-sm">Font Align </div>
                <div class="row q-gutter-sm">
                    <q-btn round @click="changeTextAlign('left')" :ripple="false" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="format_align_left" />
                    <q-btn round @click="changeTextAlign('center')" :ripple="false" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="format_align_center" />
                    <q-btn round @click="changeTextAlign('right')" :ripple="false" size="md"
                        :style="{ 'background-color': 'white' }" :text-color="'black'" icon="format_align_right" />
                </div>
            </div>
        </q-btn-dropdown>
        <q-btn-dropdown v-show="!isRealia" menu-self="top right" :menu-offset="[0, 20]" icon="bubble_chart"
            color="primary" @show="showColorSize">
            <div class="q-pa-md" style="max-width:300px">
                <div class="text-subtitle1 q-pb-sm">Brush Color </div>
                <ColorPicker size="md" v-model:colors="brushColors" v-model:selectedColor="brushColor"
                    @changeColor="changeColor" />
                <div class="text-subtitle1 q-pb-sm q-pt-sm">Brush Size </div>
                <SizePicker :min="2" :max="40" v-model:brushSize="brushSize" :brushColor="brushColor"
                    @changeSize="changeSize" />
            </div>
        </q-btn-dropdown>
        <q-btn v-show="!isRealia" color="primary" icon="filter_none" @click="clickCopy" />
        <q-btn v-show="!isRealia" color="primary" icon="vertical_align_top" @click="clickUp" />
        <q-btn v-show="!isRealia" color="primary" icon="vertical_align_bottom" @click="clickDown" />
        <q-btn v-show="!isRealia && !isSelection" :color="isLocked ? 'red-4' : 'primary'"
            :icon="isLocked ? 'lock' : 'lock_open'" @click="clickLock" />
        <q-btn v-show="!isRealia" color="negative" icon="close" @click="clickClose" />
    </q-btn-group>
</template>

<script>
import { dom } from 'quasar'

import ColorPicker from '../components/ColorPicker'
import SizePicker from '../components/SizePicker'

import { setOprBarColorSize } from '../js/operationBar.js'

import {
    setActiveObjectClose, setActiveObjectBringToFront,
    setActiveObjectSendToBack, setActiveObjectCopy, setActiveObjectLock,
    setActiveObjectColor, setActiveObjectSize
} from '../js/canvas'
import { setActiveTextAlign, setActiveTextStyle, clearActiveTextStyle } from '../js/text'

const { width } = dom

export default {
    name: 'OperationBar',
    components: {
        ColorPicker,
        SizePicker
    },
    mounted() {
        this.$bus.on('setOprBarBrushColor', this.setOprBarBrushColor)
        this.$bus.on('setOprBarBrushSize', this.setOprBarBrushSize)
        this.$bus.on('setOprBarIsRealia', this.setOprBarIsRealia)
        this.$bus.on('setOprBarIsText', this.setOprBarIsText)
        this.$bus.on('setOprBarIsSelection', this.setOprBarIsSelection)

        this.$bus.on('setOprBarIsLocked', this.setOprBarIsLocked)
    },
    data() {
        return {
            isRealia: false,
            isText: false,
            isSelection: false,
            isLocked: false,
            brushColor: '#000000',
            brushColors: ['#000000', '#ffffff', '#f44336', '#2196f3', '#ffeb3b', '#795548', '#4caf50', '#aeaeae', '#456321'],
            brushSize: 4
        }
    },
    computed: {
        isShow() {
            return this.$store.state.common.showOprBar
        },
        pos() {
            return this.$store.state.common.oprBarPos
        },
        posX() {
            const x = this.pos.x

            let domWidth = 0
            const windowWidth = window.innerWidth
            const dom = document.getElementById('opr_bar')
            if (dom) {
                domWidth = width(dom)
            }

            if (x < (domWidth / 2 + 20)) {
                return (domWidth / 2 + 20)
            } else if (x > windowWidth - (domWidth / 2 + 20)) {
                return windowWidth - (domWidth / 2 + 20)
            }

            return x
        },
        posY() {
            const y = this.pos.y - 80
            return y < 20 ? 20 : y
        }
    },
    methods: {
        setOprBarBrushColor(color) {
            this.brushColor = color
        },
        setOprBarBrushSize(size) {
            this.brushSize = size
        },
        setOprBarIsRealia(isRealia) {
            this.isRealia = isRealia
        },
        setOprBarIsText(isText) {
            this.isText = isText
        },
        setOprBarIsSelection(isSelection) {
            this.isSelection = isSelection
        },
        setOprBarIsLocked(isLocked) {
            this.isLocked = isLocked
        },
        showColorSize() {
            setOprBarColorSize()
        },
        clickClose() {
            setActiveObjectClose()
        },
        clickUp() {
            setActiveObjectBringToFront()
        },
        clickDown() {
            setActiveObjectSendToBack()
        },
        clickCopy() {
            setActiveObjectCopy()
        },
        clickLock() {
            this.isLocked = !this.isLocked
            setActiveObjectLock(this.isLocked)
        },
        changeColor(color) {
            setActiveObjectColor(color)
        },
        changeSize(size) {
            setActiveObjectSize(size)
        },
        changeTextAlign(align) {
            setActiveTextAlign(align)
        },
        changeTextStyle(styleName, val) {
            setActiveTextStyle(styleName, val)
        },
        clearTextStyle() {
            clearActiveTextStyle()
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
