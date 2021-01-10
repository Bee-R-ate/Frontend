<template>
  <v-app>
    <router-view class="pa-10 second-bg router-view"></router-view>
    <Snackbar />
    <v-overlay color="#ca9b17" :value="loading" opacity="1">
      <v-progress-circular
        width="10"
        :size="100"
        color="white"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>
<script>
import Snackbar from "./components/snackbar/Snackbar";

export default {
  name: "App",
  components: {
    Snackbar,
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
  },
  created() {
    this.$store.dispatch("autoLogin");
  },
};
</script>

<style>
:root {
  --first-color: #ffe046;
  --second-color: #ca9b17;
}
.first-color {
  color: var(--first-color);
}
.position-relative {
  position: relative !important;
}

.second-bg {
  background-color: var(--second-color) !important;
}
</style>
