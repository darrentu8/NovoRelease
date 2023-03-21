import { canvasPropertiesToInclude } from 'src/helper/enum'

export function someMutation(/* state */) {
}

export function SET_PID(state, pid) {
    state.pid = pid
}

export function SET_PNAME(state, pname) {
    state.pname = pname
}

export function INSERT_PAGE(state, { page, index }) {
    state.pages.splice(index, 0, page)
}

export function ADD_PAGE(state, page) {
    state.pages.push(page)
}

export function REMOVE_PAGE(state, id) {
    const index = state.pages.findIndex(o => o.id === id)
    if (index >= 0) {
        state.pages.splice(index, 1)
    }
}

export function SET_PAGE(state, page) {
    const index = state.pages.findIndex(o => o.id === page.id)
    if (index >= 0) {
        state.pages[index] = page
    }
}

export function SET_PAGES(state, pages) {
    state.pages = pages
}

export function SET_PROJECT_DATA(state, projectData) {
    state.projectData = projectData
}

export function SET_USER_ROLE(state, userRole) {
    state.userRole = userRole
}

export function SET_IS_SHOW_PLAYER_AUDIO(state, isShowPlayerAudio) {
    state.isShowPlayerAudio = isShowPlayerAudio
}

export function SET_PLAYING_AUDIO_SOURCE(state, playingAudioSource) {
    state.playingAudioSource = playingAudioSource
}

export function SET_SELECTED_TOOL(state, selectedTool) {
    state.selectedTool = selectedTool
}

export function SET_SELECTED_OBJECT(state, selectedObject) {
    state.selectedObject = selectedObject.toJSON(canvasPropertiesToInclude)
}

export function SET_PAGE_ID(state, page) {
    state.page = page
}

export function SET_CANVAS_ZOOM(state, zoom) {
    state.canvasZoom = zoom
}

export function SET_COPY_IMAGE(state, image) {
    state.copyImage = image
}

export function ADD_DRAGGABLE_RECT_OBJECT(state, draggableRectObject) {
    state.draggableRectObjects.push(draggableRectObject)
}

export function SET_DRAGGABLE_RECT_OBJECT(state, draggableRectObject) {
    const index = state.draggableRectObjects.findIndex(o => o.id === draggableRectObject.id)
    state.draggableRectObjects[index] = draggableRectObject
}

export function CLEAR_DRAGGABLE_OBJECT(state) {
    state.draggableRectObjects = []
}

export function REMOVE_DRAGGABLE_OBJECT(state, id) {
    const index = state.draggableRectObjects.findIndex(o => o.id === id)
    if (index >= 0) {
        state.draggableRectObjects.splice(index, 1)
    }
}

export function SET_IS_SHOW_URL_VIEWER(state, isShowUrlViewer) {
    state.isShowUrlViewer = isShowUrlViewer
}

export function SET_URL_VIEWER_SRC(state, urlVierweSrc) {
    state.urlVierweSrc = urlVierweSrc
}
