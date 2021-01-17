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
        <div v-for="(room, i) in rooms" :key="i">
          <router-link :to="myRooms[i] ? setRoomLink(room, i) : '/moje-pokoje'">
            <v-list-item class="px-0">
              <v-list-item-content class="pa-5 pb-0">
                <div class="ellipsis">
                  <v-list-item-title
                    v-html="myRooms[i] ? myRooms[i].name : ''"
                  ></v-list-item-title>
                  <v-list-item-subtitle class="room-card__timestamp">
                    <small>
                      {{ myRooms[i] ? returnDate(myRooms[i].createdAt) : "" }}
                    </small>
                  </v-list-item-subtitle>
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
    returnDate(timestamp) {
      const date = timestamp.toDate();
      function prependTime(time) {
        if (time < 10) {
          time = "0" + time.toString();
        }

        return time;
      }
      return (
        prependTime(date.getHours()) +
        ":" +
        prependTime(date.getMinutes()) +
        " " +
        prependTime(date.getDate()) +
        "." +
        prependTime(date.getMonth() + 1) +
        "." +
        date.getFullYear()
      );
    },
    setRoomLink(room, i) {
      let segment = "pokoj";
      if (this.myRooms[i].inProgress) segment = "rozgrywka";
      if (!this.myRooms[i].inProgress && this.myRooms[i].currentBeer != 0)
        segment = "wyniki";
      return `/${segment}/${room}`;
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
.ellipsis {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.room-card__timestamp {
  height: 20px;
  text-align: right;
}
</style>
