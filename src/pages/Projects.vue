<template>
  <q-page>
    <div class="flex justify-between items-center q-mx-md">
      <Hero @createProject="createProjectDialog" />
      <!-- <h4 class="full-width q-mb-xs">Recent</h4> -->
      <div class="col-6">
        <q-btn @click="showTab = 'cloud'" :class="['brandTabBtn', showTab === 'cloud' ? 'active' : '']"
          icon="cloud_queue" flat label="Cloud Project" type="button" color="A1A1A1" :loading="loading">
        </q-btn>
        <q-btn @click="showTab = 'share'" :class="['brandTabBtn', showTab === 'share' ? 'active' : '']" icon="people"
          flat label="Share with me" type="button" color="A1A1A1" :loading="loading">
        </q-btn>
        <!-- <q-btn @click="showTab = 'device'" :class="['brandTabBtn', showTab === 'device' ? 'active' : '']"
          icon="add_to_queue" flat label="My device projects" type="button" color="#A1A1A1" :loading="loading">
        </q-btn> -->
      </div>
      <div class="col-6">
        <ToolBar ref="toolBar" @setSort="setSort" class="" />
      </div>
    </div>
    <div v-if="showTab === 'cloud'" class="q-ma-lg">
      <div v-if="searchProjectList.length" ref="wrapper" class="wrapper">
        <div v-if="!getIsList" ref="content" class="content q-table-height">
          <div class="shadow shadow--top"></div>
          <div class="shadow shadow--bottom"></div>
          <ProjectBox ref="projectBox" v-for="project of searchProjectList" :key="project.id" :project="project" />
        </div>
        <div v-if="getIsList">
          <div v-if="!getLoading" class="flex column items-start justify-start">
            <q-table
              table-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
              table-header-style="color:#bbb" flat row-key="pid" class="full-width q-table-height"
              @row-click="intoProject" @request="loadingProject" :loading="getLoading" :rows="searchProjectList"
              :columns="columns" v-model:pagination="pagination" text-color:pagination="color:#bbb"
              no-data-label="Unable to find anything to show here. Click Create a project or join one.">
              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  {{ props.row.name }}
                  <q-popup-edit :ref="'showEditNamePop' + props.row.id" v-model="props.row.name" v-slot="scope"
                    :validate="checkVal" @hide="resetVal">
                    <q-input v-model="scope.value" hint="Press enter to save." dense autofocus counter
                      :error="errorRequire" @keyup.enter="saveName(props.row, scope.value)" />
                  </q-popup-edit>
                </q-td>
              </template>
              <!-- Avatar -->
              <template v-slot:body-cell-projectUser="props">
                <q-td v-if="props.value.length <= 3" class="" :props="props">
                  <span v-for="(user, i) of props.value" class="q-mr-xs" :key="user.id">
                    <q-avatar v-if="user.thumbnail" class="cursor-pointer" size="35px" font-size="14px"
                      @click="profile(user)">
                      <q-img spinner-color="green" spinner-size="20px" :src="user.thumbnail" />
                    </q-avatar>
                    <q-avatar v-else @click="profile(user)" class="cursor-pointer" size="35px" font-size="14px"
                      :style="{ 'background-color': colorArr[i] }"
                      :text-color="getLuminosity(colorArr[i]) > 0.5 ? 'black' : 'white'">
                      {{ avatarName(user) }}
                    </q-avatar>
                  </span>
                </q-td>
                <q-td v-if="props.value.length > 3" class="" :props="props">
                  <span v-for="(user, i) of props.value.slice(0, 3)" class="q-mr-xs" :key="user.id">
                    <q-avatar v-if="user.thumbnail" class="cursor-pointer" size="35px" font-size="14px"
                      @click="profile(user)">
                      <q-img spinner-color="green" spinner-size="20px" :src="user.thumbnail" />
                    </q-avatar>
                    <q-avatar v-else @click="profile(user)" class="cursor-pointer" size="35px" font-size="14px"
                      :style="{ 'background-color': colorArr[i] }"
                      :text-color="getLuminosity(colorArr[i]) > 0.5 ? 'black' : 'white'">
                      {{ avatarName(user) }}
                    </q-avatar>
                  </span>
                  <q-avatar class="cursor-pointer" size="35px" font-size="14px"
                    :style="{ 'background-color': colorArr[3] }"
                    :text-color="getLuminosity(colorArr[3]) > 0.5 ? 'black' : 'white'">
                    +{{ props.value.length - 3 }}
                  </q-avatar>
                </q-td>
              </template>
              <!-- Actions -->
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn color="primary" round flat icon="more_horiz" @click.stop>
                    <q-tooltip>
                      More
                    </q-tooltip>
                    <ProjectMoreDialog :project="props.row" @showEditName="showEditNamePop(props.row.id)"
                      :share="false" />
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
          <div v-else class="flex column items-start justify-start q-ma-lg">
            <q-markup-table flat class="">
              <thead>
                <tr>
                  <th class="text-left" style="width: 100vw;">
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
          </div>
        </div>
      </div>
      <div v-else class="q-mx-md rounded-borders border-grey flex items-center column justify-center q-px-lg q-py-lg">
        <div class="flex-center items-center text-center justify-center ">
          <h6 class="q-mb-none text-light text-grey" style="font-size: 20px;">Unable to find anything to show here.</h6>
          <h6 class="text-grey text-light full-width q-mt-xs" style="font-size: 20px;">
            Let’s click
            <q-img class="addBtn cursor-pointer" :src="addBtn" alt="Create a project" @click="createProjectDialog" />
            to create one.
          </h6>
        </div>
      </div>
    </div>
    <div v-else-if="showTab === 'share'" class="q-ma-lg">
      <div v-if="searchShareProjectList.length" class="wrapper">
        <div v-if="!getIsList" class="content q-table-height">
          <div class="shadow shadow--top"></div>
          <div class="shadow shadow--bottom"></div>
          <ProjectBox ref="projectBox" v-for="project of searchShareProjectList" :key="project.id" :project="project" />
        </div>
        <div v-if="getIsList">
          <div v-if="!getLoading" class="flex column items-start justify-start">
            <q-table
              table-style="overflow-y:auto;overflow-x:hidden;top: -1px;position: relative;background: linear-gradient(rgb(242, 242, 242), transparent) center top / 100% 100px no-repeat local, radial-gradient(at 50% -15px, rgba(0, 0, 0, 0.8), transparent 70%) center top / 100000% 12px scroll;background-repeat: no-repeat;background-attachment: local, scroll;"
              table-header-style="color:#bbb" flat row-key="pid" class="full-width q-table-height"
              @request="loadingProject" :loading="getLoading" :rows="searchShareProjectList" :columns="columnsShare"
              v-model:pagination="pagination" @row-click="intoProject"
              no-data-label="Unable to find anything to show here. Click Create a project or join one.">
              <template v-slot:body-cell-name="props">
                <q-td :props="props">
                  {{ props.row.name }}
                  <q-popup-edit :ref="'showEditNamePop' + props.row.id" v-model="props.row.name" v-slot="scope"
                    :validate="checkVal" @hide="resetVal">
                    <q-input v-model="scope.value" hint="Press enter to save." dense autofocus counter
                      :error="errorRequire" @keyup.enter="saveName(props.row, scope.value)" />
                  </q-popup-edit>
                </q-td>
              </template>
              <!-- Owner -->
              <template v-slot:body-cell-projectOwner="props">
                <q-td v-if="props.value" class="" :props="props">
                  <span class="q-mr-xs">
                    <q-avatar v-if="props.value.thumbnail" class="cursor-pointer" size="35px" font-size="14px"
                      @click.stop="profile(props.value)">
                      <q-img spinner-color="green" spinner-size="20px" :src="props.value.thumbnail" />
                    </q-avatar>
                    <q-avatar v-else @click.stop="profile(props.value)" class="cursor-pointer" size="35px"
                      font-size="14px" :style="{ 'background-color': ownerColor }"
                      :text-color="getLuminosity(ownerColor) > 0.5 ? 'black' : 'white'">
                      {{ avatarName(props.value) }}
                    </q-avatar>
                  </span>
                </q-td>
              </template>
              <!-- Avatar -->
              <template v-slot:body-cell-projectUser="props">
                <q-td v-if="props.value.length <= 3" class="" :props="props">
                  <span v-for="(user, i) of props.value" class="q-mr-xs" :key="user.id">
                    <q-avatar v-if="user.thumbnail" class="cursor-pointer" size="35px" font-size="14px"
                      @click.stop="profile(user)">
                      <q-img spinner-color="green" spinner-size="20px" :src="user.thumbnail" />
                    </q-avatar>
                    <q-avatar v-else @click.stop="profile(user)" class="cursor-pointer" size="35px" font-size="14px"
                      :style="{ 'background-color': colorArr[i] }"
                      :text-color="getLuminosity(colorArr[i]) > 0.5 ? 'black' : 'white'">
                      {{ avatarName(user) }}
                    </q-avatar>
                  </span>
                </q-td>
                <q-td v-if="props.value.length > 3" class="" :props="props">
                  <span v-for="(user, i) of props.value.slice(0, 3)" class="q-mr-xs" :key="user.id">
                    <q-avatar v-if="user.thumbnail" class="cursor-pointer" size="35px" font-size="14px"
                      @click.stop="profile(user)">
                      <q-img spinner-color="green" spinner-size="20px" :src="user.thumbnail" />
                    </q-avatar>
                    <q-avatar v-else @click.stop="profile(user)" class="cursor-pointer" size="35px" font-size="14px"
                      :style="{ 'background-color': colorArr[i] }"
                      :text-color="getLuminosity(colorArr[i]) > 0.5 ? 'black' : 'white'">
                      {{ avatarName(user) }}
                    </q-avatar>
                  </span>
                  <q-avatar class="cursor-pointer" size="35px" font-size="14px"
                    :style="{ 'background-color': colorArr[3] }"
                    :text-color="getLuminosity(colorArr[3]) > 0.5 ? 'black' : 'white'">
                    +{{ props.value.length - 3 }}
                  </q-avatar>
                </q-td>
              </template>
              <!-- Actions -->
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn color="primary" round flat icon="more_horiz" @click.stop>
                    <q-tooltip>
                      More
                    </q-tooltip>
                    <ProjectMoreDialog :project="props.row" @showEditName="showEditNamePop(props.row.id)"
                      :share="true" />
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
          <div v-else class="flex column items-start justify-start q-ma-lg">
            <q-markup-table flat class="">
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
          </div>
        </div>
      </div>
      <div v-else class="q-mx-md rounded-borders border-grey flex items-center column justify-center q-px-lg q-py-lg">
        <div class="flex-center items-center text-center justify-center ">
          <h6 class="text-light text-grey" style="font-size: 20px;">Unable to find anything to show here.</h6>
        </div>
      </div>
    </div>
    <!-- <div v-else-if="showTab === 'device'" class="q-pb-lg">

    </div> -->
  </q-page>
  <ProfileDialog />
  <CreateProjectDialog />
  <EditProjectDialog />
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm">You are currently not connected to any network.</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import ProjectBox from 'src/components/project/ProjectBox'
import ToolBar from 'src/components/project/ToolBar.vue'
import Hero from 'src/components/project/Hero.vue'
import CreateProjectDialog from 'src/components/project/CreateProjectDialog'
import ProjectMoreDialog from 'src/components/project/ProjectMoreDialog'
import EditProjectDialog from 'src/components/project/EditProjectDialog'
import { mapMutations, mapGetters } from 'vuex'
import { colors } from 'quasar'
import ProfileDialog from 'src/components/user/ProfileDialog.vue'

