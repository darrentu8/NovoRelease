<template>
  <q-card class="" style="min-width: 993px;">
    <!-- Header & ToolBar -->
    <div class="theme-bg q-py-lg head flex justify-between items-center">
      <q-btn flat round color="primary" @click="router.push({ name: 'bsp' })" icon="arrow_back" label="">
        <q-tooltip>
          Back
        </q-tooltip>
      </q-btn>
      <div class="q-ml-md flex items-center">
        <q-icon class="q-mr-sm" color="primary" name="dns" size="sm" alt="" />
        <span v-if="!getLoading" class="text-h6">{{ currentBsp.comment }}</span>
      </div>
      <q-space />
      <q-file ref="fileRef" v-on:update:model-value="fileOnUpdate" v-model="file" class="q-mt-xs q-mb-lg hidden"
        label="Upload File">
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>
      <q-btn outline class="q-mr-md" color="primary" v-on:click="selectFile()" label="Upload File">
        <q-tooltip>
          Upload File
        </q-tooltip>
      </q-btn>
      <q-btn outline class="q-mr-md" color="primary" @click="dialogBspConFileList()" label="File list">
        <q-tooltip>
          File list
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="getProduct" icon="refresh" label="">
        <q-tooltip>
          Refresh
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="creatBspCon" icon="add" label="">
        <q-tooltip>
          Add new BSP configuration
        </q-tooltip>
      </q-btn>
    </div>
    <!-- Table -->
    <div v-if="!getLoading">
      <q-table
        able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
        table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="currentBspList"
        :columns="columns" row-key="id" v-model:pagination="pagination" :loading="getLoading" color="primary"
        no-data-icon="success">
        <!-- State -->
        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <q-chip v-if="props.row.state === 1" outline color="primary" size="sm">Enable</q-chip>
            <q-chip v-else-if="props.row.state === 0" outline color="grey-6" size="sm">Disable</q-chip>
          </q-td>
        </template>
        <!-- Actions -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn color="primary" round flat @click="editBspConDialog(props.row)">
              <img src="~assets/img/icon/edit-o.svg" alt="">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn color="negative" round flat @click="delBspDialog(props.row)">
              <img src="~assets/img/icon/delete.svg" alt="">
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

    </div>
    <!-- Loading Markup -->
    <q-markup-table v-else flat class="full-width" style="max-width: 993px;">
      <thead>
        <tr>
          <th class="text-left" style="width: 100vw">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="n in 5" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>
  <CreatBspCon v-model:isShow="isShowDialogCreatBspCon" />
  <DialogEditBspCon v-model:isShow="isShowDialogEditBspCon" />
  <DialogBspConFileList v-model:isShow="isShowDialogBspConFileList" />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { ref, computed, onBeforeMount, onUnmounted } from 'vue'
import { useBspStore } from 'src/stores/bsp'
import CreatBspCon from './CreatBspConDialog.vue'
import DialogEditBspCon from './EditBspConDialog.vue'
import DialogBspConFileList from './DialogBspConFileList.vue'
import DelDialog from '../dialog/DelDialog.vue'
import DialogProgress from '../dialog/DialogProgress.vue'

const $q = useQuasar()
const router = useRouter()
const bspStore = useBspStore()
const getLoading = computed(() => bspStore.getLoading)
const currentBsp = computed(() => bspStore.currentBsp)
const currentBspList = computed(() => bspStore.currentBspList)
const isShowDialogCreatBspCon = ref(false)
const isShowDialogEditBspCon = ref(false)
const isShowDialogBspConFileList = ref(false)
const file = ref(null)
const fileRef = ref(null)

const columns = ref([
  { name: 'updateno', align: 'center', label: 'Updateno', field: 'updateno', sortable: true },
  // { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
  // { name: 'bspid', align: 'center', label: 'Bspid', field: 'bspid', sortable: true },
  { name: 'datatype', align: 'center', label: 'Batatype', field: 'datatype', sortable: true },
  { name: 'filename', align: 'center', label: 'Filename', field: 'filename', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'md5', align: 'center', label: 'MD5', field: 'md5', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'filesize', align: 'center', label: 'Filesize', field: 'filesize', sortable: true },
  { name: 'version', align: 'center', label: 'Version', field: 'version', sortable: true },
  { name: 'actions', label: '', field: 'actions', sortable: false }
])

const pagination = ref({
  rowsPerPage: 10,
  sortBy: 'id',
  descending: true
})
onBeforeMount(() => {
  const { id } = useRoute().params
  bspStore.getBspByID(id)
  bspStore.getBspCon(id)
})
function selectFile() {
  fileRef.value.pickFiles()
}

function fileOnUpdate(selectedFile) {
  console.log('selectedFile', selectedFile)
  console.log('bspStore.percentCompleted', bspStore.percentCompleted)
  bspStore.setPercentCompleted(0)
  const dialog = $q.dialog({
    component: DialogProgress,
    componentProps: {
      title: '',
      message: '',
      progressVal: bspStore.percentCompleted
    },
    progress: true,
    ok: false
  })
  const interval = setInterval(() => {
    dialog.update({
      title: '',
      message: '',
      progressVal: bspStore.percentCompleted
    })
    if (bspStore.percentCompleted === 1) {
      clearInterval(interval)
      dialog.update({
        title: '',
        message: 'Save successfully!',
        progressVal: bspStore.percentCompleted
      })
    }
  }, 100)
  const formData = new FormData()
  formData.append('file', selectedFile)
  bspStore.uploadBspConFile(bspStore.currentBsp.id, formData).catch(error => {
    console.error('Error during upload:', error)
    dialog.update({
      title: 'Upload Failed',
      message: 'An error occurred during the upload.'
    })
    clearInterval(interval)
    setTimeout(() => {
      dialog.hide()
      clearInterval(interval)
    }, 700)
  }).then(() => {
    setTimeout(() => {
      if (dialog) {
        dialog.hide()
      }
    }, 700)
    bspStore.getBspConFile(bspStore.currentBspCon.id).then(() => {
      isShowDialogBspConFileList.value = true
    })
    file.value = null
  })
}

onUnmounted(() => {
  if (file.value) {
    URL.revokeObjectURL(file.value)
  }
})
const getProduct = () => {
  bspStore.getBspCon()
}
const dialogBspConFileList = () => {
  bspStore.getBspConFile(bspStore.currentBspCon.id).then(() => {
    isShowDialogBspConFileList.value = true
  })
}
const creatBspCon = () => {
  isShowDialogCreatBspCon.value = true
}
const editBspConDialog = (props) => {
  bspStore.currentBspCon = props
  isShowDialogEditBspCon.value = true
}
const delBspDialog = (props) => {
  $q.dialog({
    component: DelDialog,
    componentProps: {
      title: 'Are you sure you want to delete this bsp configuration?',
      okBtn: 'Delete',
      cancelBtn: 'Cancel'
    }
  }).onOk(() => {
    bspStore.delBspCon(props).then(() => {
      setTimeout(() => {
        bspStore.getBspCon()
      }, 1000)
    })
  })
}
</script>
<style lang="sass" scoped>
</style>
