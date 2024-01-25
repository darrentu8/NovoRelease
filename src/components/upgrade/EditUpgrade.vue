<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Edit Upgrade Number</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="editService">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <!-- <q-input filled class="q-mt-xs" type="text" v-model="data.osid" label="OsId" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a osid']">
              </q-input> -->
              <q-input borderless disable class="q-mt-xs" type="text" v-model="data.comment" label="Comment" lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter a comment']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.version" label="Version" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a version']">
              </q-input>
            </div>
          </div>
          <q-card-actions class="q-mt-lg q-pa-none" align="right">
            <q-btn unelevated class="q-mb-xs q-px-lg" label="Update" type="submit" color="primary" />
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
  name: 'EditUpgradeDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      data: {
        id: '',
        osid: '',
        version: '',
        comment: ''
      }
    }
  },
  created() {
  },
  computed: {
    ...mapState('upgrade', ['currentUpgrade'])
  },
  mounted() {
    this.data = Object.assign({}, this.currentUpgrade)
  },
  methods: {
    editService() {
      this.$refs.Form.validate().then(success => {
        this.$store.commit('upgrade/setLoading', true)
        // console.log('this.userData', this.userData)
        if (success) {
          this.$store.dispatch('upgrade/editUpgrade', this.data)
            .then(() => {
              this.$refs.dialog.hide()
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
