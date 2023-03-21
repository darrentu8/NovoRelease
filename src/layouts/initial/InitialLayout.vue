<template>
  <q-layout view="hHr lpR fff">
    <q-header elevated="" class="headerHeight">
      <q-toolbar class="bg-brand-green text-white">
        <div class="logoBox white">
          <router-link to="/" class="desktop-only"><img :src="vvklogo" :alt="vvktitle" /></router-link>
          <router-link to="/"><img :src="logo" :alt="title" /></router-link>
        </div>
        <q-toolbar-title></q-toolbar-title>
        <q-btn unelevated color="transparent" text-color="white" label="Sign in" @click="toLogin"></q-btn>
        <q-btn unelevated class="q-ml-xs" color="white" text-color="green" label="Create Account" @click="toRegister">
        </q-btn>
      </q-toolbar>
    </q-header>
    <!-- <FooterComponent /> -->
    <q-drawer v-model="rightDrawerOpen" side="right" bordered="bordered"></q-drawer>
    <q-page-container :class="{ 'brand-gradient': BgG }">
      <router-view @changeBgG="changeBgG"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { LocalStorage } from 'quasar'
// import FooterComponent from 'src/components/Footer.vue'

export default defineComponent({
  name: 'InitialLayout',
  components: {
    // FooterComponent
  },
  data() {
    return {
      BgG: false,
      vvktitle: 'vivitek',
      vvklogo: require('../../assets/img/logo/vvkLogo_w.svg'),
      title: 'NovoConnect Cloud',
      logo: require('../../assets/img/logo/cloud-with-icon.svg')
    }
  },
  setup() {
    const rightDrawerOpen = ref(false)
    return {
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  },
  created() {
    this.checkAuth()
  },
  mounted() {
  },
  methods: {
    toLogin() {
      this.$router.push({ path: '/login' })
    },
    toRegister() {
      this.$router.push({ path: '/register' })
    },
    checkAuth() {
      const UID = this.$store.getters['auth/getUID']
      const UserEmail = LocalStorage.getItem('userEmail')
      const UserData = LocalStorage.getItem('userData')
      if (UID && UserEmail && UserData !== undefined) {
        this.$router.push({ path: '/list' })
      }
    },
    changeBgG: function (childValue) {
      this.BgG = childValue
    }
  }
})
</script>
<style lang='sass' scoped>
</style>
