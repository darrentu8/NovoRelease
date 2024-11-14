<template>
  <div class="flex flex-center">
    <q-circular-progress v-if="getFileUploading" font-size="10px" class="text-orange q-ma-md" show-value :min="0"
      :max="1" :thickness="0.1" :value="uploadPercentCompleted" size="32px" color="orange" track-color="grey-3">{{
        Math.round(uploadPercentCompleted * 100)
      }}%</q-circular-progress>
    <q-file ref="fileNtRef" v-on:update:model-value="filesOnUpdate" v-model="files" class="q-mt-xs q-mb-lg hidden"
      label="Upload Files" multiple>
      <template v-slot:prepend>
        <q-icon name="cloud_upload" />
      </template>
    </q-file>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { inject, ref, watch, computed } from 'vue'
import DialogProgress from '../dialog/DialogProgress.vue'
import { useNtStore } from 'src/stores/nt'
const $q = useQuasar()
const ntStore = useNtStore()
const getFileUploading = computed(() => ntStore.getFileUploading)
const bus = inject('bus')

const files = ref([]) // 修改為多個文件
const fileNtRef = ref(null)
const uploadPercentCompleted = ref(0)
watch(() => ntStore.percentCompleted, (newVal, oldVal) => {
  uploadPercentCompleted.value = newVal
}, { immediate: true })

bus.on('pickNTFiles', () => {
  fileNtRef.value.pickFiles()
})

function filesOnUpdate(selectedFiles) {
  ntStore.setPercentCompleted(0)
  const formData = new FormData()
  selectedFiles.forEach(file => {
    formData.append('files', file) // 修改為多個文件
  })
  ntStore.uploadNtFile(formData)
    .then(() => {
      if (ntStore.percentCompleted === 1) {
        $q.dialog({
          component: DialogProgress,
          componentProps: {
            title: '',
            message: 'Files uploaded Successfully!',
            progressVal: ntStore.percentCompleted,
            persistent: false
          }
        })
        ntStore.getApp().then(() => {
          setTimeout(() => {
            ntStore.setPercentCompleted(0)
          }, 2000)
        })
      }
      files.value = []
    }).catch(error => {
      console.error('Error during upload:', error)
      files.value = []
      $q.dialog({
        title: 'Upload Failed!',
        message: 'An error occurred during the upload.'
      })
      setTimeout(() => {
        ntStore.setPercentCompleted(0)
      }, 2000)
    })
}

</script>
