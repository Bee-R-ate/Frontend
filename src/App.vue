<template>
  <v-app >
    <router-view class="pa-10 second-bg router-view"></router-view>
    <Snackbar />
  </v-app>
</template>
<script>
  import Snackbar from './components/snackbar/Snackbar';
  import {fb} from '@/firebase/firebase';

  export default {
    name: 'App',
    components: {
      Snackbar
    },
    created() {
      fb.auth().onAuthStateChanged(user => user ? this.$store.commit("user", user) : this.$store.commit("signOut"));
      if(localStorage.getItem('user')) this.$store.commit("user", JSON.parse(localStorage.getItem('user')))
    }
  };
</script>

<style>
  :root {
    --first-color: #FFE046;
    --second-color: #ca9b17;
  }
  .first-color {
    color: var(--first-color);
  }
  .second-bg {
    background-color: var(--second-color);
  }
  .router-view {
    height: 100vh;

  }
</style>