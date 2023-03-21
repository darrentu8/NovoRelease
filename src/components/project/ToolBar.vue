<template>
  <div class="q-gutter-md q-my-md q-ml-lg items-center flex top-toolbar">
    <q-select v-if="!getIsList" class="brand-select" borderless :dense="dense" :options-dense="dense" v-model="sortBox"
      :options="sortType" option-label="label" option-value="value" option-disable="disable"
      @update:model-value="sortEmit()">
      <template v-slot:before>
        <span class="q-ml-sm" style="font-size: 14px;">Sort:</span>
      </template>
    </q-select>
    <q-input class="search-box" dense unelevated outlined bg-color="white" color="black" v-model="searchProject"
      placeholder="Search Projects...">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon v-if="searchProject !== ''" name="close" @click="searchProject = '', refreshProject()"
          class="cursor-pointer" />
      </template>
    </q-input>
    <q-btn unelevated outline color="grey-8" class="brand" dense icon="refresh" @click="refreshProject()">
      <q-tooltip>
        Refresh
      </q-tooltip>
    </q-btn>
    <q-btn unelevated outline color="grey-8" class="brand" dense icon="reorder" @click="setList">
      <q-tooltip>
        List
      </q-tooltip>
    </q-btn>
    <q-btn unelevated outline color="grey-8" class="brand" dense icon="grid_view" @click="setGird">
      <q-tooltip>
        Grid
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default defineComponent({
  name: 'ToolBar',
  components: {
  },
  props: {
  },
  data() {
    return {
      dense: true,
      sortBox: 'Last edited',
      sortType: [
        { label: 'Sort by', disable: true, value: 0 },
        { label: 'Last edited', disable: false, value: 1 },
        { label: 'Alphabetical', disable: false, value: 2 }
      ]
    }
  },
  computed: {
    ...mapGetters('project', ['getIsList']),
    searchProject: {
      get() {
        return this.$store.state.project.searchProject
      },
      set(val) {
        this.setSearchProjectParams(val)
      }
    }
  },
  watch: {
  },
  methods: {
    ...mapMutations('project', ['setSearchProjectParams']),
    sortEmit() {
      this.$emit('setSort', this.sortBox.label)
    },
    setList() {
      this.$store.commit('project/setProjectIsList', true)
    },
    setGird() {
      this.$store.commit('project/setProjectIsList', false)
    },
    refreshProject() {
      this.$store.dispatch('project/getProject')
      this.$store.dispatch('project/getShareProject')
    }
  }
})
</script>
<style lang="sass">
.q-field.brand-select
  .q-field__native, .q-field__marginal, .q-field__control
    height: 32px !important
    min-height: 32px !important
</style>
