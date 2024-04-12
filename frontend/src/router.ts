import { createRouter, createWebHashHistory } from 'vue-router';

import ClientView from './views/ClientView.vue';
import BusinessView from './views/BusinessView.vue'

const router = createRouter({
  strict: true,
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: `/`,
      component: ClientView,
    },
    {
      path: `/Company`,
      component: BusinessView,
    },
    {
      path: '/:path(.*)',
      component: () => import('./views/404View.vue'),
    },
  ],
});

export default router;
