<template>
  <div class="brandTabBtnWrap">
    <q-btn stack @click="toPage('service')" :class="['brandTabBtn', pathTab == 'service' ? 'active' : '']" flat
      type="button">
      <img v-if="pathTab == 'service'" src="~assets/img/icon/globe-alt-g.svg" alt="">
      <img v-else src="~assets/img/icon/globe-alt.svg" alt="">
      <span>Service</span>
    </q-btn>
    <q-btn stack @click="toPage('devices')" :class="['brandTabBtn', pathTab == 'devices' ? 'active' : '']" flat
      type="button">
      <img v-if="pathTab == 'devices'" src="~assets/img/icon/device-g.svg" alt="">
      <img v-else src="~assets/img/icon/device.svg" alt="">
      <span>Devices</span>
    </q-btn>
    <q-btn stack @click="toPage('announcement')" :class="['brandTabBtn', pathTab == 'announcement' ? 'active' : '']" flat
      type="button">
      <img v-if="pathTab == 'announcement'" src="~assets/img/icon/org-g.svg" alt="">
      <img v-else src="~assets/img/icon/org.svg" alt="">
      <span>Announcement</span>
    </q-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const pathTab = computed(() => router.currentRoute.value.name)
const toPage = (val) => {
  console.log('router.currentRoute.value.name', router.currentRoute.value.name)
  router.push({ path: '/' + val })
}
</script>
<style lang="sass" scoped>
</style>
