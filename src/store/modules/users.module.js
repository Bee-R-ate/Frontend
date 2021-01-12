import { fb, db } from "@/firebase/firebase";
import firebase from "firebase/app";

export default {
  state: {
    user: {},
  },
  mutations: {},
  getters: {},

  actions: {
    editUser({ commit, state, dispatch }, userData) {
      commit("loading", true);
      if (userData.file != null) {
        const storageRef = fb
          .storage()
          .ref(`avatars/${state.user.docID}/${userData.file.name}`);
        const uploadTask = storageRef.put(userData.file);

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
            if (error.code == "auth/wrong-password") {
              commit("snackbar", "Podano nieprawidłowe hasło!");
              commit("loading", false);
              return;
            }
          });
      }

      db.collection("users")
        .doc(state.user.docID)
        .update({ Name: userData.name })
        .then(() => {
          commit("snackbar", "Pomyślnie edytowano nazwę!");
          commit("loading", false);
        });
    },
  },
};
