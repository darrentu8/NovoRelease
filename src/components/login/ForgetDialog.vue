<template>
  <div class="login">
    <q-card v-if="!checkUUID">
      <q-card-section class="q-pa-none text-white non-selectable bg-brand-black">
        <div class="card-title text-center">Reset Password</div>
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <p class="brand-title">LINK ERROR</p>
        <p class="text-brand-gery q-mb-lg">Please check your email link.</p>
        <q-card-actions class="q-mt-xs q-pa-none" vertical>
          <q-btn square unelevated size="lg" class="full-width q-mb-xs" label="BACK TO LOGIN" @click="backToLogin"
            color="primary" />
        </q-card-actions>
      </q-card-section>
    </q-card>
    <q-card v-else>
      <q-card-section class="q-pa-none text-white non-selectable bg-brand-black">
        <div class="card-title text-center">Reset Password</div>
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" @submit.stop="sendReset" class="q-gutter-md">
          <q-input outlined class="q-mt-xs" :dense="dense" type="text" v-model="data.email" label="Email" lazy-rules
            :rules="[checkEmail]">
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
          <q-input outlined :dense="dense" v-model="data.newpassword" :type="isPwd ? 'password' : 'text'"
            hint="Password with toggle" lazy-rules="lazy-rules" @change="checkConfirmPassword" :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please enter password',
              checkPassword
            ]">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <q-input outlined ref="confirmPassword" :dense="dense" v-model="data.confirmPassword"
            :type="isPwdC ? 'password' : 'text'" hint="Confirm Password with toggle" lazy-rules="lazy-rules" :rules="[
              (val) =>
                (val !== null && val !== '') ||
                'Please enter your password',
              checkPassword,
              ConfirmPWD
            ]">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwdC = !isPwdC" />
            </template>
          </q-input>

          <q-card-actions class="q-mt-xs q-pa-none justify-center">
            <q-btn square unelevated size="lg" class="full-width q-mt-lg q-mb-xs" label="CHANGE PASSWORD" type="submit"
              color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'

export default defineComponent({
  name: 'ForgetDialog',
  mixins: [inputRules],
  props: {
  },
  data() {
    return {
      loading: false,
      checkUUID: false,
      isPwd: true,
      isPwdC: true,
      dense: false,
      data: {
        email: '',
        newpassword: '',
        confirmPassword: ''
      }
    }
  },
  created() {
    this.checkActive()
  },
  computed: {
    ConfirmPWD() {
      return (val) => val === this.data.newpassword || 'Passwords do not match'
    }
  },
  methods: {
    checkConfirmPassword() {
      this.$refs.confirmPassword.resetValidation()
    },
    checkActive() {
      const uuid = this.$router.currentRoute.value.query.uuid
      console.log('uuid', this.$router.currentRoute.value.query.uuid)
      if (uuid) {
        this.loading = false
        this.checkUUID = true
      } else {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Error'
        })
      }
    },
    sendReset() {
      this.$refs.Form.validate().then(success => {
        if (success) {
          const UUID = this.$router.currentRoute.value.query.uuid
          console.log('uuid', this.$router.currentRoute.value.query.uuid)
          const Data = {
            uuid: UUID,
            newpassword: this.data.newpassword,
            email: this.data.email
          }
          this.$store.dispatch('auth/ResetForgot', Data)
            .then((res) => {
              if (res.code === 'USER_PASSWORD_UPDATE') {
                this.checkUUID = true
                this.$router.push({ path: '/' })
              }
            })
        } else {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to filled'
          })
        }
      })
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
