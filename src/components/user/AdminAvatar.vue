<template>
  <div class="adminAvatar-warp">
    <q-btn class="q-px-md un " text-color="black" size="md" flat rounded style="text-decoration:underline;">
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
      {{ avatarName }}
    </q-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCommonStore } from 'src/stores/common'
import { useRouter } from 'vue-router'

const router = useRouter()
const commonStore = useCommonStore()
const avatarName = computed(() => {
  if (commonStore.userData && commonStore.userData.username) {
    // const capitalized = commonStore.userData.username.charAt(0).toUpperCase() + commonStore.userData.username.slice(1)
    const capitalized = commonStore.userData.username.charAt(0) + commonStore.userData.username.slice(1)
    return 'Hi, ' + capitalized
  } else {
    return ''
  }
})
const logOut = () => {
  commonStore.Logout().then(() => {
    router.push({ path: '/' })
    console.log('Logout')
  })
}

</script>

<style lang='sass' scoped>
// .q-header .header-avatar
//   margin-left: 15px
.adminAvatar-warp
  border-left: .75px solid #F1F1F1
  height: 50px
  width: 200px
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
