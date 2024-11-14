<template>
  <q-card class="" style="min-width: 800px;">
    <!-- Header & ToolBar -->
    <div class="theme-bg q-py-lg head flex justify-between items-center">
      <div class="flex items-center">
        <q-icon class="q-mr-sm" color="primary" name="widgets" size="sm" alt="" />
        <span class="text-h6">NT App Management</span>
      </div>
      <q-space />
      <q-btn outline class="q-mr-md" color="primary" v-on:click="selectFile()" label="Upload File">
        <q-tooltip>
          Upload File
        </q-tooltip>
      </q-btn>
      <q-btn outline class="q-mr-md" color="primary" v-on:click="getAppList()" label="App List">
        <q-tooltip>
          App list
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="ntStore.getNt" icon="refresh" label="">
        <q-tooltip>
          Refresh
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="addNt" icon="add" label="">
        <q-tooltip>
          Create Release
        </q-tooltip>
      </q-btn>
    </div>
    <!-- Table -->
    <div v-if="!getLoading">
      <q-table
        able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
        table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="getNtList"
        :columns="columns" row-key="id" v-model:pagination="pagination" :loading="getLoading" color="primary"
        no-data-icon="success">
        <!-- Actions -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn v-if="getUserData.role == 1" color="primary" round flat @click="editNtDialog(props.row)">
              <img src="~assets/img/icon/edit-o.svg" alt="">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn v-if="getUserData.role == 1" color="negative" round flat @click="delNtDialog(props.row)">
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
    <q-markup-table v-else flat class="full-width" style="max-width: 800px;">
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
  <CreateNtDialog v-model:isShow="isShowCreateNt" />
  <EditNtDialog v-model:isShow="isShowEditNt" />
  <DialogAppList v-model:isShow="isShowAppList" />
  <DelDialog />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { inject, ref, computed, onBeforeMount, onUnmounted } from 'vue'
import { useCommonStore } from 'src/stores/common'
import { useNtStore } from 'src/stores/nt'
import CreateNtDialog from './CreatNtDialog.vue'
import EditNtDialog from './EditNtDialog.vue'
import DialogAppList from './DialogAppList.vue'
import DelDialog from '../dialog/DelDialog.vue'

const $q = useQuasar()
const ntStore = useNtStore()
const commonStore = useCommonStore()
const getUserData = computed(() => commonStore.getUserData)
const getLoading = computed(() => ntStore.getLoading)
const getNtList = computed(() => ntStore.getNtList)
const isShowCreateNt = ref(false)
const isShowEditNt = ref(false)
const isShowAppList = ref(false)

const bus = inject('bus')

const columns = [
  // {
  //   name: 'id',
  //   required: true,
  //   label: 'ID',
  //   align: 'left',
  //   field: 'id',
  //   visible: false,
  //   sortable: true,
  //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  //   style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
  // },
  {
    name: 'model',
    required: true,
    label: 'Model',
    align: 'left',
    field: 'model',
    sortable: true,
    style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
  },
  { name: 'version', align: 'left', label: 'Version', field: 'version', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'publishDate', align: 'left', label: 'Publish Date', field: row => new Date(row.publishDate).toLocaleDateString(), sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'actions', label: '', field: 'actions', sortable: false }
]
const pagination = ref({
  rowsPerPage: 10,
  sortBy: 'product',
  descending: true
})
onBeforeMount(() => {
  ntStore.getNt()
  ntStore.getApp()
})

onUnmounted(() => {
})
function selectFile() {
  bus.emit('pickNTFiles')
}

const getAppList = () => {
  ntStore.getApp().then(() => {
    isShowAppList.value = true
  })
}
const addNt = () => {
  isShowCreateNt.value = true
}
const editNtDialog = (props) => {
  ntStore.getNtByID(props.id).then(() => {
    isShowEditNt.value = true
  })
}
const delNtDialog = (props) => {
  $q.dialog({
    component: DelDialog,
    componentProps: {
      title: 'Are you sure you want to delete this release?',
      okBtn: 'Delete',
      cancelBtn: 'Cancel'
    }
  }).onOk(() => {
    ntStore.delNt(props.id)
  })
}
</script>
<style lang="sass" scoped>
</style>
