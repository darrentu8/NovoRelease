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
              <q-file v-model="data.file" v-on:update:model-value="fileOnUpdate" class="q-mt-xs q-mb-lg"
                label="Upload File" @rejected="onRejected" filled lazy-rules :rules="[
    (val) =>
      (val !== null && val !== '') || 'Please upload a file']">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" />
                </template>
              </q-file>
              <q-input filled class="q-mt-xs" type="text" v-model.trim="data.version" label="Version" lazy-rules :rules="[
    (val) =>
      (val !== null && val !== '') || 'Please enter a product version']">
              </q-input>
              <div class="row flex items-center">
                <div class="col-3 q-mb-md">
                  <span>Rename?</span>
                  <q-checkbox v-model="data.rename" :true-value="1" :false-value="0" />
                </div>
                <div class="col-9">
                  <q-input filled :disable="!data.rename" class="" type="text" v-model.trim="data.newFileName"
                    label="Filename" lazy-rules :rules="[
    (val) =>
      (val !== null && val !== '' && data.rename) || 'Please enter a product filename']">
                  </q-input>
                </div>
              </div>
              <q-input class="q-mb-md" filled v-model.trim="parameter" label="Parameters" @keyup.enter="addParameters">
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
import { useQuasar } from 'quasar'
import DialogProgress from '../dialog/DialogProgress.vue'
// import inputRules from 'src/mixins/inputRules.js'

const $q = useQuasar()

defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])

const hideDialog = () => {
  emit('update:isShow', false)
}
const productStore = useProductStore()
const getLoading = computed(() => productStore.getLoading)

const onRejected = (rejectedEntries) => {
  console.log('rejectedEntries', rejectedEntries)
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}

