<template>
    <q-toolbar class="q-pa-none bg-brand-green">
        <div class="col">
            <HeaderLeft />
        </div>
        <div style="min-width: 200px;">
            <HeaderCenter />
        </div>
        <div class="col">
            <HeaderRight />
        </div>
    </q-toolbar>
</template>

<script>
import HeaderLeft from './Header-Left'
import HeaderCenter from './Header-Center'
import HeaderRight from './Header-Right'

export default {
    name: 'Page-Header',
    components: {
        HeaderLeft,
        HeaderCenter,
        HeaderRight
    },
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>

</style>
