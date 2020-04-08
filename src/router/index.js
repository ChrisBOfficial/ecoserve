import Vue from "vue";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";
import { Auth } from "aws-amplify";
import Credentials from "../api/amplifyConf";

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
        path: "/contact",
        name: "contact",
        meta: {
            title: "ecoserve - Contact"
        },
        component: () => import("@/views/Contact.vue")
    },
    {
        path: "/guidelines",
        name: "guidelines",
        meta: {
            title: "ecoserve - Guidelines"
        },
        component: () => import("@/views/Guidelines.vue")
    },
    {
        path: "/security",
        name: "security",
        meta: {
            title: "ecoserve - Security"
        },
        component: () => import("@/views/Security.vue")
    },
    {
        path: "/projects",
        name: "projects",
        meta: {
            title: "ecoserve - Projects",
            requiresAuth: true
        },
        component: () => import("@/views/Projects.vue")
    },
    {
        path: "/newProject",
        name: "newProject",
        meta: {
            title: "ecoserve - Create Project",
            requiresAuth: true
        },
        component: () => import("@/views/NewProject.vue")
    },
    {
        path: "/editProject",
        name: "editProject",
        meta: {
            title: "ecoserve - Edit Project",
            requiresAuth: true
        },
        component: () => import("@/views/ExistingProject.vue")
    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: {
            title: "ecoserve - Dashboard",
            requiresAuth: true
        },
        component: () => import("@/views/Dashboard.vue")
    },
    {
        path: "/auth/verify",
        name: "verify",
        meta: {
            title: "Account verification"
        },
        component: () => import("@/views/Verify.vue")
    },
    {
        path: "/auth/settings",
        name: "settings",
        meta: {
            title: "ecoserve - Settings",
            requiresAuth: true
        },
        component: () => import("@/views/Settings.vue")
    },
    {
        path: "*",
        name: "notFound",
        meta: {
            title: "Page not found"
        },
        component: () => import("@/views/404.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach((to, _, next) => {
    if (to.meta.requiresAuth) {
        Auth.currentAuthenticatedUser()
            .then(() => {
                // If user is signed in, continue
                document.title = to.meta.title;
                next();
            })
            .catch(() => {
                if (process.env.NODE_ENV === "development" || (to.name === "dashboard" && to.query.view === "static")) {
                    document.title = to.meta.title;
                    next();
                } else {
                    // If not signed in, stop and redirect to sign-in page
                    next(false);
                    window.location.assign(Credentials.COGNITO_TOKEN_URL);
                }
            });
    } else {
        // Continue if page doesn't require auth
        document.title = to.meta.title;
        next();
    }
});

export default router;
