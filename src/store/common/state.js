import { toolType } from 'src/helper/enum'

export default function () {
  return {
    pid: '',
    pname: '',
    pages: [],
    page: '',
    projectData: [],
    userRole: '',
    isShowPlayerAuido: false,
    playingAudioSource: '',
    selectedTool: toolType.CHOOSE,
    selectedObject: null,
    canvasZoom: 100,
    copyImage: null,
    draggableRectObjects: [],
    isShowUrlViewer: false,
    urlVierweSrc: ''
  }
}
