<template>
  <q-page class="flex flex-center">
    <ResetPassword />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import ResetPassword from 'src/components/login/ResetPasswordDialog.vue'

export default defineComponent({
  name: 'ResetPasswordPage',

  components: {
    ResetPassword
  },
  mounted() {
    this.$emit('changeBgG', true)
  }
})
</script>
