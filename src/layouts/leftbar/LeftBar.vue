<template>
  <div class="row shadow-2 rounded-borders items-center text-center bg-white absolute"
    style="bottom:15px;left:15px;height:40px;z-index:10">
    <q-btn-group class="fit">
      <ExtensionMenu />
      <q-separator vertical inset />
      <PageView />
      <q-separator vertical inset />
      <SharePop />
    </q-btn-group>
  </div>
</template>

<script>

import ExtensionMenu from './ExtensionMenu'
import SharePop from '../../../src/components/project/SharePop'
import PageView from './PageView'

export default {
  name: 'Left-Bar',
  components: {
    ExtensionMenu,
    PageView,
    SharePop
  },
  data() {
    return {
      isSelected: false
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped></style>
