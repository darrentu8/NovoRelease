<template>
    <q-toolbar class="q-pa-none bg-indigo-2">
        <Page />
        <q-space />
        <Background />
        <q-btn icon="download" flat color="primary"></q-btn>
    </q-toolbar>
</template>

<script>
import Page from './Page'
import Background from './Background'

export default {
    name: 'PanelBar',
    components: {
        Page,
        Background
    }
}
</script>
<style lang="scss" scoped>
</style>
