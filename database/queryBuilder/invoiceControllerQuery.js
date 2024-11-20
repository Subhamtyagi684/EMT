

const wmsconnection = require('../wmsdb')
const commonconnection = require('../commondb')

module.exports = {
  fetchCountryData: fetchCountryData,
  fetchStateData: fetchStateData
}


function createDataResponseObject(error, results) {

  return {
    error: error,
    results: results === undefined ? null : results === null ? null : results
  }
}


function fetchCountryData(countryCode, callBack) {
  const registerUserQuery = `SELECT invoicetext,prefixcncvouchervalue,countryisocode as code,
    countryisocode as countrycode FROM countrydata where countryisocode='${countryCode}';`
  // console.log(registerUserQuery);

  commonconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });

}



function fetchStateData(stateGstCode, callBack) {
  const registerUserQuery = `SELECT s.gststatecode,s.gststateid,s.statename as descr,s.id as statecode,
    s.gstin,s.id as code,s.signatoryname,s.signimagepath,s.signimage,s.registeredlocation,
    s.designation FROM statemst s  WHERE  s.gststateid= '${stateGstCode}' ORDER BY s.statename;`
  // console.log(registerUserQuery);

  commonconnection.query(registerUserQuery, function (err, results, fields) {
    if (!err) {
      callBack(createDataResponseObject(err, results))
    } else {
      callBack(createDataResponseObject(err, []))
    }
  });
}