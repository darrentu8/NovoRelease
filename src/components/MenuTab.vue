<template>
  <div class="brandTabBtnWrap">
    <q-btn stack @click="toPage('product')" :class="['brandTabBtn', pathTab == 'product' ? 'active' : '']" flat
      type="button" icon="dns">
      <span>Product</span>
    </q-btn>
    <q-btn stack @click="toPage('upgrade')" :class="['brandTabBtn', pathTab == 'upgrade' ? 'active' : '']" flat
      type="button" icon="layers">
      <span>Upgrade Number</span>
    </q-btn>
    <q-btn stack @click="toPage('bsp')" :class="['brandTabBtn', pathTab == 'bsp' ? 'active' : '']" flat type="button"
      icon="developer_board">
      <span>BSP</span>
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
