<template>
    <q-btn @click="clickText" :class="{ 'is-tool-selected': isSelectedText }">
        <svg class="icon" style="font-size:26px" aria-hidden="true">
            <use xlink:href="#icon-text"></use>
        </svg>
    </q-btn>
</template>

<script>
import { mapMutations } from 'vuex'

import { toolType } from '../../helper/enum'
import { initText, unInitText } from '../../js/text'

export default {
    name: 'ToolBar-Text',

    data() {
        return {

        }
    },
    computed: {
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedText() {
            return this.selectedTool === toolType.TEXT
        }
    },
    watch: {
        selectedTool(newVal, oldVal) {
            if (oldVal === toolType.TEXT) {
                unInitText()
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickText() {
            this.SET_SELECTED_TOOL(toolType.TEXT)
            initText()
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
