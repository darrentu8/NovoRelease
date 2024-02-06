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
</template>

<script setup>
import { ref } from 'vue'
import { colors } from 'quasar'
import { useCommonStore } from 'src/stores/common'
import { useRouter } from 'vue-router'

const router = useRouter()
const commonStore = useCommonStore()
const { luminosity } = colors
const colorArr = ref(['#5f5f5f'])

const avatarName = () => {
  return 'NU'
}
const logOut = () => {
  commonStore.Logout().then(() => {
    router.push({ path: '/' })
    console.log('Logout')
  })
}
const getLuminosity = (color) => {
  return luminosity(color)
}

</script>

<style lang='sass' scoped>
// .q-header .header-avatar
//   margin-left: 15px
.adminAvatar-warp
  border-left: .75px solid #F1F1F1
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
