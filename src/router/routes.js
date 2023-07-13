// 公共路由，無需權限
export const PublicRoutes = [
  {
    path: '/',
    redirect: '/login',
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
  // {
  //   path: '/register',
  //   component: () => import('layouts/login/LoginLayout.vue'),
  //   children: [
  //     {
  //       path: '',
  //       name: 'register',
  //       meta: {
  //         title: 'register',
  //         breadcrumb: [
  //           {
  //             text: 'Register',
  //             disabled: true,
  //             href: '/register',
  //             link: true,
  //             exact: true,
  //             to: { name: 'register', path: '/register' }
  //           }
  //         ]
  //       },
  //       component: () => import('src/pages/Register.vue')
  //     }
  //   ]
  // },
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
        path: 'service',
        name: 'service',
        meta: {
          auth: true,
          title: 'Service',
          breadcrumb: [
            {
              text: 'Service',
              disabled: true,
              href: '/service',
              link: true,
              exact: true,
              to: { name: 'service', path: '/service' }
            }
          ]
        },
        component: () => import('src/pages/ServicePage.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/dashboard/DashboardLayout.vue'),
    children: [
      {
        path: 'announcement',
        name: 'announcement',
        meta: {
          auth: true,
          title: 'System Announcement',
          breadcrumb: [
            {
              text: 'System Announcement',
              disabled: true,
              href: '/announcement',
              link: true,
              exact: true,
              to: { name: 'announcement', path: '/announcement' }
            }
          ]
        },
        component: () => import('src/pages/AnnPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/dashboard/DashboardLayout.vue'),
    children: [
      {
        path: 'devices',
        name: 'devices',
        meta: {
          auth: true,
          title: 'Devices',
          breadcrumb: [
            {
              text: 'Devices',
              disabled: true,
              href: '/devices',
              link: true,
              exact: true,
              to: { name: 'devices', path: '/devices' }
            }
          ]
        },
        component: () => import('src/pages/DevicesPage.vue')
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
