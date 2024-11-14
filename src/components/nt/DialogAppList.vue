<template>
  <q-dialog :model-value="isShow" @before-hide="hideDialog" @before-show="beforeShow">
    <q-card style="width: 100%;min-width: 700px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold"><span v-if="!getLoading" class="text-h6">App List</span></div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="">
        <!-- Table -->
        <div v-if="!getLoading">
          <q-table
            able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
            table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height"
            :rows="getAppList" :columns="columns" row-key="id" :loading="getLoading || getDialogBtnLoading"
            color="primary" no-data-icon="success">
            <!-- Actions -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn color="negative" round flat @click="delAppListDialog(props.row)">
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
            </tr>
          </thead>

          <tbody>
            <tr v-for="n in 2" :key="n">
              <td class="text-left">
                <q-skeleton animation="blink" type="text" width="85px" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <DelDialog />
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onBeforeMount, computed } from 'vue'
import { useNtStore } from 'src/stores/nt'
import DelDialog from '../dialog/DelDialog.vue'

const $q = useQuasar()
defineProps(['isShow'])
const emit = defineEmits(['update:isShow'])

const hideDialog = () => {
  emit('update:isShow', false)
}
const beforeShow = () => {
}
const ntStore = useNtStore()
const getLoading = computed(() => ntStore.getDialogLoading)
const getDialogBtnLoading = computed(() => ntStore.getDialogBtnLoading)
const getAppList = computed(() => ntStore.getAppList)

const columns = [
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'package', align: 'left', label: 'Package', field: 'package', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'version', align: 'left', label: 'Version', field: 'version', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
  { name: 'actions', label: '', field: 'actions', sortable: false }
]

onBeforeMount(() => {
})

const delAppListDialog = (prop) => {
  $q.dialog({
    component: DelDialog,
    componentProps: {
      title: 'Are you sure you want to delete ' + prop.name + ' file?',
      okBtn: 'Delete',
      cancelBtn: 'Cancel'
    }
  }).onOk(() => {
    ntStore.delAppListFile(prop)
  })
}
</script>
<style lang="sass" scoped>
</style>
