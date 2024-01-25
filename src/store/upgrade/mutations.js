
export function setLoading(state, payload) {
  state.loading = payload
}
export function setUpgrade(state, payload) {
  state.upgradeList = payload
}
export function editUpgrade(state, payload) {
  state.currentUpgrade = payload
}
