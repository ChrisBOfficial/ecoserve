<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { mapActions } from "vuex";
import store from "./store";

export default {
    store,
    async created() {
        // Sleep to let Amplify add user to localStorage
        await new Promise(r => setTimeout(r, 500));

        // Check if session is signed in
        this.fetchUser()
            .then(attributes => {
                if (
                    Object.prototype.hasOwnProperty.call(attributes, "custom:Qualtrics-API-Key") &&
                    Object.prototype.hasOwnProperty.call(attributes, "custom:Data-Center")
                ) {
                    // If signed in and Qualtrics credentials exist, set axios headers
                    window.axios.defaults.headers["x-api-token"] = attributes["custom:Qualtrics-API-Key"];
                    window.axios.defaults.headers["q-data-center"] = attributes["custom:Data-Center"];
                    if (window.location.href.includes("/auth/verify")) {
                        // If Qualtrics credentials exist and on verify page, redirect
                        this.$router.push("/");
                    }
                } else {
                    // If signed in and Qualtrics credentials don't exist, redirect to verify page
                    this.$router.push("/auth/verify");
                }
            })
            .catch(err => {
                console.error(err);
            });
    },
    methods: {
        ...mapActions({
            fetchUser: "users/fetchUser"
        })
    }
};
</script>

<style scoped>
@import "./assets/style.css";
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css";
@import "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap";
@import "https://fonts.googleapis.com/css?family=Varela+Round&display=swap";
</style>
