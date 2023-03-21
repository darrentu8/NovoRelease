<template>
  <q-page class="flex flex-center">
    <Active />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Active from 'src/components/login/ActiveDialog.vue'

export default defineComponent({
  name: 'ActivePage',

  components: {
    Active
  },
  mounted() {
    this.$emit('changeBgG', true)
  }
})
</script>
