<template>
    <div id="app">
        <!-- Dynamically loaded views -->
        <router-view />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import store from "./store";

export default {
    store,
    computed: {
        ...mapState({
            attributes: state => state.users.attributes
        })
    },
    async created() {
        // Check if session is signed in
        this.fetchUser()
            .then(() => {
                if (
                    Object.prototype.hasOwnProperty.call(this.attributes, "custom:Qualtrics-API-Key") &&
                    Object.prototype.hasOwnProperty.call(this.attributes, "custom:Data-Center")
                ) {
                    // If signed in and Qualtrics credentials exist, set axios headers
                    window.axios.defaults.headers["x-api-token"] = this.attributes["custom:Qualtrics-API-Key"];
                    window.axios.defaults.headers["q-data-center"] = this.attributes["custom:Data-Center"];
                    if (window.location.href.includes("/auth/verify")) {
                        // If Qualtrics credentials exist, redirect to home from verify page
                        this.$router.push("/");
                    }
                } else {
                    // If signed in and Qualtrics credentials don't exist, redirect to verify page
                    this.$router.push("/auth/verify");
                }
            })
            .catch(() => {
                // If not signed in, redirect to home
                this.$router.push("/");
            });
    },
    methods: {
        ...mapActions({
            fetchUser: "users/fetchUser"
        })
    }
};
</script>

<!--CSS Styling-->
<style scoped>
@import "./assets/style.css";
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css";
@import "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i";
@import "https://fonts.googleapis.com/css?family=Varela+Round";
</style>
