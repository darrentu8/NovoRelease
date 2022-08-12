<template>
    <q-btn v-show="!isSelectedShape" @click="clickShape" :class="{ 'is-tool-selected': isSelectedShape }">
        <svg class="icon" style="font-size:26px" aria-hidden="true">
            <use xlink:href="#icon-shapes"></use>
        </svg>
    </q-btn>
    <q-btn-dropdown v-show="isSelectedShape" menu-self="top middle" :menu-offset="[0, 20]" split @click="clickShape"
        :class="{ 'is-tool-selected': isSelectedShape }">
        <template v-slot:label>
            <svg class="icon" style="font-size:26px" aria-hidden="true">
                <use xlink:href="#icon-shapes"></use>
            </svg>
        </template>
        <div class="q-pa-md" style="max-width:300px">
            <div class="text-subtitle1 q-pb-sm">Shape Type </div>
            <div class="q-gutter-sm q-pa-md">
                <q-btn v-for="item in shapeOptions" :key="item.value" flat round :ripple="false" size="md"
                    :class="{ 'is-selected': shapeType === item.value }" :icon="item.icon"
                    @click="changeShapeType(item.value)" />

            </div>
        </div>
    </q-btn-dropdown>
</template>

<script>
import { toolType, shapeType } from '../../helper/enum'
import { initShape, unInitShape, setShapeType } from '../../js/shape'

import { mapMutations } from 'vuex'

export default {
    name: 'ToolBar-Shape',
    data() {
        return {
            shapeType: shapeType.LINE,
            shapeOptions: [
                { icon: 'remove', value: shapeType.LINE },
                { icon: 'radio_button_unchecked', value: shapeType.CIRCLE },
                { icon: 'check_box_outline_blank', value: shapeType.RECT },
                { icon: 'change_history', value: shapeType.TRIANGLE }
            ]
        }
    },
    computed: {
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedShape() {
            return this.selectedTool === toolType.SHAPE
        }
    },
    watch: {
        selectedTool(newVal, oldVal) {
            if (oldVal === toolType.SHAPE) {
                unInitShape()
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickShape() {
            this.SET_SELECTED_TOOL(toolType.SHAPE)
            initShape()
        },
        changeShapeType(val) {
            this.shapeType = val
            setShapeType(val)
        }
    }
}
</script>
<style lang="scss" scoped>
.is-selected {
    background-color: #dbf2fc;
}
</style>
