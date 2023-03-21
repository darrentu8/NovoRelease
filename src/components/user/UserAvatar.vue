<template>
  <span class="flex flex-center" v-for="(user, i) of userList" :key="i">
    <q-btn v-if="user.thumbnail" class="q-px-xs" flat round>
      <q-avatar class="" size="md">
        <q-img spinner-color="green" spinner-size="20px" :src="user.thumbnail" />
        <q-menu :offset="[0, 5]" class="q-ma-none q-pa-none">
          <div v-if="user.fname && user.lname" class="text-body2 text-bold q-pa-sm q-pl-md q-pt-md">
            {{ user.fname }} {{ user.lname }}
          </div>
          <q-separator />
          <q-list padding dense style="min-width:250px" :separator="false">
            <q-item class="menu-item no-border" clickable v-close-popup @click="profile(user)">
              <div class="row">
                <q-icon class="menu-icon" name="person" size="sm" />
                <div class="col text-left q-pl-md">Profile</div>
              </div>
            </q-item>
          </q-list>
        </q-menu>
      </q-avatar>
    </q-btn>
    <q-btn v-else class="q-px-xs" flat round>
      <q-avatar class="" size="md" :style="{ 'background-color': colorArr[i] }"
        :text-color="getLuminosity(colorArr[i]) > 0.5 ? 'black' : 'white'">
        <q-menu :offset="[0, 5]" class="q-ma-none q-pa-none">
          <div v-if="user.fname && user.lname" class="text-body2 text-bold q-pa-sm q-pl-md q-pt-md">
            {{ user.fname }} {{ user.lname }}
          </div>
          <q-separator />
          <q-list padding dense style="min-width:250px" :separator="false">
            <q-item class="menu-item no-border" clickable v-close-popup @click="profile(user)">
              <div class="row">
                <q-icon class="menu-icon" name="person" size="sm" />
                <div class="col text-left q-pl-md">Profile</div>
              </div>
            </q-item>
          </q-list>
        </q-menu>
        {{ avatarName(user) }}
      </q-avatar>
    </q-btn>
  </span>
  <ProfileDialog />
</template>

<script>
import { defineComponent } from 'vue'
import { colors } from 'quasar'
import ProfileDialog from 'src/components/user/ProfileDialog.vue'

const { luminosity } = colors

export default defineComponent({
  name: 'UserAvatarDialog',
  components: {
    ProfileDialog
  },
  data() {
    return {
      loading: true,
      pid: '',
      colorArr: ['#5F5F5F', '#59C0E6', '#E89227', '#efd640', '#a840ef']
    }
  },
  computed: {
    userList() {
      const UID = this.$store.getters['auth/getUID']
      let Arr = []
      if (this.$store.state.user.userList.length) {
        Arr = this.$store.state.user.userList.filter(function (user) {
          return user.uid !== UID
        })
      }
      return Arr
    }
  },
  created() {
    this.checkPid()
  },
  mounted() {
  },
  methods: {
    checkPid() {
      const URL = location.href
      if (URL.indexOf('/') !== -1) {
        this.pid = URL.split('/')[4]
      }
      const PID = this.pid
      if (PID) {
        this.getUserList(PID)
      } else {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Project ID Error'
        })
      }
    },
    getUserList(PID) {
      this.$store.dispatch('user/getUserList', PID)
        .then((res) => {
          // console.log('res', res)
          this.loading = false
        }
        )
        .catch((error) => {
          // console.log(error.response.data)
          this.$q.notify({
            color: 'orange',
            textColor: 'white',
            icon: 'notifications',
            caption: error.response.data.code,
            message: error.response.data.description
          })
        })
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
    logOut() {
      this.$store.dispatch('auth/Logout')
      console.log('Logout')
    },
    profile(user) {
      // console.log('user', user)
      if (user) {
        this.$store.commit('auth/setCurrentProfile', user)
      }
      this.$q
        .dialog({
          component: ProfileDialog
        })
    },
    getLuminosity(color) {
      return luminosity(color)
    }
  }
})
</script>
<style lang='sass' scoped>
.menu-item
    padding: 10px 10px 10px 20px !important
    text-align: left
    &:hover
        color: white
        background-color: #14A028
.menu-icon
    margin: auto !important
</style>
