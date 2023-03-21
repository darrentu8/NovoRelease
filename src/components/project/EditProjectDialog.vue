<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%; max-width: 400px;">
      <q-card-section class="">
        <div class="text-h6 text-bold">Rename</div>
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="submitEdit">
          <q-input autofocus square filled class="q-mt-xs" :dense="dense" type="text" v-model="editData.name"
            label="Project name" lazy-rules :rules="[
          (val) =>
            (val !== null && val !== '') || 'Please enter a project name']">
          </q-input>
          <q-card-actions class="q-mt-lg q-pa-none" align="right">
            <q-btn flat class="text-center text-bold text-primary" @click="hide">Cancel</q-btn>
            <q-btn square unelevated class="q-mb-xs q-px-lg" label="Apply" type="submit" color="primary" />
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
  name: 'EditProjectDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      editData: {},
      user_id: [],
      ownerType: []
    }
  },
  created() {
  },
  computed: {
    ...mapState('project', ['editProjectData'])
  },
  mounted() {
    this.editData = Object.assign({}, this.editProjectData)
  },
  methods: {
    // reset() {
    //   this.data = {
    //     name: '',
    //     user_id: [
    //       {
    //         name: 'Myself',
    //         value: this.userData.id
    //       }
    //     ],
    //     approve: 0,
    //     uid: ''
    //   }
    // },
    submitEdit() {
      this.$refs.Form.validate().then(success => {
        console.log('this.editData', this.editData)
        if (success) {
          this.$store.dispatch('project/editFile', this.editData)
            .then(() => {
              this.$store.dispatch('project/getFiles')
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
