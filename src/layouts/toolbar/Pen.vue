<template>
    <q-btn @click="clickPen" :class="{ 'is-tool-selected': isSelectedPen }" v-show="!isSelectedPen">
        <svg class="icon" style="font-size:26px" aria-hidden="true" v-if="isPen">
            <use xlink:href="#icon-pencil"></use>
        </svg>
        <svg class="icon" style="font-size:26px" aria-hidden="true" v-if="isMarker">
            <use xlink:href="#icon-marker"></use>
        </svg>
    </q-btn>
    <q-btn-dropdown menu-self="top middle" :menu-offset="[0, 20]" v-show="isSelectedPen" split @click="clickPen"
        :class="{ 'is-tool-selected': isSelectedPen }">
        <template v-slot:label>
            <svg class="icon" style="font-size:26px" aria-hidden="true" v-if="isPen">
                <use xlink:href="#icon-pencil"></use>
            </svg>
            <svg class="icon" style="font-size:26px" aria-hidden="true" v-if="isMarker">
                <use xlink:href="#icon-marker"></use>
            </svg>
        </template>
        <div class="q-pa-md" style="max-width:300px">
            <div class="text-subtitle1 q-pb-sm">Pen Tool</div>
            <div class="q-gutter-sm q-pa-md">
                <q-btn flat round :ripple="false" size="md" :class="{ 'is-selected': penType === 'pen' }"
                    @click="changePenTyle('pen')">
                    <svg class="icon" style="font-size:26px" aria-hidden="true">
                        <use xlink:href="#icon-pencil"></use>
                    </svg>
                </q-btn>
                <q-btn flat round :ripple="false" size="md" :class="{ 'is-selected': penType === 'marker' }"
                    @click="changePenTyle('marker')">
                    <svg class="icon" style="font-size:26px" aria-hidden="true">
                        <use xlink:href="#icon-marker"></use>
                    </svg>
                </q-btn>
            </div>
        </div>
    </q-btn-dropdown>
</template>

<script>
import { mapMutations } from 'vuex'

import { toolType } from '../../helper/enum'
import { initPen, unInitPen } from '../../js/pen'
import { canvasBrush } from '../../js/canvas'

export default {
    name: 'ToolBar-Pen',
    data() {
        return {
            penIcon: require('../../assets/icons/pen.svg'),
            penType: 'pen',
            normalSize: canvasBrush.size
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
                unInitPen()
                this.$bus.emit('changeBrushSize', this.normalSize)
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickPen() {
            this.SET_SELECTED_TOOL(toolType.PEN)
            initPen(this.penType)
        },
        changePenTyle(penType) {
            this.penType = penType
            initPen(this.penType)
            if (this.isPen) {
                this.$bus.emit('changeBrushSize', this.normalSize)
            } else if (this.isMarker) {
                this.normalSize = canvasBrush.size
                this.$bus.emit('changeBrushSize', 30)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.is-selected {
    background-color: #dbf2fc;
}
</style>
