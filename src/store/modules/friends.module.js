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

    async addFriend({ commit, rootGetters, dispatch }, payload) {
      if (
        payload.search.toLowerCase() == rootGetters.user.email.toLowerCase()
      ) {
        commit(
          "snackbar",
          "Myślałem, że brak znajomych to smutek, ale zapraszanie samego siebie... ;)"
        );
        return;
      }
      commit("loading", true);
      await db
        .collection("users")
        .where("email", "==", payload.search.toLowerCase())
        .limit(1)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length == 0) {
            commit("snackbar", "Nie znaleziono użytkownika!");
            commit("loading", false);
          }
          querySnapshot.forEach((doc) => {
            if (!rootGetters.friends.includes(doc.id)) {
              rootGetters.friends.push(doc.id);
              db.collection("users")
                .doc(rootGetters.uid)
                .update({ friends: rootGetters.friends })
                .then(() => {
                  commit("snackbar", "To teraz piwko!");
                  commit("loading", false);
                  payload.search = "";
                });
              let friends = doc.data().friends;
              friends.push(rootGetters.uid);
              db.collection("users").doc(doc.id).update({ friends: friends });
              dispatch("friends");
            } else {
              commit("loading", false);
              commit(
                "snackbar",
                "Już masz tego znajomego. Dodanie go drugi raz nie sprawi, że będzie Cię lubił bardziej..."
              );
            }
          });
        });
    },
    async deleteFriend({ commit, rootGetters, dispatch }, payload) {
      if (!confirm(`Czy na pewno chcesz usunąć kolegę ${payload.friend.name}?`))
        return;
      await db
        .collection("users")
        .doc(payload.friend.id)
        .onSnapshot((doc) => {
          let friendFriends = doc.data().friends;
          friendFriends.splice(friendFriends.indexOf(rootGetters.user.uid), 1);
          db.collection("users")
            .doc(payload.friend.id)
            .update({ friends: friendFriends });
        });

      let myFriends = rootGetters.user.friends;
      myFriends.splice(myFriends.indexOf(payload.friend.id), 1);

      await db
        .collection("users")
        .doc(rootGetters.user.uid)
        .update({ friends: myFriends })
        .then(() => {
          commit("snackbar", "Przykro, że się nie dogadaliście...");
          dispatch("friends");
        });
    },
  },
};
