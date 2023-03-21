<template>
  <q-page class="flex flex-center q-mx-auto" style="max-width: 1250px;">
    <div class="started row justify-center items-center">
      <div class="col-5 text-left">
        <h3 class="q-my-none text-primary text-light">Bring your idea to everyone</h3>
        <img class="full-width q-my-lg" :src="logoG" alt="title" style="max-width:710px;">
        <img class="q-mt-lg cursor-pointer" :src="startedBtn" alt="" @click="getStart">
      </div>
      <div class="col-7">
        <img class="full-width" :src="started" alt="">
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      logoG: require('../assets/img/logo/cloud-with-icon-color.svg'),
      title: 'NovoConnect Cloud',
      started: require('../assets/img/bg/started.svg'),
      startedBtn: require('../assets/img/icon/get-started.svg'),
      showSign: false
    }
  },
  computed: {
    ...mapState('auth', ['uid'])
  },
  mounted() {
    this.$emit('changeBgG', true)
  },
  methods: {
    getStart() {
      const UID = this.$store.dispatch['auth/GetUID']
      if (UID) {
        this.$router.push({ name: 'files' })
      } else {
        this.showSign = true
        this.$router.push({ name: 'login' })
      }
      // this.$refs.loginForm.validate().then(success => {
      //   if (success) {
      //     const loginData = {
      //       email: this.email,
      //       password: this.password
      //     }
      //     this.$store.dispatch('auth/loginAndSetUid', loginData)
      //   } else {
      //     this.$q.notify({
      //       color: 'red-5',
      //       textColor: 'white',
      //       icon: 'warning',
      //       message: 'You need to filled'
      //     })
      //   }
      // })
    }
  }
})
</script>
<style lang="sass">
.started
  h3
    font-weight: 300
    font-size: 32px
</style>
