<template>
    <q-btn v-show="!isSelectedEraser" @click="clickEraser" :class="{ 'is-tool-selected': isSelectedEraser }">
        <svg class="icon" style="font-size:26px" aria-hidden="true">
            <use xlink:href="#icon-eraser"></use>
        </svg>
    </q-btn>
    <q-btn-dropdown menu-self="top middle" :menu-offset="[0, 20]" v-show="isSelectedEraser" split @click="clickEraser"
        :class="{ 'is-tool-selected': isSelectedEraser }">
        <template v-slot:label>
            <svg class="icon" style="font-size:26px" aria-hidden="true">
                <use xlink:href="#icon-eraser"></use>
            </svg>
        </template>
        <div class="q-pa-md" style="max-width:300px">
            <div class="text-subtitle1 q-pb-sm">Eraser Tool </div>
            <div class="q-gutter-sm q-pa-md">
                <q-btn flat label="Clear Text" @click="clickClearText" />
            </div>
            <div class="q-gutter-sm q-pa-md">
                <q-btn flat label="Clear Object" @click="clickClearObject" />
            </div>
            <div class="q-gutter-sm q-pa-md">
                <q-btn flat label="Clear All" @click="clickClearAll" />
            </div>
        </div>
    </q-btn-dropdown>
</template>

<script>
import { toolType } from '../../helper/enum'
import { initEraser, unInitEraser } from '../../js/eraser'
import { clearCanvas, clearCanvasText, clearCanvasObject } from '../../js/canvas'
import { mapMutations } from 'vuex'

export default {
    name: 'ToolBar-Eraser',
    data() {
        return {

        }
    },
    computed: {
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedEraser() {
            return this.selectedTool === toolType.ERASER
        }

    },
    watch: {
        selectedTool(newVal, oldVal) {
            if (oldVal === toolType.ERASER) {
                unInitEraser()
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickEraser() {
            this.SET_SELECTED_TOOL(toolType.ERASER)
            initEraser()
        },
        clickClearText() {
            clearCanvasText()
        },
        clickClearObject() {
            clearCanvasObject()
        },
        clickClearAll() {
            clearCanvas()
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
