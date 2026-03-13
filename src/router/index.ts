import { createRouter, createWebHistory } from "vue-router";
import LayOutVue from "../views/layout/index.vue";
import WelcomeVue from "../views/welcome/index.vue";
import RobotVue from "../views/robot/index.vue";
import ProviderVue from "../views/provider/index.vue";
import TelecomVue from "../views/telecom/index.vue";
import ConfigBasicVue from "../views/config/basic.vue";
import ConfigAdvancedVue from "../views/config/advenced.vue";
import ConfigReservedVue from "../views/config/reserved.vue";
import PluginSkillsVue from "../views/plugin/skills/index.vue";
import ReservedVue from "../views/reserved/index.vue";
import SettingsVue from "../views/settings/index.vue";
import DocsVue from "../views/docs/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: LayOutVue,
      children: [
        // 默认重定向到 welcome 页面
        {
          path: "",
          redirect: "/welcome",
        },
        // 首页：用内联组件（无需创建单独的 View 文件）

        {
          path: "welcome",
          name: "welcome",
          component: WelcomeVue,
        },
        {
          path: "robot",
          name: "robot",
          component: RobotVue,
        },
        {
          path: "provider",
          name: "provider",
          component: ProviderVue,
        },
        {
          path: "telecom",
          name: "telecom",
          component: TelecomVue,
        },
        {
          path: "config/basic",
          name: "config-basic",
          component: ConfigBasicVue,
        },
        {
          path: "config/advanced",
          name: "config-advanced",
          component: ConfigAdvancedVue,
        },
        {
          path: "config/reserved",
          name: "config-reserved",
          component: ConfigReservedVue,
        },
        {
          path: "plugin/skills",
          name: "plugin-skills",
          component: PluginSkillsVue,
        },
        {
          path: "reserved",
          name: "reserved",
          component: ReservedVue,
        },
        {
          path: "settings",
          name: "settings",
          component: SettingsVue,
        },
        {
          path: "docs",
          name: "docs",
          component: DocsVue,
        },
      ],
    },
  ],
});

export default router;
