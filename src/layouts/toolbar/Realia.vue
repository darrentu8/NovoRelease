<template>
    <q-btn @click="clickRealia" class="overflow-hidden" style="width:50px"
        :class="{ 'is-tool-selected': isSelectedRealia }">
        <img :class="{ 'is-active-icon-green': isSelectedRealia }" style="height:26px;width:26px" :src="iconRealia" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none">
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false"
                @click="changeRealia(realiaTypes.RULER)">
                <img :class="{ 'is-active-icon-green': realiaType === realiaTypes.RULER }"
                    style="height:24px;width:24px" :src="iconRuler" />
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false"
                @click="changeRealia(realiaTypes.TRIANGLE)">
                <img :class="{ 'is-active-icon-green': realiaType === realiaTypes.TRIANGLE }"
                    style="height:24px;width:24px" :src="iconTriangle" />
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false"
                @click="changeRealia(realiaTypes.COMPASS)">
                <img :class="{ 'is-active-icon-green': realiaType === realiaTypes.COMPASS }"
                    style="height:24px;width:24px" :src="iconCompass" />
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false"
                @click="changeRealia(realiaTypes.PROTRACTOR)">
                <img :class="{ 'is-active-icon-green': realiaType === realiaTypes.PROTRACTOR }" style="width:24px"
                    :src="iconProtractor" />
            </q-btn>
        </q-menu>
    </q-btn>
</template>

<script>
import { toolType, realiaType } from '../../helper/enum'
import { initRealia, isActive, inactiveRealia } from '../../js/realia/realia'
import { initRuler, inactiveRuler } from '../../js/realia/ruler'
import { initProtractor, inactiveProtractor } from '../../js/realia/protractor'
import { initCompass, inactiveCompass } from '../../js/realia/compass'
import { initTriangle, inactiveTriangle } from '../../js/realia/triangle'

import { mapMutations } from 'vuex'

export default {
    name: 'ToolBar-Realia',
    mounted() {
        this.$bus.on('reInitRealia', this.reInitRealia)
        this.$bus.on('removeRealia', this.removeRealia)
    },
    beforeUnmount() {
        this.$bus.off('reInitRealia', this.reInitRealia)
        this.$bus.off('removeRealia', this.removeRealia)
    },
    data() {
        return {
            realiaType: realiaType.RULER,
            realiaTypes: realiaType,
            iconCompass: require('../../assets/icons/icon_compass.svg'),
            iconProtractor: require('../../assets/icons/icon_protractor.svg'),
            iconRuler: require('../../assets/icons/icon_ruler.svg'),
            iconTriangle: require('../../assets/icons/icon_triangle_board.svg'),
            rulerSrc: require('../../assets/images/ruler.png'),
            protractorSrc: require('../../assets/images/protractor.png'),
            compassSrc: require('../../assets/images/compass_full.jpg'),
            triangleSrc: require('../../assets/images/triangle-board.png')
        }
    },
    computed: {
        iconRealia() {
            if (this.realiaType === realiaType.COMPASS) {
                return this.iconCompass
            } else if (this.realiaType === realiaType.PROTRACTOR) {
                return this.iconProtractor
            } else if (this.realiaType === realiaType.TRIANGLE) {
                return this.iconTriangle
            }

            return this.iconRuler
        },
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedRealia() {
            return this.selectedTool === toolType.REALIA
        },
        page() {
            return this.$store.state.common.page
        }
    },
    watch: {
        selectedTool(newVal, oldVal) {
            if (oldVal === toolType.REALIA) {
                inactiveRealia()
                this.removeRealia()
            }
        },
        page() {
            this.reInitRealia()
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickRealia() {
            if (this.selectedTool === toolType.REALIA) {
                return
            }
            this.SET_SELECTED_TOOL(toolType.REALIA)
            initRealia()
            this.changeRealia(this.realiaType)
        },
        reInitRealia() {
            if (!isActive) {
                return
            }
            if (this.realiaType === realiaType.RULER) {
                initRuler()
            }
            if (this.realiaType === realiaType.PROTRACTOR) {
                initProtractor()
            }
            if (this.realiaType === realiaType.COMPASS) {
                initCompass()
            }
            if (this.realiaType === realiaType.TRIANGLE) {
                initTriangle()
            }
        },
        removeRealia() {
            inactiveRuler()
            inactiveTriangle()
            inactiveProtractor()
            inactiveCompass()
        },
        changeRealia(val) {
            this.realiaType = val
            if (val === realiaType.RULER) {
                initRuler()
            } else {
                inactiveRuler()
            }
            if (val === realiaType.PROTRACTOR) {
                initProtractor()
            } else {
                inactiveProtractor()
            }
            if (val === realiaType.COMPASS) {
                initCompass()
            } else {
                inactiveCompass()
            }
            if (val === realiaType.TRIANGLE) {
                initTriangle()
            } else {
                inactiveTriangle()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.tool-bar-realia {
    left: 230px;
    bottom: 60px;
    background: white;
}
</style>
