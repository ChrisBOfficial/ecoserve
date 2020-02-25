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
                            <b-button style="background-color:DarkSeaGreen; max-width: 25%;">Register</b-button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </div>
</template>

<script>
import Amplify, { Auth } from "aws-amplify";
/* Amplify.configure({
    Auth: {
        region: process.env.AWS_REGION,
        userPoolId: process.env.COGNITO_POOL_ID,
        userPoolWebClientId: process.env.COGNITO_APP_ID,
        oauth: {
            domain: process.env.COGNITO_DOMAIN,
            scope: ["phone", "email", "profile", "openid", "aws.cognito.signin.user.admin"],
            redirectSignIn: "https://ecoserve-app.com/verify",
            redirectSignOut: "https://ecoserve-app.com",
            responseType: "token"
        }
    }
}); */

export default {
    name: "Verify",
    data() {
        return {
            qualtricsToken: "",
            qualtricsDatacenter: ""
        };
    },
    async mounted() {
        /* let user = await Auth.currentAuthenticatedUser();
        let result = await Auth.updateUserAttributes(user, {
            "custom:Qualtrics-API-Key": process.env.VUE_APP_Q_API_TOKEN,
            "custom:Data-Center": process.env.VUE_APP_Q_DATA_CENTER
        });
        console.log(result); */
    }
};
</script>
