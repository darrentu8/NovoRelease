
export function setLoading(state, payload) {
  state.loading = payload
}
export function setService(state, payload) {
  state.serviceList = payload
}
export function editService(state, payload) {
  state.currentService = payload
}
