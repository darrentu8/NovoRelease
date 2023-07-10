<template>
    <q-btn style="width:50px" color="brand-grey" flat icon="filter_none" @click="clickCopy" />
    <q-btn style="width:50px" color="brand-grey" flat icon="vertical_align_top" @click="clickUp" />
    <q-btn style="width:50px" color="brand-grey" flat icon="vertical_align_bottom" @click="clickDown" />
    <q-btn v-show="!isSelection" flat :color="isLocked ? 'red' : 'brand-grey'" :icon="isLocked ? 'lock' : 'lock_open'"
        @click="clickLock" />
    <q-btn style="width:50px" color="brand-grey" flat v-show="isSelection" @click="clickGroup"
        icon="dashboard_customize" />
    <q-btn style="width:50px" flat color="red" icon="delete_outline" @click="clickClose" />
</template>

<script>
import {
    setActiveObjectClose, setActiveObjectBringToFront,
    setActiveObjectSendToBack, setActiveObjectCopy, setActiveObjectLock,
    setActiveSelectionGroup
} from '../../js/canvas'

export default {
    name: 'OperationBar-Common',
    mounted() {
        this.$bus.on('setOprBarIsSelection', this.setOprBarIsSelection)
        this.$bus.on('setOprBarIsLocked', this.setOprBarIsLocked)
    },
    beforeUnmount() {
        this.$bus.off('setOprBarIsSelection', this.setOprBarIsSelection)
        this.$bus.off('setOprBarIsLocked', this.setOprBarIsLocked)
    },
    data() {
        return {
            isSelection: false,
            isLocked: false
        }
    },
    computed: {

    },
    methods: {
        setOprBarIsSelection(isSelection) {
            this.isSelection = isSelection
        },
        setOprBarIsLocked(isLocked) {
            this.isLocked = isLocked
        },
        clickClose() {
            setActiveObjectClose()
        },
        clickUp() {
            setActiveObjectBringToFront()
        },
        clickDown() {
            setActiveObjectSendToBack()
        },
        clickCopy() {
            setActiveObjectCopy()
        },
        clickLock() {
            this.isLocked = !this.isLocked
            setActiveObjectLock(this.isLocked)
        },
        clickGroup() {
            this.isSelection = false
            setActiveSelectionGroup()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
