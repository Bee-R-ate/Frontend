import { db, fb } from "@/firebase/firebase";
import translateErrors from "@/mixins/translateErrors";

export default {
  state: {
    beers: [],
  },
  mutations: {
    beers: (state, beers) => (state.beers = beers),
  },
  getters: {
    beers: (state) => state.beers,
  },
  actions: {
    async beers({ commit }) {
      db.collection("beers")
        .get()
        .then((querySnapshot) => {
          let beers = [];
          querySnapshot.forEach((doc) => {
            beers.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          commit("beers", beers);
        });
    },

    addBeer({ dispatch, commit, rootGetters }, { name, file }) {
      commit("loading", true);

      //ten kod będzie usunięty po wprowadzeniu algolii
      const beers = rootGetters.beers;

      if (beers.find((beer) => beer.name === name)) {
        commit(
          "snackbar",
          "Wiem, że bardzo je lubisz, ale takie piwo jest już na liście..."
        );
        return;
      }
      //.ten kod będzie usunięty po wprowadzeniu algolii

      return db
        .collection("beers")
        .add({
          name: name,
          photoUrl: null,
          avgAppearanceScore: 0,
          avgSmellScore: 0,
          avgTasteScore: 0,
          avgSensationsScore: 0,
          avgSubjectiveScore: 0,
          avgScore: 0,
        })
        .then(async (beerDoc) => {
          const storageRef = fb.storage().ref(`beers/${beerDoc.id}/image`);
          const uploadTask = storageRef.put(file);

          await uploadTask.on(
            "state_changed",
            () => {},
            (err) => {
              commit("snackbar", translateErrors(err.code));
              commit("loading", false);
            },
            () => {
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then((downloadURL) => {
                  beerDoc
                    .update({
                      photoUrl: downloadURL,
                    })
                    .then(async () => {
                      commit("snackbar", "Na zdrówko!");
                      commit("loading", false);
                      await dispatch("beers");
                    });
                })
                .catch((err) => {
                  commit("snackbar", translateErrors(err.code));
                  commit("loading", false);
                });
            }
          );
        })
        .catch((err) => {
          commit("snackbar", translateErrors(err.code));
          commit("loading", false);
        });
    },

    async editBeer({ dispatch, commit }, { beerID, name, editFile }) {
      commit("loading", true);
      if (editFile != null) {
        const storageRef = fb.storage().ref(`beers/${beerID}/${editFile.name}`);
        const uploadTask = storageRef.put(editFile);

        await uploadTask.on(
          "state_changed",
          () => {},
          (error) => console.log(error),
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              db.collection("beers")
                .doc(beerID)
                .update({ photoUrl: downloadURL, name: name })
                .then(() => {
                  commit("snackbar", "Edytowano zdjęcię!");
                  commit("loading", false);
                  dispatch("beers");
                })
                .catch(() => {
                  commit("snackbar", "Błąd serwera, przepraszamy...");
                  commit("loading", false);
                });
            });
          }
        );
      } else {
        await db
          .collection("beers")
          .doc(beerID)
          .update({ name: name })
          .then(() => {
            commit("snackbar", "Edytowano nazwę!");
            commit("loading", false);
            dispatch("beers");
            editFile = null;
          });
      }
    },
  },
};
