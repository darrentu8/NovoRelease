<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Create New System Announcement</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createDevice">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input filled class="q-mt-xs" type="text" v-model="data.title" label="Title" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a title']">
              </q-input>
              <div class="q-gutter-sm flex items-center">
                <span>Tag:</span>
                <q-radio v-model="data.tag" val="new" label="New" />
                <q-radio v-model="data.tag" val="fixed" label="Fixed" />
                <q-radio v-model="data.tag" val="support" label="Support" />
              </div>
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
  name: 'CreatAnnDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      data: {
        title: '',
        state: '',
        tag: 'new',
        udate: '',
        content: ''
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
        title: '',
        state: '',
        tag: 'new',
        udate: '',
        content: ''
      }
    },
    createAnn() {
      this.$refs.Form.validate().then(success => {
        this.$store.commit('ann/setLoading', true)
        // console.log('this.userData', this.userData)
        if (success) {
          this.$store.dispatch('ann/createAnn', this.data)
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
