import Vue from "vue";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";
import { Auth } from "aws-amplify";
import User from "../store/modules/users";
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
        path: "/contact",
        name: "contact",
        component: () => import("@/views/Contact.vue")
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
                if (User.state.authorized || process.env.NODE_ENV === "development") {
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
