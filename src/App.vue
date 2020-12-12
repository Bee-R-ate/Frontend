<template>
  <v-app >
    <router-view class="pa-10 second-bg router-view"></router-view>
    <Snackbar />
    <v-overlay color="#ca9b17" :value="loading" opacity="1">
      <v-progress-circular width="10" :size="100" color="white" indeterminate ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>
<script>
  import Snackbar from './components/snackbar/Snackbar';
  import {fb, db} from '@/firebase/firebase';

  export default {
    name: 'App',
    components: {
      Snackbar
    },
    computed: {
      loading() {
        return this.$store.getters.loading;
      }
    },
    created() {
      this.$store.commit('loading', true);
      fb.auth().onAuthStateChanged(user => {
        if(user) {
          db.collection('users').where('Email', '==', user.email).limit(1).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.$store.commit('user', {...user, docID: doc.id, ...doc.data()})
              this.$store.commit('loading', false);
              this.$store.dispatch('friends');
            })
          })
        } else {
          this.$store.commit("signOut")
          this.$store.commit('loading', false);
        }
    });
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
  .position-relative {
    position: relative!important;
  }

  .second-bg {
    background-color: var(--second-color)!important;
  }
  .router-view {
    height: 100vh;

  }
</style>