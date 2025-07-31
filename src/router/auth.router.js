export const authRouter = [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/pages/auth/Login.vue'),
    meta: {
      title: 'Đăng nhập'
    }
  }
];
