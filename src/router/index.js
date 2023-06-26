import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: "Main",
    path: '/',
    component: () => import("@/views/MainPage.vue"),
    meta: {
      title: "Main"
    },
  },
  {
    name: "List",
    path: '/todo-list',
    component: () => import("@/views/TodoListPage.vue"),
    meta: {
      title: "Todo list"
    },
  },
]

const router = new createRouter({
  routes,
	history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next();
})

export default router;