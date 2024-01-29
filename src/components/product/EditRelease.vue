<template>
  <q-dialog ref="dialog" @before-show="beforeShow">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Edit Release</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="submitRelease">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input filled class="q-mt-xs" type="text" v-model="data.version" label="Version" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product version']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.filename" label="Filename" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product filename']">
              </q-input>
              <div class="q-gutter-sm flex items-center">
                <span>Status:</span>
                <q-toggle :label="data.state == 1 ? 'Enable' : 'Disable'" true-value="1" false-value="0" color="primary"
                  v-model="data.state" checked-icon="check" unchecked-icon="clear" />
              </div>
              <q-input filled bottom-slots v-model="parameters" label="Parameters">
                <template v-slot:hint>
                  Please enter a product parameters
                </template>
                <template v-slot:append>
                  <q-btn round dense flat icon="add" @click="addParameters" />
                </template>
              </q-input>
              <q-badge v-for="tag in data.parameters" :key="tag"> {{ tag }}</q-badge>
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
import { ref, reactive } from 'vue'
// import inputRules from 'src/mixins/inputRules.js'
import { useProductStore } from 'src/stores/product'

const productStore = useProductStore()

const Form = ref(null)
const data = reactive({
  file: null,
  version: '',
  filename: '',
  parameters: ''
})

const beforeShow = () => {
  data.value = productStore.currentRelease
}

const submitRelease = () => {
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
