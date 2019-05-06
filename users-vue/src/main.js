// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import paths from "./router/paths";
import store from "./store";

// Plugins
import "./plugins/bootstrapvue";
import "./plugins/vuematerial";
import "./plugins/vuelidate";
import "./plugins/vuejsmodal";
import "./plugins/vueloadingoverlay";
import "./plugins/vueerrorpage";

// Vue-Awesome
import Icon from "vue-awesome/components/Icon";

// Custom Style
import "@/assets/scss/main.scss";

import ApiService from "@/common/api.service";

Vue.config.productionTip = false;

Vue.component("v-icon", Icon);

ApiService.init();

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.getters.isAuthenticated) {
      next();
    } else {
      next(paths.LOGIN);
    }
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
}).$mount("#app");
