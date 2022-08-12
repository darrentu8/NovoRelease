import { toolType } from 'src/helper/enum'

export default function () {
  return {
    selectedTool: toolType.PEN,
    page: '',
    showOprBar: false,
    oprBarPos: { x: 0, y: 0 },
    canvasZoom: 100,
    copyImage: null
  }
}
