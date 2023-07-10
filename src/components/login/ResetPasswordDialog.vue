<template>
  <div class="login">
    <q-card>
      <q-card-section class="q-pa-none text-white non-selectable bg-brand-black">
        <div class="card-title text-center">Reset Password</div>
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <p class="brand-title">EMAIL WAS SENT TO {{ $route.params.email }}</p>
        <p class="text-brand-gery" style="word-break:break-all;">
          Click the link we sent to reset your password. If you did not receive an email, please check your Spam folder.
        </p>
        <q-card-actions class="q-mt-xs q-pa-none" vertical>
          <q-btn square unelevated size="lg" class="full-width q-mb-xs" label="BACK TO LOGIN" @click="backToLogin"
            color="primary" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import ResendDialog from 'src/components/login/ResendDialog'

export default defineComponent({
  name: 'ResetPasswordDialog',
  mixins: [inputRules],
  props: {
  },
  data() {
    return {
      loading: false,
      dense: false
    }
  },
  computed: {
    email() {
      return this.$route.params.email
    }
  },
  mounted() {
    console.log('this.$route.params.email', this.$route.params.email)
  },
  methods: {
    backToLogin() {
      this.$router.push({ path: '/' })
    },
    openResendDialog() {
      this.$q
        .dialog({
          component: ResendDialog
        })
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
    .card-title
      font-family: "Noto Sans SC", "Noto Sans TC", sans-serif
      font-weight: 500
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
