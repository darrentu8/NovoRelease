<template>
  <q-card class="" style="min-width: 993px;">
    <!-- Header & ToolBar -->
    <div class="theme-bg q-py-lg head flex justify-between items-center">
      <q-btn flat round color="primary" @click="router.push({ name: 'product' })" icon="arrow_back" label="">
        <q-tooltip>
          Back
        </q-tooltip>
      </q-btn>
      <div class="q-ml-md flex items-center">
        <q-icon class="q-mr-sm" color="primary" name="dns" size="sm" alt="" />
        <span v-if="!getLoading" class="text-h6">{{ currentProduct.name }}, APP ID: {{
          currentProduct.appid }}, CDN: {{ currentProduct.cdn ?
    'true' : 'false' }}</span>
      </div>
      <q-space />
      <q-btn flat round color="primary" @click="getProduct" icon="refresh" label="">
        <q-tooltip>
          Refresh
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="creatRelease" icon="add" label="">
        <q-tooltip>
          Create New Product
        </q-tooltip>
      </q-btn>
    </div>
    <!-- Table -->
    <div v-if="!getLoading">
      <q-table
        able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
        table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height"
        :rows="currentProductList" :columns="columns" row-key="id" v-model:pagination="pagination" :loading="getLoading"
        color="primary" no-data-icon="success">
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
            <q-btn color="primary" round flat @click="editReleaseDialog(props.row)">
              <img src="~assets/img/icon/edit-o.svg" alt="">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn color="negative" round flat @click="delReleaseDialog(props.row)">
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
  <CreatRelease v-model:isShow="isShowDialogCreatRelease" />
  <DialogEditRelease v-model:isShow="isShowDialogEditRelease" />
  <DelDialog />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { ref, computed, onBeforeMount } from 'vue'
import { useProductStore } from 'src/stores/product'
import CreatRelease from './CreatReleaseDialog.vue'
import DialogEditRelease from './EditReleaseDialog.vue'
import DelDialog from '../dialog/DelDialog.vue'

const $q = useQuasar()
const router = useRouter()
const productStore = useProductStore()
const getLoading = computed(() => productStore.getLoading)
const currentProduct = computed(() => productStore.currentProduct)
const currentProductList = computed(() => productStore.currentProductList)
const isShowDialogCreatRelease = ref(false)
const isShowDialogEditRelease = ref(false)

const columns = ref([
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true },
  { name: 'version', align: 'center', label: 'Version', field: 'version', sortable: true },
  { name: 'filename', align: 'center', label: 'Filename', field: 'filename', sortable: true },
  { name: 'description', align: 'center', label: 'Description', field: 'description', sortable: true },
  { name: 'state', align: 'center', label: 'State', field: 'state', sortable: true, format: val => val ? 'enable' : 'disable' },
  {
    name: 'md5',
    required: true,
    label: 'MD5',
    align: 'left',
    field: row => row.md5,
    format: val => `${val}`,
    sortable: true,
    style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
  },
  { name: 'parameters', align: 'left', label: 'Parameters', field: 'parameters', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'actions', label: '', field: 'actions', sortable: false }
])

const pagination = ref({
  rowsPerPage: 10,
  sortBy: 'id',
  descending: true
})
onBeforeMount(() => {
  const { id } = useRoute().params
  productStore.getProductByID(id)
  productStore.getProductDetail(id)
})

const getProduct = () => {
  productStore.getProductDetail()
}
const creatRelease = () => {
  isShowDialogCreatRelease.value = true
}
const editReleaseDialog = (props) => {
  productStore.currentRelease = props
  isShowDialogEditRelease.value = true
}
const delReleaseDialog = (props) => {
  $q.dialog({
    component: DelDialog,
    componentProps: {
      title: 'Are you sure you want to delete this release?',
      okBtn: 'Delete',
      cancelBtn: 'Cancel'
    }
  }).onOk(() => {
    productStore.delRelease(props).then(() => {
      setTimeout(() => {
        productStore.getProductDetail()
      }, 1000)
    })
  })
}
</script>
<style lang="sass" scoped>
</style>
