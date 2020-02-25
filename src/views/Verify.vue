<template>
    <div>
        <header class="masthead">
            <div class="container d-flex h-100 align-items-center">
                <div class="mx-auto text-center"></div>
            </div>
        </header>
    </div>
</template>

<script>
import Amplify, { Auth } from "aws-amplify";
Amplify.configure({
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
});

export default {
    name: "Verify",
    async mounted() {
        let user = await Auth.currentAuthenticatedUser();
        let result = await Auth.updateUserAttributes(user, {
            "custom:Qualtrics-API-Key": process.env.VUE_APP_Q_API_TOKEN,
            "custom:Data-Center": process.env.VUE_APP_Q_DATA_CENTER
        });
        console.log(result);
    }
};
</script>
