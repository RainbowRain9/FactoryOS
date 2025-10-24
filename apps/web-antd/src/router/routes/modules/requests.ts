import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:file-document-edit-outline', order: 150, title: '申请管理' },
    name: 'RequestsRoot',
    path: '/requests',
    redirect: '/requests/chat',
    children: [
      {
        name: 'RequestsChat',
        path: '/requests/chat',
        component: () => import('#/views/factoryos/requests/chat/index.vue'),
        meta: { title: '智能申请助手' },
      },
      {
        name: 'RequestsCreate',
        path: '/requests/create',
        component: () => import('#/views/factoryos/approvals/create/index.vue'),
        meta: { title: '发起申请' },
        beforeEnter: (to, _from, next) => {
          const allowed = new Set(['leave', 'travel', 'reimburse', 'seal', 'custom']);
          const q = { ...to.query } as Record<string, any>;
          const t = q.type as string | undefined;
          if (t && !allowed.has(t)) {
            q.type = 'custom';
            next({ path: to.path, query: q, replace: true });
          } else {
            next();
          }
        },
      },
      {
        name: 'RequestsMine',
        path: '/requests/mine',
        component: () => import('#/views/factoryos/approvals/mine/index.vue'),
        meta: { title: '我发起的' },
        beforeEnter: (to, _from, next) => {
          const allowedStatus = new Set(['draft', 'running', 'approved', 'rejected', 'withdrawn']);
          const allowedType = new Set(['leave', 'travel', 'reimburse', 'seal', 'custom']);
          const allowedTimeKind = new Set(['created', 'finished']);
          const q = { ...to.query } as Record<string, any>;
          let mutated = false;
          if (q.status && !allowedStatus.has(String(q.status))) {
            delete q.status;
            mutated = true;
          }
          if (q.type && !allowedType.has(String(q.type))) {
            delete q.type;
            mutated = true;
          }
          if (q.timeKind && !allowedTimeKind.has(String(q.timeKind))) {
            q.timeKind = 'created';
            mutated = true;
          }
          if (q.sortOrder && !['asc', 'desc'].includes(String(q.sortOrder))) {
            delete q.sortOrder;
            mutated = true;
          }
          if (mutated) next({ path: to.path, query: q, replace: true });
          else next();
        },
      },
    ],
  },
];

export default routes;
