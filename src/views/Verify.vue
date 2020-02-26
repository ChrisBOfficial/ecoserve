<template>
    <div>
        <Header />
        <section class="py-5" style="min-height:100vh;">
            <div class="container h-100" style="padding: 15vh 0vh 0vh 0vh;">
                <div class="row h-100 align-items-center">
                    <div class="col-12 text-center">
                        <h2 class="font-weight-light">Almost verified</h2>
                        <br />
                        <p>
                            To finish sign-up, your account needs a Qualtrics API Token, and your Qualtrics Datacenter
                            ID.
                        </p>
                        <div class="row-3 text-center">
                            <b-form-input
                                v-model="qualtricsToken"
                                style="max-width: 25%;"
                                placeholder="API Token"
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
                            <b-button @click="register" style="background-color:DarkSeaGreen; max-width: 25%;"
                                >Register</b-button
                            >
                        </div>
                        <br />
                        <p style="text-align: center; color: red;" v-for="error in validateErrors" :key="error">
                            {{ error }}
                        </p>
                        <br />
                        <h4 class="font-weight-medium">How to find your token</h4>
                        <p>1. Login to Qualtrics</p>
                        <p>2. Go to Account Settings in the user dropdown</p>
                        <img
                            src="../assets/accountSettings.png"
                            height="60%"
                            width="60%"
                            style="margin-bottom: 20px;"
                        />
                        <p>3. Go to Qualtrics IDs</p>
                        <img src="../assets/exampleId.png" height="70%" width="70%" style="margin-bottom: 30px;" />
                        <h4 class="font-weight-medium">How to find your Datacenter</h4>
                        <p>1. Login to your Qualtrics account</p>
                        <p>2. Use the hostname found in the location bar</p>
                        <img src="../assets/exampleDatacenter.png" />
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </div>
</template>

<script>
import { mapActions } from "vuex";
import Credentials from "../api/amplifyConf";

export default {
    name: "Verify",
    data() {
        return {
            qualtricsToken: "",
            qualtricsDatacenter: "",
            validateErrors: []
        };
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
        async register() {
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
