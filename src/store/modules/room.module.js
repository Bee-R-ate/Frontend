import { db } from "@/firebase/firebase";
import { firestoreAction } from "vuexfire";

export default {
  state: {
    room: {},
    roomBeers: [],
    myRooms: [],
    roomIsLoading: true,
    roomBeersLoading: false,
    myRoomsAreLoading: false,
  },

  getters: {
    myRoomsAreLoading: (state) => state.myRoomsAreLoading,

    roomBeersLoading: (state) => state.roomBeersLoading,

    roomBeers: (state) => state.roomBeers,

    room: (state) => state.room,

    roomIsLoading: (state) => state.roomIsLoading,

    myRooms: (state) => state.myRooms,
  },

  mutations: {
    setMyRoomsAreLoading: (state, boolean) =>
      (state.myRoomsAreLoading = boolean),

    setRoomBeersLoading: (state, boolean) => (state.roomBeersLoading = boolean),

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
    fetchBeersData({ commit }, beerList) {
      commit("setRoomBeersLoading", true);

      const beersRef = db.collection("beers");

      let promises = [];

      beerList.forEach((beer) => {
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
            commit("setRoomBeersLoading", false);
          });
        promises.push(promise);
      });

      return Promise.all(promises).then((beers) => {
        commit("setRoomBeersLoading", false);
        commit("setRoomBeers", beers);
      });
    },

    bindRoom: firestoreAction(
      ({ bindFirestoreRef, dispatch, commit, rootGetters }, roomID) => {
        commit("roomIsLoading", true);
        commit("loading", true);
        const roomRef = db.collection("rooms").doc(roomID);

        const serialize = (doc) => {
          const data = doc.data();

          const roomBeers = rootGetters.roomBeers;

          const beerListChanged =
            roomBeers.toString() !== data.beerList.toString();

          if (beerListChanged) {
            dispatch("fetchBeersData", data.beerList);
          }

          Object.defineProperty(data, "id", { value: doc.id });
          return data;
        };

        return bindFirestoreRef("room", roomRef, {
          serialize,
        }).then(async (room) => {
          await dispatch("fetchBeersData", room.beerList);
          commit("loading", false);
          commit("roomIsLoading", false);
        });
      }
    ),

    getRoomsData({ commit, rootGetters }) {
      commit("setMyRooms", []);
      commit("setMyRoomsAreLoading", true);

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
            })
            .catch((err) => {
              console.log(err.code);
              commit("setMyRoomsAreLoading", false);
              commit("setMyRooms", []);
            });
          promises.push(promise);
        });

        Promise.all(promises).then((beers) => {
          beers.reduceRight(function (acc, item, index, object) {
            if (!item) {
              object.splice(index, 1);
            }
          }, []);

          myRooms.push(...beers);
          commit(
            "setMyRooms",
            myRooms.sort((x, y) => y.createdAt.toDate() - x.createdAt.toDate())
          );
          commit("setMyRoomsAreLoading", false);
        });
      }
    },
  },
};
