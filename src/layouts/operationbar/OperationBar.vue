<template>
    <div id="opr_bar" v-show="isShow" class="row shadow-2 rounded-borders items-center text-center bg-white absolute"
        style="transform:translate(-50%,-50%);height:40px;z-index: 999;"
        :style="{  left: `${posX}px`, top: `${posY}px` }">
        <q-btn-group class="fit">
            <OperationText />
            <OperationStrokefill />
            <OperationMedia />
            <OperationCommon />
            <OperationInfo />
        </q-btn-group>
    </div>
</template>

<script>
import { dom } from 'quasar'

import OperationInfo from './Operation-Info'
import OperationText from './Operation-Text'
import OperationStrokefill from './Operation-Strokefill'
import OperationMedia from './Operation-Media'
import OperationCommon from './Operation-Common'

const { width } = dom

export default {
    name: 'OperationBar',
    components: {
        OperationInfo,
        OperationText,
        OperationStrokefill,
        OperationMedia,
        OperationCommon
    },
    mounted() {
        this.$bus.on('setShowOprBar', this.setShowOprBar)
        this.$bus.on('setOprBarPos', this.setOprBarPos)
    },
    beforeUnmount() {
        this.$bus.off('setShowOprBar', this.setShowOprBar)
        this.$bus.off('setOprBarPos', this.setOprBarPos)
    },
    data() {
        return {
            isShow: false,
            pos: { x: 0, y: 0 }
        }
    },
    computed: {
        posX() {
            const x = this.pos.x

            let domWidth = 0
            const windowWidth = window.innerWidth
            const dom = document.getElementById('opr_bar')
            if (dom) {
                domWidth = width(dom)
            }

            if (x < (domWidth / 2 + 20)) {
                return (domWidth / 2 + 20)
            } else if (x > windowWidth - (domWidth / 2 + 20)) {
                return windowWidth - (domWidth / 2 + 20)
            }

            return x
        },
        posY() {
            const y = this.pos.y - 80
            return y < 20 ? 20 : y
        }
    },
    methods: {
        setShowOprBar(val) {
            this.isShow = val
        },
        setOprBarPos(pos) {
            this.pos.x = pos.x
            this.pos.y = pos.y
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
