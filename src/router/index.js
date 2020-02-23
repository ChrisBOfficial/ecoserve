import Vue from "vue";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";

Vue.use(VueRouter);
Vue.use(BootstrapVue);

const routes = [
    {
        path: "/",
        name: "home",
        meta: {
            title: "ecoserve"
        },
        component: () => import("@/views/Home.vue")
    },
    {
        path: "/about",
        name: "about",
        meta: {
            title: "ecoserve - About"
        },
        component: () => import("@/views/About.vue")
    },
    {
        path: "/projects",
        name: "projects",
        meta: {
            title: "ecoserve - Projects"
        },
        component: () => import("@/views/Projects.vue")
    },
    {
        path: "/newProject",
        name: "newProject",
        meta: {
            title: "ecoserve - Create Project"
        },
        component: () => import("@/views/NewProject.vue")
    },
    {
        path: "/editProject",
        name: "editProject",
        meta: {
            title: "ecoserve - Edit Project"
        },
        component: () => import("@/views/ExistingProject.vue")
    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: {
            title: "ecoserve - Dashboard"
        },
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

router.beforeEach((to, _, next) => {
    document.title = to.meta.title;
    next();
});

export default router;
