import { createRouter, createWebHistory } from "vue-router";

// 路由列表
const routes = [
  // 首页
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home.vue"),
  },

  // 结果页
  {
    path: "/page",
    name: "page",
    component: () => import("@/views/page.vue"),
  },

  // FAQs
  {
    path: "/info",
    name: "info",
    component: () => import("@/views/info.vue"),
  },
];

// 导出路由
export default createRouter({
  history: createWebHistory(),
  routes,
});
