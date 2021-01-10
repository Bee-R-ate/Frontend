import { db } from "@/firebase/firebase";

export default {
  state: {
    beers: [],
  },
  mutations: {
    beers: (state, beers) => (state.beers = beers),
  },
  getters: {
    beers: (state) => state.beers,
  },
  actions: {
    async beers({ commit }) {
      db.collection("beers")
        .get()
        .then((querySnapshot) => {
          let beers = [];
          querySnapshot.forEach((doc) => {
            beers.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          commit("beers", beers);
        });
    },
  },
};
