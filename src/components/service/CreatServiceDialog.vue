<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Create New Service</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createService">
          <div class="row q-col-gutter-md">
            <div :class="[imageUrl || data.img ? 'col-6' : 'col-12']">
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
              <q-input filled class="q-mt-xs" type="text" v-model="data.url" label="URL" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a service URL']">
              </q-input>
            </div>
            <div v-if="imageUrl || data.img" class="col-6">
              <div class="bg-grey-3 q-pa-md">
                <div v-if="imageUrl" class="">
                  <q-img :src="imageUrl" spinner-color="white" style="max-width: 300px; height: 200px;"
                    :fit="contain"></q-img>
                </div>
                <div v-else-if="data.img" class="">
                  <q-img :src="data.img" spinner-color="white" style="max-width: 300px; height: 200px;" :fit="contain">
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-gery text-white">
                        Cannot load image
                      </div>
                    </template>
                  </q-img>
                </div>
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
  name: 'CreatServiceDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      data: {
        name: '',
        url: '',
        img: ''
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
        img: ''
      }
    },
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
    createService() {
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
        this.$store.commit('service/setLoading', true)
        // console.log('this.userData', this.userData)
        if (success) {
          const formData = new FormData()
          formData.append('name', this.data.name)
          formData.append('img', this.image)
          formData.append('state', '0')
          formData.append('url', this.data.url)
          this.$store.dispatch('service/createService', formData)
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
