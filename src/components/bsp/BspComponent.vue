<template>
  <q-card class="" style="min-width: 800px;">
    <!-- Header & ToolBar -->
    <div class="theme-bg q-py-lg head flex justify-between items-center">
      <div class="flex items-center">
        <q-icon class="q-mr-sm" color="primary" name="layers" size="sm" alt="" />
        <span class="text-h6">BSP</span>
      </div>
      <q-space />
      <q-btn flat round color="primary" @click="bspStore.getBsp" icon="refresh" label="">
        <q-tooltip>
          Refresh
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="addBsp" icon="add" label="">
        <q-tooltip>
          Add New BSP
        </q-tooltip>
      </q-btn>
    </div>
    <!-- Table -->
    <div v-if="!getLoading">
      <q-table
        able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
        table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="getBspList"
        :columns="columns" row-key="id" v-model:pagination="pagination" :loading="getLoading" color="primary"
        no-data-icon="success">
        <!-- Actions -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn v-if="getUserData.role == 1" color="primary" round flat @click="editBspDialog(props.row)">
              <img src="~assets/img/icon/edit-o.svg" alt="">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn icon="open_in_new" color="primary" round flat @click="tobspCon(props.row)">
              <q-tooltip>
                Open List
              </q-tooltip>
            </q-btn>
            <q-btn v-if="getUserData.role == 1" color="negative" round flat @click="delBspDialog(props.row)">
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
  <CreateBspDialog v-model:isShow="isShowCreateBsp" />
  <EditBspDialog v-model:isShow="isShowEditBsp" />
  <DelDialog />
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from 'src/stores/common'
import { useBspStore } from 'src/stores/bsp'
import CreateBspDialog from './CreatBspDialog.vue'
import EditBspDialog from './EditBspDialog.vue'
import DelDialog from '../dialog/DelDialog.vue'

const $q = useQuasar()
const router = useRouter()
const bspStore = useBspStore()
const commonStore = useCommonStore()
const getUserData = computed(() => commonStore.getUserData)
const getLoading = computed(() => bspStore.getLoading)
const getBspList = computed(() => bspStore.getBspList)
const isShowCreateBsp = ref(false)
const isShowEditBsp = ref(false)

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
    name: 'product',
    required: true,
    label: 'Product',
    align: 'left',
    field: 'product',
    sortable: true,
    style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
  },
  { name: 'model', align: 'left', label: 'Model', field: 'model', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'comment', align: 'left', label: 'Comment', field: 'comment', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'actions', label: '', field: 'actions', sortable: false }
]
const pagination = ref({
  rowsPerPage: 10,
  sortBy: 'product',
  descending: true
})
onBeforeMount(() => {
  bspStore.getBsp()
})

const addBsp = () => {
  isShowCreateBsp.value = true
}
const editBspDialog = (props) => {
  isShowEditBsp.value = true
  bspStore.currentBsp = props
}
const tobspCon = (props) => {
  const ID = props.id
  if (ID) {
    bspStore.currentBsp = props
    router.push({ name: 'bspCon', params: { id: ID } })
  }
}
const delBspDialog = (props) => {
  $q.dialog({
    component: DelDialog,
    componentProps: {
      title: 'Are you sure you want to delete this bsp?',
      okBtn: 'Delete',
      cancelBtn: 'Cancel'
    }
  }).onOk(() => {
    bspStore.delBsp(props.id)
  })
}
</script>
<style lang="sass" scoped>
</style>
