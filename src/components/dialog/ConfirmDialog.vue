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
        <q-btn @click="onCancelClick" class="theme-btn text-capitalize q-mr-lg" outline :label="cancelBtn" color="grey-7"
          v-close-popup />
        <q-btn unelevated @click="onOKClick" class="theme-btn text-capitalize" :label="okBtn" color="primary"
          v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default ({
  name: 'ConfirmDialog',
  data() {
    return {
    }
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    message: {
      type: String,
      required: false,
      default: ''
    },
    okBtn: {
      type: String,
      required: false,
      default: ''
    },
    cancelBtn: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },
    onOKClick() {
      this.$emit('ok')
      this.hide()
    },
    onCancelClick() {
      this.$emit('cancel')
      this.hide()
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
