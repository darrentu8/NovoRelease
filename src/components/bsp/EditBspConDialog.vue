<template>
  <q-dialog :model-value="isShow" @before-hide="hideDialog" @before-show="initData">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Edit BSP configuration</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="editBspCon">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.updateno" label="UpdateNo" lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter a update no']">
              </q-input>
              <q-select filled class="q-mt-xs" :options="[{ label: 'BSP', value: 1 }, { label: 'Patch', value: 2 }]"
                v-model="data.value.datatype" label="DataType" lazy-rules emit-value map-options :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter a datatype']">
              </q-select>
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.filename" label="Filename" lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter a filename']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.md5" label="MD5" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a md5']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.filesize" label="Filesize(KB)" lazy-rules
                :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter a filesize']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.version" label="Version" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a version']">
              </q-input>
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
import { ref, reactive, onBeforeMount, computed } from 'vue'
import { useBspStore } from 'src/stores/bsp'

defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])

const hideDialog = () => {
  emit('update:isShow', false)
}
const bspStore = useBspStore()
const getLoading = computed(() => bspStore.getLoading)

const Form = ref(null)
const data = reactive({
  bspid: '',
  updateno: '',
  datatype: 1,
  filename: '',
  md5: '',
  filesize: '',
  version: ''
})

onBeforeMount(() => {
})

const initData = () => {
  // console.log('bspStore.currentBspConFileList', bspStore.currentBspConFileList)
  data.value = bspStore.currentBspCon
}
const editBspCon = () => {
  Form.value.validate().then(success => {
    if (success) {
      const Data = {
        id: data.value.id,
        bspid: data.value.bspid,
        updateno: data.value.updateno,
        datatype: data.value.datatype,
        filename: data.value.filename,
        md5: data.value.md5,
        filesize: data.value.filesize,
        version: data.value.version
      }
      bspStore.editBspCon(Data).then(() => {
        hideDialog()
      })
    }
  })
}
</script>
<style lang="sass" scoped>
</style>
