<template>
  <q-dialog :model-value="isShow" @before-hide="hideDialog" @before-show="beforeShow">
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
              <q-file v-model="data.file" class="q-mt-xs q-mb-lg" label="Upload File" filled lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please upload a file']">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" />
                </template>
              </q-file>
              <q-input filled class="q-mt-xs" type="text" v-model="data.version" label="Version" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product version']">
              </q-input>
              <div class="row flex items-center">
                <div class="col-3 q-mb-md">
                  <span>Rename?</span>
                  <q-checkbox v-model="data.rename" :true-value="1" :false-value="0" />
                </div>
                <div class="col-9">
                  <q-input filled :disable="!data.rename" class="" type="text" v-model="data.newFileName" label="Filename"
                    lazy-rules :rules="[
                      (val) =>
                        (val !== null && val !== '' && data.rename) || 'Please enter a product filename']">
                  </q-input>
                </div>
              </div>
              <q-input class="q-mb-md" filled v-model="parameter" label="Parameters" @keyup.enter="addParameters">
                <template v-slot:hint>
                  Please enter a product parameters
                </template>
                <template v-slot:append>
                  <q-btn round dense flat icon="add" @click="addParameters" />
                </template>
              </q-input>
              <q-btn class="q-mr-sm q-mb-xs q-pr-sm" style="font-size: 12px;" unelevated v-for="tag in data.parameters"
                :key="tag" icon-right="cancel" color="grey-5" :label="tag" @click="delParameters(tag)" />
            </div>
          </div>
          <q-card-actions class="q-mt-lg q-pa-none" align="right">
            <q-btn @click="createRelease" unelevated class="q-mb-xs q-px-lg" :loading="getLoading" label="Apply"
              color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, reactive, onBeforeMount } from 'vue'
import { useProductStore } from 'src/stores/product'
// import { useQuasar } from 'quasar'
// import inputRules from 'src/mixins/inputRules.js'

// const $q = useQuasar()

defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])

const hideDialog = () => {
  emit('update:isShow', false)
}
const productStore = useProductStore()
const getLoading = computed(() => productStore.getLoading)

const Form = ref(null)
// const File = ref(null)
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

const beforeShow = () => {
  data.id = ''
  data.file = null
  data.rename = 0
  data.newFileName = ''
  data.description = ''
  data.version = ''
  data.parameters = []
}
// const onRejected = (rejectedEntries) => {
//   $q.notify({
//     type: 'negative',
//     message: `${rejectedEntries.length} file(s) did not pass validation constraints`
//   })
// }
// const handleUpload = () => {
//   console.log('data.file', data.file)
//   const typeCheck = data.file.type === 'image/png' || data.file.type === 'image/jpeg' || data.file.type === 'image/jpg'
//   if (!typeCheck) {
//     $q.notify({
//       color: 'red-5',
//       position: 'bottom',
//       textColor: 'white',
//       icon: 'error',
//       message: 'The format is wrong, please re-upload!'
//     })
//     return
//   }
//   // // 限制2MB
//   // if (file.size > 2000000) {
//   //   this.$q.notify({
//   //     color: 'red-5',
//   //     position: 'bottom',
//   //     textColor: 'white',
//   //     icon: 'error',
//   //     message: 'The file is too large, please re-upload!'
//   //   })
//   //   return
//   // }
//   File.value = URL.createObjectURL(data.file)
// }

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

const createRelease = () => {
  Form.value.validate().then(success => {
    if (success) {
      const formData = new FormData()
      formData.append('productid', data.id)
      formData.append('file', data.file)
      formData.append('rename', data.rename)
      formData.append('newFileName', data.newFileName)
      formData.append('description', data.description)
      formData.append('version', data.version)
      formData.append('parameters', data.parameters)
      productStore.createProductRelease(formData).then(() => {
        hideDialog()
      }).then(() => {
        setTimeout(() => {
          productStore.getProductDetail()
        }, 1000)
      })
    }
  })
}
</script>
<style lang="sass" scoped>
</style>
