<template>
    <q-item>
        <q-item-section side>
            <q-btn round size="sm" :style="{ 'background-color': brushColor, 'pointer-events': 'none' }" />
        </q-item-section>
        <q-item-section>
            <q-slider label :model-value="brushSize" color="primary" :min="min" :max="max"
                @update:model-value="changeSize" />
        </q-item-section>
    </q-item>
</template>

<script>

export default {
    name: 'SizePicker',
    props: ['min', 'max', 'brushSize', 'brushColor'],
    methods: {
        changeSize(size) {
            this.$emit('update:brushSize', size)
            this.$emit('changeSize', size)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
