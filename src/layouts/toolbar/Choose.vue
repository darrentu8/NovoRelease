<template>
    <q-btn @click="clickChoose" :class="{ 'is-tool-selected': isSelectedChoose }">
        <svg class="icon" style="font-size:26px" aria-hidden="true">
            <use xlink:href="#icon-select"></use>
        </svg>
    </q-btn>
</template>

<script>
import { toolType } from '../../helper/enum'
import { initChoose, unInitChoose } from '../../js/choose'

import { mapMutations } from 'vuex'

export default {
    name: 'ToolBar-Choose',
    data() {
        return {

        }
    },
    computed: {
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedChoose() {
            return this.selectedTool === toolType.CHOOSE
        }

    },
    watch: {
        selectedTool(newVal, oldVal) {
            if (oldVal === toolType.CHOOSE) {
                unInitChoose()
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickChoose() {
            this.SET_SELECTED_TOOL(toolType.CHOOSE)
            initChoose()
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
