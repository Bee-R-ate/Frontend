import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/pages/Home'

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: Home, name: 'Home' }
]

export default new VueRouter({
  routes,
  mode: 'history',
  
})