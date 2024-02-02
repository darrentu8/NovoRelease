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
              <q-input borderless disable class="q-mt-xs" type="text" v-model="data.version" label="Version">
              </q-input>
              <q-input borderless disable class="q-mt-xs" type="text" v-model="data.filename" label="Filename">
              </q-input>
              <div class="row flex items-center">
                <span>State:</span>
                <q-toggle v-model="data.state" :true-value="1" :false-value="0" />
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
            <q-btn @click="editRelease" unelevated class="q-mb-xs q-px-lg" :loading="getLoading" label="Apply"
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
  productid: undefined,
  version: '',
  filename: '',
  md5: '',
  filesize: undefined,
  description: '',
  parameters: [],
  state: 0
})

onBeforeMount(() => {
})

const initData = () => {
  data.id = productStore.currentRelease.id
  data.productid = productStore.currentRelease.productid
  data.version = productStore.currentRelease.version
  data.filename = productStore.currentRelease.filename
  data.md5 = productStore.currentRelease.md5
  data.filesize = productStore.currentRelease.filesize
  data.description = productStore.currentRelease.description
  data.state = productStore.currentRelease.state
  if (productStore.currentRelease.parameters) {
    const tagArray = productStore.currentRelease.parameters.split(',')
    data.parameters = tagArray
  } else {
    data.parameters = []
  }
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
      console.log('data.parameters', data.parameters)
      const Data = {
        id: data.id,
        productid: data.productid,
        parameters: data.parameters.toString(),
        state: data.state
      }
      productStore.editRelease(Data).then(() => {
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
