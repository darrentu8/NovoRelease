<template>
  <q-btn class="overflow-hidden" style="width:50px" dense flat color="brand-grey"
    :class="{ 'is-tool-selected': isSelected }">
    <img :class="{ 'is-active-icon-green': isSelected }" style="height:24px;width:24px" :src="iconCrop" />
    <q-menu :offset="[-10, 10]" class="q-ma-none q-pa-none" @before-show="isSelected = true"
      @before-hide="isSelected = false">
      <q-list dense style="min-width:250px" :separator="false">
        <q-item class="menu-item no-border" clickable v-close-popup>
          <q-item-section @click="toDashboard">Back To Dashboard</q-item-section>
        </q-item>
        <q-separator />
        <q-item class="menu-item no-border" clickable>
          <div class="row">
            <div class="col">Export As</div>
            <q-icon class="menu-icon" name="keyboard_arrow_right" size="sm" />
          </div>
          <q-menu anchor="top end" self="top start">
            <q-list dense style="min-width:250px" :separator="false">
              <q-item @click="exportJpg" class="menu-item no-border" dense clickable v-close-popup>
                <q-item-section>JPG</q-item-section>
              </q-item>
              <q-item @click="exportPng" class="menu-item no-border" dense clickable v-close-popup>
                <q-item-section>PNG</q-item-section>
              </q-item>
              <q-item @click="exportSvg" class="menu-item no-border" dense clickable v-close-popup>
                <q-item-section>SVG</q-item-section>
              </q-item>
              <q-item @click="exportPdf" class="menu-item no-border" dense clickable v-close-popup>
                <q-item-section>PDF</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <!-- <q-item class="menu-item no-border" clickable v-close-popup>
          <q-item-section>Print</q-item-section>
        </q-item>
        <q-item class="menu-item no-border" clickable>
          <div class="row">
            <div class="col">Preferences</div>
            <q-icon class="menu-icon" name="keyboard_arrow_right" size="sm" />
          </div>
          <q-menu anchor="top end" self="top start">
            <q-list dense style="min-width:250px" :separator="false">
              <q-item class="menu-item no-border" v-for="n in 3" :key="n" dense clickable>
                <q-item-section>Foo</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
        <q-separator />
        <q-item class="menu-item no-border" clickable v-close-popup>
          <q-item-section>Help</q-item-section>
        </q-item> -->
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { jsPDF as PDF } from 'jspdf'
import { canvas } from '../../js/canvas'
import { saveDataurlToImage, saveSvg, getUrlBase64 } from '../../helper/util'

export default {
  name: 'Leftbar-Extension-Menu',
  mounted() {
    this.$bus.on('toDashboard', this.toDashboard)
  },
  beforeUnmount() {
    this.$bus.off('toDashboard', this.toDashboard)
  },
  data() {
    return {
      iconCrop: require('../../assets/icons/icon_crop.svg'),
      isSelected: false
    }
  },
  computed: {
    pname() {
      return this.$store.state.common.pname
    }
  },
  methods: {
    toDashboard() {
      const uid = this.$store.getters['auth/getUID']
      if (uid) {
        this.$router.push({ path: '/list/all' })
      } else {
        this.$router.push({ path: '/login' })
      }
    },
    exportJpg() {
      const image = canvas.toDataURL({
        format: 'jpeg'
      })
      saveDataurlToImage(image, this.pname, 'jpg')
    },
    exportPng() {
      const image = canvas.toDataURL()
      saveDataurlToImage(image, this.pname)
    },
    exportSvg() {
      const svg = canvas.toSVG()
      console.log(svg)
      saveSvg(svg, this.pname)
    },
    exportPdf() {
      const doc = new PDF()
      const pList = []
      this.$store.state.common.pages.forEach((page, index) => {
        const mappingData = this.$store.state.common.projectData.find(o => o.uuid === page.id)
        if (mappingData) {
          pList.push(getUrlBase64(mappingData.filepath))
        }
      })

      Promise.all(pList).then(datas => {
        datas.forEach((dataurl, index) => {
          const isSecond = index % 2 === 1
          if (isSecond) {
            doc.text(20, 140, this.$store.state.common.pages[index].name || `page-${index + 1}`)
            doc.addImage(dataurl, 'PNG', 0, 160, 210, 100)
          } else {
            doc.text(20, 10, this.$store.state.common.pages[index].name || `page-${index + 1}`)
            doc.addImage(dataurl, 'PNG', 0, 30, 210, 100)
          }
          if (index === this.$store.state.common.pages.length - 1) {
            doc.save(`${this.pname}.pdf`)
          } else if (isSecond) {
            doc.addPage()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-item {
  padding: 10px 10px 10px 20px;
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
