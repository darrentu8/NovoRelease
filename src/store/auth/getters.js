import { Cookies } from 'quasar'

export function getLoginStatus(state, commit) {
  const UID = Cookies.get('uid')
  if (UID) {
    return true
  } else {
    return state.loginStatus
  }
}
export function getWSStatus(state) {
  return state.wsStatus
}
export function getUID(state) {
  return state.uid || Cookies.get('uid')
}
export function getGID(state) {
  return state.gid || Cookies.get('gid')
}
export function getUserEmail(state) {
  return state.email
}
export function getUserData(state) {
  return state.userData
}
