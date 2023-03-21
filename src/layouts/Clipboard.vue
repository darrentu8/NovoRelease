<template>
    <div class="row" style="position:absolute;left:20px;bottom:70px;" v-if="copyImage">
        <q-btn @click.stop="clickClose" flat icon="cancel" color="primary" style="z-index:99"
            class="absolute-top-right q-pa-xs" />
        <q-card>
            <q-img :src="copyImage" fit="contain" style="width:200px;height:120px">
                <div class="absolute-bottom text-overline text-center row" style="padding:0">
                    <q-btn @click.stop="clickPaste" flat label="Click To Paste" color="white" class="fit"
                        style="margin:auto" />
                </div>
            </q-img>
        </q-card>
    </div>
</template>

<script>
import { setCopiedObjectPaste, setCopiedObjectClose } from '../js/canvas'

export default {
    name: 'ClipBoard',
    data() {
        return {
        }
    },
    computed: {
        copyImage() {
            return this.$store.state.common.copyImage
        }
    },
    methods: {
        clickClose() {
            setCopiedObjectClose()
        },
        clickPaste() {
            setCopiedObjectPaste()
            setCopiedObjectClose()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
