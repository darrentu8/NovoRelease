<template>
    <q-separator v-show="isShow" vertical inset />
    <q-btn style="width:50px" icon="info_outline" v-show="isShow">
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none" @before-show="show">
            <div class="q-pa-xs q-pl-md q-pr-md" style="max-width:500px">
                <div class="text-body1 q-pb-xs q-pt-xs">Owner: <span class="text-bold">{{ owner }}</span> </div>
                <div class="text-body1 q-pb-xs q-pt-xs">Last Modified User: <span class="text-bold">{{ lastModifiedUser
                }}</span>
                </div>
                <div class="text-body1 q-pb-xs q-pt-xs">Last Modified Time: <span class="text-bold">{{ lastModifiedTime
                }}</span></div>
            </div>
        </q-menu>
    </q-btn>
</template>

<script>
import { canvas } from '../../js/canvas'

export default {
    name: 'Operation-Info',
    data() {
        return {
            owner: '',
            lastModifiedUser: '',
            lastModifiedTime: ''
        }
    },
    computed: {
        isShow() {
            if (!this.$store.state.common.selectedObject) {
                return false
            }
            return this.$store.state.common.selectedObject.type !== 'activeSelection'
        }
    },
    methods: {
        show() {
            const selectedObject = canvas.getActiveObject()

            if (!selectedObject) {
                return
            }

            this.owner = selectedObject.ownerName
            this.lastModifiedUser = selectedObject.lastModifiedUserName
            this.lastModifiedTime = selectedObject.lastModifiedTime
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
