import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/pages/Home'
import Register from '@/components/auth/Register'
import Login from '@/components/auth/Login'
import CreateRoom from '@/components/room/CreateRoom'
import Friends from '@/components/friends/Friends'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Home, name: 'Home' },
	{ path: '/rejestracja', component: Register, name: 'Register' },
	{ path: '/logowanie', component: Login, name: 'Login' },
	{ path: '/tworzenie-pokoju', component: CreateRoom, name: 'CreateRoom' },
	{ path: '/znajomi', component: Friends, name: 'Friends' },
]

export default new VueRouter({
  routes,
  mode: 'history',
  
})