import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/pages/Home'
import Register from '@/components/auth/Register'
import Login from '@/components/auth/Login'
import CreateRoom from '@/components/room/CreateRoom'
import Room from '@/components/room/Room'
import RoomListing from '@/components/room/RoomListing'
import Game from '@/components/room/Game'
import Friends from '@/components/friends/Friends'
import Profile from '@/components/profile/Profile.vue'
import BeerList from '@/components/beerlist/BeerList.vue'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Home, name: 'Home' },
	{ path: '/rejestracja', component: Register, name: 'Register' },
	{ path: '/logowanie', component: Login, name: 'Login' },
	{ path: '/tworzenie-pokoju', component: CreateRoom, name: 'CreateRoom' },
	{ path: '/znajomi', component: Friends, name: 'Friends' },
	{ path: '/profil', component: Profile, name: 'Profile' },
	{ path: '/piwa', component: BeerList, name: 'BeerList' },
	{ path: '/rozgrywka/:id', component: Game, name: 'Game' },
	{ path: '/pokoj/:id', component: Room, name: 'Room' },
	{ path: '/moje-pokoje', component: RoomListing, name: 'RoomListing' },
]

export default new VueRouter({
  routes,
  mode: 'history',
  
})