const { luminosity } = colors

export default defineComponent({
  name: 'ProjectsPage',
  components: {
    ProfileDialog,
    ProjectBox,
    ToolBar,
    Hero,
    CreateProjectDialog,
    ProjectMoreDialog,
    EditProjectDialog
  },
  props: {},
  data() {
    return {
      addBtn: require('../assets/img/icon/btn-add-green.svg'),
      showEditName: false,
      errorRequire: false,
      errorMessageRequire: '',
      loading: false,
      loadingBox: false,
      confirm: false,
      dense: false,
      showTab: 'cloud',
      ownerColor: '#bbbbbb',
      colorArr: ['#5F5F5F', '#59C0E6', '#E89227', '#CCCCCC'],
      pagination: {
        sortBy: 'udate',
        descending: true,
        rowsPerPage: 10
      },
      columns: [
        {
          name: 'name',
          required: true,
          label: 'File Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          style: 'width: 40vw',
          sortable: true
        },
        { name: 'udate', format: val => this.relativeDays(val), align: 'left', label: 'Last edited', field: 'udate', sortable: true },
        { name: 'projectUser', align: 'left', label: 'Project Member', field: 'projectUser', sortable: true },
        { name: 'actions', label: '', field: 'actions', sortable: false }
      ],
      columnsShare: [
        {
          name: 'name',
          required: true,
          label: 'File Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          style: 'width: 40vw',
          sortable: true
        },
        { name: 'udate', format: val => this.relativeDays(val), align: 'left', label: 'Last edited', field: 'udate', sortable: true },
        { name: 'projectOwner', align: 'left', label: 'Owner', field: 'projectOwner', sortable: true },
        { name: 'projectUser', align: 'left', label: 'Project Member', field: 'projectUser', sortable: true },
        { name: 'actions', label: '', field: 'actions', sortable: false }
      ],
      rows: []
    }
  },
  computed: {
    ...mapGetters('project', ['getLoading', 'getIsList', 'searchProjectList', 'searchShareProjectList'])
  },
  create() {
  },
  watch: {
    // scroll陰影
    getIsList: {
      handler: function (newValue, oldValue) {
        if (oldValue) {
          this.$nextTick(function () {
            const content = document.querySelector('.content')
            const wrapper = document.querySelector('.wrapper')
            const shadowTop = document.querySelector('.shadow--top')
            const shadowBottom = document.querySelector('.shadow--bottom')
            if (content) {
              if (content.scrollHeight === wrapper.offsetHeight) {
                shadowBottom.style.opacity = 0
                return
              }
              content.addEventListener('scroll', function () {
                const contentScrollHeight = content.scrollHeight - wrapper.offsetHeight
                const currentScroll = this.scrollTop / (contentScrollHeight)
                shadowTop.style.opacity = currentScroll
                shadowBottom.style.opacity = 1 - currentScroll
              })
            }
          })
        }
      }
    },
    searchProjectList: {
      handler: function (newValue, oldValue) {
        if (newValue && !this.getIsList) {
          this.$nextTick(function () {
            const content = document.querySelector('.content')
            const wrapper = document.querySelector('.wrapper')
            const shadowBottom = document.querySelector('.shadow--bottom')
            if (content) {
              if (content.scrollHeight === wrapper.offsetHeight) {
                shadowBottom.style.opacity = 0
              } else {
                shadowBottom.style.opacity = 1
              }
            }
          })
        }
      }
    },
    searchShareProjectList: {
      handler: function (newValue, oldValue) {
        if (newValue && !this.getIsList) {
          this.$nextTick(function () {
            const content = document.querySelector('.content')
            const wrapper = document.querySelector('.wrapper')
            const shadowBottom = document.querySelector('.shadow--bottom')
            if (content) {
              if (content.scrollHeight === wrapper.offsetHeight) {
                shadowBottom.style.opacity = 0
              } else {
                shadowBottom.style.opacity = 1
              }
            }
          })
        }
      }
    }
  },
  mounted() {
    this.loadingProject()
  },
  methods: {
    ...mapMutations('project', ['setLoading']),
    showEditNamePop(props) {
      // console.log('props', props)
      this.$refs['showEditNamePop' + props].show()
    },
    checkVal(val) {
      if (!val) {
        this.errorRequire = true
        return false
      }
      this.errorRequire = false
      return true
    },
    resetVal(val) {
      this.errorRequire = false
    },
    saveName(props, value) {
      const editData = {
        name: value,
        pid: props.pid
      }
      // console.log('props', props)
      // console.log('value', value)
      // console.log('editData', editData)
      if (value) {
        this.$store.dispatch('project/editFile', editData)
      } else {
        this.$store.dispatch('project/getProject')
      }
    },
    loadingProject() {
      this.$store.dispatch('project/getProject')
      this.$store.dispatch('project/getShareProject')
    },
    setSort(type) {
      this.loadingBox = true
      this.$store.commit('project/setSortProjectParams', type)
    },
    avatarName(user) {
      if (user) {
        const f = user.fname.charAt(0).toUpperCase()
        const l = user.lname.charAt(0).toUpperCase()
        return f + l
      } else {
        return 'User'
      }
    },
    getLuminosity(color) {
      return luminosity(color)
    },
    relativeDays(timestamp) {
      const now = Date.now()
      const diff = timestamp - now
      const days = diff / (1000 * 60 * 60 * 24)
      const hours = (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      const minutes = (diff % (1000 * 60 * 60)) / (1000 * 60)
      const seconds = (diff % (1000 * 60)) / 1000
      const relative = new Intl.RelativeTimeFormat('en', {
        numeric: 'auto'
      })

      if (diff > 0) {
        // If the difference is positive, the timestamp is in the future
        if (days >= 1) {
          return `${relative.format(Math.round(days), 'day')}`
        }
        if (hours >= 1) {
          return relative.format(Math.round(hours), 'hour')
        }
        if (minutes >= 1) {
          return relative.format(Math.round(minutes), 'minute')
        }
        if (seconds >= 0) {
          return relative.format(Math.round(seconds), 'second')
        }
      }
      if (diff < 0) {
        // If the difference is negative, the timestamp is in the past
        if (Math.abs(days) >= 1) {
          return relative.format(Math.round(days), 'day')
        }
        if (Math.abs(hours) >= 1) {
          return relative.format(Math.round(hours), 'hour')
        }
        if (Math.abs(minutes) >= 1) {
          return relative.format(Math.round(minutes), 'minute')
        }
        if (Math.abs(seconds) >= 0) {
          return relative.format(Math.round(seconds), 'second')
        }
        return ''
      }
    },
    profile(user) {
      if (user) {
        this.$store.commit('auth/setCurrentProfile', user)
      }
      this.$q
        .dialog({
          component: ProfileDialog
        })
    },
    intoProject(e, project) {
      this.$router.push({ name: 'project', params: { pid: project.pid } })
    },
    createProjectDialog() {
      this.$q
        .dialog({
          component: CreateProjectDialog
        })
    }
  }
})
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
