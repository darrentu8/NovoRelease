<template>
    <q-btn class="overflow-hidden" @click="clickEraser" style="width:50px"
        :class="{ 'is-tool-selected': isSelectedEraser }">
        <img :class="{ 'is-active-icon-green': isSelectedEraser }" style="height:26px;width:26px" :src="iconEraser" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none" :persistent="$q.platform.is.mobile"
            v-if="$q.platform.is.mobile ? isSelectedEraser : true" :auto-close="$q.platform.is.mobile">
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false" @click="clickClearText">
                <img style="height:24px;width:24px" :src="iconClearText" />
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false" @click="clickClearObject">
                <img style="height:24px;width:24px" :src="iconClearObject" />
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false" @click="clickClearAll">
                <img style="height:24px;width:24px" :src="iconClearAll" />
            </q-btn>
        </q-menu>
    </q-btn>
</template>

<script>
import { toolType } from '../../helper/enum'
import { initEraser, inactiveEraser } from '../../js/toolbar/eraser'
import { clearCanvas, clearCanvasText, clearCanvasObject } from '../../js/canvas'
import { mapMutations } from 'vuex'

export default {
    name: 'ToolBar-Eraser',
    data() {
        return {
            iconEraser: require('../../assets/icons/icon_eraser.svg'),
            iconClearText: require('../../assets/icons/icon_eraser_clear_text.svg'),
            iconClearObject: require('../../assets/icons/icon_eraser_clear_object.svg'),
            iconClearAll: require('../../assets/icons/icon_eraser_clear_all.svg')
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
                inactiveEraser()
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
.tool-bar-eraser {
    left: 205px;
    bottom: 60px;
    background: white;
}
</style>
