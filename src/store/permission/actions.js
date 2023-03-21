import { postAction } from 'src/api/manage'
import { HandleRouter } from 'src/utils/router'

export async function GetUserMenu() {
    const res = await postAction('user/get-user-menu')
    if (res.code === 1) {
        const data = res.data.records

        // 拿到鉴权路由表（用户自己的所有菜单），整理称路由
        const userMenu = HandleRouter(data)
        // 加入404界面
        userMenu.push({
            path: '/:catchAll(.*)*',
            name: 'notFound',
            component: () => import('pages/ErrorNotFound.vue')
        })
        // 设置所有菜单
        this.InitUserMenu(userMenu)

        // 返回鉴权路由表
        return userMenu
    } else {
        //
    }
}
export function InitUserMenu(routes) {
    const menu = []
    const push = function (routes) {
        routes.forEach(route => {
            if (route.children && route.children.length > 0) {
                push(route.children)
            } else {
                // if (route.meta.hidden === "no") {
                const { meta, name, path } = route
                menu.push({ meta, name, path })
                // }
            }
        })
    }
    push(routes)
    this.userMenu = menu
}
export function ClearMenu() {
    this.userMenu = []
}
