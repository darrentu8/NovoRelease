
export function setLoading(state, payload) {
  state.loading = payload
}
export function setProject(state, payload) {
  state.projects = payload
}
export function setShareProject(state, payload) {
  state.shareProjects = payload
}
export function setCurrentProject(state, payload) {
  state.currentProject = payload
}
export function editProject(state, payload) {
  state.editProjectData = payload
}
export function setProjectIsList(state, payload) {
  state.projectIsList = payload
}
export function setSearchProjectParams(state, payload) {
  state.searchProject = payload
}
export function setSortProjectParams(state, payload) {
  if (payload === 'Alphabetical') {
    const Data = state.projects.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })
    state.projects = Data
  } else {
    const Data = state.projects.sort(function (a, b) {
      return b.udate - a.udate
    })
    state.projects = Data
  }
}
export function setSortShareProjectParams(state, payload) {
  if (payload === 'Alphabetical') {
    const Data = state.shareProjects.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })
    state.shareProjects = Data
  } else {
    const Data = state.shareProjects.sort(function (a, b) {
      return b.udate - a.udate
    })
    state.shareProjects = Data
  }
}
export function setShareList(state, payload) {
  state.shareList = payload
}
