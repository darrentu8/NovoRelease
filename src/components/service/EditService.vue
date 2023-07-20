<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Edit Service</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="editService">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input filled class="q-mt-xs" type="text" v-model="data.name" label="Name" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a service name']">
              </q-input>
              <q-file v-model="data.img" class="q-mt-xs q-mb-lg" label="Upload Image" filled
                @update:model-value="handleUpload()">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" />
                </template>
              </q-file>
              <q-input filled class="q-mt-xs" type="text" v-model="data.url" label="URL" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a service URL']">
              </q-input>
              <div class="q-gutter-sm flex items-center">
                <span>Status:</span>
                <q-toggle :label="data.state == 1 ? 'Enable' : 'Disable'" true-value="1" false-value="0" color="primary"
                  v-model="data.state" checked-icon="check" unchecked-icon="clear" />
              </div>

            </div>
            <div class="col-6">
              <div class="bg-grey-3 q-pa-md q-mt-lg">
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
  name: 'EditServiceDialog',
  mixins: [inputRules],
  data() {
    return {
      dense: true,
      data: {
        id: '',
        name: '',
        state: '0',
        url: '',
        img: ''
      },
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
  },
  methods: {
    handleUpload() {
      if (this.data.img) {
        this.imageUrl = URL.createObjectURL(this.data.img)
      }
      const file = this.data.img
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
      // if (!this.image) {
      //   this.$q.notify({
      //     color: 'red-5',
      //     textColor: 'white',
      //     icon: 'warning',
      //     message: 'Please upload a image'
      //   })
      //   return
      // }
      this.$refs.Form.validate().then(success => {
        this.$store.commit('service/setLoading', true)
        // console.log('this.userData', this.userData)
        if (success) {
          const formData = new FormData()
          formData.append('name', this.data.name)
          formData.append('img', this.data.img ? this.data.img : this.currentService.img)
          formData.append('state', Number(this.data.state))
          formData.append('url', this.data.url)
          this.$store.dispatch('service/editService', formData)
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
