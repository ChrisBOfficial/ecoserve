<template>
    <div id="nav">
        <b-navbar toggleable="lg" type="light" fixed="top" style="background-color: white;">
            <div class="container">
                <b-navbar-brand to="/">
                    <img
                        id="homeLink"
                        src="../assets/ecoserve-lower.png"
                        height="100"
                        width="100"
                        title="Home"
                        style="margin:-28px 0px"
                    />
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item to="/about" style="margin: auto 2vh;">
                            ABOUT
                        </b-nav-item>
                        <b-nav-item-dropdown text="SUPPORT" style="margin: auto 2vh;">
                            <b-dropdown-item href="https://www.guidetoes.eu/step3.html" target="_blank"
                                >About ecosystem service assessments</b-dropdown-item
                            >
                            <b-dropdown-item to="/guidelines">User guide</b-dropdown-item>
                            <b-dropdown-item>Project examples (coming soon)</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item v-if="authorized" to="/projects" style="margin: auto 2vh;">
                            PROJECTS
                        </b-nav-item>
                        <b-nav-item v-if="!authorized" :href="loginLink" style="margin: auto 2vh;">
                            LOGIN
                        </b-nav-item>
                        <b-nav-item v-if="authorized" href="#" @click="logout" style="margin: auto 1vh auto 2vh;">
                            LOGOUT
                        </b-nav-item>
                        <b-nav-item
                            v-if="authorized"
                            to="/auth/settings"
                            style="padding: 2px; margin: auto 0 3px 1.5vh;"
                        >
                            <img
                                src="../assets/settingsGear.png"
                                alt="Settings"
                                title="Settings"
                                style="max-width: 25px; max-height: 25px;"
                            />
                        </b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </div>
        </b-navbar>
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

<style scoped>
.navbar {
    box-shadow: 0 0.1875rem 0.1875rem 0 rgba(0, 0, 0, 0.1);
}

.navbar-toggler {
    margin-top: auto 0;
    max-width: 17%;
}

@media (max-width: 991px) {
    .navbar-nav {
        margin-top: 5vh;
        border: solid black;
    }
}

::v-deep .navbar-light .navbar-nav .nav-link {
    color: black;
}

::v-deep .dropdown-item:active {
    background-color: darkseagreen;
}

::v-deep .nav-item.dropdown.show > a > span,
::v-deep li.nav-item:hover > a > span,
li.nav-item:hover > a {
    opacity: 0.45;
}

::v-deep .dropdown-menu:hover {
    opacity: 1;
}
</style>
