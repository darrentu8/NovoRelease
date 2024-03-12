<template>
  <q-dialog :model-value="isShow" @before-hide="hideDialog" @before-show="initData">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Edit Upgrade Number</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="editUpgrade">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <!-- <q-input filled class="q-mt-xs" type="text" v-model.trim="data.osid" label="OsId" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a osid']">
              </q-input> -->
              <q-input borderless disable class="q-mt-xs" type="text" v-model.trim="data.value.comment" label="Comment"
                lazy-rules :rules="[
    (val) =>
      (val !== null && val !== '') || 'Please enter a comment']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model.trim="data.value.version" label="Version" lazy-rules
                :rules="[
    (val) =>
      (val !== null && val !== '') || 'Please enter a version']">
              </q-input>
            </div>
          </div>
          <q-card-actions class="q-mt-lg q-pa-none" align="right">
            <q-btn unelevated class="q-mb-xs q-px-lg" :loading="getLoading" label="Apply" type="submit"
              color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onBeforeMount, computed } from 'vue'
import { useUpgradeStore } from 'src/stores/upgrade'

defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])

const hideDialog = () => {
  emit('update:isShow', false)
}
const upgradeStore = useUpgradeStore()
const getLoading = computed(() => upgradeStore.getLoading)

const Form = ref(null)
const data = reactive({
  id: '',
  osid: '',
  version: '',
  comment: ''
})

onBeforeMount(() => {
})

const initData = () => {
  // console.log('upgradeStore.currentUpgrade', upgradeStore.currentUpgrade)
  data.value = upgradeStore.currentUpgrade
  // console.log('data.value.comment', data.value.comment)
}

const editUpgrade = () => {
  Form.value.validate().then(success => {
    if (success) {
      const Data = {
        id: data.value.id,
        version: data.value.version
      }
      upgradeStore.editUpgrade(Data).then(() => {
        hideDialog()
      })
    }
  })
}
</script>

<style lang="sass" scoped>
</style>
