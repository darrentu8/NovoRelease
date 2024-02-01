<template>
  <q-layout class="dashboard" view="lhh LpR lff">
    <q-header class="bg-theme-grey">
      <q-toolbar class="bg-theme-grey" style="height:56px;">
        <div class="logoBox">
          <router-link to="/" class="desktop-only">
            <span class="text-dark text-h5">Novo Management</span>
          </router-link>
        </div>
        <q-toolbar-title></q-toolbar-title>
        <div>
          <AdminAvatarComponent />
        </div>
      </q-toolbar>
    </q-header>
    <FooterComponent />
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import FooterComponent from 'src/components/FooterComponent.vue'
import AdminAvatarComponent from 'src/components/user/AdminAvatar.vue'

</script>

<style lang="sass">
.desktop
  overflow-y: auto
.dashboard
  .q-page-container
    background-color: #F2F2F2
  .q-page
    max-width: 1520px
    margin: 0 auto
  .top-toolbar
    .search-box
      display: inline-flex
    .q-btn .q-btn__content span
      font-size: 14px
    .q-field--outlined .q-field__control:before
      border: 1px solid #e5e5e5
    .q-field--dense .q-field__control,.q-field__control-container
      height: 32px !important
      .q-field__marginal
        height: 32px !important
</style>
