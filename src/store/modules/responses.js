import ResponsesAPI from '@/api/responses.js';

export default {
    namespaced: true,

    state: {
        responses: {},
        responsesLoadStatus: 0
    },

    actions: {
        // Loads responses for a specific survey
        loadResponses({commit}, data) {
            commit('setResponsesLoadStatus', 1);
            // Calls the API to load the responses
            ResponsesAPI.getResponses(data)
                    .then(response => {
                        console.log("Response call returned");
                    })
                    .catch(error => {
                        console.log(error);
                        commit('setResponsesLoadStatus', 3);
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
        }
    }
}