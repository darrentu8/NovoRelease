<template>
    <div class="row" style="position:absolute;bottom:10px;right:20px;">
        <q-btn-group rounded class=" shadow-3" style="background-color:#ffffffba">
            <q-btn round flat icon="remove_circle_outline" color="primary" @click="zoomDown" />
            <q-select outlined v-model="zoom" class="q-pa-xs" :options="zoomOptions" dense map-options
                option-value="value" option-label="label" emit-value @update:modelValue="changeZoom" />
            <q-btn round flat icon="add_circle_outline" color="primary" @click="zoomUp" />
        </q-btn-group>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

import { setCanvasZoom } from '../js/canvas'

export default {
    name: 'ResizeBar',
    components: {

    },
    data() {
        return {
            zoomOptions: [
                { label: '50%', value: 50 },
                { label: '60%', value: 60 },
                { label: '70%', value: 70 },
                { label: '80%', value: 80 },
                { label: '90%', value: 90 },
                { label: '100%', value: 100 },
                { label: '120%', value: 120 },
                { label: '140%', value: 140 },
                { label: '160%', value: 160 },
                { label: '180%', value: 180 },
                { label: '200%', value: 200 }
            ]
        }
    },
    computed: {
        zoom: {
            get() {
                return this.$store.state.common.canvasZoom
            },
            set(val) {
                this.SET_CANVAS_ZOOM(val)
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_CANVAS_ZOOM']),
        changeZoom(val) {
            setCanvasZoom(val)
        },
        zoomDown() {
            const optionIndex = this.zoomOptions.findIndex(o => o.value === this.zoom)
            if (optionIndex > 0) {
                this.zoom = this.zoomOptions[optionIndex - 1].value
                setCanvasZoom(this.zoom)
            }
        },
        zoomUp() {
            const optionIndex = this.zoomOptions.findIndex(o => o.value === this.zoom)
            if (optionIndex < this.zoomOptions.length - 1) {
                this.zoom = this.zoomOptions[optionIndex + 1].value
                setCanvasZoom(this.zoom)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
