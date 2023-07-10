<template>
    <q-dialog full-width full-height :model-value="isShow" @show="show" @hide="hide">
        <q-card>
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">External Link</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section style="height:calc(100% - 50px);">
                <!-- <q-video class="fit" src="https://b23.tv/e3SyZ9J" /> -->
                <!-- <q-video class="fit" src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" /> -->
                <q-video id="url-iframe" class="fit" style="outline: 2px solid #14A028;border-radius: 10px;"
                    :src="urlSrc" />
                <q-inner-loading :showing="isLoading">
                    <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    name: 'Url-Viewer',
    props: ['isShow', 'urlSrc'],
    data() {
        return {
            isLoading: false
        }
    },
    computed: {

    },
    methods: {
        ...mapMutations('common', []),
        show() {
            this.isLoading = true

            const iframe = document.querySelector('#url-iframe iframe')
            if (iframe) {
                iframe.onload = () => {
                    this.isLoading = false
                }
            }
        },
        hide() {
            this.$emit('update:isShow', false)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
