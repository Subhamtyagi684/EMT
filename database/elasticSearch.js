const { Client } = require('@elastic/elasticsearch')
const fs = require("fs");


const { createAWSConnection, awsGetCredentials } = require('@acuris/aws-es-connection')
const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const distributorIndex = "distributor_table"
const accessKeyId = process.env.AWSELASTICACCESSKEY;
const secretAccessKey = process.env.AWSELASTICSECRETKEY;

AWS.config.update({
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey),
    region: process.env.AWSELASTICREGION
});



const config = {
    node: process.env.ELASTICURL,
    headers: {
        "Accept": "application/vnd.elasticsearch+json;compatible-with=7",
        "Content-Type": "application/vnd.elasticsearch+json;compatible-with=7"
    },
    auth: {
        username: process.env.ELASTICUSER,
        password: process.env.ELASTICPASSWORD,
    },
    tls: {
        // ca: fs.readFileSync('./http_ca.crt'),
        // rejectUnauthorized: false
    },
}

function startESConnection(response) {
    return new Promise(async (resolve, reject) => {
        // FOR Local Server Connection

        // const elasticClient = new Client({
        //     ...config,
        //     requestTimeout: 300000

        // });


        // For AWS Cloud connection use 

        const awsCredentials = await awsGetCredentials(accessKeyId, secretAccessKey);
        const AWSConnection = await createAWSConnection(awsCredentials)
        const elasticClient = new Client({
            ...AWSConnection,
            requestTimeout: 300000,
            node: process.env.AWSELASTICURL
        })

        elasticClient.ping().then(resppp => {
            // console.log(resppp);
            if (true) {
                resolve(elasticClient);
            }
        }).catch(errrrr => {
            // console.log(errrrr);
            response.send(errrrr)
        })
    })
}


function closeESConnection(client) {
    return new Promise(async (resolve, reject) => {
        client.close().then(resppp => {
            resolve(resppp);
        }).catch(errrrr => {
            resolve(errrrr);
        })
    })
}


