export const shiftCalendarRouter = [
  {
    path: '/shift-calendar',
    name: 'shift-calendar-list',
    component: () => import('@/views/shiff-calendar/index.vue'),
    meta: {
      title: 'Danh sách ca trực'
    }
  }
];
