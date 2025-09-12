export const productRouter = [
  {
    path: '/product',
    name: 'product-list',
    component: () => import('@/views/product/index.vue')
  },
  {
    path: '/product/:slug',
    name: 'product-detail',
    component: () => import('@/views/product/ProductDetail.vue')
  },
  {
    path: '/product/create',
    name: 'product-create',
    component: () => import('@/views/product/ProductDetail.vue')
  },
];
