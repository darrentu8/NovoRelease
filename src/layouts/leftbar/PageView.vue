<template>
    <q-btn style="width:50px" class="full-height" dense icon="keyboard_arrow_left" color="brand-grey" flat
        @click="clickPre" :disable="isFirstPage" />
    <div class="row full-height justify-center items-center text-center" style="min-width:80px" v-if="pages && page">
        <div class="row cursor-pointer">
            <q-badge class="items-center justify-center" color="grey-3"
                style="width: 60px;height: 30px;margin: auto;font-size: 14px;" text-color="brand-grey">{{
                        currentPageIndex + 1
                }} / {{ pages.length }}</q-badge>
            <q-menu @show="scrollToSelected" :offset="[80, 20]" @hide="showDetails = {}">
                <div>
                    <q-scroll-area ref="scroll" style="height:540px; width:300px;" :thumb-style="thumbStyle">
                        <q-card class="my-card q-ma-md cursor-pointer"
                            :class="{ 'is-current-page': index === currentPageIndex }" v-for="(page, index) of pages"
                            :key="page.id" @click="clickPage(page.id)">
                            <q-img style="height:160px;" :src="getPageThumbnailSrc(page.id)" fit="contain"
                                :img-style="{ 'background-size': 'contain' }">
                                <div class="absolute-top  bg-transparent row items-center text-center"
                                    style="padding:8px">
                                    <q-badge color="brand-green">
                                        {{ page.name || `Page-${index + 1}` }}
                                    </q-badge>
                                    <q-btn v-show="(index === currentPageIndex || !!showDetails[page.id])" color="red"
                                        round dense size="xs" icon="close" @click.stop="clickClose(index)"
                                        style="margin-left: auto;" />
                                    <q-btn v-show="(index !== currentPageIndex && !showDetails[page.id])" round dense
                                        size="xs" icon="more_horiz" @click.stop="showMoreBtn(page.id)" color="white"
                                        text-color="brand-grey" style="margin-left: auto;" />
                                </div>
                                <div class="absolute-bottom bg-transparent row items-center text-center justify-center reverse"
                                    style="padding:8px">
                                    <q-btn v-show="(index === currentPageIndex || !!showDetails[page.id])"
                                        @click.stop="copyPage(index)" class="q-ml-xs q-mr-xs" color="white"
                                        text-color="brand-grey" round size="12px" icon="filter_none" />
                                    <q-btn v-show="(index === currentPageIndex || !!showDetails[page.id])"
                                        @click.stop="insertNewPage(index)" class="q-ml-xs q-mr-xs" color="white"
                                        text-color="brand-grey" round size="12px">
                                        <img style="height:20px" :src="iconAddPage" />
                                    </q-btn>
                                    <q-btn v-show="(index === currentPageIndex || !!showDetails[page.id])"
                                        @click.stop="clickEdit(index)" class="q-ml-xs q-mr-xs" color="white"
                                        text-color="brand-grey" round size="12px" icon="edit" />
                                </div>
                            </q-img>
                        </q-card>
                    </q-scroll-area>
                </div>
            </q-menu>
        </div>

    </div>
    <q-btn style="width:50px" class="full-height" dense icon="keyboard_arrow_right" color="brand-grey" flat
        @click="clickNext" :disable="isLastPage" />
    <q-btn style="width:50px" class="full-height" dense flat color="brand-grey" @click.stop="addNewPage">
        <img style="height:24px;width:24px" :src="iconAddPage" />
    </q-btn>

    <q-dialog v-model="showdialogEditPage" persistent>
        <q-card style="min-width: 350px">
            <q-card-section>
                <div class="text-h6"></div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input color="primary" dense v-model="editPageName" autofocus @keyup.enter="confirmeditPageName">
                    <template v-slot:prepend>
                        <q-icon name="edit" />
                    </template>
                </q-input>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat color="brand-grey" label="Cancel" v-close-popup />
                <q-btn flat color="primary" label="Save" @click="confirmeditPageName" />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <q-dialog v-model="showdialogConfirmDelete" persistent>
        <q-card style="min-width: 350px">
            <q-card-section class="row items-center">
                <div class="text-h6">Are you sure?</div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat color="brand-grey" label="Cancel" v-close-popup />
                <q-btn flat color="primary" label="Yes" @click="deletePage(deletePageIndex)" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { uid } from 'quasar'
import { loadCanvas, removeCanvas, setContent, setPageList } from 'src/js/canvas'
import { mapMutations } from 'vuex'

