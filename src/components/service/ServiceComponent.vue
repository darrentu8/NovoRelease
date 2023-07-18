<template>
  <q-card class="" style="min-width: 800px;">
    <div class="bg-grey-3 q-py-lg head flex justify-between items-center">
      <div class="flex items-center">
        <img class="q-mr-sm" src="~assets/img/icon/globe-alt-g.svg" alt="">
        <span class="text-h6">Service</span>
      </div>
      <q-btn flat round color="primary" @click="createService" icon="add" label="" />
    </div>
    <q-table
      able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
      table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="getServiceList"
      :columns="columns" row-key="id">
      <!-- img -->
      <template v-slot:body-cell-img="props">
        <q-td :props="props">
          <q-img :src="props.row.img" :alt="props.row.img" style="height:50px;" />
        </q-td>
      </template>
      <!-- Actions -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="primary" round flat @click="editServiceDialog(props.row)">
            <img src="~assets/img/icon/edit.svg" alt="">
            <q-tooltip>
              Edit
            </q-tooltip>
          </q-btn>
          <q-btn color="negative" round flat @click="delServiceDialog(props.row)">
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
  <EditService />
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import CreateService from '../service/CreateService.vue'
import EditService from '../service/EditService.vue'
import { mapMutations, mapGetters } from 'vuex'

export default defineComponent({
  name: 'ServiceComponent',
  components: {
    CreateService,
    EditService
  },
  mixins: [inputRules],
  computed: {
    ...mapGetters('service', ['getLoading', 'getServiceList'])
  },
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
        { name: 'img', align: 'left', label: 'Img', field: 'img', sortable: false },
        { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
        { name: 'url', align: 'left', label: 'URL', field: 'url', sortable: true },
        { name: 'actions', label: '', field: 'actions', sortable: false }
      ],
      loading: false,
      dense: false
    }
  },
  created() {
  },
  mounted() {
    this.getService()
  },
  methods: {
    ...mapMutations('service', ['setLoading', 'serviceList']),
    getService() {
      this.$store.dispatch('service/getService')
    },
    createService() {
      this.$q
        .dialog({
          component: CreateService
        })
    },
    editServiceDialog(props) {
      this.$store.commit('service/editService', props)
      this.$q
        .dialog({
          component: EditService
        })
    },
    delServiceDialog(props) {
      this.$store.dispatch('service/delService', props.id)
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
