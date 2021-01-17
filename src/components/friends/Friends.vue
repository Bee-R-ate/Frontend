<template>
  <div class="d-flex justify-center home-container">
    <div class="home-content position-relative friends">
      <div class="back-container">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title mt-2">Moi znajomi</h2>
      <v-form v-model="valid" ref="form" @submit.prevent="addFriend">
        <v-text-field
          class="pa-3 pb-1 mt-0 friends-search"
          color="black"
          label="Wpisz email"
          prepend-icon="mdi-magnify"
          v-model="search"
          :rules="[rules.email]"
        ></v-text-field>
        <v-btn
          type="submit"
          style="width: 100%"
          class="mt-2 mb-3"
          color="secondary"
          :disabled="!valid"
          >Dodaj znajomych!
        </v-btn>
      </v-form>

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
import rules from "@/helpers/validation/rules";

export default {
  data() {
    return {
      search: "",
      select: "",
      valid: true,
      rules,
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
      this.$store.dispatch("addFriend", this.search);
    },
    deleteFriend(friend) {
      console.log("delete friend");
      this.$store.dispatch("deleteFriend", friend);
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
