export const customerRouter = [
  {
    path: '/customer',
    name: 'customer-list',
    component: () => import('@/views/customer/index.vue')
  },
  {
    path: '/customer/:id',
    name: 'customer-detail',
    component: () => import('@/views/customer/CustomerDetail.vue')
  },
];
