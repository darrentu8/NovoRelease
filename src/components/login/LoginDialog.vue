<template>
  <div class="login">
    <!-- LOGIN TAB視窗 -->
    <q-card class="">
      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="loginForm" @submit.stop="onSubmit" class="q-gutter-md">
          <div class="border-b-primary q-my-lg q-pb-xs flex justify-center items-end">
            <span class="text-h5">
              Novo Management
            </span>
            <!-- <span class="text-primary cursor-pointer" @click="toRegister">Create account</span> -->
          </div>
          <q-input autocomplete autofocus outlined class="q-mt-xs" :dense="dense" type="text" v-model="username"
            label="Username" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input label="Password" outlined class="q-mt-xs" :dense="dense" v-model="password"
            :type="isPwd ? 'password' : 'text'" hint="Password with toggle" lazy-rules :rules="[
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
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from 'src/stores/common'
const commonStore = useCommonStore()
const router = useRouter()

const loginForm = ref(null)
const dense = ref(false)
const isPwd = ref(true)
const username = ref('')
const password = ref('')

const onSubmit = () => {
  loginForm.value.validate().then(success => {
    if (success) {
      const loginData = {
        username: username.value,
        password: password.value
      }
      commonStore.LoginAndSetToken(loginData).then(() => {
        router.push({ path: '/product' })
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
}
</script>
<style lang="sass" scoped>
.login
  width: 100vw
  height: calc(100vh - 150px)
  min-height: 500px
  display: flex
  justify-content: center
  align-self: center
  align-items: center
  align-content: center
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
