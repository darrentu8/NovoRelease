<template>
  <q-card class="" style="min-width: 800px;">
    <div class="bg-grey-3 q-py-lg head flex justify-between items-center">
      <div class="flex items-center">
        <img class="q-mr-sm" src="~assets/img/icon/device-g.svg" alt="">
        <span class="text-h6">Device</span>
      </div>
      <q-btn flat round color="primary" @click="showTab = 'Service'" icon="add" label="" />
    </div>
    <q-table
      able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
      table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="rows"
      :columns="columns" row-key="name">
      <!-- Actions -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="primary" round flat @click.stop>
            <img src="~assets/img/icon/edit.svg" alt="">
            <q-tooltip>
              Edit
            </q-tooltip>
          </q-btn>
          <q-btn color="negative" round flat @click.stop>
            <img src="~assets/img/icon/delete.svg" alt="">
            <q-tooltip>
              Delete
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-card>
  <CreateService />
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import CreateService from '../service/CreateService.vue'

export default defineComponent({
  name: 'DeviceComponent',
  components: {
    CreateService
  },
  mixins: [inputRules],
  props: {
  },
  data() {
    return {
      columns: [
        {
          name: 'model',
          required: true,
          label: 'Model',
          align: 'left',
          field: row => row.model,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'version', align: 'left', label: 'Version', field: 'version', sortable: true },
        { name: 'actions', label: '', field: 'actions', sortable: false }
      ],
      rows: [
        {
          model: 'NovoConnect-NC-X700',
          version: 'v4.0.1520'
        }
      ],
      loading: false,
      dense: false
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  }
})
</script>
<style lang="sass" scoped>
</style>
