<template>
  <div class="flex flex-center">
    <q-circular-progress v-if="getFileUploading && getFileUploading !== 1" indeterminate :min="0" :max="1"
      :thickness="0.22" :value="getFileUploading" size="32px" track-color="orange" class="q-ma-md" />
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
import { inject, ref, computed } from 'vue'
import DialogProgress from '../dialog/DialogProgress.vue'
import { useBspStore } from 'src/stores/bsp'
const $q = useQuasar()
const bspStore = useBspStore()
const getFileUploading = computed(() => bspStore.getFileUploading)
const bus = inject('bus')

const file = ref(null)
const fileRef = ref(null)

bus.on('pickFiles', () => {
  console.log('pickFiles')
  fileRef.value.pickFiles()
})

function fileOnUpdate(selectedFile) {
  console.log('selectedFile', selectedFile)
  console.log('bspStore.percentCompleted', bspStore.percentCompleted)
  bspStore.setPercentCompleted(0)
  const formData = new FormData()
  formData.append('file', selectedFile)
  bspStore.uploadBspConFile(bspStore.currentBsp.id, formData).catch(error => {
    console.error('Error during upload:', error)
    const dialog = $q.dialog({
      title: 'Upload Failed',
      message: 'An error occurred during the upload.'
    })
    setTimeout(() => {
      dialog.hide()
    }, 700)
  }).then(() => {
    const dialog = $q.dialog({
      component: DialogProgress,
      componentProps: {
        title: '',
        message: 'Save successfully!',
        progressVal: bspStore.percentCompleted
      }
    })
    setTimeout(() => {
      if (dialog) {
        dialog.hide()
      }
    }, 700)
    bspStore.getBspConFile(bspStore.currentBspCon.id).then(() => {
      // isShowDialogBspConFileList.value = true
    })
    file.value = null
  })
}

</script>
<style lang="scss" scoped></style>
