import Vue from "vue";
import VueRouter from "vue-router";
import { Auth } from "aws-amplify";
import Credentials from "../api/amplifyConf";

Vue.use(VueRouter);

let prefix;
if (process.env.NODE_ENV === "development") {
    prefix = "[DEV] ";
} else {
    prefix = "";
}

const routes = [
    {
        path: "/",
        name: "home",
        meta: {
            title: prefix + "ecoserve"
        },
        component: () => import("@/views/Home.vue")
    },
    {
        path: "/about",
        name: "about",
        meta: {
            title: prefix + "ecoserve - About"
        },
        component: () => import("@/views/About.vue")
    },
    {
        path: "/contact",
        name: "contact",
        meta: {
            title: prefix + "ecoserve - Contact"
        },
        component: () => import("@/views/Contact.vue")
    },
    {
        path: "/guidelines",
        name: "guidelines",
        meta: {
            title: prefix + "ecoserve - Guidelines"
        },
        component: () => import("@/views/Guidelines.vue")
    },
    {
        path: "/security",
        name: "security",
        meta: {
            title: prefix + "ecoserve - Security"
        },
        component: () => import("@/views/Security.vue")
    },
    {
        path: "/projects",
        name: "projects",
        meta: {
            title: prefix + "ecoserve - Projects",
            requiresAuth: true
        },
        component: () => import("@/views/Projects.vue")
    },
    {
        path: "/newProject",
        name: "newProject",
        meta: {
            title: prefix + "ecoserve - Create Project",
            requiresAuth: true
        },
        component: () => import("@/views/NewProject.vue")
    },
    {
        path: "/editProject",
        name: "editProject",
        meta: {
            title: prefix + "ecoserve - Edit Project",
            requiresAuth: true
        },
        component: () => import("@/views/ExistingProject.vue")
    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: {
            title: prefix + "ecoserve - Dashboard",
            requiresAuth: true
        },
        component: () => import("@/views/Dashboard.vue")
    },
    {
        path: "/auth/verify",
        name: "verify",
        meta: {
            title: prefix + "Account verification"
        },
        component: () => import("@/views/Verify.vue")
    },
    {
        path: "/auth/settings",
        name: "settings",
        meta: {
            title: prefix + "ecoserve - Settings",
            requiresAuth: true
        },
        component: () => import("@/views/Settings.vue")
    },
    {
        path: "*",
        name: "notFound",
        meta: {
            title: prefix + "Page not found"
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
