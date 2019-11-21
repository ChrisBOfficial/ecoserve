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
    path: '/csv',
    name: 'csv',
    component: () => import('@/views/CSVupload.vue')
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('@/views/Workspace.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
