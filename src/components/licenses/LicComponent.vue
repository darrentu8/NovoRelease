<template>
  <q-card class="" style="min-width: 800px;">
    <!-- Header & ToolBar -->
    <div class="theme-bg q-py-lg head flex justify-between items-center">
      <div class="flex items-center">
        <!-- <img class="q-mr-sm" src="~assets/img/icon/org-g.svg" alt=""> -->
        <q-icon color="primary" size="sm" name="vpn_key" class="q-mr-sm"></q-icon>
        <span class="text-h6">Licenses</span>
      </div>
      <q-space />
      <q-input class="q-mr-md" rounded outlined v-model="filter" dense>
        <template v-slot:append>
          <q-icon v-if="filter !== ''" name="close" @click="filter = ''" class="cursor-pointer" />
          <q-icon name="search" color="primary" />
        </template>
      </q-input>
      <q-btn flat round color="primary" @click="refreshLic" icon="refresh">
        <q-tooltip>
          Refresh
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="createLic" icon="add">
        <q-tooltip>
          Create New Licenses
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="primary" @click="exportLic" icon="file_download">
        <q-tooltip>
          Export
        </q-tooltip>
      </q-btn>
    </div>
    <!-- Table -->
    <div v-if="!getLoading">
      <q-table :filter="filter" v-model:pagination="pagination"
        able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
        table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="getLicList"
        :columns="columns" row-key="id" :loading="getLoading" color="primary" no-data-icon="success">
        <!-- Search -->
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <!-- Type -->
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <span v-if="props.row.type === 1" outline class="text-grey-7" size="sm">Trial</span>
            <span v-else-if="props.row.type === 2" outline class="text-primary" size="sm">Paid</span>
          </q-td>
        </template>
        <!-- State -->
        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <q-chip v-if="props.row.state === 0" outline color="grey-7" size="sm">Pending</q-chip>
            <q-chip v-else-if="props.row.state === 1" outline color="primary" size="sm">In-Use</q-chip>
            <q-chip v-else-if="props.row.state === 2" outline color="negative" size="sm">Expired</q-chip>
          </q-td>
        </template>
        <!-- Actions -->
        <!-- <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn color="primary" round flat @click="editLicDialog(props.row)">
              <img src="~assets/img/icon/edit.svg" alt="">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn color="negative" round flat @click="delLicDialog(props.row)">
              <img src="~assets/img/icon/delete.svg" alt="">
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
          </q-td>
        </template> -->
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
  <CreatLicDialog />
  <ExportLicDialog />
  <DelDialog />
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import CreatLicDialog from './CreatLicDialog.vue'
import ExportLicDialog from './ExportLicDialog.vue'
import { mapMutations, mapGetters } from 'vuex'
import DelDialog from '../dialog/DelDialog.vue'

function padTo2Digits(num) {
  return num.toString().padStart(2, '0')
}

function formatDate(val) {
  if (val) {
    const date = new Date(parseInt(val))
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate())
      ].join('-')
    )
  } else {
    return val
  }
}
export default defineComponent({
  name: 'LinComponent',
  components: {
    ExportLicDialog,
    CreatLicDialog,
    DelDialog
  },
  mixins: [inputRules],
  computed: {
    ...mapGetters('lic', ['getLoading', 'getLicList'])
  },
  props: {
  },
  data() {
    return {
      filter: '',
      pagination: {
        rowsPerPage: 25,
        sortBy: 'cdate',
        descending: true
      },
      columns: [
        {
          name: 'maincode',
          required: true,
          label: 'Main code',
          align: 'left',
          field: row => row.maincode,
          format: val => `${val}`,
          sortable: true,
          style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
        },
        {
          name: 'childcode',
          required: true,
          label: 'Child code',
          align: 'left',
          field: row => row.childcode,
          format: val => `${val}`,
          sortable: true,
          style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
        },
        { name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true },
        { name: 'duration', align: 'left', label: 'Duration', field: 'duration', sortable: true },
        { name: 'cdate', format: val => formatDate(val), align: 'left', label: 'Create Date', field: 'cdate', sortable: true },
        { name: 'adate', format: val => formatDate(val), align: 'left', label: 'Activate Date', field: 'adate', sortable: true },
        { name: 'state', align: 'left', label: 'State', field: 'state', sortable: true },
        { name: 'comment', align: 'left', label: 'Comment', field: 'comment', sortable: true, style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;' }
        // ,{ name: 'actions', label: '', field: 'actions', sortable: false }
      ],
      rows: [
        {
          id: 1,
          maincode: 'LRMC-AAAA-BBBB-CCCC',
          childcode: 'LRMC-AAAA-BBBB-CCCC',
          duration: 24,
          type: 2,
          comment: '2023 PO Number-xxxxxx',
          cdate: '1692255710886',
          adate: '1692255710886'
        }
      ],
      loading: false,
      dense: false
    }
  },
  created() {
  },
  mounted() {
    this.getLic()
  },
  methods: {
    ...mapMutations('lic', ['setLoading', 'licList']),
    refreshLic() {
      this.$store.dispatch('lic/getLic')
    },
    getLic() {
      this.$store.dispatch('lic/getLic')
    },
    createLic() {
      this.$q
        .dialog({
          component: CreatLicDialog
        })
    },
    exportLic() {
      this.$q
        .dialog({
          component: ExportLicDialog
        })
    }
    // editLicDialog(props) {
    //   const Data = {
    //     id: props.id,
    //     title: props.title,
    //     content: props.content,
    //     tag: props.tag,
    //     state: props.state.toString(),
    //     udate: props.udate
    //   }
    //   this.$store.commit('Lic/editLic', Data)
    //   this.$q
    //     .dialog({
    //       component: EditLic
    //     })
    // },
    // delLicDialog(props) {
    //   this.$q.dialog({
    //     component: DelDialog,
    //     componentProps: {
    //       title: 'Are you sure you want to delete this System Licouncement?',
    //       okBtn: 'Delete',
    //       cancelBtn: 'Cancel'
    //     }
    //   }).onOk(() => {
    //     this.$store.dispatch('lic/delLic', props.id)
    //   })
    // }
  }
})
</script>
<style lang="sass" scoped>
</style>
