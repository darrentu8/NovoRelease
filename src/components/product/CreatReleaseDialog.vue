<template>
  <q-dialog ref="dialog" @before-show="beforeShow">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Add New Release</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createRelease">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-file v-model="data.file" class="q-mt-xs q-mb-lg" label="Upload File" filled
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

<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
// import inputRules from 'src/mixins/inputRules.js'

const Form = ref(null)
const data = reactive({
  file: null,
  version: '',
  filename: '',
  parameters: ''
})

onBeforeMount(() => {
})

const beforeShow = () => {
  data.value = {
    file: null,
    version: '',
    filename: '',
    parameters: ''
  }
}
const createRelease = () => {
  Form.value.validate().then(success => {
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
}
</script>
<style lang="sass" scoped>
</style>