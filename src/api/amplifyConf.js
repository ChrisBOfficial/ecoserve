const DEV_API_TOKEN = process.env.VUE_APP_DEV_API_TOKEN;
const DEV_DATA_CENTER = process.env.VUE_APP_DEV_DATA_CENTER;
const COGNITO_TOKEN_URL = process.env.VUE_APP_COGNITO_TOKEN_URL;

const config = {
    region: process.env.VUE_APP_AWS_REGION,
    userPoolId: process.env.VUE_APP_COGNITO_POOL_ID,
    userPoolWebClientId: process.env.VUE_APP_COGNITO_APP_ID,
    oauth: {
        domain: process.env.VUE_APP_COGNITO_DOMAIN,
        scope: ["email", "openid", "aws.cognito.signin.user.admin"],
        redirectSignIn: "https://ecoserve-app.com/auth/verify",
        redirectSignOut: "https://ecoserve-app.com/",
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
