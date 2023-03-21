<template>
  <div class="adminAvatar-warp">
    <q-btn v-if="getUserData.thumbnail" class="q-px-xs" flat round>
      <q-avatar class="" size="md">
        <q-img spinner-color="green" spinner-size="20px" :src="getUserData.thumbnail" />
        <q-menu :offset="[0, 5]" class="q-ma-none q-pa-none">
          <div v-if="this.$route.name !== 'list'" class="text-body2 text-bold q-pa-sm q-pl-md q-pt-md">
            {{ getUserData.fname }} {{ getUserData.lname }} <span>(You)</span>
          </div>
          <q-separator v-if="this.$route.name !== 'list'" />
          <q-list padding dense style="min-width:250px" :separator="false">
            <q-item class="menu-item no-border" clickable v-close-popup @click="profile()">
              <div class="row">
                <q-icon class="menu-icon" color="primary" name="person" size="sm" />
                <div class="col text-left q-pl-md">Profile setting</div>
              </div>
            </q-item>
            <!-- <q-item class="menu-item no-border" clickable v-close-popup @click="changePassword()">
              <div class="row">
                <q-icon class="menu-icon" color="primary" name="key" size="sm" />
                <div class="col text-left q-pl-md">Change Password</div>
              </div>
            </q-item> -->
            <q-item class="menu-item no-border" clickable v-close-popup @click="showAbout()">
              <div class="row">
                <q-icon class="menu-icon" color="primary" name="info" size="sm" />
                <div class="col text-left q-pl-md">About</div>
              </div>
            </q-item>
            <q-item class="menu-item no-border" clickable v-close-popup @click="logOut">
              <div class="row">
                <q-icon class="menu-icon" color="primary" name="logout" size="sm" />
                <div class="col text-left q-pl-md">Sign Out</div>
              </div>
            </q-item>
          </q-list>
        </q-menu>
      </q-avatar>
    </q-btn>
    <q-btn v-else class="q-px-xs" flat round>
      <q-avatar class="" size="md" :style="{ 'background-color': colorArr[0] }"
        :text-color="getLuminosity(colorArr[0]) > 0.5 ? 'black' : 'white'">
        <q-menu :offset="[0, 5]" class="q-ma-none q-pa-none">
          <div v-if="this.$route.name !== 'list'" class="text-body2 text-bold q-pa-sm q-pl-md q-pt-md">
            {{ getUserData.fname }} {{ getUserData.lname }} <span>(You)</span>
          </div>
          <q-separator v-if="this.$route.name !== 'list'" />
          <q-list padding dense style="min-width:250px" :separator="false">
            <q-item class="menu-item no-border" clickable v-close-popup @click="profile()">
              <div class="row">
                <q-icon class="menu-icon" color="primary" name="person" size="sm" />
                <div class="col text-left q-pl-md">Profile setting</div>
              </div>
            </q-item>
            <!-- <q-item class="menu-item no-border" clickable v-close-popup @click="changePassword()">
              <div class="row">
                <q-icon class="menu-icon" color="primary" name="key" size="sm" />
                <div class="col text-left q-pl-md">Change Password</div>
              </div>
            </q-item> -->
            <q-item class="menu-item no-border" clickable v-close-popup @click="showAbout()">
              <div class="row">
                <q-icon class="menu-icon" color="primary" name="info" size="sm" />
                <div class="col text-left q-pl-md">About</div>
              </div>
            </q-item>
            <q-item class="menu-item no-border" clickable v-close-popup @click="logOut">
              <div class="row">
                <q-icon class="menu-icon" color="primary" name="logout" size="sm" />
                <div class="col text-left q-pl-md">Sign Out</div>
              </div>
            </q-item>
          </q-list>
        </q-menu>
        {{ avatarName() }}
      </q-avatar>
    </q-btn>
  </div>
  <ProfileDialog />
  <ChangePasswordDialog />
  <AboutDialog />
</template>

<script>
import { defineComponent } from 'vue'
import { colors } from 'quasar'
import ProfileDialog from 'src/components/user/ProfileDialog.vue'
import ChangePasswordDialog from 'src/components/user/ChangePasswordDialog.vue'
import AboutDialog from 'src/components/user/AboutDialog.vue'
import { mapGetters } from 'vuex'

const { luminosity } = colors

export default defineComponent({
  name: 'AdminAvatarDialog',
  components: {
    ProfileDialog,
    ChangePasswordDialog,
    AboutDialog
  },
  data() {
    return {
      loading: true,
      selfProfile: {},
      colorArr: ['#FCFCFC']
    }
  },
  computed: {
    ...mapGetters('auth', ['getUserData'])
  },
  mounted() {
  },
  methods: {
    avatarName() {
      const data = this.getUserData
      if (data) {
        const f = data.fname.charAt(0).toUpperCase()
        const l = data.lname.charAt(0).toUpperCase()
        return f + l
      } else {
        return 'User'
      }
    },
    logOut() {
      this.$store.dispatch('auth/Logout')
      console.log('Logout')
    },
    profile() {
      const data = this.getUserData
      if (data) {
        this.$store.commit('auth/setCurrentProfile', data)
        this.$q
          .dialog({
            component: ProfileDialog
          })
      }
    },
    changePassword() {
      this.$q
        .dialog({
          component: ChangePasswordDialog
        })
    },
    showAbout() {
      this.$q
        .dialog({
          component: AboutDialog
        })
    },
    getLuminosity(color) {
      return luminosity(color)
    }
  }
})
</script>
<style lang='sass' scoped>
// .q-header .header-avatar
//   margin-left: 15px
.adminAvatar-warp
  border-left: .75px solid #F1F1F1
  margin-left: 16px
  height: 50px
  width: 70px
  align-items: center
  justify-content: center
  display: flex
  flex: auto

.menu-item
    padding: 10px 10px 10px 20px !important
    text-align: left
    &:hover
        color: white
        background-color: #14A028
.menu-icon
    margin: auto !important
</style>
