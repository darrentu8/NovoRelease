<template>
  <q-page>
    <div class="flex items-start justify-center q-mx-md q-mt-lg">
      <div class="col-md-4 col-12 q-mr-lg q-mb-lg" style="margin-top: 29px;">
        <MenuTabComponent />
      </div>
      <div class="col-md-8 col-12 q-mb-lg">
        <BreadCrumbComponent style="height: 31px;" />
        <UpgradeComponent />
      </div>
    </div>
  </q-page>
</template>

<script>
import MenuTabComponent from 'src/components/MenuTab.vue'
import UpgradeComponent from 'src/components/upgrade/UpgradeComponent.vue'
import BreadCrumbComponent from 'src/components/BreadCrumb.vue'
export default {
  components: {
    MenuTabComponent,
    BreadCrumbComponent,
    UpgradeComponent
  },
  setup() {
    return {
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
