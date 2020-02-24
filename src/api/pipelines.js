// Barchart aggregation pipeline
const barchartPipeline = function(surveyId) {
    return [
        {
            $match: {
                surveyId: surveyId
            }
        },
        {
            $unwind: {
                path: "$responses"
            }
        },
        {
            $project: {
                totals: {
                    $objectToArray: "$responses.values"
                }
            }
        },
        {
            $unwind: {
                path: "$totals"
            }
        },
        {
            $group: {
                _id: {
                    QID: {
                        $arrayElemAt: [
                            {
                                $split: ["$totals.k", "#"]
                            },
                            0
                        ]
                    },
                    subquestion: {
                        $substr: [
                            "$totals.k",
                            {
                                $subtract: [
                                    {
                                        $strLenCP: "$totals.k"
                                    },
                                    1
                                ]
                            },
                            1
                        ]
                    },
                    type: {
                        $substr: [
                            "$totals.k",
                            {
                                $subtract: [
                                    {
                                        $strLenCP: "$totals.k"
                                    },
                                    3
                                ]
                            },
                            1
                        ]
                    }
                },
                mean: {
                    $avg: "$totals.v"
                },
                count: {
                    $sum: 1
                },
                sd: {
                    $stdDevPop: "$totals.v"
                }
            }
        },
        {
            $addFields: {
                se: {
                    $divide: [
                        "$sd",
                        {
                            $sqrt: "$count"
                        }
                    ]
                }
            }
        },
        {
            $project: {
                _id: "$_id.QID",
                subquestion: "$_id.subquestion",
                confidence: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $eq: ["$_id.type", "2"]
                                },
                                then: "$mean"
                            },
                            {
                                case: {
                                    $eq: ["$_id.type", "1"]
                                },
                                then: null
                            }
                        ],
                        default: null
                    }
                },
                mean: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $eq: ["$_id.type", "2"]
                                },
                                then: null
                            },
                            {
                                case: {
                                    $eq: ["$_id.type", "1"]
                                },
                                then: "$mean"
                            }
                        ],
                        default: "$mean"
                    }
                },
                se: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $eq: ["$_id.type", "2"]
                                },
                                then: null
                            },
                            {
                                case: {
                                    $eq: ["$_id.type", "1"]
                                },
                                then: "$se"
                            }
                        ],
                        default: "$se"
                    }
                },
                type: "$_id.type"
            }
        },
        {
            $group: {
                _id: {
                    QID: "$_id",
                    subquestion: "$subquestion"
                },
                confidence: {
                    $avg: "$confidence"
                },
                mean: {
                    $avg: "$mean"
                },
                se: {
                    $avg: "$se"
                }
            }
        },
        {
            $group: {
                _id: "$_id.QID",
                data: {
                    $push: {
                        subquestion: "$_id.subquestion",
                        confidence: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $lte: ["$confidence", 1]
                                        },
                                        then: "none"
                                    },
                                    {
                                        case: {
                                            $lte: ["$confidence", 2]
                                        },
                                        then: "low"
                                    },
                                    {
                                        case: {
                                            $lte: ["$confidence", 3]
                                        },
                                        then: "moderate"
                                    },
                                    {
                                        case: {
                                            $lte: ["$confidence", 4]
                                        },
                                        then: "high"
                                    },
                                    {
                                        case: {
                                            $lte: ["$confidence", 5]
                                        },
                                        then: "extreme"
                                    }
                                ],
                                default: "moderate"
                            }
                        },
                        mean: "$mean",
                        se: "$se"
                    }
                }
            }
        }
    ];
};

// Circlechart pipeline
const circlechartPipeline = function(data) {
    let stage1 = [];
    for (let response of data.responses) {
        let unwindObj = {
            surveyId: data.surveyId,
            choices: data.choices,
            responses: response
        };
        stage1.push(unwindObj);
    }

    let stage2 = [];
    for (let result of stage1) {
        let obj = {
            totals: []
        };
        for (let valName in result.responses.values) {
            if (/^Q/.test(valName) && !valName.includes("TEXT")) {
                let valObj = {
                    k: valName,
                    v: result.responses.values[valName]
                };
                obj.totals.push(valObj);
            }
        }
        stage2.push(obj);
    }

    let stage3 = [];
    for (let project of stage2) {
        for (let total of project.totals) {
            let obj = {
                descriptions: data.descriptions,
                totals: total
            };
            stage3.push(obj);
        }
    }

    let stage5 = [];
    for (let totalObj of stage3) {
        for (let desc of totalObj.descriptions) {
            let obj = {
                descriptions: desc,
                totals: totalObj.totals
            };
            stage5.push(obj);
        }
    }

    let stage6 = [];
    for (let totalObj of stage5) {
        if (totalObj.descriptions.subQuestion != null) {
            let obj = {
                descriptions: totalObj.descriptions,
                QID: totalObj.totals.k.split("#")[0],
                sub: totalObj.totals.k.split("_")[1],
                col: totalObj.totals.k.split("#")[1].split("_")[0],
                v: totalObj.totals.v,
                service: totalObj.descriptions.title.split("#")[0],
                question: totalObj.descriptions.question,
                subqmatch: totalObj.descriptions.subQuestion.split(".")[2],
                impactor: totalObj.descriptions.title.split("_")[1]
            };
            stage6.push(obj);
        }
    }

    let stage7 = [];
    for (let projObj of stage6) {
        delete projObj.descriptions;
        let questionCond = projObj.QID == projObj.question ? 1 : 0;
        let subquestionCond = projObj.sub == projObj.subqmatch ? 1 : 0;
        projObj.questioneq = questionCond;
        projObj.subquestioneq = subquestionCond;
    }
    stage7 = stage6;

    let stage8 = [];
    for (let condObj of stage7) {
        if (condObj.subquestioneq == 1 && condObj.questioneq == 1 && condObj.col == "1") {
            stage8.push(condObj);
        }
    }

    let stage9 = [];
    let comboSet = new Set();
    for (let impactorObj of stage8) {
        let combo = JSON.stringify({ service: impactorObj.service, impactor: impactorObj.impactor });
        comboSet.add(combo);
    }

    comboSet.forEach(combo => {
        let comboObj = JSON.parse(combo);
        let obj = { _id: comboObj };
        let sum = 0;
        let num = 0;
        for (let impactorObj of stage8) {
            if (impactorObj.service == comboObj.service && impactorObj.impactor == comboObj.impactor) {
                sum += parseInt(impactorObj.v);
                num++;
            }
        }
        obj.mean = sum / num;
        stage9.push(obj);
    });

    let stage10 = [];
    let impactSet = new Set();
    for (let serviceObj of stage9) {
        impactSet.add(serviceObj._id.impactor);
    }

    impactSet.forEach(val => {
        let obj = { type: val, values: [] };
        for (let serviceObj of stage9) {
            if (serviceObj._id.impactor == val) {
                let subObj = { service: serviceObj._id.service, mean: serviceObj.mean };
                obj.values.push(subObj);
            }
        }
        stage10.push(obj);
    });
    return stage10;
};

module.exports = {
    barchartPipeline,
    circlechartPipeline
};
