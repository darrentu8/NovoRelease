<template>
  <q-layout view="hHr lpR fff">
    <q-header elevated="" class="headerHeight">
      <q-toolbar class="bg-brand-green text-white">
        <div class="logoBox white">
          <router-link to="/" class="desktop-only"><img :src="vvklogo" :alt="vvktitle" /></router-link>
          <router-link to="/"><img :src="logo" :alt="title" /></router-link>
        </div>
        <q-toolbar-title></q-toolbar-title>
        <q-btn v-if="currentRouteName === 'register'" unelevated color="transparent" text-color="white" label="Sign in"
          @click="toLogin"></q-btn>
        <q-btn v-if="currentRouteName === 'login'" unelevated class="q-ml-xs" color="white" text-color="green"
          label="Create Account" @click="toRegister">
        </q-btn>
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
      vvklogo: require('../../assets/img/logo/vvkLogo_w.svg'),
      title: 'NovoConnect Cloud',
      logo: require('../../assets/img/logo/cloud-with-icon.svg')
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
