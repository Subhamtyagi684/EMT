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

    ssl: {
        ca: fs.readFileSync('./database/http_ca.crt'),
        rejectUnauthorized: true
    },
}

function startESConnection(response) {
    return new Promise(async (resolve, reject) => {
        // FOR Local Server Connection

        const elasticClient = new Client({
            ...config,
            requestTimeout: 300000
        });


        elasticClient.ping().then(resppp => {
            // console.log(resppp);
            if (true) {
                resolve(elasticClient);
            }
        }).catch(errrrr => {
            // console.log(errrrr);
            response.send(errrrr)
        });

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

    // Check Connection Status
    
    ping: function (req, res) {
        startESConnection(res).then(client => {
            console.log("conn there" , client);
            closeESConnection(client).then(connClsoe => {
                res.send("connection Closed")
            })
        });
    },


    // Insert Single Document in any Index in Elastic 

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



    // Search From Elastic 

    returnSearchResult: function (req, res, indexName, payload) {
        return new Promise(async (resolve, reject) => {
            startESConnection(res).then(client => {

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


    // Delete Index Form Elastic

    deleteIndexES: function (index, req, res) {
        try {
            startESConnection(res).then(elasticClient => {
                elasticClient.indices.delete({
                    index: index,
                }, function (err, resp) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log( index + ' have been deleted!', resp);
                        return res.json(resp)
                    }

                }).then(
                    respprrp => {
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


    // Update Data 

    updateData: function (indexName, id, updateObj) {
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


};