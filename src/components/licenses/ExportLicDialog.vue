<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Export Licenses</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="exportLic">
          <div class="row q-col-gutter-md">
            <div class="col-12 flex items-center">
              <span>Export by comment:</span>
            </div>
            <div class="col-12 flex items-center">
              <span class="">Comment:</span>
              <q-input style="width: 410px;" hide-bottom-space type="textarea" rows="1" filled dense class="q-ml-md"
                v-model.number="data.comment" lazy-rules :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter comment']">
              </q-input>
            </div>
          </div>
          <q-card-actions class="q-mt-lg q-pa-none">
            <q-btn unelevated class="q-mx-auto q-mb-xs q-px-lg" label="Export" type="submit" color="primary" />
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
  name: 'ExportLicDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      data: {
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
        comment: ''
      }
    },
    exportLic() {
      this.$refs.Form.validate().then(success => {
        // this.$store.commit('lic/setLoading', true)
        if (success) {
          this.$store.dispatch('lic/exportLic', this.data)
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
