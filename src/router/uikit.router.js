export const uikitRouter = [];

export const pagesExampleRouter = [];

export const pagesNotHaveLayoutRouter = [
  {
    path: '/auth/access',
    name: 'accessDenied',
    component: () => import('@/views/pages/auth/Access.vue')
  },
  {
    path: '/auth/error',
    name: 'error',
    component: () => import('@/views/pages/auth/Error.vue')
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import('@/views/pages/Landing.vue')
  },
  {
    path: '/pages/notfound',
    name: 'notfound',
    component: () => import('@/views/pages/NotFound.vue')
  }
];
