<template>
  <div class="d-flex justify-center home-container">
    <div class="home-content position-relative friends">
      <div class="back-container">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title mt-2">Moi znajomi</h2>
      <v-text-field
        class="pa-3 pb-1 mt-0 friends-search"
        color="black"
        label="Wpisz email"
        prepend-icon="mdi-magnify"
        v-model="search"
      ></v-text-field>
      <v-btn
        style="width: 100%"
        @click="addFriend"
        class="mt-2 mb-3"
        color="secondary"
        >Dodaj znajomych!
      </v-btn>

      <v-list v-if="friends.length > 0" class="py-0 friend-list">
        <div v-for="(friend, i) in friends" :key="i">
          <v-list-item class="px-0">
            <v-list-item-avatar :size="60" class="ml-3">
              <v-img :src="friend.imageURL"></v-img>
            </v-list-item-avatar>

            <v-list-item-content class="position-relative">
              <div class="pr-3 py-3">
                <v-list-item-title v-html="friend.name"></v-list-item-title>
                <v-list-item-subtitle
                  v-html="friend.email"
                ></v-list-item-subtitle>
              </div>
              <div class="delete-friend-container">
                <v-btn class="" @click="deleteFriend(friend)" icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="i != friends.length - 1"></v-divider>
        </div>
      </v-list>
      <div v-else>Nie masz w tej chwili znajomych, trochę smutek.</div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebase";

export default {
  data() {
    return {
      search: "",
      select: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    friends() {
      return this.$store.getters.friends;
    },
  },
  methods: {
    itemText: (item) => item.Email,
    addFriend() {
      if (
        this.search.toLowerCase() ==
        this.$store.getters.user.email.toLowerCase()
      ) {
        this.$store.commit(
          "snackbar",
          "Myślałem, że brak znajomych to smutek, ale zapraszanie samego siebie... ;)"
        );
        return;
      }
      this.$store.commit("loading", true);
      db.collection("users")
        .where("email", "==", this.search.toLowerCase())
        .limit(1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (!this.user.friends.includes(doc.id)) {
              this.user.friends.push(doc.id);
              db.collection("users")
                .doc(this.user.uid)
                .update({ friends: this.user.friends })
                .then(() => {
                  this.$store.commit("snackbar", "To teraz piwko!");
                  this.$store.commit("loading", false);
                  this.search = "";
                });
              let friends = doc.data().friends;
              friends.push(this.user.uid);
              db.collection("users").doc(doc.id).update({ friends: friends });
              this.$store.dispatch("friends");
            } else {
              this.$store.commit("loading", false);
              this.$store.commit(
                "snackbar",
                "Już masz tego znajomego. Dodanie go drugi raz nie sprawi, że będzie Cię lubił bardziej..."
              );
            }
          });
        });
    },
    async deleteFriend(friend) {
      if (!confirm(`Czy na pewno chcesz usunąć kolegę ${friend.name}?`)) return;
      await db
        .collection("users")
        .doc(friend.id)
        .onSnapshot((doc) => {
          let friendFriends = doc.data().friends;
          friendFriends.splice(friendFriends.indexOf(this.user.uid), 1);
          db.collection("users")
            .doc(friend.id)
            .update({ friends: friendFriends });
        });

      let myFriends = this.user.friends;
      myFriends.splice(myFriends.indexOf(friend.id), 1);

      await db
        .collection("users")
        .doc(this.user.uid)
        .update({ friends: myFriends })
        .then(() => {
          this.$store.commit("snackbar", "Przykro, że się nie dogadaliście...");
          this.$store.dispatch("friends");
        });
    },
  },
};
</script>

<style>
.friends.home-content {
  max-width: 100%;
  min-width: 50%;
}
.friends-search .v-text-field__details {
  display: none !important;
}

.delete-friend-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.friend-list {
  min-width: 50%;
}
</style>
