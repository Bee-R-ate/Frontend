import { db } from "@/firebase/firebase";

export default {
  state: {
    room: {},
    myRooms: [],
  },

  getters: {
    room: (state) => state.room,

    myRooms: (state) => state.myRooms,
  },

  mutations: {
    room: (state, room) => (state.room = room),

    setMyRooms(state, myRooms) {
      state.myRooms = myRooms;
    },
  },

  actions: {
    room({ commit }, id) {
      db.collection("rooms")
        .doc(id)
        .onSnapshot((doc) => {
          commit("room", { ...doc.data(), id: doc.id });
        });
    },

    getRoomsData({ commit, rootGetters }) {
      console.log("getRoomsData");
      const rooms = rootGetters.user.myRooms;

      if (rooms.length > 0) {
        let myRooms = [];
        let promises = [];

        rooms.forEach(async (room) => {
          let promise = db
            .collection("rooms")
            .doc(room)
            .get()
            .then((doc) => {
              return doc.data();
            });
          promises.push(promise);
        });

        Promise.all(promises).then((beers) => {
          myRooms.push(...beers);
        });

        commit(
          "setMyRooms",
          myRooms.sort((x, y) => x.createdAt.toDate() - y.createdAt.toDate())
        );
      }
    },
  },
};
