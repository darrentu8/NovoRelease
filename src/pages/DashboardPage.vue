<template>
  <q-page>
    <div class="flex items-start justify-center q-mx-md q-mt-lg">
      <div class="col-4 q-mr-lg">
        <div class="brandTabBtnWrap">
          <q-btn stack @click="showTab = 'Service'" :class="['brandTabBtn', showTab === 'Service' ? 'active' : '']" flat
            type="button">
            <img v-if="showTab === 'Service'" src="~assets/img/icon/globe-alt-g.svg" alt="">
            <img v-else src="~assets/img/icon/globe-alt.svg" alt="">
            <span>Service</span>
          </q-btn>
          <q-btn stack @click="showTab = 'Devices'" :class="['brandTabBtn', showTab === 'Devices' ? 'active' : '']" flat
            type="button">
            <img v-if="showTab === 'Devices'" src="~assets/img/icon/device-g.svg" alt="">
            <img v-else src="~assets/img/icon/device.svg" alt="">
            <span>Devices</span>
          </q-btn>
          <q-btn stack @click="showTab = 'Announcement'"
            :class="['brandTabBtn', showTab === 'Announcement' ? 'active' : '']" flat type="button">
            <img v-if="showTab === 'Announcement'" src="~assets/img/icon/org-g.svg" alt="">
            <img v-else src="~assets/img/icon/org.svg" alt="">
            <span>Announcement</span>
          </q-btn>
        </div>
      </div>
      <div class="col-8">
        <ServiceComponent v-if="showTab === 'Service'" />
        <DeviceComponent v-if="showTab === 'Devices'" />
        <AnnComponent v-if="showTab === 'Announcement'" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import ServiceComponent from 'src/components/service/ServiceComponent.vue'
import AnnComponent from 'src/components/ann/AnnComponent.vue'
import DeviceComponent from 'src/components/device/DeviceComponent.vue'
export default {
  components: {
    ServiceComponent,
    AnnComponent,
    DeviceComponent
  },
  setup() {
    return {
      showTab: ref('Service')
    }
  }
}
</script>
<style lang="sass" scoped>
.addBtn
  width: 65px
  height: 65px
  margin: 10px
  filter: opacity(60%)

//q-table
.q-table__card
  background-color: #fff0
.q-table-height
  height: 430px
  overflow-y: auto
.q-table__card .q-table__bottom-item
  color: #bbb

// Scroll-Shadow
.wrapper
  position: relative
  overflow: hidden
.shadow
  position: absolute
  left: 0
  z-index: 100
  width: 100%
  height: 15px
  background: red
.shadow--top
  margin: 0
  top: 0
  left: 0
  background: -webkit-linear-gradient(270deg, rgba(0, 0, 0, 0.10), transparent)
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.10), transparent)
  opacity: 0
.shadow--bottom
  margin: 0
  bottom: 0
  left: 0
  background: -webkit-linear-gradient(90deg, rgba(0, 0, 0, 0.05), transparent)
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.05), transparent)

</style>
