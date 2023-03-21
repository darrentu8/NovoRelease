<template>
  <q-dialog>
    <q-card style="min-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-bold">Share</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="">
        <q-form ref="ShareForm" class="row items-center q-gutter-sm">
          <div class="col">
            <q-input autocomplete outlined class="" ref="email" :dense="dense" type="text" v-model="email" label="Email"
              lazy-rules :rules="[checkEmail, checkNotMySelfEmail]">
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>
          </div>
          <div style="width:150px; margin-bottom: 20px;">
            <q-select color="primary" dense outlined v-model="role" :options="['viewer', 'editor']" />
          </div>
          <div style="width:150px; margin-bottom: 20px;">
            <q-btn color="primary" label="Send Link" @click="sendRoleData()" />
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
      <!-- share名單 -->
      <q-card-section v-if="!loading && editShareListData.length" class="q-pb-none q-pr-lg">
        <div v-for="user of editShareListData" :key="user.user_id" class="flex flex-center justify-between q-mb-md">
          <div class="flex flex-center">
            <!-- 有圖 -->
            <q-avatar v-if="user.thumbnail" size="30px" font-size="12px" color="grey-4" text-color="white">
              <q-img spinner-color="green" spinner-size="16px" :src="user.thumbnail" />
            </q-avatar>
            <!-- 沒圖 -->
            <q-avatar v-else size="30px" font-size="12px" color="grey-4" text-color="white">
              {{ avatarName(user) }}
            </q-avatar>
            <div class="q-ml-md">
              {{ user.fname }}.{{ user.lname }}
            </div>
          </div>
          <div class="">
            <q-select :disable="loading" class="brand-select" borderless :dense="dense" :options-dense="dense"
              v-model="user.role" :options="roleType" option-disable="disable" @update:model-value="roleEmit()">
            </q-select>
          </div>
        </div>
      </q-card-section>
      <q-spinner v-if="loading" class="q-ma-lg" color="primary" size="3em" :thickness="2" />
      <q-separator v-if="!loading && editShareListData.length" />
      <q-card-actions align="left">
        <q-btn flat color="black">
          <div class="row items-center">
            <img style="height:25px;width:25px" :src="iconCopyLink" />
            <p style="margin:auto 10px">Copy Link</p>
          </div>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from 'vuex'
import inputRules from 'src/mixins/inputRules.js'
export default {
  mixins: [inputRules],
  name: 'ShareDialog',
  data() {
    return {
      loading: false,
      dense: true,
      editShareListData: [],
      roleType: [
        'viewer',
        'editor'
      ],
      iconCopyLink: require('../../assets/icons/icon_copy_link.svg'),
      email: '',
      role: 'viewer'
    }
  },
  computed: {
    ...mapState('project', ['currentProject', 'shareList'])
  },
  watch: {
    shareList() {
      if (this.shareList.length) {
        this.loading = true
        this.editShareListData = this.shareList.flat().map(p => Object.assign({}, p))
        this.loading = false
      }
    }
  },
  mounted() {
  },
  methods: {
    reset() {
      this.$refs.email.resetValidation()
      this.email = ''
    },
    avatarName(user) {
      if (user) {
        const f = user.fname.charAt(0).toUpperCase()
        const l = user.lname.charAt(0).toUpperCase()
        return f + l
      } else {
        return ''
      }
    },
    sendRoleData() {
      this.$refs.ShareForm.validate().then(success => {
        if (success) {
          if (!this.email || !this.currentProject.pid) {
            return
          }
          const roleData = {
            email: this.email,
            uid: this.$store.getters['auth/getUID'],
            role: this.role
          }
          this.$store.dispatch('project/shareProject', roleData)
            .then(() => {
              this.reset()
            })
        }
      })
    },
    roleEmit() {
      this.loading = true
      const Data = this.editShareListData
      const newShareList = []
      if (Data.length) {
        for (let i = 0; i < Data.length; i++) {
          const obj = {
            user_id: '',
            role: ''
          }
          if (Data[i].user_id && Data[i].role) {
            obj.user_id = Data[i].user_id
            obj.role = Data[i].role
            newShareList.push(obj)
          }
        }
      }
      const roleListData = {
        uid: this.$store.getters['auth/getUID'],
        projectItems: newShareList
      }
      this.$store.dispatch('project/shareProjectList', roleListData)
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
