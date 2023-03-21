<template>
    <q-btn v-show="isShow" style="width:50px" flat>
        <img style="height:20px;width:20px" :src="iconFontStyle" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none">
            <div class="q-pa-md" style="max-width:300px">
                <div class="text-subtitle1 q-pb-sm">Font Style </div>
                <div class="row q-gutter-sm">
                    <q-btn dense flat color="brand-grey" :ripple="false" @click="changeTextStyle('fontWeight', 'bold')"
                        size="md" icon="format_bold" />
                    <q-btn dense flat color="brand-grey" :ripple="false" @click="changeTextStyle('fontStyle', 'italic')"
                        size="md" :style="{ 'background-color': 'white' }" icon="format_italic" />
                    <q-btn dense flat color="brand-grey" :ripple="false" @click="changeTextStyle('underline', true)"
                        size="md" :style="{ 'background-color': 'white' }" icon="format_underlined" />
                    <q-btn dense flat color="brand-grey" :ripple="false" @click="changeTextStyle('overline', true)"
                        size="md" :style="{ 'background-color': 'white' }" icon="format_overline" />
                    <q-btn dense flat color="brand-grey" :ripple="false" @click="changeTextStyle('linethrough', true)"
                        size="md" :style="{ 'background-color': 'white' }" icon="format_strikethrough" />
                    <q-btn dense flat color="brand-grey" :ripple="false" @click="changeTextStyle('subscript')" size="md"
                        :style="{ 'background-color': 'white' }" icon="subscript" />
                    <q-btn dense flat color="brand-grey" :ripple="false" @click="changeTextStyle('superscript')"
                        size="md" :style="{ 'background-color': 'white' }" icon="superscript" />
                    <q-btn dense flat color="red" :ripple="false" @click="clearTextStyle()" size="md"
                        :style="{ 'background-color': 'white' }" icon="format_clear" />
                </div>
            </div>
        </q-menu>
    </q-btn>
    <q-btn v-show="isShow" :color="textAlign === 'left' ? 'brand-green' : 'brand-grey'" flat
        @click="changeTextAlign('left')" :ripple="false" style="width:50px" GF icon="format_align_left" />
    <q-btn v-show="isShow" :color="textAlign === 'center' ? 'brand-green' : 'brand-grey'" flat
        @click="changeTextAlign('center')" :ripple="false" style="width:50px" icon="format_align_center" />
    <q-btn v-show="isShow" :color="textAlign === 'right' ? 'brand-green' : 'brand-grey'" flat
        @click="changeTextAlign('right')" :ripple="false" style="width:50px" icon="format_align_right" />
    <q-separator v-show="isShow" vertical inset />
</template>

<script>
import { setActiveTextAlign, setActiveTextStyle, clearActiveTextStyle } from '../../js/toolbar/text'

export default {
    name: 'OperationBar-Text',
    mounted() {
        this.$bus.on('setOprBarTextAlign', this.setOprBarTextAlign)
    },
    beforeUnmount() {
        this.$bus.off('setOprBarTextAlign', this.setOprBarTextAlign)
    },
    data() {
        return {
            textAlign: 'left',
            iconFontStyle: require('../../assets/icons/icon_font_style.svg')
        }
    },
    computed: {
        isShow() {
            if (!this.$store.state.common.selectedObject) {
                return false
            }
            return this.$store.state.common.selectedObject.type === 'textbox'
        }
    },
    methods: {
        setOprBarTextAlign(align) {
            this.textAlign = align
        },
        changeTextAlign(align) {
            this.textAlign = align
            setActiveTextAlign(align)
        },
        changeTextStyle(styleName, val) {
            setActiveTextStyle(styleName, val)
        },
        clearTextStyle() {
            clearActiveTextStyle()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
