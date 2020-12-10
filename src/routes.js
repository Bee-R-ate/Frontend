import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/pages/Home'
import Register from '@/components/auth/Register'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Home, name: 'Home' },
	{ path: '/rejestracja', component: Register, name: 'Register' },
]

export default new VueRouter({
  routes,
  mode: 'history',
  
})