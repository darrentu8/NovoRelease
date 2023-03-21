<template>
  <div class="register">
    <div class="register-wrap row">
      <div class="ad flex items-center justify-start">
        <div class="content">
          <div class="q-ml-lg">
            <!-- <h5 class="title left text-bold q-my-xs">NovoConnect Cloud</h5> -->
            <p class="sub q-mt-md">
              Sign in or create an account
            </p>
          </div>
        </div>
      </div>
      <div class="registerStep">
        <div class="text-center">
          <h5 class="title right q-my-xs">Create Account</h5>
          <h6 class="title right sub q-my-none">
          </h6>
        </div>
        <q-card-section class="q-mx-lg q-my-none">
          <q-form ref="regForm" class="q-gutter-md q-mx-auto q-mb-lg" @submit.stop="onSubmit" style="max-width: 530px">
            <div class="row q-col-gutter-x-md">
              <div class="col-12">
                <q-input bg-color="white" rounded="rounded" outlined="outlined" :dense="dense" type="text"
                  v-model="data.email" label="Email (Your Future Login ID)" lazy-rules="lazy-rules"
                  :rules="[checkEmail]" />
              </div>
              <div class="col-6">
                <q-input bg-color="white" rounded="rounded" outlined="outlined" :dense="dense" type="text"
                  v-model="data.firstName" label="First Name" lazy-rules="lazy-rules" :rules="[
                    (val) =>
                      (val !== null && val !== '') ||
                      'Please enter your first Name',
                  ]"></q-input>
              </div>
              <div class="col-6">
                <q-input bg-color="white" rounded="rounded" outlined="outlined" :dense="dense" type="text"
                  v-model="data.lastName" label="Last Name" lazy-rules="lazy-rules" :rules="[
                    (val) =>
                      (val !== null && val !== '') ||
                      'Please enter your last Name',
                  ]"></q-input>
              </div>
              <div class="col-6">
                <q-input bg-color="white" rounded="rounded" outlined="outlined" :dense="dense" v-model="data.password"
                  :type="isPwd ? 'password' : 'text'"
                  hint="Enter a combination of at least eight numbers, letters and punctuation marks (likes ! and &)."
                  lazy-rules="lazy-rules" @change="checkConfirmPassword" :rules="[
                    (val) =>
                      (val !== null && val !== '') || 'Please enter password',
                    checkPassword
                  ]">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input ref="confirmPassword" bg-color="white" rounded="rounded" outlined="outlined" :dense="dense"
                  v-model="data.confirmPassword" :type="isPwdC ? 'password' : 'text'"
                  hint="Confirm Password with toggle" lazy-rules="lazy-rules" :rules="[
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
              </div>
              <p class="text-black full-width q-my-lg">
                By clicking 'Create Account', you agree to our
                <router-link target='_blank' class="text-primary underline" to="/terms">Terms of Use</router-link>
              </p>
              <div class="flex full-width justify-between q-mt-lg items-center">
                <a class="text-primary underline" flat="flat" dense="dense" href="javascript:;"
                  @click="openResendDialog">Resend Activation Email?</a>
                <!--  <a flat dense class="link-btn text-center text-bold text-primary" @click="openResendDialog">What's Next</a> -->
                <q-btn class="pull-right" square="square" unelevated="unelevated" size="lg" label="Create Account"
                  type="submit" color="primary" :loading="loading"></q-btn>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import ResendDialog from 'src/components/login/ResendDialog'

export default defineComponent({
  mixins: [inputRules],
  name: 'RegisterDialog',
  props: {},
  components: {},
  created() {
    this.data.region = this.organizations.find(
      (o) => o.value === this.data.region
    )
    this.data.user = this.userType.find((o) => o.value === this.data.user)
  },
  data() {
    return {
      loading: false,
      isPwd: true,
      isPwdC: true,
      dense: true,
      organizationType: 'first',
      orgidA: '',
      orgidB: '',
      data: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        orgname: '',
        orgid: '',
        region: 0,
        user: 0,
        reseller: ''
      },
      organizations: [
        { label: 'USA, Canada, and Latin America', value: 0 },
        { label: 'Europe, Middle East and Africa', value: 1 },
        { label: 'Asia &amp; Australia', value: 2 },
        { label: 'Others', value: 3 }
      ],
      userType: [
        { label: ' an end user', value: 0 },
        { label: ' a reseller', value: 1 }
      ]
    }
  },
  computed: {
    ConfirmPWD() {
      return (val) => val === this.data.password || 'Passwords do not match'
    }
  },
  mounted() {
  },
  methods: {
    checkConfirmPassword() {
      this.$refs.confirmPassword.resetValidation()
    },
    openResendDialog() {
      this.$q
        .dialog({
          component: ResendDialog
        })
    },
    onSubmit() {
      this.$refs.regForm.validate().then(success => {
        if (success) {
          const formData = {
            email: this.data.email,
            fname: this.data.firstName,
            lname: this.data.lastName,
            password: this.data.password,
            region: this.data.region.value,
            orgid: this.orgidA + '-' + this.orgidB,
            orgname: this.data.orgname,
            reseller: this.data.reseller
          }
          this.$store.commit('auth/setRegEmail', this.data.email)
          this.$store.dispatch('auth/Reg', formData)
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
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap')
.register
  width: 100vw
  background-color: #E9E9E9
  .register-wrap
    padding-right: 5vw
    margin: 0px auto
    .q-field__before span
      font-size: 14px
    .title
      &.left
        font-size: 40px
        letter-spacing: -1px
        &.sub
          font-size: 15px
          line-height: 25px
          letter-spacing: 1px
      &.right
        font-size: 28px
        letter-spacing: -1px
        text-align: center
        &.sub
          text-align: center
          font-weight: normal
          text-transform: unset
          // padding: 10px
          font-size: 15px
          letter-spacing: 1px

    .ad
      width: 45%
      padding-left: 3vw
      min-height: calc(100vh - 150px)
      background-color: #F2F2F2
      background-image: url(src/assets/img/bg/register-bg.svg)
      background-position: top right
      background-size: cover
      background-repeat: no-repeat
      float: left
      position: relative
      // height: 789px
      .content
        padding: 30px 0px
        font-size: 14px
        line-height: 24px
      .sub
        font-size: 22px

    .registerStep
      width: 55%
      min-height: calc(100vh - 150px)
      // padding-top: 20px
      padding-top: 150px
      float: left
      background-color: #E9E9E9

@media (max-width: 1200px)
  .register
    height: 100%

@media (max-width: 768px)
  .register
    .registerStep
      width: 100%
    .ad
      display: none
</style>
