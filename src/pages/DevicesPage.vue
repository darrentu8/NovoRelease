<template>
  <q-page>
    <div class="flex items-start justify-center q-mx-md q-mt-lg">
      <div class="col-4 q-mr-lg" style="margin-top: 29px;">
        <MenuTabComponent />
      </div>
      <div class="col-8">
        <BreadCrumbComponent style="height: 31px;" />
        <DeviceComponent />
      </div>
    </div>
  </q-page>
</template>

<script>
import MenuTabComponent from 'src/components/MenuTab.vue'
import DeviceComponent from 'src/components/device/DeviceComponent.vue'
import BreadCrumbComponent from 'src/components/BreadCrumb.vue'
export default {
  components: {
    MenuTabComponent,
    BreadCrumbComponent,
    DeviceComponent
  },
  setup() {
    return {
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
