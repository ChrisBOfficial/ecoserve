import ResponsesAPI from "@/api/responses.js";

export default {
    namespaced: true,

    state: {
        responses: {},
        responsesLoadStatus: 0,

        hookLoadStatus: 0,

        dummy: {
            Species: [
                {
                    label: "Canada Thistle",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Leafy Spurge",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Musk Thistle",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Plumeless Thistle",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Sericea Lespedeza",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Spotted Diffuse Knapweed",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Russian Olive",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Scotch Thistle",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Eastern Redcedar",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                },
                {
                    label: "Smooth Brome",
                    services: [
                        "Wild Food",
                        "Forest Production",
                        "Pollination",
                        "Ecological Integrity",
                        "Biodiversity",
                        "Forage",
                        "Livestock",
                        "Water"
                    ],
                    impact: ["-40%", "+20%", "0%", "-20%", "+60%", "0%", "+80%", "-100%"],
                    confidence: ["high", "low", "medium", "high", "high", "low", "medium", "high"]
                }
            ]
        },
        dummy2: [
            {
                type: "Canada Thistle",
                values: [
                    { service: "Wild Food", mean: -2.5526315789473686 },
                    { service: "Forest Production", mean: 2.8461538461538462 },
                    { service: "Pollination", mean: -2.717948717948718 },
                    { service: "Ecological Integrity", mean: -1.4594594594594596 },
                    { service: "Biodiversity", mean: -2 },
                    { service: "Forage", mean: 1.6315789473684212 },
                    { service: "Livestock", mean: -1.5135135135135131 },
                    { service: "Water", mean: 1.4594594594594596 }
                ]
            },
            {
                type: "Leafy Spurge",
                values: [
                    { service: "Wild Food", mean: -5 },
                    { service: "Forest Production", mean: 2 },
                    { service: "Pollination", mean: -1 },
                    { service: "Ecological Integrity", mean: 2 },
                    { service: "Biodiversity", mean: -2 },
                    { service: "Forage", mean: 4 },
                    { service: "Livestock", mean: 5 },
                    { service: "Water", mean: -2 }
                ]
            },
            {
                type: "Musk Thistle",
                values: [
                    { service: "Wild Food", mean: -1.5526315789473686 },
                    { service: "Forest Production", mean: 3.8461538461538462 },
                    { service: "Pollination", mean: -3.717948717948718 },
                    { service: "Ecological Integrity", mean: -5.4594594594594596 },
                    { service: "Biodiversity", mean: -2.9 },
                    { service: "Forage", mean: 4.6315789473684212 },
                    { service: "Livestock", mean: 5.5135135135135131 },
                    { service: "Water", mean: -1.4594594594594596 }
                ]
            },
            {
                type: "Plumeless Thistle",
                values: [
                    { service: "Wild Food", mean: -4.5526315789473686 },
                    { service: "Forest Production", mean: 1.8461538461538462 },
                    { service: "Pollination", mean: -5.717948717948718 },
                    { service: "Ecological Integrity", mean: -4.4594594594594596 },
                    { service: "Biodiversity", mean: -1 },
                    { service: "Forage", mean: 3.6315789473684212 },
                    { service: "Livestock", mean: -5.5135135135135131 },
                    { service: "Water", mean: 4.4594594594594596 }
                ]
            },
            {
                type: "Sericea Lespedeza",
                values: [
                    { service: "Wild Food", mean: -3.5526315789473686 },
                    { service: "Forest Production", mean: -2.8461538461538462 },
                    { service: "Pollination", mean: 1.717948717948718 },
                    { service: "Ecological Integrity", mean: 1.4594594594594596 },
                    { service: "Biodiversity", mean: -1 },
                    { service: "Forage", mean: 2.6315789473684212 },
                    { service: "Livestock", mean: -3.5135135135135131 },
                    { service: "Water", mean: -4.4594594594594596 }
                ]
            },
            {
                type: "Spotted Diffuse Knapweed",
                values: [
                    { service: "Wild Food", mean: -5.5526315789473686 },
                    { service: "Forest Production", mean: 4.8461538461538462 },
                    { service: "Pollination", mean: -3.717948717948718 },
                    { service: "Ecological Integrity", mean: -2.4594594594594596 },
                    { service: "Biodiversity", mean: -1 },
                    { service: "Forage", mean: 2.6315789473684212 },
                    { service: "Livestock", mean: -3.5135135135135131 },
                    { service: "Water", mean: 4.4594594594594596 }
                ]
            },
            {
                type: "Russian Olive",
                values: [
                    { service: "Wild Food", mean: -5.5526315789473686 },
                    { service: "Forest Production", mean: -4.8461538461538462 },
                    { service: "Pollination", mean: -3.717948717948718 },
                    { service: "Ecological Integrity", mean: -2.4594594594594596 },
                    { service: "Biodiversity", mean: -1 },
                    { service: "Forage", mean: 2.6315789473684212 },
                    { service: "Livestock", mean: -3.5135135135135131 },
                    { service: "Water", mean: 4.4594594594594596 }
                ]
            },
            {
                type: "Scotch Thistle",
                values: [
                    { service: "Wild Food", mean: 5.5526315789473686 },
                    { service: "Forest Production", mean: -4.8461538461538462 },
                    { service: "Pollination", mean: -3.717948717948718 },
                    { service: "Ecological Integrity", mean: -2.4594594594594596 },
                    { service: "Biodiversity", mean: -1 },
                    { service: "Forage", mean: 1.6315789473684212 },
                    { service: "Livestock", mean: 2.5135135135135131 },
                    { service: "Water", mean: 3.4594594594594596 }
                ]
            },
            {
                type: "Eastern Redcedar",
                values: [
                    { service: "Wild Food", mean: 2.5526315789473686 },
                    { service: "Forest Production", mean: -2.8461538461538462 },
                    { service: "Pollination", mean: -5.717948717948718 },
                    { service: "Ecological Integrity", mean: 1.4594594594594596 },
                    { service: "Biodiversity", mean: -3 },
                    { service: "Forage", mean: -1.6315789473684212 },
                    { service: "Livestock", mean: 1.5135135135135131 },
                    { service: "Water", mean: -1.4594594594594596 }
                ]
            },
            {
                type: "Smooth Brome",
                values: [
                    { service: "Wild Food", mean: -5.5526315789473686 },
                    { service: "Forest Production", mean: 4.8461538461538462 },
                    { service: "Pollination", mean: -3.717948717948718 },
                    { service: "Ecological Integrity", mean: -1.4594594594594596 },
                    { service: "Biodiversity", mean: -5 },
                    { service: "Forage", mean: 3.6315789473684212 },
                    { service: "Livestock", mean: -2.5135135135135131 },
                    { service: "Water", mean: 2.4594594594594596 }
                ]
            }
        ],

        barchartAggregate: [],
        circleAggregate: [],
        labelAggregate: []
    },

    actions: {
        // Loads responses for a specific survey
        loadResponses({ commit }, data) {
            commit("setResponsesLoadStatus", 1);
            // Calls the API to load the responses
            ResponsesAPI.getResponses(data)
                .then(response => {
                    console.log(response.data);
                    commit("setResponses", response.data);
                    commit("setResponsesLoadStatus", 2);
                })
                .catch(error => {
                    console.log(error);
                    commit("setResponsesLoadStatus", 3);
                });
        },

        // Subscribes to survey updates for a given surveyId
        createHook({ commit }, data) {
            commit("setHookLoadStatus", 1);
            ResponsesAPI.registerHook(data)
                .then(response => {
                    if (response.data) {
                        console.log(response.data);
                    } else {
                        console.log(response);
                    }
                    commit("setHookLoadStatus", 2);
                })
                .catch(error => {
                    console.log(error);
                    commit("setHookLoadStatus", 3);
                });
        },

        // Get aggregated response data for a given visualization
        getAggregateData({ commit }, data) {
            ResponsesAPI.getAggregateResponses(data.id, data.pipeline)
                .then(response => {
                    console.log(response.data);
                    if (data.pipeline === "barchart") {
                        commit("setBarchartAggregate", response.data);
                    } else if (data.pipeline === "circlechart") {
                        commit("setCircleAggregate", response.data);
                    } else if (data.pipeline === "label") {
                        commit("setLabelAggregate", response.data);
                    }
                })
                .catch(error => {
                    console.log(error);
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
        },
        setBarchartAggregate(state, data) {
            state.barchartAggregate = data;
        },
        setCircleAggregate(state, data) {
            state.circleAggregate = data;
        },
        setLabelAggregate(state, data) {
            state.labelAggregate = data;
        }
    }
};
