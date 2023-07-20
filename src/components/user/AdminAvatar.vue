<template>
  <div class="adminAvatar-warp">
    <q-btn class="q-px-xs" flat round>
      <q-avatar class="" size="md" :style="{ 'background-color': colorArr[0] }"
        :text-color="getLuminosity(colorArr[0]) > 0.5 ? 'black' : 'white'">
        <q-menu :offset="[0, 5]" class="q-ma-none q-pa-none">
          <q-list padding dense style="min-width:250px" :separator="false">
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
      colorArr: ['#5f5f5f']
    }
  },
  computed: {
    ...mapGetters('auth', ['getUserData'])
  },
  mounted() {
  },
  methods: {
    avatarName() {
      return 'NU'
    },
    logOut() {
      this.$store.dispatch('auth/Logout')
      console.log('Logout')
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
.menu-icon
    margin: auto !important
</style>
