import { fb, db } from "@/firebase/firebase";
import firebase from "firebase/app";

export default {
  state: {
    user: {},
  },
  mutations: {},
  getters: {},

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
  },
};
