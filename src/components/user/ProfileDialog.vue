<template>
  <q-dialog ref="dialog">
    <q-card style="width: 100%; max-width: 400px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Profile</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
        <div style="height:0px">
          <input id="upload_avatar_image" hidden type="file" accept="image/*," @change="updateAvatar" />
        </div>
      </q-card-section>
      <!-- 自己 -->
      <q-card-section v-if="ID == editProfile.user_id && !showCrop" class="show-Avatar">
        <q-form ref="ProfileForm" @submit.stop="ProfileSubmit" class="q-gutter-md">
          <div class="text-center">
            <!-- 有圖 -->
            <q-avatar v-if="editProfile.thumbnail && !refreshAvatar" size="100px" font-size="52px" color="grey-4"
              text-color="white">
              <q-icon class="editBtn" name="edit" @click="loadAvatar" />
              <q-img spinner-color="green" spinner-size="20px" :src="editProfile.thumbnail" />
            </q-avatar>
            <q-spinner v-else-if="refreshAvatar" class="q-ma-lg" color="primary" size="3em" :thickness="2" />
            <!-- 沒圖 -->
            <q-avatar v-else size="100px" font-size="40px" color="grey-4" text-color="white">
              {{ avatarName() }}
              <q-icon class="editBtn" name="edit" @click="loadAvatar" />
            </q-avatar>
          </div>
          <q-input autofocus outlined class="q-mt-lg" type="text" v-model="editProfile.fname" label="First Name"
            lazy-rules>
          </q-input>
          <q-input outlined class="q-mb-lg" type="text" v-model="editProfile.lname" label="Last Name" lazy-rules>
          </q-input>

          <q-card-actions class="q-mt-xs q-pa-none justify-center">
            <q-btn :disabled="refreshAvatar" outlined unelevated size="lg" class="full-width q-mb-xs" label="Save"
              type="submit" color="primary" />
            <q-btn :disabled="refreshAvatar" flat class="full-width text-center text-bold text-primary"
              @click="cancelSave">Cancel</q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>

      <!-- 裁切視窗 -->
      <q-card-section v-if="showCrop">
        <q-form ref="ProfileForm" class="q-gutter-md">
          <div class="text-center">
            <q-avatar v-if="!imageUrl && !editProfile.thumbnail" square size="300px" font-size="170px" color="grey-4"
              text-color="white">
              {{ avatarName() }}
            </q-avatar>
            <cropper @ready="ready" v-if="!imageUrl && editProfile.thumbnail" :stencil-component="stencil"
              ref="cropperRef" class="cropper" :src="editProfile.thumbnail" :stencil-props="{ aspectRatio: 1 / 1 }" />
            <cropper @ready="ready" v-if="imageUrl" :stencil-component="stencil" ref="cropperRef" class="cropper"
              :src="imageUrl" :stencil-props="{ aspectRatio: 1 / 1 }" />
          </div>

          <q-card-actions class="row q-pa-none justify-center q-mt-md">
            <q-btn v-if="!imageUrl" :disabled="loadingAvatar" outlined unelevated size="lg" class="full-width q-mb-xs"
              label="Upload" type="button" color="primary" @click="clickUpload" />
            <q-btn v-if="imageUrl" :disabled="loadingAvatar" outlined unelevated size="lg" class="full-width q-mb-xs"
              label="Save" type="button" color="primary" @click="cropImageSubmit" />
            <q-btn v-if="editProfile.thumbnail" :disabled="loadingAvatar" outlined flat
              class="full-width text-center text-bold text-red" @click="delSubmit">Remove
            </q-btn>
            <q-btn v-if="!editProfile.thumbnail" :disabled="loadingAvatar" outlined flat class="full-width text-center"
              @click="cancelCrop">Cancel
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>

      <!-- 其他帳戶 -->
      <q-card-section v-if="ID !== editProfile.user_id && !showCrop" class="row inline">
        <div class="text-center q-px-md">
          <q-avatar spinner-color="white" class="" v-if="editProfile.thumbnail" size="100px" font-size="52px"
            color="grey-4" text-color="white">
            <q-img spinner-color="green" spinner-size="40px" :src="editProfile.thumbnail" />
          </q-avatar>
          <q-avatar v-else size="100px" font-size="40px" color="grey-4" text-color="white">
            {{ avatarName() }}
          </q-avatar>
        </div>
        <q-separator vertical spaced />
        <div class="q-pl-md">
          <q-input readonly borderless class="" type="text" v-model="editProfile.fname" label="First Name">
          </q-input>
          <q-input readonly borderless class="q-mt-xs" type="text" v-model="editProfile.lname" label="Last Name">
          </q-input>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { markRaw, defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import { mapState } from 'vuex'
import { Cropper } from 'vue-advanced-cropper'
import CircleStencil from './CircleStencil'
import 'vue-advanced-cropper/dist/style.css'

export default defineComponent({
  name: 'ProfileDialog',
  mixins: [inputRules],
  components: {
    Cropper
  },
  data() {
    return {
      stencil: markRaw(CircleStencil),
      showCrop: false,
      refreshAvatar: false,
      loadingAvatar: false,
      cropKey: false,
      editProfile: {},
      imageUrl: '',
      imageFile: null,
      imageFileName: ''
    }
  },
  computed: {
    ...mapState('auth', ['ID', 'userData', 'currentProfile'])
  },
  watch: {
    userData: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.editProfile = Object.assign({}, this.userData)
        }
      }
    }
  },
  mounted() {
    this.reset()
    this.editProfile = Object.assign({}, this.currentProfile)
  },
  methods: {
    // change({ coordinates, canvas }) {
    //   console.log(coordinates, canvas)
    // },
    reset() {
      this.imageUrl = ''
      this.imageFile = null
    },
    clickUpload() {
      document.querySelector('#upload_avatar_image').value = ''
      document.querySelector('#upload_avatar_image').click()
    },
    loadAvatar() {
      this.loadingAvatar = true
      this.refreshAvatar = true
      this.showCrop = true
    },
    ready() {
      this.loadingAvatar = false
      this.refreshAvatar = false
    },
    updateAvatar(e) {
      const files = e.target.files
      if (files.length === 0) {
        return
      }
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl)
        this.imageUrl = ''
      }
      const file = e.target.files[0]
      this.imageFileName = e.target.files[0].name
      const typeCheck = file.type === 'image/png' || file.type === 'image/jpeg'
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
      this.showCrop = true
    },
    cropImageSubmit() {
      const fileName = this.imageFileName
      const { canvas } = this.$refs.cropperRef.getResult()
      if (canvas) {
        this.loadingAvatar = true
        const Data = new FormData()
        const UID = this.$store.getters['auth/getUID']
        canvas.toBlob(blob => {
          const blobFile = new File([blob], fileName, { type: 'image/jpeg' })
          Data.append('uid', UID)
          Data.append('picture', blobFile)
          this.$store.dispatch('user/uploadPic', Data)
            .then((res) => {
              if (res.code === 'USER_PICTURE') {
                this.imageFileName = ''
                // this.$q.notify({
                //   color: 'primary',
                //   position: 'bottom',
                //   textColor: 'white',
                //   icon: 'check_circle',
                //   message: 'Upload success!'
                // })
                this.showCrop = false
                this.imageUrl = ''
                setTimeout(() => {
                  this.$store.dispatch('user/getProfile')
                  setTimeout(() => {
                    this.loadingAvatar = false
                    this.refreshAvatar = false
                  }, 2000)
                }, 3000)
              }
            })
        }, 'image/jpeg')
      }
    },
    delSubmit() {
      this.$store.dispatch('user/delPic')
        .then(() => {
          this.refreshAvatar = true
          this.loadingAvatar = true
          setTimeout(() => {
            if (this.imageUrl) {
              URL.revokeObjectURL(this.imageUrl)
              this.imageUrl = ''
            }
            this.editProfile.thumbnail = ''
            this.$store.dispatch('user/getProfile')
            this.refreshAvatar = false
            this.loadingAvatar = false
          }, 3000)
        })
    },
    cancelCrop() {
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl)
      }
      this.$store.dispatch('user/getProfile')
        .then(() => {
          this.imageUrl = ''
        })
        .then(() => {
          this.showCrop = false
        })
    },
    avatarName() {
      if (this.editProfile) {
        const f = this.editProfile.fname.charAt(0).toUpperCase()
        const l = this.editProfile.lname.charAt(0).toUpperCase()
        this.ready()
        return f + l
      } else {
        this.ready()
        return ''
      }
    },
    ProfileSubmit() {
      this.$refs.ProfileForm.validate().then(success => {
        if (success) {
          const userData = {
            fname: this.editProfile.fname,
            lname: this.editProfile.lname,
            uid: this.$store.getters['auth/getUID']
          }
          this.$store.dispatch('user/saveProfile', userData)
            .then(() => {
              // this.$store.dispatch('user/getProfile')
              // this.$q.notify({
              //   color: 'primary',
              //   position: 'bottom',
              //   textColor: 'white',
              //   icon: 'check_circle',
              //   message: 'Profile save success!'
              // })
              setTimeout(() => {
                this.$store.dispatch('user/getProfile')
                setTimeout(() => {
                  this.editProfile = Object.assign({}, this.userData)
                }, 1000)
              }, 3000)
            })
            .then(() => {
              this.$refs.dialog.hide()
            })
        } else {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Profile need filled'
          })
        }
      })
    },
    cancelSave() {
      if (this.imageUrl) {
        this.imageUrl = ''
        URL.revokeObjectURL(this.imageUrl)
      }
      this.$store.dispatch('user/getProfile')
        .then(() => {
          this.$refs.dialog.hide()
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
.cropper
  height: 300px
  width: 300px
  background: #DDD
  margin: 0 auto
.editBtn
  cursor: pointer
  font-size: 26px
  display: flex
  position: absolute
  visibility: hidden
  padding: 10px
  background-color: grey
  border-radius: 50%
  z-index: 100
.show-Avatar .q-avatar:after
  content: ''
  top: 0
  left: 0
  width: 100px
  height: 100px
  position: absolute
  visibility: hidden
  background-color: rgba(0, 0, 0, 0.20)
  border-radius: 50%
.show-Avatar .q-avatar:hover
  .editBtn
    visibility: visible
  &:after
    visibility: visible
</style>
