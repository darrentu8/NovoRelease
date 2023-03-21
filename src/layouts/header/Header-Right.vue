<template>
  <div class="row reverse items-center text-center">
    <div class="row">
      <UserAvatar v-if="!loading" />
      <AdminAvatar v-if="!loading" />
    </div>
  </div>
</template>

<script>
import { colors } from 'quasar'

import UserAvatar from '../../components/user/UserAvatar'
import AdminAvatar from '../../components/user/AdminAvatar'

const { luminosity } = colors

export default {
  name: 'Page-Right',
  components: {
    UserAvatar,
    AdminAvatar
  },
  data() {
    return {
      loading: true,
      color1: '#FCFCFC',
      color2: '#FF00B8',
      color3: '#456211',
      color4: '#3f5199'
    }
  },
  computed: {

  },
  created() {
    this.getAdminData()
  },
  methods: {
    async getAdminData() {
      this.loading = true
      await this.$store.dispatch('user/getProfile')
      this.loading = false
    },
    getLuminosity(color) {
      return luminosity(color)
    }
  }
}
</script>
<style lang="scss">
.menu-item {
  padding: 10px 10px 10px 20px !important;
  text-align: left;

  &:hover {
    color: white;
    background-color: #14A028;
  }
}

.menu-icon {
  margin: auto !important;
}
</style>
