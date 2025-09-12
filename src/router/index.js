import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { authRouter } from './auth.router';
import { shiftCalendarRouter } from './shift-calendar.router';
import { storeRouter } from './store.router';
import { pagesNotHaveLayoutRouter } from './uikit.router';

import { categoryRouter } from './category.router';
import { customerRouter } from './customer.router';
import { productRouter } from './product.router';
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
        
        ...storeRouter,
        
        ...shiftCalendarRouter,
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
        ...customerRouter,
        ...productRouter,
        ...categoryRouter
      ]
    },
    ...authRouter,
    ...pagesNotHaveLayoutRouter
  ]
});

router.afterEach((to) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta?.title);
  if (nearestWithTitle) {
    document.title = `${nearestWithTitle.meta.title} | OBJECT`;
  } else {
    document.title = 'OBJECT';
  }
});

export default router;
