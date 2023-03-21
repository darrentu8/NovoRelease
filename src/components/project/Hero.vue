<template>
  <div class="cursor-pointer q-my-xl full-width" @click="createProject()">
    <q-card class="row card-bg items-center justify-end" flat>
      <div class="col-5">
        <div class="row">
          <q-card-section class="col-8 flex items-center justify-end">
            <div class="title">Create a new project</div>
            <!-- <div class="text-subtitle">
              Amet minim mollit runt ullam mollit runt Amet minim mollit runt ullam mollit runt
            </div> -->
          </q-card-section>
          <img class="bigBtn col-4 q-ml-md text-left" :src="bigBtn" alt="">
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ToolBar',
  components: {
  },
  props: {
  },
  data() {
    return {
      bigBtn: require('../../assets/img/icon/call-to-action-btn-green.svg')
    }
  },
  computed: {
  },
  methods: {
    createProject() {
      this.$emit('createProject')
    }
  }
})
</script>
<style lang="sass" scoped>
.card-bg
  min-height: 180px
  background-image: url("../../assets/img/bg/create-bg.png")
  background-position: center
  background-repeat: no-repeat
  background-size: cover
</style>
