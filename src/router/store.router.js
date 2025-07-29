export const storeRouter = [
  {
    path: '/store',
    name: 'store-list',
    component: () => import('@/views/store/index.vue')
  },
  {
    path: '/store/:id',
    name: 'store-detail',
    component: () => import('@/views/store/StoreDetail.vue')
  },
];
