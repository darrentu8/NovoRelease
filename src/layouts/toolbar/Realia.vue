<template>
    <q-btn v-show="!isSelectedRealia" @click="clickRealia" :class="{ 'is-tool-selected': isSelectedRealia }">
        <svg class="icon" style="font-size:26px" aria-hidden="true">
            <use xlink:href="#icon-pencil1"></use>
        </svg>
    </q-btn>
    <q-btn-dropdown v-show="isSelectedRealia" menu-self="top middle" :menu-offset="[0, 20]" split @click="clickRealia"
        :class="{ 'is-tool-selected': isSelectedRealia }">
        <template v-slot:label>
            <svg class="icon" style="font-size:26px" aria-hidden="true">
                <use xlink:href="#icon-pencil1"></use>
            </svg>
        </template>
        <div class="q-pa-md" style="max-width:500px">
            <div class="text-subtitle1 q-pb-sm">Realia Tools </div>
            <div class="row">
                <div class="q-gutter-sm q-pr-md" style="margin:5px auto">
                    <q-checkbox v-model="ruler" @update:model-value="addOrRemoveRuler">
                        <q-img :src="rulerSrc" fit="contain" style="height: 150px; width: 200px" />
                    </q-checkbox>
                </div>
                <div class="q-gutter-sm q-pr-md" style="margin:5px auto">
                    <q-checkbox v-model="compass" @update:model-value="addOrRemoveCompass">
                        <q-img :src="compassSrc" fit="contain" style="height: 150px; width: 80px;" />
                    </q-checkbox>
                </div>
                <div class="q-gutter-sm q-pr-md" style="margin:5px auto">
                    <q-checkbox v-model="protractor" @update:model-value="addOrRemoveProtractor">
                        <q-img :src="protractorSrc" fit="contain" style="height: 150px; width: 140px;" />
                    </q-checkbox>
                </div>

                <div class="q-gutter-sm q-pr-md" style="margin:5px auto">
                    <q-checkbox v-model="triangle" @update:model-value="addOrRemoveTriangle">
                        <q-img :src="triangleSrc" fit="contain" style="height: 150px; width: 140px;" />
                    </q-checkbox>
                </div>
            </div>
        </div>
    </q-btn-dropdown>
</template>

<script>
import { toolType } from '../../helper/enum'
import { initRealia, unInitRealia } from '../../js/realia/realia'
import { initRuler, unInitRuler } from '../../js/realia/ruler'
import { initProtractor, unInitProtractor } from '../../js/realia/protractor'
import { initCompass, unInitCompass } from '../../js/realia/compass'
import { initTriangle, unInitTriangle } from '../../js/realia/triangle'

import { mapMutations } from 'vuex'

export default {
    name: 'ToolBar-Realia',
    mounted() {
        this.$bus.on('reInitRealia', this.reInitRealia)
    },
    data() {
        return {
            ruler: false,
            rulerSrc: require('../../assets/images/ruler.png'),
            protractor: false,
            protractorSrc: require('../../assets/images/protractor.png'),
            compass: false,
            compassSrc: require('../../assets/images/compass_full.jpg'),
            triangle: false,
            triangleSrc: require('../../assets/images/triangle-board.png')
        }
    },
    computed: {
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
                unInitRealia()
            }
        },
        page(val) {
            this.reInitRealia()
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickRealia() {
            this.SET_SELECTED_TOOL(toolType.REALIA)
            initRealia()
        },
        reInitRealia() {
            if (this.ruler) {
                initRuler()
            }
            if (this.protractor) {
                initProtractor()
            }
            if (this.compass) {
                initCompass()
            }
            if (this.triangle) {
                initTriangle()
            }
        },
        addOrRemoveRuler(val) {
            if (val) {
                initRuler()
            } else {
                unInitRuler()
            }
        },
        addOrRemoveProtractor(val) {
            if (val) {
                initProtractor()
            } else {
                unInitProtractor()
            }
        },
        addOrRemoveCompass(val) {
            if (val) {
                initCompass()
            } else {
                unInitCompass()
            }
        },
        addOrRemoveTriangle(val) {
            if (val) {
                initTriangle()
            } else {
                unInitTriangle()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
