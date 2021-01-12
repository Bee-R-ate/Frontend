import { db } from "@/firebase/firebase";

export default {
  state: {
    friends: [],
  },
  mutations: {
    friends: (state, friends) => (state.friends = friends),
  },
  getters: {
    friends: (state) => state.friends,
  },
  actions: {
    async friends({ commit, rootGetters }) {
      console.log("fetch friends");
      let friends = [];
      console.log(rootGetters.user);

      for (let id of rootGetters.user.friends) {
        let promise = await db.collection("users").doc(id).get();
        let friend = promise.data();
        friend.id = promise.id;
        friends.push(friend);
      }
      commit("friends", friends);
    },
  },
};
