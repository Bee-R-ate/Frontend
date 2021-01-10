import { db } from "@/firebase/firebase";

export default {
  state: {
    room: {},
  },
  getters: {
    room: (state) => state.room,
  },
  mutations: {
    room: (state, room) => (state.room = room),
  },
  actions: {
    room({ commit }, id) {
      db.collection("rooms")
        .doc(id)
        .onSnapshot((doc) => {
          commit("room", { ...doc.data(), id: doc.id });
        });
    },
  },
};
