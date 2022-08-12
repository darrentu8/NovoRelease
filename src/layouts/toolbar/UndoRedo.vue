<template>
    <q-btn icon="undo" text-color="primary" @click="undo" />
    <q-btn icon="redo" text-color="primary" @click="redo" />
</template>

<script>

import { setUndoCanvas, setRedoCanvas } from '../../js/canvas'

export default {
    name: 'ToolBar-UndoRedo',
    data() {
        return {

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
