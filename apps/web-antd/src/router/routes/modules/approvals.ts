import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'mdi:check-decagram-outline', order: 200, title: '审批管理' },
    name: 'ApprovalsRoot',
    path: '/approvals',
    redirect: '/approvals/chat',
    children: [
      {
        name: 'ApprovalsChat',
        path: '/approvals/chat',
        component: () => import('#/views/factoryos/approvals/chat/index.vue'),
        meta: { title: '对话' },
      },
      {
        name: 'ApprovalsInbox',
        path: '/approvals/inbox',
        component: () => import('#/views/factoryos/approvals/todo/index.vue'),
        meta: { title: '待我处理' },
        beforeEnter: (to, _from, next) => {
          const allowedStatus = new Set(['pending', 'approved', 'returned', 'withdrawn']);
          const allowedPriority = new Set(['low', 'medium', 'high', 'urgent']);
          const q = { ...to.query } as Record<string, any>;
          let mutated = false;
          if (q.status && !allowedStatus.has(String(q.status))) {
            delete q.status;
            mutated = true;
          }
          if (q.priority && !allowedPriority.has(String(q.priority))) {
            delete q.priority;
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
      {
        name: 'ApprovalsHistory',
        path: '/approvals/history',
        component: () => import('#/views/factoryos/approvals/history/index.vue'),
        meta: { title: '审批历史' },
      },
      {
        name: 'ApprovalsRules',
        path: '/approvals/rules',
        component: () => import('#/views/factoryos/approvals/rules/index.vue'),
        meta: { title: '流程配置与规则' },
      },
    ],
  },
];

export default routes;
