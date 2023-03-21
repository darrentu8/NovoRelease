<template>
  <div v-if="getLoading" class="col-4 project-wrap q-mb-lg q-mr-md">
    <q-card flat bordered style="height:239px;">
      <q-skeleton height="166px" square animation="fade" />
      <q-item-section class="q-mt-md q-px-md">
        <q-item-label>
          <q-skeleton type="rect" animation="fade" />
        </q-item-label>
      </q-item-section>
      <q-item-section class="q-pt-sm q-ma-none q-px-md" style="margin-left: 0;">
        <q-item-label>
          <q-skeleton type="text" animation="fade" />
        </q-item-label>
      </q-item-section>
    </q-card>
  </div>
  <div v-else :class="['project-wrap', 'q-mr-md', getIsList === true ? 'list' : 'col-4']">
    <q-card flat bordered>
      <!-- 有圖 -->
      <q-card-section v-if="project.thumbnail" class="content flex flex-center non-selectable"
        @click="intoProject(project)">
        <div class="thumbnail-box flex flex-center">
          <q-img spinner-color="green" style="height: 100%; width: 100%; max-width: 100%" alt="thumbnail"
            :src="mapPic(project)" />
        </div>
      </q-card-section>
      <!-- 無圖 -->
      <q-card-section v-else class="content flex flex-center non-selectable" @click="intoProject(project)">
        <div class="thumbnail-box flex flex-center">
        </div>
      </q-card-section>
      <q-card-actions class="items-end">
        <div class="col">
          <div class="text-h6 title">{{ project.name }}
            <q-popup-edit :ref="'showEditNamePop' + project.id" v-model="projectName" v-slot="scope"
              :validate="checkVal" @hide="resetVal">
              <q-input v-model="scope.value" hint="Press enter to save." dense autofocus counter :error="errorRequire"
                @keyup.enter="saveName(project, scope.value)" />
            </q-popup-edit>
          </div>
          <div class="sub-title text-grey-6">Edited {{ relativeDays(project.udate) }}</div>
        </div>
        <div class="col-auto">
          <q-btn color="grey" round flat icon="more_horiz">
            <q-tooltip>
              More
            </q-tooltip>
            <ProjectMoreDialog :project="project" @showEditName="showEditNamePop(project)" />
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </div>
  <EditProjectDialog />
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import EditProjectDialog from 'src/components/project/EditProjectDialog'
import ProjectMoreDialog from 'src/components/project/ProjectMoreDialog'

export default defineComponent({
  name: 'ProjectBox',
  components: {
    ProjectMoreDialog,
    EditProjectDialog
  },
  props: {
    project: {
      id: Number,
      name: String,
      pid: String,
      content: String,
      thumbnail: String,
      udate: String,
      user_id: Number,
      projectData: [
        {
          id: Number,
          filename: String,
          filesize: Number,
          filepath: String,
          mimetype: String,
          project_id: Number
        }
      ],
      projectUser: [
        {
          fname: String,
          lname: String,
          thumbnail: String,
          user_id: Number
        }
      ]
    }
  },
  data() {
    return {
      projectName: this.project.name,
      showEditName: false,
      errorRequire: false,
      errorMessageRequire: ''
    }
  },
  computed: {
    ...mapGetters('project', ['getLoading', 'getIsList'])
  },
  methods: {
    showEditNamePop(props) {
      // console.log('props', props)
      this.nameEdit = props.name
      this.$refs['showEditNamePop' + props.id].show()
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
    mapPic(project) {
      const PD = project.projectData
      const CurrentUUID = project.thumbnail
      if (PD.length && CurrentUUID) {
        for (let i = 0; i < PD.length; i++) {
          if (PD[i].uuid === CurrentUUID) {
            return PD[i].filepath
          }
        }
        return ''
      } else {
        return ''
      }
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
    EditProjectDialog() {
      const roomData = {
        id: this.room.id,
        name: this.room.name,
        pid: this.room.pid,
        projectid: this.room.projectid,
        udate: this.room.udate,
        user_id: this.room.user_id,
        organization_id: this.room.organization_id,
        approve: Boolean(this.room.approve),
        whiteboard_state: this.room.whiteboard_state,
        state: this.room.state
      }
      this.$store.commit('project/editProject', roomData)
      this.$q
        .dialog({
          component: EditProjectDialog
        })
    },
    shareProject() {
      // const pid = this.room.pid
      // if (!pid) {
      //   return
      // }
      // this.$store.dispatch('project/shareProject', pid)
      //   .then(() => {
      //     this.$store.dispatch('project/getProject')
      //   })
    },
    cloneProject() {
      this.$store.dispatch('project/cloneProject', this.room)
        .then(() => {
          this.$store.dispatch('project/getProject')
        })
    },
    delProject() {
      const pid = this.room.pid
      if (!pid) {
        return
      }
      this.$store.dispatch('project/delProject', pid)
        .then(() => {
          this.$store.dispatch('project/getProject')
        })
    },
    intoProject(project) {
      this.$router.push({ name: 'project', params: { pid: project.pid } })
    }
  }
})
</script>
<style lang="sass" scoped>
  .project-wrap
    width: 100%
    margin-bottom: 24px
    max-width: 300px
    height: 239px
    border-radius: 10px
    float: left
    .title
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      display: -webkit-box
      -webkit-line-clamp: 1
      -webkit-box-orient: vertical
      font-size: 1rem
    .sub-title
      font-size: .8rem
    .q-card__section
      aspect-ratio: 16 / 9
      border-bottom: 1px solid #eaeaea
      position: relative
      width: 100%
      cursor: pointer
      background-color: #F2F2F2
      &.q-card__section--vert
        padding: 0
      .thumbnail-box
        width: 100%
        height: 100%
        .q-img
          border-radius: 10px 10px 0 0
    .q-card__section.white
      background-color: #fff
    &:hover
      box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f
      transition: .2s
  .project-wrap.list
    width: 100%
    max-width: none
    margin-bottom: 10px

</style>
