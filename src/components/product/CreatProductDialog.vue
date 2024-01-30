<template>
  <q-dialog :model-value="isShow" @before-show="beforeShow">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Add New Product</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="createProduct">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input filled class="q-mt-xs" type="text" v-model="data.appid" label="AppId" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product appid']">
              </q-input>
              <q-input filled class="q-mt-xs" type="textarea" rows="3" v-model="data.name" label="Name" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product name']">
              </q-input>
            </div>
            <div class="q-gutter-sm flex items-center">
              <span>CDN:</span>
              <q-radio v-model="data.cdn" :val="1" label="true" />
              <q-radio v-model="data.cdn" :val="0" label="false" />
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
import { useProductStore } from 'src/stores/product'

defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])

const hideDialog = () => {
  emit('update:isShow', false)
}
const productStore = useProductStore()
const getLoading = computed(() => productStore.getLoading)
// import inputRules from 'src/mixins/inputRules.js'

const Form = ref(null)
const data = reactive({
  appid: '',
  name: '',
  cdn: 0
})

onBeforeMount(() => {
})

const beforeShow = () => {
  data.appid = ''
  data.name = ''
  data.cdn = 0
}
const createProduct = () => {
  Form.value.validate().then(success => {
    if (success) {
      const Data = {
        appid: data.appid,
        name: data.name,
        cdn: data.cdn ? 1 : 0
      }
      productStore.createProduct(Data).then(() => {
        hideDialog()
      })
    }
  })
}
</script>
<style lang="sass" scoped>
</style>
