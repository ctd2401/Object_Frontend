import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { customerRouter } from './customer.router';
import { productRouter } from './product.router';
import { storeRouter } from './store.router';
import { uikitRouter } from './uikit.router';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        ...uikitRouter,
        {
          path: '/pages/empty',
          name: 'empty',
          component: () => import('@/views/pages/Empty.vue')
        },
        {
          path: '/pages/crud',
          name: 'crud',
          component: () => import('@/views/pages/Crud.vue')
        },
        {
          path: '/pages/documentation',
          name: 'documentation',
          component: () => import('@/views/pages/Documentation.vue')
        },
        {
          path: '/banner',
          name: 'Banner',
          component: () => import('@/views/banner/Banner.vue')
        },
        {
          path: '/sale-report',
          name: 'sale-report',
          component: () => import('@/views/sale-report/index.vue')
        },
        ...storeRouter,
        ...customerRouter,
        ...productRouter
      ]
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
    },

    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/pages/auth/Login.vue')
    },
    {
      path: '/auth/access',
      name: 'accessDenied',
      component: () => import('@/views/pages/auth/Access.vue')
    },
    {
      path: '/auth/error',
      name: 'error',
      component: () => import('@/views/pages/auth/Error.vue')
    }
  ]
});

export default router;
