<template>
    <div>
        <div>Color </div>
        <div class="row q-gutter-sm q-pl-sm q-pt-sm">
            <q-btn v-for="color in colors" :key="color" round :ripple="false" :size="size"
                :style="{ 'background-color': color }" :text-color="getLuminosity(color) > 0.5 ? 'black' : 'white'"
                :icon="isColorHexEqual(color, selectedColor) ? 'check' : ''" @click="changeColor(color)" />
            <q-btn round flat :ripple="false" :size="size" icon="colorize" color="black">
                <q-popup-proxy>
                    <q-color :model-value="selectedColor" @update:model-value="changePickerColor" />
                </q-popup-proxy>
            </q-btn>
        </div>
        <div v-show="!noOpacity">
            <div class="q-pt-sm">Opacity</div>
            <div class="row items-center text-center q-pl-sm q-pr-sm">
                <div class="col relative-position row items-center text-center">
                    <div class="full-width absolute rounded-borders" style="height:12px;"
                        :style="{ background: `linear-gradient(90deg, rgba(58, 135, 253, 0.0001) 0%, ${selectedColor} 85.49%)` }">
                    </div>
                    <q-slider @update:model-value="changeOpacity" class="fit" :model-value="opacity" thumb-size="25px"
                        :max="100" track-size="12px" track-color="transparent" inner-track-color="transparent"
                        selection-color="transparent" :track-img="opacityBackgroundImg">
                    </q-slider>
                </div>
                <div class="q-pl-sm row items-center justify-center" style="width:80px">
                    <q-chip class="q-pa-xs" style="width:60px" outline square color="brand-grey" text-color="black">
                        <div style="margin:auto">{{ opacity }}%</div>
                    </q-chip>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { colors } from 'quasar'
import { isColorHexEqual } from '../helper/util'

const { luminosity } = colors

export default {
    name: 'ColorPicker',
    props: ['size', 'colors', 'selectedColor', 'opacity', 'noOpacity'],
    data() {
        return {
            opacityBackgroundImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAH0lEQVQoU2NkYGAwZkAFZ5G5jPRRgOYEVDeB3EBjBQBOZwTVugIGyAAAAABJRU5ErkJggg=='
        }
    },
    methods: {
        changeColor(color) {
            this.$emit('update:selectedColor', color)
            this.$emit('changeColor', color)
        },
        changeOpacity(val) {
            this.$emit('update:opacity', val)
            this.$emit('changeOpacity', val)
        },
        changePickerColor(color) {
            const newColors = this.colors.map((o, index) => {
                if (o === this.selectedColor) {
                    return color
                } else {
                    return o
                }
            })

            this.$emit('update:colors', newColors)

            this.changeColor(color)
        },
        getLuminosity(color) {
            return luminosity(color)
        },
        isColorHexEqual(color1, color2) {
            return isColorHexEqual(color1, color2)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
