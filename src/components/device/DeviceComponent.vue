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
      <!-- Image -->
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <q-img :src="props.row.image" :alt="props.row.image" style="height:30px;" />
        </q-td>
      </template>
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
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'image', align: 'center', label: 'Image', field: 'image', sortable: false },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
        { name: 'url', align: 'center', label: 'URL', field: 'url', sortable: true },
        { name: 'actions', label: '', field: 'actions', sortable: false }
      ],
      rows: [
        {
          name: 'Remote Manager Cloud',
          image: 'https://cdn.quasar.dev/app-icons/icon-128x128.png',
          status: 'active',
          url: 'https://remotemanager.novohyspace.com/'
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
