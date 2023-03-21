<template>
    <q-btn class="overflow-hidden" style="width:50px" @click="clickMove"
        :class="{ 'is-tool-selected': isSelectedMove }">
        <img :class="{ 'is-active-icon-green': isSelectedMove }" style="height:26px;width:26px" :src="iconMove" />
    </q-btn>
</template>

<script>
import { toolType } from '../../helper/enum'

import { mapMutations } from 'vuex'
import { activeMove, inactiveMove } from 'src/js/toolbar/move'

export default {
    name: 'ToolBar-Move',
    data() {
        return {
            iconMove: require('../../assets/icons/icon_move.svg')
        }
    },
    computed: {
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedMove() {
            return this.selectedTool === toolType.MOVE
        }

    },
    watch: {
        selectedTool(newVal, oldVal) {
            if (oldVal === toolType.MOVE) {
                inactiveMove()
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickMove() {
            activeMove()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
