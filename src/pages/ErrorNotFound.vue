<template>
  <div class="errorPage text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>

      <q-btn square unelevated size="lg" class="q-mt-xl q-mb-xs" label="BACK TO LOGIN" type="button" to="/"
        color="black" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ErrorNotFound',
  mounted() {
    // setTimeout(() => this.$router.push({ path: '/' }), 1000)
  }
})
</script>
<style lang="sass" scoped>
.errorPage
  background: #69b7c3
  height: calc(100vh - 150px)
</style>
