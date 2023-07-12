// 公共路由，無需權限
export const PublicRoutes = [
  {
    path: '/',
    component: () => import('layouts/initial/InitialLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        meta: {
          title: 'index',
          breadcrumb: [
            {
              text: 'Index',
              disabled: true,
              href: '/index',
              link: true,
              exact: true,
              to: { name: 'index', path: '/index' }
            }
          ]
        },
        component: () => import('src/pages/Index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        meta: {
          title: 'login',
          breadcrumb: [
            {
              text: 'Login',
              disabled: true,
              href: '/login',
              link: true,
              exact: true,
              to: { name: 'login', path: '/login' }
            }
          ]
        },
        component: () => import('src/pages/Login.vue')
      }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'register',
        meta: {
          title: 'register',
          breadcrumb: [
            {
              text: 'Register',
              disabled: true,
              href: '/register',
              link: true,
              exact: true,
              to: { name: 'register', path: '/register' }
            }
          ]
        },
        component: () => import('src/pages/Register.vue')
      }
    ]
  },
  {
    path: '/activation',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'activation',
        meta: {
          title: 'activation',
          breadcrumb: [
            {
              text: 'activation',
              disabled: true,
              href: '/activation',
              link: true,
              exact: true,
              to: { name: 'activation', path: '/activation' }
            }
          ]
        },
        component: () => import('src/pages/Activation.vue')
      }
    ]
  },
  {
    path: '/resetpassword',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'resetpassword',
        meta: {
          title: 'resetpassword',
          breadcrumb: [
            {
              text: 'resetpassword',
              disabled: true,
              href: '/resetpassword',
              link: true,
              exact: true,
              to: { name: 'resetpassword', path: '/resetpassword' }
            }
          ]
        },
        component: () => import('src/pages/ResetPassword.vue')
      }
    ]
  },
  {
    path: '/forget',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'forget',
        meta: {
          title: 'forget',
          breadcrumb: [
            {
              text: 'forget',
              disabled: true,
              href: '/forget',
              link: true,
              exact: true,
              to: { name: 'forget', path: '/forget' }
            }
          ]
        },
        component: () => import('src/pages/Forget.vue')
      }
    ]
  },
  {
    path: '/active',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'active',
        meta: {
          title: 'active',
          breadcrumb: [
            {
              text: 'active',
              disabled: true,
              href: '/active',
              link: true,
              exact: true,
              to: { name: 'active', path: '/active' }
            }
          ]
        },
        component: () => import('src/pages/Active.vue')
      }
    ]
  },
  {
    path: '/terms',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'terms',
        meta: {
          title: 'terms',
          breadcrumb: [
            {
              text: 'terms',
              disabled: true,
              href: '/terms',
              link: true,
              exact: true,
              to: { name: 'terms', path: '/terms' }
            }
          ]
        },
        component: () => import('src/pages/Terms.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/dashboard/DashboardLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          auth: true,
          title: 'dashboard',
          breadcrumb: [
            {
              text: 'dashboard',
              disabled: true,
              href: '/dashboard',
              link: true,
              exact: true,
              to: { name: 'dashboard', path: '/dashboard' }
            }
          ]
        },
        component: () => import('src/pages/DashboardPage.vue')
      }
    ]
  },
  {
    path: '/list',
    redirect: '/list/all',
    component: () => import('layouts/dashboard/DashboardLayout.vue'),
    children: [
      {
        path: 'all',
        name: 'list',
        meta: {
          auth: true,
          title: 'list',
          breadcrumb: [
            {
              text: 'list',
              disabled: true,
              href: '/list',
              link: true,
              exact: true,
              to: { name: 'list', path: '/list' }
            },
            {
              text: 'All',
              disabled: true,
              href: '/list',
              link: true,
              exact: true,
              to: { name: 'list', path: '/list' }
            }
          ]
        },
        component: () => import('src/pages/Projects.vue')
      }
    ]
  },
  // 以下內容在動態路由中添加，解決刷新404的問題:store-permission-actions
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'ErrorNotFound',
        component: () => import('pages/ErrorNotFound.vue')
      }
    ]
  }
]

export const PrivateRoutes = [
  // {
  //   path: '/project',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [
  //     {
  //       path: ':pid',
  //       name: 'project',
  //       meta: {
  //         auth: true,
  //         title: 'project',
  //         keepAlive: false,
  //         breadcrumb: [
  //           {
  //             text: 'project',
  //             disabled: true,
  //             href: '/project/pid',
  //             link: true,
  //             exact: true,
  //             to: { name: 'project_id', path: '/project/pid' }
  //           }
  //         ]
  //       },
  //       component: () => import('pages/WhiteboardIndex.vue')
  //     }
  //   ]
  // }
]

export default [...PublicRoutes, ...PrivateRoutes]
