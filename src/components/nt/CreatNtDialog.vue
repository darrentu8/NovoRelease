<template>
  <q-dialog :model-value="isShow" @before-hide="hideDialog" @before-show="beforeShow">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Create Release</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createBsp">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input filled class="q-mt-xs" type="text" v-model.trim="data.model" label="Model" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a model']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model.trim="data.version" label="Version" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a version']">
              </q-input>
              <q-input filled readonly class="q-mt-xs" mask="date" v-model="data.publishDate" label="Publish Date"
                lazy-rules :rules="[
                  (val) =>
                    (val !== null && val !== '') || 'Please enter a publish date']">
                <template v-slot:after>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="data.publishDate" :options="dateOptions">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-scroll-area style="height: 200px;">
                <div v-if="appListOption.length" class="q-gutter-sm flex items-center">
                  <q-checkbox v-for="option of appListOption" v-model="data.applist" :key="option.id" :val="option.id"
                    :label="option.name + ' ' + option.version" dense />
                </div>
              </q-scroll-area>
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
import { useNtStore } from 'src/stores/nt'

defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])

const hideDialog = () => {
  emit('update:isShow', false)
}
const ntStore = useNtStore()
const getLoading = computed(() => ntStore.getLoading)
const appListOption = computed(() => ntStore.appList)

const Form = ref(null)
const data = reactive({
  id: '',
  model: '',
  version: '',
  publishDate: '',
  applist: []
})

const dateOptions = (date) => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '/')
  return date <= today
}
onBeforeMount(() => {
})

const beforeShow = () => {
  data.model = ''
  data.version = ''
  data.publishDate = ''
  data.releaseNote = ''
  data.applist = []
}
const createBsp = () => {
  Form.value.validate().then(success => {
    if (success) {
      const Data = {
        model: data.model,
        version: data.version,
        publishDate: new Date(data.publishDate).getTime(),
        releaseNote: data.releaseNote,
        applist: data.applist.join(',')
      }
      // console.log('Data', Data)
      ntStore.createNt(Data).then(() => {
        hideDialog()
      })
    }
  })
}
</script>
<style lang="sass" scoped>
</style>
