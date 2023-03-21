<template>
  <q-dialog ref="dialog">
    <q-card style="min-width: 680px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold"></div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="row items-stretch q-px-md q-pb-md" style="min-height: 180px;" horizontal>
        <q-card-section class="flex q-py-none text-center items-stretch justify-center" style="min-width: 152px;">
          <q-img class="q-mb-md" :src="logoS" :alt="title" style="width:100px;height:100px;" />
          <small class="text-grey text-center">Version {{ getVersion }}</small>
        </q-card-section>
        <q-separator class="q-mx-lg" vertical />
        <q-card-section class="flex q-py-none items-stretch justify-between">
          <q-img class="q-mb-md" :src="logoColor" :alt="title" style="width:260px;height:25px;" />
          <p>This software assists you to collaborate and
            <br>
            share your ideas with other people easily.
          </p>
          <small class="text-grey">Copyright © {{ getDate }} Delta Electronics, Inc. All Rights Reserved.</small>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutDialog',
  data() {
    return {
      title: 'NovoConnect Cloud',
      logoS: require('../../assets/img/logo/cloud-logo-square.svg'),
      logoColor: require('../../assets/img/logo/cloud-color.svg')
    }
  },
  computed: {
    getVersion() {
      return '1.1.0'
    },
    getDate() {
      return new Date().getFullYear()
    }
  },
  mounted() {
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
