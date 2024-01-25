<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Add New Bsp</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createBsp">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input filled class="q-mt-xs" type="text" v-model="data.appid" label="Product" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.model" label="model" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a model']">
              </q-input>
              <q-input filled class="q-mt-xs" type="textarea" rows="3" v-model="data.comment" label="Comment" lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter a comment']">
              </q-input>
            </div>
          </div>
          <q-card-actions class="q-mt-lg q-pa-none" align="right">
            <q-btn unelevated class="q-mb-xs q-px-lg" label="Apply" type="submit" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
export default defineComponent({
  name: 'CreatBspDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      checkMultiple: false,
      data: {
        numberOfBspense: 1,
        multipleOfBspense: 1,
        duration: 12,
        comment: ''
      }
    }
  },
  created() {
    this.reset()
  },
  computed: {
    userData() {
      return this.$store.state.auth.userData
    }
  },
  methods: {
    reset() {
      this.data = {
        numberOfLicense: 1,
        multipleOfLicense: 1,
        duration: 12,
        comment: ''
      }
    },
    createBsp() {
      const Data = {
        numberOfLicense: this.data.numberOfLicense,
        duration: this.data.duration,
        comment: this.data.comment
      }
      if (this.checkMultiple) {
        Data.multipleOfLicense = this.data.multipleOfLicense
      }
      this.$refs.Form.validate().then(success => {
        this.$store.commit('lic/setLoading', true)
        if (success) {
          this.$store.dispatch('lic/createBsp', Data)
            .then(() => {
              this.$refs.dialog.hide()
              this.reset()
            })
        } else {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Need filled'
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
