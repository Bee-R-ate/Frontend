<template>
  <div class="d-flex justify-center room-listing home-container">
    <v-container class="home-content">
      <div class="back-container">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title">Moje pokoje</h2>

      <v-list v-if="rooms.length > 0" class="py-0 mt-3 friend-list">
        <div v-for="(room, i) in myRooms" :key="i">
          <router-link :to="room ? setRoomLink(room) : '/moje-pokoje'">
            <v-list-item
              class="px-0 room-card"
              :class="{ 'room-card--inProgress': progressStatus(room) }"
            >
              <v-list-item-content class="pa-5">
                <div class="ellipsis">
                  <v-list-item-title
                    v-html="room ? room.name : ''"
                  ></v-list-item-title>
                  <v-list-item-subtitle>{{
                    progressTitle(progressStatus(room))
                  }}</v-list-item-subtitle>
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
    </v-container>
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
    progressTitle(progress) {
      console.log(progress);
      if (progress === 1) return "W trakcie";
      if (progress === 2) return "Zakończony";
      return "Nierozpoczęty";
    },
    progressStatus(room) {
      if (room.inProgress) return 1;
      if (!room.inProgress && room.currentBeer !== 0) return 2;
      return 0;
    },
    setRoomLink(room) {
      let segment = "pokoj";
      if (room.inProgress) segment = "rozgrywka";
      if (!room.inProgress && room.currentBeer !== 0) segment = "wyniki";
      return `/${segment}/${room.id}`;
    },

    getRoomsData() {
      this.$store.dispatch("getRoomsData");
    },
  },
  created() {
    this.getRoomsData();
  },
};
</script>

<style>
.room-card {
}

.room-card--inProgress {
}

.ellipsis {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
