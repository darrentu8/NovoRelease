<template>
  <div class="logoBox q-ml-md">
    <!-- <router-link :to="toDashboard" class="desktop-only"><img :src="vvklogo" :alt="vvktitle" /></router-link> -->
    <router-link :to="toDashboard"><img :src="logo" :alt="title" /></router-link>
  </div>
</template>

<script>

export default {
  name: 'Header-Left',
  data() {
    return {
      vvktitle: 'vivitek',
      vvklogo: require('../../assets/img/logo/vvkLogo_w.svg'),
      title: 'NovoConnect Cloud',
      logo: require('../../assets/img/logo/cloud-with-icon.svg')
    }
  },
  computed: {
    loginStatus() {
      return this.$store.getters['auth/getLoginStatus']
    },
    currentRouteName() {
      return this.$route.name
    },
    toDashboard() {
      const uid = this.$store.getters['auth/getUID']
      if (uid) {
        return '/list/all'
      } else {
        return '/login'
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>

</style>
