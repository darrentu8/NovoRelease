<template>
  <q-card class="" style="min-width: 800px;">
    <!-- Header & ToolBar -->
    <div class="theme-bg q-py-lg head flex justify-between items-center">
      <div class="flex items-center">
        <q-icon class="q-mr-sm" color="primary" name="developer_board" size="sm" alt="" />
        <span class="text-h6">BSP</span>
      </div>
      <q-space />
      <q-input class="q-mr-md" rounded outlined v-model="filter" dense>
        <template v-slot:append>
          <q-icon v-if="filter !== ''" name="close" @click="filter = ''" class="cursor-pointer" />
          <q-icon name="search" color="primary" />
        </template>
      </q-input>
      <q-btn flat round color="primary" @click="refreshBsp" icon="refresh">
        <q-tooltip>
          Refresh
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="createBsp" icon="add">
        <q-tooltip>
          Create New BSP
        </q-tooltip>
      </q-btn>
    </div>
    <!-- Table -->
    <div v-if="!getLoading">
      <q-table :filter="filter" v-model:pagination="pagination"
        able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
        table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="getBspList"
        :columns="columns" row-key="id" :loading="getLoading" color="primary" no-data-icon="success">
        <!-- Search -->
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <!-- Actions -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn color="primary" round flat @click="editBspDialog(props.row)">
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
  <CreatBspDialog />
  <EditBsp />
  <DelDialog />
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import CreatBspDialog from './CreatBspDialog.vue'
import EditBsp from './EditBsp.vue'
import { mapMutations, mapGetters } from 'vuex'
import DelDialog from '../dialog/DelDialog.vue'

export default defineComponent({
  name: 'BspComponent',
  components: {
    EditBsp,
    CreatBspDialog,
    DelDialog
  },
  mixins: [inputRules],
  computed: {
    ...mapGetters('bsp', ['getLoading', 'getBspList'])
  },
  props: {
  },
  data() {
    return {
      filter: '',
      pagination: {
        rowsPerPage: 25,
        sortBy: 'model',
        descending: true
      },
      columns: [
        {
          name: 'product',
          required: true,
          label: 'Product',
          align: 'left',
          field: row => row.product,
          format: val => `${val}`,
          sortable: true,
          style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
        },
        { name: 'model', align: 'left', label: 'Model', field: 'model', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
        { name: 'comment', align: 'left', label: 'Comment', field: 'comment', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' },
        { name: 'actions', label: '', field: 'actions', sortable: false }
      ],
      rows: [
        {
          id: 1,
          product: 'novods',
          model: 'ds310',
          comment: 'NovoDS-DS310'
        }
      ],
      loading: false,
      dense: false
    }
  },
  created() {
  },
  mounted() {
    this.getBsp()
  },
  methods: {
    ...mapMutations('bsp', ['setLoading', 'bspList']),
    refreshBsp() {
      this.$store.dispatch('bsp/getBsp')
    },
    getBsp() {
      this.$store.dispatch('bsp/getBsp')
    },
    createBsp() {
      this.$q
        .dialog({
          component: CreatBspDialog
        })
    },
    editBspDialog(props) {
      const Data = {
        id: props.id,
        name: props.name,
        state: props.state.toString(),
        url: props.url,
        description: props.description,
        img: props.img
      }
      this.$store.commit('bsp/editBsp', Data)
      this.$q
        .dialog({
          component: EditBsp
        })
    },
    delBspDialog(props) {
      this.$q.dialog({
        component: DelDialog,
        componentProps: {
          title: 'Are you sure you want to delete this BSP?',
          okBtn: 'Delete',
          cancelBtn: 'Cancel'
        }
      }).onOk(() => {
        this.$store.dispatch('bsp/delBsp', props.id)
      })
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
