<template>
    <q-btn class="overflow-hidden" @click="clickShape" style="width:50px"
        :class="{ 'is-tool-selected': isSelectedShape }">
        <img :class="{ 'is-active-icon-green': isSelectedShape }" style="height:26px;width:26px"
            :src="selectedShape.icon" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none">
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" v-for="item in shapeOptions" :key="item.value" dense
                flat :ripple="false" @click="changeShapeType(item.value)">
                <img :class="{ 'is-active-icon-green': shapeType === item.value }" style="height:24px;width:24px"
                    :src="item.icon" />
            </q-btn>
        </q-menu>
    </q-btn>
</template>

<script>
import { toolType, shapeType } from '../../helper/enum'
import { initShape, inactiveShape, setShapeType } from '../../js/toolbar/shape'

import { mapMutations } from 'vuex'

export default {
    name: 'ToolBar-Shape',
    data() {
        return {
            shapeType: shapeType.LINE
        }
    },
    computed: {
        shapeOptions() {
            return [
                { icon: require('../../assets/icons/icon_line.svg'), value: shapeType.LINE },
                { icon: require('../../assets/icons/icon_circle.svg'), value: shapeType.CIRCLE },
                { icon: require('../../assets/icons/icon_square.svg'), value: shapeType.RECT },
                { icon: require('../../assets/icons/icon_triangle.svg'), value: shapeType.TRIANGLE }
            ]
        },
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedShape() {
            return this.selectedTool === toolType.SHAPE
        },
        selectedShape() {
            return this.shapeOptions.find(o => o.value === this.shapeType)
        }
    },
    watch: {
        selectedTool(newVal, oldVal) {
            if (oldVal === toolType.SHAPE) {
                inactiveShape()
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
.tool-bar-shape {
    left: 35px;
    bottom: 60px;
    background: white;
}
</style>
