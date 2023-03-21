<template>
  <q-page class="flex flex-center">
    <Register />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Register from 'src/components/login/RegisterDialog.vue'

export default defineComponent({
  name: 'RegisterPage',

  components: {
    Register
  },
  mounted() {
    this.$emit('changeBgG', true)
  }
})
</script>
