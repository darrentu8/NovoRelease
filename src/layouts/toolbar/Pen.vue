<template>
    <q-btn @click="clickPen" class="overflow-hidden" style="width:50px" :class="{ 'is-tool-selected': isSelectedPen }">
        <img :class="{ 'is-active-icon-green': isSelectedPen }" style="height:26px;width:26px" :src="iconPencil"
            v-if="isPen" />
        <img :class="{ 'is-active-icon-green': isSelectedPen }" style="height:26px;width:26px" :src="iconMarker"
            v-if="isMarker" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none" :persistent="$q.platform.is.mobile"
            v-if="$q.platform.is.mobile ? isSelectedPen : true" :auto-close="$q.platform.is.mobile">
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false" @click="changePenType('pen')">
                <img :class="{ 'is-active-icon-green': penType === 'pen' }" style="height:24px;width:24px"
                    :src="iconPencil" />
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false"
                @click="changePenType('marker')">
                <img :class="{ 'is-active-icon-green': penType === 'marker' }" style="height:24px;width:24px"
                    :src="iconMarker" />
            </q-btn>
        </q-menu>
    </q-btn>
</template>

<script>
import { mapMutations } from 'vuex'

import { toolType } from '../../helper/enum'
import { initPen, inactivePen } from '../../js/toolbar/pen'
import { canvasBrush } from '../../js/canvas'

export default {
    name: 'ToolBar-Pen',
    data() {
        return {
            iconPencil: require('../../assets/icons/icon_pencil.svg'),
            iconMarker: require('../../assets/icons/icon_marker.svg'),
            penType: 'pen',
            normalSize: canvasBrush.strokeSize
        }
    },
    computed: {
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedPen() {
            return this.selectedTool === toolType.PEN
        },
        isPen() {
            return this.penType === 'pen'
        },
        isMarker() {
            return this.penType === 'marker'
        }
    },
    watch: {
        selectedTool(newVal, oldVal) {
            if (oldVal === toolType.PEN) {
                inactivePen()
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickPen() {
            this.SET_SELECTED_TOOL(toolType.PEN)
            initPen(this.penType)
        },
        changePenType(penType) {
            this.penType = penType
            initPen(this.penType)
        }
    }
}
</script>
<style lang="scss" scoped>
.tool-bar-pen {
    left: 125px;
    bottom: 60px;
    background: white;
}
</style>
