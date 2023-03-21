<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%; max-width: 350px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Change Password</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form ref="ResetPasswordForm" @submit.stop="changePasswordSubmit" class="q-gutter-md q-pt-md q-px-md">
          <q-input label="New Password" bg-color="white" autofocus outlined v-model="editProfile.password"
            :type="isPwd ? 'password' : 'text'" hint="Password with toggle" lazy-rules="lazy-rules" :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please enter password',
              checkPassword
            ]" @change="checkConfirmPassword">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <q-input label="Confirm Password" class="q-mb-lg" ref="confirmPassword" bg-color="white" outlined
            v-model="editProfile.confirmPassword" :type="isPwdC ? 'password' : 'text'"
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
          <q-card-actions class="q-mt-lg q-pa-none justify-center">
            <q-btn outlined unelevated size="lg" class="full-width q-mb-xs" label="Save" type="submit"
              color="primary" />
            <q-btn flat class="full-width text-center text-bold text-primary" @click="hide">Cancel</q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'ChangePasswordDialog',
  mixins: [inputRules],
  data() {
    return {
      isPwd: true,
      isPwdC: true,
      editProfile: {},
      password: '',
      confirmPassword: '',
      imageUrl: '',
      imageFile: null
    }
  },
  computed: {
    ConfirmPWD() {
      return (val) => val === this.editProfile.password || 'Passwords do not match'
    },
    ...mapState('auth', ['userData', 'currentProfile'])
  },
  mounted() {
    this.reset()
    this.editProfile = Object.assign({}, this.currentProfile)
  },
  methods: {
    reset() {
      this.password = ''
      this.confirmPassword = ''
    },
    checkConfirmPassword() {
      this.$refs.confirmPassword.resetValidation()
    },
    avatarName() {
      if (this.editProfile) {
        const f = this.editProfile.fname.charAt(0).toUpperCase()
        const l = this.editProfile.lname.charAt(0).toUpperCase()
        return f + l
      } else {
        return ''
      }
    },
    changePasswordSubmit() {
      this.$refs.ResetPasswordForm.validate().then(success => {
        if (success) {
          const Data = {
            newpassword: this.editProfile.password,
            uid: this.$store.getters['auth/getUID']
          }
          this.$store.dispatch('user/changePassword', Data)
            .then(() => {
              this.$refs.dialog.hide()
              // this.$q.notify({
              //   color: 'primary',
              //   position: 'bottom',
              //   textColor: 'white',
              //   icon: 'check_circle',
              //   message: 'Change password success!'
              // })
            })
        } else {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Password need filled'
          })
        }
      })
    },
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
