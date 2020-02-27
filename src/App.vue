<template>
    <div id="app">
        <!-- Dynamically loaded views -->
        <router-view v-if="secure" />
        <p v-else>Connection is not secure, please use https://ecoserve-app.com</p>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import store from "./store";

export default {
    store,
    data() {
        return {
            secure: window.location.protocol === "https:" || process.env.NODE_ENV === "development" ? true : false
        };
    },
    computed: {
        ...mapState({
            attributes: state => state.users.attributes
        })
    },
    async created() {
        this.fetchUser()
            .then(() => {
                if (
                    Object.prototype.hasOwnProperty.call(this.attributes, "custom:Qualtrics-API-Key") &&
                    Object.prototype.hasOwnProperty.call(this.attributes, "custom:Data-Center")
                ) {
                    window.axios.defaults.headers["x-api-token"] = this.attributes["custom:Qualtrics-API-Key"];
                    window.axios.defaults.headers["q-data-center"] = this.attributes["custom:Data-Center"];
                    if (window.location.href.includes("/auth/verify")) {
                        this.$router.push("/");
                    }
                } else {
                    this.$router.push("/auth/verify");
                }
            })
            .catch(() => {
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
