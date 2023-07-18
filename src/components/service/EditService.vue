<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%; max-width: 400px;">
      <q-card-section class="">
        <div class="text-h6 text-bold">Edit Service</div>
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="editService">
          <q-input filled class="q-mt-xs" type="text" v-model="data.name" label="Name" lazy-rules :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please enter a service name']">
          </q-input>
          <q-file v-model="image" class="q-mt-xs q-mb-lg" label="Upload Image" filled
            @update:model-value="handleUpload()">
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
import { mapState } from 'vuex'

export default defineComponent({
  name: 'EditServiceDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      data: {
        id: '',
        name: '',
        url: '',
        img: ''
      },
      image: null,
      imageUrl: ''
    }
  },
  created() {
  },
  computed: {
    ...mapState('service', ['currentService'])
  },
  mounted() {
    this.data = Object.assign({}, this.currentService)
    this.imageUrl = this.currentService.img
  },
  methods: {
    handleUpload() {
      if (this.image) {
        this.imageUrl = URL.createObjectURL(this.image)
      }
      const file = this.image
      const typeCheck = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
      if (!typeCheck) {
        this.$q.notify({
          color: 'red-5',
          position: 'bottom',
          textColor: 'white',
          icon: 'error',
          message: 'The format is wrong, please re-upload!'
        })
        return
      }
      // // 限制2MB
      // if (file.size > 2000000) {
      //   this.$q.notify({
      //     color: 'red-5',
      //     position: 'bottom',
      //     textColor: 'white',
      //     icon: 'error',
      //     message: 'The file is too large, please re-upload!'
      //   })
      //   return
      // }
      this.imageUrl = URL.createObjectURL(file)
    },
    editService() {
      if (!this.image) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Please upload a image'
        })
        return
      }
      this.$refs.Form.validate().then(success => {
        // console.log('this.userData', this.userData)
        if (success) {
          const formData = new FormData()
          formData.append('name', this.data.name)
          formData.append('img', this.image)
          formData.append('state', '1')
          formData.append('url', this.data.url)
          this.$store.dispatch('service/editService', formData)
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
