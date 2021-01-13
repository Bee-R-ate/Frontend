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
    editUserPicture({ commit, state, dispatch }, file) {
      commit("loading", true);
      if (file != null) {
        const storageRef = fb
            .storage()
            .ref(`avatars/${state.user.docID}/${file.name}`);
        const uploadTask = storageRef.put(file);

        uploadTask.on(
            "state_changed",
            () => {},
            (error) => console.log(error),
            () => {
              uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then(function (downloadURL) {
                    db.collection("users")
                        .doc(state.user.docID)
                        .update({ imageURL: downloadURL })
                        .then(() => {
                          commit("snackbar", "Pomyślnie dodano zdjęcie!");
                          commit("loading", false);
                          dispatch("autoLogin");
                        })
                        .catch(() => {
                          commit("snackbar", "Błąd serwera, przepraszamy...");
                          commit("loading", false);
                        });
                  });
            }
        );
      }
    },

    editUserName({ commit, state }, name) {
      db.collection("users")
          .doc(state.user.docID)
          .update({ name: name })
          .then(() => {
            commit("snackbar", "Pomyślnie edytowano nazwę!");
            commit("loading", false);
          });
    },

    editUserPassword({ commit }, userData) {
      if (userData.newPassword) {
        let user = firebase.auth().currentUser;
        const credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            userData.oldPassword
        );

        user
            .reauthenticateWithCredential(credentials)
            .then(() =>
                user.updatePassword(userData.newPassword).then(() => {
                  commit("snackbar", "Pomyślnie zmieniono hasło!");
                  commit("loading", false);
                })
            )
            .catch((error) => {
              if (error.code === "auth/wrong-password") {
                commit("snackbar", "Podano nieprawidłowe hasło!");
                commit("loading", false);
                return;
              }
            });
      }
    },

    editUserEmail({ commit }, userData) {
      if (userData.email) {
        let user = firebase.auth().currentUser;
        const credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            userData.oldPassword
        );

        user
            .reauthenticateWithCredential(credentials)
            .then(() =>
                user.updateEmail(userData.email).then(() => {
                  commit("snackbar", "Pomyślnie zmieniono adres e-mail!");
                  commit("loading", false);
                })
            )
            .catch((error) => {
              if (error.code === "auth/wrong-password") {
                commit("snackbar", "Podano nieprawidłowe hasło!");
                commit("loading", false);
                return;
              }
            });
      }
    },

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
