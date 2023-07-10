import { toolType } from 'src/helper/enum'

export default function () {
  return {
    pid: '',
    pname: '',
    pages: [],
    page: '',
    projectData: [],
    userRole: '',
    userMouseList: [],
    isShowPlayerVideo: false,
    playingVdieoSource: '',
    isShowPlayerAuido: false,
    playingAudioSource: '',
    selectedTool: toolType.CHOOSE,
    selectedObject: null,
    canvasZoom: 100,
    copyImage: null
  }
}
