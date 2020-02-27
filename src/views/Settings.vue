<template>
    <div>
        <Header />
        <section class="py-5" style="min-height:100vh;">
            <div class="container h-100" style="padding: 15vh 0vh 0vh 0vh;">
                <div class="row h-100 align-items-center">
                    <div class="col-12 text-center">
                        <h2 class="font-weight-light">Settings</h2>
                        <br />
                        <p>
                            Update your account's Qualtrics API token and Datacenter ID.
                        </p>
                        <div class="row-3 text-center">
                            <b-form-input
                                v-model="qualtricsToken"
                                style="max-width: 25%;"
                                placeholder="API token"
                            ></b-form-input>
                        </div>
                        <div class="row-3 text-center">
                            <b-form-input
                                v-model="qualtricsDatacenter"
                                style="max-width: 25%;"
                                placeholder="Datacenter ID"
                            ></b-form-input>
                        </div>
                        <br />
                        <div class="row-3 text-center">
                            <b-button @click="update" style="background-color:DarkSeaGreen; max-width: 25%;"
                                >Update</b-button
                            >
                        </div>
                        <br />
                        <p style="text-align: center; color: red;" v-for="error in validateErrors" :key="error">
                            {{ error }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { mapActions, mapState } from "vuex";
import Credentials from "../api/amplifyConf";

export default {
    name: "Verify",
    components: {
        Header,
        Footer
    },
    data() {
        return {
            qualtricsToken: "",
            qualtricsDatacenter: "",
            validateErrors: []
        };
    },
    computed: {
        ...mapState({
            attributes: state => state.users.attributes
        })
    },
    created() {
        this.qualtricsToken = this.attributes["custom:Qualtrics-API-Key"];
        this.qualtricsDatacenter = this.attributes["custom:Data-Center"];
    },
    methods: {
        ...mapActions({
            updateUser: "users/updateUser"
        }),
        validateInput() {
            let valid = true;
            this.validateErrors = [];
            if (this.qualtricsToken === "") {
                this.validateErrors.push("Please enter a Qualtrics API token");
                valid = false;
            }
            if (this.qualtricsDatacenter === "") {
                this.validateErrors.push("Please enter a Qualtrics Datacenter ID");
                valid = false;
            }
            if (/\.$/.test(this.qualtricsDatacenter)) {
                this.validateErrors.push('Datacenter ID cannot end with "."');
                valid = false;
            }
            return valid;
        },
        async update() {
            if (this.validateInput()) {
                await this.updateUser({
                    apiToken: this.qualtricsToken,
                    centerId: this.qualtricsDatacenter
                });
                window.location.assign(Credentials.COGNITO_TOKEN_URL);
            }
        }
    }
};
</script>

<style scoped>
@import "../assets/grayscale.css";
</style>
