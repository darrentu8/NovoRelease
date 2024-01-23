<template>
  <q-layout class="dashboard" view="hHr lpR lFf">
    <q-header class="bg-theme-grey">
      <q-toolbar class="bg-theme-grey" style="height:56px;">
        <div class="logoBox">
          <router-link to="/" class="desktop-only">
            <span class="text-dark text-bold text-h5">Novo Management</span>
          </router-link>
          <!-- <div class="spaceLine border-r-b"></div>
          <router-link class="logoBox-r" to="/"><img class="q-ml-md" :src="logoFont" :alt="title" /></router-link>
          <router-link class="" to="/"><img class="q-ml-md" :src="logoFontServer" :alt="title" /></router-link> -->
        </div>
        <q-toolbar-title></q-toolbar-title>
        <div>
          <AdminAvatarComponent />
        </div>
      </q-toolbar>
    </q-header>
    <FooterComponent />
    <!-- <q-drawer shkow-if-above="show-if-above" v-model="rightDrawerOpen" side="right" bordered="bordered"></q-drawer> -->
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import FooterComponent from 'src/components/Footer.vue'
import AdminAvatarComponent from 'src/components/user/AdminAvatar.vue'
export default defineComponent({
  name: 'DashboardLayout',
  components: {
    FooterComponent,
    AdminAvatarComponent
  },
  data() {
    return {
      loading: true,
      vvktitle: 'vivitek',
      vvklogo: require('../../assets/img/logo/vvkLogo.svg'),
      title: 'NovoConnect Cloud',
      logo: require('../../assets/img/logo/cloud-sign.svg'),
      logoFont: require('../../assets/img/logo/cloud-g.svg'),
      logoFontServer: require('../../assets/img/logo/brand_logo_server.svg'),
      timer: null,
      lockReconnect: false
    }
  },
  created() {
    // this.getAdminData()
  },
  destroy() {
    // this.websocketclose() // 關閉websocket通道
  },
  computed: {
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
  mounted() {
  },
  methods: {
    async getAdminData() {
      this.loading = true
      await this.$store.dispatch('user/getProfile')
      this.loading = false
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
<style lang="sass">
.desktop
  overflow-y: auto
.dashboard
  .q-page-container
    background-color: #F2F2F2
  .q-page
    max-width: 1520px
    margin: 0 auto
  .top-toolbar
    .search-box
      display: inline-flex
    .q-btn .q-btn__content span
      font-size: 14px
    .q-field--outlined .q-field__control:before
      border: 1px solid #e5e5e5
    .q-field--dense .q-field__control,.q-field__control-container
      height: 32px !important
      .q-field__marginal
        height: 32px !important
</style>
