import { createApp } from "vue";
import App from "./App.vue";
import VueECharts from "vue-echarts";
import * as echarts from "echarts";
import Cookies from "js-cookie";

import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./pages/Home";
import Bank from "./pages/Bank";
import Management from "./pages/Management";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
//ICONS
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccount } from "@mdi/js";
import { mdiBankTransfer } from "@mdi/js";
import { mdiCurrencyEur } from "@mdi/js";
import { mdiPlus } from "@mdi/js";
import { mdiChartTimelineVariant } from "@mdi/js";
import { mdiTriangleSmallDown } from "@mdi/js";
import { mdiEye } from "@mdi/js";
import { mdiHomeCircle } from "@mdi/js";
import { mdiCalendarMonth } from "@mdi/js";
import { mdiDelete } from "@mdi/js";

const routes = [
  { path: "/", component: Home, meta: { requiresAuth: true } },
  { path: "/bankaccount", component: Bank, meta: { requiresAuth: true } },
  { path: "/management", component: Management, meta: { requiresAuth: true } },
  { path: "/login", component: Login, meta: { showHeader: false } },
  { path: "/signup", component: Signup, meta: { showHeader: false } },
];

const vuetify = createVuetify({
  theme: { defaultTheme: "light" },
  components,
  directives,
  echarts,
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
      account: mdiAccount,
      bankTransfer: mdiBankTransfer,
      euro: mdiCurrencyEur,
      plus: mdiPlus,
      chart: mdiChartTimelineVariant,
      triangleDown: mdiTriangleSmallDown,
      eye: mdiEye,
      home: mdiHomeCircle,
      calendar: mdiCalendarMonth,
      delete: mdiDelete,
    },
    sets: {
      mdi,
    },
  },
});

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Vérifiez si le cookie 'token' existe et n'est pas vide
    const token = Cookies.get("token");
    if (!token) {
      next({ path: "/login" }); // Redirige vers la page de connexion si le token est manquant
    } else {
      next();
    }
  } else {
    next();
  }
});

const VueApp = createApp(App);

VueApp.use(VueECharts, { echarts });
VueApp.use(router);
VueApp.use(vuetify);

VueApp.mount("#app");
