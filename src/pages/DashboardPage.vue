<template>
  <q-page>
    <div class="flex items-start justify-center q-mx-md q-mt-lg">
      <div class="col-4 q-mr-lg">
        <div class="brandTabBtnWrap">
          <q-btn stack @click="showTab = 'Service'" :class="['brandTabBtn', showTab === 'Service' ? 'active' : '']" flat
            type="button">
            <img v-if="showTab === 'Service'" src="~assets/img/icon/globe-alt-g.svg" alt="">
            <img v-else src="~assets/img/icon/globe-alt.svg" alt="">
            <span>Service</span>
          </q-btn>
          <q-btn stack @click="showTab = 'Devices'" :class="['brandTabBtn', showTab === 'Devices' ? 'active' : '']" flat
            type="button">
            <img v-if="showTab === 'Devices'" src="~assets/img/icon/device-g.svg" alt="">
            <img v-else src="~assets/img/icon/device.svg" alt="">
            <span>Devices</span>
          </q-btn>
          <q-btn stack @click="showTab = 'Announcement'"
            :class="['brandTabBtn', showTab === 'Announcement' ? 'active' : '']" flat type="button">
            <img v-if="showTab === 'Announcement'" src="~assets/img/icon/org-g.svg" alt="">
            <img v-else src="~assets/img/icon/org.svg" alt="">
            <span>Announcement</span>
          </q-btn>
        </div>
      </div>
      <div class="col-8">
        <q-card class="" style="min-width: 800px;">
          <div class="bg-grey-3 q-py-lg head flex justify-between items-center">
            <div class="flex items-center">
              <img class="q-mr-sm" src="~assets/img/icon/globe-alt-g.svg" alt="">
              <span class="text-h6">Service</span>
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
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
const columns = [
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
]

const rows = [
  {
    name: 'Remote Manager Cloud',
    image: 'https://cdn.quasar.dev/app-icons/icon-128x128.png',
    status: 'active',
    url: 'https://remotemanager.novohyspace.com/'
  }
]
export default {
  setup() {
    return {
      pagination: {
        sortBy: 'name',
        descending: true,
        rowsPerPage: 10
      },
      showTab: ref('Service'),
      columns,
      rows
    }
  }
}
</script>
<style lang="sass" scoped>
.addBtn
  width: 65px
  height: 65px
  margin: 10px
  filter: opacity(60%)

//q-table
.q-table__card
  background-color: #fff0
.q-table-height
  height: 430px
  overflow-y: auto
.q-table__card .q-table__bottom-item
  color: #bbb

// Scroll-Shadow
.wrapper
  position: relative
  overflow: hidden
.shadow
  position: absolute
  left: 0
  z-index: 100
  width: 100%
  height: 15px
  background: red
.shadow--top
  margin: 0
  top: 0
  left: 0
  background: -webkit-linear-gradient(270deg, rgba(0, 0, 0, 0.10), transparent)
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.10), transparent)
  opacity: 0
.shadow--bottom
  margin: 0
  bottom: 0
  left: 0
  background: -webkit-linear-gradient(90deg, rgba(0, 0, 0, 0.05), transparent)
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.05), transparent)

</style>
