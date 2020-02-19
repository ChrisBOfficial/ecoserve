import Vue from "vue";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";

Vue.use(VueRouter);
Vue.use(BootstrapVue);

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("@/views/Home.vue")
    },
    {
        path: "/about",
        name: "about",
        component: () => import("@/views/About.vue")
    },
    {
        path: "/project",
        name: "project",
        component: () => import("@/views/Project.vue")
    },
    {
        path: "/newproject",
        name: "newproject",
        component: () => import("@/views/NewProject.vue")
    },
    {
        path: "/existingproject",
        name: "existingproject",
        component: () => import("@/views/ExistingProject.vue")
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue")
    },
    {
        path: "/workspace",
        name: "workspace",
        component: () => import("@/views/Workspace.vue")
    },
    {
        path: "/contact",
        name: "contact",
        component: () => import("@/views/Contact.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

export default router;
