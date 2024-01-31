<template>
  <q-layout view="hHr lpR fff">
    <q-header class="bg-theme-grey">
      <q-toolbar class="bg-theme-grey" style="height:56px;">
        <div class="logoBox">
          <!-- <router-link to="/" class="desktop-only">
            <span class="text-dark text-bold text-h5">Novo Management</span>
          </router-link> -->
          <!-- <router-link to="/" class="desktop-only"><img :src="vvklogo" :alt="vvktitle" /></router-link>
          <div class="spaceLine border-r-b"></div>
          <router-link class="logoBox-r" to="/"><img class="q-ml-md" :src="logoFont" :alt="title" /></router-link>
          <router-link class="" to="/"><img class="q-ml-md" :src="logoFontServer" :alt="title" /></router-link> -->
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FooterComponent from 'src/components/FooterComponent.vue'
// import AdminAvatarComponent from '@/components/user/AdminAvatar.vue'

// const store = useStore()
// const router = useRouter()
const route = useRoute()

const BgG = ref(false)
// const loading = ref(true)
// const loading = ref(true)
// const vvktitle = 'vivitek'
// const title = 'NovoConnect Cloud'

// 將圖片和資源用 import 語法導入
// import vvklogo from '@/assets/img/logo/vvkLogo.svg'
// import logo from '@/assets/img/logo/cloud-sign.svg'
// import logoFont from '@/assets/img/logo/cloud-g.svg'
// import logoFontServer from '@/assets/img/logo/brand_logo_server.svg'

const currentRouteName = computed(() => route.name)

// const toDashboard = computed(() => {
//   const uid = store.getters['auth/getUID']
//   return uid ? '/list/all' : '/login'
// })

onMounted(async () => {
})
const changeBgG = (childValue) => {
  BgG.value = childValue
}
// async function getAdminData() {
//   loading.value = true
//   await store.dispatch('user/getProfile')
//   loading.value = false
// }

// function toLogin() {
//   router.push({ path: '/login' })
// }

// function toRegister() {
//   router.push({ path: '/register' })
// }
</script>

<style lang='sass' scoped>
</style>
