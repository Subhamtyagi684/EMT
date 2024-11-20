// const mssqlcon = require('mssql');
// let connection = null

// function initSsqlConnection() {
//   // console.log("CONINIT");
//   var config = {
//     user: process.env.SSQLDBUSER,
//     password: process.env.SSQLDBPASS,
//     server: process.env.SSQLDBURL,
//     port: Number(process.env.SSQLPORT),
//     database: process.env.SSQLDBNAME,
//     options: {
//       encrypt: true,
//       trustServerCertificate: true,
//       port: Number(process.env.SSQLPORT)
//     },
//     pool: {
//       max: 30,
//       min: 0,
//       idleTimeoutMillis: 600000
//     },
//     requestTimeout: 300000
//   };

//   // console.log(config);
//   connection = new mssqlcon.ConnectionPool(config)
// }


// function ssqlquery(queryString, callback) {
//   initSsqlConnection();
//   connection.connect(function (err, conn) {
//     // console.log("conn");
//     if (err) {
//       console.log("DB Conn Error", err);
//       callback(ssqlcreateDataResponseObject(err, []))
//     } else {
//       conn.query(queryString, function (error, results, fields) {
//         if (process.env.IsDebugg == "true") {
//           console.log('mySql: query: error is: ', error, ' and results are: ', results);
//         }
//         connection.close();
//         callback(ssqlcreateDataResponseObject(error, results))
//       })
//     }
//   })
// }

// function ssqlcreateDataResponseObject(error, results) {

//   return {
//     error: error,
//     results: results === undefined ? null : results === null ? null : results
//   }
// }

// module.exports = {
//   ssqlquery: ssqlquery
// }