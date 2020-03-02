import Amplify, { Auth } from "aws-amplify";
import Credentials from "../../api/amplifyConf";
Amplify.configure({
    Auth: Credentials.config
});

export default {
    namespaced: true,

    state: {
        authorized: false,
        user: null,
        attributes: {}
    },

    actions: {
        async fetchUser({ commit, dispatch }) {
            return new Promise((resolve, reject) => {
                Auth.currentAuthenticatedUser()
                    .then(current => {
                        let { attributes } = current;
                        commit("attributes", attributes);
                        const expires =
                            current.getSignInUserSession().getIdToken().payload.exp -
                            Math.floor(new Date().getTime() / 1000);
                        console.log("Token expires in " + expires + " seconds");
                        setTimeout(async () => {
                            console.log("Renewing token");
                            await dispatch("fetchUser");
                        }, expires * 1000);
                        commit("user", current);
                        resolve(attributes);
                    })
                    .catch(err => {
                        commit("attributes", {});
                        commit("user", null);
                        reject(err);
                    });
            });
        },
        async updateUser({ commit, state }, data) {
            await Auth.updateUserAttributes(state.user, {
                "custom:Qualtrics-API-Key": data.apiToken,
                "custom:Data-Center": data.centerId
            });
            const user = await Auth.currentAuthenticatedUser();
            let { attributes } = user;
            commit("user", user);
            commit("attributes", attributes);
        },
        async logout({ commit }) {
            commit("user", null);
            await Auth.signOut();
        }
    },

    mutations: {
        user(state, user) {
            state.authorized =
                !!user &&
                user.attributes &&
                user.attributes.email_verified &&
                user.attributes["custom:Qualtrics-API-Key"] &&
                user.attributes["custom:Data-Center"];
            state.user = user;
        },
        attributes(state, attributes) {
            state.attributes = attributes;
        }
    }
};
