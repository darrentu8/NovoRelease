<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%; max-width: 370px;">
      <q-card-section class="q-mx-lg">
        <div class="border-b-primary q-mt-md q-pb-xs flex justify-between items-end">
          <span class="text-h5">
            Resend Activation Email
          </span>
        </div>
      </q-card-section>

      <q-card-section class="q-mx-lg">
        <p class="q-mb-lg">
          Enter your email address below to have your activation email resent to you.
        </p>
        <q-form ref="resendForm" @submit.stop="resendSubmit" class="q-gutter-md">
          <q-input autofocus outlined class="q-mt-xs" :dense="dense" type="text" v-model="email" label="Email" lazy-rules
            :rules="[checkEmail]">
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-card-actions class="q-mt-xs q-pa-none justify-center">
            <q-btn outlined unelevated size="lg" class="full-width q-mb-xs" label="Resend" type="submit"
              color="primary" />
            <q-btn flat class="full-width text-center text-bold text-primary" @click="hide">Cancel</q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import inputRules from 'src/mixins/inputRules.js'

export default defineComponent({
  name: 'ResendDialog',
  mixins: [inputRules],
  setup() {
    const email = ref(null)
    const password = ref(null)

    return {
      model: null,
      dense: ref(false),
      isPwd: ref(true),
      fullWidth: ref(false),
      fullHeight: ref(false),
      email,
      password
    }
  },
  methods: {
    resendSubmit() {
      this.$refs.resendForm.validate().then(success => {
        if (success) {
          const emailData = {
            email: this.email
          }
          this.$store.dispatch('auth/Resend', emailData)
            .then((response) => {
              // console.log(response)
              // if (response) {
              //   this.$refs.dialog.hide()
              //   this.$q.notify({
              //     color: 'primary',
              //     position: 'top',
              //     textColor: 'white',
              //     icon: 'check_circle',
              //     message: 'Resend Success!'
              //   })
              // }
            })
        } else {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Resend filled'
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
