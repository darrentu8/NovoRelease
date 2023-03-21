<template>
  <q-page class="flex flex-center">
    <Forget />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Forget from 'src/components/login/ForgetDialog.vue'

export default defineComponent({
  name: 'ForgetPage',

  components: {
    Forget
  },
  mounted() {
    this.$emit('changeBgG', true)
  }
})
</script>
