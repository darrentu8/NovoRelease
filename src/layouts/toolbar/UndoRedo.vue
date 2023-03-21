<template>
    <q-btn class="overflow-hidden" style="width:50px" @click="undo">
        <img style="height:26px;width:26px" :src="iconUndo" />
    </q-btn>
    <q-btn class="overflow-hidden" style="width:50px" @click="redo">
        <img style="height:26px;width:26px" :src="iconRedo" />
    </q-btn>
</template>

<script>

import { setUndoCanvas, setRedoCanvas } from '../../js/canvas'

export default {
    name: 'ToolBar-UndoRedo',
    data() {
        return {
            iconUndo: require('../../assets/icons/icon_undo.svg'),
            iconRedo: require('../../assets/icons/icon_redo.svg')
        }
    },
    methods: {
        undo() {
            setUndoCanvas()
        },
        redo() {
            setRedoCanvas()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
