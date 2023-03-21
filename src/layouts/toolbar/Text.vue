<template>
    <q-btn class="overflow-hidden" style="width:50px" @click="clickText"
        :class="{ 'is-tool-selected': isSelectedText }">
        <img :class="{ 'is-active-icon-green': isSelectedText }" style="height:26px;width:26px" :src="iconText" />
    </q-btn>
</template>

<script>
import { mapMutations } from 'vuex'

import { toolType } from '../../helper/enum'
import { initText, inactiveText } from '../../js/toolbar/text'

export default {
    name: 'ToolBar-Text',

    data() {
        return {
            iconText: require('../../assets/icons/icon_text.svg')
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
                inactiveText()
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
