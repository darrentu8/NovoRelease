<template>
  <div class="login">
    <q-card v-if="activeReady">
      <q-card-section class="q-pa-none text-white non-selectable bg-brand-black">
        <div class="card-title text-center">Account Activation</div>
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <p class="brand-title">Activation was successful.</p>
        <p class="text-brand-gery q-mb-lg">Your account activated successfully.</p>
        <q-card-actions class="q-mt-xs q-pa-none" vertical>
          <q-btn unelevated size="lg" class="full-width q-mb-xs" label="BACK TO LOGIN" @click="backToLogin"
            color="primary" />
        </q-card-actions>
      </q-card-section>
    </q-card>
    <q-card v-else>
      <q-card-section class="logo-bar flex flex-center q-pa-none text-white non-selectable bg-brand-black">
        <q-img :src="logo" spinner-size="17px" :alt="title" style="width:180px;height:auto;" />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <p class="brand-title">This link is expired.</p>
        <p class="text-brand-gery q-mb-lg">Ooops~ looks like this link is expired, Please
          create account again.</p>
        <q-card-actions class="q-mt-xs q-pa-none" vertical>
          <q-btn unelevated size="lg" class="full-width q-mb-xs" label="BACK TO LOGIN" @click="backToLogin"
            color="primary" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'

export default defineComponent({
  name: 'ActiveDialog',
  mixins: [inputRules],
  props: {
  },
  data() {
    return {
      title: 'NovoConnect Cloud',
      logo: require('../../assets/img/logo/cloud.svg'),
      loading: false,
      activeReady: false,
      dense: false
    }
  },
  created() {
    this.checkActive()
  },
  methods: {
    checkActive() {
      const uuid = this.$router.currentRoute.value.query.uuid
      // console.log('uuid', this.$router.currentRoute.value.query.uuid)
      if (uuid) {
        this.$store.dispatch('auth/Active', { uuid })
          .then((res) => {
            if (res.response.status !== 200) {
              this.loading = false
              this.activeReady = false
            } else {
              this.loading = false
              this.activeReady = true
            }
          }
          )
          .catch((error) => {
            // console.log(error.response.data)
            this.$q.notify({
              color: 'orange',
              textColor: 'white',
              icon: 'notifications',
              caption: error.response.data.code,
              message: error.response.data.description
            })
          })
      } else {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Error'
        })
      }
    },
    backToLogin() {
      this.$router.push({ path: '/' })
    }
  }
})
</script>
<style lang="sass" scoped>
.login
  width: 100vw
  height: calc(100vh - 150px)
  min-height: 500px
  display: flex
  justify-content: center
  align-self: center
  align-items: flex-start
  align-content: center
  padding-top: 100px
  .q-card
    width: 100%
    height: auto
    max-width: 350px
    box-shadow: rgb(0 0 0 / 54%) -4px 37px 29px -25px
    .logo-bar
      height: 70px
    .card-title
      font-family: DeltaSans-Light
      font-weight: 300
      letter-spacing: 1px
      height: 70px
      padding-top: 30px
      text-align: center
      line-height: 10px
      font-size: 16px

@media (max-width: 1400px)
  .login
    padding-top: 20px
    height: 100%
    padding-bottom: 20px
@media (max-width: 1200px)
  .login
    padding-top: 20px
    height: 100%
    padding-bottom: 20px
</style>
