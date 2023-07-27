<template>
  <q-layout view="hHr lpR fff">
    <q-header class="bg-transparent">
      <q-toolbar class="bg-transparent" style="height:56px;">
        <div class="logoBox">
          <router-link to="/" class="desktop-only"><img :src="vvklogo" :alt="vvktitle" /></router-link>
          <div class="spaceLine border-r-b"></div>
          <router-link class="logoBox-r" to="/"><img class="q-ml-md" :src="logoFont" :alt="title" /></router-link>
          <router-link class="" to="/"><img class="q-ml-md" :src="logoFontServer" :alt="title" /></router-link>
        </div>
        <q-toolbar-title></q-toolbar-title>
        <q-btn v-if="currentRouteName === 'register'" unelevated color="transparent" text-color="white" label="Sign in"
          @click="toLogin"></q-btn>
        <!-- <q-btn v-if="currentRouteName === 'login'" unelevated class="q-ml-xs" color="white" text-color="green"
          label="Create Account" @click="toRegister">
        </q-btn> -->
      </q-toolbar>
    </q-header>
    <FooterComponent />
    <q-page-container :class="{ 'brand-gradient': BgG }">
      <router-view @changeBgG="changeBgG"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import FooterComponent from 'src/components/Footer.vue'

export default defineComponent({
  name: 'LoginLayout',
  components: {
    FooterComponent
  },
  data() {
    return {
      BgG: false,
      vvktitle: 'vivitek',
      vvklogo: require('../../assets/img/logo/vvkLogo.svg'),
      title: 'NovoConnect Cloud Server',
      logo: require('../../assets/img/logo/cloud-sign.svg'),
      logoFont: require('../../assets/img/logo/cloud-g.svg'),
      logoFontServer: require('../../assets/img/logo/brand_logo_server.svg')
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name
    }
  },
  methods: {
    changeBgG: function (childValue) {
      this.BgG = childValue
    },
    toLogin() {
      const _self = this
      _self.$router.push({ path: '/login' })
    },
    toRegister() {
      const _self = this
      _self.$router.push({ path: '/register' })
    }
  }
})
</script>
<style lang='sass' scoped>
</style>
