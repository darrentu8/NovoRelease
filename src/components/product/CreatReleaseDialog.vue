<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Add New Release</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createProduct">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-file v-model="data.img" class="q-mt-xs q-mb-lg" label="Upload File" filled
                @update:model-value="handleUpload()">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" />
                </template>
              </q-file>
              <q-input filled class="q-mt-xs" type="text" v-model="data.version" label="Version" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product version']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.filename" label="Filename" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product filename']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.parameters" label="Parameters" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product parameters']">
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
  name: 'CreatProductDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      data: {
        name: '',
        appid: '',
        cdn: ''
      },
      image: null,
      imageUrl: ''
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
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl)
        this.image = null
        this.imageUrl = ''
      }
      this.data = {
        name: '',
        url: '',
        description: '',
        state: '0',
        img: ''
      }
    },
    handleUpload() {
      if (this.image) {
        this.imageUrl = URL.createObjectURL(this.image)
      }
      const file = this.image
      const typeCheck = file.type === 'image/svg' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
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
    createProduct() {
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
        this.$store.commit('product/setLoading', true)
        // console.log('this.userData', this.userData)
        if (success) {
          const formData = new FormData()
          formData.append('name', this.data.name)
          formData.append('img', this.image)
          formData.append('state', this.data.state)
          formData.append('url', this.data.url)
          formData.append('description', this.data.description)
          this.$store.dispatch('product/createProduct', formData)
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
