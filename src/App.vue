<template>
  <router-view />
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { Cookies } from 'quasar'
import { api } from 'boot/axios'
import { useCommonStore } from './stores/common'

const commonStore = useCommonStore()

onBeforeMount(async () => {
  if (commonStore.getToken && !commonStore.userData.role) {
    try {
      api.get('webapi/user', {
        headers: {
          Authorization: commonStore.token || Cookies.get('NM_token')
        }
      })
        .then((response) => {
          commonStore.loginStatus = true
          commonStore.userData = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }
})
</script>
