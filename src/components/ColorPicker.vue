<template>
    <div class="row q-gutter-sm">
        <q-btn v-for="color in colors" :key="color" round :ripple="false" :size="size"
            :style="{ 'background-color': color }" :text-color="getLuminosity(color) > 0.5 ? 'black' : 'white'"
            :icon="color === selectedColor ? 'check' : ''" @click="changeColor(color)" />
        <q-btn round flat :ripple="false" :size="size" icon="colorize" color="black">
            <q-popup-proxy>
                <q-color @update:model-value="changePickColor" no-header no-footer default-view="palette" />
            </q-popup-proxy>
        </q-btn>
    </div>
</template>

<script>
import { colors } from 'quasar'

const { luminosity } = colors

export default {
    name: 'ColorPicker',
    props: ['size', 'colors', 'selectedColor'],
    data() {
        return {
        }
    },
    methods: {
        changeColor(color) {
            this.$emit('changeColor', color)
            this.$emit('update:selectedColor', color)
        },
        changePickColor(color) {
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
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
