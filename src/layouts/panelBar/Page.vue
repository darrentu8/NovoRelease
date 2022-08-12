<template>
    <q-tabs v-model="page" inline-label outside-arrows mobile-arrows no-caps class="w-page text-primary bg-indigo-1"
        active-color="primary" stretch active-bg-color="white" indicator-color="white" @update:model-value="changePage">
        <template v-for="page in pages" :key="page.id">
            <q-tab :name="page.id" :ripple="false" style="border-right: 1px #cdcdcd solid">
                <div class="row no-wrap">
                    <div class="text-subtitle2 ellipsis" style="width:150px;margin:auto">{{ page.name }}
                    </div>
                    <q-icon style="margin:auto" size="sm" name="close" @click.stop="clickClose(page.id)" />
                </div>
            </q-tab>
        </template>
        <q-btn :ripple="false" stretch flat round icon="add" class="bg-indigo-2" @click="clickAdd" />
    </q-tabs>
</template>

<script>
import { mapMutations } from 'vuex'
import { uid } from 'quasar'

import { loadCanvas, removeCanvas } from '../../js/canvas'

export default {
    name: 'PanelBar-Page',
    mounted() {
        this.addNewPage()

        // test webapi
        this.$api.get('/server/keepalive').then((response) => {
            console.log(response)
        }).catch(() => {
            console.log('error')
        })

        this.$api.post('/test/whiteboard', {
            boardname: '1',
            content: '2'
        }).then((response) => {
            this.$api.get('/test/whiteboard', {
                params: {
                    boardname: '1'
                }
            }).then((response) => {
                console.log(response)
            }).catch(() => {
                console.log('error')
            })
        }).catch(() => {
            console.log('error')
        })
    },
    data() {
        return {
            pages: []
        }
    },
    computed: {
        page: {
            get() {
                return this.$store.state.common.page
            },
            set(val) {
                this.SET_PAGE(val)
            }
        }
    },
    methods: {
        ...mapMutations('common', ['SET_PAGE']),
        addNewPage() {
            const id = uid()
            const page = {
                id,
                name: `Page-${id.substring(0, 4)}`
            }
            this.pages.push(page)

            this.page = this.pages[this.pages.length - 1].id
        },
        changePage(id) {
            loadCanvas(id)
        },
        clickAdd() {
            this.addNewPage()

            loadCanvas(this.page)
        },
        clickClose(id) {
            const pageIndex = this.pages.findIndex(o => o.id === id)
            if (pageIndex >= 0) {
                this.pages.splice(pageIndex, 1)
                this.page = this.pages[this.pages.length - 1].id
            }

            removeCanvas(id)

            if (this.pages.length === 0) {
                this.addNewPage()
            }

            loadCanvas(this.page)
        }

    }
}
</script>
<style lang="scss" scoped>
.w-page {
    max-width: 1500px
}
</style>
