<template>
  <q-dialog :model-value="isShow" @before-hide="hideDialog" @before-show="initData">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Edit Release</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="editRelease">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input borderless disable class="q-mt-xs" type="text" v-model="data.value.filename" label="Filename"
                lazy-rules :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter a comment']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.version" label="Version" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product version']">
              </q-input>
              <div class="row flex items-center">
                <span>State:</span>
                <q-toggle v-model="data.value.state" :true-value="1" :false-value="0" />
              </div>
              <q-input class="q-mb-md" v-model="parameter" label="Parameters">
                <template v-slot:hint>
                  Please enter a product parameters
                </template>
                <template v-slot:append>
                  <q-btn round dense flat icon="add" @click="addParameters" />
                </template>
              </q-input>
              <q-btn class="q-mr-sm q-mb-xs q-pr-sm" style="font-size: 12px;" unelevated
                v-for="tag in data.value.parameters" :key="tag" icon-right="cancel" color="grey-5" :label="tag"
                @click="delParameters(tag)" />
            </div>
          </div>
          <q-card-actions class="q-mt-lg q-pa-none" align="right">
            <q-btn unelevated class="q-mb-xs q-px-lg" :loading="getLoading" label="Apply" type="submit" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, reactive, onBeforeMount } from 'vue'
import { useProductStore } from 'src/stores/product'
// import inputRules from 'src/mixins/inputRules.js'

defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])

const hideDialog = () => {
  emit('update:isShow', false)
}
const productStore = useProductStore()
const getLoading = computed(() => productStore.getLoading)

const Form = ref(null)
const parameter = ref('')
const data = reactive({
  id: undefined,
  file: null,
  rename: 0,
  newFileName: '',
  description: '',
  version: '',
  parameters: []
})

onBeforeMount(() => {
})

const initData = () => {
  console.log('productStore.currentRelease', productStore.currentRelease)
  data.value = productStore.currentRelease
}

const addParameters = () => {
  const index = data.parameters.findIndex(o => o === parameter.value.toUpperCase())
  if (index >= 0) {
    return
  }
  data.parameters.push(parameter.value.toUpperCase())
  parameter.value = ''
}

const delParameters = (tag) => {
  const index = data.parameters.findIndex(o => o === tag.toUpperCase())
  if (index === -1) {
    return
  }
  const Data = data.parameters.filter(o => o !== tag.toUpperCase())
  data.parameters = Data
}

const editRelease = () => {
  Form.value.validate().then(success => {
    if (success) {
      const formData = new FormData()
      data.parameters = []
      formData.append('productid', data.id)
      formData.append('file', data.file)
      formData.append('version', data.rename)
      formData.append('version', data.version)
      formData.append('filename', data.newFileName)
      formData.append('parameters', data.description)
      formData.append('parameters', data.parameters)
      productStore.createProductRelease(formData).then(() => {
        hideDialog()
      })
    }
  })
}
</script>
<style lang="sass" scoped>
</style>
