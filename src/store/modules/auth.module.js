import { fb, db } from "@/firebase/firebase";
import router from "@/router";

function translateErrors(errCode) {
  switch (errCode.toString()) {
    case "auth/user-not-found": {
      return "Nie znaleziono użytkownika";
    }
    case "auth/email-already-exists": {
      return "Email jest zajęty";
    }
    case "auth/email-already-in-use": {
      return "Email jest zajęty";
    }
    case "auth/wrong-password": {
      return "Błędne hasło";
    }
    case "auth/invalid-email": {
      return "Błędny format email";
    }
    case "auth/too-many-requests": {
      return "Zbyt wiele nieudanych prób logowania. Spróboj ponownie później";
    }
    case "auth/internal-error": {
      return "Błąd serwera";
    }
    default: {
      return "Autoryzacja nieudana";
    }
  }
}

export default {
  state: {
    user: {},
    authIsLoading: false,
  },

  mutations: {
    authStart(state) {
      state.user = {};
      state.authIsLoading = true;
    },

    authSuccess(state) {
      state.authIsLoading = false;
    },

    authSignOut(state) {
      state.user = {};
      state.friends = [];
      state.authIsLoading = false;
    },

    setUser(state, user) {
      state.user = user;
    },
  },

  getters: {
    user: (state) => state.user,

    authIsLoading: (state) => state.authIsLoading,
  },

  actions: {
    login({ dispatch, commit }, { password, email }) {
      console.log("login");
      commit("authStart");
      commit("loading", true);

      return fb
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCred) => {
          console.log(userCred.user.uid);
          await dispatch("fetchUserData", userCred.user.uid);
        })
        .catch((err) => {
          dispatch("signOut");
          commit("snackbar", translateErrors(err.code));
        });
    },

    register({ commit, dispatch }, { password, email, name }) {
      console.log("register");
      commit("authStart");
      commit("loading", true);

      return fb
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCred) => {
          const user = {
            email: email,
            name: name,
            imageURL:
              "https://avatars0.githubusercontent.com/u/9064066?v=4&s=460",
            friends: [],
            myRooms: [],
          };
          await dispatch("createUserDoc", {
            uid: userCred.user.uid,
            user: user,
          });
        })
        .catch((err) => {
          dispatch("signOut");
          commit("snackbar", translateErrors(err.code));
        });
    },

    createUserDoc({ dispatch, commit }, { uid, user }) {
      console.log("crete user doc");
      const usersRef = db.collection("users");

      return usersRef
        .doc(uid)
        .set(user)
        .then(async () => {
          await dispatch("fetchUserData", uid);
        })
        .catch((err) => {
          console.log(err);
          commit("snackbar", translateErrors(err.code));
          dispatch("signOut");
        });
    },

    fetchUserData({ commit, dispatch }, uid) {
      console.log("fetch user data");
      const userRef = db.collection("users").doc(uid);

      return userRef
        .get()
        .then(async (userDoc) => {
          const user = userDoc.data();
          user.uid = uid;

          console.log(user);
          commit("setUser", user);

          await dispatch("friends");
          await dispatch("beers");

          commit("authSuccess");
          commit("loading", false);
          commit("snackbar", "Jesteś zalogowany!");
          if (router.currentRoute.path !== "/") {
            router.push("/");
          }
        })
        .catch((err) => {
          dispatch("signOut");
          commit("snackbar", translateErrors(err.code));
        });
    },

    signOut({ commit }) {
      fb.auth()
        .signOut()
        .then(() => {
          console.log("sign out");
          commit("authSignOut");
          commit("loading", false);

          const path = router.currentRoute.path;

          if (
            path !== "/" &&
            path !== "/logowanie" &&
            path !== "/rejestracja"
          ) {
            router.push("/");
          }
        })
        .catch((err) => {
          commit("loading", false);
          commit("snackbar", translateErrors(err.code));
        });
    },

    // eslint-disable-next-line no-unused-vars
    // autoLogin({ commit, dispatch }) {
    // commit("loading", true);
    // let user = JSON.parse(localStorage.getItem("user"));

    // if (user) {
    //   db.collection("users")
    //     .where("email", "==", user.email)
    //     .limit(1)
    //     .onSnapshot((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         commit("user", { docID: doc.id, ...doc.data() });
    //         commit("loading", false);
    //         dispatch("friends");
    //         dispatch("beers");
    //       });
    //     });
    // } else {
    //   commit("signOut");
    //   commit("loading", false);
    // }
    // },
  },
};
