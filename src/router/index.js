import Vue from 'vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import About from '@/views/About.vue'

Vue.use(VueRouter)
Vue.use(BootstrapVue)

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
  },
  {
    path: '/newproject',
    name: 'newproject',
    component: () => import('@/views/NewProject.vue')
  },
  {
    path: '/existingproject',
    name: 'existingproject',
    component: () => import('@/views/ExistingProject.vue')
  },
  {
    path: '/visualizationpage',
    name: 'visualizationpage',
    component: () => import('@/views/VisualizationPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
