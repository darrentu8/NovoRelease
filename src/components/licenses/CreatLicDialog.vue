<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Create New Licenses</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createLic">
          <div class="row q-col-gutter-md">
            <div class="col-12 flex items-center">
              <span>Number of license:</span>
              <q-input hide-bottom-space filled dense class="q-ml-md" v-model.number="data.numberOfLicense" type="number"
                min="1" lazy-rules :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter number of license']">
              </q-input>
            </div>
            <div class="col-12 flex items-center">
              <span>Multiple of license:</span>
              <q-input :disable="!checkMultiple" hide-bottom-space filled dense bottom-slots class="q-ml-md"
                v-model.number="data.multipleOfLicense" type="number" min="1">
                <template v-if="checkMultiple" v-slot:hint>
                  <span>Result:</span>
                  <span class="q-ml-md">{{ data.numberOfLicense }} x {{ data.multipleOfLicense }} = {{
                    (data.numberOfLicense * data.multipleOfLicense) }}</span>
                </template>
              </q-input>

              <q-toggle color="primary" v-model="checkMultiple" checked-icon="check" unchecked-icon="clear" />
            </div>
            <div class="col-12 flex items-center">
              <span>Duration(Months):</span>
              <q-input hide-bottom-space filled dense class="q-ml-md" v-model.number="data.duration" type="number" min="1"
                lazy-rules :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter duration']">
              </q-input>
            </div>
            <div class="col-12 flex items-center">
              <span class="">Comment:</span>
              <q-input style="width: 410px;" hide-bottom-space type="textarea" filled dense class="q-ml-md"
                v-model.number="data.comment" lazy-rules :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter comment']">
              </q-input>
            </div>
          </div>
          <q-card-actions class="q-mt-lg q-pa-none" align="right">
            <q-btn unelevated class="q-mb-xs q-px-lg" label="Create" type="submit" color="primary" />
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
  name: 'CreatLicDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      checkMultiple: false,
      data: {
        numberOfLicense: 1,
        multipleOfLicense: 1,
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
    createLic() {
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
          this.$store.dispatch('lic/createLic', Data)
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
