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
        <q-btn @click="onCancelClick" class="theme-btn text-capitalize q-mr-lg" outline :label="cancelBtn" color="grey-7"
          v-close-popup />
        <q-btn unelevated @click="onOKClick" class="theme-btn text-capitalize" :label="okBtn" color="primary"
          v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

// Define the props the component will accept.
const props = defineProps({
  title: String,
  message: String,
  okBtn: String,
  cancelBtn: String
})

// Define the event emits.
const emit = defineEmits(['ok', 'cancel', 'hide'])

const dialog = ref(null)

// Methods can be used directly in the script setup block.
// function show() {
//   dialog.value.show()
// }

function hide() {
  dialog.value.hide()
}

// function onDialogHide() {
//   emit('hide')
// }

function onOKClick() {
  emit('ok')
  hide()
}

function onCancelClick() {
  emit('cancel')
  hide()
}
</script>

<style lang="sass" scoped>
</style>
