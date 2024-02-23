<template>
  <q-dialog ref="dialog" persistent>
    <q-card class="dialog-round q-pa-md text-center">
      <q-card-section>
        <div class="text-h6">
          {{ props.title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="theme-text-color">{{ props.message }}</p>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn @click="onCancelClick" class="q-px-lg q-mr-md theme-btn text-capitalize" outline size='md'
          :label="cancelBtn" color="grey-7" v-close-popup />
        <q-btn unelevated @click="onOKClick" class="q-px-lg theme-btn text-capitalize q-mr-lg" size='md' :label="okBtn"
          color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// This defineProps call defines the props that the component will accept.
const props = defineProps({
  title: String,
  message: String,
  okBtn: String,
  cancelBtn: String
})

// Define the event emits.
const emit = defineEmits(['ok', 'hide'])

const dialog = ref(null)

// Make sure dialog reference is bound after component has mounted.
onMounted(() => {
  if (!dialog.value) {
    console.error('Dialog reference not found')
  }
})

// const show = () => {
//   dialog.value?.show()
// }

const hide = () => {
  dialog.value?.hide()
}

// const onDialogHide = () => {
//   emit('hide')
// }

const onOKClick = () => {
  emit('ok')
  hide()
}

const onCancelClick = () => {
  hide()
}

</script>

<style lang="sass" scoped>
</style>
