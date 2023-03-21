export function getLoading(state) {
  return state.loading
}
export function getIsList(state) {
  return state.projectIsList
}
export function searchProjectList(state) {
  return state.projects.filter(item => {
    return item.name.toLowerCase().includes(state.searchProject.toLowerCase())
  })
}
export function searchShareProjectList(state) {
  return state.shareProjects.filter(item => {
    return item.name.toLowerCase().includes(state.searchProject.toLowerCase())
  })
}
