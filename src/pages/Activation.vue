<template>
  <q-page class="flex flex-center">
    <Activation />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Activation from 'src/components/login/ActivationDialog.vue'

export default defineComponent({
  name: 'ActivationPage',

  components: {
    Activation
  },
  mounted() {
    this.$emit('changeBgG', true)
  }
})
</script>
