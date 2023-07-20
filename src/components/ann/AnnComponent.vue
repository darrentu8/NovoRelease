<template>
  <q-card class="" style="min-width: 800px;">
    <!-- Header & ToolBar -->
    <div class="bg-grey-3 q-py-lg head flex justify-between items-center">
      <div class="flex items-center">
        <img class="q-mr-sm" src="~assets/img/icon/org-g.svg" alt="">
        <span class="text-h6">System Announcement</span>
      </div>
      <q-space />
      <q-btn flat round color="primary" @click="refreshAnn" icon="refresh" label="" />
      <q-btn flat round color="primary" @click="createAnn" icon="add" label="" />
    </div>
    <!-- Table -->
    <div v-if="!getLoading">
      <q-table
        able-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
        table-header-style="color:#888888;fontWeight:bold;" flat class="full-width q-table-height" :rows="getAnnList"
        :columns="columns" row-key="id" :loading="getLoading" color="primary" no-data-icon="success">
        <!-- img -->
        <template v-slot:body-cell-img="props">
          <q-td :props="props">
            <q-img :src="props.row.img" spinner-color="grey-4" spinner-size="md" :alt="props.row.img"
              style="height:50px;">
              <q-tooltip class="bg-grey-5 no-border-radius flex flex-center" anchor="center right" self="center left"
                :offset="[10, 10]" style="width: 300px; height: 250px;">
                <q-img :src="props.row.img" :alt="props.row.img" style="max-width: 300px; height: 200px;"
                  :fit="contain" />
              </q-tooltip>
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-4 text-white">
                  <q-icon name="close"></q-icon>
                </div>
              </template>
            </q-img>
          </q-td>
        </template>
        <!-- Tag -->
        <template v-slot:body-cell-tag="props">
          <q-td :props="props">
            <div v-if="props.row.tag === 'new'" class="flex flex-center">
              <img src="~assets/img/icon/new.svg" :alt="props.row.tag" />
              <q-tooltip>{{ props.row.tag }}</q-tooltip>
              <!-- <span>{{ props.row.tag }}</span> -->
            </div>
            <div v-else-if="props.row.tag === 'fix'" class="flex flex-center">
              <img src="~assets/img/icon/check.svg" :alt="props.row.tag" />
              <q-tooltip>{{ props.row.tag }}</q-tooltip>
              <!-- <span>{{ props.row.tag }}</span> -->
            </div>
            <div v-else-if="props.row.tag === 'support'" class="flex flex-center">
              <img src="~assets/img/icon/clipboard.svg" :alt="props.row.tag" />
              <q-tooltip>{{ props.row.tag }}</q-tooltip>
              <!-- <span>{{ props.row.tag }}</span> -->
            </div>
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
            <q-btn color="primary" round flat @click="editAnnDialog(props.row)">
              <img src="~assets/img/icon/edit.svg" alt="">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn color="negative" round flat @click="delAnnDialog(props.row)">
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
  <CreateAnn />
  <EditAnn />
  <DelDialog />
</template>

<script>
import { defineComponent } from 'vue'
import inputRules from 'src/mixins/inputRules.js'
import CreateAnn from './CreatAnnDialog.vue'
import EditAnn from './EditAnn.vue'
import { mapMutations, mapGetters } from 'vuex'
import DelDialog from '../dialog/DelDialog.vue'

export default defineComponent({
  name: 'AnnComponent',
  components: {
    CreateAnn,
    EditAnn,
    DelDialog
  },
  mixins: [inputRules],
  computed: {
    ...mapGetters('ann', ['getLoading', 'getAnnList'])
  },
  props: {
  },
  data() {
    return {
      columns: [
        {
          name: 'title',
          required: true,
          label: 'Title',
          align: 'left',
          field: row => row.title,
          format: val => `${val}`,
          sortable: true,
          style: 'max-width: 300px;text-overflow: ellipsis;overflow: hidden;'
        },
        { name: 'tag', align: 'center', label: 'Tag', field: 'tag', sortable: true },
        { name: 'state', align: 'left', label: 'Status', field: 'state', sortable: true },
        { name: 'udate', format: val => this.toDays(val), align: 'left', label: 'Last Updated', field: 'udate', sortable: true },
        { name: 'actions', label: '', field: 'actions', sortable: false }
      ],
      rows: [
        {
          id: '',
          content: '',
          title: 'New feature',
          tag: 'New',
          state: 1,
          udate: '2023-07-11'
        }
      ],
      loading: false,
      dense: false
    }
  },
  created() {
  },
  mounted() {
    this.getAnn()
  },
  methods: {
    ...mapMutations('ann', ['setLoading', 'AnnList']),
    toDays(val) {
      const date = new Date(parseInt(val))
      const localeSpecificTime = date.toLocaleTimeString()
      return localeSpecificTime
    },
    refreshAnn() {
      this.$store.dispatch('ann/getAnn')
    },
    getAnn() {
      this.$store.dispatch('ann/getAnn')
    },
    createAnn() {
      this.$q
        .dialog({
          component: CreateAnn
        })
    },
    editAnnDialog(props) {
      this.$store.commit('ann/editAnn', props)
      this.$q
        .dialog({
          component: EditAnn
        })
    },
    delAnnDialog(props) {
      this.$q.dialog({
        component: DelDialog,
        componentProps: {
          title: 'Are you sure you want to delete this Announcement?',
          okBtn: 'Delete',
          cancelBtn: 'cancel'
        }
      }).onOk(() => {
        this.$store.dispatch('ann/delAnn', props.id)
      })
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
