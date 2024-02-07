<template>
  <q-dialog :model-value="isShow" @before-hide="hideDialog" @before-show="initData">
    <q-card style="width: 100%;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Edit BSP</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-mx-lg q-my-md">
        <q-form ref="Form" class="q-gutter-md" @submit.stop="editBsp">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.product" label="Product" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a product']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.model" label="Model" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a model']">
              </q-input>
              <q-input filled class="q-mt-xs" type="text" v-model="data.value.comment" label="Comment" lazy-rules :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Please enter a comment']">
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
  product: '',
  model: '',
  comment: ''
})

onBeforeMount(() => {
})

const initData = () => {
  // console.log('bspStore.currentBsp', bspStore.currentBsp)
  data.value = bspStore.currentBsp
}

const editBsp = () => {
  Form.value.validate().then(success => {
    if (success) {
      const Data = {
        product: data.value.product,
        model: data.value.model,
        comment: data.value.comment
      }
      bspStore.editBsp(data.value.id, Data).then(() => {
        hideDialog()
      })
    }
  })
}
</script>

<style lang="sass" scoped>
</style>
