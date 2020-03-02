<template>
    <div id="nav">
        <nav class="navbar navbar-expand-lg navbar-light fixed-top navbar-shrink" id="mainNav">
            <div class="container">
                <router-link class="navbar-brand" to="/"
                    ><img
                        id="homeLink"
                        src="../assets/ecoserve-lower.png"
                        height="100"
                        width="100"
                        title="Home"
                        style="margin:-28px 0px"
                /></router-link>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/about">ABOUT</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/contact">CONTACT</router-link>
                        </li>
                        <li v-if="authorized" class="nav-item">
                            <router-link class="nav-link" to="/projects">PROJECTS</router-link>
                        </li>
                        <li v-if="!authorized" class="nav-item">
                            <a class="nav-link" :href="loginLink">LOGIN</a>
                        </li>
                    </ul>
                    <a v-if="authorized" class="nav-link" href="#" @click="logout">LOGOUT</a>
                    <router-link v-if="authorized" class="nav-link" to="/auth/settings" style="padding: 2px;"
                        ><img
                            src="../assets/settingsGear.png"
                            alt="Settings"
                            title="Settings"
                            style="max-width: 25px; max-height: 25px;"
                    /></router-link>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import Credentials from "../api/amplifyConf";
import { mapState, mapActions } from "vuex";

export default {
    name: "Header",
    data() {
        return {
            loginLink: Credentials.COGNITO_TOKEN_URL
        };
    },
    computed: {
        ...mapState({
            authorized: state => state.users.authorized
        })
    },
    methods: {
        ...mapActions({
            logout: "users/logout"
        })
    }
};
</script>
