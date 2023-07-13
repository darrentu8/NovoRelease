<template>
  <q-breadcrumbs class="q-mb-sm">
    <q-breadcrumbs-el @click="toHome()" icon="home" class="cursor-pointer" style="margin-top:2px;" />
    <q-breadcrumbs-el v-for="crumb in crumbs" :key="crumb.id" :label="crumb.text" :to="crumb.to" />
  </q-breadcrumbs>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BreadCrumbComponent',
  props: {
  },
  computed: {
    crumbs: function () {
      const pathArray = this.$route.path.split('/')
      pathArray.shift()
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        breadcrumbArray.push({
          path,
          to: breadcrumbArray[idx - 1]
            ? '/' + breadcrumbArray.map(function (e) {
              return e.path
            }).join('/') + '/' + path
            : '/' + path,
          text: path
        })
        return breadcrumbArray
      }, [])
      return breadcrumbs
    }
  },
  data() {
    return {
    }
  },
  methods: {
    toHome() {
      this.$router.push({ path: '/service' })
    }
  }
})
</script>
<style lang="sass" scoped>
.q-breadcrumbs__el
  color: rgb(95, 95, 95)
  font-size: 0.875rem
  line-height: 1.5rem
  text-transform: capitalize
</style>
