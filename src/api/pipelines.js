const barchartPipeline = function(surveyId) {
    return [{$match: {
            surveyId: surveyId
        }}, {$facet: {
            r: [
                {
                    $project: {
                        responses: 1
                    }
                },
                {
                    $unwind: '$responses'
                },{
                    $project: {
                        totals: {
                            $objectToArray: '$responses.values'
                        },
                        timestamp: {
                            $toDate: '$responses.values.endDate'
                        },
                        email: '$responses.values.email'
                    }
                }, {
                    $sort: {
                        email: 1,
                        timestamp: 1
                    }
                }, {
                    $group: {
                        _id: '$email',
                        timestamp: {
                            $last: '$timestamp'
                        },
                        totals: {
                            $max: '$totals'
                        }
                    }
                },
                {
                    $unwind: '$totals'
                },
                {
                    $match: {
                        $and: [
                            {
                                'totals.k': {
                                    $regex: RegExp('^Q')
                                }
                            },
                            {
                                'totals.v': {
                                    $type: 'number'
                                }
                            }
                        ]
                    }
                },
                {
                    $match: {
                        'totals.k': {
                            $regex: '_'
                        }
                    }
                },
                {
                    $addFields: {
                        QID: {
                            $arrayElemAt: [
                                {
                                    $split: [
                                        '$totals.k',
                                        '#'
                                    ]
                                },
                                0
                            ]
                        },
                        sub: {
                            $arrayElemAt: [
                                {
                                    $split: [
                                        '$totals.k',
                                        '_'
                                    ]
                                },
                                1
                            ]
                        },
                        col: {
                            $substr: [
                                {
                                    $arrayElemAt: [
                                        {
                                            $split: [
                                                '$totals.k',
                                                '#'
                                            ]
                                        },
                                        1
                                    ]
                                },
                                0,
                                1
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            QID: '$QID',
                            sub: '$sub',
                            col: '$col'
                        },
                        mean: {
                            $avg: '$totals.v'
                        },
                        count: {
                            $sum: 1
                        },
                        sd: {
                            $stdDevPop: '$totals.v'
                        }
                    }
                },
                {
                    $addFields: {
                        se: {
                            $divide: [
                                '$sd',
                                {
                                    $sqrt: '$count'
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        QID: '$_id.QID',
                        sub: '$_id.sub',
                        col: '$_id.col',
                        _id: 0,
                        confidence: {
                            $switch: {
                                branches: [
                                    {
                                        'case': {
                                            $eq: [
                                                '$_id.col',
                                                '2'
                                            ]
                                        },
                                        then: '$mean'
                                    },
                                    {
                                        'case': {
                                            $eq: [
                                                '$_id.col',
                                                '1'
                                            ]
                                        },
                                        then: null
                                    }
                                ],
                                'default': null
                            }
                        },
                        mean: {
                            $switch: {
                                branches: [
                                    {
                                        'case': {
                                            $eq: [
                                                '$_id.col',
                                                '2'
                                            ]
                                        },
                                        then: null
                                    },
                                    {
                                        'case': {
                                            $eq: [
                                                '$_id.col',
                                                '1'
                                            ]
                                        },
                                        then: '$mean'
                                    }
                                ],
                                'default': '$mean'
                            }
                        },
                        se: {
                            $switch: {
                                branches: [
                                    {
                                        'case': {
                                            $eq: [
                                                '$_id.col',
                                                '2'
                                            ]
                                        },
                                        then: null
                                    },
                                    {
                                        'case': {
                                            $eq: [
                                                '$_id.col',
                                                '1'
                                            ]
                                        },
                                        then: '$se'
                                    }
                                ],
                                'default': '$se'
                            }
                        }
                    }
                }
            ],
            d: [
                {
                    $project: {
                        descriptions: 1
                    }
                },
                {
                    $unwind: '$descriptions'
                },
                {
                    $match: {
                        'descriptions.title': {
                            $regex: '_'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        QID: '$descriptions.question',
                        sub: {
                            $arrayElemAt: [
                                {
                                    $split: [
                                        '$descriptions.subQuestion',
                                        '.'
                                    ]
                                },
                                2
                            ]
                        },
                        col: {
                            $arrayElemAt: [
                                {
                                    $split: [
                                        '$descriptions.column',
                                        '.'
                                    ]
                                },
                                2
                            ]
                        },
                        impactor: {
                            $arrayElemAt: [
                                {
                                    $split: [
                                        '$descriptions.title',
                                        '_'
                                    ]
                                },
                                1
                            ]
                        },
                        service: {
                            $arrayElemAt: [
                                {
                                    $split: [
                                        '$descriptions.title',
                                        '#'
                                    ]
                                },
                                0
                            ]
                        }
                    }
                }
            ],
            c: [
                {
                    $project: {
                        choices: 1
                    }
                },
                {
                    $unwind: '$choices'
                },
                {
                    $project: {
                        _id: 0,
                        question: '$choices.question',
                        choices: {
                            $objectToArray: '$choices.choices'
                        }
                    }
                },
                {
                    $group: {
                        _id: '$question',
                        values: {
                            $push: {
                                recode: '$choices.v.recode',
                                choiceText: '$choices.v.choiceText'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        QID: '$_id',
                        recode: {
                            $arrayElemAt: [
                                '$values.recode',
                                0
                            ]
                        },
                        choiceText: {
                            $arrayElemAt: [
                                '$values.choiceText',
                                0
                            ]
                        }
                    }
                },
                {$unwind: '$recode'},
                {$project: {
                        QID:1, choiceText:1,
                        recode: {$toInt: '$recode'}
                    }
                },
                {$group: {
                        _id: '$QID',
                        choiceText: {$max: '$choiceText'},
                        recode: {$push: {re: '$recode'}}
                    }},

                {
                    $project: {
                        QID: '$_id',
                        _id:0,
                        re: {
                            $max: '$recode.re'
                        },
                        impactText: {
                            $zip: {
                                inputs: [
                                    '$recode.re',
                                    '$choiceText'
                                ]
                            }
                        }
                    }
                }

            ]
        }}, {$project: {
            'final': {
                $concatArrays: [
                    '$r',
                    '$d'
                ]
            },
            c: 1
        }}, {$unwind: {
            path: '$final'
        }}, {$group: {
            _id: {
                QID: '$final.QID',
                sub: '$final.sub'
            },
            impactor: {
                $max: '$final.impactor'
            },
            service: {
                $max: '$final.service'
            },
            mean: {
                $max: '$final.mean'
            },
            confidence: {
                $max: '$final.confidence'
            },
            se: {
                $max: '$final.se'
            },
            c: {
                $max: '$c'
            }
        }}, {$group: {
            _id: '$_id.QID',
            c: {
                $max: '$c'
            },
            service: {
                $max: '$service'
            },
            group_mean: {
                $avg: '$mean'
            },
            data: {
                $push: {
                    subquestion: '$impactor',
                    confidence_num: '$confidence',
                    confidence: {
                        $switch: {
                            branches: [
                                {
                                    'case': {
                                        $gte: [
                                            '$confidence',
                                            3.0
                                        ]
                                    },
                                    then: 'Extreme'
                                },
                                {
                                    'case': {
                                        $gte: [
                                            '$confidence',
                                            1.0
                                        ]
                                    },
                                    then: 'High'
                                },
                                {
                                    'case': {
                                        $gte: [
                                            '$confidence',
                                            -1.0
                                        ]
                                    },
                                    then: 'Moderate'
                                },
                                {
                                    'case': {
                                        $gte: [
                                            '$confidence',
                                            -3.0
                                        ]
                                    },
                                    then: 'Low'
                                },
                                {
                                    'case': {
                                        $lt: [
                                            '$confidence',
                                            -3.0
                                        ]
                                    },
                                    then: 'None'
                                }
                            ],
                            'default': 'Moderate'
                        }
                    },
                    mean: '$mean',
                    se: '$se'
                }
            }
        }}];
};

const circlechartPipeline = function(surveyId) {
    return [
        {
            $match: {
                surveyId: surveyId
            }
        },
        {
            $facet: {
                r: [
                    { $project: { responses: 1 } },
                    { $unwind: "$responses" },
                    {
                        $project: {
                            totals: {
                                $objectToArray: "$responses.values"
                            }
                        }
                    },
                    { $unwind: "$totals" },
                    {
                        $match: {
                            $and: [{ "totals.k": { $regex: RegExp("^Q") } }, { "totals.v": { $type: "number" } }]
                        }
                    },
                    { $match: { "totals.k": { $regex: "1_" } } },
                    {
                        $addFields: {
                            QID: { $arrayElemAt: [{ $split: ["$totals.k", "#"] }, 0] },
                            sub: { $arrayElemAt: [{ $split: ["$totals.k", "_"] }, 1] }
                        }
                    },
                    {
                        $group: {
                            _id: { QID: "$QID", sub: "$sub", col: "$col" },
                            mean: { $avg: "$totals.v" }
                        }
                    },
                    { $project: { QID: "$_id.QID", sub: "$_id.sub", mean: 1, _id: 0 } }
                ],

                d: [
                    { $project: { descriptions: 1 } },
                    { $unwind: "$descriptions" },
                    { $match: { "descriptions.title": { $regex: "1_" } } },
                    {
                        $project: {
                            _id: 0,
                            QID: "$descriptions.question",
                            sub: { $arrayElemAt: [{ $split: ["$descriptions.subQuestion", "."] }, 2] },
                            impactor: { $arrayElemAt: [{ $split: ["$descriptions.title", "_"] }, 1] },
                            service: { $arrayElemAt: [{ $split: ["$descriptions.title", "#"] }, 0] }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                final: { $concatArrays: ["$r", "$d"] }
            }
        },
        {
            $unwind: {
                path: "$final"
            }
        },
        {
            $group: {
                _id: {
                    QID: "$final.QID",
                    sub: "$final.sub"
                },
                impactor: { $max: "$final.impactor" },
                service: { $max: "$final.service" },
                mean: { $max: "$final.mean" }
            }
        },
        {
            $group: {
                _id: "$_id.sub",
                type: { $max: "$impactor" },
                values: {
                    $push: {
                        service: "$service",
                        mean: "$mean"
                    }
                }
            }
        }
    ];
};

module.exports = {
    barchartPipeline,
    circlechartPipeline
};
