import type { RouteRecordRaw } from 'vue-router';
import TaskOneView from '@/views/TaskOneView.vue';
import TaskTwoView from '@/views/TaskTwoView.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/', component: TaskOneView },
  { path: '/task-2', component: TaskTwoView },
  { path: '/:catchAll(.*)', redirect: '/' },
];
