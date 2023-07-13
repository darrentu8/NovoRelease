<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%; max-width: 400px;">
      <q-card-section class="">
        <div class="text-h6 text-bold">Create New Service</div>
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createProject">
          <q-input filled class="q-mt-xs" type="text" v-model="data.name" label="Name" lazy-rules :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please enter a service name']">
          </q-input>
          <q-file v-model="image" class="q-mt-xs" label="Upload Image" filled @update:model-value="handleUpload()" :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please select a image']">
            <template v-slot:prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file>
          <div v-if="imageUrl" class="q-mb-lg">
            <q-img :src="imageUrl" spinner-color="white" style="max-height: 100px; max-width: 320px;"></q-img>
          </div>
          <q-input filled class="q-mt-xs" type="text" v-model="data.url" label="URL" lazy-rules :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please enter a service URL']">
          </q-input>
          <q-card-actions class="q-mt-lg q-pa-none" align="right">
            <q-btn flat class="text-center text-bold text-primary" @click="hide">Cancel</q-btn>
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
  name: 'CreateDeviceDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      data: {
        name: '',
        user_id: '',
        approve: '1',
        uid: ''
      },
      image: null,
      imageUrl: ''
    }
  },
  computed: {
    userData() {
      return this.$store.state.auth.userData
    }
  },
  methods: {
    handleUpload() {
      console.log('handleUpload is triggered')
      if (this.image) {
        this.imageUrl = URL.createObjectURL(this.image)
      }
    },
    reset() {
      this.data = {
        name: '',
        image: '',
        url: ''
      }
    },
    createProject() {
      this.$refs.Form.validate().then(success => {
        // console.log('this.userData', this.userData)
        if (success) {
          const Data = {
            name: this.data.name,
            image: this.data.image,
            url: this.data.url
          }
          this.$store.dispatch('project/createProject', Data)
            .then(() => {
              this.$refs.dialog.hide()
              this.reset()
            })
            .then(() => {
              this.$store.commit('project/setLoading', true)
              setTimeout(() => {
                this.$store.dispatch('project/getProject')
              }, 2000)
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
