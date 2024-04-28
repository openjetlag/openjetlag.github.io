import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// ElementPlus
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";

// 初始化 css
import "@/assets/css/auto.scss";
import "@/assets/css/elementPlus.scss";
// 自适应
import "@/assets/css/rem.css";

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
