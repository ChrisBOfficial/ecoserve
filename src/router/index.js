import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '@/views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'about',
    component: About
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/Contact.vue')
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('@/views/Project.vue')
  },
  {
    path:'/sandbox',
    name: 'sandbox',
    component: () => import('@/views/Sandbox.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
