export function someMutation(/* state */) {
}

export function SET_SELECTED_TOOL(state, selectedTool) {
    state.selectedTool = selectedTool
}

export function SET_PAGE(state, page) {
    state.page = page
}

export function SET_SHOW_OPR_BAR(state, isShow) {
    state.showOprBar = isShow
}

export function SET_OPR_BAR_POS(state, pos) {
    state.oprBarPos.x = pos.x
    state.oprBarPos.y = pos.y
}

export function SET_CANVAS_ZOOM(state, zoom) {
    state.canvasZoom = zoom
}

export function SET_COPY_IMAGE(state, image) {
    state.copyImage = image
}
