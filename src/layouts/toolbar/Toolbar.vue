<template>
    <div class="row no-wrap" style="position: absolute;bottom: 10px; left: 50%;  transform: translate(-50%,0);">
        <q-btn-group rounded style="background-color:#ffffffba">
            <ColorSize />
            <Pen />
            <Shape />
            <Eraser />
            <Text />
            <Realia />
            <Choose />
        </q-btn-group>

        <div style="width:25px;height:48px" />

        <q-btn-group rounded style="background-color:#ffffffba">
            <UndoRedo />
        </q-btn-group>
    </div>
</template>

<script>
import ColorSize from './ColorSize'
import Pen from './Pen'
import Eraser from './Eraser'
import Shape from './Shape'
import Text from './Text'
import Choose from './Choose'
import Realia from './Realia'

import UndoRedo from './UndoRedo'

export default {
    name: 'ToolBar',
    components: {
        ColorSize,
        Pen,
        Eraser,
        Shape,
        Text,
        Choose,
        Realia,
        UndoRedo
    },
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>
<style lang="scss" >
.is-tool-selected {
    background-color: #ceedfbba
}
</style>
