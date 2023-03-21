<template>
  <q-layout view="HHH LpR LFF">
    <q-header>
      <Header />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Header from './header/Header'

export default {
  name: 'MainLayout',
  components: {
    Header
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
