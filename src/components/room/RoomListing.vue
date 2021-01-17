<template>
  <div class="d-flex justify-center room-listing home-container">
    <div class="home-content">
      <div class="back-container">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title">Moje pokoje</h2>

      <v-list v-if="rooms.length > 0" class="py-0 mt-3 friend-list">
        <div v-for="(room, i) in rooms" :key="i">
          <router-link :to="myRooms[i] ? setRoomLink(room, i) : '/moje-pokoje'">
            <v-list-item class="px-0">
              <v-list-item-content class="pa-5">
                <div class="">
                  <v-list-item-title
                    v-html="myRooms[i] ? myRooms[i].name : ''"
                  ></v-list-item-title>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i !== rooms.length - 1"></v-divider>
          </router-link>
        </div>
      </v-list>
      <div class="mt-3" v-else>
        Nie masz w tej chwili pokojów. <br /><router-link to="/tworzenie-pokoju"
          >Kliknij, aby stworzyć pokój!</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    rooms() {
      this.getRoomsData();
    },
  },
  computed: {
    rooms() {
      return this.$store.getters.user.myRooms;
    },
    myRooms() {
      return this.$store.getters.myRooms;
    },
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    setRoomLink(room, i) {
      let segment = "pokoj";
      if (this.myRooms[i].inProgress) segment = "rozgrywka";
      if (!this.myRooms[i].inProgress && this.myRooms[i].currentBeer != 0)
        segment = "wyniki";
      return `/${segment}/${room}`;
    },

    getRoomsData() {
      this.$store.dispatch("getRoomsData");

      // console.log("getRoomsData");
      //
      // if (this.rooms.length > 0) {
      //   let rooms = [];
      //   let promises = [];
      //
      //   this.rooms.forEach(async (room) => {
      //     let promise = db
      //       .collection("rooms")
      //       .doc(room)
      //       .get()
      //       .then((doc) => {
      //         return doc.data();
      //       });
      //     promises.push(promise);
      //   });
      //
      //   Promise.all(promises).then((beers) => {
      //     rooms.push(...beers);
      //   });
      //
      //   this.roomsData = rooms;
      // }
    },
  },
  created() {
    this.getRoomsData();
  },
};
</script>

<style></style>
