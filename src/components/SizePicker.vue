<template>
    <div>
        <div>Size </div>
        <div class="row items-center text-center q-pl-sm q-pr-sm">
            <div class="col relative-position row items-center text-center">
                <q-slider class="fit" :model-value="size" @update:model-value="changeSize" thumb-size="25px" :min="min"
                    :max="max" track-size="12px">
                </q-slider>
            </div>
            <div class="q-pl-sm row items-center justify-center" style="width:80px">
                <q-chip class="q-pa-sm" style="width:60px" outline square color="brand-grey" text-color="black">
                    <div style="margin:auto">{{size}}px</div>
                </q-chip>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SizePicker',
    props: ['min', 'max', 'size', 'color'],
    methods: {
        changeSize(size) {
            this.$emit('update:size', size)
            this.$emit('changeSize', size)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
