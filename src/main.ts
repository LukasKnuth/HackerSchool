/// <reference path="./shim-js-interpreter.d.ts" />
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueI18n from 'vue-i18n';
import BootstrapVue from "bootstrap-vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import * as icons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import German from "@/i18n/German";

library.add(
    icons.faAngleUp, icons.faAngleDown, icons.faUndoAlt, icons.faRedoAlt, icons.faFrog, icons.faFighterJet,
    icons.faShoePrints, icons.faPuzzlePiece, icons.faPlay, icons.faPause, icons.faStop
);

Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(BootstrapVue);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// translations:
const i18n = new VueI18n({
    locale: 'de',
    messages: {
        de: German
    }
});

new Vue({
    i18n,
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
