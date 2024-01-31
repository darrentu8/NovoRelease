<template>
  <q-dialog ref="dialog" persistent>
    <q-card class="dialog-round q-pa-md text-center">
      <q-card-section>
        <div class="text-h6">
          {{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="theme-text-color">{{ message }}</p>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn @click="onCancelClick" class="q-px-lg q-mr-md theme-btn text-capitalize" outline size='lg'
          :label="cancelBtn" color="grey-7" v-close-popup />
        <q-btn unelevated @click="onOKClick" class="q-px-lg theme-btn text-capitalize q-mr-lg" size='lg' :label="okBtn"
          color="negative" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

export default {
  name: 'DelDialog',
  emits: [
    ...useDialogPluginComponent.emits
  ],
  props: {
    title: String,
    message: String,
    okBtn: String,
    cancelBtn: String
  },
  setup(props, { emit }) {
    const dialog = ref(null)

    const show = () => {
      if (dialog.value) {
        dialog.value.show()
      }
    }

    const hide = () => {
      if (dialog.value) {
        dialog.value.hide()
      }
    }

    const onDialogHide = () => {
      emit('hide')
    }

    const onOKClick = () => {
      emit('ok')
      hide()
    }

    const onCancelClick = () => {
      hide()
    }

    return {
      dialog,
      show,
      hide,
      onDialogHide,
      onOKClick,
      onCancelClick
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
