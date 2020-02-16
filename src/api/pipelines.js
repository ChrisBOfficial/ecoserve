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
const circlechartPipeline = function(surveyId) {
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
                }
            }
        },
        {
            $match: {
                "_id.QID": {
                    $regex: new RegExp("^Q")
                }
            }
        },
        {
            $match: {
                "_id.type": {
                    $eq: "1"
                }
            }
        },
        {
            $project: {
                _id: "$_id.subquestion",
                QID: "$_id.QID",
                mean: "$mean"
            }
        },
        {
            $sort: {
                QID: 1
            }
        },
        {
            $group: {
                _id: {
                    type: "$_id"
                },
                values: {
                    $push: {
                        service: "$QID",
                        mean: {
                            $subtract: ["$mean", 6]
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                type: "$_id.type",
                values: 1
            }
        }
    ];
};

module.exports = {
    barchartPipeline,
    circlechartPipeline
};
