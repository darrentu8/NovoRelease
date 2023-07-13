<template>
  <q-breadcrumbs class="q-mb-sm">
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
  }
})
</script>
<style lang="sass" scoped>
</style>
