import { db } from "@/firebase/firebase";
import { firestoreAction } from "vuexfire";

export default {
  state: {
    room: {},
    roomBeers: [],
    myRooms: [],
    roomIsLoading: true,
  },

  getters: {
    roomBeers: (state) => state.roomBeers,

    room: (state) => state.room,

    roomIsLoading: (state) => state.roomIsLoading,

    myRooms: (state) => state.myRooms,
  },

  mutations: {
    room: (state, room) => (state.room = room),

    roomIsLoading(state, boolean) {
      state.roomIsLoading = boolean;
    },

    setMyRooms(state, myRooms) {
      state.myRooms = myRooms;
    },

    setRoomBeers(state, beers) {
      state.roomBeers = beers;
    },
  },

  actions: {
    bindRoom: firestoreAction(({ bindFirestoreRef, commit }, roomID) => {
      commit("roomIsLoading", true);
      commit("loading", true);
      const roomRef = db.collection("rooms").doc(roomID);
      const beersRef = db.collection("beers");

      const serialize = (doc) => {
        const data = doc.data();

        Object.defineProperty(data, "id", { value: doc.id });
        return data;
      };

      return bindFirestoreRef("room", roomRef, { serialize }).then((room) => {
        let promises = [];

        room.beerList.forEach((beer) => {
          const promise = beersRef
            .doc(beer.beerID)
            .get()
            .then((beerDoc) => {
              return {
                ...beerDoc.data(),
                id: beerDoc.id,
              };
            })
            .catch((err) => {
              console.log(err);
              commit("setRoomBeers", []);
              commit("roomIsLoading", false);
              commit("loading", false);
            });
          promises.push(promise);
        });

        Promise.all(promises).then((beers) => {
          commit("setRoomBeers", beers);
          commit("roomIsLoading", false);
          commit("loading", false);
        });
      });
    }),

    getRoomsData({ commit, rootGetters }) {
      console.log("getRoomsData");
      const rooms = rootGetters.user.myRooms;
      const usersRef = db.collection("users");
      if (rooms.length > 0) {
        let myRooms = [];
        let promises = [];

        rooms.forEach(async (room) => {
          let promise = db
            .collection("rooms")
            .doc(room)
            .get()
            .then(async (doc) => {
              if (!doc.exists) return false;

              const modID = doc.data().modID;
              let object = {
                ...doc.data(),
                id: doc.id,
              };

              await usersRef
                .doc(modID)
                .get()
                .then((modDoc) => {
                  object.mod = modDoc.data();
                });

              return object;
            });
          promises.push(promise);
        });

        Promise.all(promises).then((beers) => {
          beers.reduceRight(function (acc, item, index, object) {
            if (!item) {
              object.splice(index, 1);
            }
          }, []);

          console.log(beers);
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
