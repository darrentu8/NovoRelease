
export function setLoading(state, payload) {
  state.loading = payload
}
export function setDevice(state, payload) {
  state.deviceList = payload
}
export function editDevice(state, payload) {
  state.currentDevice = payload
}
