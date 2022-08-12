<template>
  <q-layout view="HHH LpR LFF">
    <q-header>
      <PanelBar />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import PanelBar from './panelBar/PanelBar'

export default {
  name: 'MainLayout',
  components: {
    PanelBar
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
</style>