module.exports = {
    startESConnection,
    closeESConnection,

    ping: function (req, res) {
        startESConnection(res).then(client => {
            closeESConnection(client).then(connClsoe => {
                res.send("connection Closed")
            })
        });
    },


    // Generic To Add Single Document in any Index in Elastic 

    addDocument: function (indexName, _id, payload) {

        return new Promise(async (resolve, reject) => {

            startESConnection().then(client => {

                client.index({
                    index: indexName,
                    id: _id,
                    body: payload
                }).then(function (resp) {

                    closeESConnection(client).then(connClsoe => {
                        resolve(resp)
                    })

                }, function (err) {

                    closeESConnection(client).then(connClsoe => {
                        reject(err.message)
                    })

                });

            });

        })

    },



    // Generic to Update Single Document in any Index Elastic

    updateDocument: function (req, res, index, _id, payload) {
        elasticClient.update({
            index: index,
            id: _id,
            body: payload
        }, function (err, resp) {
            if (err) return res.json(err);
            return res.json(resp);
        })
    },

    // Generic Search From Elastic 

    returnSearchResult: function (req, res, indexName, payload) {
        return new Promise(async (resolve, reject) => {
            startESConnection(res).then(client => {
                // console.log(JSON.stringify(payload));
                client.search({
                    index: indexName,
                    body: payload
                }).then(function (resp) {
                    closeESConnection(client).then(connClsoe => {
                        resolve(resp.body)
                    })
                }, function (err) {
                    closeESConnection(client).then(connClsoe => {
                        reject((err.message, err))
                    })
                });


            });

        })
    },



    returnUpdateByIDResult: function (res, indexName, updateObj) {
        return new Promise(async (resolve, reject) => {
            startESConnection(res).then(client => {
                client.update({
                    index: indexName,
                    id: updateObj.id,
                    body: {
                        doc: {
                            otpCode: updateObj.otpCode,
                            otpReceivedDate: new Date().toISOString()
                        }
                    }
                }).then(function (resp) {
                    closeESConnection(client).then(connClsoe => {
                        resolve(resp.body)
                    })
                }, function (err) {
                    console.log(err);
                    closeESConnection(client).then(connClsoe => {
                        reject((err.message, err))
                    })
                });


            });

        })
    },


    returnUpdateOtpHistoryResult: function (res, indexName, updateObj) {
        return new Promise(async (resolve, reject) => {
            startESConnection(res).then(client => {
                client.update({
                    index: indexName,
                    id: updateObj.id,
                    body: {
                        doc: {
                            isOpted: updateObj.isOpted
                        }
                    }
                }).then(function (resp) {
                    closeESConnection(client).then(connClsoe => {
                        resolve(resp.body)
                    })
                }, function (err) {
                    console.log(err);
                    closeESConnection(client).then(connClsoe => {
                        reject((err.message, err))
                    })
                });


            });

        })
    },



    // Delete All Distributot Form Elastic

    deleteDistributorES: function (index, req, res) {
        try {
            startESConnection(res).then(elasticClient => {
                elasticClient.indices.delete({
                    index: index,
                }, function (err, resp) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('distributor_table Indexes have been deleted!', resp);
                        return res.json(resp)
                    }

                }).then(
                    respprrp => {
                        // console.log("respprrp", respprrp);
                        closeESConnection(elasticClient);
                        return res.json(respprrp)
                    }
                ).catch(err => {
                    console.log("errrrrrrrrrrrrrrrrrr", err);
                    closeESConnection(elasticClient);
                })
            })

        } catch (error) {
            console.log("catch errrrrrrr", error);
            return res.json(error)
        }

    },


    // Get Mapping of fields of index

    getMappingDocument: function (res, index) {
        try {
            startESConnection(res).then(elasticClient => {
                console.log("heeer");
                elasticClient.indices.getMapping({
                    index: index,
                }).then(
                    respprrp => {
                        console.log("respprrp", respprrp);
                        closeESConnection(elasticClient);
                        return res.json(respprrp)
                    }
                ).catch(err => {
                    console.log("errrrrrrrrrrrrrrrrrr", err);
                    closeESConnection(elasticClient);
                })
            })

        } catch (error) {
            console.log("catch errrrrrrr", error);
            return res.json(error)
        }

    },


    updateMappingDocument: function (res, index, payload) {
        try {
            startESConnection(res).then(elasticClient => {
                console.log("heeer update mapping");
                elasticClient.indices.putMapping({
                    index: index,
                    body: payload
                }).then(
                    respprrp => {
                        console.log("mapping updated respprrp", respprrp);
                        closeESConnection(elasticClient);
                        return res.json(respprrp)
                    }
                ).catch(err => {
                    console.log("errrrrrrrrrrrrrrrrrr", err);
                    closeESConnection(elasticClient);
                    return res.status(400).json(err)
                })
            })

        } catch (error) {
            console.log("catch errrrrrrr", error);
            return res.json(error)
        }

    },

    updateAllDataDocument: function (res, index) {
        try {
            var theScript = {
                "inline": "ctx._source.otpCode = null ; ctx._source.otpReceivedDate = null;"
            }

            startESConnection(res).then(elasticClient => {
                console.log("heeer update mapping");
                elasticClient.updateByQuery({
                    index: index,
                    body: {
                        "script": theScript
                    }
                }).then(
                    respprrp => {
                        console.log("mapping updated respprrp", respprrp);
                        closeESConnection(elasticClient);
                        return res.json(respprrp)
                    }
                ).catch(err => {
                    console.log("errrrrrrrrrrrrrrrrrr", err);
                    closeESConnection(elasticClient);
                    return res.status(400).json(err)
                })
            })

        } catch (error) {
            console.log("catch errrrrrrr", error);
            return res.json(error)
        }

    },


    // Distributor Address Update 

    updateAddressByID: function (indexName, id, updateObj) {
        return new Promise(async (resolve, reject) => {
            startESConnection().then(client => {
                client.update({
                    index: indexName,
                    id: id,
                    body: {
                        doc: updateObj
                    }
                }).then(function (resp) {
                    closeESConnection(client).then(connClsoe => {
                        resolve(resp.body)
                    })
                }, function (err) {
                    console.log(err);
                    closeESConnection(client).then(connClsoe => {
                        reject((err.message, err))
                    })
                });


            });

        })
    },

    setAllPreviousAddressAsNonDefault: function (res, index, id) {
        try {
            startESConnection(res).then(elasticClient => {

                elasticClient.updateByQuery({
                    index: index,
                    refresh: true,
                    body: {
                        query: {
                            term: { distributor_id: id }
                        },
                        script: {
                            lang: 'painless',
                            source: 'ctx._source.is_default = false',
                        }
                    }
                }).then(
                    respprrp => {
                        // console.log("is default updated respprrp", respprrp);
                        closeESConnection(elasticClient);
                        return;
                    }
                ).catch(err => {
                    console.log("errrrrrrrrrrrrrrrrrr", err);
                    closeESConnection(elasticClient);
                    // return;
                    return res.status(400).json(err)
                })
            })

        } catch (error) {
            console.log("catch errrrrrrr", error);
            return res.json(error)
        }

    },


    markDefault: function (res, index, id) {

            return new Promise(async (resolve, reject) => {

            startESConnection(res).then(elasticClient => {
                elasticClient.updateByQuery({
                    index: index,
                    refresh: true,
                    body: {
                        query: {
                            term: { distributor_id: id }
                        },
                        script: {
                            lang: 'painless',
                            source: 'ctx._source.is_default = false',
                        }
                    }
                }).then(
                    respprrp => {
                        // console.log("is default updated respprrp", respprrp);
                        closeESConnection(elasticClient).then(connClsoe => {
                            resolve(respprrp.body)
                        })
                    },err =>{
                        console.log(err);
                        closeESConnection(elasticClient).then(connClsoe => {
                            reject((err.message, err))
                        })
                    }
                ).catch(err => {
                    console.log(err);
                    closeESConnection(elasticClient).then(connClsoe => {
                        reject((err.message, err))
                    })
                })
            })

        })

    },

};