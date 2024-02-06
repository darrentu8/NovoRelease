<template>
  <q-page>
    <div class="flex items-start justify-center q-mx-md q-mt-lg">
      <div v-if="currentRouteName === 'bsp'" class="col-md-4 col-12 q-mr-lg q-mb-lg" style="margin-top: 29px;">
        <MenuTabComponent />
      </div>
      <div class="col-md-8 col-12 q-mb-lg">
        <BreadCrumbComponent style="height: 31px;" />
        <BspComponent v-if="currentRouteName === 'bsp'" />
        <bspConComponent v-else-if="currentRouteName === 'bspCon'" />
      </div>
    </div>
  </q-page>
</template>

<script>
import MenuTabComponent from 'src/components/MenuTab.vue'
import BspComponent from 'src/components/bsp/BspComponent.vue'
import bspConComponent from 'src/components/bsp/bspConComponent.vue'
import BreadCrumbComponent from 'src/components/BreadCrumb.vue'
export default {
  components: {
    MenuTabComponent,
    BreadCrumbComponent,
    BspComponent,
    bspConComponent
  },
  computed: {
    currentRouteName() {
      return this.$route.name
    }
  },
  setup() {
    return {
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
