<template>
  <div class="d-flex justify-center home-container beers">
    <div class="home-content position-relative text-center friends">
      <div class="back-container" style="top: -2%">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title mt-2">Piwa</h2>
      <img
        v-if="activePhoto && editFlag == undefined"
        class="profile-photo"
        :src="activePhoto"
        alt="piwo"
      />
      <v-form ref="form">
        <v-file-input
          show-size
          accept="image/png, image/jpeg, image/bmp, image/gif, image/svg, image/jfif"
          :rules="[rules.fileSize]"
          color="black"
          class="mt-0"
          v-model="file"
          label="Zdjęcie piwa"
        ></v-file-input>
        <v-text-field
          class="pa-3 pb-1 mt-0 friends-search"
          color="black"
          label="Wpisz nazwę"
          v-model="name"
        ></v-text-field>
      </v-form>
      <v-btn
        :disabled="!name || !file"
        style="width: 100%"
        @click="addBeer"
        class="mt-2 mb-3"
        color="secondary"
        >Dodaj piwko!
      </v-btn>

      <v-text-field
        color="black"
        label="Znajdź piwo..."
        prepend-icon="mdi-magnify"
        v-model="search"
      ></v-text-field>
      <v-list v-if="beers.length > 0" class="py-0 friend-list">
        <div v-for="(beer, i) in beers" :key="i">
          <div v-if="beer.name.toLowerCase().includes(search.toLowerCase())">
            <v-list-item class="px-0">
              <v-list-item-avatar :size="160" class="ml-3">
                <v-img v-if="editFlag != i" :src="beer.photoUrl"></v-img>
                <v-img v-else :src="activePhoto"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="position-relative">
                <div class="pr-3 py-3">
                  <div class="text-left" v-if="editFlag != i">
                    <v-list-item-title
                      class="font-weight-bold mb-2"
                      style="font-size: 2rem"
                      v-html="beer.name"
                    ></v-list-item-title>
                    <h4 class="mb-1">Średnie piwa:</h4>
                    <p class="mb-0">
                      Smak: {{ beer.avgTasteScore.toFixed(1) }}
                    </p>
                    <p class="mb-0">
                      Zapach: {{ beer.avgSmellScore.toFixed(1) }}
                    </p>
                    <p class="mb-0">
                      Odczucia w ustach:
                      {{ beer.avgSensationsScore.toFixed(1) }}
                    </p>
                    <p>Wygląd: {{ beer.avgAppearanceScore.toFixed(1) }}</p>
                    <h2>Ogółem: {{ beer.avgScore.toFixed(1) }}</h2>
                  </div>
                  <div v-else>
                    <v-text-field
                      label="Wpisz nazwę"
                      :rules="[rules.required]"
                      v-model="beer.name"
                    ></v-text-field>
                    <v-file-input
                      show-size
                      accept="image/png, image/jpeg, image/bmp, image/gif, image/svg, image/jfif"
                      :rules="[rules.fileSize]"
                      color="black"
                      class="mt-0"
                      v-model="editFile"
                      label="Zdjęcie piwa"
                    ></v-file-input>
                    <v-btn
                      color="secondary"
                      v-if="editFlag == i"
                      @click="editBeer(beer)"
                      >Zapisz</v-btn
                    >
                    <v-btn
                      color="#E53935"
                      v-if="editFlag == i"
                      @click="editFlag = undefined"
                      >Anuluj</v-btn
                    >
                  </div>
                </div>
                <div
                  v-if="editFlag == undefined"
                  class="delete-friend-container"
                >
                  <div>
                    <v-btn small-x class="" @click="editFlag = i" icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i != beers.length - 1"></v-divider>
          </div>
        </div>
      </v-list>
      <div v-else>Nie masz w tej chwili piw, trochę suszy.</div>
    </div>
  </div>
</template>

<script>
import { db, fb } from "@/firebase/firebase";
import rules from "@/helpers/validation/rules";

export default {
  data() {
    return {
      rules,
      search: "",
      name: "",
      file: null,
      editFile: null,
      editFlag: undefined,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    beers() {
      return this.$store.getters.beers;
    },
    activePhoto() {
      return this.editFlag == undefined
        ? this.file == null
          ? ""
          : URL.createObjectURL(this.file)
        : this.editFile == null
        ? this.beers[this.editFlag].photoUrl
        : URL.createObjectURL(this.editFile);
    },
  },
  methods: {
    resetForm() {
      this.file = null;
      this.name = "";
    },
    addBeer() {
      if (this.file == null || !this.$refs.form.validate()) return;

      if (this.beers.find((beer) => beer.name == this.name)) {
        this.$store.commit(
          "snackbar",
          "Wiem, że bardzo je lubisz, ale takie piwo jest już na liście..."
        );
        return;
      }
      this.$store.commit("loading", true);
      const storageRef = fb
        .storage()
        .ref(`beers/${this.user.uid}/${this.file.name}`);
      const uploadTask = storageRef.put(this.file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => console.log(error),
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            db.collection("beers")
              .add({
                name: this.name,
                photoUrl: downloadURL,
                avgAppearanceScore: 0,
                avgSmellScore: 0,
                avgTasteScore: 0,
                avgSensationsScore: 0,
                avgSubjectiveScore: 0,
                avgScore: 0,
              })
              .then(() => {
                this.$store.commit("snackbar", "Na zdrówko!");
                this.$store.commit("loading", false);
                this.$store.dispatch("beers");
                this.resetForm();
              })
              .catch(() => {
                this.$store.commit("snackbar", "Błąd serwera, przepraszamy...");
                this.$store.commit("loading", false);
              });
          });
        }
      );
    },
    editBeer(beer) {
      if (!this.$refs.form.validate()) return;
      this.$store.commit("loading", true);
      if (this.editFile != null) {
        const storageRef = fb
          .storage()
          .ref(`beers/${this.user.uid}/${this.editFile.name}`);
        const uploadTask = storageRef.put(this.editFile);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => console.log(error),
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              db.collection("beers")
                .doc(beer.id)
                .update({ photoUrl: downloadURL })
                .then(() => {
                  this.$store.commit("snackbar", "Edytowano zdjęcię!");
                  this.$store.commit("loading", false);
                  this.$store.dispatch("beers");
                  this.resetForm();
                })
                .catch(() => {
                  this.$store.commit(
                    "snackbar",
                    "Błąd serwera, przepraszamy..."
                  );
                  this.$store.commit("loading", false);
                });
            });
          }
        );
      }

      db.collection("beers")
        .doc(beer.id)
        .update({ name: beer.name })
        .then(() => {
          this.$store.commit("snackbar", "Edytowano nazwę!");
          this.$store.commit("loading", false);
          this.$store.dispatch("beers");
          this.editFile = null;
          this.editFlag = undefined;
        });
    },
  },
};
</script>

<style>
.delete-friend-container button {
  height: unset !important;
  width: unset !important;
}
.beers {
  /*overflow-y: scroll; */
}
</style>
