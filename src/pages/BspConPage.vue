<template>
  <q-page>
    <div class="flex items-start justify-center q-mx-md q-mt-lg">
      <div class="col-md-12 col-12 q-mb-lg">
        <BreadCrumbComponent style="height: 31px;" />
        <BspConComponent />
      </div>
    </div>
  </q-page>
</template>

<script>
import BspConComponent from 'src/components/bsp/BspConComponent.vue'
import BreadCrumbComponent from 'src/components/BreadCrumb.vue'
export default {
  components: {
    BreadCrumbComponent,
    BspConComponent
  },
  setup() {
    return {
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
