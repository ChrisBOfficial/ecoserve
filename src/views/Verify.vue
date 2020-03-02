<template>
    <div>
        <section class="py-5" style="min-height:100vh;">
            <div class="container h-100" style="padding: 15vh 0vh 0vh 0vh;">
                <div class="row h-100 align-items-center">
                    <div v-if="verifyFurther" class="col-12 text-center">
                        <h2 class="font-weight-light" style="margin-bottom: 35px;">Verifying</h2>
                        <p>
                            To finish sign-up, your account needs a Qualtrics API token, and your Qualtrics Datacenter
                            ID.
                        </p>
                        <div class="row-3 text-center">
                            <b-form-input
                                v-model="qualtricsToken"
                                style="max-width: 25%;"
                                placeholder="API token"
                            ></b-form-input>
                        </div>
                        <div class="row-3 text-center" style="margin-bottom: 25px;">
                            <b-form-input
                                v-model="qualtricsDatacenter"
                                style="max-width: 25%;"
                                placeholder="Datacenter ID"
                            ></b-form-input>
                        </div>
                        <div class="row-3 text-center" style="margin: 10px 0px;">
                            <b-button @click="register" style="background-color:DarkSeaGreen; max-width: 25%;"
                                >Register</b-button
                            >
                        </div>

                        <div v-if="invalid" style="margin: 10px 0px;">
                            <p
                                v-for="error in validateErrors"
                                style="text-align: center; color: red; margin: 20px 0px;"
                                :key="error"
                            >
                                {{ error }}
                            </p>
                        </div>

                        <div class="row-3 text-center">
                            <a href="javascript:void(0);" @click="instScroll('token')">How to find your token</a>
                        </div>
                        <div class="row-3 text-center">
                            <a href="javascript:void(0);" @click="instScroll('dcenter')">How to find your Datacenter</a>
                        </div>

                        <h4 class="font-weight-medium" id="token" style="margin-top: 20rem;">
                            How to find your token
                        </h4>
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
                        <br />
                        <img
                            id="anchor"
                            src="../assets/scrollUp.jpeg"
                            alt="Scroll to top"
                            @click="instScroll('anchor')"
                            height="3%"
                            width="3%"
                        />

                        <h4 class="font-weight-medium" id="dcenter" style="margin-top: 15rem;">
                            How to find your Datacenter
                        </h4>
                        <p>1. Login to your Qualtrics account</p>
                        <p>2. Use the hostname found in the location bar</p>
                        <img src="../assets/exampleDatacenter.png" style="margin-bottom: 15rem;" />
                        <br />
                        <img
                            id="anchor"
                            src="../assets/scrollUp.jpeg"
                            alt="Scroll to top"
                            @click="instScroll('anchor')"
                            height="3%"
                            width="3%"
                        />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { Auth } from "aws-amplify";
import Credentials from "../api/amplifyConf";

export default {
    name: "Verify",
    data() {
        return {
            qualtricsToken: "",
            qualtricsDatacenter: "",
            validateErrors: [],
            verifyFurther: false
        };
    },
    computed: {
        invalid: function() {
            return this.validateErrors.length > 0;
        }
    },
    created() {
        window.scrollTo(0, 0);
        if (process.env.NODE_ENV === "production") {
            Auth.currentAuthenticatedUser().then(current => {
                const { attributes } = current;
                if (
                    Object.prototype.hasOwnProperty.call(attributes, "custom:Qualtrics-API-Key") &&
                    Object.prototype.hasOwnProperty.call(attributes, "custom:Data-Center")
                ) {
                    this.verifyFurther = false;
                } else {
                    this.verifyFurther = true;
                }
            });
        } else {
            this.verifyFurther = true;
        }
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
        },
        instScroll(group) {
            let element;
            if (group === "anchor") {
                element = document.documentElement;
            } else {
                element = document.getElementById(group);
            }
            element.scrollIntoView({ behavior: "smooth" });
        }
    }
};
</script>

<style scoped>
#anchor:hover {
    opacity: 0.5;
    cursor: pointer;
}
</style>
