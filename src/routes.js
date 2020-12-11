import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/pages/Home'
import Register from '@/components/auth/Register'
import Login from '@/components/auth/Login'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Home, name: 'Home' },
	{ path: '/rejestracja', component: Register, name: 'Register' },
	{ path: '/logowanie', component: Login, name: 'Login' },
]

export default new VueRouter({
  routes,
  mode: 'history',
  
})