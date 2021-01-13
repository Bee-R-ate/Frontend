import { fb, db } from "@/firebase/firebase";
import router from "@/router";
import translateErrors from "@/mixins/translateErrors";

export default {
  state: {
    user: {},
    authIsLoading: false,
  },

  mutations: {
    changeUserAvatar(state, downloadURL) {
      state.user.imageURL = downloadURL;
    },

    changeUserName(state, name) {
      state.user.name = name;
    },

    changeUserEmail(state, email) {
      state.user.email = email;
    },

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
          if (!userDoc.exists) {
            dispatch("signOut");
            commit("snackbar", translateErrors("auth/user-not-found"));
            return;
          }
          const user = userDoc.data();
          user.uid = uid;

          console.log(user);
          commit("setUser", user);

          await dispatch("friends");
          await dispatch("beers");

          commit("authSuccess");
          commit("loading", false);
          commit("snackbar", "Jesteś zalogowany!");

          const routeName = router.currentRoute.name;
          if (routeName === "Login" || routeName === "Register") {
            router.push("/");
          }
        })
        .catch((err) => {
          dispatch("signOut");
          console.log(err);
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

          if (path !== "/") {
            router.push("/");
          }
        })
        .catch((err) => {
          commit("loading", false);
          commit("snackbar", translateErrors(err.code));
        });
    },
  },
};
