<template>
    <div class="row shadow-2 rounded-borders items-center text-center bg-white"
        style="position:absolute;bottom:15px;right:15px;height:40px">
        <q-btn-group class="fit">
            <q-btn class="full-height" style="width:50px" dense flat size="17px"
                :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" color="brand-grey"
                @click="$q.fullscreen.toggle()" />
            <q-btn class="full-height" style="width:50px" dense flat icon="center_focus_strong" color="brand-grey"
                @click="restoreViewport" />
            <q-separator vertical inset />
            <q-btn class="full-height" style="width:50px" dense flat icon="remove_circle_outline" color="brand-grey"
                @click="zoomDown" />
            <q-select class="q-pl-sm" borderless v-model="zoom" style="width:60px" :menu-offset="[0, 10]"
                :options="zoomOptions" dense map-options option-value="value" option-label="label" emit-value
                options-dense @update:modelValue="changeZoom" color="white" options-selected-class="wb-resize-select">
                <template v-slot:selected>
                    <span class="text-brand-grey">{{ zoom }}%</span>
                </template>
            </q-select>
            <q-btn class="full-height" style="width:50px" dense flat icon="add_circle_outline" color="brand-grey"
                @click="zoomUp" />
        </q-btn-group>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

import { setCanvasZoom, setCanvasRestoreViewport } from '../js/canvas'

export default {
    name: 'Right-Bar',
    components: {

    },
    data() {
        return {
            zoomOptions: [
                { label: '200%', value: 200 },
                { label: '180%', value: 180 },
                { label: '160%', value: 160 },
                { label: '140%', value: 140 },
                { label: '120%', value: 120 },
                { label: '100%', value: 100 },
                { label: '90%', value: 90 },
                { label: '80%', value: 80 },
                { label: '70%', value: 70 },
                { label: '60%', value: 60 },
                { label: '50%', value: 50 }
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
        restoreViewport() {
            this.zoom = 100
            setCanvasRestoreViewport()
        },
        changeZoom(val) {
            setCanvasZoom(val)
        },
        zoomDown() {
            const optionIndex = this.zoomOptions.findIndex(o => o.value === this.zoom)
            if (optionIndex < this.zoomOptions.length - 1) {
                this.zoom = this.zoomOptions[optionIndex + 1].value
                setCanvasZoom(this.zoom)
            }
        },
        zoomUp() {
            const optionIndex = this.zoomOptions.findIndex(o => o.value === this.zoom)
            if (optionIndex > 0) {
                this.zoom = this.zoomOptions[optionIndex - 1].value
                setCanvasZoom(this.zoom)
            }
        }
    }
}
</script>
<style lang="scss">
.wb-resize-select {
    background-color: #14A028;
    color: white;
    width: 80px
}
</style>
