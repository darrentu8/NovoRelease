// 公共路由，無需權限
export const PublicRoutes = [
  {
    path: '/',
    redirect: '/login',
    component: () => import('layouts/login/LoginLayout.vue'),
    children: [
      {
        path: 'login',
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
    path: '/',
    component: () => import('layouts/dashboard/DashboardLayout.vue'),
    children: [
      {
        path: 'product',
        name: 'product',
        meta: {
          auth: true,
          title: 'Product',
          breadcrumb: [
            {
              text: 'Product',
              disabled: true,
              href: '/product',
              link: true,
              exact: true,
              to: { name: 'product', path: '/product' }
            }
          ]
        },
        component: () => import('src/pages/ProductPage.vue'),
        children: [
          {
            path: ':id',
            name: 'productdetail',
            meta: {
              auth: true,
              title: ':id',
              breadcrumb: [
                {
                  text: 'Product',
                  disabled: true,
                  href: '/product',
                  link: true,
                  exact: true,
                  to: { name: 'product', path: '/product' }
                },
                {
                  text: ':id',
                  disabled: true,
                  href: '/:id',
                  link: true,
                  exact: true,
                  to: { name: ':id', path: '/:id' }
                }
              ]
            },
            component: () => import('src/pages/ProductDetailPage.vue')
          }
        ]
      },
      {
        path: 'upgrade',
        name: 'upgrade',
        meta: {
          auth: true,
          title: 'Upgrade',
          breadcrumb: [
            {
              text: 'Upgrade',
              disabled: true,
              href: '/upgrade',
              link: true,
              exact: true,
              to: { name: 'upgrade', path: '/upgrade' }
            }
          ]
        },
        component: () => import('src/pages/UpgradePage.vue')
      },
      {
        path: 'bsp',
        name: 'bsp',
        meta: {
          auth: true,
          title: 'Bsp',
          breadcrumb: [
            {
              text: 'Bsp',
              disabled: true,
              href: '/bsp',
              link: true,
              exact: true,
              to: { name: 'bsp', path: '/bsp' }
            }
          ]
        },
        component: () => import('src/pages/BspPage.vue'),
        children: [
          {
            path: ':id',
            name: 'bspCon',
            meta: {
              auth: true,
              title: ':id',
              breadcrumb: [
                {
                  text: 'Bsp',
                  disabled: true,
                  href: '/bsp',
                  link: true,
                  exact: true,
                  to: { name: 'bsp', path: '/bsp' }
                },
                {
                  text: ':id',
                  disabled: true,
                  href: '/:id',
                  link: true,
                  exact: true,
                  to: { name: ':id', path: '/:id' }
                }
              ]
            },
            component: () => import('src/pages/BspConPage.vue')
          }
        ]
      }
    ]
  },
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
