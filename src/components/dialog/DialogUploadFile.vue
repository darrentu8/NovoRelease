<template>
  <div class="flex flex-center">
    <!-- <q-icon v-if="getFileUploading && getFileUploading !== 1" name="cloud_upload" color="orange" size="sm" /> -->
    <q-circular-progress v-if="getFileUploading" font-size="10px" class="text-orange q-ma-md" show-value :min="0" :max="1"
      :thickness="0.1" :value="uploadPercentCompleted" size="32px" color="orange" track-color="grey-3">{{
        Math.round(uploadPercentCompleted * 100)
      }}%</q-circular-progress>
    <q-file ref="fileRef" v-on:update:model-value="fileOnUpdate" v-model="file" class="q-mt-xs q-mb-lg hidden"
      label="Upload File">
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
import { useBspStore } from 'src/stores/bsp'
const $q = useQuasar()
const bspStore = useBspStore()
const getFileUploading = computed(() => bspStore.getFileUploading)
const bus = inject('bus')

const file = ref(null)
const fileRef = ref(null)
const uploadPercentCompleted = ref(0)
watch(() => bspStore.percentCompleted, (newVal, oldVal) => {
  uploadPercentCompleted.value = newVal
}, { immediate: true })

bus.on('pickFiles', () => {
  fileRef.value.pickFiles()
})

function fileOnUpdate(selectedFile) {
  // console.log('selectedFile', selectedFile)
  bspStore.setPercentCompleted(0)
  const formData = new FormData()
  formData.append('file', selectedFile)
  bspStore.uploadBspConFile(bspStore.currentBsp.id, formData)
    .then(() => {
      if (bspStore.percentCompleted === 1) {
        $q.dialog({
          component: DialogProgress,
          componentProps: {
            title: '',
            message: selectedFile.name + ' uploaded Successfully!',
            progressVal: bspStore.percentCompleted,
            persistent: false
          }
        })
        // setTimeout(() => {
        //   if (dialog) {
        //     dialog.hide()
        //   }
        // }, 2000)
        bspStore.getBspConFile(bspStore.currentBspCon.id).then(() => {
          // isShowDialogBspConFileList.value = true
          setTimeout(() => {
            bspStore.setPercentCompleted(0)
          }, 2000)
        })
      }
      file.value = null
    }).catch(error => {
      console.error('Error during upload:', error)
      file.value = null
      $q.dialog({
        title: selectedFile.name + ' upload Failed!',
        message: 'An error occurred during the upload.'
      })
      // setTimeout(() => {
      //   dialog.hide()
      // }, 2000)
      setTimeout(() => {
        bspStore.setPercentCompleted(0)
      }, 2000)
    })
}

</script>
<style lang="scss" scoped></style>
