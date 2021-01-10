<template>
  <div class="d-flex justify-center text-center create-room home-container">
    <div class="home-content position-relative">
      <div class="back-container" style="top: 0%">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title">Dodaj listę piw!</h2>
      <p class="home-subtitle">Kliknij w piwo, aby dodać je do listy!</p>
      <v-text-field
        color="black"
        label="Znajdź piwo..."
        prepend-icon="mdi-magnify"
        v-model="search"
      ></v-text-field>
      <v-list v-if="beers.length > 0" class="py-0 friend-list">
        <div v-for="(beer, i) in beers" :key="i">
          <div
            @click="addToBeerList(beer)"
            v-if="
              beer.name.toLowerCase().includes(search.toLowerCase()) &&
              beerList.indexOf(beer) == -1
            "
          >
            <v-list-item class="px-0">
              <v-list-item-avatar :size="60" class="ml-3">
                <v-img :src="beer.photoUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="position-relative">
                <div class="pr-3 py-3">
                  <v-list-item-title v-html="beer.name"></v-list-item-title>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i != beers.length - 1"></v-divider>
          </div>
        </div>
      </v-list>
      <div v-else>
        Nie masz w tej chwili piw,
        <router-link to="/piwa">zneutralizuj suszę i dodaj piwa</router-link>.
      </div>

      <div v-if="beerList.length > 0">
        <h2 class="home-title">Wybrane piwa:</h2>
        <v-list class="py-0 mt-3 friend-list">
          <div v-for="(beer, i) in beerList" :key="i">
            <v-list-item class="px-0">
              <v-list-item-avatar :size="60" class="ml-3">
                <v-img :src="beer.photoUrl"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="position-relative">
                <div class="pr-3 py-3">
                  <v-list-item-title v-html="beer.name"></v-list-item-title>
                </div>
                <div class="delete-friend-container">
                  <div>
                    <v-btn
                      small-x
                      class=""
                      @click="deleteFromBeerList(beer)"
                      icon
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i != beers.length - 1"></v-divider>
          </div>
        </v-list>
      </div>

      <h2 v-if="invitedFriends.length != friends.length" class="home-title">
        Zaproś graczy!
      </h2>
      <v-list v-if="friends.length > 0" class="py-0 mt-3 friend-list">
        <div v-for="(friend, i) in friends" :key="i">
          <div
            @click="inviteFriend(friend)"
            v-if="invitedFriends.indexOf(friend) == -1"
          >
            <v-list-item class="px-0">
              <v-list-item-avatar :size="60" class="ml-3">
                <v-img :src="friend.imageURL"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="position-relative">
                <div class="pr-3 py-3">
                  <v-list-item-title v-html="friend.name"></v-list-item-title>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i != friends.length - 1"></v-divider>
          </div>
        </div>
      </v-list>
      <div class="mt-3" v-else>
        Nie masz w tej chwili znajomych.
        <router-link to="/znajomi">Kliknij, aby się uspołecznić.</router-link>
      </div>

      <div v-if="invitedFriends.length > 0">
        <h2 class="home-title">Lista zaproszonych graczy</h2>
        <v-list class="py-0 mt-3 friend-list">
          <div v-for="(friend, i) in invitedFriends" :key="i">
            <v-list-item class="px-0">
              <v-list-item-avatar :size="60" class="ml-3">
                <v-img :src="friend.imageURL"></v-img>
              </v-list-item-avatar>

              <v-list-item-content class="position-relative">
                <div class="pr-3 py-3">
                  <v-list-item-title v-html="friend.name"></v-list-item-title>
                </div>
                <div class="delete-friend-container">
                  <div>
                    <v-btn
                      small-x
                      class=""
                      @click="deleteFromInvitedFriends(friend)"
                      icon
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i != invitedFriends.length - 1"></v-divider>
          </div>
        </v-list>
      </div>

      <v-text-field
        v-model="name"
        class="mt-5"
        color="black"
        label="Wpisz nazwę pokoju"
      ></v-text-field>

      <v-btn
        class="mt-12"
        :disabled="beerList.length == 0 || invitedFriends.length == 0 || !name"
        color="secondary"
        @click="createRoom"
        >Utwórz pokój</v-btn
      >
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebase";

export default {
  data() {
    return {
      beerList: [],
      search: "",
      invitedFriends: [],
      name: "",
    };
  },
  computed: {
    beers() {
      return this.$store.getters.beers;
    },
    friends() {
      return this.$store.getters.friends;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    deleteFromBeerList(beer) {
      this.beerList.splice(this.beerList.indexOf(beer), 1);
    },
    deleteFromInvitedFriends(friend) {
      this.invitedFriends.splice(this.invitedFriends.indexOf(friend), 1);
    },
    addToBeerList(beer) {
      this.beerList.push(beer);
    },
    inviteFriend(friend) {
      this.invitedFriends.push(friend);
    },
    saveMyRooms(roomID) {
      let friends = this.invitedFriends;
      friends.push({ id: this.user.docID });
      for (let friend of friends) {
        db.collection("users")
          .doc(friend.id)
          .get()
          .then((doc) => {
            let myRooms = doc.data().myRooms;
            myRooms.push(roomID);
            db.collection("users").doc(friend.id).update({ myRooms });
          });
      }
    },
    createRoom() {
      this.$store.commit("loading", true);
      let beerList = [];
      this.beerList.forEach((beer, i) => {
        beerList.push({
          beerID: beer.id,
          avgAppearanceScore: 0,
          avgSmellScore: 0,
          avgTasteScore: 0,
          avgSensationsScore: 0,
          avgSubjectiveScore: 0,
          avgScore: 0,
          userScores: [],
        });
        this.invitedFriends.forEach((friend) => {
          beerList[i].userScores.push({
            userID: friend.id,
            appearanceScore: 0,
            smellScore: 0,
            tasteScore: 0,
            sensationsScore: 0,
            subjectiveScore: 0,
            avgScore: 0,
          });
        });
        beerList[i].userScores.push({
          userID: this.user.docID,
          appearanceScore: 0,
          smellScore: 0,
          tasteScore: 0,
          sensationsScore: 0,
          subjectiveScore: 0,
          avgScore: 0,
        });
      });

      let participants = [];
      this.invitedFriends.forEach((friend) => {
        participants.push({
          userID: friend.id,
          isEliminated: false,
          isReady: false,
          avgScores: {
            appearance: 0,
            smell: 0,
            taste: 0,
            sensations: 0,
            subjective: 0,
            overall: 0,
          },
        });
      });
      participants.push({
        userID: this.user.docID,
        isEliminated: false,
        isReady: false,
        avgScores: {
          appearance: 0,
          smell: 0,
          taste: 0,
          sensations: 0,
          subjective: 0,
          overall: 0,
        },
      });

      db.collection("rooms")
        .add({
          modID: this.user.docID,
          beerList,
          participants,
          inProgress: false,
          name: this.name,
          currentBeer: 0,
        })
        .then((doc) => {
          this.$store.commit("loading", false);
          this.$store.commit("snackbar", "Pomyślnie utworzono pokój!");
          this.saveMyRooms(doc.id);
          this.$router.push(`/pokoj/${doc.id}`);
        })
        .catch(() => {
          this.$store.commit("loading", false);
          this.$store.commit("snackbar", "Przepraszamy, błąd serwera...");
        });
    },
  },
};
</script>

<style>
.create-room {
  /*overflow-y: scroll;*/
}

.create-room .home-title {
  margin-top: 2rem !important;
}

a {
  color: white !important;
}
</style>
