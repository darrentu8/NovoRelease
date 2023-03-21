<template>
  <q-layout class="dashboard" view="hHr lpR lFf">
    <q-header elevated="">
      <q-toolbar class="bg-brand-green text-white q-pr-none">
        <!-- <q-btn class="text-white" flat="" dense="" round="" icon="menu" aria-label="Menu" @click="toggleLeftDrawer">
        </q-btn> -->
        <div class="logoBox white">
          <router-link :to="toDashboard" class="desktop-only"><img :src="vvklogo" :alt="vvktitle" /></router-link>
          <router-link :to="toDashboard"><img :src="logo" :alt="title" /></router-link>
        </div>
        <q-toolbar-title></q-toolbar-title>
        <div v-if="!loading">
          <AdminAvatarComponent />
        </div>
      </q-toolbar>
    </q-header>
    <!-- <q-drawer shkow-if-above="show-if-above" v-model="rightDrawerOpen" side="right" bordered="bordered"></q-drawer> -->
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'
import { mixinWebsocket } from '../../mixins/ws.js'
import AdminAvatarComponent from 'src/components/user/AdminAvatar.vue'
export default defineComponent({
  name: 'DashboardLayout',
  mixins: [mixinWebsocket],
  components: {
    AdminAvatarComponent
  },
  data() {
    return {
      loading: true,
      vvktitle: 'vivitek',
      vvklogo: require('../../assets/img/logo/vvkLogo_w.svg'),
      title: 'NovoConnect Cloud',
      logo: require('../../assets/img/logo/cloud-with-icon.svg'),
      timer: null,
      lockReconnect: false
    }
  },
  created() {
    this.initWebsocket()
    this.getAdminData()
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
