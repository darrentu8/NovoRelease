<template>
  <q-page class="flex flex-center">
    <Login />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Login from 'src/components/login/LoginDialog.vue'

export default defineComponent({
  name: 'LoginPage',

  components: {
    Login
  },
  mounted() {
    this.$emit('changeBgG', true)
  }
})
</script>
