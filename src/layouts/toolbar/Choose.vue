<template>
    <q-btn class="overflow-hidden" style="width:50px" @click="clickChoose"
        :class="{ 'is-tool-selected': isSelectedChoose }">
        <img :class="{ 'is-active-icon-green': isSelectedChoose }" style="height:26px;width:26px" :src="iconChoose" />
    </q-btn>
</template>

<script>
import { toolType } from '../../helper/enum'
import { activeChoose, inactiveChoose } from '../../js/toolbar/choose'

import { mapMutations } from 'vuex'

export default {
    name: 'ToolBar-Choose',
    data() {
        return {
            iconChoose: require('../../assets/icons/icon_cursor.svg'),
            iconMove: require('../../assets/icons/icon_move.svg')
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
                inactiveChoose()
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickChoose() {
            activeChoose()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
