import { Cookies } from 'quasar'

export function getLoginStatus(state, commit) {
  const BID = Cookies.get('bid')
  if (BID) {
    return true
  } else {
    return state.loginStatus
  }
}
export function getBID(state) {
  return state.bid || Cookies.get('bid')
}
export function getUserData(state) {
  return state.userData
}
