export const storeRouter = [
  {
    path: '/store',
    name: 'store-list',
    component: () => import('@/views/store/index.vue'),
    meta: {
      title: 'Danh sách cửa hàng'
    }
  },
  {
    path: '/store/:id',
    name: 'store-detail',
    component: () => import('@/views/store/StoreDetail.vue'),
    meta: {
      title: 'Chi tiết cửa hàng'
    }
  },
  {
    path: '/store/create',
    name: 'store-create',
    component: () => import('@/views/store/StoreDetail.vue'),
    meta: {
      title: 'Tạo mới cửa hàng'
    }
  }
];
