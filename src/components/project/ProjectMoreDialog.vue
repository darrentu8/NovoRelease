<template>
  <q-menu v-if="share !== true" :offset="[-10, 10]" class="q-ma-none q-pa-none" @before-show="isSelected = true"
    @before-hide="isSelected = false">
    <q-list dense style="min-width:250px" :separator="false">
      <q-item class="menu-item no-border" clickable v-close-popup>
        <q-item-section>Download as local project</q-item-section>
      </q-item>
      <q-item @click="shareProject(project)" class="menu-item no-border" clickable v-close-popup>
        <q-item-section>Share</q-item-section>
      </q-item>
      <q-item @click="cloneProject(project)" class="menu-item no-border" clickable v-close-popup>
        <q-item-section>Duplicate</q-item-section>
      </q-item>
      <q-separator />
      <q-item @click="renameProject(project)" class="menu-item no-border" clickable v-close-popup>
        <q-item-section>Rename</q-item-section>
      </q-item>
      <q-item @click="delProject(project)" class="menu-item text-red no-border" clickable v-close-popup>
        <q-item-section>Delete</q-item-section>
      </q-item>

    </q-list>
  </q-menu>
  <q-menu v-else :offset="[-10, 10]" class="q-ma-none q-pa-none" @before-show="isSelected = true"
    @before-hide="isSelected = false">
    <q-list dense style="min-width:250px" :separator="false">
      <q-item class="menu-item no-border" clickable v-close-popup>
        <q-item-section>Download as local project</q-item-section>
      </q-item>
      <q-item @click="cloneProject(project)" class="menu-item no-border" clickable v-close-popup>
        <q-item-section>Duplicate</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <EditProjectDialog />
  <ShareDialog />
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import { Dialog } from 'quasar'
// import { Cookies, Dialog } from 'quasar'
import ShareDialog from 'src/components/project/ShareDialog'
import EditProjectDialog from 'src/components/project/EditProjectDialog'

export default defineComponent({
  name: 'ProjectMoreDialog',
  emits: ['showEditName'],
  components: {
    EditProjectDialog,
    ShareDialog
  },
  mixins: [inputRules],
  props: {
    project: Object,
    share: Boolean
  },
  data() {
    return {
      dense: true
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    reset() {
      this.data = {
        name: '',
        approve: '1',
        uid: ''
      }
    },
    renameProject(props) {
      this.$store.commit('project/editProject', props)
      this.$emit('showEditName')
      // this.$q
      //   .dialog({
      //     component: EditProjectDialog
      //   })
    },
    shareProject(props) {
      this.$store.commit('project/setCurrentProject', props)
      this.$store.dispatch('project/getShareList')
        .then(() => {
          this.$q
            .dialog({
              component: ShareDialog
            })
          // .onDismiss(() => {
          //   this.$store.dispatch('project/getProject')
          // })
        })
    },
    cloneProject(props) {
      console.log('props', props)
      this.$store.dispatch('project/cloneProject', props)
        .then(() => {
          this.$store.dispatch('project/getProject')
        })
    },
    copyBoardLink(props) {
      console.log('props', props)
      this.$store.dispatch('project/cloneProject', props)
        .then(() => {
          this.$store.dispatch('project/getProject')
        })
    },
    delProject(props) {
      const PID = props.pid
      if (!PID) {
        return
      }
      Dialog.create({
        title: 'Are you sure?',
        persistent: true,
        ok: {
          push: false,
          flat: true,
          label: 'Apply'
        },
        cancel: {
          push: false,
          flat: true,
          color: 'negative',
          label: 'Cancel'
        }
      }).onOk(() => {
        this.$store.dispatch('project/delProject', PID)
      }).onCancel(() => {
        this.dialog.hide()
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    createProject() {
      this.$refs.Form.validate().then(success => {
        // console.log('this.userData', this.userData)
        if (success) {
          const Data = {
            name: this.data.name,
            uid: this.$store.getters['auth/getUID']
          }
          this.$store.dispatch('project/createProject', Data)
            .then(() => {
              this.$refs.dialog.hide()
              this.reset()
            })
            .then(() => {
              this.$store.dispatch('project/getProject')
            })
        } else {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Need filled'
          })
        }
      })
    },
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    }
  }
})
</script>
<style lang="sass" scoped>
.menu-item
    padding: 10px 10px 10px 20px !important
    text-align: left
    &:hover, &:hover.text-red
      color: white !important
      background-color: #14A028
.menu-icon
    margin: auto !important
</style>
