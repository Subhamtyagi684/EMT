// // Load modules
// const PoolManager = require('mysql-connection-pool-manager');
// // Define mySQL settings

// const mySqlWMS = {
//   host: process.env.WMSDBURL,
//   user: process.env.DBUSER,
//   password: process.env.DBPASS,
//   database: process.env.WMSDBNAME,
//   port: '3306',
//   charset: 'utf8'
// };

// const poolManager = {
//   idleCheckInterval: 1000,
//   maxConnextionTimeout: 30000,
//   idlePoolTimeout: 3000,
//   errorLimit: 5,
//   preInitDelay: 50,
//   sessionTimeout: 60000,
//   mySQLSettings: mySqlWMS,
//   onConnectionAcquire: () => {
//     // console.log("Pool Aquired  WMS");
//   },
//   onConnectionConnect: () => {
//     // console.log("Connect");
//   },
//   onConnectionEnqueue: () => {
//     // console.log("Enqueue");
//   },
//   onConnectionRelease: () => {
//     // console.log("Release");
//   },
// }

// // Initialising the instance
// const WMSSQL = PoolManager(poolManager);


// async function wmsDbquery(queryString, callback) {
//   WMSSQL.query(queryString, function (results, error) {
//     if (error) {
//       callback(error, [])
//     } else {
//       callback(error, results)
//     };
//   });
// }


// module.exports = {
//   wmsDbquery: wmsDbquery,
//   WMSSQL: WMSSQL
// }