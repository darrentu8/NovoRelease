<template>
  <q-card class="" style="min-width: 800px;">
    <!-- Header & ToolBar -->
    <div class="theme-bg q-py-lg head flex justify-between items-center">
      <div class="flex items-center">
        <img class="q-mr-sm" src="~assets/img/icon/globe-alt-g.svg" alt="">
        <span class="text-h6">Service</span>
      </div>
      <q-space />
      <q-btn flat round color="primary" @click="refreshService" icon="refresh" label="" />
      <q-btn flat round color="primary" @click="createService" icon="add" label="" />
    </div>
    <!-- Table -->
    <div v-if="!getLoading">
      <q-table
        able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
        table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="getServiceList"
        :columns="columns" row-key="id" :loading="getLoading" color="primary" no-data-icon="success">
        <!-- img -->
        <template v-slot:body-cell-img="props">
          <q-td :props="props">
            <q-img :src="props.row.img" spinner-color="grey-4" spinner-size="md" :alt="props.row.img" style="height:50px;"
              fit="contain">
              <q-tooltip class="bg-grey-5 no-border-radius flex flex-center" anchor="center right" self="center left"
                :offset="[10, 10]" style="width: 300px; height: 250px;">
                <q-img :src="props.row.img" :alt="props.row.img" style="max-width: 300px; height: 200px;" fit="contain" />
              </q-tooltip>
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-4 text-white">
                  <q-icon name="close"></q-icon>
                </div>
              </template>
            </q-img>
          </q-td>
        </template>
        <!-- State -->
        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <q-chip v-if="props.row.state === 1" outline color="primary" size="sm">Active</q-chip>
            <q-chip v-else-if="props.row.state === 0" outline color="grey-6" size="sm">Pending</q-chip>
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
  <CreateService />
  <EditService />
  <DelDialog />
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import CreateService from './CreatServiceDialog.vue'
import EditService from '../service/EditService.vue'
import { mapMutations, mapGetters } from 'vuex'
import DelDialog from '../dialog/DelDialog.vue'

export default defineComponent({
  name: 'ServiceComponent',
  components: {
    CreateService,
    EditService,
    DelDialog
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
          sortable: true,
          style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
        },
        {
          name: 'img', align: 'left', label: 'Img', field: 'img', sortable: false, style: 'width: 100px'
        },
        { name: 'state', align: 'center', label: 'Status', field: 'state', sortable: true },
        { name: 'url', align: 'left', label: 'URL', field: 'url', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
        { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true, style: 'max-width: 200px;text-overflow: ellipsis;overflow: hidden;' },
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
    refreshService() {
      this.$store.dispatch('service/getService')
    },
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
      const Data = {
        id: props.id,
        name: props.name,
        state: props.state.toString(),
        url: props.url,
        description: props.description,
        img: props.img
      }
      this.$store.commit('service/editService', Data)
      this.$q
        .dialog({
          component: EditService
        })
    },
    delServiceDialog(props) {
      this.$q.dialog({
        component: DelDialog,
        componentProps: {
          title: 'Are you sure you want to delete this service?',
          okBtn: 'Delete',
          cancelBtn: 'Cancel'
        }
      }).onOk(() => {
        this.$store.dispatch('service/delService', props.id)
      })
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
