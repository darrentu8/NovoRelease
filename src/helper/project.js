import store from '../store'

export const isEditor = () => {
    return store.state.common.userRole === 'editor'
}

export const isViewer = () => {
    return store.state.common.userRole === 'viewer'
}
