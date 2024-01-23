
export function setLoading(state, payload) {
  state.loading = payload
}
export function setProduct(state, payload) {
  state.productList = payload
}
export function editProduct(state, payload) {
  state.currentProduct = payload
}
