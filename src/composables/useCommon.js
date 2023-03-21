
export default function useCommon() {
  const openLink = (url) => {
    window.open(url)
  }
  // 首頁等允許無token的白名單
  // const AllowList = ['/', '/login', '/forget', '/resetpassword', '/register', '/active', '/active/', '/terms', '/activation', '/files/', '/files/all', '/files/', '/library', '/users', '/whiteboard']
  const AllowList = ['/', '/login', '/forget', '/resetpassword', '/register', '/active', '/active/', '/terms', '/activation']
  return {
    openLink,
    AllowList
  }
}
