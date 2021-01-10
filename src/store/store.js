import Vue from "vue";
import Vuex from "vuex";

import Auth from "./modules/auth.module";
import Snackbar from "./modules/snackbar.module";
import Loading from "./modules/loading.module";
import Friends from "./modules/friends.module";
import Beers from "./modules/beers.module";
import Room from "./modules/room.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    Snackbar,
    Loading,
    Friends,
    Beers,
    Room,
  },
});
