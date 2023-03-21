<template>
    <q-btn @click="clickMedia" class="overflow-hidden" style="width:50px" :class="{ 'is-tool-selected': isSelectedMedia }">
        <img :class="{ 'is-active-icon-green': isSelectedMedia }" style="height:26px;width:26px" :src="iconMedia" />
        <q-menu :offset="[0, 10]" class="q-ma-none q-pa-none">
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false">
                <img style="height:24px;width:24px" :src="iconImage" />
                <q-menu :offset="[100, 20]">
                    <q-uploader color="primary" @uploaded="imageUploaded" label="Image File (for <30MB size)"
                        accept="image/*" field-name="media" :url="`webapi/project/${pid}/media`"
                        style="max-width:300px;height:300px" :max-file-size="1024 * 1024 * 30" auto-upload
                        hide-upload-btn />
                </q-menu>
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false">
                <img style="height:24px;width:24px" :src="iconVideo" />
                <q-menu :offset="[100, 20]">
                    <q-uploader color="primary" @uploaded="videoUploaded" label="Video File (<30MB,.mp4,.mov,.m4v,.ogg)"
                        accept=".mp4,.mov,.m4v,.ogg" field-name="media" :url="`webapi/project/${pid}/media`"
                        style="max-width:300px;height:300px" :max-file-size="1024 * 1024 * 30" auto-upload
                        hide-upload-btn />
                </q-menu>
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false">
                <img style="height:24px;width:24px" :src="iconAudio" />
                <q-menu :offset="[100, 20]">
                    <q-uploader color="primary" @uploaded="AudioUploaded" label="Audio File (<30MB,.mp3,.m4a,.m3u,.ogg)"
                        accept=".mp3,.m4a,.m3u,.ogg" field-name="media" :url="`webapi/project/${pid}/media`"
                        style="max-width:300px;height:300px" :max-file-size="1024 * 1024 * 30" auto-upload
                        hide-upload-btn />
                </q-menu>
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false" color="brand-grey"
                icon="file_present">
                <!-- <img style="height:24px;width:24px" :src="iconAudio" /> -->
                <q-menu :offset="[100, 20]">
                    <q-uploader color="primary" @uploaded="FileUploaded" label="Office File (<30MB)"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" field-name="media"
                        :url="`webapi/project/${pid}/media`" style="max-width:300px;height:300px"
                        :max-file-size="1024 * 1024 * 30" auto-upload hide-upload-btn />
                </q-menu>
            </q-btn>
            <q-btn class="overflow-hidden q-ma-xs q-ml-sm q-mr-sm" dense flat :ripple="false">
                <img style="height:24px;width:24px" :src="iconLink" />
                <q-menu :offset="[300, 20]">
                    <q-card style="min-width: 550px">
                        <q-card-section class="row items-center q-pb-none">
                            <div class="text-body1">External URL</div>
                        </q-card-section>
                        <q-card-section class="row items-center q-pa-md q-gutter-sm">
                            <div class="col">
                                <q-input color="primary" v-model="url" dense outlined label="URL" />
                            </div>
                            <div style="width:150px">
                                <q-btn class="full-width" :loading="isValidatingUrl" @click="postUrl" color="primary"
                                    label="Yes">
                                    <template v-slot:loading>
                                        <q-spinner-hourglass class="on-left" />
                                        Validating
                                    </template>
                                </q-btn>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-menu>
            </q-btn>
        </q-menu>
    </q-btn>
</template>

<script>
import { mapMutations } from 'vuex'

import { toolType } from 'src/helper/enum'
import { activeChoose } from 'src/js/toolbar/choose'
import { getFileExt } from 'src/helper/string'
import { addImage, addVideo, addAudio, addUrl, addDoc } from '../../js/toolbar/media'

export default {
    name: 'ToolBar-Media',
    mounted() {

    },
    data() {
        return {
            iconMedia: require('../../assets/icons/icon_media.svg'),
            iconVideo: require('../../assets/icons/icon_video.svg'),
            iconAudio: require('../../assets/icons/icon_audio.svg'),
            iconImage: require('../../assets/icons/icon_image.svg'),
            iconLink: require('../../assets/icons/icon_link.svg'),
            url: '',
            isShowUrlViewer: false,
            isValidatingUrl: false
        }
    },
    computed: {
        selectedTool() {
            return this.$store.state.common.selectedTool
        },
        isSelectedMedia() {
            return this.selectedTool === toolType.MEDIA
        },
        pid() {
            return this.$store.state.common.pid
        }
    },
    watch: {

    },
    methods: {
        ...mapMutations('common', ['SET_SELECTED_TOOL']),
        clickMedia() {
            this.SET_SELECTED_TOOL(toolType.MEDIA)
        },
        imageUploaded(info) {
            const respondData = JSON.parse(info.xhr.response)

            addImage(respondData.uuid, respondData.url)
            activeChoose()
        },
        videoUploaded(info) {
            const respondData = JSON.parse(info.xhr.response)

            const videoData = respondData[0]
            const thumbnailData = respondData[1]

            addVideo(videoData, thumbnailData)
            activeChoose()
        },
        AudioUploaded(info) {
            const respondData = JSON.parse(info.xhr.response)

            const audioData = respondData

            addAudio(audioData)
            activeChoose()
        },
        FileAdded(info) {
            const ext = getFileExt(info[0].name)

            if (ext.includes('ppt')) {
                const fileSrc = 'https://view.xdocin.com/demo/view.pptx'
                addDoc(`https://view.officeapps.live.com/op/view.aspx?src=${fileSrc}`, 'ppt')
            } else if (ext.includes('doc')) {
                const fileSrc = 'https://binaries.templates.cdn.office.net/support/templates/zh-cn/tf89262236_win32.dotx'
                addDoc(`https://view.officeapps.live.com/op/view.aspx?src=${fileSrc}`, 'doc')
            } else if (ext.includes('xls')) {
                const fileSrc = 'https://view.xdocin.com/demo/view.xlsx'
                addDoc(`https://view.officeapps.live.com/op/view.aspx?src=${fileSrc}`, 'xls')
            } else if (ext.includes('pdf')) {
                const fileSrc = 'https://view.xdocin.com/demo/view.pdf'
                addDoc(fileSrc, 'pdf')
            }

            activeChoose()
        },
        FileUploaded(info) {
            const respondData = JSON.parse(info.xhr.response)

            const fileSrc = respondData.url
            const ext = getFileExt(respondData.filename)
            const uuid = respondData.uuid

            if (ext.includes('ppt')) {
                addDoc(`https://view.officeapps.live.com/op/view.aspx?src=${fileSrc}`, uuid, 'ppt')
            } else if (ext.includes('doc')) {
                addDoc(`https://view.officeapps.live.com/op/view.aspx?src=${fileSrc}`, uuid, 'doc')
            } else if (ext.includes('xls')) {
                addDoc(`https://view.officeapps.live.com/op/view.aspx?src=${fileSrc}`, uuid, 'xls')
            } else if (ext.includes('pdf')) {
                addDoc(fileSrc, 'pdf')
            }

            activeChoose()
        },
        postUrl() {
            this.isValidatingUrl = true
            setTimeout(() => {
                this.isValidatingUrl = false
                addUrl(this.url)
                activeChoose()
            }, 2000)
        }
    }
}
</script>
<style lang="scss" scoped>
.tool-bar-media {
    left: 285px;
    bottom: 60px;
    background: white;
}
</style>
