const DEV_API_TOKEN = process.env.VUE_APP_DEV_API_TOKEN;
const DEV_DATA_CENTER = process.env.VUE_APP_DEV_DATA_CENTER;
let COGNITO_TOKEN_URL;
let signInRedirect;
let signOutRedirect;
if (process.env.NODE_ENV === "production") {
    COGNITO_TOKEN_URL = process.env.VUE_APP_COGNITO_TOKEN_URL;
    signInRedirect = "https://ecoserve-app.com/auth/verify";
    signOutRedirect = "https://ecoserve-app.com/";
} else if (process.env.NODE_ENV === "development") {
    COGNITO_TOKEN_URL = process.env.VUE_APP_COGNITO_DEV_URL;
    signInRedirect = "http://localhost:8080/auth/verify";
    signOutRedirect = "http://localhost:8080/";
}

const config = {
    region: process.env.VUE_APP_AWS_REGION,
    userPoolId: process.env.VUE_APP_COGNITO_POOL_ID,
    userPoolWebClientId: process.env.VUE_APP_COGNITO_APP_ID,
    oauth: {
        domain: process.env.VUE_APP_COGNITO_DOMAIN,
        scope: ["email", "openid", "aws.cognito.signin.user.admin"],
        redirectSignIn: signInRedirect,
        redirectSignOut: signOutRedirect,
        responseType: "code"
    }
};

export default {
    namespaced: true,
    DEV_API_TOKEN,
    DEV_DATA_CENTER,
    COGNITO_TOKEN_URL,
    config
};