function fileOnUpdate(selectedFile) {
  data.parameters = []
  data.newFileName = ''
  const fileName = selectedFile.name
  const versionParameter = 'B380-v2.0'
  const fileExtension = fileName.slice(fileName.lastIndexOf('.'))
  const fileMappings = [
    {
      pattern: 'NovoConnect_Software_',
      subPatterns: [
        { keyword: 'Usb', parameters: [versionParameter, 'USB'], newFileName: 'NovoConnect_Software_Excutable_Win_Usb_OTA' },
        { keyword: 'Lite_LauncherOne_Win_OTA', parameters: [versionParameter, 'LAUNCHER_ONE_LITE_OTA_WIN'], newFileName: 'launcherOneDSALite_Win' },
        { keyword: 'Lite_LauncherOne_Mac_OTA', parameters: [versionParameter, 'LAUNCHER_ONE_LITE_OTA_MAC'], newFileName: 'launcherOneDSALite_Mac' },
        { keyword: 'Portable_Win_OTA', parameters: [versionParameter, 'HDD_FULL_PORTABLE_OTA_WIN'], newFileName: 'dsaFullPortable_OTA_Win' },
        { keyword: 'Portable_Mac_OTA', parameters: [versionParameter, 'HDD_FULL_PORTABLE_OTA_MAC'], newFileName: 'dsaFullPortable_OTA_Mac' },
        { keyword: 'Setup_Mac', parameters: [versionParameter, 'SIGN_OSX'], newFileName: 'NovoConnect_Software_Setup_Mac_Signed_OTA' },
        { keyword: 'LauncherOneFw', parameters: [versionParameter, 'LAUNCHER_ONE_FW_OTA'], newFileName: 'launcherOneFw' },
        { keyword: 'Ubuntu_OTA', parameters: [versionParameter, 'HDD_FULL_LINUX'], newFileName: 'NovoConnect_Software_Ubuntu_OTA' }
      ],
      defaultParameters: [versionParameter, 'WIN'],
      defaultNewFileName: 'NovoConnect_Software_Win_ev_code_signed'
    },
    {
      pattern: 'Novo_launcherPlusRun_Excutable_',
      subPatterns: [
        { keyword: 'Lite_Excutable', parameters: [versionParameter, 'LAUNCHER_PLUS_WIN'], newFileName: 'launcherPlusDSAFull_OTA_Win.zip' }
      ],
      defaultParameters: [versionParameter, 'LAUNCHER_PLUS_OSX'],
      defaultNewFileName: 'launcherPlusDSAFull_OTA_Mac'
    },
    {
      pattern: 'Novo_launcherPlusRun_Lite_',
      subPatterns: [
        { keyword: 'Slim_Lite_Excutable', parameters: [versionParameter, 'LAUNCHER_PLUS_LITE_WIN'], newFileName: 'launcherPlusDSALite_Win.zip' },
        { keyword: 'Slim_', parameters: [versionParameter, 'LAUNCHER_PLUS_LITE_MAC'], newFileName: 'launcherPlusDSALite_Mac.zip' },
        { keyword: 'Lite_Excutable', parameters: [versionParameter, 'LAUNCHER_PLUS_LITE_OTA_WIN'], newFileName: 'launcherPlusDSA_Win.zip' }
      ],
      defaultParameters: [versionParameter, 'LAUNCHER_PLUS_LITE_OTA_MAC'],
      defaultNewFileName: 'launcherPlusDSA_Mac'
    },
    {
      pattern: 'NovoLauncher_',
      parameters: [versionParameter, 'LAUNCHER_MIX_LITE_OTA_LINUX'],
      newFileName: 'NovoLauncher_Ubuntu_OTA.zip'
    }
  ]

  let patternMatched = false
  for (const mapping of fileMappings) {
    if (fileName.startsWith(mapping.pattern)) {
      let subPatternMatched = false
      if (mapping.subPatterns) {
        for (const subPattern of mapping.subPatterns) {
          if (fileName.includes(subPattern.keyword)) {
            data.parameters = [...data.parameters, ...subPattern.parameters]
            data.newFileName = subPattern.newFileName + fileExtension
            subPatternMatched = true
            break
          }
        }
      }
      if (!subPatternMatched && mapping.defaultParameters) {
        data.parameters = [...data.parameters, ...mapping.defaultParameters]
        data.newFileName = mapping.defaultNewFileName + fileExtension
      } else if (!subPatternMatched) {
        data.parameters = [...data.parameters, ...mapping.parameters]
        data.newFileName = mapping.newFileName + fileExtension
      }

      patternMatched = true

      data.rename = 1
      break
    }
  }
  if (!patternMatched) {
    console.log('No matching pattern for file name.')
  }
}

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
  data.parameters = ''
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
  if (!parameter.value) {
    return
  }
  const index = data.parameters.findIndex(o => o === parameter.value.trim().toUpperCase())
  if (index >= 0) {
    return
  }
  data.parameters.push(parameter.value.toUpperCase())
  parameter.value = ''
}
const delParameters = (tag) => {
  const upperTag = tag.trim()
  const index = data.parameters.findIndex(o => o === upperTag)
  if (index === -1) {
    return
  }
  const Data = data.parameters.filter(o => o !== upperTag)
  data.parameters = Data
  console.log('data.parameters', data.parameters)
}

const createRelease = () => {
  Form.value.validate().then(success => {
    if (success) {
      productStore.setPercentCompleted(0)
      const dialog = $q.dialog({
        component: DialogProgress,
        componentProps: {
          title: '',
          message: '',
          progressVal: productStore.percentCompleted,
          persistent: true
        },
        progress: true,
        ok: false
      })
      const interval = setInterval(() => {
        dialog.update({
          title: '',
          message: '',
          progressVal: productStore.percentCompleted,
          persistent: true
        })
        if (productStore.percentCompleted === 1) {
          clearInterval(interval)
          dialog.update({
            title: '',
            message: 'Save successfully!',
            progressVal: productStore.percentCompleted,
            persistent: false
          })
        }
      }, 100)
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('rename', data.rename)
      if (data.rename) {
        formData.append('newFileName', data.newFileName)
      }
      formData.append('description', data.description)
      formData.append('version', data.version)
      formData.append('parameters', data.parameters)
      productStore.createProductRelease(formData).then(() => {
        dialog.hide()
        hideDialog()
        clearInterval(interval)
      }).then(() => {
        productStore.getProductDetail()
      })
    }
  })
}
</script>
<style lang="sass" scoped>
</style>