export default {
    name: 'Leftbar-PageView',
    mounted() {
        this.$bus.on('addNewPage', this.addNewPage)
    },
    beforeUnmount() {
        this.$bus.off('addNewPage', this.addNewPage)
    },
    data() {
        return {
            thumbStyle: {
                right: '2px',
                borderRadius: '5px',
                backgroundColor: '#14A028',
                width: '5px',
                opacity: '0.75'
            },
            iconAddPage: require('../../assets/icons/icon_add_page.svg'),
            isSelected: false,
            showdialogEditPage: false,
            editPageName: '',
            editPageIndex: '',
            showdialogConfirmDelete: false,
            deletePageIndex: null,
            showDetails: {}
        }
    },
    computed: {
        page: {
            get() {
                return this.$store.state.common.page
            },
            set(val) {
                this.SET_PAGE_ID(val)
            }
        },
        pages() {
            return this.$store.state.common.pages
        },
        currentPageIndex() {
            return this.$store.state.common.pages.findIndex(o => o.id === this.page)
        },
        isFirstPage() {
            return this.currentPageIndex === 0
        },
        isLastPage() {
            return this.currentPageIndex === this.pages.length - 1
        }
    },
    watch: {
        page(val) {
            this.showDetails = {}
        }
    },
    methods: {
        ...mapMutations('common', ['SET_PAGE_ID', 'SET_PID', 'ADD_PAGE', 'REMOVE_PAGE', 'SET_PAGE', 'SET_PAGES', 'INSERT_PAGE']),
        getPageThumbnailSrc(id) {
            const mappingData = this.$store.state.common.projectData.find(o => o.uuid === id)
            if (mappingData) {
                return mappingData.filepath
            }
            return ''
            //  else {
            //     const pid = this.$store.state.common.pid
            //     return process.env.API_URL + `/webapi/project/${pid}/thumbnail/${id}.jpg`
            // }
        },
        showMoreBtn(id) {
            this.showDetails[id] = this.showDetails[id] ? true : !this.showDetails[id]
        },
        scrollToSelected() {
            const domSelected = document.querySelector('.is-current-page')
            if (!domSelected) {
                return
            }
            const offsetTop = domSelected.offsetTop - 190
            this.$refs.scroll?.setScrollPosition('vertical', offsetTop)
        },
        clickPre() {
            this.page = this.pages[this.currentPageIndex - 1].id
            loadCanvas(this.page)
        },
        clickNext() {
            this.page = this.pages[this.currentPageIndex + 1].id
            loadCanvas(this.page)
        },
        clickPage(val) {
            this.page = val
            loadCanvas(this.page)
        },
        clickEdit(index) {
            this.showdialogEditPage = true
            this.editPageIndex = index
            this.editPageName = this.pages[index].name
        },
        confirmeditPageName() {
            const page = {
                id: this.pages[this.editPageIndex].id,
                name: this.editPageName
            }

            this.SET_PAGE(page)
            setPageList()
            this.showdialogEditPage = false
        },
        insertNewPage(index) {
            const id = uid()
            const page = {
                id,
                name: ''
            }
            index += 1
            this.INSERT_PAGE({ page, index })
            setPageList()
            this.page = id
            loadCanvas(this.page)
        },
        addNewPage() {
            const id = uid()
            const page = {
                id,
                name: ''
            }
            this.ADD_PAGE(page)
            setPageList()
            this.page = id
            loadCanvas(this.page)

            this.$nextTick(() => {
                this.scrollToSelected()
            })
        },
        clickClose(index) {
            this.deletePageIndex = index
            this.showdialogConfirmDelete = true
        },
        deletePage(index) {
            const page = this.pages[index]
            this.REMOVE_PAGE(page.id)
            removeCanvas(page.id)
            if (this.pages.length > 0) {
                this.page = index > 0 ? this.pages[index - 1].id : this.pages[0].id
            } else {
                this.addNewPage()
            }
            setPageList()
            loadCanvas(this.page)
            this.showdialogConfirmDelete = false
        },
        copyPage(index) {
            const selectedPage = this.pages[index]
            loadCanvas(selectedPage.id)

            const id = uid()
            const page = {
                id,
                name: ''
            }
            index += 1
            this.INSERT_PAGE({ page, index })
            this.page = id

            setPageList()
            setContent()
        }
    }
}
</script>
<style lang="scss" scoped>
.is-current-page {
    outline: 3px solid #14A028;
}
</style>
