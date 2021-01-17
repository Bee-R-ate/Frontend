<template>
  <div class="d-flex justify-center room-listing home-container">
    <v-container class="home-content">
      <div class="back-container">
        <v-btn link to="/" icon>
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
      <h2 class="home-title">Moje pokoje</h2>

      <v-container v-if="rooms.length > 0" class="py-0 mt-3 friend-list">
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="(room, i) in myRooms" :key="i">
            <router-link :to="room ? setRoomLink(room) : '/moje-pokoje'">
              <v-list-item
                class="px-0 room-card"
                :class="{ 'room-card--inProgress': progressStatus(room) }"
              >
                <v-list-item-content class="pa-5 pb-0">
                  <div class="room-card">
                    <v-list-item-avatar :size="100" class="ml-3">
                      <v-img
                        v-if="room.mod.imageURL != null"
                        :src="room.mod.imageURL"
                      ></v-img>
                      <v-avatar
                        v-else
                        class="friend-avatar-placeholder"
                        size="60"
                      >
                        {{ generateAvatarPlaceholder(room.mod) }}
                      </v-avatar>
                    </v-list-item-avatar>
                    <div class="ellipsis">
                      <v-list-item-title
                        v-html="room ? room.name : ''"
                      ></v-list-item-title>
                      <v-list-item-subtitle>
                        {{ progressTitle(progressStatus(room)) }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="room-card__timestamp">
                        <small>
                          {{
                            myRooms[i] ? returnDate(myRooms[i].createdAt) : ""
                          }}
                        </small>
                      </v-list-item-subtitle>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
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
    progressTitle(progress) {
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
      if (room.inProgress && room.currentBeer !== 0) segment = "wyniki";
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
  background-color: white;
}

.room-card--inProgress {
}

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
