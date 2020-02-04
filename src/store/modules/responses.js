import ResponsesAPI from '@/api/responses.js';

export default {
    namespaced: true,

    state: {
        responses: {},
        responsesLoadStatus: 0,

        hookLoadStatus: 0
    },

    actions: {
        // Loads responses for a specific survey
        loadResponses({commit}, data) {
            commit('setResponsesLoadStatus', 1);
            // Calls the API to load the responses
            ResponsesAPI.getResponses(data)
                    .then(response => {
                        console.log(response.data);
                        commit('setResponses', response.data);
                        commit('setResponsesLoadStatus', 2);
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setResponsesLoadStatus', 3);
                    });
        },

        // Subscribes to survey updates for a given surveyId
        createHook({commit}, data) {
            commit('setHookLoadStatus', 1);
            ResponsesAPI.registerHook(data)
                    .then((response) => {
                        if (response.data) {
                            console.log(response.data);    
                        } else {
                            console.log(response);
                        }
                        commit('setHookLoadStatus', 2);
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setHookLoadStatus', 3);
                    });
        }
    },

    mutations: {
        // Sets the responses in the state
        setResponses(state, responses) {
            state.responses = responses;
        },
        // Sets the responses load status
        setResponsesLoadStatus(state, status) {
            state.responsesLoadStatus = status;
        },
        setHookLoadStatus(state, status) {
            state.hookLoadStatus = status;
        }
    }
}