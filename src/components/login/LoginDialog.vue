<template>
  <div class="login">
    <!-- LOGIN TAB視窗 -->
    <q-card v-if="!joinPop" class="">
      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="loginForm" v-if="!forgot" @submit.stop="onSubmit" class="q-gutter-md">
          <div class="border-b-primary q-my-lg q-pb-xs flex justify-between items-end">
            <span class="text-h5">
              Sign in
            </span>
            <!-- <span class="text-primary cursor-pointer" @click="toRegister">Create account</span> -->
          </div>
          <q-input autocomplete autofocus outlined class="q-mt-xs" :dense="dense" type="text" v-model="email"
            label="Email" lazy-rules>
            <!-- <q-input autocomplete autofocus outlined class="q-mt-xs" :dense="dense" type="text" v-model="email"
            label="Email" lazy-rules :rules="[checkEmail]"> -->
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input outlined class="q-mt-xs" :dense="dense" v-model="password" :type="isPwd ? 'password' : 'text'"
            hint="Password with toggle" lazy-rules :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please enter your password',
            ]">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <q-card-actions class="q-mt-xs q-pa-none" vertical>
            <q-btn outlined unelevated size="lg" class="full-width q-my-lg" label="Sign in" type="submit"
              color="primary" />
            <!-- <a flat dense class="link-btn text-center text-bold text-primary" @click="forgot = !forgot">Forgot Your
              Password</a>
            <a flat dense class="link-btn text-center text-bold text-primary" @click="openResendDialog">Resend
              Activation Email?</a> -->
          </q-card-actions>
        </q-form>

        <q-form ref="forgotForm" v-else @submit.stop="forgotSubmit" class="q-gutter-md">
          <div>
            <h6 class="cardTitle">Forgot Your Password?</h6>
            <p class="cardContent">
              Enter your email address below and we will send you a secure link
              to reset your password.
            </p>
          </div>
          <q-input outlined class="q-mt-xs" :dense="dense" type="text" v-model="email" label="Email" lazy-rules
            :rules="[checkEmail]">
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-card-actions class="q-mt-xs q-pa-none" vertical>
            <q-btn outlined unelevated size="lg" class="full-width q-mb-xs" label="RESET PASSWORD" type="submit"
              color="primary" :loading="loading" />
            <q-btn flat dense class="text-center text-bold text-primary" @click="forgot = !forgot">Cancel</q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import ResendDialog from 'src/components/login/ResendDialog'

export default defineComponent({
  name: 'LoginDialog',
  mixins: [inputRules],
  props: {
  },
  data() {
    return {
      title: 'NovoConnect Cloud',
      logo: require('../../assets/img/logo/cloud.svg'),
      loginType: 'login',
      loading: false,
      dense: false,
      forgot: false,
      resendPop: false,
      isPwd: true,
      isPwdMy: true,
      joinPop: '',
      email: '',
      password: '',
      roomid: '',
      roomData: {
        roomid: '',
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    toRegister() {
      const _self = this
      _self.$router.push({ path: '/register' })
    },
    openResendDialog() {
      this.$q
        .dialog({
          component: ResendDialog
        })
    },
    forgotSubmit() {
      this.$refs.forgotForm.validate().then(success => {
        if (success) {
          const emailData = {
            email: this.email
          }
          this.$store.dispatch('auth/SendForgot', emailData)
            .then((res) => {
              if (res.code === 'REQUEST_SET_PASSWORD') {
                this.forgot = false
                this.$router.push({ name: 'resetpassword', params: { email: this.email } })
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
    onSubmit() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          const loginData = {
            name: this.email,
            password: this.password
          }
          this.$store.dispatch('auth/loginAndSetBid', loginData)
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
    joinAsGuest() {
      this.$refs.joinForm.validate().then(success => {
        if (success) {
          this.joinPop = 'joinAsGuest'
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
    joinAsGuestSubmit() {
      if (!this.roomData.name) {
        // this.$refs.joinAsGuestForm.resetValidation()
        return
      }
      this.$refs.joinAsGuestForm.validate().then(success => {
        if (success) {
          const joinData = {
            roomid: this.roomid,
            name: this.roomData.name
          }
          console.log('joinData', joinData)
          this.$store.dispatch('auth/loginAndGuestRoom', joinData)
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
    joinWithMyAccount() {
      this.$refs.joinForm.validate().then(success => {
        if (success) {
          this.joinPop = 'joinWithMyAccount'
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
    joinWithMyAccountSubmit() {
      this.$refs.joinAsGuestForm.validate().then(success => {
        if (success) {
          const joinData = {
            roomid: this.roomid,
            name: this.roomData.name,
            password: this.roomData.password
          }
          // console.log('loginData', loginData)
          const res = this.$store.dispatch('auth/loginAndSetBid', joinData)
          // const res = this.$store.dispatch('auth/HandleLogin', loginData)
          console.log('res', res)
          if (res) {
            this.loading = false
            this.$router.push({ path: '/list/all' })
          } else {
            this.loading = false
          }
        } else {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to filled'
          })
        }
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
  padding-top: 150px
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
